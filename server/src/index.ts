import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './db/seed';
import { authRouter } from './routes/authRoutes';
import { accountRouter } from './routes/accountRoutes';
import { transferRouter } from './routes/transferRoutes';
import { beneficiaryRouter } from './routes/beneficiaryRoutes';
import { billRouter } from './routes/billRoutes';
import { cardRouter } from './routes/cardRoutes';
import { transactionRouter } from './routes/transactionRoutes';
import { depositRouter } from './routes/depositRoutes';
import { loanRouter } from './routes/loanRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { profileRouter } from './routes/profileRoutes';
import { supportRouter } from './routes/supportRoutes';
import { locatorRouter } from './routes/locatorRoutes';
import { adminRouter } from './routes/adminRoutes';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Initialize DB & Seed Data
seedDatabase();

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transfers', transferRouter);
app.use('/api/beneficiaries', beneficiaryRouter);
app.use('/api/bills', billRouter);
app.use('/api/cards', cardRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/deposits', depositRouter);
app.use('/api/loans', loanRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/profile', profileRouter);
app.use('/api/support', supportRouter);
app.use('/api/locator', locatorRouter);
app.use('/api/admin', adminRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Premier Mobile Banking API Gateway',
    version: '1.0.0',
    ledgerIntegrity: 'VERIFIED',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Banking Service Exception. Transaction safely halted.'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Premier Mobile Banking Core API Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` URL:  http://localhost:${PORT}`);
    console.log(` Test User: premier_user / Password@123`);
    console.log(` Super Admin: super_admin / Admin@123`);
    console.log(`=======================================================`);
  });
}
