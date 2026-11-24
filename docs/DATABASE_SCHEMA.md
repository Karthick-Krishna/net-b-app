# Premier Mobile Banking — Database Architecture & Double-Entry Ledger

This document details the relational database architecture, entity relationships, constraints, and double-entry general ledger implementation.

---

## 1. Architectural Overview & Financial Integrity Principles

In compliance with international banking standards, available balances are **never** updated in frontend state. Every monetary movement operates under strict ACID (Atomicity, Consistency, Isolation, Durability) guarantees:

1. **Double-Entry General Ledger**: Every transfer creates matching debit and credit journal entries. The sum of all debits equals the sum of all credits across the system clearing balance.
2. **Atomic Execution**: Account balance updates, transaction records, ledger entries, and audit logs execute within a single atomic database transaction. Any failure triggers an automatic rollback with zero partial writes.
3. **Idempotency Key Enforcement**: Financial write endpoints enforce unique `idempotency_key` strings. Re-submitting an identical key returns the original transaction receipt without re-executing ledger deductions.
4. **Immutable Audit Trail**: Audit logs, ledger entries, and past transaction records are strictly append-only.

---

## 2. Entity-Relationship Diagram

```
+--------------------+           +------------------------+
|       users        | 1 ----- 1 |    customer_profiles   |
+--------------------+           +------------------------+
          | 1
          |
          | n
+--------------------+           +------------------------+
|      accounts      | 1 ----- n |     ledger_entries     |
+--------------------+           +------------------------+
          | 1                                 | n
          |                                   | 1
          | n                                 |
+--------------------+           +------------------------+
|       cards        |           |      transactions      |
+--------------------+           +------------------------+
          | 1
          |
          +--- beneficiaries
          +--- bill_payments
          +--- deposits
          +--- loans
          +--- notifications
          +--- support_tickets --- support_messages
          +--- auth_sessions
          +--- audit_logs
```

---

## 3. Relational Table Specifications

### 3.1 `users`
Core customer identity, credentials, role, and security status.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique UUID identifier |
| `username` | TEXT | UNIQUE, NOT NULL | Alphanumeric login identifier |
| `email` | TEXT | UNIQUE, NOT NULL | Primary contact email |
| `phone` | TEXT | UNIQUE, NOT NULL | Registered SMS mobile number |
| `password_hash` | TEXT | NOT NULL | Bcrypt salted hash (Cost 10) |
| `full_name` | TEXT | NOT NULL | Customer legal name |
| `role` | TEXT | NOT NULL | `USER`, `SUPER_ADMIN`, `OPERATIONS`, `SUPPORT`, `COMPLIANCE`, `AUDITOR` |
| `is_active` | INTEGER | DEFAULT 1 | 1 = Active, 0 = Inactive |
| `is_locked` | INTEGER | DEFAULT 0 | 1 = Locked by security policy |
| `failed_logins` | INTEGER | DEFAULT 0 | Failed login attempt counter |
| `biometric_enabled` | INTEGER | DEFAULT 1 | 1 = Face ID / Fingerprint enabled |
| `transaction_pin_hash`| TEXT | NULL | Bcrypt hash of 4-digit transaction PIN |
| `avatar_url` | TEXT | NULL | Profile image URL |
| `created_at` | TEXT | DEFAULT now | ISO8601 creation timestamp |

---

### 3.2 `customer_profiles`
Detailed KYC and address verification.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `user_id` | TEXT | FOREIGN KEY (users.id) | Linked user account |
| `customer_id` | TEXT | UNIQUE, NOT NULL | Banking identifier (e.g., `GB4490182`) |
| `dob` | TEXT | NOT NULL | Date of birth (`YYYY-MM-DD`) |
| `address` | TEXT | NOT NULL | Street address |
| `city` | TEXT | NOT NULL | Residential city |
| `country` | TEXT | NOT NULL | Country |
| `postal_code` | TEXT | NULL | Postal / Zip code |
| `kyc_status` | TEXT | DEFAULT 'VERIFIED' | `VERIFIED`, `PENDING`, `UNDER_REVIEW` |
| `preferred_language` | TEXT | DEFAULT 'en' | Customer locale |

---

### 3.3 `accounts`
Deposit, current, savings, and multi-currency bank accounts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `user_id` | TEXT | FOREIGN KEY (users.id) | Owner customer |
| `account_number` | TEXT | UNIQUE, NOT NULL | Masked / unique account number |
| `account_name` | TEXT | NOT NULL | E.g. "Premier Global Savings" |
| `account_type` | TEXT | NOT NULL | `SAVINGS`, `CURRENT`, `SALARY`, `FIXED_DEPOSIT`, `RECURRING_DEPOSIT`, `FOREIGN_CURRENCY` |
| `currency` | TEXT | DEFAULT 'GBP' | `GBP`, `USD`, `EUR`, `JPY`, etc. |
| `available_balance` | REAL | NOT NULL, DEFAULT 0 | Real-time spendable funds |
| `ledger_balance` | REAL | NOT NULL, DEFAULT 0 | Settled accounting book balance |
| `status` | TEXT | DEFAULT 'ACTIVE' | `ACTIVE`, `DORMANT`, `FROZEN`, `CLOSED` |
| `branch_name` | TEXT | NOT NULL | Registered branch facility |
| `ifsc_swift` | TEXT | NOT NULL | Bank SWIFT / BIC identifier |
| `sort_code` | TEXT | DEFAULT '40-05-15' | UK Clearing sort code |

---

### 3.4 `ledger_entries` (Double-Entry Core Ledger)
Immutable financial book entries.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `transaction_id` | TEXT | NOT NULL | Associated transaction master record |
| `account_id` | TEXT | FOREIGN KEY (accounts.id) | Bank account debited or credited |
| `entry_type` | TEXT | NOT NULL | `DEBIT` or `CREDIT` |
| `amount` | REAL | NOT NULL | Positive monetary value |
| `currency` | TEXT | NOT NULL | Transaction currency |
| `balance_after` | REAL | NOT NULL | Available balance snapshot post-entry |
| `description` | TEXT | NOT NULL | Journal memo description |
| `created_at` | TEXT | DEFAULT now | Immutable timestamp |

---

### 3.5 `transactions`
Master transaction registry with metadata, counterparty details, fees, and references.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `reference` | TEXT | UNIQUE, NOT NULL | E.g. `TXN-202611-891042` |
| `user_id` | TEXT | FOREIGN KEY (users.id) | Initiating user |
| `source_account_id` | TEXT | FOREIGN KEY (accounts.id) | Originating account |
| `destination_account_id`| TEXT | NULL | Destination internal account (if internal) |
| `counterparty_name`| TEXT | NOT NULL | Recipient or merchant name |
| `counterparty_account`| TEXT | NULL | Recipient account number / IBAN |
| `bank_name` | TEXT | NULL | Recipient bank name |
| `ifsc_swift` | TEXT | NULL | Recipient SWIFT / BIC code |
| `amount` | REAL | NOT NULL | Transaction value |
| `currency` | TEXT | DEFAULT 'GBP' | Currency |
| `fee` | REAL | DEFAULT 0 | Transfer fee |
| `tax` | REAL | DEFAULT 0 | Regulatory tax / levy |
| `exchange_rate` | REAL | DEFAULT 1.0 | Applicable conversion multiplier |
| `description` | TEXT | NOT NULL | Payment reference memo |
| `category` | TEXT | NOT NULL | `TRANSFER`, `SALARY`, `UTILITIES`, `DINING`, etc. |
| `status` | TEXT | DEFAULT 'COMPLETED'| `COMPLETED`, `PENDING`, `FAILED` |
| `transaction_type` | TEXT | NOT NULL | `DOMESTIC_TRANSFER`, `INTL_TRANSFER`, `BILL_PAYMENT`, `CARD_PURCHASE` |
| `idempotency_key` | TEXT | UNIQUE, NULL | Deduplication idempotency key |

---

### 3.6 `cards`
Debit and credit card credentials and usage controls.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `user_id` | TEXT | FOREIGN KEY (users.id) | Cardholder user |
| `account_id` | TEXT | FOREIGN KEY (accounts.id) | Linked bank account |
| `card_number_masked` | TEXT | NOT NULL | `•••• •••• •••• 9821` |
| `card_number_last4` | TEXT | NOT NULL | `9821` |
| `card_type` | TEXT | NOT NULL | `DEBIT`, `CREDIT` |
| `card_tier` | TEXT | NOT NULL | `PREMIER_WORLD_ELITE`, `PREMIER_PLATINUM` |
| `cardholder_name` | TEXT | NOT NULL | Embossed cardholder name |
| `expiry_month` | TEXT | NOT NULL | `MM` |
| `expiry_year` | TEXT | NOT NULL | `YY` |
| `cvv_encrypted` | TEXT | NOT NULL | Encrypted / protected security code |
| `is_frozen` | INTEGER | DEFAULT 0 | 1 = Temporarily frozen |
| `is_blocked` | INTEGER | DEFAULT 0 | 1 = Permanently blocked / replaced |
| `pin_hash` | TEXT | NULL | Bcrypt hash of ATM PIN |
| `online_enabled` | INTEGER | DEFAULT 1 | E-commerce transaction toggle |
| `international_enabled`| INTEGER | DEFAULT 1 | Cross-border transaction toggle |
| `contactless_enabled` | INTEGER | DEFAULT 1 | Tap-to-pay toggle |
| `daily_spending_limit` | REAL | NOT NULL | Daily limit slider (GBP) |
| `credit_limit` | REAL | DEFAULT 0 | Credit limit (credit cards) |
| `available_credit` | REAL | DEFAULT 0 | Available credit (credit cards) |
| `min_due` | REAL | DEFAULT 0 | Minimum payment due |
| `reward_points` | INTEGER | DEFAULT 0 | Accumulated rewards |

---

### 3.7 `audit_logs`
Immutable security and compliance event stream.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `user_id` | TEXT | NULL | Actor user ID |
| `actor_role` | TEXT | NOT NULL | `USER`, `SUPER_ADMIN`, `OPERATIONS`, etc. |
| `action` | TEXT | NOT NULL | E.g. `FINANCIAL_TRANSFER`, `CARD_FROZEN` |
| `resource` | TEXT | NOT NULL | E.g. `TRANSACTION`, `CARD`, `USER` |
| `resource_id` | TEXT | NULL | ID of affected resource |
| `details` | TEXT | NULL | JSON stringified metadata |
| `ip_address` | TEXT | NULL | Request IP address |
| `created_at` | TEXT | DEFAULT now | ISO8601 timestamp |
