import { Router, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export const transactionRouter = Router();

// GET /api/transactions
transactionRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const {
    search,
    type,
    category,
    accountId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    status,
    limit = 50,
    offset = 0
  } = req.query;

  let query = `
    SELECT t.*, a.account_name, a.account_number
    FROM transactions t
    LEFT JOIN accounts a ON a.id = t.source_account_id
    WHERE t.user_id = ?
  `;
  const params: any[] = [req.user!.id];

  if (search) {
    query += ` AND (t.counterparty_name LIKE ? OR t.description LIKE ? OR t.reference LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (type) {
    query += ` AND t.transaction_type = ?`;
    params.push(type);
  }

  if (category && category !== 'ALL') {
    query += ` AND t.category = ?`;
    params.push(category);
  }

  if (accountId && accountId !== 'ALL') {
    query += ` AND (t.source_account_id = ? OR t.destination_account_id = ?)`;
    params.push(accountId, accountId);
  }

  if (startDate) {
    query += ` AND t.created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND t.created_at <= ?`;
    params.push(endDate);
  }

  if (minAmount) {
    query += ` AND t.amount >= ?`;
    params.push(Number(minAmount));
  }

  if (maxAmount) {
    query += ` AND t.amount <= ?`;
    params.push(Number(maxAmount));
  }

  if (status) {
    query += ` AND t.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const transactions = db.prepare(query).all(...params);

  // Summary statistics
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as totalCount,
      SUM(CASE WHEN transaction_type IN ('SALARY', 'DEPOSIT_CREDIT') THEN amount ELSE 0 END) as totalCredits,
      SUM(CASE WHEN transaction_type NOT IN ('SALARY', 'DEPOSIT_CREDIT') THEN amount ELSE 0 END) as totalDebits
    FROM transactions 
    WHERE user_id = ?
  `).get(req.user!.id) as any;

  res.json({
    success: true,
    transactions,
    stats: {
      totalCount: stats.totalCount || 0,
      totalCredits: Number((stats.totalCredits || 0).toFixed(2)),
      totalDebits: Number((stats.totalDebits || 0).toFixed(2))
    }
  });
});

// GET /api/transactions/:id
transactionRouter.get('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const transaction = db.prepare(`
    SELECT t.*, a.account_name, a.account_number, a.currency as account_currency
    FROM transactions t
    LEFT JOIN accounts a ON a.id = t.source_account_id
    WHERE t.id = ? AND t.user_id = ?
  `).get(req.params.id, req.user!.id) as any;

  if (!transaction) {
    res.status(404).json({ success: false, error: 'Transaction not found' });
    return;
  }

  const ledgerEntries = db.prepare(`
    SELECT * FROM ledger_entries WHERE transaction_id = ? ORDER BY created_at ASC
  `).all(transaction.id);

  res.json({
    success: true,
    transaction,
    ledgerEntries,
    receipt: {
      reference: transaction.reference,
      date: transaction.created_at,
      sourceAccount: transaction.account_name,
      accountNumber: transaction.account_number,
      recipient: transaction.counterparty_name,
      recipientAccount: transaction.counterparty_account,
      bankName: transaction.bank_name,
      amount: transaction.amount,
      currency: transaction.currency,
      fee: transaction.fee,
      tax: transaction.tax,
      status: transaction.status,
      description: transaction.description
    }
  });
});
