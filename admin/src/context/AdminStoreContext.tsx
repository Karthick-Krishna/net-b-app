import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  UserRecord,
  BankAccountRecord,
  TransactionRecord,
  CardRecord,
  AuditLogRecord,
  SupportTicketRecord,
  AppLockSecurityRecord,
} from '@shared/types';
import { RealtimeStore, SyncMessage } from '@shared/realtimeStore';
import { useAdminAuth } from './AdminAuthContext';

interface AdminStoreContextType {
  customers: UserRecord[];
  accounts: BankAccountRecord[];
  transactions: TransactionRecord[];
  cards: CardRecord[];
  auditLogs: AuditLogRecord[];
  tickets: SupportTicketRecord[];
  totalDepositedVolume: number;
  totalCustomersCount: number;
  totalManagedAccountsCount: number;
  adjustBalance: (accountId: string, newBalance: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  createTransaction: (txData: Omit<TransactionRecord, 'transactionId' | 'createdAt' | 'updatedAt'>, updateBalance?: boolean) => Promise<{ success: boolean; transaction?: TransactionRecord; error?: string }>;
  createCustomer: (customerData: any) => Promise<{ success: boolean; customer?: UserRecord }>;
  resetAppLock: (targetUid: string, reason: string) => Promise<{ success: boolean }>;
  updateCard: (cardId: string, updates: Partial<CardRecord>) => void;
  replyTicket: (ticketId: string, message: string) => void;
  getAppLock: (ownerUid: string) => AppLockSecurityRecord;
  formatCurrency: (amount: number, currency?: string) => string;
  refreshAll: () => void;
}

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(undefined);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser } = useAdminAuth();
  const [customers, setCustomers] = useState<UserRecord[]>([]);
  const [accounts, setAccounts] = useState<BankAccountRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [cards, setCards] = useState<CardRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);

  const loadData = useCallback(() => {
    setCustomers(RealtimeStore.getCustomers());
    setAccounts(RealtimeStore.getAccounts());
    setTransactions(RealtimeStore.getTransactions());
    setCards(RealtimeStore.getCards());
    setAuditLogs(RealtimeStore.getAuditLogs());
    setTickets(RealtimeStore.getSupportTickets());
  }, []);

  useEffect(() => {
    loadData();

    const unsub = RealtimeStore.onSync((msg: SyncMessage) => {
      loadData();
      if (msg.type === 'BALANCE_UPDATED') {
        toast.success('Account balance updated and audit log recorded.', {
          icon: '📝',
          style: { background: '#1E293B', color: '#F8FAFC' },
        });
      } else if (msg.type === 'TRANSACTION_CREATED') {
        toast('New transaction record posted to ledger.', {
          icon: '💳',
          style: { background: '#1E293B', color: '#F8FAFC' },
        });
      } else if (msg.type === 'CUSTOMER_CREATED') {
        toast.success('Customer profile created successfully.');
      } else if (msg.type === 'APPLOCK_UPDATED') {
        toast('Security lock credential updated.', { icon: '🔒' });
      }
    });

    return () => unsub();
  }, [loadData]);

  const totalDepositedVolume = accounts.reduce((acc, curr) => acc + (curr.managedBalance || 0), 0);
  const totalCustomersCount = customers.length;
  const totalManagedAccountsCount = accounts.length;

  const formatCurrency = (amount: number, currency = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return (
      symbol +
      ' ' +
      new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    );
  };

  /**
   * ATOMIC BALANCE ADJUSTMENT
   */
  const adjustBalance = async (accountId: string, newBalance: number, reason: string) => {
    if (!adminUser) return { success: false, error: 'Admin unauthenticated' };
    try {
      RealtimeStore.adjustAccountBalance(adminUser.uid, adminUser.email, accountId, newBalance, reason);
      loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Balance update failed' };
    }
  };

  /**
   * ATOMIC TRANSACTION INJECTION
   */
  const createTransaction = async (
    txData: Omit<TransactionRecord, 'transactionId' | 'createdAt' | 'updatedAt'>,
    updateBalance: boolean = true
  ) => {
    if (!adminUser) return { success: false, error: 'Admin unauthenticated' };
    try {
      const tx = RealtimeStore.createTransaction(adminUser.uid, adminUser.email, txData, updateBalance);
      loadData();
      return { success: true, transaction: tx };
    } catch (err: any) {
      return { success: false, error: err.message || 'Transaction injection failed' };
    }
  };

  const createCustomer = async (customerData: any) => {
    const customer = RealtimeStore.createCustomer(customerData);
    loadData();
    return { success: true, customer };
  };

  const resetAppLock = async (targetUid: string, reason: string) => {
    if (!adminUser) return { success: false };
    RealtimeStore.adminResetAppLock(adminUser.uid, adminUser.email, targetUid, reason);
    loadData();
    return { success: true };
  };

  const updateCard = (cardId: string, updates: Partial<CardRecord>) => {
    RealtimeStore.updateCard(cardId, updates);
    loadData();
  };

  const replyTicket = (ticketId: string, message: string) => {
    if (!adminUser) return;
    RealtimeStore.addTicketMessage(ticketId, adminUser.uid, 'admin', message);
    loadData();
  };

  const getAppLock = (ownerUid: string) => {
    return RealtimeStore.getAppLock(ownerUid);
  };

  return (
    <AdminStoreContext.Provider
      value={{
        customers,
        accounts,
        transactions,
        cards,
        auditLogs,
        tickets,
        totalDepositedVolume,
        totalCustomersCount,
        totalManagedAccountsCount,
        adjustBalance,
        createTransaction,
        createCustomer,
        resetAppLock,
        updateCard,
        replyTicket,
        getAppLock,
        formatCurrency,
        refreshAll: loadData,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error('useAdminStore must be used within an AdminStoreProvider');
  return context;
};
