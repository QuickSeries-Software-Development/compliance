#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'frameworks', 'iso27001', 'controls');

const controls = [
  // A.5 Organizational controls
  { id: 'A.5.1', title: 'Policies for information security', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.2', title: 'Information security roles and responsibilities', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.3', title: 'Segregation of duties', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.4', title: 'Management responsibilities', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.5', title: 'Contact with authorities', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.6', title: 'Contact with special interest groups', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.7', title: 'Threat intelligence', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.8', title: 'Information security in project management', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.9', title: 'Inventory of information and other associated assets', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.10', title: 'Acceptable use of information and other associated assets', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.11', title: 'Return of assets', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.12', title: 'Classification of information', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.13', title: 'Labelling of information', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.14', title: 'Information transfer', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.15', title: 'Access control', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.16', title: 'Identity management', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.17', title: 'Authentication information', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.18', title: 'Access rights', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.19', title: 'Information security in supplier relationships', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.20', title: 'Addressing information security within supplier agreements', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.21', title: 'Managing information security in the ICT supply chain', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.22', title: 'Monitoring, review and change management of supplier services', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.23', title: 'Information security for use of cloud services', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.24', title: 'Information security incident management planning and preparation', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.25', title: 'Assessment and decision on information security events', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.26', title: 'Response to information security incidents', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.27', title: 'Learning from information security incidents', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.28', title: 'Collection of evidence', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.29', title: 'Information security during disruption', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.30', title: 'ICT readiness for business continuity', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.31', title: 'Legal, statutory, regulatory and contractual requirements', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.32', title: 'Intellectual property rights', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.33', title: 'Protection of records', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.34', title: 'Privacy and protection of PII', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.35', title: 'Independent review of information security', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.36', title: 'Compliance with policies, rules and standards for information security', category: 'Organizational controls', theme: 'organizational' },
  { id: 'A.5.37', title: 'Documented operating procedures', category: 'Organizational controls', theme: 'organizational' },

  // A.6 People controls
  { id: 'A.6.1', title: 'Screening', category: 'People controls', theme: 'people' },
  { id: 'A.6.2', title: 'Terms and conditions of employment', category: 'People controls', theme: 'people' },
  { id: 'A.6.3', title: 'Information security awareness, education and training', category: 'People controls', theme: 'people' },
  { id: 'A.6.4', title: 'Disciplinary process', category: 'People controls', theme: 'people' },
  { id: 'A.6.5', title: 'Responsibilities after termination or change of employment', category: 'People controls', theme: 'people' },
  { id: 'A.6.6', title: 'Confidentiality or non-disclosure agreements', category: 'People controls', theme: 'people' },
  { id: 'A.6.7', title: 'Remote working', category: 'People controls', theme: 'people' },
  { id: 'A.6.8', title: 'Information security event reporting', category: 'People controls', theme: 'people' },

  // A.7 Physical controls
  { id: 'A.7.1', title: 'Physical security perimeters', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.2', title: 'Physical entry', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.3', title: 'Securing offices, rooms and facilities', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.4', title: 'Physical security monitoring', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.5', title: 'Protecting against physical and environmental threats', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.6', title: 'Working in secure areas', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.7', title: 'Clear desk and clear screen', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.8', title: 'Equipment siting and protection', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.9', title: 'Security of assets off-premises', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.10', title: 'Storage media', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.11', title: 'Supporting utilities', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.12', title: 'Cabling security', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.13', title: 'Equipment maintenance', category: 'Physical controls', theme: 'physical' },
  { id: 'A.7.14', title: 'Secure disposal or re-use of equipment', category: 'Physical controls', theme: 'physical' },

  // A.8 Technological controls
  { id: 'A.8.1', title: 'User endpoint devices', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.2', title: 'Privileged access rights', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.3', title: 'Information access restriction', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.4', title: 'Access to source code', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.5', title: 'Secure authentication', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.6', title: 'Capacity management', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.7', title: 'Protection against malware', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.8', title: 'Management of technical vulnerabilities', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.9', title: 'Configuration management', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.10', title: 'Information deletion', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.11', title: 'Data masking', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.12', title: 'Data leakage prevention', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.13', title: 'Information backup', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.14', title: 'Redundancy of information processing facilities', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.15', title: 'Logging', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.16', title: 'Monitoring activities', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.17', title: 'Clock synchronization', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.18', title: 'Use of privileged utility programs', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.19', title: 'Installation of software on operational systems', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.20', title: 'Networks security', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.21', title: 'Security of network services', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.22', title: 'Segregation of networks', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.23', title: 'Web filtering', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.24', title: 'Use of cryptography', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.25', title: 'Secure development life cycle', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.26', title: 'Application security requirements', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.27', title: 'Secure system architecture and engineering principles', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.28', title: 'Secure coding', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.29', title: 'Security testing in development and acceptance', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.30', title: 'Outsourced development', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.31', title: 'Separation of development, test and production environments', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.32', title: 'Change management', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.33', title: 'Test information', category: 'Technological controls', theme: 'technological' },
  { id: 'A.8.34', title: 'Protection of information systems during audit testing', category: 'Technological controls', theme: 'technological' },
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;
for (const control of controls) {
  const yaml = `id: ${control.id}
title: "${control.title}"
category: "${control.category}"
theme: ${control.theme}
applicable: true
justification: ""
implementation_status: not-started
notes: ""
`;
  const filename = `${control.id}.yml`;
  fs.writeFileSync(path.join(outputDir, filename), yaml);
  count++;
}

console.log(`Generated ${count} control files in ${outputDir}`);
