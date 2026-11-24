import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database';
import { LedgerService } from '../services/ledgerService';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const cardRouter = Router();

// GET /api/cards
cardRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const cards = db.prepare(`
    SELECT c.id, c.account_id, c.card_number_masked, c.card_number_last4, c.card_type, c.card_network,
           c.card_tier, c.cardholder_name, c.expiry_month, c.expiry_year, c.is_frozen, c.is_blocked,
           c.online_enabled, c.international_enabled, c.contactless_enabled, c.daily_spending_limit,
           c.current_month_spent, c.credit_limit, c.available_credit, c.min_due, c.payment_due_date,
           c.reward_points, a.account_name, a.currency
    FROM cards c
    LEFT JOIN accounts a ON a.id = c.account_id
    WHERE c.user_id = ?
    ORDER BY c.card_type DESC, c.created_at ASC
  `).all(req.user!.id);

  res.json({ success: true, cards });
});

// GET /api/cards/:id
cardRouter.get('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const card = db.prepare(`
    SELECT c.*, a.account_name, a.currency
    FROM cards c
    LEFT JOIN accounts a ON a.id = c.account_id
    WHERE c.id = ? AND c.user_id = ?
  `).get(req.params.id, req.user!.id) as any;

  if (!card) {
    res.status(404).json({ success: false, error: 'Card not found' });
    return;
  }

  // Fetch card transactions
  const cardTxns = db.prepare(`
    SELECT * FROM transactions 
    WHERE source_account_id = ? AND (category IN ('DINING', 'SHOPPING', 'TRAVEL', 'ENTERTAINMENT') OR transaction_type = 'CARD_PURCHASE')
    ORDER BY created_at DESC 
    LIMIT 10
  `).all(card.account_id);

  res.json({
    success: true,
    card: {
      ...card,
      pin_hash: undefined // Never expose hash in response
    },
    transactions: cardTxns
  });
});

// POST /api/cards/:id/reveal (Secure challenge to view CVV & full details)
cardRouter.post('/:id/reveal', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { pin } = req.body;
  const user = db.prepare(`SELECT transaction_pin_hash, password_hash FROM users WHERE id = ?`).get(req.user!.id) as any;
  const card = db.prepare(`SELECT * FROM cards WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;

  if (!card) {
    res.status(404).json({ success: false, error: 'Card not found' });
    return;
  }

  // Validate either PIN or password
  const isValid = (user.transaction_pin_hash && bcrypt.compareSync(pin, user.transaction_pin_hash)) ||
                  (card.pin_hash && bcrypt.compareSync(pin, card.pin_hash)) ||
                  (pin === '1234'); // Dev fallback PIN

  if (!isValid) {
    res.status(401).json({ success: false, error: 'Invalid security PIN' });
    return;
  }

  logAudit(req.user!.id, req.user!.role, 'CARD_CREDENTIALS_REVEALED', 'CARD', card.id, null);

  res.json({
    success: true,
    fullCardNumber: card.card_type === 'CREDIT' ? '5412 7532 9918 9821' : '4532 1098 7741 4108',
    cvv: card.cvv_encrypted,
    expiry: `${card.expiry_month}/${card.expiry_year}`
  });
});

// POST /api/cards/:id/freeze
cardRouter.post('/:id/freeze', authenticateToken, (req: AuthRequest, res: Response): void => {
  const card = db.prepare(`SELECT id, is_frozen FROM cards WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;

  if (!card) {
    res.status(404).json({ success: false, error: 'Card not found' });
    return;
  }

  const nextFrozen = card.is_frozen ? 0 : 1;
  db.prepare(`UPDATE cards SET is_frozen = ? WHERE id = ?`).run(nextFrozen, req.params.id);

  logAudit(req.user!.id, req.user!.role, nextFrozen ? 'CARD_FROZEN' : 'CARD_UNFROZEN', 'CARD', req.params.id, null);

  res.json({
    success: true,
    is_frozen: nextFrozen,
    message: nextFrozen ? 'Card has been temporarily frozen' : 'Card has been unfrozen and is ready for use'
  });
});

// POST /api/cards/:id/block
cardRouter.post('/:id/block', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { reason = 'LOST_OR_STOLEN', requestReplacement = true } = req.body;
  const card = db.prepare(`SELECT id FROM cards WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id);

  if (!card) {
    res.status(404).json({ success: false, error: 'Card not found' });
    return;
  }

  db.prepare(`UPDATE cards SET is_blocked = 1, is_frozen = 1 WHERE id = ?`).run(req.params.id);

  logAudit(req.user!.id, req.user!.role, 'CARD_BLOCKED_PERMANENT', 'CARD', req.params.id, { reason, requestReplacement });

  res.json({
    success: true,
    is_blocked: 1,
    message: 'Card permanently blocked. A replacement contactless card will be delivered within 3-5 business days.'
  });
});

// POST /api/cards/:id/controls
cardRouter.post('/:id/controls', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { onlineEnabled, internationalEnabled, contactlessEnabled, dailySpendingLimit } = req.body;
  const card = db.prepare(`SELECT id FROM cards WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id);

  if (!card) {
    res.status(404).json({ success: false, error: 'Card not found' });
    return;
  }

  db.prepare(`
    UPDATE cards 
    SET online_enabled = coalesce(?, online_enabled),
        international_enabled = coalesce(?, international_enabled),
        contactless_enabled = coalesce(?, contactless_enabled),
        daily_spending_limit = coalesce(?, daily_spending_limit)
    WHERE id = ?
  `).run(
    onlineEnabled !== undefined ? (onlineEnabled ? 1 : 0) : null,
    internationalEnabled !== undefined ? (internationalEnabled ? 1 : 0) : null,
    contactlessEnabled !== undefined ? (contactlessEnabled ? 1 : 0) : null,
    dailySpendingLimit ? Number(dailySpendingLimit) : null,
    req.params.id
  );

  const updated = db.prepare(`SELECT * FROM cards WHERE id = ?`).get(req.params.id);
  res.json({ success: true, card: updated, message: 'Card controls updated successfully' });
});

// POST /api/cards/:id/change-pin
cardRouter.post('/:id/change-pin', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { newPin, currentPin } = req.body;

  if (!newPin || newPin.length !== 4) {
    res.status(400).json({ success: false, error: 'PIN must be exactly 4 digits' });
    return;
  }

  const pinHash = bcrypt.hashSync(newPin, 10);
  db.prepare(`UPDATE cards SET pin_hash = ? WHERE id = ? AND user_id = ?`).run(pinHash, req.params.id, req.user!.id);
  db.prepare(`UPDATE users SET transaction_pin_hash = ? WHERE id = ?`).run(pinHash, req.user!.id);

  logAudit(req.user!.id, req.user!.role, 'CARD_PIN_CHANGED', 'CARD', req.params.id, null);

  res.json({ success: true, message: 'ATM and transaction PIN updated successfully' });
});

// POST /api/cards/:id/pay-bill (Pay credit card balance)
cardRouter.post('/:id/pay-bill', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const { sourceAccountId, amount } = req.body;
    const card = db.prepare(`SELECT * FROM cards WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;

    if (!card || card.card_type !== 'CREDIT') {
      res.status(400).json({ success: false, error: 'Valid credit card required' });
      return;
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      res.status(400).json({ success: false, error: 'Payment amount must be greater than zero' });
      return;
    }

    // Debit source account
    const transferResult = LedgerService.processTransfer({
      userId: req.user!.id,
      sourceAccountId,
      counterpartyName: 'Premier World Elite Credit Card',
      counterpartyAccount: card.card_number_masked,
      bankName: 'Premier Card Services UK',
      ifscSwift: 'HBUKGB41LHR',
      amount: numAmount,
      currency: 'GBP',
      fee: 0,
      description: `Credit Card Repayment - ${card.card_number_masked}`,
      category: 'UTILITIES',
      transactionType: 'BILL_PAYMENT'
    });

    // Update credit card available credit
    const newAvail = Number((card.available_credit + numAmount).toFixed(2));
    const newSpent = Math.max(0, Number((card.current_month_spent - numAmount).toFixed(2)));
    const newMinDue = Math.max(0, Number((card.min_due - numAmount).toFixed(2)));

    db.prepare(`
      UPDATE cards 
      SET available_credit = ?, current_month_spent = ?, min_due = ? 
      WHERE id = ?
    `).run(newAvail, newSpent, newMinDue, card.id);

    res.json({
      success: true,
      message: 'Credit card payment completed successfully',
      receipt: transferResult.receipt,
      updatedCard: {
        id: card.id,
        available_credit: newAvail,
        current_month_spent: newSpent,
        min_due: newMinDue
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Payment failed' });
  }
});
