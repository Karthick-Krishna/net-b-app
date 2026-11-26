import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  BankAccountRecord,
  TransactionRecord,
  CardRecord,
  DepositRecord,
  WealthPortfolio,
  InsuranceRecord,
  NotificationRecord,
  SupportTicketRecord,
} from '@shared/types';
import { RealtimeStore, SyncMessage } from '@shared/realtimeStore';
import { formatFinancialCurrency, formatINR } from '@shared/utils/formatters';
import { useAuth } from './AuthContext';

interface BankingContextType {
  accounts: BankAccountRecord[];
  transactions: TransactionRecord[];
  cards: CardRecord[];
  deposits: DepositRecord[];
  wealth: WealthPortfolio | null;
  insurance: InsuranceRecord[];
  notifications: NotificationRecord[];
  tickets: SupportTicketRecord[];
  hideBalances: boolean;
  totalBalanceGbpOrInr: number;
  totalLedgerBalance: number;
  toggleBalanceVisibility: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
  submitTransfer: (
    sourceAccountId: string,
    details: {
      recipientName: string;
      recipientAccount: string;
      recipientBank: string;
      ifscCode: string;
      amount: number;
      reference: string;
      category?: any;
      note?: string;
    }
  ) => Promise<{ success: boolean; transaction?: TransactionRecord; error?: string }>;
  updateCardSettings: (cardId: string, updates: Partial<CardRecord>) => void;
  createDeposit: (
    accountId: string,
    depositType: 'FIXED' | 'RECURRING',
    principalAmount: number,
    tenureMonths: number,
    interestRate: number
  ) => Promise<{ success: boolean; deposit?: DepositRecord; error?: string }>;
  submitTicket: (ticket: {
    subject: string;
    description: string;
    category: any;
    priority: any;
  }) => Promise<SupportTicketRecord>;
  sendTicketReply: (ticketId: string, message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  refreshData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [hideBalances, setHideBalances] = useState<boolean>(() => {
    return localStorage.getItem('hsbc_hide_balances') === 'true';
  });

  const [accounts, setAccounts] = useState<BankAccountRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [cards, setCards] = useState<CardRecord[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [wealth, setWealth] = useState<WealthPortfolio | null>(null);
  const [insurance, setInsurance] = useState<InsuranceRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);

  const loadData = useCallback(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    setAccounts(RealtimeStore.getAccountsByOwner(uid));
    setTransactions(RealtimeStore.getTransactionsByOwner(uid));
    setCards(RealtimeStore.getCardsByOwner(uid));
    setDeposits(RealtimeStore.getDeposits(uid));
    setWealth(RealtimeStore.getWealth(uid));
    setInsurance(RealtimeStore.getInsurance(uid));
    setNotifications(RealtimeStore.getNotifications(uid));
    setTickets(RealtimeStore.getSupportTickets(uid));
  }, [currentUser]);

  useEffect(() => {
    loadData();

    // Listen to real-time events across windows & ports
    const unsubscribe = RealtimeStore.onSync((msg: SyncMessage) => {
      loadData();
      if (msg.type === 'BALANCE_UPDATED') {
        toast.success('Account balance synchronized.');
      } else if (msg.type === 'TRANSACTION_CREATED') {
        toast.success('New transaction posted to ledger.');
      } else if (msg.type === 'CARD_UPDATED') {
        // Silent live-sync; triggering component provides specific user feedback
      } else if (msg.type === 'DATA_RESET') {
        toast.success('Account ledger refreshed.');
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  const toggleBalanceVisibility = () => {
    setHideBalances(prev => {
      const next = !prev;
      localStorage.setItem('hsbc_hide_balances', String(next));
      return next;
    });
  };

  const totalBalanceGbpOrInr = accounts.reduce((acc, curr) => acc + (curr.managedBalance || 0), 0);
  const totalLedgerBalance = accounts.reduce((acc, curr) => acc + (curr.ledgerBalance || 0), 0);

  const formatCurrency = (amount: number, currency = 'INR') => {
    return formatFinancialCurrency(amount, currency, hideBalances);
  };

  const submitTransfer = async (
    sourceAccountId: string,
    details: {
      recipientName: string;
      recipientAccount: string;
      recipientBank: string;
      ifscCode: string;
      amount: number;
      reference: string;
      category?: any;
      note?: string;
    }
  ) => {
    if (!currentUser) throw new Error('User not authenticated');
    try {
      const res = RealtimeStore.submitCustomerTransfer(currentUser.uid, sourceAccountId, details);
      loadData();
      return { success: true, transaction: res.transaction };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment execution failed' };
    }
  };

  const updateCardSettings = (cardId: string, updates: Partial<CardRecord>) => {
    RealtimeStore.updateCard(cardId, updates);
    loadData();
  };

  const createDeposit = async (
    accountId: string,
    depositType: 'FIXED' | 'RECURRING',
    principalAmount: number,
    tenureMonths: number,
    interestRate: number
  ) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    try {
      const dep = RealtimeStore.addDeposit(
        currentUser.uid,
        accountId,
        depositType,
        principalAmount,
        tenureMonths,
        interestRate
      );
      loadData();
      return { success: true, deposit: dep };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not open deposit' };
    }
  };

  const submitTicket = async (ticket: {
    subject: string;
    description: string;
    category: any;
    priority: any;
  }) => {
    if (!currentUser) throw new Error('Not authenticated');
    const newTicket = RealtimeStore.addSupportTicket({
      ownerUid: currentUser.uid,
      customerName: currentUser.displayName,
      ...ticket,
      status: 'OPEN',
    });
    loadData();
    return newTicket;
  };

  const sendTicketReply = (ticketId: string, message: string) => {
    if (!currentUser) return;
    RealtimeStore.addTicketMessage(ticketId, currentUser.uid, 'customer', message);
    loadData();
  };

  const markNotificationAsRead = (notificationId: string) => {
    RealtimeStore.markNotificationRead(notificationId);
    loadData();
  };

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        cards,
        deposits,
        wealth,
        insurance,
        notifications,
        tickets,
        hideBalances,
        totalBalanceGbpOrInr,
        totalLedgerBalance,
        toggleBalanceVisibility,
        formatCurrency,
        submitTransfer,
        updateCardSettings,
        createDeposit,
        submitTicket,
        sendTicketReply,
        markNotificationAsRead,
        refreshData: loadData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) throw new Error('useBanking must be used within a BankingProvider');
  return context;
};
