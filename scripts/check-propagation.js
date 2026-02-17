#!/usr/bin/env node

// ---------------------------------------------------------------------------
// check-propagation.js
//
// Checks if downstream documents need review when upstream files change.
// Reads .computed/graph.json for triggers_update_to edges, compares against
// changed files, and appends pending reviews to .computed/pending-reviews.json.
//
// Warns but NEVER blocks — always exits with code 0.
//
// Usage:
//   node scripts/check-propagation.js              # uses git staged files
//   node scripts/check-propagation.js file1 file2  # explicit file paths
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const COMPUTED_DIR = path.join(ROOT, '.computed');
const GRAPH_PATH = path.join(COMPUTED_DIR, 'graph.json');
const PENDING_PATH = path.join(COMPUTED_DIR, 'pending-reviews.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadJSON(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function writeJSON(filepath, data) {
  // Ensure .computed/ directory exists
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// Get changed files
// ---------------------------------------------------------------------------

function getChangedFiles() {
  // If file paths are passed as arguments, use those
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return new Set(args.map((f) => path.relative(ROOT, path.resolve(ROOT, f))));
  }

  // Otherwise, get staged files from git
  try {
    const output = execSync('git diff --cached --name-only', {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return new Set(output.trim().split('\n').filter(Boolean));
  } catch {
    // If git fails (e.g. not in a repo), return empty set
    return new Set();
  }
}

// ---------------------------------------------------------------------------
// Build a lookup of triggers_update_to from the graph
// ---------------------------------------------------------------------------

function buildTriggerMap(graph) {
  const triggerMap = new Map(); // file -> [downstream files]

  // Method 1: Read from edges array
  if (graph.edges && Array.isArray(graph.edges)) {
    for (const edge of graph.edges) {
      if (edge.type === 'triggers_update') {
        const existing = triggerMap.get(edge.from) || [];
        existing.push(edge.to);
        triggerMap.set(edge.from, existing);
      }
    }
  }

  // Method 2: Also read from nodes' triggers_update_to arrays (belt and suspenders)
  if (graph.nodes) {
    for (const [filePath, node] of Object.entries(graph.nodes)) {
      if (node.triggers_update_to && Array.isArray(node.triggers_update_to)) {
        const existing = triggerMap.get(filePath) || [];
        for (const target of node.triggers_update_to) {
          if (!existing.includes(target)) {
            existing.push(target);
          }
        }
        triggerMap.set(filePath, existing);
      }
    }
  }

  return triggerMap;
}

// ---------------------------------------------------------------------------
// Merge new pending items with existing ones (deduplicate by file+triggered_by)
// ---------------------------------------------------------------------------

function mergePendingReviews(existing, newItems) {
  const seen = new Set();
  const merged = [];

  // Add new items first (they have fresher timestamps)
  for (const item of newItems) {
    const key = `${item.file}|${item.triggered_by}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  // Then add existing items that aren't duplicated
  for (const item of existing) {
    const key = `${item.file}|${item.triggered_by}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Remove resolved reviews (downstream file was changed in this commit)
// ---------------------------------------------------------------------------

function removeResolvedReviews(pending, changedFiles) {
  return pending.filter((item) => !changedFiles.has(item.file));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Check if graph exists
  if (!fs.existsSync(GRAPH_PATH)) {
    console.log('check-propagation: .computed/graph.json not found (graph not built yet). Skipping.');
    process.exit(0);
  }

  const graph = loadJSON(GRAPH_PATH);
  if (!graph) {
    console.log('check-propagation: Could not parse .computed/graph.json. Skipping.');
    process.exit(0);
  }

  const changedFiles = getChangedFiles();
  if (changedFiles.size === 0) {
    // No changed files — nothing to check
    process.exit(0);
  }

  const triggerMap = buildTriggerMap(graph);
  const now = new Date().toISOString();

  // Find downstream files that need review
  const newPending = [];
  const warnings = [];

  for (const changedFile of changedFiles) {
    const downstreamFiles = triggerMap.get(changedFile);
    if (!downstreamFiles || downstreamFiles.length === 0) {
      continue;
    }

    for (const downstream of downstreamFiles) {
      if (!changedFiles.has(downstream)) {
        newPending.push({
          file: downstream,
          triggered_by: changedFile,
          triggered_at: now,
          reason: 'Upstream document was modified',
        });
        warnings.push({ changed: changedFile, needs_review: downstream });
      }
    }
  }

  // Load existing pending reviews
  const existingData = loadJSON(PENDING_PATH) || { last_updated: now, pending: [] };
  const existingPending = existingData.pending || [];

  // Remove resolved reviews (files that were changed in this commit)
  const afterResolved = removeResolvedReviews(existingPending, changedFiles);

  // Merge new pending items with remaining existing ones
  const mergedPending = mergePendingReviews(afterResolved, newPending);

  // Write updated pending reviews
  const pendingData = {
    last_updated: now,
    pending: mergedPending,
  };
  writeJSON(PENDING_PATH, pendingData);

  // Output
  if (warnings.length > 0) {
    console.log('');
    console.log('=== Change Propagation Warnings ===');
    console.log('');
    console.log('The following downstream documents may need review:');
    console.log('');

    for (const w of warnings) {
      console.log(`  ${w.needs_review}`);
      console.log(`    triggered by: ${w.changed}`);
      console.log('');
    }

    console.log(`${warnings.length} document(s) flagged for review.`);
    console.log(`Pending reviews saved to .computed/pending-reviews.json`);
    console.log('');
  }

  // Count resolved reviews
  const resolvedCount = existingPending.length - afterResolved.length;
  if (resolvedCount > 0) {
    console.log(`${resolvedCount} previously pending review(s) resolved (files were updated in this commit).`);
    console.log('');
  }

  // Always exit 0 — this script warns but never blocks
  process.exit(0);
}

main();
