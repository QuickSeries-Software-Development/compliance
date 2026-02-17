# Compliance Gap Analysis

Identify controls and criteria that lack full implementation or evidence coverage. This skill highlights where work is needed to achieve or maintain compliance.

## Input

The user may optionally provide a framework name: `$ARGUMENTS`

Valid framework values: `iso27001`, `soc2`, `gdpr`, or empty for all frameworks.

## Instructions

1. Read `.computed/graph.json` and `.computed/framework-coverage.json` using the Read tool. If either file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse both JSON files.
3. If `$ARGUMENTS` specifies a framework, filter the analysis to that framework only. If empty or not provided, analyze all frameworks.
4. Identify three categories of gaps:
   - **No implementing policies**: Controls/criteria that are marked as applicable but have zero policies mapped to them.
   - **No evidence**: Controls/criteria that are applicable but have no evidence items linked to them.
   - **Not started or planned**: Controls/criteria whose implementation status is `not-started` or `planned` (i.e., not yet `in-progress` or `implemented`).
5. A single control can appear in multiple gap categories. That is expected.
6. Sort gaps within each category by control ID.
7. Present the results.

## Output Format

### Compliance Gap Analysis

**Framework:** <framework name, or "All Frameworks">

**Summary:** X total gaps found across Y controls/criteria.

#### Controls Missing Implementing Policies

| Framework | Control ID | Title | Status |
| --- | --- | --- | --- |
| ISO 27001 | A.5.1 | Policies for information security | planned |

#### Controls Missing Evidence

| Framework | Control ID | Title | Implementing Policies | Status |
| --- | --- | --- | --- | --- |
| ISO 27001 | A.5.1 | Policies for information security | 1 policy | planned |

#### Controls Not Yet Started or Only Planned

| Framework | Control ID | Title | Has Policies | Has Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| ISO 27001 | A.5.1 | Policies for information security | No | No | not-started |

If no gaps are found for a category, state "None — all controls in this category are covered."

End with: "**Priority actions:** Focus on the N controls that appear in multiple gap categories, as these represent the largest compliance risk."
