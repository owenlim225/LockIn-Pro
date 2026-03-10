# DevOps and Infrastructure Strategy

LockIn Protocol is **open source** with **no cryptocurrency**. This document covers deployment, monitoring, and incident response for the **application stack only** (frontend, optional backend, database, optional notifications). There are no smart contracts or chain to deploy or monitor.

## 1. Introduction

### 1.1 Role Responsibilities

DevOps and SRE are responsible for deployment automation, monitoring, infrastructure reliability, incident response, and performance of the LockIn Protocol **application**: frontend (Next.js on Vercel), optional backend (Node.js/Express or serverless), database (e.g. Supabase), and optional notifications (e.g. Firebase).

### 1.2 Objectives and Scope

- **Automate** builds, tests, and deployments for frontend (Vercel) and optional backend (e.g. Vercel serverless or AWS Lambda).
- **Monitor** app and API availability, verification latency (if applicable), and database health.
- **Ensure** infrastructure is reliable, scalable, and recoverable within defined targets.
- **Respond** to outages and performance issues with clear runbooks and rollback paths.

**Scope:** Application only. No chain, no contracts, no indexer.

---

## 2. Deployment Automation

### 2.1 CI/CD Pipeline Design

- **Frontend (Next.js)**  
  - Vercel: connect repo; build on push to main (or preview branches). Use env vars for backend URL and any API keys.  
  - Run lint and unit tests in CI (e.g. GitHub Actions) before deploy. Preview deployments for PRs.

- **Backend (Node.js/Express or serverless)**  
  - Build and test in CI. Deploy to Vercel serverless or AWS Lambda (e.g. via GitHub Actions).  
  - Migrations or one-off jobs (e.g. Supabase schema, indexes) run as separate steps or manual until tooled.

- **Secrets**: No secrets in repo. Use Vercel env, AWS Secrets Manager, or GitHub Secrets. Any verification or third-party API keys stored securely and rotated per policy.

### 2.2 Tools and Technologies

| Layer        | Tooling                | Notes                          |
|-------------|------------------------|--------------------------------|
| Frontend    | Next.js 15, Vercel     | Serverless, edge, env per env |
| Backend     | Node.js/Express        | Vercel serverless or AWS Lambda |
| DB / Auth   | Supabase or similar    | Profiles, commitments, check-ins |
| Notifications | Firebase (optional)  | Push, email                    |
| CI          | GitHub Actions         | Test, build, deploy            |
| CD          | Vercel (frontend + optional backend) | No contract deploys   |

### 2.3 Deployment Best Practices

- **Immutable deploys**: Each deploy is a new version; no in-place edits. Rollback = redeploy previous version.
- **Config per environment**: Staging vs production API URLs, DB, API keys. Never mix production secrets in staging.
- **Database**: Migrations versioned; apply in order. Back up before major releases.

---

## 3. System Monitoring and Alerting

### 3.1 Monitoring Architecture

- **Frontend**: Vercel Analytics and/or custom health check endpoint (e.g. `/api/health`) that returns 200 when app and critical env are present. Optionally ping from external monitor (e.g. UptimeRobot, Better Uptime).
- **Backend**: Health endpoint that checks database connectivity and optional verification service. Log errors and latency.
- **Database**: Monitor connectivity and query latency; alert on errors or saturation.

### 3.2 Key Metrics and Dashboards

- **Availability**: Uptime % for frontend and backend (e.g. 99.5% target). Status page reflects this.
- **Latency**: P95/P99 for backend API (e.g. verification if used). Target e.g. &lt;5s for verification.
- **Business**: Commitments created per day, check-ins per day, resolutions (success/failure). Dashboard for product and ops.
- **Errors**: Backend error rate (4xx/5xx), verification failures. Log aggregation with alerts on threshold.

### 3.3 Alerting Strategies

- **P1 (page immediately)**: Frontend or backend down, or spike in errors that might indicate a critical bug.
- **P2 (notify within 15–30 min)**: Latency above target, error rate above threshold, DB degraded.
- **P3 (ticket, next business day)**: Gradual degradation, non-critical dependency issues.

Channels: P1/P2 to Slack/email/PagerDuty; P3 to ticket queue. Runbooks linked in alerts (e.g. “Check backend logs,” “Rollback backend to previous version”).

---

## 4. Infrastructure Management and Scalability

### 4.1 Containerization (Optional for MVP)

- **MVP**: Frontend and backend may run as Vercel serverless without Docker. If backend moves to ECS/EKS or a VM, containerize with Docker; use a minimal Node image and non-root user.
- **Future**: Optional containers for backend workers (e.g. verification queue). Not required for initial scale.

### 4.2 Cloud Platforms (Vercel, AWS)

- **Vercel**: Frontend and optionally backend serverless. Use env and project settings; avoid hardcoded URLs. Enable preview deployments and protect production branch.
- **AWS (if used)**: Lambda for backend or verification; S3 for temporary photo storage if needed; Secrets Manager for API keys. IAM least privilege.
- **Supabase**: Managed Postgres and auth. Scale tier as usage grows. Backups and point-in-time recovery per plan.
- **Firebase (optional)**: Push and email. Monitor delivery and errors.

### 4.3 Infrastructure as Code

- **Backend / infra**: If using AWS, define Lambda, API Gateway, and permissions in Terraform or AWS SAM/Serverless so changes are reviewable and repeatable.
- **Secrets and config**: No IaC for secret values; reference secret names/ARNs in IaC. Rotate API keys per policy.

---

## 5. Incident Response and Management

### 5.1 Outage Detection and Mitigation

- **Detection**: Alerts from monitoring (availability, error rate, P1/P2). User reports and status page checks.
- **Mitigation**: Follow runbooks. Examples: backend down → check logs and deploy rollback; verification slow → scale or restart worker; DB issue → check provider status and backups.

### 5.2 Incident Handling Workflow

1. **Declare**: First responder declares incident and severity (P1/P2). Notify channel and, for P1, page on-call.
2. **Communicate**: Update status page and, for major impact, notify affected users (email or in-app). Internal updates every 15–30 min until stable.
3. **Resolve**: Apply fix or rollback. Verify with health checks and smoke tests.
4. **Close**: Post-incident summary: what happened, root cause, what was done, and follow-up actions. Store in incident log.

### 5.3 Disaster Recovery and Rollback Plans

- **Frontend**: Rollback via Vercel (previous deployment). Revert code and redeploy if needed.
- **Backend**: Redeploy previous version from CI artifact or Git tag. Restore config and secrets from secure store. If DB corrupted (Supabase), use backups and point-in-time recovery per plan.
- **Key or credential compromise**: Rotate immediately; deploy new config. Document in security runbook.

---

## 6. Performance Optimization

- **Frontend**: Use Next.js best practices (e.g. static where possible, lazy load). Keep bundle size small; monitor Core Web Vitals on Vercel.
- **Backend**: Optimize verification path (e.g. async queue, caching) if used. Keep cold starts low for serverless (small bundle, minimal deps).
- **Database**: Index read-heavy queries; cache where appropriate.

---

## 7. Best Practices and Continuous Improvement

- **Automate first**: Prefer CI/CD and scripts over manual deploy.
- **Monitor and alert**: Proactive alerts with clear runbooks. Review and tune thresholds and runbooks after each incident.
- **Document**: Runbooks for deploy, rollback, and top 5 incidents. Keep in repo or wiki and link from alerts.
- **Review**: Post-incident review and blameless culture. Update runbooks, add tests or checks to prevent recurrence.
- **Security**: Secure API keys and credentials; rotate per policy. No secrets in code or public repos.

---

## References

- LockIn Protocol spec: technical stack (Next.js, Node/Express, Supabase, optional Firebase), architecture; no chain or contracts.
- Internal: CI/CD configs, runbooks, status page, and incident log location.
