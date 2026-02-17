# Implementation Plan

## Phase 1: Foundation (Weeks 1-3)

> **Goal**: All compliance documents converted to structured files. Relationship graph computable. Core scripts working.

### 1.1 Repository Structure Setup (Week 1)

Set up the directory structure for the compliance repository:

```
compliance/
├── .github/
│   └── workflows/                  # Evidence collection automations (Phase 2)
├── .claude/
│   ├── commands/compliance/        # Claude Code skills for querying the system
│   └── rules/compliance.md         # Context for Claude Code
├── scripts/
│   ├── build-graph.js              # Deterministic relationship graph builder
│   ├── check-propagation.js        # Pre-commit hook: flag downstream reviews
│   ├── validate.js                 # Schema validation for all YAML files
│   └── collectors/                 # Evidence collection scripts (Phase 2)
├── schema/                         # YAML schemas for file validation
│   ├── policy.schema.yml
│   ├── risk.schema.yml
│   ├── control.schema.yml
│   └── evidence.schema.yml
├── .computed/                      # Generated files (graph, stats, reports)
│
├── frameworks/                     # === FRAMEWORK-SPECIFIC ARTIFACTS ===
│   ├── iso27001/
│   │   ├── controls/               # 93 Annex A control files (one per control)
│   │   ├── soa.yml                 # Statement of Applicability
│   │   └── certification/          # Stage 1, stage 2, surveillance audit docs
│   ├── soc2/                       # (Phase 4)
│   │   ├── criteria/               # Trust Services Criteria (CC, A, PI, C, P)
│   │   └── type2-readiness.yml
│   ├── gdpr/                       # (Phase 4)
│   │   ├── articles/               # Relevant GDPR articles
│   │   ├── dpia/                   # Data Protection Impact Assessments
│   │   └── ropa.yml                # Record of Processing Activities
│   └── mappings/                   # Cross-framework control mappings
│       ├── iso27001-soc2.yml
│       └── iso27001-gdpr.yml
│
├── policies/                       # === SHARED ACROSS FRAMEWORKS ===
├── procedures/                     # Shared
├── risks/                          # Shared
│   ├── treatment/                  # Treatment plan documents
│   └── asset-register.yml
├── evidence/                       # Shared, tagged per framework
│   ├── _registry.yml               # Evidence metadata and freshness
│   ├── automated/                  # Collected by GitHub Actions
│   └── manual/                     # Uploaded manually
├── vendors/                        # Shared
├── training/                       # Shared
├── incidents/                      # Shared
│
├── audits/                         # Per-framework audit trails
│   ├── iso27001/
│   │   ├── internal/
│   │   └── external/
│   ├── soc2/                       # (Phase 4)
│   ├── gdpr/                       # (Phase 4)
│   └── corrective-actions/         # Shared (a CAPA can span frameworks)
│
├── program/                        # === COMPLIANCE PROGRAM MANAGEMENT ===
│   ├── context.md                  # Organization context
│   ├── scope.md                    # Overall compliance program scope
│   ├── interested-parties.yml
│   ├── objectives.yml
│   ├── management-reviews/         # Reviews cover ALL frameworks
│   └── improvement-log.yml
│
├── webapp/                         # Local dashboard app (Phase 3)
└── docs/                           # Project docs (this file, etc.)
```

**Key structural decisions:**

- `frameworks/` holds framework-specific artifacts (controls, criteria, articles, SoA, DPIA, etc.)
- `policies/`, `risks/`, `evidence/` are shared — one document can serve multiple frameworks via frontmatter
- `audits/` has per-framework subdirectories (each framework has its own audit cycle)
- `audits/corrective-actions/` is shared (a CAPA can address findings across frameworks)
- `program/` replaces "ISMS" — framework-agnostic program management (context, scope, management reviews)

**Deliverables:**

- [ ] Repository initialized with full directory structure
- [ ] README with project overview and getting started guide
- [ ] YAML schemas defined for each file type
- [ ] `.gitignore` configured
- [ ] `.github/CODEOWNERS` with initial ownership mappings (refined in Phase 1.2 as policies are converted)
- [ ] Branch protection on `main` requiring CODEOWNERS approval

### 1.2 Document Conversion (Week 1-2)

Convert all existing consultant documents into the file-based format.

**File format decisions:**

| Document Type | Format | Location |
| --- | --- | --- |
| Policies | Markdown + YAML frontmatter | `policies/` |
| Procedures | Markdown + YAML frontmatter | `procedures/` |
| Risks | Individual YAML files (one per risk) | `risks/` |
| ISO 27001 Controls | Individual YAML files (one per control) | `frameworks/iso27001/controls/` |
| Evidence registry | Single YAML file | `evidence/_registry.yml` |
| Asset register | YAML | `risks/asset-register.yml` |
| Incident log | Individual YAML files | `incidents/` |
| Vendor register | Individual YAML files | `vendors/` |
| ISMS lifecycle docs | Markdown or YAML | `program/` |

**Frontmatter schema for policies/procedures (multi-framework):**

```yaml
---
id: POL-003
title: Access Control Policy
owner: j.ledoux
status: draft | in-review | approved | retired
version: 1.0
approved_date: null
next_review: 2027-01-15
frameworks:
  iso27001:
    controls: [A.5.15, A.5.16, A.8.2, A.8.3]
  # soc2:                                    # Added when SOC 2 is onboarded
  #   criteria: [CC6.1, CC6.3]
  # gdpr:                                    # Added when GDPR is onboarded
  #   articles: [Article 32]
triggers_update_to:
  - procedures/user-provisioning.md
  - procedures/access-review.md
triggered_by:
  - risks/R-015.yml
  - risks/R-022.yml
---
```

**Risk file schema (multi-framework):**

```yaml
id: R-015
title: Unauthorized access to production systems
asset: Production AWS Environment
threat: External attacker / insider threat
vulnerability: Weak access controls
likelihood: 3
impact: 4
inherent_risk: 12
treatment: mitigate
frameworks:
  iso27001:
    controls: [A.8.2, A.8.3, A.8.5]
  # soc2:
  #   criteria: [CC6.1, CC6.3]
residual_likelihood: 2
residual_impact: 4
residual_risk: 8
owner: j.ledoux
status: treating
review_date: 2026-06-15
treatment_plan: risks/treatment/R-015-plan.md
```

**Control file schema (ISO 27001 — lives under `frameworks/iso27001/controls/`):**

```yaml
id: A.8.3
title: Access restriction
theme: technological
applicable: true
justification: "Production systems require role-based access control"
implementation_status: implemented | partial | planned | not-started
notes: ""
```

**Evidence registry schema (multi-framework):**

```yaml
evidence:
  - id: EVD-001
    title: AWS Config Compliance Rules
    frameworks:
      iso27001:
        controls: [A.8.9]
      # soc2:
      #   criteria: [CC7.1]
    source: aws
    collection: automated
    frequency: weekly
    last_collected: 2026-02-10
    next_due: 2026-02-17
    path: evidence/automated/aws/2026-02-10/config-compliance.json
    status: current  # current | stale | missing
```

**Deliverables:**

- [ ] All existing policies converted to markdown with multi-framework frontmatter
- [ ] All risks entered as individual YAML files with `frameworks` field
- [ ] All 93 Annex A controls populated under `frameworks/iso27001/controls/`
- [ ] Statement of Applicability derivable from control files
- [ ] Asset register populated
- [ ] Interested parties register populated
- [ ] Program scope and context documents converted to `program/`

### 1.3 Graph Builder Script (Week 2)

Build the deterministic Node.js script that parses all files and computes the relationship graph.

**Input**: All `.md` and `.yml` files in the repo (shared + all framework directories).

**Output**: `.computed/graph.json` containing:

- **Nodes**: Every file with its parsed metadata
- **Edges**: Relationships between files (implements, triggers_update, triggered_by, evidences)
- **Indexes**: Reverse lookups per framework (control → policies, control → evidence, etc.)
- **Stale items**: Files past their review date
- **Orphaned controls**: Applicable controls (per framework) without policies or evidence
- **Gaps**: Controls not fully implemented (per framework)

The graph builder must understand the `frameworks` field in frontmatter to build per-framework indexes. For example, querying "what evidence covers SOC 2 CC6.1?" requires scanning all evidence entries for `frameworks.soc2.criteria` containing `CC6.1`.

**Additional computed outputs:**

- `.computed/dashboard-stats.json` — aggregated numbers, broken down by framework
- `.computed/stale-report.json` — all items needing attention, sorted by urgency
- `.computed/soa.json` — Statement of Applicability derived from ISO 27001 control files
- `.computed/framework-coverage.json` — per-framework: % of controls/criteria with evidence + policies

**Deliverables:**

- [ ] `scripts/build-graph.js` — framework-aware graph builder
- [ ] `scripts/validate.js` — schema validator (runs before graph build)
- [ ] `.computed/` directory with all derived files
- [ ] Script runs in under 2 seconds for the full repo

### 1.4 Pre-Commit Hooks (Week 2-3)

Set up git hooks for change propagation and validation.

**Pre-commit hook chain:**

1. `scripts/validate.js` — Validate all changed YAML/frontmatter files against schemas
2. `scripts/build-graph.js` — Regenerate the relationship graph
3. `scripts/check-propagation.js` — Flag downstream documents that may need review

**Check-propagation behavior:**

- Reads the updated graph
- For each changed file, checks `triggers_update_to` edges
- If a downstream file was NOT also changed in this commit, logs a warning
- Appends pending reviews to `.computed/pending-reviews.json`
- **Warns but does not block** the commit (informational only)

**Deliverables:**

- [ ] Pre-commit hooks installed via `husky` or `lefthook`
- [ ] `check-propagation.js` with clear, actionable output
- [ ] `pending-reviews.json` accumulates unresolved propagation items

### 1.5 Claude Code Skills (Week 3)

Build Claude Code slash commands for querying the compliance system.

| Skill | Purpose |
| --- | --- |
| `/compliance.impact <file>` | Show what's affected if a specific file changes (across all frameworks) |
| `/compliance.stale` | List all documents past their review date |
| `/compliance.gap [framework]` | Show controls/criteria without full evidence or implementation |
| `/compliance.status [framework]` | Quick summary of compliance posture (optionally per framework) |
| `/compliance.soa` | Generate Statement of Applicability report (ISO 27001) |
| `/compliance.coverage [framework]` | Show how much of a framework is covered by policies + evidence |

These skills read from `.computed/graph.json` and present the data — they don't compute the graph themselves. The optional `[framework]` parameter filters output to a specific framework.

**Deliverables:**

- [ ] 6 initial Claude Code skills in `.claude/commands/compliance/`
- [ ] Skills documented in README
- [ ] CLAUDE.md configured with compliance repo context

---

## Phase 2: Evidence Automation (Weeks 4-7)

> **Goal**: Automated weekly/monthly evidence collection from key systems via GitHub Actions.

### 2.1 Evidence Collection Framework (Week 4)

Build the infrastructure for automated evidence collection.

**Components:**

- `scripts/collectors/` — Individual collector scripts per source
- `scripts/update-evidence-registry.js` — Updates `evidence/_registry.yml` after collection
- `.github/workflows/collect-evidence.yml` — Orchestrates collection on a schedule

**Evidence storage pattern:**

```
evidence/automated/{source}/{date}/
  ├── {check-name}.json
  └── ...
```

Each collection run opens a PR. Merging the PR = human review of the evidence. Evidence entries in the registry declare which frameworks they satisfy via the `frameworks` field.

**Deliverables:**

- [ ] Collector script template
- [ ] Evidence registry update script (framework-aware)
- [ ] GitHub Actions workflow scaffold

### 2.2 AWS Evidence Collector (Week 4-5)

**Schedule**: Weekly (Mondays at 6 AM)

| Check | AWS API | ISO 27001 Controls |
| --- | --- | --- |
| IAM policies and roles | `get-account-authorization-details` | A.8.2, A.8.3 |
| Config rule compliance | `describe-compliance-by-config-rule` | A.8.9 |
| CloudTrail status | `describe-trails`, `get-trail-status` | A.8.15, A.8.16 |
| Security groups | `describe-security-groups` | A.8.20, A.8.21 |
| Backup plans | `list-backup-plans` | A.8.13 |
| Encryption status | `describe-volumes` (EBS encryption) | A.8.24 |
| VPC flow logs | `describe-flow-logs` | A.8.16 |

When SOC 2 / GDPR are onboarded (Phase 4), the same evidence entries gain additional framework tags via the cross-framework mappings — no new collectors needed.

**Prerequisites:**

- [ ] Dedicated IAM role with read-only access for evidence collection
- [ ] GitHub OIDC trust for the role (no long-lived credentials)
- [ ] AWS region(s) configured

### 2.3 GitHub Evidence Collector (Week 5)

**Schedule**: Weekly

| Check | GitHub API | ISO 27001 Controls |
| --- | --- | --- |
| Branch protection rules | Repo branch protection API | A.8.4, A.8.32 |
| Merged PRs with reviews | PR list API | A.8.32 |
| Org members and access | Org members API | A.5.16 |
| Repository settings | Repo API | A.8.4 |
| Dependabot alerts | Security advisories API | A.8.8 |
| Audit log | Audit log API (if Enterprise) | A.8.15 |

**Prerequisites:**

- [ ] GitHub PAT or App with read access to repos, org, and security data
- [ ] List of repositories in scope

### 2.4 Google Workspace Evidence Collector (Week 5-6)

**Schedule**: Weekly

| Check | Google API | ISO 27001 Controls |
| --- | --- | --- |
| User list and status | Directory API | A.5.16, A.6.1, A.6.5 |
| Admin roles and assignments | Directory API | A.8.2 |
| 2FA enrollment status | Reports API | A.8.5 |
| Mobile device management | Directory API | A.8.1 |
| Drive sharing settings | Admin SDK | A.5.10 |

**Prerequisites:**

- [ ] Google Workspace service account with domain-wide delegation
- [ ] Admin SDK and Reports API enabled
- [ ] Scopes: `admin.directory.user.readonly`, `admin.reports.audit.readonly`

### 2.5 Jira Evidence Collector (Week 6)

**Schedule**: Weekly

| Check | Jira API | ISO 27001 Controls |
| --- | --- | --- |
| Open incidents (by label/type) | JQL search | A.5.24-28 |
| Resolved incidents with resolution | JQL search | A.5.26, clause 10.2 |
| Open corrective actions | JQL search | Clause 10.2 |
| Change requests (merged tickets) | JQL search | A.8.32 |

**Prerequisites:**

- [ ] Jira API token for service account
- [ ] JQL queries defined for each evidence type

### 2.6 Additional Collectors (Week 6-7)

**Lower priority, build as time allows:**

| Source | Schedule | ISO 27001 Controls | Complexity |
| --- | --- | --- | --- |
| GCP | Weekly | Same as AWS for GCP resources | Medium |
| Freshdesk | Monthly | A.5.24 (incident metrics) | Low |
| Slack | Monthly | A.5.10, A.5.14 (retention, admin) | Low |
| KnowBe4 | Monthly | A.6.3 (training completions) | Low (may be manual export) |

### 2.7 Staleness Alerts (Week 7)

Build a GitHub Action that runs daily and creates a Slack notification (or Jira ticket) when evidence goes stale.

**Logic:**

1. Parse `evidence/_registry.yml`
2. For each entry, compare `last_collected + frequency` to today
3. If overdue, flag it
4. Post summary to Slack or create/update a tracking Jira ticket

**Deliverables:**

- [ ] `.github/workflows/staleness-check.yml`
- [ ] Slack notification integration (via webhook)

---

## Phase 3: Dashboard & Reporting (Weeks 8-10)

> **Goal**: Local web app that reads files and renders dashboards. No git, no database, no auth.

### 3.1 Technology Choice (Week 8)

**Recommendation**: A lightweight framework that reads files at request time.

| Option | Pros | Cons |
| --- | --- | --- |
| Astro + static build | Blazing fast, rebuilds on file change | Less interactive |
| SvelteKit | Simple, reactive, good DX | New framework to learn |
| Next.js | Familiar React patterns | Heavier than needed |
| Angular (your stack) | Team already knows it | Overkill for a dashboard |

**Recommended**: Astro or SvelteKit. The app is read-heavy with occasional form submissions. It doesn't need Angular's full framework.

**Core principle**: The web app reads from the filesystem and `.computed/graph.json`. It writes files directly to disk when edits are made. No database. No git operations.

### 3.2 Dashboard Views (Week 8-9)

All dashboard views support framework filtering. A global framework selector lets users view posture for ISO 27001, SOC 2, GDPR, or "all."

| View | Data Source | Content |
| --- | --- | --- |
| **Posture Overview** | `dashboard-stats.json` | Readiness score per framework, overall %, evidence freshness %, open CAPAs |
| **Control Register** | `frameworks/{fw}/controls/*.yml` | Filterable table with implementation status, linked policies, linked evidence |
| **Statement of Applicability** | `soa.json` | Exportable SoA (ISO 27001) |
| **Risk Register** | `risks/*.yml` | Risk heatmap, sortable list, treatment status, framework filter |
| **Policy Register** | `policies/*.md` frontmatter | Status, owner, review date, frameworks served |
| **Evidence Tracker** | `evidence/_registry.yml` | Freshness status, collection dates, framework coverage |
| **Pending Reviews** | `pending-reviews.json` | Documents flagged by change propagation |
| **Audit Findings** | `audits/{fw}/*/findings/*.yml` | Open findings per framework, CAPA status |
| **Impact Explorer** | `graph.json` edges | "What if I change X?" interactive graph |
| **Framework Coverage** | `framework-coverage.json` | Per-framework: % controls with evidence + policies |

### 3.3 Edit Capabilities (Week 9-10)

The web app provides forms for editing file content:

- **Risk editor**: Form fields mapped to risk YAML schema, writes back to `risks/R-XXX.yml`
- **Policy metadata editor**: Edit frontmatter fields (including framework tags) without touching the body
- **Evidence registry editor**: Update manual evidence entries, tag with frameworks
- **Control status updater**: Change implementation status across controls

**Write workflow**: User edits in web app -> app writes file to disk -> user commits via git CLI, VS Code, or SourceTree when ready.

### 3.4 Export Capabilities (Week 10)

| Export | Format | Purpose |
| --- | --- | --- |
| Statement of Applicability | PDF / Word | ISO 27001 auditor deliverable |
| Risk Register | PDF / Excel | Management review input |
| Management Review Report | PDF | Clause 9.3 requirement |
| Evidence Package | ZIP (per control/criteria) | Framework-specific auditor evidence bundle |
| Compliance Posture Report | PDF | Executive summary (per framework or combined) |
| Framework Coverage Report | PDF | Per-framework gap analysis |

**Deliverables:**

- [ ] Local web app with all dashboard views (framework-aware)
- [ ] Edit forms for key document types
- [ ] Export functionality for auditor-facing documents
- [ ] `npm run dev` starts the app locally

---

## Phase 4: Framework Expansion (Ongoing)

> **Goal**: Onboard SOC 2 and GDPR. Refine automation and reporting.

### 4.1 SOC 2 Onboarding

**New files:**

- `frameworks/soc2/criteria/*.yml` — Trust Services Criteria files (CC1-CC9, A1, PI1, C1, P1-P8)
- `frameworks/soc2/type2-readiness.yml` — Readiness tracking
- `frameworks/mappings/iso27001-soc2.yml` — Cross-mapping

**Updates to existing files:**

- Policies: Add `soc2:` section to `frameworks` frontmatter with applicable criteria
- Risks: Add `soc2:` section to `frameworks` field
- Evidence: Add `soc2:` section to evidence registry entries
- Audits: Create `audits/soc2/` directory

**Script to assist onboarding:**

```bash
node scripts/onboard-framework.js soc2 --mapping=frameworks/mappings/iso27001-soc2.yml
```

This script reads the cross-mapping file and suggests which existing policies/evidence should be tagged with SOC 2 criteria.

### 4.2 GDPR Onboarding

**New files:**

- `frameworks/gdpr/articles/*.yml` — Relevant GDPR articles
- `frameworks/gdpr/dpia/*.md` — Data Protection Impact Assessments
- `frameworks/gdpr/ropa.yml` — Record of Processing Activities
- `frameworks/mappings/iso27001-gdpr.yml` — Cross-mapping

**Updates**: Same pattern as SOC 2 — add `gdpr:` sections to existing shared files.

### 4.3 Cross-Framework Mapping Files

```yaml
# frameworks/mappings/iso27001-soc2.yml
mappings:
  - iso27001: A.5.1
    soc2: [CC1.1]
    notes: "Information security policies map to control environment"
  - iso27001: A.8.3
    soc2: [CC6.1, CC6.3]
    notes: "Access restriction maps to logical access controls"
```

The graph builder uses these mappings to:

- Suggest framework tags when onboarding a new framework
- Show cross-framework coverage in dashboards
- Generate "one evidence, multiple frameworks" reports

### 4.4 Vendor Risk Management

Add vendor assessment workflows:

- Vendor register with risk tiering (individual YAML files in `vendors/`)
- Questionnaire templates (markdown)
- Review tracking in vendor YAML files

### 4.5 Incident Management Integration

Deeper Jira/Freshdesk integration:

- Webhook-triggered updates when incidents are created/resolved
- Automatic incident log entries from Jira ticket transitions
- Root cause analysis templates

### 4.6 Continuous Improvement

- Refine evidence collectors based on what auditors actually ask for
- Add more dashboard views as needs emerge
- Integrate with Lucidchart for architecture diagram evidence
- CI-based validation (lint YAML, check for orphaned controls on every PR)

---

## Dependencies & Prerequisites

| Item | Owner | Needed By |
| --- | --- | --- |
| Current consultant document set | IT Director | Phase 1, Week 1 |
| Private GitHub repository | Engineering | Phase 1, Week 1 |
| AWS read-only IAM role + OIDC | Engineering | Phase 2, Week 4 |
| GitHub PAT or App for evidence | Engineering | Phase 2, Week 5 |
| Google Workspace service account | IT Director | Phase 2, Week 5 |
| Jira API token | Engineering | Phase 2, Week 6 |
| Slack webhook URL | Engineering | Phase 2, Week 7 |

## Success Criteria

| Phase | Success Metric |
| --- | --- |
| Phase 1 | Can answer "what does this control depend on?" in under 30 seconds |
| Phase 2 | 80% of evidence is collected automatically; staleness alerts working |
| Phase 3 | Non-technical stakeholders can view compliance posture without CLI |
| Phase 4 | System supports ISO 27001 + at least one additional framework with shared evidence |
