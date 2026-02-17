# Compliance Management System

## Overview

Internal, file-based compliance management system for ISO 27001 (active), SOC 2 and GDPR (planned). All data lives as structured files in this git repo. No database. Multi-framework from day one.

## Architecture

- **Source of truth**: YAML and Markdown files in this repo
- **Relationship graph**: Deterministic Node.js script (`scripts/build-graph.js`) computes `.computed/graph.json`
- **Change propagation**: Pre-commit hooks flag downstream documents needing review
- **Evidence collection**: GitHub Actions on a schedule, opening PRs with collected data
- **Web app**: Local, reads/writes filesystem only, no git operations
- **Claude Code skills**: Read from `.computed/graph.json`, never compute the graph

## Multi-Framework Structure

```
frameworks/          → Framework-specific (controls, criteria, articles, SoA, DPIA)
  iso27001/controls/
  soc2/criteria/
  gdpr/articles/
  mappings/          → Cross-framework mappings

policies/            → SHARED across frameworks (tagged via frontmatter)
risks/               → SHARED
evidence/            → SHARED
audits/{framework}/  → Per-framework audit trails
audits/corrective-actions/ → SHARED (CAPAs can span frameworks)
program/             → Framework-agnostic program management (replaces "ISMS")
```

## File Formats

| Type | Format | Location |
| --- | --- | --- |
| Policies/Procedures | Markdown + YAML frontmatter | `policies/`, `procedures/` |
| Risks | Individual YAML (one per risk) | `risks/` |
| ISO Controls | Individual YAML (one per control) | `frameworks/iso27001/controls/` |
| SOC 2 Criteria | Individual YAML (one per criterion) | `frameworks/soc2/criteria/` |
| GDPR Articles | Individual YAML | `frameworks/gdpr/articles/` |
| Evidence registry | Single YAML | `evidence/_registry.yml` |
| Computed data | JSON (generated, do not edit) | `.computed/` |

## Key Relationships in Frontmatter (Multi-Framework)

```yaml
frameworks:
  iso27001:
    controls: [A.5.15, A.8.3]
  soc2:
    criteria: [CC6.1, CC6.3]
  gdpr:
    articles: [Article 32]
triggers_update_to: [path]   # If I change, this file needs review
triggered_by: [path]         # If this file changes, I need review
```

## Session Context

Read `docs/session-context.md` for the full design conversation and architectural decisions.
Read `docs/implementation-plan.md` for the phased build plan.
Read `docs/executive-summary.md` for the stakeholder pitch.
