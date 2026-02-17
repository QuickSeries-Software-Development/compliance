---
id: POL-005
title: "Change Management Policy"
owner: e.stpierre
status: approved
version: "1.1"
approved_date: 2026-01-29
next_review: 2027-01-29
frameworks:
  iso27001:
    controls: [A.8.32]
triggers_update_to: []
triggered_by: []
---

# Change Management Policy

## Purpose, scope and users

The purpose of this document is to define how changes to information
systems are controlled.

This document is applied to the entire Information Security Management
System (ISMS) scope, i.e. to all the information and communication
technology within the scope.

Users of this document are employees of IT Team and Development Team.

## Reference documents

- ISO/IEC 27001 standard, clause A.8.32

- ISMS Policy

## Change management

Each change to operational or production systems must be made in the
following way:

1. change may be proposed by the IT Director, the CTO or the
   Development Team Leader

2. change must be authorized by:

   a. CTO: for software technology, development tools and architecture
      design

   b. IT Director: for network infrastructure, cybersecurity and
      3rd-party tools and services

3. The person authorizing must:

   a. assess its justification for business and potential negative
      security impacts

   b. perform a risk assessment of the change required

   c. mention any rollback procedure in case of failure

4. Change must be implemented by a member of the IT Team or the
   Development Team

5. The person who authorized the change is responsible for checking
   that the change has been implemented in accordance with the
   requirements

6. A member of the IT or the Quality Assurance Team is responsible for
   testing and verifying the system's stability -- the system must not
   be put into production before thorough testing has been conducted

7. Implementation of changes must be reported to the following persons:

   a. IT Team members

   b. Development team members (including QA)

   c. Higher management (aka "G7"), for major changes to our backend
      or our infrastructure

8. The person who authorized the change is responsible for updating all
   the documents (policies, procedures, plans, etc.) that have been
   affected by the change

Change records are kept in Confluence (see section 4 for details).
