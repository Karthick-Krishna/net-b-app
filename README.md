# Premier Digital Banking — Complete International & India Banking Platform

A complete, production-structured, responsive digital banking web application and administration management suite inspired by the user experience, navigation architecture, and visual quality of leading international banks, particularly HSBC India.

Developed under an original identity: **Premier Digital Banking**.

---

## Architecture Overview

The platform is engineered as a clean monorepo hosting two independent, fully responsive web applications powered by a shared persistent data layer and Firebase Firestore backend:

```
net-b-app/
├── client/                     # Customer Web Application (Port 4000)
│   ├── src/
│   │   ├── components/         # Header, Sidebar, BottomNav, AppLockModal
│   │   ├── context/            # AuthContext, BankingContext, AppLockContext
│   │   ├── layouts/            # AppLayout (Responsive Viewport - Desktop Sidebar / Mobile BottomNav)
│   │   ├── pages/              # Overview, Accounts, Transactions, Payments, Cards, Wealth, etc.
│   │   └── firebase/           # Firebase initialization & realtime sync
│   └── vite.config.ts          # Configured for strict Port 4000
│
├── admin/                      # Central Administration Console (Port 4001)
│   ├── src/
│   │   ├── context/            # AdminAuthContext, AdminStoreContext
│   │   ├── layouts/            # AdminLayout (Operations dark-slate theme)
│   │   ├── pages/
│   │   │   ├── Balances/       # Admin-Controlled Account Balance Override & Audit Log
│   │   │   ├── Transactions/   # Manual Transaction Injection & Double-Entry Ledger
│   │   │   ├── Customers/      # Customer Onboarding & KYC Management
│   │   │   ├── Accounts/       # Account Portfolio Management
│   │   │   ├── Cards/          # Emergency Card Freeze & Limit Controls
│   │   │   ├── Security/       # App-Lock Credential Administration & PIN Resets
│   │   │   ├── AuditLogs/      # Immutable Regulatory Audit Trail
│   │   │   └── Support/        # Concierge Support Inbox & Realtime Messaging
│   │   └── firebase/           # Firebase configuration
│   └── vite.config.ts          # Configured for strict Port 4001
│
├── shared/
│   ├── types/                  # UserRecord, BankAccountRecord, TransactionRecord, CardRecord, etc.
│   ├── constants/              # HSBC red brand palette (#DB0011, #B0000D), categories, currencies
│   ├── validation/             # Zod schemas for balances, transfers, transactions, PINs
│   ├── seedData.ts             # Rich demonstration data with multiple customer portfolios
│   └── realtimeStore.ts        # Real-time BroadcastChannel sync bus + atomic mutations
│
├── firebase/
│   ├── firestore.rules         # 547 lines of comprehensive RBAC & validation security rules
│   ├── firestore.indexes.json  # Composite indexes for transactions, notifications, audit logs
│   ├── storage.rules           # Storage security rules
│   └── functions/              # Cloud Functions (Custom Claims, AppLock PIN verification)
│
└── package.json                # Root orchestration scripts
```

---

## Ports & Orchestration

| Application | Port | Viewport & UX | Description |
|---|---|---|---|
| **Client** | `http://localhost:4000` | Full browser viewport (no phone frames) | Customer banking portal with responsive desktop sidebar and mobile navigation |
| **Admin** | `http://localhost:4001` | Full browser viewport | Central operations console with balance overrides, transaction injection, and audit trail |

### Quick Start Commands

```bash
# 1. Install all dependencies across monorepo
npm run install:all

# 2. Start both Client (4000) and Admin (4001) simultaneously
npm run dev

# 3. Or start individually
npm run dev:client  # Port 4000
npm run dev:admin   # Port 4001

# 4. Production builds
npm run build
```

---

## Demonstration Credentials

### Customer Portal (`http://localhost:4000`)
- **Primary Customer**: Karthick Krishna (`karthick@premierbanking.com`)
  - **Customer ID**: `PRM-882941`
  - **Password**: `Password@123` (or use 1-click login button)
  - **App-Lock PIN**: `123456`
  - **Accounts**:
    - Premier Savings Account (`•••• •••• •••• 4101`): ₹ 4,85,250.75
    - Business Current Account (`•••• •••• •••• 4102`): ₹ 18,20,000.00
    - Corporate Salary Account (`•••• •••• •••• 4103`): ₹ 2,45,000.50
- **Secondary Customer**: Ananya Deshmukh (`ananya@premierbanking.com`, Customer ID: `PRM-991245`)

### Central Admin Console (`http://localhost:4001`)
- **Super Administrator**: Victoria Sterling (`admin@premierbanking.com`)
- **Passphrase**: `AdminSecret@2026` (or 1-click authenticate)

---

## Key Core Features

1. **Admin-Controlled Account Balances**:
   - Central Administrators can search any customer, select any account, enter a new managed balance, and provide a mandatory business reason.
   - The mutation is atomic and immediately broadcasts via `BroadcastChannel` and Firestore to the customer's open browser on Port 4000 in real time without refreshing.
2. **Transaction Manager & Double-Entry Ledger**:
   - Admins can inject manual debit or credit entries with categories, counterparty details, and reference IDs, atomically adjusting account balances.
3. **App-Lock Security**:
   - 6-digit numeric PIN protection with inactivity timeout (auto-lock after 3 minutes).
   - Attempt limiter (locks out after 5 consecutive failed entries).
   - Administrator can initiate safe PIN resets without exposing raw PIN keys.
4. **Comprehensive Wealth & Card Suite**:
   - Emergency card freeze toggle (`is_frozen`), daily spending limit slider, and online/international/contactless controls.
   - Fixed Deposit calculator and wealth asset allocation viewer.
5. **Regulatory Compliance**:
   - Clear application-managed platform disclaimer displayed across statements, receipts, and headers.
