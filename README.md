# Premier Mobile Banking — Complete Modern Banking Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57.svg)](https://www.sqlite.org/)
[![Tests](https://img.shields.io/badge/Tests-9%20Passing-brightgreen.svg)]()

A complete, modern, premium mobile banking application inspired by the functionality, user experience, navigation, and visual excellence of leading international banking institutions (particularly HSBC Mobile Banking).

This is a **full-stack, production-grade digital banking platform**, not merely a UI prototype. It features a complete mobile-first responsive client with simulated device frames, a double-entry general ledger backend with ACID transaction isolation, an administrative operations portal, comprehensive security controls, automated test suites, and native Android/iOS build configurations.

---

## 1. Visual Identity & Design System

The application strictly adheres to the signature red-and-white visual identity:

- **Primary Red**: `#DB0011` (Signature action buttons, brand accents, active navigation indicators)
- **Dark Red**: `#B0000D` (Hover, active, and pressed button states)
- **Background**: `#F5F5F5` (Clean banking neutral canvas)
- **Card Background**: `#FFFFFF` (Rounded rectangular cards with subtle shadows)
- **Primary Text**: `#222222` (High-contrast financial typography)
- **Secondary Text**: `#777777` (Subdued metadata and labels)
- **Border**: `#E5E5E5` (Thin, refined structural borders)
- **Success**: `#168447` (Positive credits, settled payments, verified badges)
- **Error**: `#D92D20` (Security alerts, failed challenges, locked states)

All primary buttons use the signature red color with white text, rounded corners, consistent height, and loading indicators.

---

## 2. Interactive Device Frame & Viewport Switcher

To provide an authentic mobile banking experience directly in desktop or mobile browsers, the web application includes a top device switcher:

- **iPhone 16 Pro View**: Realistic titanium chassis, dynamic island, status bar (18:38, 5G, Wi-Fi, battery), and bottom home bar.
- **Google Pixel 9 View**: Android chassis with camera cutout and Material framing.
- **Full Screen Responsive View**: Expands to full viewport for mobile browsers or desktop testing.
- **Admin Management Portal**: Opens the full-page administrative banking console.

---

## 3. Pre-Seeded Test Credentials & Sandbox Accounts

The platform comes pre-seeded with realistic financial data. Use the one-click sandbox buttons on the login screen or enter these credentials manually:

### 3.1 Primary Premier Customer
- **Username**: `premier_user`
- **Customer ID**: `GB4490182`
- **Password**: `Password@123`
- **Customer Name**: Alexander Vance (Tier 3 Premier KYC Verified)
- **Transaction / Card PIN**: `1234`
- **Test Security OTP**: `123456`
- **Accounts**:
  1. *Premier Global Savings* — `£48,250.75` (Sort Code: `40-05-15`, SWIFT: `HBUKGB41LHR`)
  2. *Everyday Current Account* — `£9,840.20`
  3. *Executive Salary Account* — `£15,300.00`
  4. *High Yield Fixed Deposit* — `£25,000.00` (24 Mos @ 5.25% p.a.)
  5. *Systematic Recurring Deposit* — `£6,000.00` (12 Mos @ 4.80% p.a.)
  6. *Multi-Currency Global Wallet* — `$12,450.00 USD`
- **Cards**:
  1. *Premier World Elite Mastercard* (Credit, Limit: £30,000, Outstanding: £2,410.50, Points: 48,920)
  2. *Premier Platinum Debit Card* (Visa, Linked to Savings)
  3. *Global Multi-Currency Travel Card* (Mastercard, Linked to Foreign Currency Wallet)

### 3.2 Administrative Users (Role-Based Access)
All admin accounts use password: `Admin@123`

| Role | Username | Display Name | Permissions |
|---|---|---|---|
| **Super Admin** | `super_admin` | Victoria Sterling | Full administrative, customer, and ledger access |
| **Banking Operations** | `ops_officer` | Marcus Chen | Transaction monitoring, ledger review, account locks |
| **Customer Support** | `support_rep` | Elena Rostova | Support ticket resolution, concierge chat responses |
| **Compliance Officer** | `compliance_officer` | Arthur Pendelton | AML fraud alerts, audit log inspection, risk locks |
| **Read-Only Auditor** | `bank_auditor` | Sarah Jenkins | Read-only access to ledger, transactions, and audit logs |

---

## 4. Key Banking Modules & Capabilities

### 4.1 Home Banking Dashboard
- Dynamic time-aware greeting (*Good morning / afternoon / evening, Alexander*).
- **Total Balance Card** with global **Show / Hide Eye Toggle** that masks or reveals sensitive amounts across the entire application.
- **Quick Action Shortcuts**: Transfer Money, Pay Bills, Manage Cards, Statements, Add Beneficiary, International Wire.
- **Account Overview Carousel** with masked numbers and live balances.
- **Recent Transactions List** (latest 5 with credit/debit indicators).
- **Additional Sections**: Spending overview, Active savings summary, Important announcements, and Premier Fraud Shield advisories.

### 4.2 Accounts & Statements Module
- Support for 6 distinct account types: Savings, Current, Salary, Fixed Deposit, Recurring Deposit, and Foreign Currency accounts.
- Complete routing metadata: Sort Code (`40-05-15`), SWIFT/BIC (`HBUKGB41LHR`), branch details.
- Filterable statement generator by date range with opening balance, closing balance, credits, and debits.
- **Download Official Stamped PDF Statement** (print/PDF export formatted).
- Instant **Open New Bank Account** flow.

### 4.3 Money Transfers & Faster Payments
- Domestic UK Faster Payments (instant, 24/7/365 settlement).
- Own account internal transfers.
- International wire transfers (SWIFT MT103 / ISO 20022).
- Real-time fee, tax, and indicative exchange rate calculator.
- Review screen with multi-factor authentication (Biometric Face ID challenge or test OTP `123456`).
- **Downloadable & Shareable Payment Receipt** with celebratory confetti.
- **Idempotency Key Protection**: Prevents duplicate charges during poor connections.

### 4.4 Beneficiary Management
- Add, edit, delete, search, and filter trusted beneficiaries.
- Mark favorite payees with star toggle.
- Per-payee transfer limit enforcement.
- New payee security verification via OTP (`123456`).

### 4.5 Utility & Bill Payments
- Supported Categories: Electricity, Gas, Water, Mobile Recharge, Broadband Fibre, Credit Card Bills, Insurance, Council Tax.
- Live Biller Lookup: Enter consumer reference to fetch verified due amount and due date.
- Pay directly from any eligible account with atomic ledger recording.
- Saved billers and payment reminder schedule.

### 4.6 Cards Management & Controls
- Realistic 3D card render with EMV chip, contactless wave, and holographic gradient.
- **PIN Challenge (Sandbox: `1234`) to reveal full 16-digit card number and CVV**.
- **Instant Temporary Freeze / Unfreeze toggle**.
- **Permanent Block & Replacement flow** for lost/stolen cards.
- **Change ATM PIN** secure workflow.
- **Granular Controls**: Toggles for Online E-Commerce, International Usage, and Contactless payments.
- **Daily Spending Limit Slider** (£500 to £20,000).
- Credit card features: Available credit, payment due date, **Pay Credit Card Bill** action, and 48,920 Reward Points balance.

### 4.7 Transaction History Ledger
- Full transaction registry with search by merchant, description, or reference.
- Filters: Date range, Category, Account, Status, Amount.
- Summary metrics: Total Credits (+Inflow) vs Total Debits (-Outflow).
- **Export to CSV** statement function.
- Click any transaction to inspect details or generate an individual receipt.

### 4.8 Savings & Deposits
- Portfolio view of active Fixed Deposits and Recurring Deposits.
- **Interactive Deposit Calculator**: Sliders for amount and tenure, dynamic compounding interest calculations.
- Instant deposit creation debited from savings account via core ledger.
- **Premature Withdrawal Simulator**: Models penalty rates and estimated net payout.

### 4.9 International Banking & Multi-Currency FX
- Multi-currency accounts overview (GBP, USD, EUR, JPY, etc.).
- **Live Interbank Exchange Rate Matrix** with real-time buy/sell rates and 24-hour market movements.
- Foreign exchange calculator with zero markup guarantee.
- Inward remittance routing instructions (SWIFT, IBAN, bank address).

### 4.10 Loans & Mortgages
- Personal Loans, Mortgages, Vehicle Loans, and Education Loans.
- **Interactive EMI Calculator**: Sliders for principal, interest rate, and tenure with monthly payment breakdown.
- Pre-approved credit eligibility checker (Tier 1 - Score 820).
- Digital loan application submission with instant underwriting decision tracking.

### 4.11 Notifications Centre
- Categorized alerts: Transactions, Security, Bills, System.
- Unread count badge and read/unread status.
- Mark all as read and delete actions.

### 4.12 Security Centre & Emergency Lockdown
- Update online banking password.
- Biometric Face ID / Fingerprint toggle.
- **Active Device Sessions Manager**: Lists connected devices with IP and instant **Revoke Session** button.
- **Emergency Security Lockdown Button**: Instantly freezes all cards and blocks account debits.

### 4.13 Customer Support & Live Assistant Chat
- 24/7 Virtual Banking Assistant with contextual responses for card locks, fraud disputes, and wire transfers.
- Searchable FAQs accordion.
- Formal **Transaction Dispute Filing** form.
- **Book Premier Branch Appointment** with dedicated wealth advisor.

### 4.14 Branch & Smart ATM Locator
- Search by location or postcode.
- Filter by Branches, Smart ATMs, Premier Centres, and 24/7 locations.
- Distance indicators (km), operating hours, list of services, phone numbers, and Google Maps directions link.

### 4.15 Administrative Console (Role-Based Portal)
- System overview with KPIs (Total deposits, active accounts, daily volume, fraud alerts, ledger integrity).
- Customer management with freeze/unfreeze account capabilities.
- Real-time double-entry general ledger journal entries.
- Transaction monitoring and AML fraud alert review.
- Support ticket handling and agent response dispatch.
- Immutable security audit log stream.

---

## 5. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 6
- **Styling**: TailwindCSS with bespoke banking theme
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind transitions

### Backend
- **Runtime**: Node.js v20+ with TypeScript
- **Server**: Express 5
- **Database**: SQLite with Write-Ahead Logging (`WAL` mode) via `better-sqlite3`
- **Security & Cryptography**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `uuid`
- **Testing**: Vitest, Supertest

### Mobile Architecture
- **Framework**: React Native / Expo 52 configuration
- **Native Target**: iOS (Xcode) & Android (Android Studio / Gradle)
- **Deployment**: EAS Build (`eas.json`)

---

## 6. Getting Started

### 6.1 Clone & Setup
```bash
git clone <repo-url>
cd net-b-app
npm run build
```

### 6.2 Running the Application
Open two terminal windows:

#### Terminal 1 — Backend Server:
```bash
cd server
npm run dev
```
*(Runs on `http://localhost:5001`)*

#### Terminal 2 — Mobile Client:
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*

Visit **http://localhost:5173** in your browser.

---

## 7. Running the Automated Tests

The backend test suite executes 9 comprehensive unit and integration tests covering authentication, double-entry ledger atomicity, idempotency key deduplication, balance validations, card freezes, and administrative RBAC permissions:

```bash
cd server
npm test
```

### Test Results:
```text
 ✓ tests/banking.test.ts (9 tests) 223ms
   ✓ Premier Mobile Banking - Core Banking Test Suite
     ✓ should return system online and verified ledger integrity
     ✓ should reject invalid passwords and enforce secure error handling
     ✓ should permit biometric login when customer has biometric enabled
     ✓ should process a domestic faster payment using atomic double-entry ledger
     ✓ should prevent duplicate payments when re-submitting with identical idempotency key
     ✓ should halt transfers when balance is insufficient
     ✓ should allow customer to toggle card freeze and update spending limits
     ✓ should deny administrative ledger endpoints to non-admin customers
     ✓ should grant access to administrative endpoints for Super Admin

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  602ms
```

---

## 8. Docker Deployment

Deploy the entire stack with a single command:

```bash
docker-compose up --build -d
```
Access the client at **http://localhost:5173** and the API at **http://localhost:5001**.

---

## 9. Deliverables & Documentation Index

- **API Documentation**: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)
- **Database Architecture & Schema**: [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)
- **Security Architecture & Threat Model**: [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md)
- **Deployment & Production Guide**: [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)
- **Mobile Build Setup (iOS / Android)**: [`mobile/README.md`](mobile/README.md)
- **Automated Tests**: [`server/tests/banking.test.ts`](server/tests/banking.test.ts)
- **Docker Orchestration**: [`docker-compose.yml`](docker-compose.yml)

---

## 10. License & Legal Notice

This application is built for premier digital banking demonstration and evaluation purposes. All intellectual property, double-entry financial ledger logic, and UI components use original visual assets and branding inspired by international banking standards.
