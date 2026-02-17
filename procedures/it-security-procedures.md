---
id: PROC-002
title: "Security Procedures for IT Department"
owner: e.stpierre
status: approved
version: "1.1"
approved_date: 2026-01-09
next_review: 2027-01-09
frameworks:
  iso27001:
    controls: [A.5.7, A.5.14, A.5.37, A.7.10, A.7.14, A.8.4, A.8.6, A.8.7, A.8.8, A.8.9, A.8.10, A.8.12, A.8.13, A.8.15, A.8.16, A.8.17, A.8.18, A.8.20, A.8.21, A.8.22, A.8.23, A.8.31, A.8.32]
triggers_update_to: []
triggered_by: []
---

# Security Procedures for IT Department

## Purpose, scope and users

The purpose of this document is to ensure correct and secure functioning of information and communication technology.

This document is applied to the entire Information Security Management System (ISMS) scope, i.e. to all the information and communication technology, as well as to related documentation within the scope.

Users of this document are employees of the IT Team.

## Reference documents

- ISO/IEC 27001 standard, clauses A.5.7, A.5.14, A.5.37, A.7.10, A.7.14, A.8.4, A.8.6, A.8.7, A.8.8, A.8.9, A.8.10, A.8.12, A.8.13, A.8.15, A.8.16, A.8.17, A.8.18, A.8.20, A.8.21, A.8.22, A.8.23, A.8.31, and A.8.32
- ISMS Policy
- Disaster Recovery Plan
- Mobile Device, Teleworking Policy and Work from Home Policy
- Information Classification Policy
- Inventory of Assets
- Supplier Security Policy
- Secure Development Policy
- Access Control Policy

## Operating Procedures for Information and Communication Technology

### Change management

Each change to operational or production systems must be made in the following way:

1. change may be proposed by management, developers or IT team members

2. depending on the type of change, it must be authorized by either the IT Director or the Chief Technology Officer. Both must assess its justification for business and potential negative security impacts

| Type of Change | Requires IT Director Approval | Requires CTO Approval |
| --- | --- | --- |
| Changes affecting the infrastructure, network, software or 3rd party services being used at QuickSeries | X | |
| Changes affecting the Quick Connect back-end environment, including AWS services being used and security controls to put in place | X | X |
| Changes affecting the software and the application development | | X |

3. changes must be implemented by a member of the IT Team

4. the IT Director is responsible for checking that the change has been implemented in accordance with the requirement

5. A member of the IT Team is responsible for testing and verifying the system's stability -- the system must not be put into production before thorough testing has been conducted

6. implementation of changes must be reported to the person who initially requested the change

7. The IT Director is responsible for updating the documents (policies, procedures, plans, etc.) that have been affected by the change.

Change records are kept in our ticket systems (Freshdesk or JIRA).

### Configuration management

The IT Director is responsible for documenting the configuration settings of hardware, software, services, and networks that must be enforced to ensure the correct and secure operation, and to provide a baseline against incorrect changes.

### Capacity management

The IT Director is responsible for monitoring the use of ICT assets and for planning required capacity.

### Antivirus protection

An anti-virus/anti-malware solution must be installed on each platform (e.g., physical, virtual, or cloud servers) hosting IT systems that are handled by the IT department, with activated automatic updates.

- Workstations: Avast Anti-Virus
- AWS infrastructure: [TBD]
- Mobile devices: not applicable
- Development Environment: [TBD]

### Network security management

#### Boundary

The following diagram describes the elements of our network, and identifies what is "in-scope":

<!-- Network diagram: original image not converted -->

**Definitions**

- **Remote Users:** home office for our employees, using QuickSeries-owned equipment and connecting to the corporate services through a VPN.
- **Headquarter office:** main office, mostly for shipping personnel and sporadic use of the office space for on-site work.
- **Hosted Datacenter:** 3rd-party datacenter hosting our servers (CRM, backups, SDLC servers) and our VPN hardware.
- **Product Management and Dev Tools:** external services for developers (GitLab, AI tools, etc)
- **QuickConnect:** the actual backend for our QuickConnect solution, consisting of a set of AWS instances, databases and services in a protected VPC.
- **Other AWS-hosted Services:** website, phone system logs, Moneta CRM.

The IT Director is responsible for managing and controlling the computer networks, for ensuring the security of information in networks, preventing data leakage, and protecting the services connected to the networks from unauthorized access. It is therefore necessary to address the following:

| Task | Means |
| --- | --- |
| Separate the operational responsibility for networks from the responsibility for sensitive applications and other systems | IT Team is in charge of setting up the network architecture, Software Development team is in charge of setting up the tools to develop and deploy the software. Both teams need to coordinate as part of our Change Management process. |
| Protect sensitive data passing over the public network by ensuring all connections are done through a VPN | No publicly available data. Employees require a VPN access to access our information systems. |
| Protect sensitive data passing over wireless networks by using a private wifi connection for accessing our network, or enforcing the use of a VPN if using a public wifi connection | Guest Wi-Fi at the headquarters is physically segregated from internal Wi-Fi using separate routers. Corporate devices authenticate against an internal SSID, while guest devices are isolated from internal resources and routed directly to the internet. |
| Protect equipment connecting to the network from remote locations by restricting incoming connections to VPN only | All our equipment is behind a firewall, no port-forward, no open port to internal services. |
| Segregate the network in both our corporate infrastructure and our Quick Connect backend infrastructure | On AWS, the production environment is segregated from the DEV, QA and STAGING environments. Web servers, APIs, and externally accessible components are deployed in a dedicated VPC or a dedicated subnetwork, logically separated from internal systems. Public systems are accessed through the AWS WAF and reverse proxies; internal systems require VPN access and internal routing via firewalls. |
| Filter access to websites with potential malicious or illegal content, or that can be used for data leakage | Our QSC portal backend is protected by AWS Web Application Firewall, filtering malicious content and restricting access for some countries. |
| Ensure that system clocks on all computers are synchronized using NTP | All systems are set to automatically synchronize through NTP. |

The IT Director must regularly ensure the monitoring and testing of implemented controls.

### Network services

The IT Director must define security features and the level of expected services for all network services, whether these services are provided in-house or outsourced -- such requirements should be documented with service providers.

If the network services are outsourced, then the requirements must be specified in the agreement as defined in Supplier Security Policy.

### Data deletion

All data stored in applications, databases, servers, and networks must be deleted by the asset owner when no longer required.

### Disposal and destruction of equipment and media

All data and licensed software stored on mobile storage media (e.g. on CD, DVD, USB flash drive, memory card, etc.; but also, on paper) and on all equipment containing storage media (e.g. computers, mobile phones, etc.) must be erased or the medium destroyed before it is decommissioned, disposed of or reused.

The person responsible for erasing data / destroying media must update the Inventory of Assets.

#### Equipment

A member of the IT Team is responsible for checking and erasing data from equipment, unless the Information Classification Policy prescribes differently. Data must be erased by formatting, then reinstalling default OS or software, but if the process is not secure enough considering the sensitivity of the data, then the storage medium must be destroyed.

#### Paper media

Employees of the organization handling individual documents are responsible for destroying paper documents, unless the Information Classification Policy prescribes differently. Paper documents are destroyed by paper shredders.

#### Erasure and destruction records; commission for the destruction of data

- Records of erasure/destruction must be kept for all data classified as "Restricted" and "Confidential". Records must include the following information: information about the media, date of erasure/destruction, method of erasure/destruction, person who carried out the process.
- All information classified as "Confidential" must be erased/destroyed in the presence of a commission consisting of persons authorized to access the information in question.

### Information transfer

#### Electronic communication channels

Organization's information may be exchanged through the following electronic communication channels: e-mail, download of files from the Internet, transfer of data via messaging services (such as Slack, MS Teams and Google Meet), telephones, fax machines, SMS text messages, portable media, and forums and social networks.

The IT Director determines the communication channel that may be used for each type of information, and possible restrictions regarding permissions to use the communication channels, i.e. defines which activities are forbidden.

In addition to controls prescribed by the Information Classification Policy, the IT Director prescribes additional controls for each type of data and communication channel, based on risk assessment results.

#### Relations with external parties

External parties include various service providers, companies for hardware and software maintenance, companies handling transactions or data processing, clients, etc.

The IT Director must prepare and sign an agreement with the external party before exchanging information and/or software, through electronic, physical, or verbal means. When such contract doesn't exist (e.g. for large suppliers like Microsoft, Google, AWS, etc), the IT Director keeps a record of the publicly available license agreement. The agreement can be in paper or electronic form (e.g., agreeing to general terms and conditions) and must contain clauses in line with the risk assessment, including at least the following:

- method of identification of the other party
- authorizations to access information
- ensuring non-repudiation
- technical standards for data transfer
- incident response
- labeling and handling sensitive information
- copyright

Agreements with external parties must be drawn up according to the Supplier Security Policy.

### Handling the source code

The program source codes are stored in Github and access to it is defined in the Access Control Policy.

### Use of utility programs

The IT Director is responsible for approving requests for the use of privileged utility programs such as remote desktop tools and monitoring software used by the IT Team.

### System monitoring

Based on the risk assessment results, the IT Director decides which logs will be kept on which systems and for which systems, and how long they will be stored. Logs must be kept for all administrators and system operators on sensitive systems.

The IT Director is responsible for monitoring the logs of automatically reported faults on a daily basis, as well as for registering faults reported by users, to analyze why errors occurred, to identify new potential threats, as well as a potential for data leakage, and to take appropriate corrective actions.

The IT Team support specialist and the sysadmin are responsible for regularly reviewing logs in order to monitor the activities of users, administrators, and system operators, to identify new potential threats, as well as the potential for data leakage. The review is conducted at intervals prescribed by the IT Director, who determines and selects the records to be reviewed, and how the implemented review will be recorded. The IT Director must be informed about the results of the review and are escalated to the Chief Technology Officer whenever applicable.

The IT Director and the Chief Technology Officer are responsible for monitoring all vulnerabilities of applications and other systems, and must select actions to be taken in case new vulnerabilities are identified.

The IT Director is responsible for monitoring applied configurations on devices and systems against approved documented settings, and he must select actions to be taken in case actual configurations differ from the approved ones.

The IT Director is responsible for checking the reports of performed penetration tests and vulnerability assessments and taking appropriate corrective actions.

### External threat monitoring

The IT Director is responsible for monitoring suppliers, manufacturers, and security reference groups in order to identify external threats that can impact applications and systems, and a member of the IT Team must select actions to be taken in case new threats are identified.
