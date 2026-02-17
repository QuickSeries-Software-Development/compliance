---
id: PROG-001
title: "Specification of Information System Requirements"
owner: e.stpierre
status: approved
version: "1.0"
approved_date: 2025-12-16
next_review: 2026-12-16
frameworks:
  iso27001:
    controls: [A.8.26, A.8.27]
triggers_update_to: []
triggered_by: []
---

# Specification of Information System Requirements

Restricted to: IT Team members, Management

## Google Drive

| Field | Details |
| --- | --- |
| Version | N/A |
| Impact value from risk assessment | [??] |
| Functional specification | Online storage for internal documentation. May be used to share documents with external organizations. |
| Automated controls | Need a QuickSeries account to access. Default ACL based on employee department. Inherit all Google Workspace security controls (encryption, ACL, malware protection, etc). |
| Manual controls | Security Logs consulted periodically. Billing information controlled every month. |
| Testing method | Internal checks done by IT Team. |

## Google Workspace

| Field | Details |
| --- | --- |
| Version | N/A |
| Impact value from risk assessment | [??] |
| Functional specification | Sheets, Docs |
| Automated controls | Need a QuickSeries account to access. Default ACL based on employee department. Inherit all Google Workspace security controls (encryption, ACL, malware protection, etc). |
| Manual controls | Security Logs consulted periodically. Billing information controlled every month. |
| Testing method | Internal checks done by IT Team. |

## Confluence (Atlassian)

| Field | Details |
| --- | --- |
| Version | N/A |
| Impact value from risk assessment | [??] |
| Functional specification | Online storage for internal documentation. May not be used to share documents with external organizations. |
| Automated controls | Need a QuickSeries account to access. Default ACL based on employee department. Inherits all controls from Atlassian (encryption, ACL, malware protection, etc). |
| Manual controls | Config Backup done once a year. |
| Testing method | Internal checks done by IT Team. |

## JIRA (Atlassian)

| Field | Details |
| --- | --- |
| Version | N/A |
| Impact value from risk assessment | [??] |
| Functional specification | Ticketing system for developers, bugs and time tracking, sprint planning. |
| Automated controls | Need a QuickSeries account to access. Restricted to developers and IT Team. Inherits all controls from Atlassian (encryption, ACL). |
| Manual controls | Config Backup done once a year. |
| Testing method | [TBD] |

## AWS Infrastructure

| Field | Details |
| --- | --- |
| Version | N/A |
| Impact value from risk assessment | [??] |
| Functional specification | Development infrastructure. Includes many services from Amazon. Serves as our DEV, TEST, QA, STAGING and PROD environment for our QuickSeries Connect product. |
| Automated controls | Access Control restricted to QuickSeries employees. Infrastructure security and redundancy implied and inherited from AWS. Automated monitoring and alerts with CloudWatch and GuardDuty. |
| Manual controls | [TBD] |
| Testing method | [TBD] |

## Backend Databases

| Field | Details |
| --- | --- |
| Version | Postgres: 17.5, Mongo: 4.4.6-8 |
| Impact value from risk assessment | [??] |
| Functional specification | Database engines supporting our QuickSeries Connect app. Deployed under the RDS service in Amazon AWS. |
| Automated controls | Database accessed through the app only. Command line interface available only to sysadmins during deployment period. |
| Manual controls | During deployment of new backend version, we verify the version of the engine and add a step in our deployment procedure to upgrade to the most recent version. |
| Testing method | [TBD] |

## FileMaker

| Field | Details |
| --- | --- |
| Version | Server: 21.1.1.40, Clients: 21 - 22 |
| Impact value from risk assessment | [??] |
| Functional specification | Enterprise ERP/CRM. Developed internally. |
| Automated controls | Access Control restricted to QuickSeries employees. VPN required to access from remote home office. Automated backups twice a day. |
| Manual controls | N/A |
| Testing method | Full time developer regularly looking at logs and stability of the system. |

## Moneta

| Field | Details |
| --- | --- |
| Version | Ubuntu 24.04 LTS, php 8.3.6 |
| Impact value from risk assessment | [??] |
| Functional specification | Enterprise ERP/CRM -- mostly for sales process and app quotes/orders. Developed internally. |
| Automated controls | Access Control restricted to QuickSeries employees. VPN required to access from remote home office. Automated backups twice a day. |
| Manual controls | N/A |
| Testing method | N/A |

## Corporate Websites

| Field | Details |
| --- | --- |
| Version | `www.quickseries.com`: Strapi v. TBD, `quickresource.quickseries.com`: Wordpress v. TBD |
| Impact value from risk assessment | [??] |
| Functional specification | Corporate website and public KB for our clients. |
| Automated controls | Admin access restricted to a few employees: marketing director, editor, CTO. |
| Manual controls | N/A |
| Testing method | N/A |

## Firewall

| Field | Details |
| --- | --- |
| Version | Watchguard Firewall v. 12.11.4, Tailscale v. 1.92.2 |
| Impact value from risk assessment | [??] |
| Functional specification | VPN infrastructure to allow employees working from home to access QuickSeries infrastructure (CRM/ERP, local servers). Also allow connecting to public-facing services that require an IP-based higher level of security (bastion machine on our AWS infrastructure, moneta server hosted in AWS but only available from our VPN IP address, etc). |
| Automated controls | Logs automatically generated and sent to a separate log server. |
| Manual controls | Need to periodically check for firmware updates. Need to periodically check logs. |
| Testing method | Login to the system at least quarterly, or when a security warning is published by Watchguard and Tailscale to perform required maintenance and upgrades. Check logs at least once a month. |

## Employee Workstations

| Field | Details |
| --- | --- |
| Version | macOS 12.7 and up, Windows 11 Pro |
| Impact value from risk assessment | [??] |
| Functional specification | Workstations used by our employees. Fully managed through MDM (Miradore). |
| Automated controls | Automatic system updates managed by MDM. Anti-virus/Anti-malware scans performed automatically at least once a week. Backups of essential folders (Documents, Desktop) automated with Google Drive. |
| Manual controls | Some updates may require manual intervention (major OS releases, updates that cannot be performed automatically). |
| Testing method | Remote access configured upon deployment of the computer, using a separate user account with administrative privileges. |
