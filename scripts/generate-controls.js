#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'frameworks', 'iso27001', 'controls');

const controls = [
  // A.5 Organizational controls
  { id: 'A.5.1', title: 'Policies for information security', category: 'Organizational controls', theme: 'organizational', control_description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.' },
  { id: 'A.5.2', title: 'Information security roles and responsibilities', category: 'Organizational controls', theme: 'organizational', control_description: 'Information security roles and responsibilities shall be defined and allocated according to the organization needs.' },
  { id: 'A.5.3', title: 'Segregation of duties', category: 'Organizational controls', theme: 'organizational', control_description: 'Conflicting duties and conflicting areas of responsibility shall be segregated.' },
  { id: 'A.5.4', title: 'Management responsibilities', category: 'Organizational controls', theme: 'organizational', control_description: 'Management shall require all personnel to apply information security in accordance with the established information security policy, topic-specific policies and procedures of the organization.' },
  { id: 'A.5.5', title: 'Contact with authorities', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall establish and maintain contact with relevant authorities.' },
  { id: 'A.5.6', title: 'Contact with special interest groups', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall establish and maintain contact with special interest groups or other specialist security forums and professional associations.' },
  { id: 'A.5.7', title: 'Threat intelligence', category: 'Organizational controls', theme: 'organizational', control_description: 'Information relating to information security threats shall be collected and analysed to produce threat intelligence.' },
  { id: 'A.5.8', title: 'Information security in project management', category: 'Organizational controls', theme: 'organizational', control_description: 'Information security shall be integrated into project management.' },
  { id: 'A.5.9', title: 'Inventory of information and other associated assets', category: 'Organizational controls', theme: 'organizational', control_description: 'An inventory of information and other associated assets, including owners, shall be developed and maintained.' },
  { id: 'A.5.10', title: 'Acceptable use of information and other associated assets', category: 'Organizational controls', theme: 'organizational', control_description: 'Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented and implemented.' },
  { id: 'A.5.11', title: 'Return of assets', category: 'Organizational controls', theme: 'organizational', control_description: 'Personnel and other interested parties as appropriate shall return all the organization\'s assets in their possession upon change or termination of their employment, contract or agreement.' },
  { id: 'A.5.12', title: 'Classification of information', category: 'Organizational controls', theme: 'organizational', control_description: 'Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.' },
  { id: 'A.5.13', title: 'Labelling of information', category: 'Organizational controls', theme: 'organizational', control_description: 'An appropriate set of procedures for information labelling shall be developed and implemented in accordance with the information classification scheme adopted by the organization.' },
  { id: 'A.5.14', title: 'Information transfer', category: 'Organizational controls', theme: 'organizational', control_description: 'Information transfer rules, procedures, or agreements shall be in place for all types of transfer facilities within the organization and between the organization and other parties.' },
  { id: 'A.5.15', title: 'Access control', category: 'Organizational controls', theme: 'organizational', control_description: 'Rules to control physical and logical access to information and other associated assets shall be established and implemented based on business and information security requirements.' },
  { id: 'A.5.16', title: 'Identity management', category: 'Organizational controls', theme: 'organizational', control_description: 'The full life cycle of identities shall be managed.' },
  { id: 'A.5.17', title: 'Authentication information', category: 'Organizational controls', theme: 'organizational', control_description: 'Allocation and management of authentication information shall be controlled by a management process, including advising personnel on appropriate handling of authentication information.' },
  { id: 'A.5.18', title: 'Access rights', category: 'Organizational controls', theme: 'organizational', control_description: 'Access rights to information and other associated assets shall be provisioned, reviewed, modified and removed in accordance with the organization\'s topic-specific policy on and rules for access control.' },
  { id: 'A.5.19', title: 'Information security in supplier relationships', category: 'Organizational controls', theme: 'organizational', control_description: 'Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier\'s products or services.' },
  { id: 'A.5.20', title: 'Addressing information security within supplier agreements', category: 'Organizational controls', theme: 'organizational', control_description: 'Relevant information security requirements shall be established and agreed with each supplier based on the type of supplier relationship.' },
  { id: 'A.5.21', title: 'Managing information security in the ICT supply chain', category: 'Organizational controls', theme: 'organizational', control_description: 'Processes and procedures shall be defined and implemented to manage the information security risks associated with the ICT products and services supply chain.' },
  { id: 'A.5.22', title: 'Monitoring, review and change management of supplier services', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall regularly monitor, review, evaluate and manage change in supplier information security practices and service delivery.' },
  { id: 'A.5.23', title: 'Information security for use of cloud services', category: 'Organizational controls', theme: 'organizational', control_description: 'Processes for acquisition, use, management and exit from cloud services shall be established in accordance with the organization\'s information security requirements.' },
  { id: 'A.5.24', title: 'Information security incident management planning and preparation', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall plan and prepare for managing information security incidents by defining, establishing and communicating information security incident management processes, roles and responsibilities.' },
  { id: 'A.5.25', title: 'Assessment and decision on information security events', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall assess information security events and decide if they are to be categorized as information security incidents.' },
  { id: 'A.5.26', title: 'Response to information security incidents', category: 'Organizational controls', theme: 'organizational', control_description: 'Information security incidents shall be responded to in accordance with the documented procedures.' },
  { id: 'A.5.27', title: 'Learning from information security incidents', category: 'Organizational controls', theme: 'organizational', control_description: 'Knowledge gained from information security incidents shall be used to strengthen and improve the information security controls.' },
  { id: 'A.5.28', title: 'Collection of evidence', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall establish and implement procedures for the identification, collection, acquisition and preservation of evidence related to information security events.' },
  { id: 'A.5.29', title: 'Information security during disruption', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall plan how to maintain information security at an appropriate level during disruption.' },
  { id: 'A.5.30', title: 'ICT readiness for business continuity', category: 'Organizational controls', theme: 'organizational', control_description: 'ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements.' },
  { id: 'A.5.31', title: 'Legal, statutory, regulatory and contractual requirements', category: 'Organizational controls', theme: 'organizational', control_description: 'Legal, statutory, regulatory and contractual requirements relevant to information security and the organization\'s approach to meet these requirements shall be identified, documented and kept up to date.' },
  { id: 'A.5.32', title: 'Intellectual property rights', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall implement appropriate procedures to protect intellectual property rights.' },
  { id: 'A.5.33', title: 'Protection of records', category: 'Organizational controls', theme: 'organizational', control_description: 'Records shall be protected from loss, destruction, falsification, unauthorized access and unauthorized release.' },
  { id: 'A.5.34', title: 'Privacy and protection of PII', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII according to applicable laws and regulations and contractual requirements.' },
  { id: 'A.5.35', title: 'Independent review of information security', category: 'Organizational controls', theme: 'organizational', control_description: 'The organization\'s approach to managing information security and its implementation including people, processes and technologies shall be reviewed independently at planned intervals, or when significant changes occur.' },
  { id: 'A.5.36', title: 'Compliance with policies, rules and standards for information security', category: 'Organizational controls', theme: 'organizational', control_description: 'Compliance with the organization\'s information security policy, topic-specific policies, rules and standards shall be regularly reviewed.' },
  { id: 'A.5.37', title: 'Documented operating procedures', category: 'Organizational controls', theme: 'organizational', control_description: 'Operating procedures for information processing facilities shall be documented and made available to personnel who need them.' },

  // A.6 People controls
  { id: 'A.6.1', title: 'Screening', category: 'People controls', theme: 'people', control_description: 'Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.' },
  { id: 'A.6.2', title: 'Terms and conditions of employment', category: 'People controls', theme: 'people', control_description: 'The employment contractual agreements shall state the personnel\'s and the organization\'s responsibilities for information security.' },
  { id: 'A.6.3', title: 'Information security awareness, education and training', category: 'People controls', theme: 'people', control_description: 'Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization\'s information security policy, topic-specific policies and procedures, as relevant for their job function.' },
  { id: 'A.6.4', title: 'Disciplinary process', category: 'People controls', theme: 'people', control_description: 'A disciplinary process shall be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation.' },
  { id: 'A.6.5', title: 'Responsibilities after termination or change of employment', category: 'People controls', theme: 'people', control_description: 'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced and communicated to relevant personnel and other interested parties.' },
  { id: 'A.6.6', title: 'Confidentiality or non-disclosure agreements', category: 'People controls', theme: 'people', control_description: 'Confidentiality or non-disclosure agreements reflecting the organization\'s needs for the protection of information shall be identified, documented, regularly reviewed and signed by personnel and other relevant interested parties.' },
  { id: 'A.6.7', title: 'Remote working', category: 'People controls', theme: 'people', control_description: 'Security measures shall be implemented when personnel are working remotely to protect information accessed, processed or stored outside the organization\'s premises.' },
  { id: 'A.6.8', title: 'Information security event reporting', category: 'People controls', theme: 'people', control_description: 'The organization shall provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner.' },

  // A.7 Physical controls
  { id: 'A.7.1', title: 'Physical security perimeters', category: 'Physical controls', theme: 'physical', control_description: 'Security perimeters shall be defined and used to protect areas that contain information and other associated assets.' },
  { id: 'A.7.2', title: 'Physical entry', category: 'Physical controls', theme: 'physical', control_description: 'Secure areas shall be protected by appropriate entry controls and access points.' },
  { id: 'A.7.3', title: 'Securing offices, rooms and facilities', category: 'Physical controls', theme: 'physical', control_description: 'Physical security for offices, rooms and facilities shall be designed and implemented.' },
  { id: 'A.7.4', title: 'Physical security monitoring', category: 'Physical controls', theme: 'physical', control_description: 'Premises shall be continuously monitored for unauthorized physical access.' },
  { id: 'A.7.5', title: 'Protecting against physical and environmental threats', category: 'Physical controls', theme: 'physical', control_description: 'Protection against physical and environmental threats, such as natural disasters and other intentional or unintentional physical threats to infrastructure shall be designed and implemented.' },
  { id: 'A.7.6', title: 'Working in secure areas', category: 'Physical controls', theme: 'physical', control_description: 'Security measures for working in secure areas shall be designed and implemented.' },
  { id: 'A.7.7', title: 'Clear desk and clear screen', category: 'Physical controls', theme: 'physical', control_description: 'Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities shall be defined and appropriately enforced.' },
  { id: 'A.7.8', title: 'Equipment siting and protection', category: 'Physical controls', theme: 'physical', control_description: 'Equipment shall be sited securely and protected.' },
  { id: 'A.7.9', title: 'Security of assets off-premises', category: 'Physical controls', theme: 'physical', control_description: 'Off-site assets shall be protected.' },
  { id: 'A.7.10', title: 'Storage media', category: 'Physical controls', theme: 'physical', control_description: 'Storage media shall be managed through their life cycle of acquisition, use, transportation and disposal in accordance with the organization\'s classification scheme and handling requirements.' },
  { id: 'A.7.11', title: 'Supporting utilities', category: 'Physical controls', theme: 'physical', control_description: 'Information processing facilities shall be protected from power failures and other disruptions caused by failures in supporting utilities.' },
  { id: 'A.7.12', title: 'Cabling security', category: 'Physical controls', theme: 'physical', control_description: 'Cables carrying power, data or supporting information services shall be protected from interception, interference or damage.' },
  { id: 'A.7.13', title: 'Equipment maintenance', category: 'Physical controls', theme: 'physical', control_description: 'Equipment shall be maintained correctly to ensure availability, integrity and confidentiality of information.' },
  { id: 'A.7.14', title: 'Secure disposal or re-use of equipment', category: 'Physical controls', theme: 'physical', control_description: 'Items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use.' },

  // A.8 Technological controls
  { id: 'A.8.1', title: 'User endpoint devices', category: 'Technological controls', theme: 'technological', control_description: 'Information stored on, processed by or accessible via user end point devices shall be protected.' },
  { id: 'A.8.2', title: 'Privileged access rights', category: 'Technological controls', theme: 'technological', control_description: 'The allocation and use of privileged access rights shall be restricted and managed.' },
  { id: 'A.8.3', title: 'Information access restriction', category: 'Technological controls', theme: 'technological', control_description: 'Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.' },
  { id: 'A.8.4', title: 'Access to source code', category: 'Technological controls', theme: 'technological', control_description: 'Read and write access to source code, development tools and software libraries shall be appropriately managed.' },
  { id: 'A.8.5', title: 'Secure authentication', category: 'Technological controls', theme: 'technological', control_description: 'Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control.' },
  { id: 'A.8.6', title: 'Capacity management', category: 'Technological controls', theme: 'technological', control_description: 'The use of resources shall be monitored and adjusted in line with current and expected capacity requirements.' },
  { id: 'A.8.7', title: 'Protection against malware', category: 'Technological controls', theme: 'technological', control_description: 'Protection against malware shall be implemented and supported by appropriate user awareness.' },
  { id: 'A.8.8', title: 'Management of technical vulnerabilities', category: 'Technological controls', theme: 'technological', control_description: 'Information about technical vulnerabilities of information systems in use shall be obtained, the organization\'s exposure to such vulnerabilities shall be evaluated and appropriate measures shall be taken.' },
  { id: 'A.8.9', title: 'Configuration management', category: 'Technological controls', theme: 'technological', control_description: 'Configurations, including security configurations, of hardware, software, services and networks shall be established, documented, implemented, monitored and reviewed.' },
  { id: 'A.8.10', title: 'Information deletion', category: 'Technological controls', theme: 'technological', control_description: 'Information stored in information systems, devices or in any other storage media shall be deleted when no longer required.' },
  { id: 'A.8.11', title: 'Data masking', category: 'Technological controls', theme: 'technological', control_description: 'Data masking shall be used in accordance with the organization\'s topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration.' },
  { id: 'A.8.12', title: 'Data leakage prevention', category: 'Technological controls', theme: 'technological', control_description: 'Data leakage prevention measures shall be applied to systems, networks and any other devices that process, store or transmit sensitive information.' },
  { id: 'A.8.13', title: 'Information backup', category: 'Technological controls', theme: 'technological', control_description: 'Backup copies of information, software and systems shall be maintained and regularly tested in accordance with the agreed topic-specific policy on backup.' },
  { id: 'A.8.14', title: 'Redundancy of information processing facilities', category: 'Technological controls', theme: 'technological', control_description: 'Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements.' },
  { id: 'A.8.15', title: 'Logging', category: 'Technological controls', theme: 'technological', control_description: 'Logs that record activities, exceptions, faults and other relevant events shall be produced, stored, protected and analysed.' },
  { id: 'A.8.16', title: 'Monitoring activities', category: 'Technological controls', theme: 'technological', control_description: 'Networks, systems and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents.' },
  { id: 'A.8.17', title: 'Clock synchronization', category: 'Technological controls', theme: 'technological', control_description: 'The clocks of information processing systems used by the organization shall be synchronized to approved time sources.' },
  { id: 'A.8.18', title: 'Use of privileged utility programs', category: 'Technological controls', theme: 'technological', control_description: 'The use of utility programs that can be capable of overriding system and application controls shall be restricted and tightly controlled.' },
  { id: 'A.8.19', title: 'Installation of software on operational systems', category: 'Technological controls', theme: 'technological', control_description: 'Procedures and measures shall be implemented to securely manage software installation on operational systems.' },
  { id: 'A.8.20', title: 'Networks security', category: 'Technological controls', theme: 'technological', control_description: 'Networks and network devices shall be secured, managed and controlled to protect information in systems and applications.' },
  { id: 'A.8.21', title: 'Security of network services', category: 'Technological controls', theme: 'technological', control_description: 'Security mechanisms, service levels and service requirements of network services shall be identified, implemented and monitored.' },
  { id: 'A.8.22', title: 'Segregation of networks', category: 'Technological controls', theme: 'technological', control_description: 'Groups of information services, users and information systems shall be segregated in the organization\'s networks.' },
  { id: 'A.8.23', title: 'Web filtering', category: 'Technological controls', theme: 'technological', control_description: 'Access to external websites shall be managed to reduce exposure to malicious content.' },
  { id: 'A.8.24', title: 'Use of cryptography', category: 'Technological controls', theme: 'technological', control_description: 'Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented.' },
  { id: 'A.8.25', title: 'Secure development life cycle', category: 'Technological controls', theme: 'technological', control_description: 'Rules for the secure development of software and systems shall be established and applied.' },
  { id: 'A.8.26', title: 'Application security requirements', category: 'Technological controls', theme: 'technological', control_description: 'Information security requirements shall be identified, specified and approved when developing or acquiring applications.' },
  { id: 'A.8.27', title: 'Secure system architecture and engineering principles', category: 'Technological controls', theme: 'technological', control_description: 'Principles for engineering secure systems shall be established, documented, maintained and applied to any information system development activities.' },
  { id: 'A.8.28', title: 'Secure coding', category: 'Technological controls', theme: 'technological', control_description: 'Secure coding principles shall be applied to software development.' },
  { id: 'A.8.29', title: 'Security testing in development and acceptance', category: 'Technological controls', theme: 'technological', control_description: 'Security testing processes shall be defined and implemented in the development life cycle.' },
  { id: 'A.8.30', title: 'Outsourced development', category: 'Technological controls', theme: 'technological', control_description: 'The organization shall direct, monitor and review the activities related to outsourced system development.' },
  { id: 'A.8.31', title: 'Separation of development, test and production environments', category: 'Technological controls', theme: 'technological', control_description: 'Development, testing and production environments shall be separated and secured.' },
  { id: 'A.8.32', title: 'Change management', category: 'Technological controls', theme: 'technological', control_description: 'Changes to information processing facilities and information systems shall be subject to change management procedures.' },
  { id: 'A.8.33', title: 'Test information', category: 'Technological controls', theme: 'technological', control_description: 'Test information shall be appropriately selected, protected and managed.' },
  { id: 'A.8.34', title: 'Protection of information systems during audit testing', category: 'Technological controls', theme: 'technological', control_description: 'Audit tests and other assurance activities involving assessment of operational systems shall be planned and agreed between the tester and appropriate management.' },
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Escape a string for safe YAML double-quoted values.
 * Handles double quotes and backslashes.
 */
function yamlEscape(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

let count = 0;
for (const control of controls) {
  const yaml = `id: ${control.id}
title: "${yamlEscape(control.title)}"
category: "${yamlEscape(control.category)}"
theme: ${control.theme}
applicable: true
justification: ""
implementation_status: not-started
control_description: "${yamlEscape(control.control_description)}"
notes: ""
`;
  const filename = `${control.id}.yml`;
  fs.writeFileSync(path.join(outputDir, filename), yaml);
  count++;
}

console.log(`Generated ${count} control files in ${outputDir}`);
