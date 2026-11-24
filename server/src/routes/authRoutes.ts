import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { JWT_SECRET, JWT_REFRESH_SECRET, authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response): void => {
  const { identifier, password, isBiometric } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!identifier) {
    res.status(400).json({ success: false, error: 'Username or Customer ID is required' });
    return;
  }

  // Lookup user by username or customer_id
  let user = db.prepare(`
    SELECT u.*, cp.customer_id 
    FROM users u
    LEFT JOIN customer_profiles cp ON cp.user_id = u.id
    WHERE u.username = ? OR cp.customer_id = ?
  `).get(identifier, identifier) as any;

  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid credentials or customer not registered' });
    return;
  }

  if (user.is_locked) {
    res.status(403).json({ success: false, error: 'Account locked due to security policy. Please contact customer support.' });
    return;
  }

  // Handle Biometric Login
  if (isBiometric) {
    if (!user.biometric_enabled) {
      res.status(400).json({ success: false, error: 'Biometric login is not enabled on this device' });
      return;
    }
  } else {
    if (!password) {
      res.status(400).json({ success: false, error: 'Password is required' });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      // Increment failed logins
      const newFailed = user.failed_logins + 1;
      const isLocked = newFailed >= 5 ? 1 : 0;
      db.prepare(`UPDATE users SET failed_logins = ?, is_locked = ? WHERE id = ?`).run(newFailed, isLocked, user.id);

      logAudit(user.id, user.role, 'LOGIN_FAILED', 'USER', user.id, { attempts: newFailed }, ip);

      res.status(401).json({ 
        success: false, 
        error: isLocked ? 'Account locked due to 5 failed attempts' : 'Invalid customer ID or password' 
      });
      return;
    }
  }

  // Reset failed logins
  db.prepare(`UPDATE users SET failed_logins = 0 WHERE id = ?`).run(user.id);

  // Generate Tokens
  const tokenPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: user.role
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Record Session
  const sessionTokenHash = bcrypt.hashSync(refreshToken, 8);
  db.prepare(`
    INSERT INTO auth_sessions (id, user_id, refresh_token_hash, device_name, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', '+7 days'))
  `).run(
    uuidv4(),
    user.id,
    sessionTokenHash,
    (req.headers['user-agent'] as string) || 'Mobile Banking Device',
    ip
  );

  logAudit(user.id, user.role, 'LOGIN_SUCCESS', 'USER', user.id, { isBiometric: !!isBiometric }, ip);

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      customer_id: user.customer_id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      biometric_enabled: !!user.biometric_enabled,
      avatar_url: user.avatar_url
    },
    accessToken,
    refreshToken
  });
});

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response): void => {
  const { username, email, phone, password, full_name, customer_id, dob, address, city, country } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!username || !email || !password || !full_name) {
    res.status(400).json({ success: false, error: 'Required fields missing' });
    return;
  }

  const existingUser = db.prepare(`SELECT id FROM users WHERE username = ? OR email = ?`).get(username, email);
  if (existingUser) {
    res.status(400).json({ success: false, error: 'Username or email already registered' });
    return;
  }

  const userId = uuidv4();
  const passwordHash = bcrypt.hashSync(password, 10);
  const custId = customer_id || `GB${Math.floor(1000000 + Math.random() * 9000000)}`;

  db.prepare(`
    INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, biometric_enabled)
    VALUES (?, ?, ?, ?, ?, ?, 'USER', 1, 1)
  `).run(userId, username, email, phone || '+44 7700 900000', passwordHash, full_name);

  db.prepare(`
    INSERT INTO customer_profiles (id, user_id, customer_id, dob, address, city, country, postal_code, kyc_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED')
  `).run(
    uuidv4(),
    userId,
    custId,
    dob || '1990-01-01',
    address || '10 Downing Street',
    city || 'London',
    country || 'United Kingdom',
    'SW1A 2AA'
  );

  // Automatically provision default Premier Savings & Current Accounts with initial demo deposit
  const savingsId = uuidv4();
  const currentId = uuidv4();

  db.prepare(`
    INSERT INTO accounts (id, user_id, account_number, account_name, account_type, currency, available_balance, ledger_balance, status)
    VALUES (?, ?, ?, 'Premier Global Savings', 'SAVINGS', 'GBP', 10000.00, 10000.00, 'ACTIVE')
  `).run(savingsId, userId, `400515-${Math.floor(10000000 + Math.random() * 90000000)}`);

  db.prepare(`
    INSERT INTO accounts (id, user_id, account_number, account_name, account_type, currency, available_balance, ledger_balance, status)
    VALUES (?, ?, ?, 'Everyday Current Account', 'CURRENT', 'GBP', 2500.00, 2500.00, 'ACTIVE')
  `).run(currentId, userId, `400515-${Math.floor(10000000 + Math.random() * 90000000)}`);

  // Provision debit card
  db.prepare(`
    INSERT INTO cards (
      id, user_id, account_id, card_number_masked, card_number_last4, card_type, card_network, card_tier,
      cardholder_name, expiry_month, expiry_year, cvv_encrypted, is_frozen, is_blocked,
      online_enabled, international_enabled, contactless_enabled, daily_spending_limit
    ) VALUES (?, ?, ?, ?, ?, 'DEBIT', 'VISA', 'PREMIER_PLATINUM', ?, '12', '29', '391', 0, 0, 1, 1, 1, 5000.00)
  `).run(
    uuidv4(),
    userId,
    savingsId,
    `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
    `${Math.floor(1000 + Math.random() * 9000)}`,
    full_name.toUpperCase()
  );

  logAudit(userId, 'USER', 'REGISTRATION_SUCCESS', 'USER', userId, { customer_id: custId }, ip);

  res.json({
    success: true,
    message: 'Registration successful. Welcome to Premier Mobile Banking!',
    customer_id: custId
  });
});

// GET /api/auth/me
authRouter.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  const user = db.prepare(`
    SELECT u.id, u.username, u.email, u.phone, u.full_name, u.role, u.biometric_enabled, u.avatar_url,
           cp.customer_id, cp.dob, cp.address, cp.city, cp.country, cp.postal_code, cp.kyc_status,
           cp.preferred_language, cp.notification_email, cp.notification_sms, cp.notification_push
    FROM users u
    LEFT JOIN customer_profiles cp ON cp.user_id = u.id
    WHERE u.id = ?
  `).get(req.user!.id) as any;

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  res.json({ success: true, user });
});

// POST /api/auth/verify-otp (Development sandbox OTP verification)
authRouter.post('/verify-otp', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { otp } = req.body;
  // Sandbox test OTP is 123456
  if (otp === '123456' || otp === '000000') {
    res.json({ success: true, verified: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, verified: false, error: 'Invalid OTP code. For testing, use 123456.' });
  }
});

// POST /api/auth/change-password
authRouter.post('/change-password', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { currentPassword, newPassword } = req.body;
  const user = db.prepare(`SELECT password_hash FROM users WHERE id = ?`).get(req.user!.id) as any;

  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    res.status(400).json({ success: false, error: 'Current password is incorrect' });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(newHash, req.user!.id);

  logAudit(req.user!.id, req.user!.role, 'PASSWORD_CHANGE', 'USER', req.user!.id, null);

  res.json({ success: true, message: 'Password changed successfully' });
});

// POST /api/auth/toggle-biometric
authRouter.post('/toggle-biometric', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { enabled } = req.body;
  db.prepare(`UPDATE users SET biometric_enabled = ? WHERE id = ?`).run(enabled ? 1 : 0, req.user!.id);
  res.json({ success: true, biometric_enabled: !!enabled });
});
