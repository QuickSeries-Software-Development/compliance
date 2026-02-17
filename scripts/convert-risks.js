#!/usr/bin/env node
/**
 * convert-risks.js
 *
 * Reads the CSV risk register and generates individual YAML files in risks/.
 * Uses only Node.js built-in modules (no npm dependencies).
 */

const fs = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────────
const CSV_PATH = path.join(__dirname, '..', 'COMPLETED', 'Risks 2025 R1-R151-Table 1.csv');
const OUT_DIR = path.join(__dirname, '..', 'risks');

// ── CSV Parser (handles quoted fields with embedded newlines/commas) ──────────
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    const row = [];
    while (i < len) {
      let value = '';
      if (text[i] === '"') {
        i++;
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') {
              value += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            value += text[i];
            i++;
          }
        }
      } else {
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          value += text[i];
          i++;
        }
      }
      row.push(value);
      if (i < len && text[i] === ',') {
        i++;
      } else {
        break;
      }
    }
    if (i < len && text[i] === '\r') i++;
    if (i < len && text[i] === '\n') i++;
    rows.push(row);
  }
  return rows;
}

// ── Owner normalisation ────────────────────────────────────────────────────────
function normalizeOwner(raw) {
  if (!raw) return 'unknown';
  const s = raw.trim();
  const map = {
    'IT & Security Manager': 'e.stpierre',
    'Leadership - ISMS Manager': 'e.stpierre',
    'CEO/President': 'r.ledoux',
    'President & CEO': 'r.ledoux',
    'Leadership - CEO': 'r.ledoux',
    'Leadership - President': 'r.ledoux',
    'CTO': 'j.ledoux',
    'Developer': 'developer',
    'Leadership - VP Finance': 'vp-finance',
    'Leadership - VP Sales': 'vp-sales',
    'Leadership - Marketing Director': 'marketing-director',
  };
  if (map[s] !== undefined) return map[s];
  return s.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ── Treatment mapping ──────────────────────────────────────────────────────────
function mapTreatment(raw) {
  if (!raw) return 'mitigate';
  const s = raw.trim().toLowerCase();
  if (s.includes('selection of controls')) return 'mitigate';
  if (s.includes('accept')) return 'accept';
  if (s.includes('avoid')) return 'avoid';
  if (s.includes('transfer') || s.includes('share')) return 'transfer';
  return 'mitigate';
}

// ── Parse controls from a string ───────────────────────────────────────────────
function parseControls(raw) {
  if (!raw || raw.trim() === '' || raw.trim().toLowerCase() === 'none') return [];
  return raw
    .split(/[,;]/)
    .map(c => c.trim())
    .filter(c => c.length > 0 && c.toLowerCase() !== 'none')
    .map(c => {
      const match = c.match(/^(A\.\d+\.\d+)/);
      if (match) return match[1];
      return c.replace(/\s*[\u2013\-]\s*.*$/, '').trim();
    })
    .filter(c => c.length > 0);
}

// ── Parse a numeric value or return null ───────────────────────────────────────
function parseNum(raw) {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (s === '') return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
}

// ── YAML escaping ──────────────────────────────────────────────────────────────
function yamlString(val) {
  if (val === null || val === undefined) return 'null';
  let s = String(val).trim();
  if (s === '') return 'null';
  s = s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (
    s.includes(':') || s.includes('#') || s.includes('"') ||
    s.includes("'") || s.includes('{') || s.includes('}') ||
    s.includes('[') || s.includes(']') || s.includes(',') ||
    s.includes('&') || s.includes('*') || s.includes('?') ||
    s.includes('|') || s.includes('>') || s.includes('!') ||
    s.includes('%') || s.includes('@') || s.includes('`') ||
    s.startsWith('-') || s.startsWith('.') ||
    s.toLowerCase() === 'true' || s.toLowerCase() === 'false' ||
    s.toLowerCase() === 'null' || s.toLowerCase() === 'yes' || s.toLowerCase() === 'no'
  ) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return s;
}

// ── Format control list for YAML ───────────────────────────────────────────────
function yamlControlList(controls) {
  if (!controls || controls.length === 0) return '[]';
  return '[' + controls.join(', ') + ']';
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const allRows = parseCSV(raw);

  if (allRows.length < 4) {
    console.error('CSV has fewer than 4 rows; expected at least title + headers + data');
    process.exit(1);
  }

  const headers = allRows[2];
  console.log(`Column headers (${headers.length} cols):`);
  headers.forEach((h, i) => console.log(`  [${i}] ${h}`));

  const COL = {
    type: 0,
    riskNum: 1,
    assetNum: 2,
    asset: 3,
    assetOwner: 4,
    riskOwner: 5,
    threat: 6,
    vulnerability: 7,
    existingControls: 8,
    notes: 9,
    impact: 10,
    likelihood: 11,
    inherentRisk: 12,
    treatment: 13,
    requiredControls: 14,
    implNotes: 15,
    residualImpact: 16,
    residualLikelihood: 17,
    residualRisk: 18,
  };

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  let count = 0;
  let errors = [];

  for (let r = 3; r < allRows.length; r++) {
    const row = allRows[r];
    const riskId = (row[COL.riskNum] || '').trim();
    if (!riskId || !riskId.startsWith('R-')) continue;

    const riskNumRaw = riskId.replace('R-', '');
    const riskNumPadded = riskNumRaw.padStart(3, '0');
    const id = `R-${riskNumPadded}`;

    const asset = (row[COL.asset] || '').trim();
    const assetOwner = (row[COL.assetOwner] || '').trim();
    const threat = (row[COL.threat] || '').trim();
    const vulnerability = (row[COL.vulnerability] || '').trim();
    const title = asset && threat ? `${asset} - ${threat}` : asset || threat || id;

    const existingControls = parseControls(row[COL.existingControls]);
    const notes = (row[COL.notes] || '').trim();
    const impact = parseNum(row[COL.impact]);
    const likelihood = parseNum(row[COL.likelihood]);
    const inherentRisk = parseNum(row[COL.inherentRisk]);
    const treatment = mapTreatment(row[COL.treatment]);
    const requiredControls = parseControls(row[COL.requiredControls]);
    const implNotes = (row[COL.implNotes] || '').trim();
    const residualImpact = parseNum(row[COL.residualImpact]);
    const residualLikelihood = parseNum(row[COL.residualLikelihood]);
    const residualRisk = parseNum(row[COL.residualRisk]);
    const owner = normalizeOwner(row[COL.riskOwner]);

    const lines = [];
    lines.push(`id: ${id}`);
    lines.push(`title: ${yamlString(title)}`);
    lines.push(`asset: ${yamlString(asset)}`);
    lines.push(`asset_owner: ${yamlString(assetOwner)}`);
    lines.push(`threat: ${yamlString(threat)}`);
    lines.push(`vulnerability: ${yamlString(vulnerability)}`);
    lines.push(`likelihood: ${likelihood !== null ? likelihood : 'null'}`);
    lines.push(`impact: ${impact !== null ? impact : 'null'}`);
    lines.push(`inherent_risk: ${inherentRisk !== null ? inherentRisk : 'null'}`);
    lines.push(`treatment: ${treatment}`);
    lines.push(`frameworks:`);
    lines.push(`  iso27001:`);
    lines.push(`    controls: ${yamlControlList(existingControls)}`);
    lines.push(`required_controls: ${yamlControlList(requiredControls)}`);
    lines.push(`notes: ${yamlString(notes || null)}`);
    lines.push(`implementation_notes: ${yamlString(implNotes || null)}`);
    lines.push(`residual_likelihood: ${residualLikelihood !== null ? residualLikelihood : 'null'}`);
    lines.push(`residual_impact: ${residualImpact !== null ? residualImpact : 'null'}`);
    lines.push(`residual_risk: ${residualRisk !== null ? residualRisk : 'null'}`);
    lines.push(`owner: ${owner}`);
    lines.push(`status: treating`);
    lines.push(`review_date: 2026-06-15`);
    lines.push('');

    const filename = `${id.toLowerCase()}.yml`;
    const outPath = path.join(OUT_DIR, filename);

    try {
      fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
      count++;
    } catch (err) {
      errors.push(`${id}: ${err.message}`);
    }
  }

  console.log(`\nGenerated ${count} YAML files in ${OUT_DIR}`);
  if (errors.length > 0) {
    console.error(`\nErrors (${errors.length}):`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
}

main();
