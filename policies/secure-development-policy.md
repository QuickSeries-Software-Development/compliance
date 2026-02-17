---
id: POL-008
title: "Secure Development Policy"
owner: j.ledoux
status: approved
version: "1.1"
approved_date: 2026-01-28
next_review: 2027-01-14
frameworks:
  iso27001:
    controls: [A.5.33, A.8.8, A.8.11, A.8.25, A.8.26, A.8.27, A.8.28, A.8.29, A.8.30, A.8.31, A.8.32, A.8.33]
triggers_update_to: []
triggered_by: []
---

# Secure Development Policy

## Purpose, scope and users

The purpose of this policy is to define the principles,
responsibilities, and controls required to ensure the secure development
and maintenance of software and systems at QuickSeries.

This policy applies to all software, systems, services, and supporting
infrastructure developed, maintained, or operated by QuickSeries,
including:

- customer-facing products,

- internal systems,

- development, testing, staging, and production environments.

This policy applies to all employees, contractors, and third parties
involved in software development, system design, maintenance, or
operation within the scope of the Information Security Management System
(ISMS).

## Reference documents

- ISO/IEC 27001 standard, clauses A.5.33, A.8.8, A.8.11, A.8.25, A.8.26,
  A.8.27, A.8.28, A.8.29, A.8.30, A.8.31, A.8.32, and A.8.33

- Risk Assessment and Risk Treatment Methodology

- Supplier Security Policy

- Security Procedures for IT Department

- Training and Awareness Plan

## Secure development and maintenance

## Risk assessment for the development process

In addition to organization-wide risk assessments, risks related to
software development shall be assessed on a **continuous and
trigger-based basis**.

The Chief Technology Officer (CTO) shall be responsible for
development-related risks. The IT Director shall be responsible for
risks related to infrastructure and underlying platforms. Both roles
shall collaborate where responsibilities overlap.

Risk assessment activities include:

- **Access risks:** Reviewed when personnel join, leave, or change
  roles.

- Unauthorized changes: Source code changes are controlled through
  version control, protected branches, and mandatory pull request (PR)
  reviews. Infrastructure change risk assessment is documented in the
  09.09 Change Management Policy.

- **Technical vulnerabilities:** Continuous monitoring using automated
  tooling, including dependency scanning, code scanning, secret
  detection, and code quality analysis. Findings are classified by
  severity and tracked until remediation.

- **New technologies, programming languages, and methodologies**:
  Evaluated on a trigger basis using proof-of-concepts (POCs),
  documentation, compatibility testing, security research, and resource
  availability analysis.

- **Licensing risks:** Open-source licensing risks are recognized.
  Formal license scanning is implemented to ensure compliance with
  commercial usage requirements.

Engineering team leads, and developers may participate in assessments as
needed.

## Securing the development environment

Access to development environments shall be restricted to authorized
personnel and shall follow the principle of least privilege.

- Access shall be approved and managed jointly by the CTO and IT
  Director.

- Multi-factor authentication shall be required where available.

- Development, QA, staging, and production environments shall be
  logically separated.

- Development and QA access shall require VPN connectivity.

- Production access shall require VPN connectivity, bastion access, and
  temporary role assignment.

- Source code repositories are hosted in GitHub Enterprise, with
  role-based access tied to corporate accounts.

Backup mechanisms for development and infrastructure environments are
documented in 09.10 Backup Policy document.

### Principles for engineering secure systems

QuickSeries shall follow recognized secure engineering principles,
including:

- least privilege

- separation of environments

- defense in depth

- controlled change management

- risk-based decision making

The CTO shall define secure engineering practices for software systems.

The IT Director shall define secure architecture and infrastructure
practices.

These principles shall apply to both internal and externally developed
systems and shall be contractually enforced for outsourced development
in accordance with the Supplier Security Policy.

### Secure coding

Secure coding practices shall be defined and enforced by the CTO for
customer-facing products as defined below.

For internal systems, the IT Director shall be responsible.

These practices shall be defined and enforced in the QuickSeries GitHub
Enterprise account.

Practices include:

1. Documented coding standards maintained within repositories

2. Mandatory pull request reviews

3. Automated security scanning

4. Dependency and secret monitoring

5. Container scanning

All production-bound code must be approved by automated tooling and at
least two human reviewers.

Secrets management shall follow the principle of separation between code
and credentials:

- Production secrets, API keys, and credentials shall be stored in AWS
  Secrets Manager and shall not be committed to source code
  repositories.

- Non-production environment variables may be stored in GitHub
  environment variables with access restricted to authorized personnel.

- Automated secret detection shall be enabled on all repositories to
  prevent accidental credential commits.

- Secrets shall be rotated in accordance with a defined schedule or
  immediately upon suspected compromise.

- Access to secrets management systems shall be logged and restricted
  based on the principle of least privilege.

### Security requirements

Security requirements are documented when acquiring, developing, or
modifying systems that process client, employee, or company data. They
are documented in:

- architecture or design documentation (Lucidchart, Figma)

- specification files (GitHub repository)

- issue tracking systems (Jira, Freshdesk)

- pull request descriptions (GitHub)

- internal policies (Google Drive)

For customer-facing products, the CTO defines software-level
requirements, and the IT Director defines infrastructure-level
requirements. The IT Director is also responsible for defining the
security requirements of internal systems.

### Security requirements related to public networks

Security controls for application services passing over public networks
shall be defined jointly:

- Application-level controls are defined by Engineering under the
  responsibility of the CTO.

- Infrastructure and network-level controls are defined by the IT
  Director.

Security controls for information transmitted over public networks
include:

- Authentication: Strong authentication mechanisms are defined and
  enforced to ensure that only authorized users, systems, and services
  can access application functionality.

- Confidentiality and integrity: Controls are defined to ensure that
  information is protected against unauthorized access, alteration, or
  destruction during transmission, and that data privacy requirements
  are met.

- Access control: Access to applications and services is restricted
  based on identity, role, and authorization level, following the
  principle of least privilege.

- Non-repudiation: Controls are implemented to ensure actions can be
  traced to authenticated entities through the use of audit logs,
  timestamps, and other reliable records.

Controls for online transactions are designed to prevent security
incidents during the transmission and processing of data and include:

- Prevention of misrouting: Controls ensure that transactions and data
  are delivered only to the intended systems, services, and tenants.

- Prevention of incomplete data transmission: Controls ensure that
  transactions are processed completely and reliably, and that failures
  are detected and handled appropriately.

- Prevention of unauthorized message alteration: Controls protect
  transactions from unauthorized modification during transmission.

- Prevention of unauthorized message duplication: Controls prevent the
  replay or duplication of transactions that could result in
  inconsistent or unauthorized system behavior.

- Prevention of unauthorized data disclosure and data leakage: Controls
  ensure that sensitive data is not exposed during transmission,
  processing, or logging, and that only necessary information is
  exchanged.

### Checking and testing the implementation of security requirements

Security requirements shall be verified through:

| Security Requirements | Approval Authority |
| --- | --- |
| Pull Request Review | Min of 2 human developers |
| Automated security scans (SAST, SCA, container scanning, secret detection) | Automated (CI/CD pipeline). Exceptions require CTO or Tech Lead approval with documented justification. |
| Pre-release testing | QA Team |
| Regression & product testing signoff | QA Lead |
| Deployment Plan | CTO & IT Director for customer-facing products; IT Director for internal systems |
| Post deployment testing | QA Team |
| Post deployment testing signoff | QA Lead |

Evidence of testing and approvals shall be retained.

### Repository

GitHub Enterprise shall be the authoritative repository for source code
and development artifacts.

The following requirements shall apply:

- All repositories containing production code shall have branch
  protection rules enabled on main/release branches.

- Direct commits to protected branches shall be prohibited; all changes
  shall be introduced through pull requests.

- Repository access shall be granted based on role and project
  assignment, following the principle of least privilege, in accordance
  with Access Control Policy 9.14.

- Repository creation shall require CTO approval for customer-facing
  products or IT Director approval for internal systems.

- Repositories shall include standardized documentation including README
  files, coding standards, and contribution guidelines.

- Inactive repositories shall be archived and access reviewed annually.

In addition to source code, repositories may contain:

- coding standards

- product specifications (also maintained in Confluence and Google
  Drive)

- AI and development guidelines

### Version control

QuickSeries shall apply version control to all source code and
development artifacts.

The following requirements shall apply:

- Semantic versioning (MAJOR.MINOR.PATCH) shall be used for all software
  releases.

- All changes shall be introduced through pull requests that reference
  the associated issue or ticket in Jira.

- Pull requests shall include a description of the change, testing
  performed, and any security considerations.

- Commits shall be atomic and include meaningful commit messages
  describing the change.

- Release tags shall be created for all production deployments, enabling
  traceability between deployed code and repository state.

- Force-push and history rewriting on protected branches shall be
  prohibited.

- Deployments shall be performed only from approved, tagged releases.

Version control rules shall be enforced through GitHub branch protection
and repository rulesets.

### Change control

Changes shall be managed in accordance with the Change Management
Policy, section 3.1.

Deployment procedures shall include defined rollback capabilities to
restore service in the event of a failed or defective release.

The following requirements shall apply:

- All production deployments shall be performed from versioned and
  tagged releases, enabling rollback to a known-good state.

- Rollback procedures shall be documented and tested as part of
  deployment planning.

- The decision to initiate a rollback shall be authorized by the CTO or
  designated Tech Lead for customer-facing products, or by the IT
  Director for internal systems.

- Rollback events shall be documented, including the reason for
  rollback, actions taken, and post-rollback verification.

- Database migrations and schema changes shall be designed to support
  backward compatibility where feasible, or shall include tested
  rollback scripts.

Evidence of rollback capability and any rollback events shall be
retained in accordance with the records management requirements of this
policy.

### Protection of test data

Production data shall not be used in non-production environments.

Exceptions require:

- written client approval,

- CTO authorization,

- anonymization, encryption, controlled access, and secure disposal.

Synthetic or manually generated data shall be used by default.

### Required security training

Security training requirements shall be defined jointly by the CTO and
IT Director.

Training includes:

- Initial onboarding training (SDLC)

- mandatory scheduled security awareness training via KnowBe4

- Snyk Learn -- OWASP Top 10
  (<https://learn.snyk.io/learning-paths/owasp-top-10/>)

- Snyk Learn - OWASP Top 10 risks for open source software
  (<https://learn.snyk.io/learning-paths/owasp-top-10-open-source-software-risks/>)

- Snyk Learn - OWASP API Security Top 10
  (<https://learn.snyk.io/learning-paths/owasp-top-10-api/>)

- Snyk Learn - Security for developers
  (<https://learn.snyk.io/learning-paths/security-for-developers/>)

- ad-hoc training in response to new security risks or technologies

Training requirements shall be incorporated into the Training and
Awareness Plan.

### AI-assisted development

QuickSeries permits the use of AI-assisted development tools to support
coding, documentation, and analysis activities.

The following requirements shall apply:

- AI tools used for development shall be risk assessed prior to adoption
  and approved by the CTO. Approved tools shall be documented in the
  repository's AI and development guidelines.

- Developers shall not input client data, production credentials, API
  keys, or other confidential information into AI tools unless the tool
  has been approved for processing such data.

- AI-generated code shall be subject to the same review, testing, and
  approval requirements as human-written code, including mandatory pull
  request reviews and automated security scanning.

- Developers remain accountable for the security, correctness, and
  licensing compliance of all code they commit, regardless of whether it
  was AI-assisted.

- AI tool configurations and prompts that form part of the development
  workflow shall be version-controlled within the repository.

The CTO shall maintain guidance on approved AI tools and their permitted
use cases.

### IDE Extension and Plugins

IDE extensions and plugins used in the development process shall be
subject to security controls. This applies to all IDEs used by
QuickSeries personnel, including Visual Studio Code, JetBrains IDEs,
Xcode, and Android Studio.

The CTO shall maintain an approved list of IDE extensions and plugins,
stored in the source code repository. The approved list shall include
the extension name, publisher, marketplace source, business
justification, and date of last review. Extensions not on the approved
list shall not be installed without prior CTO approval.

The following requirements shall apply:

- Extensions shall only be installed from official marketplaces (Visual
  Studio Marketplace, JetBrains Marketplace, Mac App Store,
  Google/JetBrains plugin repository).

- Extensions from unverified or unknown publishers shall not be
  installed.

- Extensions requesting excessive permissions shall be reviewed by the
  CTO prior to installation.

- Developers shall report any suspicious extension behavior to the CTO
  immediately.

Where technically feasible, the approved extensions list shall be
enforced through centralized management such as MDM-managed
configuration profiles or IDE-specific plugin management tools. For IDEs
where centralized enforcement is not feasible, compliance shall be
verified through periodic audits.

The CTO shall conduct or delegate an audit of installed IDE extensions
at least quarterly. The audit shall collect installed extensions from
each developer workstation, compare them against the approved list, and
document findings and corrective actions taken.

Endpoint protection deployed on developer workstations provides an
additional layer of behavioral detection but shall not be considered a
sufficient control on its own.

Audit results shall be retained in accordance with the records
management requirements of this policy.

### Third-Party API Integration and Management

QuickSeries integrates with third-party APIs to deliver product
functionality and support internal operations. These integrations
include, but are not limited to: YouTube API, Google Maps API, ArcGIS
API, Firebase API, iPAWS Emergency Alerts API, and Algolia API.

New third-party API integrations shall be evaluated in accordance with
section 3.1 prior to adoption. The CTO shall maintain a registry of
approved third-party APIs, including the API provider, purpose, owning
team, environments in use, and date of last review.

The following requirements shall apply to all third-party API
integrations:

**API provider security assurance**

- Third-party API providers shall hold a recognized security
  certification or attestation appropriate to the nature and sensitivity
  of the data being processed. Accepted certifications include, but are
  not limited to: ISO/IEC 27001, SOC 2 Type II, and FedRAMP.

- Where a provider does not hold a recognized certification, a risk
  assessment shall be performed in accordance with section 3.1 and the
  Supplier Security Policy to determine whether compensating controls
  are sufficient to justify adoption.

- Third-party API providers shall publish or contractually commit to a
  service level agreement (SLA) that defines availability targets,
  incident response times, and communication procedures during outages.
  Where no formal SLA is available, the provider's published uptime
  history and status page availability shall be evaluated and documented
  as part of the risk assessment.

- Evidence of provider certification, SLA terms, or the risk assessment
  justifying an exception shall be documented in the Third-Party API
  Registry.

**Credential management per environment**

- Separate API keys and credentials shall be created for each
  environment (development, QA, staging, production).

- API credentials shall never be shared across environments.

- Production API credentials shall be stored in AWS Secrets Manager in
  accordance with section 3.4.

- Non-production API credentials may be stored in 1Password, GitHub
  environment variables, or locally on the developer's machine,
  provided they are not committed to source code repositories.

- Credential rotation shall follow the schedule defined in section 3.4,
  or immediately upon suspected compromise.

**API provider account security**

- Each third-party API provider account shall be structured with a root
  account and a single service account used for generating API keys and
  credentials.

- Both root and service accounts shall use strong, unique passwords
  managed through 1Password.

- Multi-factor authentication (MFA) shall be enabled on both root and
  service accounts where supported.

- Access to root and service accounts shall be limited to the minimum
  number of administrators necessary. Administrative access shall
  require CTO or IT Director approval.

- Account recovery options (e.g., recovery email, phone number) shall be
  associated with corporate-managed resources, not personal accounts.

**Restrictive API configuration**

- API keys and credentials shall be configured with the minimum
  permissions and scopes required for their intended use.

- Where supported by the API provider, the following restrictions shall
  be applied:

  - IP address or network restrictions to limit access to authorized
    environments.

  - HTTP referrer or application restrictions to prevent unauthorized
    use of client-side keys.

  - Usage quotas and rate limits to prevent excessive consumption and
    cost overruns.

  - Domain or service restrictions to limit which services may use the
    credentials.

- Unused API features, endpoints, or scopes shall be disabled.

**Monitoring and incident response**

- API usage shall be monitored for anomalies, including unexpected
  spikes in usage, requests from unauthorized sources, and
  authentication failures.

- Billing alerts shall be configured where supported to detect
  unexpected cost increases.

- In the event of a suspected API credential compromise, credentials
  shall be revoked and rotated immediately, and the incident shall be
  handled in accordance with the incident response process.

**Periodic review**

- The CTO shall conduct or delegate a review of all active third-party
  API integrations at least annually.

- Reviews shall verify that credentials remain appropriately scoped,
  accounts are properly secured, unused integrations are decommissioned,
  and access is consistent with current business needs.

- Review findings shall be documented and retained in accordance with
  section 4 of this policy.

## Appendices

- Appendix 1 -- Specification of Information System Requirements
