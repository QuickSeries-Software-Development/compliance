#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { globSync } = require('glob');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const ROOT = process.cwd();
const SCHEMA_DIR = path.join(ROOT, 'schema');
const changedOnly = process.argv.includes('--changed-only');

// Initialize Ajv with draft-07 defaults and format validation
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// ---------------------------------------------------------------------------
// Load schemas
// ---------------------------------------------------------------------------

function loadSchema(filename) {
  const filepath = path.join(SCHEMA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`Schema not found: ${filepath}`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

const schemas = {
  policy: loadSchema('policy.schema.json'),
  risk: loadSchema('risk.schema.json'),
  control: loadSchema('control.schema.json'),
  evidence: loadSchema('evidence.schema.json'),
  incident: loadSchema('incident.schema.json'),
};

// Pre-compile validators
const validators = {};
for (const [name, schema] of Object.entries(schemas)) {
  validators[name] = ajv.compile(schema);
}

// ---------------------------------------------------------------------------
// File-to-schema mapping
// ---------------------------------------------------------------------------

const FILE_RULES = [
  { glob: 'policies/*.md',                         schema: 'policy',   type: 'markdown' },
  { glob: 'procedures/*.md',                       schema: 'policy',   type: 'markdown' },
  { glob: 'risks/*.yml',                           schema: 'risk',     type: 'yaml' },
  { glob: 'frameworks/iso27001/controls/*.yml',    schema: 'control',  type: 'yaml' },
  { glob: 'frameworks/soc2/criteria/*.yml',        schema: 'control',  type: 'yaml' },
  { glob: 'frameworks/gdpr/articles/*.yml',        schema: 'control',  type: 'yaml' },
  { glob: 'evidence/_registry.yml',                schema: 'evidence', type: 'yaml' },
  { glob: 'incidents/*.yml',                       schema: 'incident', type: 'yaml' },
];

// ---------------------------------------------------------------------------
// Changed-only filtering
// ---------------------------------------------------------------------------

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return new Set(output.trim().split('\n').filter(Boolean));
  } catch {
    console.error('Warning: could not get staged files from git; validating all files.');
    return null;
  }
}

// ---------------------------------------------------------------------------
// Collect files to validate
// ---------------------------------------------------------------------------

function collectFiles() {
  const stagedFiles = changedOnly ? getStagedFiles() : null;
  const files = [];

  for (const rule of FILE_RULES) {
    const matches = globSync(rule.glob, { cwd: ROOT, nodir: true });

    for (const relPath of matches) {
      // If --changed-only, skip files not staged in git
      if (stagedFiles && !stagedFiles.has(relPath)) {
        continue;
      }

      files.push({
        path: relPath,
        absPath: path.join(ROOT, relPath),
        schemaName: rule.schema,
        type: rule.type,
      });
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Parse & validate
// ---------------------------------------------------------------------------

/**
 * js-yaml (and gray-matter, which uses it) auto-converts date-like strings
 * such as "2025-12-08" into JavaScript Date objects.  Our JSON schemas expect
 * "format": "date" *strings*, so we recursively coerce Date values back to
 * "YYYY-MM-DD" strings before validation.
 */
function normalizeDates(obj) {
  if (obj instanceof Date) {
    const y = obj.getUTCFullYear();
    const m = String(obj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(obj.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeDates);
  }
  if (obj !== null && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = normalizeDates(v);
    }
    return out;
  }
  return obj;
}

function parseFile(file) {
  const raw = fs.readFileSync(file.absPath, 'utf8');

  if (file.type === 'markdown') {
    const { data } = matter(raw);
    return normalizeDates(data);
  }

  // YAML
  return normalizeDates(yaml.load(raw));
}

function formatErrors(errors) {
  if (!errors || errors.length === 0) return '';
  return errors
    .map((e) => {
      const loc = e.instancePath || '/';
      const msg = e.message || 'unknown error';
      const extra = e.params ? ` (${JSON.stringify(e.params)})` : '';
      return `  ${loc}: ${msg}${extra}`;
    })
    .join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const files = collectFiles();

  if (files.length === 0) {
    if (changedOnly) {
      console.log('No staged files match validation rules. Nothing to validate.');
    } else {
      console.log('No files found to validate.');
    }
    process.exit(0);
  }

  const results = [];

  for (const file of files) {
    let data;
    try {
      data = parseFile(file);
    } catch (err) {
      results.push({
        file: file.path,
        schema: file.schemaName,
        status: 'FAIL',
        errors: `  Parse error: ${err.message}`,
      });
      continue;
    }

    // Empty frontmatter / empty YAML
    if (data == null || (typeof data === 'object' && Object.keys(data).length === 0)) {
      if (file.type === 'markdown') {
        results.push({
          file: file.path,
          schema: file.schemaName,
          status: 'FAIL',
          errors: '  No frontmatter found',
        });
      } else {
        results.push({
          file: file.path,
          schema: file.schemaName,
          status: 'FAIL',
          errors: '  Empty or null YAML document',
        });
      }
      continue;
    }

    const validate = validators[file.schemaName];
    const valid = validate(data);

    results.push({
      file: file.path,
      schema: file.schemaName,
      status: valid ? 'PASS' : 'FAIL',
      errors: valid ? '' : formatErrors(validate.errors),
    });
  }

  // ---------------------------------------------------------------------------
  // Output
  // ---------------------------------------------------------------------------

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;

  // Column widths
  const fileCol = Math.max(4, ...results.map((r) => r.file.length));
  const schemaCol = Math.max(6, ...results.map((r) => r.schema.length));

  const divider = '-'.repeat(fileCol + schemaCol + 20);

  console.log('');
  console.log(`${'File'.padEnd(fileCol)}  ${'Schema'.padEnd(schemaCol)}  Status`);
  console.log(divider);

  for (const r of results) {
    const marker = r.status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`${r.file.padEnd(fileCol)}  ${r.schema.padEnd(schemaCol)}  ${marker}`);
    if (r.errors) {
      console.log(r.errors);
    }
  }

  console.log(divider);
  console.log(`\nTotal: ${results.length}  Passed: ${passCount}  Failed: ${failCount}`);
  console.log('');

  process.exit(failCount > 0 ? 1 : 0);
}

main();
