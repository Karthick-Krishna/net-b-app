import { Router, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const profileRouter = Router();

// GET /api/profile
profileRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const profile = db.prepare(`
    SELECT u.id, u.username, u.email, u.phone, u.full_name, u.role, u.biometric_enabled, u.avatar_url,
           cp.customer_id, cp.dob, cp.address, cp.city, cp.country, cp.postal_code, cp.kyc_status,
           cp.preferred_language, cp.notification_email, cp.notification_sms, cp.notification_push
    FROM users u
    LEFT JOIN customer_profiles cp ON cp.user_id = u.id
    WHERE u.id = ?
  `).get(req.user!.id) as any;

  if (!profile) {
    res.status(404).json({ success: false, error: 'Profile not found' });
    return;
  }

  res.json({ success: true, profile });
});

// PUT /api/profile
profileRouter.put('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { email, phone, address, city, country, postal_code, preferred_language } = req.body;

  if (email || phone) {
    db.prepare(`
      UPDATE users 
      SET email = coalesce(?, email),
          phone = coalesce(?, phone)
      WHERE id = ?
    `).run(email || null, phone || null, req.user!.id);
  }

  db.prepare(`
    UPDATE customer_profiles
    SET address = coalesce(?, address),
        city = coalesce(?, city),
        country = coalesce(?, country),
        postal_code = coalesce(?, postal_code),
        preferred_language = coalesce(?, preferred_language)
    WHERE user_id = ?
  `).run(address || null, city || null, country || null, postal_code || null, preferred_language || null, req.user!.id);

  logAudit(req.user!.id, req.user!.role, 'PROFILE_UPDATED', 'USER', req.user!.id, { email, phone, city });

  res.json({ success: true, message: 'Profile updated successfully' });
});

// GET /api/profile/sessions
profileRouter.get('/sessions', authenticateToken, (req: AuthRequest, res: Response): void => {
  const sessions = db.prepare(`
    SELECT id, device_name, ip_address, is_revoked, last_active, created_at, expires_at
    FROM auth_sessions
    WHERE user_id = ? AND is_revoked = 0
    ORDER BY created_at DESC
  `).all(req.user!.id);

  res.json({ success: true, sessions });
});

// POST /api/profile/sessions/:id/revoke
profileRouter.post('/sessions/:id/revoke', authenticateToken, (req: AuthRequest, res: Response): void => {
  db.prepare(`
    UPDATE auth_sessions SET is_revoked = 1 WHERE id = ? AND user_id = ?
  `).run(req.params.id, req.user!.id);

  logAudit(req.user!.id, req.user!.role, 'SESSION_REVOKED', 'AUTH_SESSION', req.params.id, null);

  res.json({ success: true, message: 'Device session revoked' });
});

// POST /api/profile/emergency-freeze
profileRouter.post('/emergency-freeze', authenticateToken, (req: AuthRequest, res: Response): void => {
  // Freezes all cards and freezes customer account access
  db.prepare(`UPDATE cards SET is_frozen = 1 WHERE user_id = ?`).run(req.user!.id);
  db.prepare(`UPDATE accounts SET status = 'FROZEN' WHERE user_id = ?`).run(req.user!.id);

  logAudit(req.user!.id, req.user!.role, 'EMERGENCY_SECURITY_LOCKDOWN', 'USER', req.user!.id, {
    reason: 'Customer initiated emergency lockdown'
  });

  res.json({
    success: true,
    message: 'Emergency lockdown initiated. All cards have been frozen and account debit capabilities suspended. To restore access, verify your identity with customer support.'
  });
});
