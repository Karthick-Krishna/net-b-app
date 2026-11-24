import { Router, Response } from 'express';
import { LedgerService } from '../services/ledgerService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export const transferRouter = Router();

// Indicative Real-time FX Rates (GBP Base)
const FX_RATES: Record<string, { rate: number; buy: number; sell: number; change24h: number }> = {
  USD: { rate: 1.2845, buy: 1.2810, sell: 1.2880, change24h: 0.18 },
  EUR: { rate: 1.1730, buy: 1.1700, sell: 1.1760, change24h: -0.12 },
  JPY: { rate: 198.40, buy: 197.80, sell: 199.10, change24h: 0.45 },
  CAD: { rate: 1.7650, buy: 1.7600, sell: 1.7700, change24h: 0.05 },
  AUD: { rate: 1.9540, buy: 1.9480, sell: 1.9600, change24h: -0.22 },
  CHF: { rate: 1.1290, buy: 1.1250, sell: 1.1330, change24h: 0.08 },
  INR: { rate: 108.65, buy: 108.10, sell: 109.20, change24h: 0.31 },
  AED: { rate: 4.7180, buy: 4.7050, sell: 4.7310, change24h: 0.15 },
  SGD: { rate: 1.7210, buy: 1.7160, sell: 1.7260, change24h: -0.04 }
};

// GET /api/transfers/fx-rates
transferRouter.get('/fx-rates', authenticateToken, (_req: AuthRequest, res: Response): void => {
  res.json({
    success: true,
    baseCurrency: 'GBP',
    timestamp: new Date().toISOString(),
    rates: FX_RATES
  });
});

// POST /api/transfers/calculate
transferRouter.post('/calculate', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { transferType, amount, currency = 'GBP' } = req.body;
  const numAmount = Number(amount) || 0;

  let fee = 0;
  let tax = 0;
  let deliveryDays = 'Instant (< 10 seconds)';
  let exchangeRate = 1.0;

  if (transferType === 'INTL_TRANSFER') {
    fee = 5.00; // Flat wire fee
    tax = 1.00; // Regulatory compliance levy
    deliveryDays = '1 - 2 Business Days';
    if (currency !== 'GBP' && FX_RATES[currency]) {
      exchangeRate = FX_RATES[currency].rate;
    }
  } else if (transferType === 'DOMESTIC_TRANSFER') {
    fee = 0.00;
    tax = 0.00;
    deliveryDays = 'Instant via Faster Payments';
  } else {
    // OWN_TRANSFER
    fee = 0.00;
    tax = 0.00;
    deliveryDays = 'Immediate Real-Time';
  }

  const destinationAmount = Number((numAmount * exchangeRate).toFixed(2));
  const totalDeduction = Number((numAmount + fee + tax).toFixed(2));

  res.json({
    success: true,
    calculation: {
      sendAmount: numAmount,
      sendCurrency: 'GBP',
      destinationCurrency: currency,
      destinationAmount,
      exchangeRate,
      transferFee: fee,
      applicableTax: tax,
      totalDeduction,
      estimatedDelivery: deliveryDays
    }
  });
});

// POST /api/transfers
transferRouter.post('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const {
      sourceAccountId,
      destAccountId,
      counterpartyName,
      counterpartyAccount,
      bankName,
      ifscSwift,
      amount,
      currency = 'GBP',
      fee = 0,
      tax = 0,
      exchangeRate = 1.0,
      description,
      category = 'TRANSFER',
      transactionType,
      idempotencyKey
    } = req.body;

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    const result = LedgerService.processTransfer({
      userId: req.user!.id,
      sourceAccountId,
      destAccountId,
      counterpartyName,
      counterpartyAccount,
      bankName: bankName || 'Premier Bank UK',
      ifscSwift: ifscSwift || 'HBUKGB41LHR',
      amount: Number(amount),
      currency,
      fee: Number(fee),
      tax: Number(tax),
      exchangeRate: Number(exchangeRate),
      description: description || 'Bank Transfer',
      category,
      transactionType,
      idempotencyKey,
      ipAddress: ip
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Transfer failed'
    });
  }
});
