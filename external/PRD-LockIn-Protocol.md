# Product Requirements Document (PRD): LockIn Protocol

**Document version:** 1.0  
**Date:** 2025-03-02  
**Product:** LockIn Protocol  
**Status:** Draft  

---

## 1. Executive Summary

LockIn Protocol is an **open-source** habit-tracking and accountability application. Users set daily commitments with optional photo check-ins and can invite accountability partners to verify completion. There is **no cryptocurrency, no staking, and no monetization**. Commitments and outcomes are recorded in the application. The product targets anyone who wants structured accountability beyond reminders—students, professionals, and teams—without any financial barrier.

This PRD defines the scope, features, and technical requirements for the application.

---

## 2. Product Overview

### 2.1 Purpose

- Turn habit-building into structured, verifiable action **without money at risk**.
- Provide transparent records for commitments and outcomes in the application.
- Support peer accountability through designated partners (no payment to partners).
- Keep the product free and open source; no paid tiers or revenue model.

### 2.2 Target Users

- **Primary:** Users who create commitments, submit check-ins, and optionally use accountability partners to verify. No wallet or crypto required.
- **Secondary:** Accountability partners who receive a link to approve or reject check-ins; they do not receive any payment. Invited via link or in-app.

### 2.3 Key Differentiators

- **Open source:** No lock-in; community can extend and self-host.
- **No crypto:** No wallet, no gas, no tokens; lower barrier to use.
- **Application-only:** All logic and data in the app; no blockchain or smart contracts.
- **Optional verification:** Backend and/or partner review for check-ins; no on-chain component.

---

## 3. Scope and Deliverables

### 3.1 In Scope (MVP)

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | Commitment creation/management | User sets goal, time window, check-in rules; optional partner. Implemented in frontend and backend. |
| 2 | Photo check-ins | Upload via app; backend optionally verifies (goal-aware logic); stored in app. No on-chain submission. |
| 3 | Accountability partners | Invite via link or in-app; partner approves or rejects; no payout. |
| 4 | Resolution | Success/fail/expired by app logic; history and dashboard. No funds. |
| 5 | Web frontend | Sign-up, UI for all flows, basic dashboard. Next.js 15, Tailwind; hosted on Vercel or similar. |
| 6 | Backend (optional) | Persistence, optional photo verification, optional notifications (e.g. Firebase). Node.js/Express or serverless; Supabase or similar for profiles and check-in metadata. |

### 3.2 Out of Scope (Explicit)

- Any blockchain, wallet, or cryptocurrency.
- Any staking, fees, or monetization.
- Mandatory KYC (optional account only).
- Custodial or financial services.
- Native mobile app (web-only for MVP unless otherwise scoped).
- Legal/regulatory implementation (handled by operators/legal as needed; spec defines compliance context only).

---

## 4. Functional Requirements

### 4.1 User and Partner Flows

- **FR-1** User can sign up (email or optional social login) and optionally create a profile (name, photo).
- **FR-2** User can create a commitment with: goal text, time window/deadline, check-in rules (e.g. one photo per day), and optional accountability partner (link or in-app invite).
- **FR-3** User can submit photo check-ins within the commitment window; backend stores and optionally verifies; outcome recorded (success/fail/expired).
- **FR-4** When deadline passes or required check-ins are missing or rejected, commitment is marked failed or expired; no funds moved.
- **FR-5** Partner can be invited via link; partner approves or rejects in app; no payout.
- **FR-6** User can view commitment and resolution history in the app.

### 4.2 Verification and Disputes

- **FR-7** Backend may perform goal-aware verification on each photo; result is pass/fail/borderline; stored in app. No on-chain attestation.
- **FR-8** For borderline or by design, system may flag for partner review within a defined window.
- **FR-9** Resolution logic is in the application; no blockchain.

### 4.3 Non-Functional Requirements

- **NFR-1** Frontend: responsive web; no wallet or chain dependency.
- **NFR-2** Backend: secure storage; off-chain data (profiles, photos) with defined retention and user access/deletion per data protection.
- **NFR-3** Documentation: user-facing help and technical docs for setup and operations.

---

## 5. Technical Stack (Summary)

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, Tailwind CSS; Vercel or similar |
| Backend | Optional Node.js/Express or serverless; Supabase or similar; optional Firebase (notifications) |
| Verification | Optional goal-aware logic or external API; no chain |
| Hosting | Vercel (frontend); Supabase or similar (DB/storage); optional Firebase |

No chain, no Moralis, no wagmi/viem.

---

## 6. Acceptance Criteria (High Level)

- User can complete full flow: sign up, create commitment with optional partner, perform check-in(s), and reach resolution (success or failure) with outcome recorded in the app.
- Partner can be invited via link and approve or reject in app; no payout.
- No funds or tokens are held or moved; product is application-only.
- Data handling (retention, access, deletion) is documented and implemented per privacy policy.

---

## 7. Assumptions and Dependencies

- Operators/maintainers define branding, copy, and privacy/terms as needed for deployment.
- Third-party services (e.g. Supabase, Firebase, optional verification APIs) are available and within budget for deployers.
- No security audit of smart contracts (no contracts); app security and data handling as per best practices.

---

## 8. Success Metrics (Examples)

- Successful E2E flow (sign up, create, check-in, resolve) in the application.
- Documentation and runbooks sufficient for community or team operations and support.
- No dependency on any blockchain or payment system.

---

## 9. Approval and Sign-off

This PRD defines the open-source LockIn Protocol application. Scope and deliverables may be refined by the community or maintainers. No commercial deployment or mainnet is implied; the product is open source and non-monetized.

**Document owner:** [To be assigned]  
**Last updated:** 2025-03-02 (converted to open-source, no-crypto scope).
