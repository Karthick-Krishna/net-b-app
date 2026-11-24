import { Router, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export const notificationRouter = Router();

// GET /api/notifications
notificationRouter.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const notifications = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
  `).all(req.user!.id) as any[];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  res.json({
    success: true,
    unreadCount,
    notifications
  });
});

// POST /api/notifications/:id/read
notificationRouter.post('/:id/read', authenticateToken, (req: AuthRequest, res: Response): void => {
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`).run(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Notification marked as read' });
});

// POST /api/notifications/read-all
notificationRouter.post('/read-all', authenticateToken, (req: AuthRequest, res: Response): void => {
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`).run(req.user!.id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// DELETE /api/notifications/:id
notificationRouter.delete('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  db.prepare(`DELETE FROM notifications WHERE id = ? AND user_id = ?`).run(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Notification deleted' });
});

// POST /api/notifications/preferences
notificationRouter.post('/preferences', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { email, sms, push } = req.body;
  db.prepare(`
    UPDATE customer_profiles 
    SET notification_email = coalesce(?, notification_email),
        notification_sms = coalesce(?, notification_sms),
        notification_push = coalesce(?, notification_push)
    WHERE user_id = ?
  `).run(
    email !== undefined ? (email ? 1 : 0) : null,
    sms !== undefined ? (sms ? 1 : 0) : null,
    push !== undefined ? (push ? 1 : 0) : null,
    req.user!.id
  );

  res.json({ success: true, message: 'Notification preferences updated' });
});
