---
id: POL-007
title: "Access Control Policy"
owner: e.stpierre
status: approved
version: "1.0"
approved_date: 2025-12-08
next_review: 2026-12-08
frameworks:
  iso27001:
    controls: [A.5.15, A.5.16, A.5.17, A.5.18, A.8.2, A.8.3, A.8.4, A.8.5]
triggers_update_to: []
triggered_by: []
---

# Access Control Policy

## Purpose, scope and users

The purpose of this document is to define rules for access to various
systems, equipment, facilities and information, based on business and
security requirements for access.

This document is applied to the entire Information Security Management
System (ISMS) scope, i.e. to all systems, equipment, facilities and
information used within the ISMS scope.

Users of this document are all employees of QuickSeries Publishing.

## Reference documents

- ISO/IEC 27001 standard, clauses A.5.15, A.5.16, A.5.17, A.5.18, A.8.2,
  A.8.3, A.8.4, and A.8.5

- ISMS Policy

- Statement of Applicability

- Information Classification Policy

- Statement of Acceptance of the ISMS Documents

- List of Legal, Regulatory, Contractual and Other Requirements

## Access control

### Introduction

The basic access control principle is that access to all systems,
networks, services, and information is forbidden, unless expressly
permitted to individual users or groups of users.

Access to all physical areas in the organization is allowed, except to
areas for which privilege must be granted by the authorized person
(section "Privilege management").

This Policy specifies rules for access to systems, services and
facilities, while the Information Classification Policy defines rules
for access to individual documents and records.

### List of User Profiles

| Profile | Job Title/Department |
| --- | --- |
| Executive Management | CEO, President, Shareholders |
| Upper Management | G7, VPs |
| Lower Management | Divion Managers, Senior Editor |
| Accounting | Accounting and HR personnel |
| Marketing | Marketing Director |
| Sales | Account Managers, Sales Support |
| Content | Editors, Graphic Designers |
| Development | Developers, QA Analysts |
| IT | Developer, technical support, sysadmin |
| Other | Warehouse staff |

### Executive Management

Executive Management has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | All access |
| CRM (FileMaker / Moneta) | All access |
| Accounting Documents | All access |
| HR documents | All access |
| Infrastructure configuration (config files, passwords, etc) | available on demand |
| Source code for our QS Connect | available on demand |
| Customer information | All access |
| Sales information (sales reports, statistics, etc) | All access |

The following job titles have access rights according to Executive
Management:

- President

- CEO

- Partners / Stakeholders

### Upper Management

Upper Management has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | Restricted -- Own Department Only |
| CRM (FileMaker / Moneta) | All Access |
| Accounting Documents | Restricted -- Accounting VP Only |
| HR documents | Restricted -- Own department only |
| Infrastructure configuration (config files, passwords, etc) | No Access |
| Source code for our QS Connect | No Access |
| Customer information | All Access |
| Sales information (sales reports, statistics, etc) | All Access |

The following job titles have access rights according to Upper
Management:

- Marketing Director

- VP Business Development

- VP Finance

### Account Managers

Account Managers has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | Shared "Sales" folder: All Access, "INTERNAL USE": Read-Only, "Restricted for sales": Read-Only |
| CRM (FileMaker / Moneta) | Restricted -- Own accounts/customers only |
| Accounting Documents | No Access |
| HR documents | No Access |
| Infrastructure configuration (config files, passwords, etc) | No Access |
| Source code for our QS Connect | No Access |
| Customer information | Read-Only |
| Sales information (sales reports, statistics, etc) | Restricted -- Own sales information only |

### Marketing

Marketing has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | Restricted -- Own Department Only |
| CRM (FileMaker / Moneta) | All Access -- Read-Only |
| Accounting Documents | No Access |
| HR documents | No Access |
| Infrastructure configuration (config files, passwords, etc) | No Access |
| Website and social media content | All Access |
| Customer information | All Access -- Read-Only |
| Sales information (sales reports, statistics, etc) | No Access |

The following job titles have access rights according to Marketing:

- Marketing Director

### Content

Content group has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | Restricted -- Own Department Only |
| CRM (FileMaker / Moneta) | All Access -- Read-Only |
| Accounting Documents | No Access |
| HR documents | No Access |
| Infrastructure configuration (config files, passwords, etc) | No Access |
| Content for our products | All Access |
| Customer information | No Access |
| Sales information (sales reports, statistics, etc) | No Access |

The following job titles have access rights according to Content:

- Editor

- Graphic Designer

- Artistic Director

### Development

Development group has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | Restricted -- Own Department Only |
| CRM (FileMaker / Moneta) | No Access |
| Accounting Documents | No Access |
| HR documents | No Access |
| Infrastructure configuration (config files, passwords, etc) | Team Leader: All Access, Developers: Read-Only, QA: Read-Only |
| Source Code | All Access |
| Customer information | No Access |
| Sales information (sales reports, statistics, etc) | No Access |

The following job titles have access rights according to Development:

- Developer

- QA Analyst

- Team Leader

### IT

IT group has the following access rights:

| ***Name of system / network / service*** | ***User rights*** |
| --- | --- |
| Google Drive | All Access |
| CRM (FileMaker / Moneta) | All Access |
| Accounting Documents | No Access |
| HR documents | No Access |
| Infrastructure configuration (config files, passwords, etc) | All Access |
| Source Code | No Access |
| Customer information | All Access |
| Sales information (sales reports, statistics, etc) | No Access |

The following job titles have access rights according to IT:

- Tech support specialist

- Sysadmin

- CRM Developer

### Privilege management

Privileges in respect to the above mentioned user profiles (granting or
removing access rights) are allocated in the following way:

| ***Name of system / network / service / physical area*** | ***Who is authorized for granting or removing access rights*** | ***Form of authorization process*** |
| --- | --- | --- |
| Google Drive | IT Director | Part of hiring process, ticket request from shared drive owner |
| CRM (FileMaker / Moneta) | IT Director | Part of hiring process, ticket request from VP Sales |
| Accounting Documents | VP Finance | N/A |
| HR documents | VP Finance | N/A |
| Infrastructure configuration (config files, passwords, etc) | CTO | Email request to CTO |
| Source Code | CTO | Email request to CTO |
| Customer information | IT Director | Ticket request |

When allocating privileges, the person responsible must take into
account business and security requirements for access (defined in risk
assessment), as well as the classification of information which is
accessed with such access rights, in accordance with the Information
Classification Policy.

### Regular review of access rights

Owners of each system and owners of facilities for which special access
rights are required must, at the following intervals, review whether the
access rights granted are in line with business and security
requirements:

| ***Name of system / network / service / physical area*** | ***Intervals for regular review*** |
| --- | --- |
| All Systems | At least once a year |

Each review should be recorded in the Evidence section of our IT shared
drive in Google Drive.

### Change of status or termination of contract

Upon change of employment or termination of employment, the direct
manager of the employee must immediately inform the responsible persons
who approved privileges for the employee in question.

Upon change of contractual relations with external parties who have
access to systems, services and facilities, or upon expiration of the
contract, contract owner must immediately inform the responsible persons
who approved privileges for the external parties in question.

The access rights for all the persons who have changed their employment
status or contractual relationship must immediately be removed or
changed by responsible persons as defined in the next section.

### Technical implementation

The technical implementation of the allocation or removal of access
rights is carried out by the following persons:

| ***Name of system / network / service / physical area*** | ***Person responsible for implementation*** |
| --- | --- |
| All systems | IT Director |

Persons listed in this table may not grant or remove access rights
freely but only based on user profiles defined in this Policy, and
requests by persons authorized for allocation of privileges.

### Secure authentication

The IT Director must ensure that a secure log-on procedure is
implemented for all devices, systems, and services.

### User password management

When allocating and using user passwords, the following rules must be
complied with:

- by signing the Statement of Acceptance of ISMS Documents, users also
  accept the obligation to keep passwords confidential, as prescribed by
  this document

- each user may use only his/her own uniquely allocated username

- each user must have the option to choose his/her own password, where
  applicable

- the temporary password used for first system log-on must be unique and
  strong, as described above

- temporary passwords must be communicated to the user in a secure
  manner, and user's identity must be checked prior

- the password management system must require the user to change the
  temporary password at first log-on to the system

- the password management system must require the user to select strong
  passwords

- if the user requests a new password, the password management system
  must determine the identity of the user by phone or Slack call

- the password must not be visible on the screen during log-on

- if a user enters an incorrect password three consecutive times, the
  system must block the user account in question on applicable systems
  where the feature is possible

- passwords created by the software or hardware manufacturer must be
  changed during initial installation

- files containing passwords must be stored separately from the
  application's system data
