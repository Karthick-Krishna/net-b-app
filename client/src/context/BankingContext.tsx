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
    return localStorage.getItem('premier_hide_balances') === 'true';
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
        toast.success('Account balance synchronized with central banking system.', {
          icon: '⚡',
          style: { borderRadius: '8px', background: '#222', color: '#fff' },
        });
      } else if (msg.type === 'TRANSACTION_CREATED') {
        toast('New transaction record posted to your account', {
          icon: '💳',
          style: { borderRadius: '8px', background: '#222', color: '#fff' },
        });
      } else if (msg.type === 'CARD_UPDATED') {
        toast.success('Card settings updated.');
      } else if (msg.type === 'DATA_RESET') {
        toast('Banking demonstration data refreshed.', { icon: '🔄' });
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  const toggleBalanceVisibility = () => {
    setHideBalances(prev => {
      const next = !prev;
      localStorage.setItem('premier_hide_balances', String(next));
      return next;
    });
  };

  const totalBalanceGbpOrInr = accounts.reduce((acc, curr) => acc + (curr.managedBalance || 0), 0);
  const totalLedgerBalance = accounts.reduce((acc, curr) => acc + (curr.ledgerBalance || 0), 0);

  const formatCurrency = (amount: number, currency = 'INR') => {
    if (hideBalances) return '••••••';
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
