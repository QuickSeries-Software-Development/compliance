# Compliance Management System: Executive Summary

## The Problem

We are pursuing ISO 27001 certification and will expand to SOC 2 and GDPR compliance. Today, our compliance artifacts live in Word documents and Excel spreadsheets managed by our consultant. This creates several pain points:

- **No visibility into relationships**: When a policy changes, we have no way to know which procedures, evidence, or controls are affected.
- **No change propagation**: Updates to the risk assessment don't automatically flag which documents need revision.
- **No freshness tracking**: We can't tell at a glance which evidence is current and which is stale.
- **No single source of truth**: Documents are scattered, versioning is manual, and the audit trail is weak.
- **Manual evidence collection**: Gathering proof of compliance from AWS, GitHub, Google Workspace, etc. is entirely manual and time-consuming.

## The Proposed Solution

We will build an internal, file-based compliance management system using tools and workflows we already know. The core idea:

**All compliance documents live as structured files in a git repository. Deterministic scripts compute relationships, track freshness, and flag what needs attention. GitHub Actions automate evidence collection. A lightweight local web app provides dashboards and reporting.**

### Why This Approach

| Concern | How We Solve It |
| --- | --- |
| Audit trail | Git history shows who changed what, when, and why |
| Version control | Built into git with full diff capability |
| Approval workflows | Pull requests for policy changes (reviewer = approver) |
| Relationship tracking | Deterministic scripts parse file metadata and build a relationship graph |
| Change propagation | Pre-commit hooks flag downstream documents that need review |
| Evidence freshness | Automated weekly/monthly collection via GitHub Actions |
| Reporting | Local web app reads files and renders dashboards |
| Data portability | Plain files with no vendor lock-in |
| Backup & disaster recovery | Standard git remote (GitHub) |

### Multi-Framework by Design

The system is architected from day one to support multiple compliance frameworks. Shared documents (policies, risks, evidence) declare which frameworks they serve, while framework-specific artifacts (ISO controls, SOC 2 criteria, GDPR articles) live in dedicated directories. Adding a new framework means adding a directory and tagging existing documents — not restructuring anything.

### What We Are NOT Building

- A SaaS product or public-facing application
- A replacement for Jira, Freshdesk, KnowBe4, or any existing tool
- A database-backed application (files are the database)
- Anything that requires ongoing infrastructure or hosting costs

## Comparison to Commercial Tools

Tools like Vanta, Drata, CompAI, and Sprinto cost $15,000-50,000/year and are designed for companies that need:

- 200+ pre-built integrations with third-party SaaS tools
- Multi-framework compliance out of the box
- Auditor networks and marketplace features
- Dedicated compliance teams with non-technical users

**Our situation is different:**

- We have a small technical team (IT Director + Engineering) managing compliance
- We need ISO 27001 now, with SOC 2 and GDPR as near-term additions
- We already have the integrations we need (AWS, GitHub, Jira, Google Workspace, etc.)
- We were going to collect evidence manually anyway
- We value control over our data and processes

### Cost Comparison

| Approach | Year 1 Cost | Ongoing Annual Cost |
| --- | --- | --- |
| Commercial tool (Vanta/Drata) | $20,000-40,000 | $15,000-30,000 |
| Our approach | ~$0 (internal time) | ~$0 (GitHub Actions free tier) |

The investment is our time to set up the repository, convert documents, and build the scripts. The ongoing cost is near zero since everything runs on free-tier GitHub Actions and local tooling.

## Key Benefits

1. **Immediate clarity**: We can see exactly which documents relate to which controls, risks, and evidence.
2. **Change confidence**: When something changes, the system tells us what else needs attention.
3. **Audit readiness**: Evidence is collected automatically, freshness is tracked, and everything has a git history.
4. **No new tools to learn**: We use git, VS Code, and the terminal, which we already know.
5. **Incremental adoption**: We can start with just the document conversion and add automation over time.
6. **Full ownership**: No vendor dependency, no subscription, no data stored externally.
7. **Multi-framework ready**: One policy, one piece of evidence, can satisfy ISO 27001, SOC 2, and GDPR simultaneously.

## Timeline

| Phase | Duration | Outcome |
| --- | --- | --- |
| 1. Foundation | 2-3 weeks | All documents converted, relationship graph working, core scripts built |
| 2. Automation | 3-4 weeks | Evidence collection automated for AWS, GitHub, Google Workspace |
| 3. Reporting | 2-3 weeks | Local web app with dashboards and SoA export |
| 4. Maturity | Ongoing | SOC 2 and GDPR framework onboarding, additional integrations, refinement |

## What We Need to Get Started

- Agreement on this approach (this document)
- Access to the consultant's current document set for conversion
- A private GitHub repository (already created)
- Service account credentials for evidence collection (AWS, GitHub, Google Workspace)

## Risk Assessment of This Approach

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Approach doesn't scale | Low | Medium | We can always migrate to a commercial tool; the structured data makes this easy |
| Key person dependency | Medium | Medium | Everything is documented in files; the system is self-describing |
| Auditor doesn't accept this format | Low | High | We can export to Word/PDF from markdown; auditors care about content, not format |
| Takes longer than expected | Medium | Low | Each phase delivers standalone value; we don't need all phases to benefit |
| Adding SOC 2 / GDPR is harder than expected | Low | Low | Structure is multi-framework from day one; adding a framework = new directory + tagging |
