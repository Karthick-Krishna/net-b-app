import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const beneficiaryRouter = Router();

// GET /api/beneficiaries
beneficiaryRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const beneficiaries = db.prepare(`
    SELECT * FROM beneficiaries WHERE user_id = ? AND is_active = 1 ORDER BY is_favorite DESC, name ASC
  `).all(req.user!.id);

  res.json({ success: true, beneficiaries });
});

// POST /api/beneficiaries
beneficiaryRouter.post('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { name, nickname, accountNumber, bankName, ifscSwift, transferLimit = 50000.0, isFavorite = 0, otp } = req.body;

  if (!name || !accountNumber || !bankName) {
    res.status(400).json({ success: false, error: 'Name, Account Number, and Bank Name are required' });
    return;
  }

  // Security check: OTP verification simulation for new beneficiary
  if (otp && otp !== '123456') {
    res.status(400).json({ success: false, error: 'Invalid security OTP for beneficiary authorization' });
    return;
  }

  const benId = uuidv4();
  db.prepare(`
    INSERT INTO beneficiaries (id, user_id, name, nickname, account_number, bank_name, ifsc_swift, transfer_limit, is_favorite, is_active, activation_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'ACTIVE')
  `).run(
    benId,
    req.user!.id,
    name,
    nickname || null,
    accountNumber,
    bankName,
    ifscSwift || 'HBUKGB41LHR',
    Number(transferLimit),
    isFavorite ? 1 : 0
  );

  logAudit(req.user!.id, req.user!.role, 'BENEFICIARY_ADDED', 'BENEFICIARY', benId, { name, bankName, accountNumber });

  const created = db.prepare(`SELECT * FROM beneficiaries WHERE id = ?`).get(benId);
  res.json({ success: true, message: 'Beneficiary added successfully', beneficiary: created });
});

// PUT /api/beneficiaries/:id
beneficiaryRouter.put('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { name, nickname, transferLimit, isFavorite } = req.body;
  const ben = db.prepare(`SELECT id FROM beneficiaries WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id);

  if (!ben) {
    res.status(404).json({ success: false, error: 'Beneficiary not found' });
    return;
  }

  db.prepare(`
    UPDATE beneficiaries 
    SET name = coalesce(?, name),
        nickname = coalesce(?, nickname),
        transfer_limit = coalesce(?, transfer_limit),
        is_favorite = coalesce(?, is_favorite)
    WHERE id = ?
  `).run(name, nickname, transferLimit, isFavorite !== undefined ? (isFavorite ? 1 : 0) : null, req.params.id);

  const updated = db.prepare(`SELECT * FROM beneficiaries WHERE id = ?`).get(req.params.id);
  res.json({ success: true, beneficiary: updated });
});

// DELETE /api/beneficiaries/:id
beneficiaryRouter.delete('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const ben = db.prepare(`SELECT id FROM beneficiaries WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id);

  if (!ben) {
    res.status(404).json({ success: false, error: 'Beneficiary not found' });
    return;
  }

  db.prepare(`UPDATE beneficiaries SET is_active = 0 WHERE id = ?`).run(req.params.id);
  logAudit(req.user!.id, req.user!.role, 'BENEFICIARY_DELETED', 'BENEFICIARY', req.params.id, null);

  res.json({ success: true, message: 'Beneficiary removed' });
});

// POST /api/beneficiaries/:id/toggle-fav
beneficiaryRouter.post('/:id/toggle-fav', authenticateToken, (req: AuthRequest, res: Response): void => {
  const ben = db.prepare(`SELECT id, is_favorite FROM beneficiaries WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;

  if (!ben) {
    res.status(404).json({ success: false, error: 'Beneficiary not found' });
    return;
  }

  const nextFav = ben.is_favorite ? 0 : 1;
  db.prepare(`UPDATE beneficiaries SET is_favorite = ? WHERE id = ?`).run(nextFav, req.params.id);

  res.json({ success: true, is_favorite: nextFav });
});
