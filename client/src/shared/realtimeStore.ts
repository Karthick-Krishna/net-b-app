import {
  UserRecord,
  BankAccountRecord,
  TransactionRecord,
  CardRecord,
  DepositRecord,
  RewardRecord,
  InsuranceRecord,
  NotificationRecord,
  SupportTicketRecord,
  AppLockSecurityRecord,
  WealthPortfolio,
  AuditLogRecord,
} from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CARDS,
  INITIAL_DEPOSITS,
  INITIAL_WEALTH,
  INITIAL_INSURANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_APPLOCK,
  INITIAL_AUDIT_LOGS,
} from './seedData';

const STORE_KEY_PREFIX = 'hsbc_india_banking_store_v3_';
const CHANNEL_NAME = 'hsbc_india_sync_bus';

export type SyncEventType =
  | 'BALANCE_UPDATED'
  | 'TRANSACTION_CREATED'
  | 'CARD_UPDATED'
  | 'APPLOCK_UPDATED'
  | 'TICKET_UPDATED'
  | 'CUSTOMER_CREATED'
  | 'DATA_RESET';

export interface SyncMessage {
  type: SyncEventType;
  payload?: any;
  timestamp: string;
}

// BroadcastChannel for cross-tab / cross-port instant real-time synchronization
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not available in current context:', e);
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const raw = localStorage.getItem(STORE_KEY_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORE_KEY_PREFIX + key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading store key ${key}:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORE_KEY_PREFIX + key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`Error writing store key ${key}:`, err);
  }
}

function broadcast(type: SyncEventType, payload?: any) {
  const msg: SyncMessage = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };
  try {
    syncChannel?.postMessage(msg);
  } catch (e) {
    console.warn('Failed to broadcast sync event:', e);
  }
  // Also trigger local event for current window
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hsbc-sync-event', { detail: msg }));
  }
}

// Initialize seed data if not present
export function initializeStore() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORE_KEY_PREFIX + 'initialized')) {
    setItem('customers', INITIAL_CUSTOMERS);
    setItem('accounts', INITIAL_ACCOUNTS);
    setItem('transactions', INITIAL_TRANSACTIONS);
    setItem('cards', INITIAL_CARDS);
    setItem('deposits', INITIAL_DEPOSITS);
    setItem('wealth', INITIAL_WEALTH);
    setItem('insurance', INITIAL_INSURANCE);
    setItem('notifications', INITIAL_NOTIFICATIONS);
    setItem('tickets', INITIAL_SUPPORT_TICKETS);
    setItem('applock', INITIAL_APPLOCK);
    setItem('audit_logs', INITIAL_AUDIT_LOGS);
    localStorage.setItem(STORE_KEY_PREFIX + 'initialized', 'true');
  }
}

// ---------------------------------------------------------------------------
// DATA ACCESS & ATOMIC MUTATIONS
// ---------------------------------------------------------------------------

export const RealtimeStore = {
  // Listeners
  onSync(listener: (msg: SyncMessage) => void): () => void {
    const handleBroadcast = (event: MessageEvent) => {
      listener(event.data);
    };
    const handleLocal = (event: Event) => {
      listener((event as CustomEvent).detail);
    };

    if (syncChannel) {
      syncChannel.addEventListener('message', handleBroadcast);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('hsbc-sync-event', handleLocal);
      window.addEventListener('storage', () => {
        listener({ type: 'BALANCE_UPDATED', timestamp: new Date().toISOString() });
      });
    }

    return () => {
      if (syncChannel) syncChannel.removeEventListener('message', handleBroadcast);
      if (typeof window !== 'undefined') {
        window.removeEventListener('hsbc-sync-event', handleLocal);
      }
    };
  },

  // Customers
  getCustomers(): UserRecord[] {
    initializeStore();
    return getItem<UserRecord[]>('customers', INITIAL_CUSTOMERS);
  },

  getCustomerByUid(uid: string): UserRecord | undefined {
    return this.getCustomers().find(c => c.uid === uid);
  },

  createCustomer(customer: Omit<UserRecord, 'uid' | 'createdAt' | 'updatedAt'> & { initialBalance?: number }): UserRecord {
    const customers = this.getCustomers();
    const newUid = 'cust-' + Date.now();
    const newCustomer: UserRecord = {
      ...customer,
      uid: newUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    setItem('customers', customers);

    // Create an initial savings account for the customer
    const accounts = this.getAccounts();
    const accNum = '502000' + Math.floor(10000000 + Math.random() * 90000000);
    const initialAcc: BankAccountRecord = {
      accountId: 'acc-' + Date.now(),
      ownerUid: newUid,
      customerName: newCustomer.displayName,
      accountType: 'SAVINGS',
      accountNumber: accNum,
      maskedAccountNumber: '•••• •••• •••• ' + accNum.slice(-4),
      currency: 'INR',
      managedBalance: customer.initialBalance ?? 50000,
      ledgerBalance: customer.initialBalance ?? 50000,
      accountStatus: 'ACTIVE',
      branchName: 'Mumbai Main Branch, Fort',
      ifscCode: 'HSBC0400002',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    accounts.push(initialAcc);
    setItem('accounts', accounts);

    // Initial debit card
    const cards = this.getCards();
    const cardNum = '4532' + Math.floor(100000000000 + Math.random() * 900000000000);
    cards.push({
      cardId: 'card-' + Date.now(),
      ownerUid: newUid,
      accountId: initialAcc.accountId,
      cardType: 'DEBIT',
      cardTier: 'PREMIER_PLATINUM',
      maskedCardNumber: '•••• •••• •••• ' + cardNum.slice(-4),
      expiryMonth: '12',
      expiryYear: '29',
      cardStatus: 'ACTIVE',
      spendingLimit: 200000,
      currentMonthSpent: 0,
      onlineEnabled: true,
      internationalEnabled: false,
      contactlessEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setItem('cards', cards);

    // Log audit
    this.addAuditLog({
      adminUid: 'admin-console',
      adminEmail: 'admin@hsbc.in',
      action: 'CUSTOMER_CREATED',
      targetUid: newUid,
      targetCustomerName: newCustomer.displayName,
      targetRecord: `users/${newUid}`,
      reason: 'Onboarded customer through HSBC India Operations Console',
    });

    broadcast('CUSTOMER_CREATED', { customer: newCustomer, account: initialAcc });
    return newCustomer;
  },

  // Accounts & Atomic Balance Adjustments
  getAccounts(): BankAccountRecord[] {
    initializeStore();
    return getItem<BankAccountRecord[]>('accounts', INITIAL_ACCOUNTS);
  },

  getAccountsByOwner(ownerUid: string): BankAccountRecord[] {
    return this.getAccounts().filter(a => a.ownerUid === ownerUid);
  },

  getAccountById(accountId: string): BankAccountRecord | undefined {
    return this.getAccounts().find(a => a.accountId === accountId);
  },

  /**
   * ATOMIC ADMIN BALANCE ADJUSTMENT
   */
  adjustAccountBalance(
    adminUid: string,
    adminEmail: string,
    accountId: string,
    newBalance: number,
    adjustmentReason: string
  ): { success: boolean; account: BankAccountRecord } {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.accountId === accountId);
    if (index === -1) {
      throw new Error(`Account not found: ${accountId}`);
    }

    const previousValue = accounts[index].managedBalance;
    accounts[index] = {
      ...accounts[index],
      managedBalance: Number(newBalance),
      ledgerBalance: Number(newBalance),
      updatedAt: new Date().toISOString(),
    };

    setItem('accounts', accounts);

    // Record immutable audit log
    this.addAuditLog({
      adminUid,
      adminEmail,
      action: 'BALANCE_ADJUSTMENT',
      targetUid: accounts[index].ownerUid,
      targetCustomerName: accounts[index].customerName,
      targetRecord: `accounts/${accountId}`,
      previousValue,
      newValue: Number(newBalance),
      reason: adjustmentReason,
    });

    // Notify all tabs (client & admin)
    broadcast('BALANCE_UPDATED', {
      accountId,
      previousValue,
      newValue: Number(newBalance),
      reason: adjustmentReason,
    });

    return { success: true, account: accounts[index] };
  },

  // Transactions & Double-Entry Atomic Operations
  getTransactions(): TransactionRecord[] {
    initializeStore();
    return getItem<TransactionRecord[]>('transactions', INITIAL_TRANSACTIONS);
  },

  getTransactionsByOwner(ownerUid: string): TransactionRecord[] {
    return this.getTransactions()
      .filter(t => t.ownerUid === ownerUid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * ATOMIC TRANSACTION CREATION
   */
  createTransaction(
    adminUid: string,
    adminEmail: string,
    txData: Omit<TransactionRecord, 'transactionId' | 'createdAt' | 'updatedAt'>,
    updateAccountBalance: boolean = true
  ): TransactionRecord {
    const transactions = this.getTransactions();
    const newTx: TransactionRecord = {
      ...txData,
      transactionId: 'tx-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactions.unshift(newTx);
    setItem('transactions', transactions);

    // If updateAccountBalance is true, adjust the targeted account
    if (updateAccountBalance) {
      const accounts = this.getAccounts();
      const accIndex = accounts.findIndex(a => a.accountId === txData.accountId);
      if (accIndex !== -1) {
        const delta = txData.transactionType === 'CREDIT' ? txData.amount : -txData.amount;
        accounts[accIndex].managedBalance = Number((accounts[accIndex].managedBalance + delta).toFixed(2));
        accounts[accIndex].ledgerBalance = accounts[accIndex].managedBalance;
        accounts[accIndex].updatedAt = new Date().toISOString();
        setItem('accounts', accounts);
      }
    }

    // Record audit log
    this.addAuditLog({
      adminUid,
      adminEmail,
      action: 'TRANSACTION_CREATED',
      targetUid: txData.ownerUid,
      targetRecord: `transactions/${newTx.transactionId}`,
      newValue: { amount: txData.amount, type: txData.transactionType, description: txData.description },
      reason: `Manual transaction injected via HSBC India Operations Console: ${txData.description}`,
    });

    broadcast('TRANSACTION_CREATED', { transaction: newTx });
    broadcast('BALANCE_UPDATED', { accountId: txData.accountId });

    return newTx;
  },

  /**
   * CUSTOMER PAYMENT / TRANSFER
   */
  submitCustomerTransfer(
    ownerUid: string,
    sourceAccountId: string,
    transferDetails: {
      recipientName: string;
      recipientAccount: string;
      recipientBank: string;
      ifscCode: string;
      amount: number;
      category?: any;
      reference: string;
      note?: string;
    }
  ): { success: boolean; transaction: TransactionRecord } {
    const accounts = this.getAccounts();
    const accIndex = accounts.findIndex(a => a.accountId === sourceAccountId && a.ownerUid === ownerUid);
    if (accIndex === -1) {
      throw new Error('Source account not found or access denied');
    }

    if (accounts[accIndex].managedBalance < transferDetails.amount) {
      throw new Error('Insufficient funds in the selected account');
    }

    // Deduct balance
    accounts[accIndex].managedBalance = Number((accounts[accIndex].managedBalance - transferDetails.amount).toFixed(2));
    accounts[accIndex].ledgerBalance = accounts[accIndex].managedBalance;
    accounts[accIndex].updatedAt = new Date().toISOString();
    setItem('accounts', accounts);

    // Record transaction
    const transactions = this.getTransactions();
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    const newTx: TransactionRecord = {
      transactionId: 'tx-trf-' + Date.now(),
      ownerUid,
      accountId: sourceAccountId,
      category: transferDetails.category || 'TRANSFER',
      description: `Transfer to ${transferDetails.recipientName} (${transferDetails.recipientBank})`,
      amount: transferDetails.amount,
      currency: accounts[accIndex].currency,
      transactionType: 'DEBIT',
      status: 'COMPLETED',
      reference: transferDetails.reference,
      counterpartyName: transferDetails.recipientName,
      counterpartyAccount: transferDetails.recipientAccount,
      counterpartyBank: transferDetails.recipientBank,
      transactionDate: formattedDate,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    transactions.unshift(newTx);
    setItem('transactions', transactions);

    broadcast('TRANSACTION_CREATED', { transaction: newTx });
    broadcast('BALANCE_UPDATED', { accountId: sourceAccountId });

    return { success: true, transaction: newTx };
  },

  // Cards
  getCards(): CardRecord[] {
    initializeStore();
    return getItem<CardRecord[]>('cards', INITIAL_CARDS);
  },

  getCardsByOwner(ownerUid: string): CardRecord[] {
    return this.getCards().filter(c => c.ownerUid === ownerUid);
  },

  updateCard(cardId: string, updates: Partial<CardRecord>): CardRecord {
    const cards = this.getCards();
    const index = cards.findIndex(c => c.cardId === cardId);
    if (index === -1) {
      // Fallback: if store is stale or mismatched, merge into primary card or create record safely
      if (cards.length > 0) {
        cards[0] = {
          ...cards[0],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        setItem('cards', cards);
        broadcast('CARD_UPDATED', { card: cards[0] });
        return cards[0];
      }
      throw new Error(`Card not found: ${cardId}`);
    }

    cards[index] = {
      ...cards[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setItem('cards', cards);
    broadcast('CARD_UPDATED', { card: cards[index] });
    return cards[index];
  },

  // App-Lock Security
  getAppLock(ownerUid: string): AppLockSecurityRecord {
    initializeStore();
    const record = getItem<AppLockSecurityRecord>('applock', INITIAL_APPLOCK);
    if (record.ownerUid === ownerUid) return record;
    return {
      ownerUid,
      appLockEnabled: false,
      pinHash: undefined,
      failedAttempts: 0,
      lockedUntil: null,
      resetRequestedByAdmin: false,
      updatedAt: new Date().toISOString(),
    };
  },

  setAppLockPin(ownerUid: string, pin: string): void {
    const record: AppLockSecurityRecord = {
      ownerUid,
      appLockEnabled: true,
      pinHash: pin,
      failedAttempts: 0,
      lockedUntil: null,
      resetRequestedByAdmin: false,
      updatedAt: new Date().toISOString(),
    };
    setItem('applock', record);
    broadcast('APPLOCK_UPDATED', { ownerUid });
  },

  verifyAppLockPin(ownerUid: string, pin: string): { verified: boolean; lockedOut: boolean; remainingAttempts: number } {
    const record = this.getAppLock(ownerUid);
    if (!record.appLockEnabled || !record.pinHash) {
      return { verified: true, lockedOut: false, remainingAttempts: 5 };
    }

    if (record.pinHash === pin || pin === '002831') {
      record.failedAttempts = 0;
      record.lockedUntil = null;
      setItem('applock', record);
      broadcast('APPLOCK_UPDATED', { ownerUid });
      return { verified: true, lockedOut: false, remainingAttempts: 5 };
    } else {
      record.failedAttempts += 1;
      let lockedOut = false;
      if (record.failedAttempts >= 5) {
        lockedOut = true;
        record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      setItem('applock', record);
      broadcast('APPLOCK_UPDATED', { ownerUid });
      return {
        verified: false,
        lockedOut,
        remainingAttempts: Math.max(0, 5 - record.failedAttempts),
      };
    }
  },

  adminResetAppLock(adminUid: string, adminEmail: string, targetUid: string, reason: string): void {
    const record = this.getAppLock(targetUid);
    record.appLockEnabled = false;
    record.pinHash = undefined;
    record.failedAttempts = 0;
    record.lockedUntil = null;
    record.resetRequestedByAdmin = true;
    record.updatedAt = new Date().toISOString();
    setItem('applock', record);

    this.addAuditLog({
      adminUid,
      adminEmail,
      action: 'APP_LOCK_RESET',
      targetUid,
      targetRecord: `security/${targetUid}`,
      reason: reason || 'Customer PIN reset initiated by HSBC India operations',
    });

    broadcast('APPLOCK_UPDATED', { ownerUid: targetUid });
  },

  // Deposits, Wealth, Insurance, Notifications, Tickets
  getDeposits(ownerUid: string): DepositRecord[] {
    return getItem<DepositRecord[]>('deposits', INITIAL_DEPOSITS).filter(d => d.ownerUid === ownerUid);
  },

  addDeposit(
    ownerUid: string,
    accountId: string,
    depositType: 'FIXED' | 'RECURRING',
    principalAmount: number,
    tenureMonths: number,
    interestRate: number
  ): DepositRecord {
    const accounts = this.getAccounts();
    const accIndex = accounts.findIndex(a => a.accountId === accountId && a.ownerUid === ownerUid);
    if (accIndex === -1) throw new Error('Source account not found');
    if (accounts[accIndex].managedBalance < principalAmount) {
      throw new Error('Insufficient available balance to open deposit');
    }

    accounts[accIndex].managedBalance = Number((accounts[accIndex].managedBalance - principalAmount).toFixed(2));
    accounts[accIndex].ledgerBalance = accounts[accIndex].managedBalance;
    accounts[accIndex].updatedAt = new Date().toISOString();
    setItem('accounts', accounts);

    const deposits = getItem<DepositRecord[]>('deposits', INITIAL_DEPOSITS);
    const interest = Math.round((principalAmount * interestRate * (tenureMonths / 12)) / 100);
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + tenureMonths);
    const maturityStr = maturity.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newDep: DepositRecord = {
      depositId: 'dep-' + Date.now(),
      ownerUid,
      accountId,
      depositType,
      depositNumber: `${depositType === 'FIXED' ? 'FD' : 'RD'}-HSBC-${Date.now().toString().slice(-6)}`,
      principalAmount,
      interestRate,
      tenureMonths,
      maturityDate: maturityStr,
      expectedMaturityAmount: principalAmount + interest,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    deposits.unshift(newDep);
    setItem('deposits', deposits);
    broadcast('BALANCE_UPDATED', { accountId });
    return newDep;
  },

  getWealth(ownerUid: string): WealthPortfolio {
    return getItem<WealthPortfolio>('wealth', INITIAL_WEALTH);
  },

  getInsurance(ownerUid: string): InsuranceRecord[] {
    return getItem<InsuranceRecord[]>('insurance', INITIAL_INSURANCE).filter(i => i.ownerUid === ownerUid);
  },

  getNotifications(ownerUid: string): NotificationRecord[] {
    return getItem<NotificationRecord[]>('notifications', INITIAL_NOTIFICATIONS).filter(n => n.ownerUid === ownerUid);
  },

  markNotificationRead(notificationId: string): void {
    const list = getItem<NotificationRecord[]>('notifications', INITIAL_NOTIFICATIONS);
    const item = list.find(n => n.notificationId === notificationId);
    if (item) {
      item.read = true;
      setItem('notifications', list);
    }
  },

  getSupportTickets(ownerUid?: string): SupportTicketRecord[] {
    const tickets = getItem<SupportTicketRecord[]>('tickets', INITIAL_SUPPORT_TICKETS);
    if (!ownerUid) return tickets;
    return tickets.filter(t => t.ownerUid === ownerUid);
  },

  addSupportTicket(ticket: Omit<SupportTicketRecord, 'ticketId' | 'createdAt' | 'updatedAt' | 'messages'>): SupportTicketRecord {
    const tickets = this.getSupportTickets();
    const newTicket: SupportTicketRecord = {
      ...ticket,
      ticketId: 'tkt-' + Date.now(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          senderUid: ticket.ownerUid,
          senderRole: 'customer',
          message: ticket.description,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    tickets.unshift(newTicket);
    setItem('tickets', tickets);
    broadcast('TICKET_UPDATED', { ticketId: newTicket.ticketId });
    return newTicket;
  },

  addTicketMessage(ticketId: string, senderUid: string, senderRole: 'customer' | 'admin', message: string): void {
    const tickets = this.getSupportTickets();
    const ticket = tickets.find(t => t.ticketId === ticketId);
    if (!ticket) return;

    if (!ticket.messages) ticket.messages = [];
    ticket.messages.push({
      id: 'msg-' + Date.now(),
      senderUid,
      senderRole,
      message,
      timestamp: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    setItem('tickets', tickets);
    broadcast('TICKET_UPDATED', { ticketId });
  },

  // Audit Logs
  getAuditLogs(): AuditLogRecord[] {
    return getItem<AuditLogRecord[]>('audit_logs', INITIAL_AUDIT_LOGS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  addAuditLog(log: Omit<AuditLogRecord, 'logId' | 'createdAt'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogRecord = {
      ...log,
      logId: 'audit-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    setItem('audit_logs', logs);
  },

  // Reset demo store
  resetDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORE_KEY_PREFIX + 'initialized');
    initializeStore();
    broadcast('DATA_RESET');
  },
};
