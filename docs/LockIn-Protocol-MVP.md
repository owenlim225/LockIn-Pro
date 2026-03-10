# LockIn Protocol — Comprehensive MVP Documentation

**Version:** 1.0  
**Date:** 2025-03-02  
**Status:** Draft  

This document consolidates LockIn Protocol for MVP implementation. The **canonical** source for product and architecture is [DOCUMENTATION.MD](../DOCUMENTATION.MD). LockIn is an **open-source** project with **no cryptocurrency** and **no monetization**. This file is the single reference for implementers; unknowns are listed in **Open questions / TBD**.

---

## 1. Overview and core principles

LockIn Protocol is an **open-source productivity application** that uses commitment contracts and social accountability to help users achieve goals. Users define goals, submit proof, and can use optional peer review. There is no financial staking, no crypto, and no fees.

The system combines:

- **Behavioral economics** — Commitment contracts (inspired by Beeminder and StickK), without money at risk.
- **Social accountability** — Optional peer reviewers (friends, mentors) who verify completion; no payment.
- **Transparency** — Goals, proof references, and outcomes stored in the application.

**Core principles:**

| Principle | Description |
|-----------|-------------|
| **Commitment** | Users state goals and deadlines; the act of recording and optionally sharing increases follow-through. |
| **Accountability** | Optional peer reviewers verify completion; no financial rewards or penalties. |
| **Transparency** | Goal state and outcomes are stored and visible to the user (and optionally to reviewers). |

---

## 2. Target users and value proposition

- **Goal-setters:** Users who create goals, submit proof, and record success or failure; optionally they invite a peer to verify.
- **Peer reviewers:** Friends, mentors, or coaches who optionally approve or reject proof; they do not receive any payment.

**No revenue model** — LockIn is open source and community-maintained; there is no monetization.

---

## 3. MVP scope

### 3.1 In scope

- **Account and profile:** Sign up (email or optional social login); optional profile (name, photo). No wallet or KYC.
- **Goal creation:** Title, description, deadline, proof type, optional peer reviewer (or self-verify).
- **Proof submission:** User submits proof (image, text, or link); stored in app storage (or optional IPFS); only reference/hash needed for integrity.
- **Verification:** Self-verify or peer review; states: Pending, Approved, Rejected, Expired.
- **Web frontend:** Next.js (or equivalent), Tailwind; pages for sign-up, create goal, submit proof, dashboard, history.
- **Backend / storage:** Goal and proof storage, optional notifications, optional peer review flow.

### 3.2 Out of scope for MVP

- Any blockchain, wallet, or cryptocurrency.
- Any fees, payments, or monetization.
- KYC or identity verification.
- Full social layer (progress feeds, leaderboards, community challenges) — defer to post-MVP if desired.
- Dispute appeal flow (secondary reviewer) — optional; see TBD.

---

## 4. User flow

1. **Sign up** — User creates account (no wallet).
2. **Goal creation** — User defines goal: title, description, deadline, optional peer reviewer or self-verify.
3. **Proof submission** — User submits proof before deadline; backend stores proof and records submission.
4. **Verification** — Self-verify or peer approves/rejects; outcome recorded (success, failed, expired).

---

## 5. Goal types

| Type | Description | Examples |
|------|-------------|----------|
| **Binary** | Done or not. | Go to the gym, finish assignment. |
| **Quantitative** | Measurable output. | Write 1000 words, study 3 hours. |
| **Streak** | Repeated daily or weekly. | Meditate daily for 7 days. |

---

## 6. No escrow or staking

- There is **no money at risk**. No escrow, no stakes, no tokens.
- **Success:** Recorded as completed; streaks and history updated.
- **Failure:** Recorded as failed or expired; no financial consequence.

---

## 7. Peer reviewers

- **Optional:** User can assign a peer (friend, mentor) to verify a goal.
- **No payment:** Reviewers do not receive any reward or stake.
- **Requirements:** None (no KYC or minimum goals); trust-based.
- **Flow:** Reviewer gets link/notification; approves or rejects; outcome stored.

---

## 8. Application architecture (no smart contracts)

LockIn is an application only. No blockchain or smart contracts.

- **Goals:** Stored in app database (id, user, title, description, deadline, reviewer, status, proofRef).
- **Proof:** Stored in app storage or optional IPFS; only reference or hash in DB.
- **Users and reviewers:** Accounts and optional profiles; no wallet addresses.
- **History:** Completed, failed, expired states for dashboard and streaks.

---

## 9. Validation and proof

- **Proof types:** Image, text, or link as defined per goal.
- **Timeout:** If peer reviewer does not respond by deadline, goal can be marked expired or auto-failed (TBD).
- **Disputes:** No financial stakes; any dispute flow (e.g. secondary reviewer) is optional and TBD.

---

## 10. Tech stack and deployment

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, Tailwind; sign-up, goal creation, proof upload, dashboard, history. |
| **Backend** | Optional API (e.g. Node.js/Express or serverless); goal and proof storage, notifications. |
| **Storage** | App database (e.g. PostgreSQL, Supabase); file storage or optional IPFS for proof. |
| **CI/CD** | Tests on push; deploy to chosen host (e.g. Vercel, Railway); no chain deployment. |

No wallet libraries, no RPC, no block explorer.

---

## 11. Security and privacy

- **Authentication:** Secure sign-up and login; no wallet or keys.
- **Data:** Proof and goal data stored per privacy policy; retention and deletion as defined.
- **Proof integrity:** Optional hashing or IPFS to detect tampering; no on-chain component.

---

## 12. Legal and compliance

- **Data protection:** Comply with applicable laws (e.g. GDPR-like) for user data and proof.
- **No financial regulation:** No custody, gambling, or securities from the product; no KYC or stablecoin.

---

## 13. Operations and support

- **Onboarding:** Help and tooltips for sign-up, first goal, proof upload, optional peer review.
- **Support:** Community-driven (e.g. GitHub issues, Discord); tag by type: onboarding, verification, bug, feedback.
- **Runbooks:** Optional standard responses for “proof not accepted,” “reviewer didn’t respond,” “account issues.”

---

## 14. Audit and quality

- **Pre-release:** Functional testing, accessibility, and documentation review as needed.
- **No smart contracts:** No on-chain audit; focus on app security and data handling.

---

## 15. Open questions / TBD

| # | TBD | Impact |
|---|-----|--------|
| 1 | **Reviewer timeout** — When to mark goal expired if peer doesn’t respond. | Affects UX and state logic. |
| 2 | **Proof storage** — App-only vs optional IPFS; retention period. | Affects backend and privacy. |
| 3 | **Dispute flow** — Secondary reviewer in MVP or post-MVP. | Affects scope. |
| 4 | **Social features** — Public goals, feeds, leaderboards; post-MVP or not. | Affects roadmap. |

---

## 16. MVP checklist (implementation)

- [ ] **User flow:** Sign up, create goal, submit proof, self-verify or peer review, view history.
- [ ] **Frontend:** Pages for sign-up, create goal, submit proof, dashboard, history.
- [ ] **Backend / storage:** Goals, proof storage, optional notifications and peer review.
- [ ] **Deployment:** CI (tests), deploy to host; no chain.
- [ ] **Docs:** README, contributing, and user-facing help as needed.

---

## 17. References

| Document | Role |
|----------|------|
| [DOCUMENTATION.MD](../DOCUMENTATION.MD) | Canonical product and architecture (open source, no crypto, no monetization). |
| [spec.md](../spec.md) | User journey and flows (supplemental). |
| [external/PRD-LockIn-Protocol.md](../external/PRD-LockIn-Protocol.md) | Scope and NFRs (supplemental). |
| [external/DevOps_strategy.md](../external/DevOps_strategy.md) | CI/CD, monitoring, incident response. |
| [external/Customer_success_support_strategy.md](../external/Customer_success_support_strategy.md) | Onboarding, support, runbooks. |
| [external/audit-standards.md](../external/audit-standards.md) | Audit checklist summary (for docs/code quality). |
