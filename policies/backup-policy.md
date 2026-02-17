---
id: POL-006
title: "Backup Policy"
owner: e.stpierre
status: approved
version: "1.2"
approved_date: 2026-01-12
next_review: 2027-01-12
frameworks:
  iso27001:
    controls: [A.8.13]
triggers_update_to: []
triggered_by: []
---

# Backup Policy

## Purpose, scope and users

The purpose of this document is to ensure that backup copies are created
at defined intervals and regularly tested.

This document is applied to the entire Information Security Management
System (ISMS) scope, i.e. to all the information and communication
technology within the scope.

Users of this document are employees of QuickSeries' IT Department.

## Reference documents

- ISO/IEC 27001 standard, clause A.8.13

- ISMS Policy

- Business Continuity Strategy

## Backup

### Backup procedure

Backup copies must be created for all systems identified in the Business
Continuity Strategy and with the frequency specified in that document.

The IT Director is responsible for backing up the information, software,
and system images, and for ensuring that failures on scheduled backups
are properly addressed. The systems include:

| **System** | **Notes** | **Backup Logs** |
| --- | --- | --- |
| **Users' Workstation** | Using Google Drive, backing up Documents and Desktop folders | In Google Drive app > Sync Activity |
| **FileMaker** | local backup on the server itself; Remote backup using **arq 7** to Google Drive account backup@quickseries.com | Under /Library/Logs/ArqAgent on the FileMaker server |
| **Avantage** | daily remote backup using arq 7 to Google Drive account backup@quickseries.com | In the arq7 app on the server |
| **Source files for pguides** | Old ones stored on NASQUICK and NASQUICK-REMOTE (Stored under content / archiving / final products / quickseries guides); New ones on Google Drive | No logs, online storage only |
| **www - files** | Source files in GitHub; Setup with AWS Backups | Not applicable / in GitHub |
| **www - db** | Automatic RDS snapshot every day, keep 7 days | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Quickresource.quickseries.com - files** | AWS Backups | - |
| **Quickresource.quickseries.com - db** | **qs-quickresource-mysql** in Ohio; Automatic snapshot every day, keep 7 days | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Confluence** | manually, from systems > Backup Manager, stored in Google Drive IT Share (Backups > Confluence > [Month Year folder]) | Not applicable / manual backup |
| **Jira** | manually, from systems > Backup Manager, stored in Google Drive IT Share (Backups > Jira > [Month Year folder]) | Not applicable / manual backup |
| **Mongo - dev** | Backed up by AWS Backups | In AWS Backup > Dashboard > Jobs Dashboard |
| **Mongo - stg** | automatic script every day, copied to s3; Also on AWS Backups | In AWS Backup > Dashboard > Jobs Dashboard |
| **Mongo - prod** | automatic script every day, copied to s3; Also on AWS Backups | In AWS Backup > Dashboard > Jobs Dashboard |
| **Postgres - dev** | Automatic RDS snapshot every day, keep 7 days | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Postgres - stg** | Automatic RDS snapshot every day, keep 7 days | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Postgres - prod** | Automatic RDS snapshot every day, keep 7 days; Full backup done before each deployment | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Moneta - files** | Using AWS Backup service, weekly, keep 1 month | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **Moneta - db** | Automatic RDS snapshot every day, keep 7 days; Script running on moneta staging performing psqldump twice a day, kept for 10 days | In AWS Console > Aurora and RDS > Databases > <database_name> > Logs and Events, look under "Recent Events" |
| **firewall configs - HIVE** | Manually, from System > Config File, stored in Google Drive IT Share | Not applicable, manual |
| **firewall configs - DDO** | Manually, from System > Config File, stored in Google Drive IT Share | Not applicable, manual |
| **PROD infrastructure** | Handled by AWS Backup; See Dev/QA Environment documentation in Confluence | In AWS Backup > Dashboard > Jobs Dashboard |
| **Code Repository** | The codebase is managed using GitHub's distributed version control system, which provides continuous backup through replicated storage, complete auditability of changes, and rapid restoration of prior states. | Not applicable, in GitHub |

Logs of the backup process are automatically created on systems where
the backup copy is made.

### Testing backup copies

Backup copies and the process of their restoration must be tested at
least twice a year by implementing the data restore process on the
devices specified in our backup checklist page in Confluence, and
checking that all data has been successfully recovered.

The IT Director is responsible for testing backup copies. Records of
testing backup copies are kept in our backup checklist page in
Confluence.
