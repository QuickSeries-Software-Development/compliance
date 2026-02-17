# Compliance Status Dashboard

Provide a quick summary of overall compliance posture, including policy counts, control implementation status, risk levels, and evidence freshness. Highlights items needing attention.

## Input

The user may optionally provide a framework name: `$ARGUMENTS`

Valid framework values: `iso27001`, `soc2`, `gdpr`, or empty for all frameworks.

## Instructions

1. Read `.computed/dashboard-stats.json` using the Read tool. If the file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse the JSON content.
3. If `$ARGUMENTS` specifies a framework, filter the dashboard to that framework. If empty, show a combined view across all frameworks.
4. Extract and present the following metrics:
   - **Policies**: Total count, count by status (draft, approved, under-review)
   - **Controls by implementation status**: Count of implemented, in-progress, planned, not-started, and not-applicable for each framework
   - **Risks by level**: Count of critical, high, medium, low risks
   - **Evidence freshness**: Count of fresh, aging, stale, missing evidence items
5. Identify attention items:
   - Any critical or high risks
   - Any stale documents (past review date)
   - Any controls with gaps (applicable but no policy or no evidence)
   - Any evidence items that are stale or missing
6. Present no more than 10 attention items, prioritized by severity.

## Output Format

### Compliance Status

**As of:** <today's date>
**Scope:** <framework name or "All Frameworks">

#### Policies

| Status | Count |
| --- | --- |
| Approved | N |
| Draft | N |
| Under Review | N |
| **Total** | **N** |

#### Controls by Implementation Status

| Framework | Implemented | In Progress | Planned | Not Started | N/A | Total |
| --- | --- | --- | --- | --- | --- | --- |
| ISO 27001 | N | N | N | N | N | N |
| SOC 2 | N | N | N | N | N | N |
| GDPR | N | N | N | N | N | N |

(Only show rows for the selected framework if one is specified.)

#### Risk Overview

| Level | Count |
| --- | --- |
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

#### Evidence Freshness

| Status | Count |
| --- | --- |
| Fresh | N |
| Aging | N |
| Stale | N |
| Missing | N |

#### Attention Items

1. **[CRITICAL]** Description of the item
2. **[HIGH]** Description of the item
3. ...

If there are no attention items, state: "No immediate issues. Compliance posture is healthy."
