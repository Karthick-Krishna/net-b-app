import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const accountRouter = Router();

// GET /api/accounts
accountRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const accounts = db.prepare(`
    SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC
  `).all(req.user!.id) as any[];

  // Calculate aggregate balances in primary currency (GBP)
  let totalAvailableGbp = 0;
  let totalLedgerGbp = 0;

  for (const acc of accounts) {
    if (acc.currency === 'GBP') {
      totalAvailableGbp += acc.available_balance;
      totalLedgerGbp += acc.ledger_balance;
    } else if (acc.currency === 'USD') {
      totalAvailableGbp += acc.available_balance * 0.79; // Approx FX conversion
      totalLedgerGbp += acc.ledger_balance * 0.79;
    }
  }

  res.json({
    success: true,
    totalAvailableGbp: Number(totalAvailableGbp.toFixed(2)),
    totalLedgerGbp: Number(totalLedgerGbp.toFixed(2)),
    primaryCurrency: 'GBP',
    lastUpdated: new Date().toISOString(),
    accounts
  });
});

// GET /api/accounts/:id
accountRouter.get('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const account = db.prepare(`
    SELECT * FROM accounts WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user!.id) as any;

  if (!account) {
    res.status(404).json({ success: false, error: 'Account not found' });
    return;
  }

  const transactions = db.prepare(`
    SELECT * FROM transactions 
    WHERE source_account_id = ? OR destination_account_id = ? 
    ORDER BY created_at DESC 
    LIMIT 15
  `).all(account.id, account.id);

  const ledgerEntries = db.prepare(`
    SELECT * FROM ledger_entries 
    WHERE account_id = ? 
    ORDER BY created_at DESC 
    LIMIT 20
  `).all(account.id);

  res.json({
    success: true,
    account,
    recentTransactions: transactions,
    ledgerEntries
  });
});

// GET /api/accounts/:id/statement
accountRouter.get('/:id/statement', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { startDate, endDate } = req.query;
  const account = db.prepare(`
    SELECT * FROM accounts WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user!.id) as any;

  if (!account) {
    res.status(404).json({ success: false, error: 'Account not found' });
    return;
  }

  let query = `
    SELECT * FROM transactions 
    WHERE (source_account_id = ? OR destination_account_id = ?)
  `;
  const params: any[] = [account.id, account.id];

  if (startDate) {
    query += ` AND created_at >= ?`;
    params.push(startDate);
  }
  if (endDate) {
    query += ` AND created_at <= ?`;
    params.push(endDate);
  }

  query += ` ORDER BY created_at DESC`;
  const transactions = db.prepare(query).all(...params) as any[];

  // Calculate statement summary
  let totalCredits = 0;
  let totalDebits = 0;

  for (const t of transactions) {
    if (t.destination_account_id === account.id || t.transaction_type === 'SALARY' || t.transaction_type === 'DEPOSIT_CREDIT') {
      totalCredits += t.amount;
    } else {
      totalDebits += t.amount;
    }
  }

  res.json({
    success: true,
    account,
    statementPeriod: {
      from: startDate || 'All Time',
      to: endDate || new Date().toISOString().split('T')[0]
    },
    summary: {
      openingBalance: Number((account.available_balance + totalDebits - totalCredits).toFixed(2)),
      closingBalance: account.available_balance,
      totalCredits: Number(totalCredits.toFixed(2)),
      totalDebits: Number(totalDebits.toFixed(2)),
      transactionCount: transactions.length
    },
    transactions
  });
});

// POST /api/accounts/open
accountRouter.post('/open', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { accountType, accountName, currency = 'GBP', initialDeposit = 0, sourceAccountId } = req.body;

  if (!accountType || !accountName) {
    res.status(400).json({ success: false, error: 'Account type and name are required' });
    return;
  }

  const accountId = uuidv4();
  const accountNumber = `400515-${Math.floor(10000000 + Math.random() * 90000000)}`;

  db.prepare(`
    INSERT INTO accounts (id, user_id, account_number, account_name, account_type, currency, available_balance, ledger_balance, status)
    VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, 'ACTIVE')
  `).run(accountId, req.user!.id, accountNumber, accountName, accountType, currency);

  logAudit(req.user!.id, req.user!.role, 'ACCOUNT_OPENED', 'ACCOUNT', accountId, { accountType, currency, accountNumber });

  res.json({
    success: true,
    message: 'New bank account opened successfully',
    account: {
      id: accountId,
      account_number: accountNumber,
      account_name: accountName,
      account_type: accountType,
      currency,
      available_balance: 0.00,
      status: 'ACTIVE'
    }
  });
});
