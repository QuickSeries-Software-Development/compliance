#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'evidence', '_registry.yml');

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  let source = null;
  let date = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      source = args[++i];
    } else if (args[i] === '--date' && args[i + 1]) {
      date = args[++i];
    }
  }

  if (!source || !date) {
    console.error('Usage: update-evidence-registry --source <source> --date <YYYY-MM-DD>');
    process.exit(1);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`Invalid date format: "${date}". Expected YYYY-MM-DD.`);
    process.exit(1);
  }

  return { source, date };
}

// ---------------------------------------------------------------------------
// Frequency to days mapping
// ---------------------------------------------------------------------------

const FREQUENCY_DAYS = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  annually: 365,
  'on-demand': 0,
};

function computeNextDue(date, frequency) {
  const days = FREQUENCY_DAYS[frequency];
  if (!days) return null;

  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + days);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const { source, date } = parseArgs();

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error(`Registry file not found: ${REGISTRY_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const registry = yaml.load(raw);

  if (!registry || !Array.isArray(registry.evidence)) {
    console.error('Invalid registry format: expected top-level "evidence" array.');
    process.exit(1);
  }

  let updated = 0;

  for (const entry of registry.evidence) {
    if (entry.source !== source) continue;

    const basename = path.basename(entry.path);
    entry.path = `evidence/automated/${source}/${date}/${basename}`;
    entry.last_collected = date;
    entry.next_due = computeNextDue(date, entry.frequency);
    entry.status = 'current';
    updated++;

    console.log(`  Updated ${entry.id}: ${entry.title}`);
    console.log(`    path: ${entry.path}`);
    console.log(`    last_collected: ${entry.last_collected}`);
    console.log(`    next_due: ${entry.next_due}`);
  }

  if (updated === 0) {
    console.log(`No entries found for source "${source}".`);
    return;
  }

  const output = yaml.dump(registry, {
    lineWidth: -1,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  });

  fs.writeFileSync(REGISTRY_PATH, output);
  console.log(`\nUpdated ${updated} entries in evidence/_registry.yml`);
}

main();
