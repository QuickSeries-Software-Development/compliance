# Session Context: Compliance System Design

> This document captures the full design conversation for the compliance management system. Use it to resume work in a new Claude Code instance running from this repository.

## Project Overview

We are building an internal, file-based compliance management system to track ISO 27001 certification (active), with future expansion to SOC 1-2-3 and GDPR. The system replaces Word/Excel documents managed by an external consultant.

## Key Architectural Decisions

### 1. File-Based, Git-Backed Architecture

**Decision**: All compliance data lives as structured files in a git repository. No database.

**Rationale**:

- Git provides audit trail, version control, and approval workflows (PRs) for free
- The team is technical (IT Director + Engineering) and already lives in git
- No infrastructure to maintain, no vendor lock-in
- Auditors care about content and change history, not the tool that produces it

### 2. Multi-Framework Structure from Day One

**Decision**: The repo structure separates framework-specific artifacts from shared documents. Shared documents declare which frameworks they serve in a `frameworks` frontmatter field.

**Rationale**:

- Most documents (policies, risks, evidence) serve multiple frameworks simultaneously
- Some artifacts are framework-specific (ISO SoA, GDPR DPIA, SOC 2 criteria)
- Adding a new framework = new directory under `frameworks/` + tagging existing shared documents
- No restructuring or script refactoring needed when onboarding SOC 2 or GDPR

**Structure summary:**

- `frameworks/{name}/` — Framework-specific artifacts (controls, criteria, articles, SoA, DPIA, etc.)
- `frameworks/mappings/` — Cross-framework mappings (ISO control X = SOC 2 criteria Y)
- `policies/`, `risks/`, `evidence/`, `vendors/`, `training/`, `incidents/` — Shared, tagged via frontmatter
- `audits/{name}/` — Per-framework audit trails (each framework has its own audit cycle)
- `audits/corrective-actions/` — Shared (a CAPA can address findings across frameworks)
- `program/` — Framework-agnostic program management (replaces "ISMS" which is ISO-specific terminology)

### 3. File Formats

| Content Type | Format | Location |
| --- | --- | --- |
| Policies, procedures | Markdown + YAML frontmatter | `policies/`, `procedures/` |
| Risks | Individual YAML files (one per risk) | `risks/` |
| ISO 27001 controls | Individual YAML files (one per control) | `frameworks/iso27001/controls/` |
| SOC 2 criteria | Individual YAML files (one per criterion) | `frameworks/soc2/criteria/` |
| GDPR articles | Individual YAML files | `frameworks/gdpr/articles/` |
| Evidence registry | Single YAML file | `evidence/_registry.yml` |
| Asset register, vendor register | Individual YAML files | One record per file pattern |
| Program lifecycle docs | Markdown or YAML depending on content | `program/` |

**Critical pattern**: One record per file for anything that multiple people might edit. This avoids merge conflicts entirely.

### 4. Deterministic Scripts Over AI for Computed Data

**Decision**: Relationship graph, staleness checks, change propagation, and validation are all handled by deterministic Node.js scripts, NOT by AI/Claude Code.

**Rationale**:

- These operations are fully deterministic and should produce the same output every time
- No token cost for routine operations
- Claude Code is reserved for authoring content and asking questions about the data

**Scripts to build:**

- `scripts/build-graph.js` — Parses all YAML/frontmatter files, builds `.computed/graph.json` (framework-aware)
- `scripts/check-propagation.js` — Pre-commit hook that flags downstream documents needing review
- `scripts/validate.js` — Validates all files against YAML schemas
- `scripts/update-evidence-registry.js` — Updates evidence freshness after automated collection
- `scripts/onboard-framework.js` — Assists with tagging existing documents when adding a new framework

### 5. Web App as Dumb Viewer/Editor

**Decision**: A local web app that reads/writes files via the filesystem. No git operations, no database, no auth.

**Rationale**:

- The app's job is to render dashboards and provide edit forms
- Git operations (commit, PR, push) are done via CLI, VS Code, or SourceTree
- This keeps the web app extremely simple — it's just a filesystem UI
- Dashboard views support a global framework filter (ISO 27001 / SOC 2 / GDPR / All)

### 6. Evidence Collection via GitHub Actions

**Decision**: Scheduled GitHub Actions collect evidence from AWS, GitHub, Google Workspace, Jira, etc. and open PRs with the collected data.

**Rationale**:

- Free tier GitHub Actions is sufficient for weekly/monthly collection
- PRs provide human review of collected evidence (merging = approval)
- Evidence is stored as files in the repo, maintaining the single-source-of-truth pattern
- No always-on infrastructure needed
- The same evidence can satisfy multiple frameworks via the `frameworks` tag in the evidence registry

### 7. Change Propagation via Pre-Commit Hooks

**Decision**: Pre-commit hooks run deterministic scripts to warn (not block) about downstream documents that may need review when a file is modified.

**Rationale**:

- The core pain point is invisible relationships between documents
- Files declare their relationships in frontmatter (`triggers_update_to`, `triggered_by`)
- The propagation script reads the graph and flags affected files
- Pending reviews accumulate in `.computed/pending-reviews.json` for dashboard visibility

## Features Included

### Core (Must Have)

1. **Control Framework & Statement of Applicability** — ISO 27001:2022 Annex A (93 controls), with structure ready for SOC 2 criteria and GDPR articles. SoA generated from control files.
2. **Risk Assessment & Treatment** — Risk register with scoring, treatment plans, asset register. Risks tagged to multiple frameworks.
3. **Policy & Document Management** — Markdown policies with metadata, versioning via git, review tracking. Policies declare which frameworks they serve.
4. **Evidence Collection & Monitoring** — Automated collection via GitHub Actions, manual upload, freshness tracking. Evidence tagged per framework.
5. **Audit Management** — Per-framework audit trails, internal audit findings, shared CAPA tracking, evidence packaging.
6. **Dashboards & Reporting** — Local web app with compliance posture per framework, risk heatmap, evidence tracker, framework coverage.
7. **Program Lifecycle** — Management review support, continual improvement log, scope/context docs. Framework-agnostic.

### Nice to Have

- **Task Management (#6)**: Not building task tracking — Jira and Freshdesk handle this. May add light Jira integration for creating review tasks from propagation flags.
- **Vendor Risk (#7)**: Simple vendor register with YAML files and assessment tracking. Easy to build later.
- **Training (#8)**: KnowBe4 handles training. We just log completions in `training/training-log.yml`.
- **Incident Management (#9)**: Lightweight incident log in YAML that links to Jira/Freshdesk tickets. The log captures: ID, Jira key, Freshdesk ID, dates, severity, root cause, corrective action reference, lessons learned, and affected controls. The auditor needs to see we have a process, follow it, and learn from incidents.

## Integration Points

| System | Integration Method | Priority |
| --- | --- | --- |
| AWS | GitHub Actions + AWS CLI (OIDC auth) | High — Phase 2 |
| GitHub | GitHub Actions + `gh` CLI | High — Phase 2 |
| Google Workspace | GitHub Actions + Admin SDK (service account) | High — Phase 2 |
| Jira | GitHub Actions + Jira API (or MCP in Claude Code) | Medium — Phase 2 |
| Confluence | MCP integration in Claude Code for publishing | Low — Phase 4 |
| Freshdesk | GitHub Actions + API for incident metrics | Low — Phase 2 |
| Slack | Webhook for staleness alerts | Medium — Phase 2 |
| KnowBe4 | Manual export or API for training completions | Low — Phase 2 |
| Lucidchart | Manual export for architecture diagrams | Low — Phase 4 |
| GCP | GitHub Actions + gcloud CLI | Low — Phase 2 |

## Relationship Graph Design

The graph is built by `scripts/build-graph.js` and stored in `.computed/graph.json`.

**Structure:**

```json
{
  "generated_at": "2026-02-16T12:00:00Z",
  "nodes": {
    "policies/access-control.md": {
      "id": "POL-003",
      "title": "Access Control Policy",
      "type": "policy",
      "owner": "j.ledoux",
      "status": "approved",
      "next_review": "2027-01-15",
      "frameworks": {
        "iso27001": { "controls": ["A.5.15", "A.5.16", "A.8.2", "A.8.3"] },
        "soc2": { "criteria": ["CC6.1", "CC6.3"] }
      },
      "triggers_update_to": ["procedures/user-provisioning.md"],
      "triggered_by": ["risks/R-015.yml"]
    }
  },
  "edges": [
    { "from": "policies/access-control.md", "to": "frameworks/iso27001/controls/A-8-3.yml", "type": "implements", "framework": "iso27001" },
    { "from": "policies/access-control.md", "to": "frameworks/soc2/criteria/CC6-1.yml", "type": "implements", "framework": "soc2" },
    { "from": "policies/access-control.md", "to": "procedures/user-provisioning.md", "type": "triggers_update" },
    { "from": "risks/R-015.yml", "to": "policies/access-control.md", "type": "triggers_update" }
  ],
  "indexes": {
    "by_framework": {
      "iso27001": {
        "by_control": {
          "A.8.3": {
            "policies": ["policies/access-control.md"],
            "evidence": ["evidence/automated/aws/2026-02-10/iam-details.json"],
            "risks": ["risks/R-015.yml"]
          }
        },
        "coverage": { "total": 93, "implemented": 71, "with_evidence": 65, "gaps": 12 }
      },
      "soc2": {
        "by_criterion": { ... },
        "coverage": { ... }
      }
    },
    "by_policy": {},
    "by_risk": {},
    "stale": [],
    "orphaned_controls": [],
    "gaps": []
  }
}
```

**How relationships are declared:**

Files declare their own relationships in frontmatter:

- `frameworks.iso27001.controls: [A.8.3]` — "I implement this ISO 27001 control"
- `frameworks.soc2.criteria: [CC6.1]` — "I satisfy this SOC 2 criterion"
- `frameworks.gdpr.articles: [Article 32]` — "I address this GDPR article"
- `triggers_update_to: [path]` — "If I change, this file needs review"
- `triggered_by: [path]` — "If this file changes, I need review"

The graph builder resolves all these into a unified graph with forward and reverse lookups, indexed per framework.

## Evidence Collection Design

Evidence is collected by GitHub Actions on a schedule:

1. Action runs collector script for a specific source (AWS, GitHub, etc.)
2. Collector writes JSON/text files to `evidence/automated/{source}/{date}/`
3. `scripts/update-evidence-registry.js` updates `evidence/_registry.yml` with freshness data
4. Action opens a PR with the new evidence files
5. Human reviews and merges the PR

**Evidence registry schema (multi-framework):**

```yaml
evidence:
  - id: EVD-001
    title: AWS Config Compliance Rules
    frameworks:
      iso27001:
        controls: [A.8.9]
      soc2:
        criteria: [CC7.1]
    source: aws
    collection: automated
    frequency: weekly
    last_collected: 2026-02-10
    next_due: 2026-02-17
    path: evidence/automated/aws/2026-02-10/config-compliance.json
    status: current  # current | stale | missing
```

**Collection schedule:**

| Source | Frequency | Key ISO 27001 Controls |
| --- | --- | --- |
| AWS | Weekly | A.8.2, A.8.3, A.8.9, A.8.13, A.8.15, A.8.16, A.8.20, A.8.24 |
| GitHub | Weekly | A.8.4, A.8.8, A.8.32, A.5.16 |
| Google Workspace | Weekly | A.5.16, A.6.1, A.6.5, A.8.1, A.8.2, A.8.5 |
| Jira | Weekly | A.5.24-28, clause 10.2 |
| Freshdesk | Monthly | A.5.24 |
| KnowBe4 | Monthly | A.6.3 |
| GCP | Weekly | Same as AWS for GCP resources |

When SOC 2 / GDPR are onboarded, the same evidence gains additional framework tags via cross-framework mappings — no new collectors needed.

## Web App Design

**Scope**: Read files from disk, render dashboards, provide edit forms, write changes back to disk.

**NOT in scope**: Git operations, authentication, database.

**Global framework selector**: All views support filtering by framework (ISO 27001 / SOC 2 / GDPR / All).

**Views:**

| View | Data Source |
| --- | --- |
| Posture Overview | `.computed/dashboard-stats.json` (per framework) |
| Control Register | `frameworks/{fw}/controls/*.yml` or `criteria/*.yml` |
| Statement of Applicability | `.computed/soa.json` (ISO 27001 specific) |
| Risk Register + Heatmap | `risks/*.yml` (filterable by framework) |
| Policy Register | `policies/*.md` frontmatter (shows frameworks served) |
| Evidence Tracker | `evidence/_registry.yml` (filterable by framework) |
| Pending Reviews | `.computed/pending-reviews.json` |
| Audit Findings & CAPAs | `audits/{fw}/*/findings/*.yml`, `audits/corrective-actions/*.yml` |
| Impact Explorer | `.computed/graph.json` edges |
| Framework Coverage | `.computed/framework-coverage.json` |

**Edit workflow**: Edit in web app -> file written to disk -> commit via git CLI/VS Code/SourceTree.

**Export formats**: PDF, Word, Excel for auditor-facing documents (SoA, risk register, management review report, evidence packages). Exports can be framework-specific.

## Claude Code Skills

Skills read from `.computed/graph.json` and present data. They do NOT compute the graph. Several skills accept an optional `[framework]` parameter for filtering.

| Skill | Purpose |
| --- | --- |
| `/compliance.impact <file>` | Show what's affected if a file changes (across all frameworks) |
| `/compliance.stale` | List documents past their review date |
| `/compliance.gap [framework]` | Show controls/criteria without evidence or implementation |
| `/compliance.status [framework]` | Quick compliance posture summary |
| `/compliance.soa` | Generate Statement of Applicability report (ISO 27001) |
| `/compliance.coverage [framework]` | Per-framework coverage: % of controls with evidence + policies |

## Technology Choices

| Component | Technology | Notes |
| --- | --- | --- |
| File parsing | `gray-matter` (frontmatter), `js-yaml` | Node.js |
| Graph builder | Custom Node.js script | Deterministic, framework-aware |
| Schema validation | `ajv` or custom | Validate YAML against schemas |
| Pre-commit hooks | `husky` or `lefthook` | Run validation + graph build + propagation check |
| Evidence collection | GitHub Actions + source-specific CLI/API | Scheduled, opens PRs |
| Web app | Astro, SvelteKit, or Next.js (TBD) | Local, reads filesystem |
| Export | `markdown-pdf`, `docx`, `exceljs` | Generate auditor deliverables |

## Comparison to Commercial Tools

We intentionally chose NOT to use Vanta, Drata, CompAI, or Sprinto because:

- **Cost**: $15,000-50,000/year vs ~$0
- **Our team is technical**: We don't need a GUI-first tool
- **We value control**: Own our data, no vendor dependency
- **Integration count is small**: ~10 systems, not 200+
- **Multi-framework support**: Our structure handles this natively via frontmatter tags

The main thing we give up is pre-built integrations with 200+ SaaS tools and auditor marketplace features. We don't need either of those.

## Documentation Format Clarification (Important for Future Reference)

A question came up about whether each compliance framework requires documentation in its own specific format, and whether shared policies would work across auditors.

**The answer: it depends on the framework.**

### Frameworks where internal format is fine (our current scope)

- **ISO 27001**: Auditors (BSI, DNV, LRQA) care about content, completeness, and that you follow your own processes. Markdown exported to PDF is perfectly acceptable. No prescribed template.
- **SOC 2**: The CPA firm writes the SOC 2 report themselves. You provide evidence and answer questions. Internal policies can be any format. You do need a "System Description" in a specific structure, but that's a framework-specific doc under `frameworks/soc2/`.
- **GDPR**: No mandated format for policies. The ROPA (Article 30) has required fields but no template. DPIAs are framework-specific docs under `frameworks/gdpr/dpia/`.

### Frameworks where format IS prescribed (future, if ever)

- **FedRAMP**: Extremely prescriptive. Mandates specific templates for SSP, SAP, SAR, POA&M. You cannot hand them your internal policy — it must be in their template.

### How our architecture handles both

The system uses a two-layer model:

```
Layer 1: Internal Source of Truth (this repo)
  - Policies, risks, evidence in our canonical format
  - Tagged with which frameworks they serve
  - This is what we work with day to day

Layer 2: Export / Packaging (generated on demand)
  - ISO 27001: Our internal docs + SoA → mostly just PDF export
  - SOC 2: Evidence package + System Description → auditor assembles report
  - GDPR: ROPA export + DPIA docs → standard exports
  - FedRAMP (if ever): Content assembled into prescribed templates via export scripts
```

For ISO/SOC 2/GDPR, Layer 1 IS the deliverable. For FedRAMP, we would add export scripts that pull content from shared policies into FedRAMP-specific templates. The underlying data stays the same — only the packaging changes.

**No structural changes needed.** The `frameworks/{name}/` directory already supports framework-specific documents and templates. A future `scripts/export-fedramp-ssp.js` would assemble content from shared files into prescribed formats.

## GitHub CODEOWNERS for Policy Approval Enforcement

**Decision**: Use GitHub CODEOWNERS to enforce that document owners must approve PRs containing changes to their files.

**Rationale**:

- The `owner` field in policy frontmatter already tracks who owns each document
- CODEOWNERS makes approval mandatory at the PR level — the owner must click "Approve" before merge
- This is especially important for policies owned by the CEO or other non-technical stakeholders: engineering authors the changes, the owner approves the PR
- Git records both who wrote the change and who approved it, giving auditors a clear accountability trail
- This is stronger than most commercial compliance tools, which treat approvals as optional

**Implementation**:

- `.github/CODEOWNERS` maps file paths to GitHub usernames
- Patterns can target individual files (`policies/information-security-policy.md @ceo`) or globs (`policies/access-control*.md @j-ledoux`)
- Branch protection rules on `main` must require CODEOWNERS approval
- Non-technical owners just use the GitHub PR UI to review and approve — no git knowledge needed

**When to set up**: Phase 1.1 (repository structure setup), refined as policies are converted in Phase 1.2.

## What to Build Next

If you're picking this up in a new session, the next steps are:

1. **Set up the full directory structure** (see implementation-plan.md, Phase 1.1)
2. **Define YAML schemas** for policies, risks, controls, evidence (all with `frameworks` field)
3. **Build `scripts/build-graph.js`** — the core deterministic graph builder (framework-aware)
4. **Build `scripts/validate.js`** — schema validation
5. **Create the 93 Annex A control files** under `frameworks/iso27001/controls/`
6. **Convert existing consultant documents** into the file format with `frameworks` frontmatter
7. **Set up pre-commit hooks** with husky/lefthook

The implementation plan (`docs/implementation-plan.md`) has the full phased breakdown.
