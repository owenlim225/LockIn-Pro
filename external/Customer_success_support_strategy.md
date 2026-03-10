# Customer Success and Support Strategy

LockIn Protocol is open source with no monetization. Support can be community-driven (e.g. GitHub issues, Discord) or maintained by a core team. This document describes practices for onboarding, issue resolution, and feedback.

## 1. Introduction

### 1.1 Role and Objectives

Support and success focus on onboarding, issue resolution, and user satisfaction. Objectives: reduce time-to-value, resolve issues quickly, and use feedback to improve the product.

### 1.2 Vision

Every user reaches their first successful commitment and check-in quickly. Issues are triaged, resolved, and used to improve the product. There are no paid tiers; all users are supported equally by the community or core team.

---

## 2. Customer Onboarding and Training

### 2.1 Onboarding Process

1. **Sign-up**: Email or optional social login. Optional profile (name, photo) stored in the app.
2. **First commitment**: Guided flow. User sets one goal, window, and optional partner. No payment or wallet.
3. **First check-in**: User uploads photo within window. Backend or self verifies and records. Success message and short explanation of success vs failure.
4. **Optional partner**: If user invites a partner, show how to send the link and how the partner approves or rejects. No funds involved.

Any user who asks for help during onboarding can be tagged for “onboarding support” so responders focus on first-value steps.

### 2.2 Training Materials and Sessions

- **Help center**: Short articles for: signing up, creating a commitment, doing a photo check-in, inviting partners, understanding resolution (success vs failure).
- **Video**: One short walkthrough (create commitment, one check-in, resolution). No jargon.
- **Live sessions (optional)**: Periodic “office hours” for new users. Q&A on onboarding and first commitment. Record and link from help center.

Training for support agents: product walkthrough, commitment and check-in flows, verification and partner review, and where to escalate (backend, verification, account issues).

### 2.3 User Resources and Documentation

- **In-app**: Tooltips at commitment creation, check-in upload, and partner invite. Link to help center from dashboard and settings.
- **Docs**: One page per major flow. No wallet or chain; document app flows only.
- **Status / transparency**: Public status page for app and API if applicable. If verification or service is delayed, communicate and give a rough ETA.

---

## 3. Issue Management and Ticket Resolution

### 3.1 Ticketing System Workflow

- **Single queue**: All incoming requests (email, in-app, or form) create one ticket. Tag by type: onboarding, verification, partner review, bug, feedback.
- **Triage**: First response within 24 hours (business hours where applicable). Assign severity: P1 (e.g. cannot use app, data loss, security), P2 (blocking usage), P3 (workaround exists), P4 (question or suggestion).
- **Ownership**: Assign to an agent or maintainer. Track response time and resolution time by tag and severity.
- **Closure**: Resolve with a short summary and, if relevant, a link to a help article. Optionally ask for satisfaction on close.

### 3.2 Issue Prioritization and Escalation

- **P1**: Security concern, data loss, or app unusable. Escalate immediately to maintainers/engineering. User gets proactive updates until resolved.
- **P2**: User blocked (e.g. cannot check in, cannot create commitment). Target resolution within one business day or provide clear workaround and ETA.
- **P3**: Feature broken but workaround exists. Fix in next release or document workaround and add to backlog.
- **P4**: Questions, feedback, feature requests. Answer or log for product. No formal SLA; aim for response within 48 hours.

Escalation path: First responder → Support lead or maintainer → Engineering (for backend, verification). For disputes (e.g. verification or partner review), follow documented dispute process and time limits if defined.

### 3.3 Rapid Resolution Techniques

- **Runbooks**: Standard responses and steps for: “Check-in failed,” “Partner didn’t respond,” “Verification said fail but I did the thing,” “Account or login issues.” Update runbooks when product behavior changes.
- **Self-service**: Point users to help center and status page first. In-app FAQ for top 5 issues.
- **Proactive messaging**: If a known incident affects check-ins or resolution, notify affected users (email or in-app) with cause and expected fix time.

---

## 4. Customer Satisfaction and Health

### 4.1 NPS and CSAT Measurement

- **NPS**: Optional quarterly survey to a sample of active users. “How likely are you to recommend LockIn Protocol?” (0–10). Track trend and follow up on detractors.
- **CSAT**: Optional survey on ticket close. Use to improve quality and runbooks.

Set targets (e.g. NPS > 30, CSAT > 4.0) if formally measured; review when below.

### 4.2 User Health (Optional)

- **Signals**: Login frequency, commitments created, check-ins completed, resolution outcomes (success vs failure), support tickets (count and severity).
- **Score**: Simple model: Green (active last 14 days, at least one check-in or resolution), Yellow (inactive 14–30 days or one P2+ ticket open), Red (inactive 30+ days or repeated P1).
- **Use**: Prioritize outreach for Yellow; understand Red (churn or blockers). Refine with streak length and partner engagement if data available.

### 4.3 Feedback Collection and Analysis

- **In-product**: Optional feedback widget or short survey after key actions (e.g. after first resolution). “What would make LockIn more useful for you?”
- **Support**: Tag tickets that contain feature requests or complaints. Periodic summary for product: top themes, recurring issues, requested features.
- **Reviews**: If listed in app stores or mentioned on social, respond to negative reviews with a short, empathetic reply and offer to help via support.

---

## 5. Proactive Communication

### 5.1 Updates and Incidents

- **Product updates**: Release notes (email or in-app) for major features. Explain what changed and what the user should do, if anything.
- **Incidents**: Status page and, for major outages, notify affected users. Post-mortem summary where appropriate.

### 5.2 Managing Expectations

- **Verification**: Explain that check-ins are verified by automated logic and/or partner review. No guarantee of approval for borderline cases; point to dispute window and rules if defined.
- **No funds**: Clarify that LockIn does not hold or move money; there are no stakes or payouts.

---

## 6. Continuous Improvement

- **Product**: Prioritize backlog using support themes, NPS comments, and health signals. Repeated “check-in failed” or “partner didn’t respond” should drive fixes and docs.
- **Process**: If certain ticket types spike, update runbooks and help content. If onboarding tickets are high, improve first-run flow and in-app guidance.

---

## 7. Best Practices Summary

- **Respond fast**: First response within 24 hours; P1/P2 get same-day attention.
- **One owner**: Each ticket has an owner where possible.
- **Document once**: Use runbooks and help center so repeat issues are solved with links.
- **Measure**: NPS, CSAT, response time, resolution time if metrics are collected.
- **Escalate cleanly**: P1 to engineering/maintainers immediately; disputes follow documented process.
- **Proactive when it matters**: Status page and incident comms.

---

## References

- LockIn Protocol spec: scope, actors, commitment and check-in flows, resolution (no stake or payout).
- Internal: Escalation runbooks, status page, help center, and ticketing configuration if used.
