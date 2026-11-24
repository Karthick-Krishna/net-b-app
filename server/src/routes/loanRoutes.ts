import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const loanRouter = Router();

// GET /api/loans
loanRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const loans = db.prepare(`SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC`).all(req.user!.id);
  res.json({ success: true, loans });
});

// POST /api/loans/calculate-emi
loanRouter.post('/calculate-emi', (req: AuthRequest, res: Response): void => {
  const { amount = 25000, rate = 6.5, tenureMonths = 36 } = req.body;
  const P = Number(amount);
  const annualRate = Number(rate);
  const N = Number(tenureMonths);

  const r = (annualRate / 12) / 100;
  // Formula: E = P * r * (1 + r)^N / ((1 + r)^N - 1)
  const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
  const totalRepayment = emi * N;
  const totalInterest = totalRepayment - P;

  // Generate 5-period amortization preview
  const amortizationSchedule: any[] = [];
  let remainingBalance = P;
  for (let month = 1; month <= Math.min(5, N); month++) {
    const interestComponent = remainingBalance * r;
    const principalComponent = emi - interestComponent;
    remainingBalance -= principalComponent;
    amortizationSchedule.push({
      month,
      emi: Number(emi.toFixed(2)),
      principalPaid: Number(principalComponent.toFixed(2)),
      interestPaid: Number(interestComponent.toFixed(2)),
      remainingBalance: Math.max(0, Number(remainingBalance.toFixed(2)))
    });
  }

  res.json({
    success: true,
    calculation: {
      principal: P,
      annualRate,
      tenureMonths: N,
      monthlyEmi: Number(emi.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalRepayment: Number(totalRepayment.toFixed(2)),
      amortizationPreview: amortizationSchedule
    }
  });
});

// POST /api/loans/apply
loanRouter.post('/apply', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { loanType, amount, tenureMonths, employmentType, monthlyIncome, purpose } = req.body;

  const P = Number(amount);
  const N = Number(tenureMonths);

  if (!loanType || P <= 0 || N <= 0) {
    res.status(400).json({ success: false, error: 'Invalid application parameters' });
    return;
  }

  const rates: Record<string, number> = {
    PERSONAL: 6.90,
    HOME: 3.85,
    VEHICLE: 5.40,
    EDUCATION: 4.50
  };

  const rate = rates[loanType] || 6.50;
  const r = (rate / 12) / 100;
  const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);

  const loanId = uuidv4();
  const loanNumber = `LN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const nextEmiDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Save in database
  db.prepare(`
    INSERT INTO loans (
      id, user_id, loan_type, loan_number, principal_amount, interest_rate,
      tenure_months, emi_amount, outstanding_balance, next_emi_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL')
  `).run(
    loanId,
    req.user!.id,
    loanType,
    loanNumber,
    P,
    rate,
    N,
    Number(emi.toFixed(2)),
    P,
    nextEmiDate
  );

  // Create notification
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, 'Loan Application Submitted', ?, 'SYSTEM')
  `).run(
    uuidv4(),
    req.user!.id,
    `Application ${loanNumber} for £${P.toLocaleString()} submitted for underwriting review.`
  );

  logAudit(req.user!.id, req.user!.role, 'LOAN_APPLICATION_SUBMITTED', 'LOAN', loanId, {
    loanNumber,
    amount: P,
    type: loanType,
    employmentType
  });

  res.json({
    success: true,
    message: 'Application submitted successfully. An underwriting officer is reviewing your documentation.',
    loanNumber,
    status: 'PENDING_APPROVAL',
    estimatedDecisionTime: 'Within 2 hours',
    monthlyEmi: Number(emi.toFixed(2))
  });
});

// GET /api/loans/eligibility
loanRouter.get('/eligibility', authenticateToken, (req: AuthRequest, res: Response): void => {
  res.json({
    success: true,
    eligibility: {
      creditGrade: 'Tier 1 - Excellent (Score: 820)',
      preApprovedPersonalLoan: 35000.00,
      preApprovedHomeLoan: 550000.00,
      preApprovedVehicleLoan: 60000.00,
      indicativeInterestRateFrom: '3.85% p.a.',
      maxTenureYears: 25,
      documentRequirement: 'Digital KYC Verified - Zero paperwork required'
    }
  });
});
