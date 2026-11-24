import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db, runTransaction } from './database';
import { initializeSchema } from './schema';

export function seedDatabase() {
  initializeSchema();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    return; // Already seeded
  }

  runTransaction(() => {
    const passwordHash = bcrypt.hashSync('Password@123', 10);
    const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);
    const pinHash = bcrypt.hashSync('1234', 10);

    // 1. Primary Premier Customer
    const premierUserId = uuidv4();
    db.prepare(`
      INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, biometric_enabled, transaction_pin_hash, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
    `).run(
      premierUserId,
      'premier_user',
      'alexander.vance@premierbanking.com',
      '+44 7700 900821',
      passwordHash,
      'Alexander Vance',
      'USER',
      pinHash,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
    );

    // Customer Profile
    db.prepare(`
      INSERT INTO customer_profiles (id, user_id, customer_id, dob, address, city, country, postal_code, kyc_status, preferred_language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', 'en')
    `).run(
      uuidv4(),
      premierUserId,
      'GB4490182',
      '1988-06-14',
      '40 Bank Street, Canary Wharf',
      'London',
      'United Kingdom',
      'E14 5NR'
    );

    // Admin Users with distinct roles
    const adminRoles = [
      { username: 'super_admin', email: 'admin@premierbanking.com', phone: '+44 20 7946 0901', name: 'Victoria Sterling', role: 'SUPER_ADMIN' },
      { username: 'ops_officer', email: 'ops@premierbanking.com', phone: '+44 20 7946 0902', name: 'Marcus Chen', role: 'OPERATIONS' },
      { username: 'support_rep', email: 'support@premierbanking.com', phone: '+44 20 7946 0903', name: 'Elena Rostova', role: 'SUPPORT' },
      { username: 'compliance_officer', email: 'compliance@premierbanking.com', phone: '+44 20 7946 0904', name: 'Arthur Pendelton', role: 'COMPLIANCE' },
      { username: 'bank_auditor', email: 'auditor@premierbanking.com', phone: '+44 20 7946 0905', name: 'Sarah Jenkins', role: 'AUDITOR' }
    ];

    for (const admin of adminRoles) {
      db.prepare(`
        INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, biometric_enabled)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
      `).run(uuidv4(), admin.username, admin.email, admin.phone, adminPasswordHash, admin.name, admin.role);
    }

    // 2. Bank Accounts
    const accSavingsId = uuidv4();
    const accCurrentId = uuidv4();
    const accSalaryId = uuidv4();
    const accFdId = uuidv4();
    const accRdId = uuidv4();
    const accFxId = uuidv4();

    const accounts = [
      { id: accSavingsId, number: '400515-89410291', name: 'Premier Global Savings', type: 'SAVINGS', currency: 'GBP', avail: 48250.75, ledger: 48250.75, sortCode: '40-05-15' },
      { id: accCurrentId, number: '400515-77192044', name: 'Everyday Current Account', type: 'CURRENT', currency: 'GBP', avail: 9840.20, ledger: 9840.20, sortCode: '40-05-15' },
      { id: accSalaryId, number: '400515-62049182', name: 'Executive Salary Account', type: 'SALARY', currency: 'GBP', avail: 15300.00, ledger: 15300.00, sortCode: '40-05-15' },
      { id: accFdId, number: '400515-55910238', name: 'High Yield Fixed Deposit', type: 'FIXED_DEPOSIT', currency: 'GBP', avail: 25000.00, ledger: 25000.00, sortCode: '40-05-15' },
      { id: accRdId, number: '400515-44829103', name: 'Systematic Recurring Deposit', type: 'RECURRING_DEPOSIT', currency: 'GBP', avail: 6000.00, ledger: 6000.00, sortCode: '40-05-15' },
      { id: accFxId, number: '400515-99201485', name: 'Multi-Currency Global Wallet', type: 'FOREIGN_CURRENCY', currency: 'USD', avail: 12450.00, ledger: 12450.00, sortCode: '40-05-15' }
    ];

    const insertAccount = db.prepare(`
      INSERT INTO accounts (id, user_id, account_number, account_name, account_type, currency, available_balance, ledger_balance, status, branch_name, ifsc_swift, sort_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'London Canary Wharf Premier Branch', 'HBUKGB41LHR', ?)
    `);

    for (const acc of accounts) {
      insertAccount.run(acc.id, premierUserId, acc.number, acc.name, acc.type, acc.currency, acc.avail, acc.ledger, acc.sortCode);
    }

    // 3. Realistic Recent Transactions & Double-Entry Ledger
    const transactionsData = [
      {
        ref: 'TXN-2026-90812',
        accountId: accSalaryId,
        party: 'Fintech Solutions UK Ltd',
        amount: 8500.00,
        currency: 'GBP',
        desc: 'Monthly Executive Salary Nov 2026',
        cat: 'SALARY',
        type: 'DOMESTIC_TRANSFER',
        entryType: 'CREDIT',
        daysAgo: 1
      },
      {
        ref: 'TXN-2026-89211',
        accountId: accSavingsId,
        party: 'British Gas Residential',
        amount: 142.50,
        currency: 'GBP',
        desc: 'Quarterly Dual Fuel Utility Bill',
        cat: 'UTILITIES',
        type: 'BILL_PAYMENT',
        entryType: 'DEBIT',
        daysAgo: 2
      },
      {
        ref: 'TXN-2026-88402',
        accountId: accCurrentId,
        party: 'The Wolseley Restaurant Mayfair',
        amount: 285.00,
        currency: 'GBP',
        desc: 'Fine Dining & Hospitality',
        cat: 'DINING',
        type: 'CARD_PURCHASE',
        entryType: 'DEBIT',
        daysAgo: 3
      },
      {
        ref: 'TXN-2026-87915',
        accountId: accSavingsId,
        party: 'Charlotte Vance (Sister)',
        amount: 1200.00,
        currency: 'GBP',
        desc: 'Family Support Transfer',
        cat: 'TRANSFER',
        type: 'DOMESTIC_TRANSFER',
        entryType: 'DEBIT',
        daysAgo: 5
      },
      {
        ref: 'TXN-2026-86104',
        accountId: accFxId,
        party: 'Apple Store Regent Street',
        amount: 1199.00,
        currency: 'USD',
        desc: 'Hardware Electronics Purchase',
        cat: 'SHOPPING',
        type: 'CARD_PURCHASE',
        entryType: 'DEBIT',
        daysAgo: 7
      },
      {
        ref: 'TXN-2026-85420',
        accountId: accSavingsId,
        party: 'Premier High Yield Interest',
        amount: 320.45,
        currency: 'GBP',
        desc: 'Monthly Compound Interest Payout',
        cat: 'INVESTMENT',
        type: 'DEPOSIT_CREDIT',
        entryType: 'CREDIT',
        daysAgo: 10
      },
      {
        ref: 'TXN-2026-84319',
        accountId: accCurrentId,
        party: 'Thames Water Utilities',
        amount: 68.20,
        currency: 'GBP',
        desc: 'Water Service Direct Debit',
        cat: 'UTILITIES',
        type: 'BILL_PAYMENT',
        entryType: 'DEBIT',
        daysAgo: 12
      },
      {
        ref: 'TXN-2026-83110',
        accountId: accSavingsId,
        party: 'Bank Clearing - ATM Withdrawal',
        amount: 300.00,
        currency: 'GBP',
        desc: 'Canary Wharf Branch ATM Withdrawal',
        cat: 'CHARGES',
        type: 'ATM_WITHDRAWAL',
        entryType: 'DEBIT',
        daysAgo: 15
      }
    ];

    const insertTxn = db.prepare(`
      INSERT INTO transactions (id, reference, user_id, source_account_id, counterparty_name, amount, currency, description, category, status, transaction_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, datetime('now', ? || ' days'))
    `);

    const insertLedger = db.prepare(`
      INSERT INTO ledger_entries (id, transaction_id, account_id, entry_type, amount, currency, balance_after, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ? || ' days'))
    `);

    for (const t of transactionsData) {
      const txnId = uuidv4();
      insertTxn.run(
        txnId,
        t.ref,
        premierUserId,
        t.accountId,
        t.party,
        t.amount,
        t.currency,
        t.desc,
        t.cat,
        t.type,
        `-${t.daysAgo}`
      );

      insertLedger.run(
        uuidv4(),
        txnId,
        t.accountId,
        t.entryType,
        t.amount,
        t.currency,
        t.entryType === 'CREDIT' ? 48250.75 : 48250.75 - t.amount,
        t.desc,
        `-${t.daysAgo}`
      );
    }

    // 4. Beneficiaries
    const beneficiaries = [
      { name: 'Charlotte Vance', nickname: 'Sister', number: '400515-88129033', bank: 'Premier Bank UK', code: 'HBUKGB41LHR', limit: 25000, fav: 1 },
      { name: 'David K. Henderson', nickname: 'Property Landlord', number: '200412-99014522', bank: 'Barclays Bank UK', code: 'BARCGB22XXX', limit: 10000, fav: 1 },
      { name: 'Global Asset Holdings Ltd', nickname: 'Investment Broker', number: '601004-33219800', bank: 'NatWest Bank', code: 'NWBKGB2LXXX', limit: 50000, fav: 0 },
      { name: 'Klaus Schmidt', nickname: 'Zurich Office Co-worker', number: 'CH93-0076-2011-6238-5295-8', bank: 'UBS Switzerland AG', code: 'UBSWCHZH80A', limit: 30000, fav: 1 },
      { name: 'Sophie Martin', nickname: 'Paris Travel Agent', number: 'FR76-3000-6000-0112-3456-7890-189', bank: 'BNP Paribas', code: 'BNPAFR2RXXX', limit: 15000, fav: 0 }
    ];

    const insertBen = db.prepare(`
      INSERT INTO beneficiaries (id, user_id, name, nickname, account_number, bank_name, ifsc_swift, transfer_limit, is_favorite, is_active, activation_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'ACTIVE')
    `);

    for (const b of beneficiaries) {
      insertBen.run(uuidv4(), premierUserId, b.name, b.nickname, b.number, b.bank, b.code, b.limit, b.fav);
    }

    // 5. Cards (Debit & Credit)
    const cardCreditId = uuidv4();
    const cardDebitId = uuidv4();
    const cardTravelId = uuidv4();

    db.prepare(`
      INSERT INTO cards (
        id, user_id, account_id, card_number_masked, card_number_last4, card_type, card_network, card_tier,
        cardholder_name, expiry_month, expiry_year, cvv_encrypted, is_frozen, is_blocked, pin_hash,
        online_enabled, international_enabled, contactless_enabled, daily_spending_limit, current_month_spent,
        credit_limit, available_credit, min_due, payment_due_date, reward_points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 1, 1, 1, 10000.00, 2410.50, 30000.00, 27589.50, 150.00, '2026-12-15', 48920)
    `).run(
      cardCreditId,
      premierUserId,
      accCurrentId,
      '•••• •••• •••• 9821',
      '9821',
      'CREDIT',
      'MASTERCARD',
      'PREMIER_WORLD_ELITE',
      'ALEXANDER VANCE',
      '09',
      '29',
      '892',
      pinHash
    );

    db.prepare(`
      INSERT INTO cards (
        id, user_id, account_id, card_number_masked, card_number_last4, card_type, card_network, card_tier,
        cardholder_name, expiry_month, expiry_year, cvv_encrypted, is_frozen, is_blocked, pin_hash,
        online_enabled, international_enabled, contactless_enabled, daily_spending_limit, current_month_spent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 1, 1, 1, 5000.00, 842.10)
    `).run(
      cardDebitId,
      premierUserId,
      accSavingsId,
      '•••• •••• •••• 4108',
      '4108',
      'DEBIT',
      'VISA',
      'PREMIER_PLATINUM',
      'ALEXANDER VANCE',
      '11',
      '28',
      '419',
      pinHash
    );

    db.prepare(`
      INSERT INTO cards (
        id, user_id, account_id, card_number_masked, card_number_last4, card_type, card_network, card_tier,
        cardholder_name, expiry_month, expiry_year, cvv_encrypted, is_frozen, is_blocked, pin_hash,
        online_enabled, international_enabled, contactless_enabled, daily_spending_limit, current_month_spent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 1, 1, 1, 8000.00, 1199.00)
    `).run(
      cardTravelId,
      premierUserId,
      accFxId,
      '•••• •••• •••• 7734',
      '7734',
      'DEBIT',
      'MASTERCARD',
      'GLOBAL_MULTI_CURRENCY',
      'ALEXANDER VANCE',
      '04',
      '30',
      '625',
      pinHash
    );

    // 6. Deposits (Fixed and Recurring)
    db.prepare(`
      INSERT INTO deposits (id, user_id, account_id, deposit_type, deposit_number, principal_amount, interest_rate, tenure_months, expected_maturity_amount, maturity_date, status)
      VALUES (?, ?, ?, 'FIXED', 'FD-2026-88102', 25000.00, 5.25, 24, 27725.50, '2028-06-15', 'ACTIVE')
    `).run(uuidv4(), premierUserId, accFdId);

    db.prepare(`
      INSERT INTO deposits (id, user_id, account_id, deposit_type, deposit_number, principal_amount, monthly_installment, interest_rate, tenure_months, expected_maturity_amount, maturity_date, status)
      VALUES (?, ?, ?, 'RECURRING', 'RD-2026-11942', 6000.00, 500.00, 4.80, 12, 6158.40, '2027-10-01', 'ACTIVE')
    `).run(uuidv4(), premierUserId, accRdId);

    // 7. Loans
    db.prepare(`
      INSERT INTO loans (id, user_id, loan_type, loan_number, principal_amount, interest_rate, tenure_months, emi_amount, outstanding_balance, next_emi_date, status)
      VALUES (?, ?, 'HOME', 'HL-2024-38910', 420000.00, 3.85, 300, 2180.45, 394200.00, '2026-12-05', 'ACTIVE')
    `).run(uuidv4(), premierUserId);

    db.prepare(`
      INSERT INTO loans (id, user_id, loan_type, loan_number, principal_amount, interest_rate, tenure_months, emi_amount, outstanding_balance, next_emi_date, status)
      VALUES (?, ?, 'PERSONAL', 'PL-2025-09144', 15000.00, 7.20, 36, 464.55, 9280.00, '2026-12-10', 'ACTIVE')
    `).run(uuidv4(), premierUserId);

    // 8. Upcoming & Recent Bills
    const bills = [
      { cat: 'GAS', name: 'British Gas Residential', num: 'BG-8849-019', amt: 142.50, due: '2026-12-18', status: 'PENDING' },
      { cat: 'WATER', name: 'Thames Water', num: 'TW-4401-982', amt: 68.20, due: '2026-12-22', status: 'PENDING' },
      { cat: 'BROADBAND', name: 'EE Fibre Broadband', num: 'EE-9912-300', amt: 54.99, due: '2026-12-08', status: 'PENDING' },
      { cat: 'ELECTRICITY', name: 'EDF Energy', num: 'EDF-7710-449', amt: 189.00, due: '2026-11-20', status: 'PAID' },
      { cat: 'GOVERNMENT', name: 'Tower Hamlets Council Tax', num: 'THC-5582-111', amt: 215.00, due: '2026-12-01', status: 'PENDING' }
    ];

    const insertBill = db.prepare(`
      INSERT INTO bill_payments (id, user_id, account_id, biller_category, biller_name, consumer_number, bill_amount, due_date, status, payment_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const bill of bills) {
      insertBill.run(uuidv4(), premierUserId, accSavingsId, bill.cat, bill.name, bill.num, bill.amt, bill.due, bill.status, bill.status === 'PAID' ? 'REF-PAID-88129' : null);
    }

    // 9. Notifications
    const notifications = [
      { title: 'Salary Credited', msg: '£8,500.00 credited to Executive Salary Account from Fintech Solutions UK.', type: 'TRANSACTION', read: 0 },
      { title: 'Security Check: New Login', msg: 'Successful biometric login recorded on Apple iPhone 16 Pro (London, UK).', type: 'SECURITY', read: 0 },
      { title: 'Upcoming Bill Reminder', msg: 'EE Fibre Broadband bill of £54.99 is due on 08 Dec 2026.', type: 'BILL', read: 0 },
      { title: 'Deposit Interest Credited', msg: 'Interest payout of £320.45 has been credited to your Premier Savings account.', type: 'DEPOSIT', read: 1 },
      { title: 'Foreign Card Controls Active', msg: 'Contactless & international transactions are active for Global Multi-Currency Card.', type: 'SYSTEM', read: 1 }
    ];

    const insertNotif = db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);

    let nOffset = -1;
    for (const notif of notifications) {
      insertNotif.run(uuidv4(), premierUserId, notif.title, notif.msg, notif.type, notif.read, `${nOffset} hours`);
      nOffset -= 6;
    }

    // 10. Branches and ATMs
    const locations = [
      { name: 'Canary Wharf Premier Centre & Flagship', type: 'PREMIER_CENTRE', addr: '8 Canada Square, Canary Wharf', city: 'London', postal: 'E14 5HQ', phone: '+44 20 7991 8888', timing: 'Mon - Fri: 09:00 - 17:30', dist: 0.3, is24x7: 1, services: 'Premier Banking, Wealth Advisory, Foreign Currency, 24/7 Smart ATM, Safe Deposit Boxes', lat: 51.5048, lng: -0.0195 },
      { name: 'City of London - Queen Victoria St Branch', type: 'BRANCH', addr: '76 Queen Victoria Street', city: 'London', postal: 'EC4N 4SJ', phone: '+44 20 7260 9000', timing: 'Mon - Fri: 09:30 - 16:30', dist: 4.8, is24x7: 1, services: 'Cash Deposits, Mortgages, Business Banking, Currency Exchange, Instant Card Issuance', lat: 51.5126, lng: -0.0933 },
      { name: 'Mayfair International Wealth Suite', type: 'PREMIER_CENTRE', addr: '16 Berkeley Street, Mayfair', city: 'London', postal: 'W1J 8DZ', phone: '+44 20 7493 8800', timing: 'Mon - Fri: 09:00 - 17:00', dist: 7.2, is24x7: 0, services: 'Private Wealth Management, International Wire Desk, Dedicated Relationship Managers', lat: 51.5085, lng: -0.1437 },
      { name: 'Tower Bridge 24/7 Smart ATM Hub', type: 'ATM', addr: '24 Tooley Street, London Bridge', city: 'London', postal: 'SE1 2SY', phone: '+44 345 740 4404', timing: 'Open 24 Hours / 7 Days', dist: 3.5, is24x7: 1, services: 'Multi-Currency Cash Dispenser, Instant Cheque Deposit, Card PIN Services', lat: 51.5050, lng: -0.0840 },
      { name: 'Heathrow Terminal 5 Travel Money & ATM', type: 'ATM', addr: 'Terminal 5 Departures Concourse', city: 'London', postal: 'TW6 2GA', phone: '+44 345 740 4404', timing: 'Open 24 Hours / 7 Days', dist: 28.5, is24x7: 1, services: 'USD/EUR/JPY/GBP Instant Cash, Travel Card Activation, PIN Change', lat: 51.4700, lng: -0.4543 }
    ];

    const insertBranch = db.prepare(`
      INSERT INTO branches_atms (id, name, type, address, city, postal_code, phone, timing, distance_km, is_24x7, services, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const loc of locations) {
      insertBranch.run(uuidv4(), loc.name, loc.type, loc.addr, loc.city, loc.postal, loc.phone, loc.timing, loc.dist, loc.is24x7, loc.services, loc.lat, loc.lng);
    }

    // 11. Initial Support Ticket
    const ticketId = uuidv4();
    db.prepare(`
      INSERT INTO support_tickets (id, ticket_number, user_id, category, subject, description, priority, status)
      VALUES (?, 'TCK-2026-0041', ?, 'ACCOUNT_INQUIRY', 'Global Wallet FX Rate Inquiry for JPY', 'Requesting guidance regarding multi-currency card zero FX mark-up rates for upcoming Tokyo business travel.', 'MEDIUM', 'OPEN')
    `).run(ticketId, premierUserId);

    db.prepare(`
      INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message)
      VALUES (?, ?, ?, 'USER', 'Hello, I plan to spend in JPY next week. Does the Premier World Elite Card have 0% foreign transaction fees on interbank rates?')
    `).run(uuidv4(), ticketId, premierUserId);

    db.prepare(`
      INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message)
      VALUES (?, ?, 'SYSTEM_BOT', 'BOT', 'Welcome to Premier Support! Premier World Elite Mastercard holders enjoy zero foreign exchange markup fees on all international card transactions based on standard Mastercard interbank rates.')
    `).run(uuidv4(), ticketId);

    // 12. Initial Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, actor_role, action, resource, resource_id, details, ip_address)
      VALUES (?, ?, 'SUPER_ADMIN', 'SYSTEM_INITIALIZATION', 'CORE_BANKING_LEDGER', 'GENESIS_BLOCK', 'Core banking ledger initialized with verified double-entry constraints and seed accounts.', '127.0.0.1')
    `).run(uuidv4(), premierUserId);
  });
}
