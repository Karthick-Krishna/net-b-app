# Premier Mobile Banking — REST API Documentation

This document describes the core banking RESTful API endpoints, request/response formats, authentication flows, error handling, and security models.

---

## 1. Authentication & Headers

All authenticated endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

For financial write operations (transfers, bill payments, card controls), idempotency keys are supported to prevent duplicate payments:

```http
x-idempotency-key: <UNIQUE_UUID_OR_TIMESTAMP>
```

---

## 2. API Endpoints

### 2.1 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Log in via customer ID/username & password, or biometric challenge | No |
| `POST` | `/api/auth/register` | Register a new online banking customer and auto-provision accounts | No |
| `GET` | `/api/auth/me` | Fetch authenticated customer profile and KYC status | Yes |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit one-time password (Sandbox: `123456`) | Yes |
| `POST` | `/api/auth/change-password` | Update account password with current credential validation | Yes |
| `POST` | `/api/auth/toggle-biometric` | Enable or disable biometric login for device | Yes |

#### Login Request Sample:
```json
{
  "identifier": "premier_user",
  "password": "Password@123",
  "isBiometric": false
}
```

#### Login Response Sample:
```json
{
  "success": true,
  "user": {
    "id": "c1f7a0...",
    "username": "premier_user",
    "customer_id": "GB4490182",
    "full_name": "Alexander Vance",
    "email": "alexander.vance@premierbanking.com",
    "role": "USER",
    "biometric_enabled": true
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

---

### 2.2 Accounts & Balances (`/api/accounts`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts` | Get all bank accounts with live balances, primary totals, and currencies |
| `GET` | `/api/accounts/:id` | Get single account details, ledger entries, and recent transactions |
| `GET` | `/api/accounts/:id/statement` | Generate official statement with date range filtering (`startDate`, `endDate`) |
| `POST` | `/api/accounts/open` | Open a new Savings, Current, or Foreign Currency account |

---

### 2.3 Money Transfers & FX (`/api/transfers`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transfers` | Execute atomic double-entry transfer with idempotency protection |
| `GET` | `/api/transfers/fx-rates` | Live indicative multi-currency interbank exchange rate matrix |
| `POST` | `/api/transfers/calculate` | Compute real-time fees, taxes, exchange rates, and delivery estimates |

#### Process Transfer Request:
```json
{
  "sourceAccountId": "acc-uuid",
  "counterpartyName": "Charlotte Vance",
  "counterpartyAccount": "400515-88129033",
  "bankName": "Premier Bank UK",
  "ifscSwift": "HBUKGB41LHR",
  "amount": 250.00,
  "currency": "GBP",
  "description": "Family Support",
  "transactionType": "DOMESTIC_TRANSFER",
  "idempotencyKey": "trans-1700000000"
}
```

---

### 2.4 Beneficiaries (`/api/beneficiaries`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/beneficiaries` | List saved beneficiaries sorted by favorite |
| `POST` | `/api/beneficiaries` | Add new beneficiary with transfer limit and OTP security authorization |
| `PUT` | `/api/beneficiaries/:id` | Update beneficiary nickname or daily limits |
| `DELETE` | `/api/beneficiaries/:id` | Remove beneficiary from address book |
| `POST` | `/api/beneficiaries/:id/toggle-fav` | Toggle favorite star status |

---

### 2.5 Utility & Bill Payments (`/api/bills`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bills` | List pending and paid utility bills |
| `POST` | `/api/bills/fetch` | Lookup bill amount and consumer name by category & consumer number |
| `POST` | `/api/bills/pay` | Pay bill from selected account via core banking ledger |

---

### 2.6 Card Management (`/api/cards`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cards` | List all debit and credit cards issued to customer |
| `GET` | `/api/cards/:id` | Get card details, spending usage, and recent card purchases |
| `POST` | `/api/cards/:id/reveal` | Challenge PIN (Sandbox: `1234`) to reveal full card number & CVV |
| `POST` | `/api/cards/:id/freeze` | Instantly toggle temporary freeze / unfreeze |
| `POST` | `/api/cards/:id/block` | Permanently block lost/stolen card and order replacement |
| `POST` | `/api/cards/:id/controls` | Update toggles (online, international, contactless) and daily limits |
| `POST` | `/api/cards/:id/change-pin` | Change 4-digit ATM and transaction PIN |
| `POST` | `/api/cards/:id/pay-bill` | Pay outstanding credit card balance from savings account |

---

### 2.7 Deposits & Investments (`/api/deposits`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/deposits` | List active Fixed & Recurring Deposits |
| `POST` | `/api/deposits/calculate` | Calculate maturity payout and interest compounding |
| `POST` | `/api/deposits/create` | Open new Fixed Deposit or Recurring Deposit via ledger debit |
| `POST` | `/api/deposits/:id/withdraw` | Simulate premature withdrawal penalty and net payout |

---

### 2.8 Loans & Credit (`/api/loans`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/loans` | List active loans and upcoming EMI schedule |
| `POST` | `/api/loans/calculate-emi` | Dynamic EMI calculator with amortization preview |
| `POST` | `/api/loans/apply` | Submit digital loan application |
| `GET` | `/api/loans/eligibility` | Check pre-approved loan amounts and credit tier |

---

### 2.9 Support & Live Assistant (`/api/support`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/support/faqs` | Searchable FAQ database |
| `GET` | `/api/support/tickets` | List customer's support tickets and disputes |
| `POST` | `/api/support/tickets` | Open formal transaction dispute or service request |
| `GET` | `/api/support/tickets/:id` | Get ticket messages and conversation history |
| `POST` | `/api/support/tickets/:id/message` | Send message and receive contextual banking assistant advice |
| `POST` | `/api/support/appointments` | Book appointment at flagship Premier branch |

---

### 2.10 Admin Console (`/api/admin`) — Role-Based Protected

Accessible to `SUPER_ADMIN`, `OPERATIONS`, `SUPPORT`, `COMPLIANCE`, `AUDITOR`.

| Method | Endpoint | Description | Permitted Roles |
|---|---|---|---|
| `GET` | `/api/admin/overview` | Executive KPI overview metrics and ledger balance check | All Admin Roles |
| `GET` | `/api/admin/customers` | Customer portfolio with account count & KYC status | All Admin Roles |
| `POST` | `/api/admin/customers/:id/toggle-lock` | Freeze/unfreeze customer access | SUPER_ADMIN, OPERATIONS, COMPLIANCE |
| `GET` | `/api/admin/ledger` | Inspect double-entry journal entries in real-time | All Admin Roles |
| `GET` | `/api/admin/transactions` | Monitor live transactions across all accounts | All Admin Roles |
| `GET` | `/api/admin/cards` | Monitor card status, limits, and blocks | All Admin Roles |
| `GET` | `/api/admin/tickets` | Manage and resolve customer support tickets | All Admin Roles |
| `PUT` | `/api/admin/tickets/:id/status` | Update ticket status and add resolution note | SUPER_ADMIN, OPERATIONS, SUPPORT |
| `GET` | `/api/admin/audit-logs` | Immutable audit log trail with timestamps and IP | All Admin Roles |
