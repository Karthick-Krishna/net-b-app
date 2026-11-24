import { Router, Response } from 'express';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/auth';

export const locatorRouter = Router();

// GET /api/locator
locatorRouter.get('/', (_req: AuthRequest, res: Response): void => {
  const { type, is24x7, search } = _req.query;

  let query = `SELECT * FROM branches_atms WHERE 1=1`;
  const params: any[] = [];

  if (type && type !== 'ALL') {
    query += ` AND type = ?`;
    params.push(type);
  }

  if (is24x7 === 'true' || is24x7 === '1') {
    query += ` AND is_24x7 = 1`;
  }

  if (search) {
    query += ` AND (name LIKE ? OR address LIKE ? OR city LIKE ? OR postal_code LIKE ? OR services LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  query += ` ORDER BY distance_km ASC`;
  const locations = db.prepare(query).all(...params);

  res.json({ success: true, count: locations.length, locations });
});
