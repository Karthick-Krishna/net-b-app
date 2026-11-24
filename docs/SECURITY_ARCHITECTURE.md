# Premier Mobile Banking — Security Architecture & Threat Model

This document outlines the security architecture, defense-in-depth design, cryptographic controls, and compliance features implemented across the Premier Mobile Banking platform.

---

## 1. Security Principles & Threat Mitigation

### 1.1 Zero-Trust Client Model
The frontend client is treated as an untrusted presentation layer. Available balances, transfer limits, fees, taxes, and authorization checks are strictly computed and enforced on the banking server. No critical business logic or financial ledger math is trusted from the client.

### 1.2 Defense-in-Depth Strategy
```
+-----------------------------------------------------------+
| Layer 1: Network & TLS 1.3 Transport Encryption           |
+-----------------------------------------------------------+
| Layer 2: CORS, Rate Limiting & Helmet Security Headers    |
+-----------------------------------------------------------+
| Layer 3: JWT Bearer Authentication & Refresh Token Vault  |
+-----------------------------------------------------------+
| Layer 4: Role-Based Access Control (RBAC) & Scopes        |
+-----------------------------------------------------------+
| Layer 5: Idempotency Key Middleware & Replay Protection   |
+-----------------------------------------------------------+
| Layer 6: Double-Entry General Ledger & Balance Verification|
+-----------------------------------------------------------+
| Layer 7: Immutable Audit Log Streaming & Security Alerts  |
+-----------------------------------------------------------+
```

---

## 2. Authentication & Session Management

### 2.1 JSON Web Tokens (JWT)
- **Access Tokens**: Short-lived (2 hours), signed using HS256/RS256 with strong secret keys. Carries user ID, username, email, full name, and assigned administrative role.
- **Refresh Tokens**: Long-lived (7 days), stored in the database as salted hashes (`bcrypt`). Rotated upon refresh.
- **Session Revocation**: Customers or administrators can instantly revoke active device sessions via `/api/profile/sessions/:id/revoke`.

### 2.2 Biometric & Step-Up Authentication
- Biometric authentication (Face ID / Touch ID / Android Fingerprint) utilizes device Secure Enclave and FIDO2 standards.
- Sensitive financial operations (viewing unmasked card numbers/CVV, transferring amounts exceeding threshold limits, and changing ATM PINs) require second-factor challenge (Transaction PIN or OTP).

### 2.3 Account Lockout & Brute Force Prevention
- The authentication controller tracks failed login attempts.
- Reaching 5 consecutive failed attempts automatically transitions `is_locked = 1`, blocking subsequent password verification attempts until unlocked by an authorized compliance or customer support officer.

---

## 3. Role-Based Access Control (RBAC) Matrix

Administrative operations are strictly segregated by role:

| Module / Operation | `USER` | `SUPER_ADMIN` | `OPERATIONS` | `SUPPORT` | `COMPLIANCE` | `AUDITOR` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Personal Banking & Transfers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View System KPI Overview | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Customer Portfolio | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lock / Unlock Customer Accounts | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| View Double-Entry Ledger | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Live Transaction Monitoring | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Resolve Support Tickets | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Immutable Audit Trail | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## 4. Financial Integrity & Ledger Guarantees

### 4.1 Double-Entry Accounting
Every transaction creates matching debit and credit journal entries. Available and ledger balances are reconciled against ledger records.

### 4.2 Idempotency Keys (`x-idempotency-key`)
Every transfer and payment accepts an idempotency key. If an identical key is sent within 24 hours, the server replays the existing transaction confirmation rather than executing a second debit. This prevents double debits caused by mobile network drops, slow connections, or accidental double-taps.

### 4.3 Atomic Isolation
All steps of a transfer—source account debit, destination credit, ledger entry insertion, transaction recording, and audit logging—occur within a single database transaction. If any assertion fails, the entire transaction rolls back cleanly.

---

## 5. Emergency Incident Response & Account Lockdown

Customers who suspect identity theft or a compromised device can trigger the **Emergency Security Lockdown** via the Security Centre:
1. Instantly freezes all active credit and debit cards (`is_frozen = 1`).
2. Suspends outgoing debit capabilities on all bank accounts (`status = 'FROZEN'`).
3. Logs a high-priority security audit event with IP, device identifier, and timestamp.
4. Requires formal identity verification through authorized support channels before reactivation.
