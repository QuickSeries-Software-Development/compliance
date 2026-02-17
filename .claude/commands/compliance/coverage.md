# Framework Coverage Report

Show how much of a compliance framework is covered by policies and evidence. Provides percentage metrics and lists specific uncovered controls to guide implementation efforts.

## Input

The user may optionally provide a framework name: `$ARGUMENTS`

Valid framework values: `iso27001`, `soc2`, `gdpr`, or empty to compare all frameworks.

## Instructions

1. Read `.computed/framework-coverage.json` using the Read tool. If the file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse the JSON content.
3. If `$ARGUMENTS` specifies a framework, show detailed coverage for that framework. If empty, show a comparison across all frameworks.
4. For each framework in scope, calculate or extract:
   - **Total applicable controls/criteria**: Count of controls that are not marked as not-applicable.
   - **Policy coverage**: Percentage of applicable controls that have at least one implementing policy mapped.
   - **Evidence coverage**: Percentage of applicable controls that have at least one evidence item linked.
   - **Implementation percentage**: Percentage of applicable controls with status `implemented`.
   - **Full coverage**: Percentage of applicable controls that have both a policy AND evidence AND are marked as implemented.
5. If showing a single framework, also list the specific uncovered controls — those that are applicable but missing policies, evidence, or both.
6. Sort uncovered controls by control ID.

## Output Format

### Framework Coverage Report

**Generated:** <today's date>

#### Coverage Comparison

| Framework | Applicable | Policy Coverage | Evidence Coverage | Implemented | Fully Covered |
| --- | --- | --- | --- | --- | --- |
| ISO 27001 | N controls | XX% | XX% | XX% | XX% |
| SOC 2 | N criteria | XX% | XX% | XX% | XX% |
| GDPR | N articles | XX% | XX% | XX% | XX% |

(Show only the selected framework row if one is specified.)

#### Uncovered Controls (shown when a specific framework is selected)

##### Missing Policies

| Control ID | Title | Status | Has Evidence |
| --- | --- | --- | --- |
| A.5.2 | Information security roles | planned | No |

##### Missing Evidence

| Control ID | Title | Status | Has Policies |
| --- | --- | --- | --- |
| A.5.3 | Segregation of duties | in-progress | Yes |

##### Missing Both Policies and Evidence

| Control ID | Title | Status |
| --- | --- | --- |
| A.5.4 | Management responsibilities | not-started |

If all controls are fully covered, state: "All applicable controls have implementing policies, evidence, and are marked as implemented."

End with: "**Next steps:** Address the N controls missing both policies and evidence first, as these represent the largest coverage gaps."
