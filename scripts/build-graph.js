#!/usr/bin/env node

/**
 * build-graph.js — Core relationship graph builder for the compliance management system.
 *
 * Parses all structured files (policies, procedures, risks, controls, incidents,
 * evidence, program docs), builds a relationship graph, and writes computed
 * output files to .computed/.
 *
 * Output files:
 *   .computed/graph.json            — Full node/edge graph with indexes
 *   .computed/dashboard-stats.json  — Aggregated counts per framework
 *   .computed/stale-report.json     — Items past their review date
 *   .computed/soa.json              — Statement of Applicability (ISO 27001)
 *   .computed/framework-coverage.json — Per-framework coverage metrics
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const matter = require('gray-matter');
const yaml = require('js-yaml');

const ROOT = process.cwd();
const COMPUTED_DIR = path.join(ROOT, '.computed');
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read and parse a YAML file. Returns null on failure. */
function readYaml(absPath) {
  try {
    const content = fs.readFileSync(absPath, 'utf8');
    return yaml.load(content);
  } catch {
    return null;
  }
}

/** Read and parse a Markdown file with YAML frontmatter. Returns null on failure. */
function readMarkdown(absPath) {
  try {
    const content = fs.readFileSync(absPath, 'utf8');
    const { data } = matter(content);
    return data;
  } catch {
    return null;
  }
}

/** Safe glob that returns [] if the directory doesn't exist. */
function safeGlob(pattern) {
  try {
    return globSync(pattern, { cwd: ROOT });
  } catch {
    return [];
  }
}

/** Convert a control ID like "A.5.15" to its file path: "frameworks/iso27001/controls/A.5.15.yml" */
function controlIdToPath(controlId, framework) {
  const dirMap = {
    iso27001: 'controls',
    soc2: 'criteria',
    gdpr: 'articles',
  };
  const subdir = dirMap[framework] || 'controls';
  return `frameworks/${framework}/${subdir}/${controlId}.yml`;
}

/** Count days between two YYYY-MM-DD date strings. Positive = overdue. */
function daysOverdue(dateStr) {
  const reviewDate = new Date(dateStr + 'T00:00:00');
  const today = new Date(TODAY + 'T00:00:00');
  return Math.floor((today - reviewDate) / (1000 * 60 * 60 * 24));
}

/** Ensure a key exists in an object as an array, then push a value if not already present. */
function pushUnique(obj, key, value) {
  if (!obj[key]) obj[key] = [];
  if (!obj[key].includes(value)) obj[key].push(value);
}

// ---------------------------------------------------------------------------
// 1. Parse all files into nodes
// ---------------------------------------------------------------------------

const nodes = {};
const edges = [];

// -- Policies --
for (const relPath of safeGlob('policies/*.md')) {
  const data = readMarkdown(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'policy',
    id: data.id,
    title: data.title,
    owner: data.owner,
    status: data.status,
    version: data.version,
    approved_date: data.approved_date,
    next_review: data.next_review,
    frameworks: data.frameworks || {},
    triggers_update_to: data.triggers_update_to || [],
    triggered_by: data.triggered_by || [],
  };
}

// -- Procedures --
for (const relPath of safeGlob('procedures/*.md')) {
  const data = readMarkdown(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'procedure',
    id: data.id,
    title: data.title,
    owner: data.owner,
    status: data.status,
    version: data.version,
    approved_date: data.approved_date,
    next_review: data.next_review,
    frameworks: data.frameworks || {},
    triggers_update_to: data.triggers_update_to || [],
    triggered_by: data.triggered_by || [],
  };
}

// -- Risks --
for (const relPath of safeGlob('risks/*.yml')) {
  const data = readYaml(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'risk',
    id: data.id,
    title: data.title,
    asset: data.asset,
    threat: data.threat,
    vulnerability: data.vulnerability,
    likelihood: data.likelihood,
    impact: data.impact,
    inherent_risk: data.inherent_risk,
    treatment: data.treatment,
    frameworks: data.frameworks || {},
    required_controls: data.required_controls || [],
    residual_likelihood: data.residual_likelihood,
    residual_impact: data.residual_impact,
    residual_risk: data.residual_risk,
    owner: data.owner,
    status: data.status,
    review_date: data.review_date,
  };
}

// -- ISO 27001 Controls --
for (const relPath of safeGlob('frameworks/iso27001/controls/*.yml')) {
  const data = readYaml(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'control',
    id: data.id,
    title: data.title,
    category: data.category,
    theme: data.theme,
    applicable: data.applicable,
    justification: data.justification,
    implementation_status: data.implementation_status,
    notes: data.notes,
    framework: 'iso27001',
  };
}

// -- SOC 2 Criteria (future) --
for (const relPath of safeGlob('frameworks/soc2/criteria/*.yml')) {
  const data = readYaml(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'criterion',
    id: data.id,
    title: data.title,
    category: data.category,
    applicable: data.applicable,
    implementation_status: data.implementation_status,
    framework: 'soc2',
  };
}

// -- GDPR Articles (future) --
for (const relPath of safeGlob('frameworks/gdpr/articles/*.yml')) {
  const data = readYaml(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'article',
    id: data.id,
    title: data.title,
    applicable: data.applicable,
    implementation_status: data.implementation_status,
    framework: 'gdpr',
  };
}

// -- Incidents --
for (const relPath of safeGlob('incidents/*.yml')) {
  const data = readYaml(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'incident',
    id: data.id,
    title: data.title,
    date_reported: data.date_reported,
    severity: data.severity,
    status: data.status,
    system: data.system,
    incident_type: data.type,
    frameworks: data.frameworks || {},
    person_responsible: data.person_responsible,
  };
}

// -- Evidence Registry --
const evidenceRegistryPath = path.join(ROOT, 'evidence', '_registry.yml');
const evidenceItems = [];
if (fs.existsSync(evidenceRegistryPath)) {
  const registryData = readYaml(evidenceRegistryPath);
  if (registryData && Array.isArray(registryData.evidence)) {
    for (const item of registryData.evidence) {
      const nodeKey = `evidence/${item.id}`;
      nodes[nodeKey] = {
        type: 'evidence',
        id: item.id,
        title: item.title,
        frameworks: item.frameworks || {},
        source: item.source,
        collection: item.collection,
        frequency: item.frequency,
        last_collected: item.last_collected,
        next_due: item.next_due,
        path: item.path,
        status: item.status,
      };
      evidenceItems.push(item);
    }
  }
}

// -- Program Documents --
for (const relPath of safeGlob('program/*.md')) {
  const data = readMarkdown(path.join(ROOT, relPath));
  if (!data) continue;
  nodes[relPath] = {
    type: 'program',
    id: data.id,
    title: data.title,
    owner: data.owner,
    status: data.status,
    version: data.version,
    approved_date: data.approved_date,
    next_review: data.next_review,
    frameworks: data.frameworks || {},
    triggers_update_to: data.triggers_update_to || [],
    triggered_by: data.triggered_by || [],
  };
}

// ---------------------------------------------------------------------------
// 2. Build edges
// ---------------------------------------------------------------------------

// Map of framework name → field name in frontmatter (controls, criteria, articles)
const frameworkFieldMap = {
  iso27001: 'controls',
  soc2: 'criteria',
  gdpr: 'articles',
};

for (const [filePath, node] of Object.entries(nodes)) {
  const { type, frameworks } = node;

  // Skip nodes that don't have a frameworks field (controls themselves, etc.)
  if (frameworks && typeof frameworks === 'object') {
    for (const [fwName, fwData] of Object.entries(frameworks)) {
      const fieldName = frameworkFieldMap[fwName];
      if (!fieldName || !fwData || !Array.isArray(fwData[fieldName])) continue;

      for (const controlId of fwData[fieldName]) {
        const controlPath = controlIdToPath(controlId, fwName);

        if (type === 'policy' || type === 'procedure' || type === 'program') {
          edges.push({ from: filePath, to: controlPath, type: 'implements' });
        } else if (type === 'risk') {
          edges.push({ from: filePath, to: controlPath, type: 'mitigated_by' });
        } else if (type === 'evidence') {
          edges.push({ from: filePath, to: controlPath, type: 'evidences' });
        } else if (type === 'incident') {
          edges.push({ from: filePath, to: controlPath, type: 'related_to' });
        }
      }
    }
  }

  // triggers_update_to edges
  if (Array.isArray(node.triggers_update_to)) {
    for (const target of node.triggers_update_to) {
      if (target) edges.push({ from: filePath, to: target, type: 'triggers_update' });
    }
  }

  // triggered_by edges (reverse direction: the other file triggers this one)
  if (Array.isArray(node.triggered_by)) {
    for (const source of node.triggered_by) {
      if (source) edges.push({ from: source, to: filePath, type: 'triggered_by' });
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Build indexes
// ---------------------------------------------------------------------------

const indexes = {};

for (const fwName of Object.keys(frameworkFieldMap)) {
  const fieldName = frameworkFieldMap[fwName];
  const controlsToPolicies = {};
  const controlsToRisks = {};
  const controlsToEvidence = {};

  for (const [filePath, node] of Object.entries(nodes)) {
    if (!node.frameworks || !node.frameworks[fwName]) continue;
    const fwData = node.frameworks[fwName];
    const controlIds = fwData[fieldName];
    if (!Array.isArray(controlIds)) continue;

    for (const controlId of controlIds) {
      if (node.type === 'policy' || node.type === 'procedure' || node.type === 'program') {
        pushUnique(controlsToPolicies, controlId, filePath);
      } else if (node.type === 'risk') {
        pushUnique(controlsToRisks, controlId, filePath);
      } else if (node.type === 'evidence') {
        pushUnique(controlsToEvidence, controlId, node.id);
      }
    }
  }

  // Only include frameworks that have data
  const hasData =
    Object.keys(controlsToPolicies).length > 0 ||
    Object.keys(controlsToRisks).length > 0 ||
    Object.keys(controlsToEvidence).length > 0;

  if (hasData) {
    indexes[fwName] = {
      controls_to_policies: controlsToPolicies,
      controls_to_risks: controlsToRisks,
      controls_to_evidence: controlsToEvidence,
    };
  }
}

// ---------------------------------------------------------------------------
// 4. Build graph.json
// ---------------------------------------------------------------------------

const graph = {
  generated_at: new Date().toISOString(),
  nodes,
  edges,
  indexes,
};

// ---------------------------------------------------------------------------
// 5. Build dashboard-stats.json
// ---------------------------------------------------------------------------

function buildDashboardStats() {
  const stats = {
    generated_at: new Date().toISOString(),
    totals: {
      policies: 0,
      procedures: 0,
      risks: 0,
      controls: 0,
      incidents: 0,
      evidence: 0,
      program: 0,
    },
    policies_by_status: {},
    controls_by_implementation_status: {},
    risks_by_treatment: {},
    risks_by_inherent_risk: {},
    evidence_by_status: {},
    stale_documents: 0,
    frameworks: {},
  };

  for (const node of Object.values(nodes)) {
    switch (node.type) {
      case 'policy':
        stats.totals.policies++;
        stats.policies_by_status[node.status] = (stats.policies_by_status[node.status] || 0) + 1;
        if (node.next_review && node.next_review < TODAY) stats.stale_documents++;
        break;
      case 'procedure':
        stats.totals.procedures++;
        // Procedures share the same status taxonomy as policies
        stats.policies_by_status[node.status] = (stats.policies_by_status[node.status] || 0) + 1;
        if (node.next_review && node.next_review < TODAY) stats.stale_documents++;
        break;
      case 'risk':
        stats.totals.risks++;
        if (node.treatment) {
          stats.risks_by_treatment[node.treatment] =
            (stats.risks_by_treatment[node.treatment] || 0) + 1;
        }
        if (node.inherent_risk != null) {
          const level = String(node.inherent_risk);
          stats.risks_by_inherent_risk[level] =
            (stats.risks_by_inherent_risk[level] || 0) + 1;
        }
        if (node.review_date && node.review_date < TODAY) stats.stale_documents++;
        break;
      case 'control':
        stats.totals.controls++;
        if (node.implementation_status) {
          stats.controls_by_implementation_status[node.implementation_status] =
            (stats.controls_by_implementation_status[node.implementation_status] || 0) + 1;
        }
        break;
      case 'incident':
        stats.totals.incidents++;
        break;
      case 'evidence':
        stats.totals.evidence++;
        if (node.status) {
          stats.evidence_by_status[node.status] =
            (stats.evidence_by_status[node.status] || 0) + 1;
        }
        break;
      case 'program':
        stats.totals.program++;
        if (node.next_review && node.next_review < TODAY) stats.stale_documents++;
        break;
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// 6. Build stale-report.json
// ---------------------------------------------------------------------------

function buildStaleReport() {
  const staleItems = [];

  for (const [filePath, node] of Object.entries(nodes)) {
    let reviewField = null;

    if (node.type === 'policy' || node.type === 'procedure' || node.type === 'program') {
      reviewField = node.next_review;
    } else if (node.type === 'risk') {
      reviewField = node.review_date;
    }

    if (!reviewField) continue;

    // Normalize to string in case it's a Date object
    const reviewStr = typeof reviewField === 'object' && reviewField instanceof Date
      ? reviewField.toISOString().slice(0, 10)
      : String(reviewField).slice(0, 10);

    const overdue = daysOverdue(reviewStr);
    if (overdue > 0) {
      staleItems.push({
        file: filePath,
        type: node.type,
        title: node.title,
        next_review: reviewStr,
        days_overdue: overdue,
        owner: node.owner,
      });
    }
  }

  // Sort by most overdue first
  staleItems.sort((a, b) => b.days_overdue - a.days_overdue);

  return {
    generated_at: new Date().toISOString(),
    today: TODAY,
    stale_items: staleItems,
  };
}

// ---------------------------------------------------------------------------
// 7. Build soa.json (Statement of Applicability — ISO 27001)
// ---------------------------------------------------------------------------

function buildSoa() {
  const controlNodes = Object.entries(nodes)
    .filter(([, n]) => n.type === 'control' && n.framework === 'iso27001')
    .sort(([, a], [, b]) => {
      // Sort by control ID: A.5.1 < A.5.2 < ... < A.5.10 < A.6.1 etc.
      const partsA = a.id.replace('A.', '').split('.').map(Number);
      const partsB = b.id.replace('A.', '').split('.').map(Number);
      if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
      return partsA[1] - partsB[1];
    });

  const iso = indexes.iso27001 || {
    controls_to_policies: {},
    controls_to_risks: {},
    controls_to_evidence: {},
  };

  const controls = controlNodes.map(([, node]) => ({
    id: node.id,
    title: node.title,
    category: node.category,
    applicable: node.applicable,
    justification: node.justification,
    implementation_status: node.implementation_status,
    implementing_policies: iso.controls_to_policies[node.id] || [],
    related_risks: iso.controls_to_risks[node.id] || [],
    evidence: iso.controls_to_evidence[node.id] || [],
  }));

  return {
    generated_at: new Date().toISOString(),
    framework: 'iso27001',
    controls,
  };
}

// ---------------------------------------------------------------------------
// 8. Build framework-coverage.json
// ---------------------------------------------------------------------------

function buildFrameworkCoverage() {
  const coverageFrameworks = {};

  // ISO 27001
  const isoControls = Object.values(nodes).filter(
    (n) => n.type === 'control' && n.framework === 'iso27001'
  );
  if (isoControls.length > 0) {
    const iso = indexes.iso27001 || {
      controls_to_policies: {},
      controls_to_risks: {},
      controls_to_evidence: {},
    };
    const totalControls = isoControls.length;
    const applicableControls = isoControls.filter((c) => c.applicable !== false).length;

    const controlsWithPolicies = isoControls.filter(
      (c) => iso.controls_to_policies[c.id] && iso.controls_to_policies[c.id].length > 0
    ).length;

    const controlsWithEvidence = isoControls.filter(
      (c) => iso.controls_to_evidence[c.id] && iso.controls_to_evidence[c.id].length > 0
    ).length;

    const controlsImplemented = isoControls.filter(
      (c) => c.implementation_status === 'implemented'
    ).length;

    const controlsPartial = isoControls.filter(
      (c) => c.implementation_status === 'partial'
    ).length;

    const safePct = (num, denom) =>
      denom > 0 ? Math.round((num / denom) * 1000) / 10 : 0;

    coverageFrameworks.iso27001 = {
      total_controls: totalControls,
      applicable_controls: applicableControls,
      controls_with_policies: controlsWithPolicies,
      controls_with_evidence: controlsWithEvidence,
      controls_implemented: controlsImplemented,
      controls_partial: controlsPartial,
      policy_coverage_pct: safePct(controlsWithPolicies, applicableControls),
      evidence_coverage_pct: safePct(controlsWithEvidence, applicableControls),
      implementation_pct: safePct(controlsImplemented, applicableControls),
    };
  }

  // SOC 2 (future-ready)
  const soc2Criteria = Object.values(nodes).filter(
    (n) => n.type === 'criterion' && n.framework === 'soc2'
  );
  if (soc2Criteria.length > 0) {
    const soc2Idx = indexes.soc2 || {
      controls_to_policies: {},
      controls_to_risks: {},
      controls_to_evidence: {},
    };
    const total = soc2Criteria.length;
    const applicable = soc2Criteria.filter((c) => c.applicable !== false).length;
    const withPolicies = soc2Criteria.filter(
      (c) => soc2Idx.controls_to_policies[c.id] && soc2Idx.controls_to_policies[c.id].length > 0
    ).length;
    const withEvidence = soc2Criteria.filter(
      (c) => soc2Idx.controls_to_evidence[c.id] && soc2Idx.controls_to_evidence[c.id].length > 0
    ).length;
    const implemented = soc2Criteria.filter((c) => c.implementation_status === 'implemented').length;
    const partial = soc2Criteria.filter((c) => c.implementation_status === 'partial').length;

    const safePct = (num, denom) =>
      denom > 0 ? Math.round((num / denom) * 1000) / 10 : 0;

    coverageFrameworks.soc2 = {
      total_controls: total,
      applicable_controls: applicable,
      controls_with_policies: withPolicies,
      controls_with_evidence: withEvidence,
      controls_implemented: implemented,
      controls_partial: partial,
      policy_coverage_pct: safePct(withPolicies, applicable),
      evidence_coverage_pct: safePct(withEvidence, applicable),
      implementation_pct: safePct(implemented, applicable),
    };
  }

  return {
    generated_at: new Date().toISOString(),
    frameworks: coverageFrameworks,
  };
}

// ---------------------------------------------------------------------------
// 9. Write all output files
// ---------------------------------------------------------------------------

if (!fs.existsSync(COMPUTED_DIR)) {
  fs.mkdirSync(COMPUTED_DIR, { recursive: true });
}

const dashboardStats = buildDashboardStats();
const staleReport = buildStaleReport();
const soa = buildSoa();
const frameworkCoverage = buildFrameworkCoverage();

const outputFiles = [
  [path.join(COMPUTED_DIR, 'graph.json'), graph],
  [path.join(COMPUTED_DIR, 'dashboard-stats.json'), dashboardStats],
  [path.join(COMPUTED_DIR, 'stale-report.json'), staleReport],
  [path.join(COMPUTED_DIR, 'soa.json'), soa],
  [path.join(COMPUTED_DIR, 'framework-coverage.json'), frameworkCoverage],
];

for (const [filePath, data] of outputFiles) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// 10. Summary
// ---------------------------------------------------------------------------

const nodeCount = Object.keys(nodes).length;
const edgeCount = edges.length;
console.log(`Built graph: ${nodeCount} nodes, ${edgeCount} edges. Wrote ${outputFiles.length} files to .computed/`);
