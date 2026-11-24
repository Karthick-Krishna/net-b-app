import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';

export const JWT_SECRET = process.env.JWT_SECRET || 'premier_banking_jwt_super_secret_key_2026';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'premier_banking_jwt_refresh_secret_key_2026';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, error: 'Session expired or invalid token' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]` 
      });
      return;
    }
    next();
  };
}

export function logAudit(
  userId: string | null,
  actorRole: string,
  action: string,
  resource: string,
  resourceId: string | string[] | null | undefined,
  details: any,
  ipAddress: string | null = '127.0.0.1'
) {
  try {
    const resId = Array.isArray(resourceId) ? resourceId.join(',') : (resourceId || null);
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, actor_role, action, resource, resource_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      actorRole,
      action,
      resource,
      resId,
      typeof details === 'string' ? details : JSON.stringify(details),
      ipAddress
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
