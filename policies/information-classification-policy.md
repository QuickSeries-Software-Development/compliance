---
id: POL-004
title: "Information Classification Policy"
owner: r.ledoux
status: approved
version: "1.0"
approved_date: 2026-01-23
next_review: 2028-01-23
frameworks:
  iso27001:
    controls: [A.5.9, A.5.10, A.5.12, A.5.13, A.5.14, A.7.10, A.8.3, A.8.5, A.8.11, A.8.12]
triggers_update_to: []
triggered_by: []
---

# Information Classification Policy

## Purpose, scope and users

The purpose of this document is to ensure that information is protected
at an appropriate level.

This document is applied to the entire Information Security Management
System (ISMS) scope, i.e. to all types of information, regardless of the
form -- paper or electronic documents, applications and databases,
people's knowledge, etc.

Users of this document are all employees of QuickSeries Publishing.

## Reference documents

- ISO/IEC 27001 standard, clauses A.5.9, A.5.10, A.5.12, A.5.13, A.5.14,
  A.7.10, A.8.3, A.8.5, A.8.11, and A.8.12

- ISMS Policy

- Risk Assessment and Risk Treatment Report

- Statement of Applicability

- Inventory of Assets

- List of Legal, Regulatory, Contractual and Other Obligations

- Incident Management Procedure

- [Security Procedures for IT Department] / [Disposal and Destruction
  Policy]

- Acceptable Use Policy

## Classified information

### Steps and responsibilities

Steps and responsibilities for information management are the following:

| ***Step name*** | ***Responsibility*** |
| --- | --- |
| 1. Entering the information asset in the Inventory of Assets | Chief Executive Officer |
| 2. Classification of information | Asset owner |
| 3. Information labeling | Asset owner |
| 4. Information handling | Persons with access rights in accordance with this Policy |

If classified information is received from outside the organization,
Chief Executive Officer is responsible for its classification in
accordance with the rules prescribed in this Policy, and this person
becomes the owner of such an information asset.

### Classification of information

#### Classification criteria

The level of confidentiality is determined based on the following
criteria:

- value of information -- based on impacts assessed during risk
  assessment

- sensitivity and criticality of information -- based on the highest
  risk calculated for each information item during risk assessment

- legal and contractual obligations -- based on the List of Legal,
  Regulatory, Contractual and Other Obligations

#### Confidentiality levels

All information must be classified into confidentiality levels.

| ***Confidentiality level*** | ***Labeling*** | ***Classification criteria*** | ***Access restriction*** |
| --- | --- | --- | --- |
| Public | (unlabeled) | Making the information public cannot harm the organization in any way | Information is available to the public |
| Internal use | INTERNAL USE | Unauthorized access to information may cause **minor damage** and/or inconvenience to the organization | Information is available to all employees and selected third parties |
| Restricted | RESTRICTED | Unauthorized access to information may **considerably damage** the business and/or the organization's reputation | Information is available only to a specific group of employees and authorized third parties |
| Confidential | CONFIDENTIAL | Unauthorized access to information may cause **catastrophic (irreparable) damage** to business and/or to the organization's reputation | Information is available only to individuals in the organization |

The basic rule is to use the lowest confidentiality level ensuring an
appropriate level of protection, in order to avoid unnecessary
protection costs.

#### List of Authorized Persons

Information classified as "Restricted" and "Confidential" must be
accompanied by a List of Authorized Persons in which the information
owner specifies the names or job functions of persons who have the right
to access that information.

The same rule applies to the confidentiality level "Internal use" if
people outside the organization will have access to such a document.

#### Reclassification

Asset owners must review the confidentiality level of their information
assets every two years and assess whether the confidentiality level can
be changed. If possible, the confidentiality level should be lowered.

### Information labeling

Confidentiality levels are labeled in the following way:

- **paper documents** -- the confidentiality level is indicated in the
  top right corner of each document page; it is also indicated on the
  front of the cover or envelope carrying such a document as well as on
  the filing folder in which the document is stored

- **electronic documents** -- the confidentiality level is indicated in
  the top right corner of each document page -- or written explicitly in
  the document name (i.e. **Financial Data -- CONFIDENTIAL.xlsx**)

- **information systems** -- the confidentiality level in applications
  and databases must be indicated on the system access screen, as well
  as in the top right corner of each consecutive screen displaying
  confidential information

- **electronic mail** -- the confidentiality level is indicated in the
  first line of the e-mail body

- **electronic storage media** (disks, memory cards, etc.) -- the
  confidentiality level must be indicated on the top surface of such a
  medium

- **Personal computer:** all documents are considered RESTRICTED.

- **information transmitted orally** -- the confidentiality level of
  confidential information to be transmitted in face-to-face
  communication, by telephone or some other means of communication, must
  be communicated prior to the information itself

### Handling classified information

All persons accessing classified information must follow the rules
listed in the following table. Each Division Manager must initiate
disciplinary action each time the rules are breached or if the
information is communicated to unauthorized persons. Each incident
related to handling classified information must be reported in
accordance with the Incident Management Procedure.

Information assets may be taken off-premises only after obtaining
authorization in accordance with the Acceptable Use Policy.

The method for secure erasure and destruction of media is prescribed in
the document Security Procedures for IT Department / Disposal and
Destruction Policy.

+---------------+-------------------+--------------------+----------------------+
|               | ***Internal       | ***Restricted***   | ***Confidential***   |
|               | use***            |                    |                      |
+===============+===================+====================+======================+
| **Paper       | - if sent outside | - the document     | - the document must  |
| documents**   |   the             |   must be stored   |   be stored in a     |
|               |   organization,   |   in a locked      |   locked cabinet     |
|               |   the document    |   cabinet          |                      |
|               |   must be sent as |                    | - the document may   |
|               |   registered mail | - documents may be |   be transferred     |
|               |                   |   transferred      |   within and outside |
|               | - documents may   |   within and       |   the organization   |
|               |   only be kept in |   outside the      |   only by a          |
|               |   rooms without   |   organization     |   trustworthy person |
|               |   public access   |   only in a closed |   in a closed and    |
|               |                   |   envelope         |   sealed envelope    |
|               | - documents must  |                    |                      |
|               |   be frequently   | - if sent outside  | - faxing the         |
|               |   removed from    |   the              |   document is not    |
|               |   printers or fax |   organization,    |   allowed            |
|               |   machines        |   the document     |                      |
|               |                   |   must be mailed   | - the document may   |
|               |                   |   with a return    |   be printed out     |
|               |                   |   receipt service  |   only if the        |
|               |                   |                    |   authorized person  |
|               |                   | - documents must   |   is standing next   |
|               |                   |   immediately be   |   to the printer     |
|               |                   |   removed from     |                      |
|               |                   |   printers or fax  | - only the document  |
|               |                   |   machines         |   owner may copy the |
|               |                   |                    |   document           |
|               |                   | - only the         |                      |
|               |                   |   document owner   | - only the document  |
|               |                   |   may copy the     |   owner may destroy  |
|               |                   |   document         |   the document       |
|               |                   |                    |                      |
|               |                   | - only the         |                      |
|               |                   |   document owner   |                      |
|               |                   |   may destroy the  |                      |
|               |                   |   document         |                      |
+---------------+-------------------+--------------------+----------------------+
| **Electronic  | - access to the   | - access to the    | - the document must  |
| documents**   |   information     |   information      |   be stored on an    |
|               |   system where    |   system where the |   encrypted          |
|               |   the document is |   document is      |   enclosure          |
|               |   stored must be  |   stored must be   |   (encrypted local   |
|               |   protected by a  |   protected by a   |   hard disk, for     |
|               |   strong password |   2-factor         |   example)           |
|               |                   |   authentication   |                      |
|               | - the screen on   |                    | - access to the      |
|               |   which the       | - when files are   |   cloud service      |
|               |   document is     |   exchanged via    |   where the document |
|               |   displayed must  |   services such as |   is stored must be  |
|               |   be              |   FTP, instant     |   protected by       |
|               |   automatically   |   messaging, etc., |   2-factor           |
|               |   locked after 15 |   they must be     |   authentication     |
|               |   minutes of      |   password         |                      |
|               |   inactivity      |   protected        | - the document may   |
|               |                   |                    |   be stored only on  |
|               |                   | - only the         |   servers or storage |
|               |                   |   document owner   |   services which are |
|               |                   |   may erase the    |   controlled by the  |
|               |                   |   document         |   organization       |
|               |                   |                    |                      |
|               |                   |                    | - when files are     |
|               |                   |                    |   exchanged via      |
|               |                   |                    |   services such as   |
|               |                   |                    |   FTP, instant       |
|               |                   |                    |   messaging, etc.,   |
|               |                   |                    |   they must be       |
|               |                   |                    |   encrypted          |
|               |                   |                    |                      |
|               |                   |                    | - only the document  |
|               |                   |                    |   owner may erase    |
|               |                   |                    |   the document       |
+---------------+-------------------+--------------------+----------------------+
| **Information | - access to the   | - access to the    | - access to the      |
| systems**     |   information     |   information      |   information system |
|               |   system must be  |   system must be   |   must be controlled |
|               |   protected by a  |   controlled       |   through a 2-factor |
|               |   strong password |   through a        |   authentication     |
|               |                   |   2-factor         |                      |
|               | - the screen must |   authentication   | - the information    |
|               |   be              |                    |   system may only be |
|               |   automatically   | - users must log   |   installed on       |
|               |   locked after 15 |   out of the       |   servers controlled |
|               |   minutes of      |   information      |   by the             |
|               |   inactivity      |   system if they   |   organization       |
|               |                   |   have temporarily |                      |
|               | - the information |   or permanently   | - the information    |
|               |   system may only |   left the         |   system may only be |
|               |   be located in   |   workplace        |   located in rooms   |
|               |   rooms with      |                    |   with controlled    |
|               |   controlled      | - data must be     |   physical access    |
|               |   physical access |   erased only with |   (locked).          |
|               |                   |   an algorithm     |                      |
|               |                   |   which ensures    |                      |
|               |                   |   secure deletion  |                      |
|               |                   |   on magnetic      |                      |
|               |                   |   drives, or       |                      |
|               |                   |   stored on an     |                      |
|               |                   |   encrypted drive  |                      |
|               |                   |   for SSD drives   |                      |
|               |                   |                    |                      |
|               |                   | - the information  |                      |
|               |                   |   system may only  |                      |
|               |                   |   be located in    |                      |
|               |                   |   rooms with       |                      |
|               |                   |   controlled       |                      |
|               |                   |   physical access  |                      |
+---------------+-------------------+--------------------+----------------------+
| **Electronic  | - the sender must | - e-mail must be   | - all e-mails must   |
| mail**        |   carefully check |   encrypted if     |   be encrypted       |
|               |   the recipient   |   sent outside the |                      |
|               |                   |   organization     | - the sender must    |
|               | - all rules       |                    |   carefully check    |
|               |   stated under    | - the sender must  |   the recipient      |
|               |   "Information    |   carefully check  |                      |
|               |   systems" apply  |   the recipient    | - all rules stated   |
|               |                   |                    |   under              |
|               |                   | - all rules stated |   "Information       |
|               |                   |   under            |   systems" apply     |
|               |                   |   "Information     |                      |
|               |                   |   systems" apply   |                      |
+---------------+-------------------+--------------------+----------------------+
| **Electronic  | - media or files  | - media and files  | - media and files    |
| storage       |   must be         |   must be          |   must be encrypted  |
| media**       |   password        |   encrypted        |                      |
|               |   protected       |                    | - media must be      |
|               |                   | - if sent outside  |   stored in a safe   |
|               | - if sent outside |   the              |                      |
|               |   the             |   organization,    | - media may be       |
|               |   organization,   |   the medium must  |   transferred within |
|               |   the medium must |   be mailed with a |   and outside the    |
|               |   be sent as      |   return receipt   |   organization only  |
|               |   registered mail |   service          |   by a trustworthy   |
|               |                   |                    |   person in a closed |
|               | - the medium may  | - only the medium  |   and sealed         |
|               |   only be kept in |   owner may erase  |   envelope           |
|               |   rooms with      |   or destroy the   |                      |
|               |   controlled      |   medium           | - only the medium    |
|               |   physical access |                    |   owner may erase or |
|               |                   |                    |   destroy the medium |
+---------------+-------------------+--------------------+----------------------+
| **Information | - unauthorized    | - The room must be | - The room must be   |
| transmitted   |   persons must    |   secluded and the |   secluded and the   |
| orally**      |   not be present  |   door closed      |   door closed        |
|               |   in the room     |                    |                      |
|               |   when the        | - the conversation | - conversation       |
|               |   information is  |   must not be      |   conducted through  |
|               |   communicated    |   recorded         |   a communication    |
|               |                   |                    |   channel (e.g.,     |
|               |                   |                    |   online call) must  |
|               |                   |                    |   be encrypted       |
|               |                   |                    |                      |
|               |                   |                    | - the conversation   |
|               |                   |                    |   must not be        |
|               |                   |                    |   recorded           |
|               |                   |                    |                      |
|               |                   |                    | - no transcript of   |
|               |                   |                    |   the conversation   |
|               |                   |                    |   may be kept        |
+---------------+-------------------+--------------------+----------------------+

*Controls are implemented cumulatively, meaning that controls for any
confidentiality level imply the implementation of controls defined for
lower confidentiality levels -- if stricter controls are prescribed for
a higher confidentiality level, then only such controls are implemented.

### Data masking

Production data shall not be used in non-production environments without
anonymization, encryption, or masking applied. Exceptions require written
approval from the asset owner and must be documented.
