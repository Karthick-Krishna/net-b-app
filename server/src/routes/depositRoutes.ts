import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { LedgerService } from '../services/ledgerService';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const depositRouter = Router();

// Helper to determine rates
function getDepositRate(type: string, tenureMonths: number): number {
  if (type === 'FIXED') {
    if (tenureMonths <= 6) return 4.25;
    if (tenureMonths <= 12) return 4.85;
    if (tenureMonths <= 24) return 5.25;
    return 5.50;
  } else {
    // RECURRING
    if (tenureMonths <= 12) return 4.80;
    return 5.10;
  }
}

// GET /api/deposits
depositRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const deposits = db.prepare(`
    SELECT d.*, a.account_name, a.account_number 
    FROM deposits d
    LEFT JOIN accounts a ON a.id = d.account_id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `).all(req.user!.id);

  res.json({ success: true, deposits });
});

// POST /api/deposits/calculate
depositRouter.post('/calculate', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { type = 'FIXED', amount, tenureMonths = 12 } = req.body;
  const principal = Number(amount) || 1000;
  const tenure = Number(tenureMonths) || 12;
  const rate = getDepositRate(type, tenure);

  let maturityAmount = 0;
  let interestEarned = 0;

  if (type === 'FIXED') {
    // Compound interest: A = P * (1 + r/n)^(n*t) where n = 4 (quarterly)
    const years = tenure / 12;
    maturityAmount = principal * Math.pow(1 + (rate / 100) / 4, 4 * years);
    interestEarned = maturityAmount - principal;
  } else {
    // Recurring deposit standard compounding
    const monthlyDeposit = principal;
    const months = tenure;
    // Simple RD maturity formula approximation
    let totalDeposited = monthlyDeposit * months;
    let totalInt = 0;
    for (let m = 1; m <= months; m++) {
      totalInt += monthlyDeposit * (rate / 100) * (m / 12);
    }
    maturityAmount = totalDeposited + totalInt;
    interestEarned = totalInt;
  }

  res.json({
    success: true,
    calculation: {
      depositType: type,
      principalAmount: principal,
      tenureMonths: tenure,
      annualInterestRate: rate,
      interestEarned: Number(interestEarned.toFixed(2)),
      expectedMaturityAmount: Number(maturityAmount.toFixed(2)),
      maturityDate: new Date(Date.now() + tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });
});

// POST /api/deposits/create
depositRouter.post('/create', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const { sourceAccountId, type, amount, tenureMonths } = req.body;
    const principal = Number(amount);
    const tenure = Number(tenureMonths);

    if (!sourceAccountId || principal <= 0 || tenure < 3) {
      res.status(400).json({ success: false, error: 'Invalid deposit creation parameters' });
      return;
    }

    const rate = getDepositRate(type, tenure);
    const years = tenure / 12;
    const maturityAmount = type === 'FIXED'
      ? principal * Math.pow(1 + (rate / 100) / 4, 4 * years)
      : principal * tenure + (principal * (rate / 100) * (tenure / 24));

    // Debit source account via ledger
    const transferResult = LedgerService.processTransfer({
      userId: req.user!.id,
      sourceAccountId,
      counterpartyName: `Premier ${type === 'FIXED' ? 'Fixed' : 'Recurring'} Deposit Desk`,
      counterpartyAccount: 'INTERNAL-DEPOSIT-DESK',
      bankName: 'Premier Bank UK',
      ifscSwift: 'HBUKGB41LHR',
      amount: principal,
      currency: 'GBP',
      fee: 0,
      description: `Open ${type} Deposit (${tenure} Mos @ ${rate}% p.a.)`,
      category: 'INVESTMENT',
      transactionType: 'OWN_TRANSFER'
    });

    const depositId = uuidv4();
    const depositNumber = `${type === 'FIXED' ? 'FD' : 'RD'}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const maturityDate = new Date(Date.now() + tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO deposits (
        id, user_id, account_id, deposit_type, deposit_number, principal_amount,
        monthly_installment, interest_rate, tenure_months, expected_maturity_amount, maturity_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      depositId,
      req.user!.id,
      sourceAccountId,
      type,
      depositNumber,
      principal,
      type === 'RECURRING' ? principal : 0,
      rate,
      tenure,
      Number(maturityAmount.toFixed(2)),
      maturityDate
    );

    logAudit(req.user!.id, req.user!.role, 'DEPOSIT_CREATED', 'DEPOSIT', depositId, {
      depositNumber,
      principal,
      rate,
      tenure
    });

    res.json({
      success: true,
      message: `${type === 'FIXED' ? 'Fixed Deposit' : 'Recurring Deposit'} opened successfully!`,
      depositNumber,
      maturityAmount: Number(maturityAmount.toFixed(2)),
      maturityDate,
      receipt: transferResult.receipt
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Deposit creation failed' });
  }
});

// POST /api/deposits/:id/withdraw (Premature withdrawal simulator)
depositRouter.post('/:id/withdraw', authenticateToken, (req: AuthRequest, res: Response): void => {
  const deposit = db.prepare(`SELECT * FROM deposits WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;

  if (!deposit) {
    res.status(404).json({ success: false, error: 'Deposit not found' });
    return;
  }

  if (deposit.status !== 'ACTIVE') {
    res.status(400).json({ success: false, error: 'Deposit is already closed or matured' });
    return;
  }

  // Calculate premature penalty: 1.00% reduction in interest rate
  const penaltyRate = Math.max(0.5, deposit.interest_rate - 1.00);
  const estimatedPayout = Number((deposit.principal_amount * (1 + (penaltyRate / 100) * 0.5)).toFixed(2));

  res.json({
    success: true,
    simulation: {
      depositNumber: deposit.deposit_number,
      originalPrincipal: deposit.principal_amount,
      contractedRate: deposit.interest_rate,
      effectivePenalizedRate: penaltyRate,
      penaltyPercentage: 1.00,
      estimatedNetPayout: estimatedPayout,
      message: 'Premature closure incurs a 1.00% interest penalty. Funds will be credited to linked source account.'
    }
  });
});
