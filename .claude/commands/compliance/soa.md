# Statement of Applicability (ISO 27001)

Generate a formatted Statement of Applicability report for ISO 27001. The SoA is a required document that lists every Annex A control, states whether it is applicable, and provides justification and implementation details.

## Input

No required input. `$ARGUMENTS` is ignored for this skill.

## Instructions

1. Read `.computed/soa.json` using the Read tool. If the file does not exist, stop and tell the user to run `npm run build-graph` to generate computed data.
2. Parse the JSON content.
3. Group controls by their ISO 27001 category:
   - **Organizational controls** (A.5.x)
   - **People controls** (A.6.x)
   - **Physical controls** (A.7.x)
   - **Technological controls** (A.8.x)
4. For each control, extract: Control ID, Title, Applicable (Yes/No), Justification for inclusion or exclusion, Implementation Status, Implementing Policies (list of file paths or titles), and Evidence (list of evidence items).
5. Sort controls by ID within each category.
6. Present as formatted tables, one per category.

## Output Format

### Statement of Applicability — ISO 27001

**Generated:** <today's date>

#### Organizational Controls (A.5)

| Control | Title | Applicable | Justification | Status | Policies | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| A.5.1 | Policies for information security | Yes | Required for ISMS | Implemented | `policies/information-security.md` | 2 items |

#### People Controls (A.6)

| Control | Title | Applicable | Justification | Status | Policies | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| A.6.1 | Screening | Yes | HR requirement | In Progress | `policies/hr-security.md` | 1 item |

#### Physical Controls (A.7)

| Control | Title | Applicable | Justification | Status | Policies | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| A.7.1 | Physical security perimeters | No | Cloud-only, no physical premises | N/A | — | — |

#### Technological Controls (A.8)

| Control | Title | Applicable | Justification | Status | Policies | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| A.8.1 | User endpoint devices | Yes | All staff use laptops | Implemented | `policies/endpoint-security.md` | 3 items |

After all tables, provide a summary:

**SoA Summary:**

- Total controls: N
- Applicable: N
- Not applicable: N
- Implemented: N
- In progress: N
- Planned: N
- Not started: N
