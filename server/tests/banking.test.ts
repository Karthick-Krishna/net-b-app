import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Premier Mobile Banking - Core Banking Test Suite', () => {
  let customerToken: string;
  let adminToken: string;
  let sourceAccountId: string;
  let savingsBalance: number;

  beforeAll(async () => {
    // Authenticate as Customer
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'premier_user', password: 'Password@123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    customerToken = res.body.accessToken;

    // Authenticate as Super Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'super_admin', password: 'Admin@123' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.accessToken;

    // Fetch accounts
    const accRes = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(accRes.status).toBe(200);
    expect(accRes.body.accounts.length).toBeGreaterThan(0);
    sourceAccountId = accRes.body.accounts[0].id;
    savingsBalance = accRes.body.accounts[0].available_balance;
  });

  // 1. Health & Core Gateway Check
  it('should return system online and verified ledger integrity', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.ledgerIntegrity).toBe('VERIFIED');
  });

  // 2. Auth & Security Verification
  it('should reject invalid passwords and enforce secure error handling', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'premier_user', password: 'WrongPassword99' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should permit biometric login when customer has biometric enabled', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'premier_user', isBiometric: true });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.biometric_enabled).toBe(true);
  });

  // 3. Double-Entry Ledger & ACID Transfer Test
  it('should process a domestic faster payment using atomic double-entry ledger', async () => {
    const transferAmount = 150.00;
    const idempotencyKey = `test-idemp-${Date.now()}`;

    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        sourceAccountId,
        counterpartyName: 'British Telecom Services',
        counterpartyAccount: '400515-88339102',
        bankName: 'Barclays Bank UK',
        ifscSwift: 'BARCGB22XXX',
        amount: transferAmount,
        currency: 'GBP',
        fee: 0,
        description: 'Office Telecom Invoice #892',
        transactionType: 'DOMESTIC_TRANSFER',
        idempotencyKey
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.transaction).toBeDefined();
    expect(res.body.transaction.amount).toBe(transferAmount);
    expect(res.body.receipt.reference).toMatch(/^TXN-\d{6}-\d{6}$/);

    // Verify balance deduction in source account
    const accRes = await request(app)
      .get(`/api/accounts/${sourceAccountId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(accRes.body.account.available_balance).toBe(savingsBalance - transferAmount);
    savingsBalance = accRes.body.account.available_balance;
  });

  // 4. Idempotency Key Prevention of Duplicate Payments
  it('should prevent duplicate payments when re-submitting with identical idempotency key', async () => {
    const duplicateKey = `test-dup-${Date.now()}`;
    const payload = {
      sourceAccountId,
      counterpartyName: 'Duplicate Test Merchant',
      counterpartyAccount: '400515-11223344',
      bankName: 'NatWest Bank',
      ifscSwift: 'NWBKGB2LXXX',
      amount: 50.00,
      currency: 'GBP',
      description: 'Single Charge Only',
      transactionType: 'DOMESTIC_TRANSFER',
      idempotencyKey: duplicateKey
    };

    // First Call
    const firstRes = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(payload);
    expect(firstRes.status).toBe(200);

    // Second Call with identical key
    const secondRes = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(payload);
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.status).toBe('IDEMPOTENT_REPLAY');
    expect(secondRes.body.transaction.id).toBe(firstRes.body.transaction.id);
  });

  // 5. Insufficient Balance Protection
  it('should halt transfers when balance is insufficient', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        sourceAccountId,
        counterpartyName: 'Luxury Yacht Broker',
        counterpartyAccount: '400515-99999999',
        bankName: 'Coutts & Co',
        ifscSwift: 'COUTGB22XXX',
        amount: 5000000.00, // Exceeds available balance
        currency: 'GBP',
        description: 'Mega Purchase',
        transactionType: 'DOMESTIC_TRANSFER'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Insufficient funds');
  });

  // 6. Card Management & Freeze Controls
  it('should allow customer to toggle card freeze and update spending limits', async () => {
    const cardsRes = await request(app)
      .get('/api/cards')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(cardsRes.status).toBe(200);
    expect(cardsRes.body.cards.length).toBeGreaterThan(0);
    const cardId = cardsRes.body.cards[0].id;

    // Toggle Freeze
    const freezeRes = await request(app)
      .post(`/api/cards/${cardId}/freeze`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(freezeRes.status).toBe(200);
    expect(freezeRes.body.is_frozen).toBe(1);

    // Unfreeze
    const unfreezeRes = await request(app)
      .post(`/api/cards/${cardId}/freeze`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(unfreezeRes.status).toBe(200);
    expect(unfreezeRes.body.is_frozen).toBe(0);

    // Update spending limit
    const limitRes = await request(app)
      .post(`/api/cards/${cardId}/controls`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ dailySpendingLimit: 7500 });
    expect(limitRes.status).toBe(200);
    expect(limitRes.body.card.daily_spending_limit).toBe(7500);
  });

  // 7. Role-Based Access Control on Administrative APIs
  it('should deny administrative ledger endpoints to non-admin customers', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should grant access to administrative endpoints for Super Admin', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.overview.systemHealth).toBe('100% OPERATIONAL');
  });
});
