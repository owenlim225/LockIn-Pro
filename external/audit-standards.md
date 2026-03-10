# Audit Standards Summary

**Purpose:** Code and documentation audit practices and security assessment standards for LockIn Protocol. This document is an LLM-friendly summary; the full checklist and Cursor rule live in [.cursor/rules/audit.md](.cursor/rules/audit.md).

---

## Audit Areas

| Area | Focus |
|------|--------|
| **Security** | Vulnerability assessment, threat modeling, secure coding, incident response, compliance validation. |
| **Code quality** | Maintainability, readability, review processes, static analysis, test coverage, architecture validation. |
| **Performance** | Testing, benchmarking, monitoring, optimization, latency and throughput. |
| **Compliance & regulatory** | Regulatory requirements, compliance checking, documentation, audit trail, risk mitigation. |
| **Infrastructure** | Security, monitoring, compliance, incident response, disaster recovery, automation. |
| **Data** | Privacy, protection, quality, integrity, governance, retention, incident response. |

---

## Pre-Audit Checklist

### Preparation & Planning
- [ ] Audit scope and objectives clearly defined
- [ ] Audit team assembled and roles assigned
- [ ] Audit tools and resources prepared
- [ ] Audit timeline and milestones established
- [ ] Stakeholder communication and expectations set

### Documentation & Access
- [ ] All relevant documentation collected and reviewed
- [ ] Access to systems and data properly configured
- [ ] Audit trail and logging capabilities verified
- [ ] Compliance requirements and standards identified
- [ ] Previous audit findings and remediation status reviewed

### Security & Compliance
- [ ] Security scanning tools configured and tested
- [ ] Compliance requirements validated and documented
- [ ] Data privacy and protection measures verified
- [ ] Access controls and authentication mechanisms tested
- [ ] Audit logging and monitoring systems configured

### Testing & Validation
- [ ] Test environments prepared and validated
- [ ] Testing tools and methodologies confirmed
- [ ] Test data prepared and sanitized
- [ ] Performance testing capabilities verified
- [ ] Security testing procedures validated

### Communication & Reporting
- [ ] Reporting templates and formats prepared
- [ ] Communication channels established
- [ ] Escalation procedures documented and tested
- [ ] Stakeholder notification procedures prepared
- [ ] Audit findings documentation process established

---

## Naming Conventions (summary)

- **snake_case** for file names, function names, and variables.
- **PascalCase** for class names and report titles.
- **UPPER_SNAKE_CASE** for constants and configuration values.
- Use descriptive names; keep patterns consistent across audit docs and reports.

---

## Documentation Standards (summary)

- Document findings with clear descriptions and impact.
- Include evidence and remediation recommendations with priority.
- Map to compliance and regulatory requirements where applicable.
- Document methodology, scope limitations, and follow-up tracking.

---

**Full rule:** For the complete checklist and Cursor application (globs, alwaysApply), see [.cursor/rules/audit.md](.cursor/rules/audit.md).
