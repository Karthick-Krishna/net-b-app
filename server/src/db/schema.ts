import { db } from './database';

export function initializeSchema() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER', -- USER, SUPER_ADMIN, OPERATIONS, SUPPORT, COMPLIANCE, AUDITOR
      is_active INTEGER NOT NULL DEFAULT 1,
      is_locked INTEGER NOT NULL DEFAULT 0,
      failed_logins INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      biometric_enabled INTEGER NOT NULL DEFAULT 1,
      transaction_pin_hash TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Customer Profile table
    CREATE TABLE IF NOT EXISTS customer_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      customer_id TEXT UNIQUE NOT NULL,
      dob TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      postal_code TEXT,
      kyc_status TEXT NOT NULL DEFAULT 'VERIFIED', -- PENDING, VERIFIED, REJECTED, UNDER_REVIEW
      preferred_language TEXT NOT NULL DEFAULT 'en',
      notification_email INTEGER NOT NULL DEFAULT 1,
      notification_sms INTEGER NOT NULL DEFAULT 1,
      notification_push INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Bank Accounts table
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      account_name TEXT NOT NULL,
      account_type TEXT NOT NULL, -- SAVINGS, CURRENT, SALARY, FIXED_DEPOSIT, RECURRING_DEPOSIT, FOREIGN_CURRENCY
      currency TEXT NOT NULL DEFAULT 'GBP',
      available_balance REAL NOT NULL DEFAULT 0.00,
      ledger_balance REAL NOT NULL DEFAULT 0.00,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DORMANT, FROZEN, CLOSED
      branch_name TEXT NOT NULL DEFAULT 'London Canary Wharf Premier Branch',
      ifsc_swift TEXT NOT NULL DEFAULT 'HBUKGB41LHR',
      sort_code TEXT NOT NULL DEFAULT '40-05-15',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Core Banking Double-Entry Ledger
    -- Every financial transaction has at least one DEBIT and one CREDIT entry
    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      entry_type TEXT NOT NULL, -- DEBIT, CREDIT
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      balance_after REAL NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    -- Transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      source_account_id TEXT,
      destination_account_id TEXT,
      counterparty_name TEXT NOT NULL,
      counterparty_account TEXT,
      bank_name TEXT,
      ifsc_swift TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'GBP',
      fee REAL NOT NULL DEFAULT 0.00,
      tax REAL NOT NULL DEFAULT 0.00,
      exchange_rate REAL DEFAULT 1.00,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'GENERAL', -- TRANSFER, SALARY, UTILITIES, DINING, SHOPPING, INVESTMENT, TRAVEL, ENTERTAINMENT, CHARGES
      status TEXT NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, PENDING, FAILED, SCHEDULED
      transaction_type TEXT NOT NULL, -- OWN_TRANSFER, DOMESTIC_TRANSFER, INTL_TRANSFER, BILL_PAYMENT, CARD_PURCHASE, ATM_WITHDRAWAL, DEPOSIT_CREDIT, LOAN_DISBURSEMENT
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (source_account_id) REFERENCES accounts(id)
    );

    -- Beneficiaries table
    CREATE TABLE IF NOT EXISTS beneficiaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      nickname TEXT,
      account_number TEXT NOT NULL,
      bank_name TEXT NOT NULL,
      ifsc_swift TEXT NOT NULL,
      transfer_limit REAL NOT NULL DEFAULT 50000.00,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      activation_status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PENDING_VERIFICATION, BLOCKED
      verified_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Billers and Bill Payments
    CREATE TABLE IF NOT EXISTS bill_payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      biller_category TEXT NOT NULL, -- ELECTRICITY, WATER, GAS, MOBILE, BROADBAND, CREDIT_CARD, INSURANCE, EDUCATION, GOVERNMENT, OTHER
      biller_name TEXT NOT NULL,
      consumer_number TEXT NOT NULL,
      bill_amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PAID', -- PAID, PENDING, OVERDUE
      payment_reference TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    -- Cards (Debit and Credit)
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      card_number_masked TEXT NOT NULL,
      card_number_last4 TEXT NOT NULL,
      card_type TEXT NOT NULL, -- DEBIT, CREDIT
      card_network TEXT NOT NULL DEFAULT 'MASTERCARD', -- MASTERCARD, VISA
      card_tier TEXT NOT NULL DEFAULT 'PREMIER_WORLD_ELITE',
      cardholder_name TEXT NOT NULL,
      expiry_month TEXT NOT NULL,
      expiry_year TEXT NOT NULL,
      cvv_encrypted TEXT NOT NULL DEFAULT '892',
      is_frozen INTEGER NOT NULL DEFAULT 0,
      is_blocked INTEGER NOT NULL DEFAULT 0,
      pin_hash TEXT,
      online_enabled INTEGER NOT NULL DEFAULT 1,
      international_enabled INTEGER NOT NULL DEFAULT 1,
      contactless_enabled INTEGER NOT NULL DEFAULT 1,
      daily_spending_limit REAL NOT NULL DEFAULT 5000.00,
      current_month_spent REAL NOT NULL DEFAULT 0.00,
      credit_limit REAL DEFAULT 0.00,
      available_credit REAL DEFAULT 0.00,
      min_due REAL DEFAULT 0.00,
      payment_due_date TEXT,
      reward_points INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    -- Deposits (Fixed & Recurring Deposits)
    CREATE TABLE IF NOT EXISTS deposits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      deposit_type TEXT NOT NULL, -- FIXED, RECURRING
      deposit_number TEXT UNIQUE NOT NULL,
      principal_amount REAL NOT NULL,
      monthly_installment REAL DEFAULT 0.00,
      interest_rate REAL NOT NULL,
      tenure_months INTEGER NOT NULL,
      expected_maturity_amount REAL NOT NULL,
      maturity_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, MATURED, PREMATURE_CLOSED
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    -- Loans & Financial Products
    CREATE TABLE IF NOT EXISTS loans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      loan_type TEXT NOT NULL, -- PERSONAL, HOME, VEHICLE, EDUCATION
      loan_number TEXT UNIQUE NOT NULL,
      principal_amount REAL NOT NULL,
      interest_rate REAL NOT NULL,
      tenure_months INTEGER NOT NULL,
      emi_amount REAL NOT NULL,
      outstanding_balance REAL NOT NULL,
      next_emi_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PENDING_APPROVAL, CLOSED, DEFAULTED
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Notifications Centre
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL, -- TRANSACTION, SECURITY, BILL, DEPOSIT, SYSTEM
      is_read INTEGER NOT NULL DEFAULT 0,
      metadata TEXT, -- JSON
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Support Tickets & Chat
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL, -- TRANSACTION_DISPUTE, CARD_LOST, FRAUD, ACCOUNT_INQUIRY, GENERAL
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
      status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS support_messages (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_type TEXT NOT NULL, -- USER, SUPPORT_AGENT, BOT
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );

    -- Security & Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      actor_role TEXT NOT NULL DEFAULT 'USER',
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      details TEXT, -- JSON
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Active Auth Sessions
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      refresh_token_hash TEXT NOT NULL,
      device_name TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      is_revoked INTEGER NOT NULL DEFAULT 0,
      last_active TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Branches and ATMs
    CREATE TABLE IF NOT EXISTS branches_atms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- BRANCH, ATM, PREMIER_CENTRE
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      phone TEXT,
      timing TEXT NOT NULL,
      distance_km REAL NOT NULL,
      is_24x7 INTEGER NOT NULL DEFAULT 0,
      services TEXT NOT NULL, -- comma separated
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger_entries(account_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_cards_user ON cards(user_id);
  `);
}
