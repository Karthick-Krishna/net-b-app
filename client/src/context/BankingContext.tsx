import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BankAccount } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface BankingContextType {
  accounts: BankAccount[];
  totalAvailableGbp: number;
  totalLedgerGbp: number;
  lastUpdated: string;
  showBalances: boolean;
  toggleShowBalances: () => void;
  formatAmount: (amount?: number | null, currency?: string) => string;
  unreadCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAccount: BankAccount | null;
  setSelectedAccount: (acc: BankAccount | null) => void;
  activeReceipt: any | null;
  showReceipt: (receipt: any) => void;
  closeReceipt: () => void;
  refreshAccounts: () => Promise<void>;
  viewportMode: 'iphone' | 'pixel' | 'responsive' | 'admin';
  setViewportMode: (mode: 'iphone' | 'pixel' | 'responsive' | 'admin') => void;
  notificationMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [totalAvailableGbp, setTotalAvailableGbp] = useState<number>(0);
  const [totalLedgerGbp, setTotalLedgerGbp] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showBalances, setShowBalances] = useState<boolean>(() => {
    return localStorage.getItem('premier_show_balances') !== 'false';
  });
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [viewportMode, setViewportMode] = useState<'iphone' | 'pixel' | 'responsive' | 'admin'>('iphone');
  const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotificationMessage({ text, type });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const toggleShowBalances = () => {
    setShowBalances(prev => {
      const next = !prev;
      localStorage.setItem('premier_show_balances', String(next));
      return next;
    });
  };

  const formatAmount = useCallback((amount?: number | null, currency: string = 'GBP'): string => {
    if (amount === undefined || amount === null) return '—';
    if (!showBalances) return '••••••';

    const symbols: Record<string, string> = {
      GBP: '£',
      USD: '$',
      EUR: '€',
      JPY: '¥',
      CAD: 'CA$',
      AUD: 'A$',
      CHF: 'CHF ',
      INR: '₹',
      AED: 'AED ',
      SGD: 'S$'
    };

    const symbol = symbols[currency] || `${currency} `;
    const formatted = new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return `${symbol}${formatted}`;
  }, [showBalances]);

  const refreshAccounts = async () => {
    if (!user) return;
    try {
      const res = await api.getAccounts();
      setAccounts(res.accounts);
      setTotalAvailableGbp(res.totalAvailableGbp);
      setTotalLedgerGbp(res.totalLedgerGbp);
      setLastUpdated(res.lastUpdated);

      if (!selectedAccount && res.accounts.length > 0) {
        setSelectedAccount(res.accounts[0]);
      }

      const notifRes = await api.getNotifications();
      setUnreadCount(notifRes.unreadCount);
    } catch (err) {
      console.warn('Could not refresh accounts:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAccounts();
    } else {
      setAccounts([]);
      setTotalAvailableGbp(0);
      setTotalLedgerGbp(0);
      setUnreadCount(0);
    }
  }, [user]);

  const showReceipt = (receipt: any) => {
    setActiveReceipt(receipt);
  };

  const closeReceipt = () => {
    setActiveReceipt(null);
  };

  return (
    <BankingContext.Provider
      value={{
        accounts,
        totalAvailableGbp,
        totalLedgerGbp,
        lastUpdated,
        showBalances,
        toggleShowBalances,
        formatAmount,
        unreadCount,
        activeTab,
        setActiveTab,
        selectedAccount,
        setSelectedAccount,
        activeReceipt,
        showReceipt,
        closeReceipt,
        refreshAccounts,
        viewportMode,
        setViewportMode,
        notificationMessage,
        showToast,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
