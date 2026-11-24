import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth';

export const supportRouter = Router();

// Frequently Asked Questions
const BANKING_FAQS = [
  {
    q: 'How do I transfer money internationally with zero foreign exchange fees?',
    a: 'Premier World Elite Mastercard and Global Multi-Currency accounts provide access to interbank foreign exchange rates without typical retail markups. You can transfer in 14 supported currencies directly from the International Banking tab.',
    category: 'TRANSFERS'
  },
  {
    q: 'What should I do if I misplace or lose my debit or credit card?',
    a: 'Immediately open the Cards section and tap "Freeze Card". This temporarily disables all contactless, ATM, and online transactions. If permanently lost or stolen, tap "Report Lost/Stolen" to block it permanently and order an instant replacement.',
    category: 'CARDS'
  },
  {
    q: 'How do Faster Payments work and what are the daily transfer limits?',
    a: 'Domestic UK Faster Payments are processed instantly 24/7/365. Standard daily transfer limit for Premier customers is £50,000. Higher limits can be temporarily approved via phone or biometric authentication.',
    category: 'TRANSFERS'
  },
  {
    q: 'Can I download stamped official PDF account statements for tax or visa purposes?',
    a: 'Yes. Navigate to Accounts -> View Details -> Download Statement. You can select custom date ranges and export a cryptographically verified PDF statement with our branch sort code and bank stamp.',
    category: 'STATEMENTS'
  },
  {
    q: 'How do Fixed and Recurring Deposits earn interest?',
    a: 'Fixed deposits compound interest quarterly. You can open an FD with tenures from 3 months up to 5 years at rates up to 5.50% p.a. Premature closure is permitted subject to a 1% interest rate adjustment.',
    category: 'DEPOSITS'
  }
];

// GET /api/support/faqs
supportRouter.get('/faqs', (_req: AuthRequest, res: Response): void => {
  res.json({ success: true, faqs: BANKING_FAQS });
});

// GET /api/support/tickets
supportRouter.get('/tickets', authenticateToken, (req: AuthRequest, res: Response): void => {
  const tickets = db.prepare(`
    SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user!.id);

  res.json({ success: true, tickets });
});

// POST /api/support/tickets
supportRouter.post('/tickets', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { category, subject, description, priority = 'MEDIUM' } = req.body;

  if (!category || !subject || !description) {
    res.status(400).json({ success: false, error: 'Category, subject, and description are required' });
    return;
  }

  const ticketId = uuidv4();
  const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  db.prepare(`
    INSERT INTO support_tickets (id, ticket_number, user_id, category, subject, description, priority, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `).run(ticketId, ticketNumber, req.user!.id, category, subject, description, priority);

  // Add initial message
  db.prepare(`
    INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message)
    VALUES (?, ?, ?, 'USER', ?)
  `).run(uuidv4(), ticketId, req.user!.id, description);

  // Auto assistant response
  const botReply = `Thank you for contacting Premier 24/7 Client Support. Ticket ${ticketNumber} has been logged under priority ${priority}. Our specialized operations team has received your inquiry and is reviewing the details.`;
  db.prepare(`
    INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message)
    VALUES (?, ?, 'SYSTEM_BOT', 'BOT', ?)
  `).run(uuidv4(), ticketId, botReply);

  logAudit(req.user!.id, req.user!.role, 'SUPPORT_TICKET_CREATED', 'SUPPORT_TICKET', ticketId, { ticketNumber, category, subject });

  res.json({
    success: true,
    message: 'Support ticket opened successfully',
    ticketNumber,
    ticketId
  });
});

// GET /api/support/tickets/:id
supportRouter.get('/tickets/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const ticket = db.prepare(`
    SELECT * FROM support_tickets WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user!.id) as any;

  if (!ticket) {
    res.status(404).json({ success: false, error: 'Ticket not found' });
    return;
  }

  const messages = db.prepare(`
    SELECT * FROM support_messages WHERE ticket_id = ? ORDER BY created_at ASC
  `).all(ticket.id);

  res.json({ success: true, ticket, messages });
});

// POST /api/support/tickets/:id/message
supportRouter.post('/tickets/:id/message', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ success: false, error: 'Message cannot be empty' });
    return;
  }

  const ticket = db.prepare(`SELECT * FROM support_tickets WHERE id = ? AND user_id = ?`).get(req.params.id, req.user!.id) as any;
  if (!ticket) {
    res.status(404).json({ success: false, error: 'Ticket not found' });
    return;
  }

  const msgId = uuidv4();
  db.prepare(`
    INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message)
    VALUES (?, ?, ?, 'USER', ?)
  `).run(msgId, ticket.id, req.user!.id, message);

  // Generate automated context-aware assistant response
  let botReply = 'Your message has been added to your case file. A customer relationship specialist will follow up shortly.';
  const lower = message.toLowerCase();
  if (lower.includes('dispute') || lower.includes('fraud') || lower.includes('charge')) {
    botReply = 'Under our zero-liability policy for unauthorized transactions, our fraud security desk will place a temporary hold on the transaction and investigate within 24 hours.';
  } else if (lower.includes('card') && (lower.includes('freeze') || lower.includes('block') || lower.includes('lost'))) {
    botReply = 'If your card has been lost or compromised, please use the Cards module to immediately toggle "Freeze Card" to prevent any further charges.';
  } else if (lower.includes('swift') || lower.includes('iban') || lower.includes('wire')) {
    botReply = 'Our bank SWIFT/BIC code is HBUKGB41LHR and Sort Code is 40-05-15. International transfers are processed via standard SWIFT MT103 and ISO20022 formats.';
  }

  db.prepare(`
    INSERT INTO support_messages (id, ticket_id, sender_id, sender_type, message, created_at)
    VALUES (?, ?, 'SYSTEM_BOT', 'BOT', ?, datetime('now', '+2 seconds'))
  `).run(uuidv4(), ticket.id, botReply);

  const updatedMessages = db.prepare(`
    SELECT * FROM support_messages WHERE ticket_id = ? ORDER BY created_at ASC
  `).all(ticket.id);

  res.json({ success: true, messages: updatedMessages });
});

// POST /api/support/appointments
supportRouter.post('/appointments', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { branchName, date, timeSlot, serviceType } = req.body;

  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, 'Branch Appointment Confirmed', ?, 'SYSTEM')
  `).run(
    uuidv4(),
    req.user!.id,
    `Appointment booked at ${branchName} on ${date} at ${timeSlot} for ${serviceType}.`
  );

  res.json({
    success: true,
    message: `Appointment successfully confirmed at ${branchName} for ${date} at ${timeSlot}. A calendar invite has been sent to your registered email.`
  });
});
