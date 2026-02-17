# Stale Document Report

List all compliance documents that are past their scheduled review date, sorted by how overdue they are. This helps prioritize review efforts and maintain audit readiness.

## Input

No required input. `$ARGUMENTS` is ignored for this skill.

## Instructions

1. Read `.computed/stale-report.json` using the Read tool. If the file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse the JSON content.
3. Today's date is the current date. Calculate days overdue for each item by comparing its `next_review` or `review_date` field to today.
4. Sort all stale items by days overdue, most overdue first.
5. Group the sorted items by document type (policy, procedure, risk, or other categories present in the data).
6. For each item, extract: file path, title, owner, review date, and days overdue.
7. Present the results.

## Output Format

### Stale Documents Report

**Total overdue: N documents**

#### Policies (X overdue)

| Document | Owner | Review Due | Days Overdue |
| --- | --- | --- | --- |
| `path/to/file.md` — Title | owner name | YYYY-MM-DD | N |

#### Procedures (X overdue)

| Document | Owner | Review Due | Days Overdue |
| --- | --- | --- | --- |
| `path/to/file.md` — Title | owner name | YYYY-MM-DD | N |

#### Risks (X overdue)

| Document | Owner | Review Due | Days Overdue |
| --- | --- | --- | --- |
| `path/to/file.md` — Title | owner name | YYYY-MM-DD | N |

Repeat for any other document types found in the data.

If no stale documents are found, report: "All documents are current. No reviews overdue."

End with a summary line: "**Action needed:** N documents require immediate review. The most overdue is `<file>` at N days past due."
