# Impact Analysis

Show what is affected if a specific file changes, across all frameworks. This skill traces downstream dependencies, related controls, and connected risks to give a full picture of a change's blast radius.

## Input

The user provides a file path: `$ARGUMENTS`

## Instructions

1. Read `.computed/graph.json` using the Read tool. If the file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse the JSON content.
3. Normalize the input path from `$ARGUMENTS` — strip leading `./` or `/` so it matches the keys used in the graph. If the argument is empty, stop and ask the user which file they want to analyze.
4. Find the given file in the graph nodes. If not found, list a few similar node keys as suggestions and stop.
5. Gather the following data from the graph:
   - **Direct downstream documents**: All nodes reached via `triggers_update` edges originating from this file. These are documents that need review when this file changes.
   - **Upstream triggers**: All nodes that have a `triggers_update` edge pointing to this file. These are documents whose changes would require this file to be reviewed.
   - **Implemented controls**: All framework controls (ISO 27001, SOC 2, GDPR) that this file implements or maps to, as recorded in the graph edges or node metadata.
   - **Related risks**: All risk nodes that reference any of the same controls this file implements.
   - **Related evidence**: Any evidence nodes linked to this file or to the same controls.
6. Present the results as a structured impact summary.

## Output Format

Present the results under these headings:

### Impact Summary for `<file path>`

**Direct downstream (triggers_update):** List each downstream file path, one per line, with its type (policy, procedure, risk, etc.) if available.

**Upstream triggers (triggered_by):** List each upstream file path that triggers review of this file.

**Framework Controls:**

- Group by framework (ISO 27001, SOC 2, GDPR)
- List each control ID and title

**Related Risks:** List each risk with its ID, title, and risk level.

**Related Evidence:** List each evidence item linked to the same controls.

If any section has no items, state "None found" for that section.

End with a one-line summary: "Changing this file may require review of **N** downstream documents and touches **M** controls across **K** frameworks."
