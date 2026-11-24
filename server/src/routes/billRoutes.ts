import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { LedgerService } from '../services/ledgerService';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const billRouter = Router();

// GET /api/bills
billRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const bills = db.prepare(`
    SELECT * FROM bill_payments WHERE user_id = ? ORDER BY due_date ASC
  `).all(req.user!.id);

  res.json({ success: true, bills });
});

// POST /api/bills/fetch (Biller inquiry lookup)
billRouter.post('/fetch', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { category, billerName, consumerNumber } = req.body;

  if (!category || !billerName || !consumerNumber) {
    res.status(400).json({ success: false, error: 'Category, Biller Name and Consumer Number are required' });
    return;
  }

  // Check if we already have this bill in DB
  const existing = db.prepare(`
    SELECT * FROM bill_payments 
    WHERE user_id = ? AND biller_name = ? AND consumer_number = ?
  `).get(req.user!.id, billerName, consumerNumber) as any;

  if (existing) {
    res.json({
      success: true,
      bill: existing
    });
    return;
  }

  // Realistic mock bill fetch calculation
  const mockAmounts: Record<string, number> = {
    ELECTRICITY: 165.40,
    WATER: 72.80,
    GAS: 138.25,
    MOBILE: 45.00,
    BROADBAND: 59.99,
    CREDIT_CARD: 450.00,
    INSURANCE: 120.00,
    EDUCATION: 350.00,
    GOVERNMENT: 195.00
  };

  const amount = mockAmounts[category] || 85.00;
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  res.json({
    success: true,
    bill: {
      biller_category: category,
      biller_name: billerName,
      consumer_number: consumerNumber,
      bill_amount: amount,
      due_date: dueDate,
      status: 'PENDING',
      consumer_name: req.user!.full_name
    }
  });
});

// POST /api/bills/pay
billRouter.post('/pay', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const {
      sourceAccountId,
      billerCategory,
      billerName,
      consumerNumber,
      amount,
      idempotencyKey
    } = req.body;

    const numAmount = Number(amount);
    if (!sourceAccountId || !billerName || numAmount <= 0) {
      res.status(400).json({ success: false, error: 'Invalid bill payment parameters' });
      return;
    }

    // Process debit through banking ledger
    const transferResult = LedgerService.processTransfer({
      userId: req.user!.id,
      sourceAccountId,
      counterpartyName: billerName,
      counterpartyAccount: consumerNumber,
      bankName: 'Premier Utility Clearing Network',
      ifscSwift: 'UTILUK22LHR',
      amount: numAmount,
      currency: 'GBP',
      fee: 0,
      description: `Bill Payment - ${billerName} (Ref: ${consumerNumber})`,
      category: 'UTILITIES',
      transactionType: 'BILL_PAYMENT',
      idempotencyKey
    });

    const billId = uuidv4();
    db.prepare(`
      INSERT INTO bill_payments (id, user_id, account_id, biller_category, biller_name, consumer_number, bill_amount, due_date, status, payment_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, date('now'), 'PAID', ?)
    `).run(
      billId,
      req.user!.id,
      sourceAccountId,
      billerCategory,
      billerName,
      consumerNumber,
      numAmount,
      transferResult.transaction.reference
    );

    logAudit(req.user!.id, req.user!.role, 'BILL_PAID', 'BILL_PAYMENT', billId, {
      billerName,
      amount: numAmount,
      reference: transferResult.transaction.reference
    });

    res.json({
      success: true,
      message: 'Bill paid successfully',
      paymentReference: transferResult.transaction.reference,
      transaction: transferResult.transaction,
      receipt: transferResult.receipt
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Bill payment processing failed'
    });
  }
});
