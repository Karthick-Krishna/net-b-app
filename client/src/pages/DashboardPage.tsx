import React from 'react';
import { useBanking } from '../context/BankingContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Receipt,
  CreditCard,
  FileText,
  UserPlus,
  Globe,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    accounts,
    totalAvailableGbp,
    totalLedgerGbp,
    showBalances,
    toggleShowBalances,
    formatAmount,
    setActiveTab,
    setSelectedAccount,
  } = useBanking();
  const { user } = useAuth();

  // Quick action items as required in Master Prompt Section 5
  const quickActions = [
    { id: 'transfer', label: 'Transfer Money', icon: ArrowUpRight, tab: 'payments' },
    { id: 'bills', label: 'Pay Bills', icon: Receipt, tab: 'payments' },
    { id: 'cards', label: 'Manage Cards', icon: CreditCard, tab: 'cards' },
    { id: 'statements', label: 'Statements', icon: FileText, tab: 'accounts' },
    { id: 'beneficiary', label: 'Add Beneficiary', icon: UserPlus, tab: 'payments' },
    { id: 'intl', label: 'International', icon: Globe, tab: 'intl' },
  ];

  // Primary savings or main account
  const primaryAccount = accounts.find(a => a.account_type === 'SAVINGS') || accounts[0];

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 1. Total Balance Card */}
      <div className="bg-gradient-to-br from-white via-white to-zinc-50 rounded-2xl p-5 shadow-card border border-bank-border relative overflow-hidden">
        {/* Subtle decorative geometric background */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between text-xs text-bank-muted mb-1 font-medium">
          <span>Total Available Balance</span>
          <span className="flex items-center gap-1 text-[11px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600">
            GBP Base
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-bank-text tracking-tight font-sans">
            {formatAmount(totalAvailableGbp, 'GBP')}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
          <div>
            <span>Ledger Balance: </span>
            <strong className="text-zinc-800 font-semibold">{formatAmount(totalLedgerGbp, 'GBP')}</strong>
          </div>
          <button
            onClick={toggleShowBalances}
            className="text-[11px] text-[#DB0011] hover:underline font-semibold"
          >
            {showBalances ? 'Hide amounts' : 'Reveal amounts'}
          </button>
        </div>
      </div>

      {/* 2. Quick Action Section (Master Prompt Section 5) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted mb-2.5 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.tab)}
                className="bg-white hover:bg-zinc-50 p-3 rounded-xl border border-bank-border shadow-xs flex flex-col items-center text-center transition group active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center mb-1.5 group-hover:bg-[#DB0011] group-hover:text-white transition">
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-semibold text-zinc-800 leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Account Overview Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            My Bank Accounts ({accounts.length})
          </h2>
          <button
            onClick={() => setActiveTab('accounts')}
            className="text-xs text-[#DB0011] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2.5">
          {accounts.slice(0, 3).map(acc => (
            <div
              key={acc.id}
              onClick={() => {
                setSelectedAccount(acc);
                setActiveTab('accounts');
              }}
              className="bg-white p-4 rounded-xl border border-bank-border shadow-card hover:border-[#DB0011]/40 transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                  <Building2 size={20} className="text-[#DB0011]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-bank-text leading-tight">{acc.account_name}</h3>
                  <p className="text-[11px] text-bank-muted font-mono mt-0.5">{acc.account_number}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-bank-text">
                  {formatAmount(acc.available_balance, acc.currency)}
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">
                  {acc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Transactions (Latest 5 with Details) */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Recent Transactions
          </h2>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-[#DB0011] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-zinc-100 text-xs">
          {/* Mock Recent 5 Transactions */}
          {[
            { party: 'Fintech Solutions UK', cat: 'Salary Credit', amount: 8500.0, isCredit: true, date: 'Yesterday' },
            { party: 'British Gas Residential', cat: 'Utility Direct Debit', amount: -142.5, isCredit: false, date: '2 days ago' },
            { party: 'The Wolseley Mayfair', cat: 'Fine Dining', amount: -285.0, isCredit: false, date: '3 days ago' },
            { party: 'Charlotte Vance (Sister)', cat: 'Faster Payments', amount: -1200.0, isCredit: false, date: '5 days ago' },
            { party: 'Apple Store Regent St', cat: 'Card Purchase', amount: -1199.0, isCredit: false, date: '7 days ago' },
          ].map((txn, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between hover:bg-zinc-50 px-1 rounded-lg transition">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    txn.isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {txn.isCredit ? '+' : '–'}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 leading-tight">{txn.party}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {txn.cat} • {txn.date}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-bold text-xs ${
                    txn.isCredit ? 'text-emerald-700' : 'text-zinc-900'
                  }`}
                >
                  {txn.isCredit ? '+' : ''}
                  {formatAmount(Math.abs(txn.amount), 'GBP')}
                </div>
                <span className="text-[9px] text-zinc-400 uppercase">Settled</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Additional Dashboard Sections (Master Prompt Section 5) */}
      {/* Spending & Savings Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => setActiveTab('deposits')}
          className="bg-white p-3.5 rounded-xl border border-bank-border shadow-card cursor-pointer hover:border-zinc-300 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center mb-2">
            <PiggyBank size={16} />
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">Active Deposits</div>
          <div className="text-sm font-bold text-zinc-900 mt-0.5">£31,000.00</div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp size={11} />
            <span>Up to 5.50% p.a.</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('cards')}
          className="bg-white p-3.5 rounded-xl border border-bank-border shadow-card cursor-pointer hover:border-zinc-300 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center mb-2">
            <Sparkles size={16} />
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">Reward Points</div>
          <div className="text-sm font-bold text-zinc-900 mt-0.5">48,920 Pts</div>
          <div className="text-[10px] text-zinc-500 mt-1">
            Value: £489.20
          </div>
        </div>
      </div>

      {/* Security Advisory & Important Announcements */}
      <div className="bg-red-50/60 border border-red-200/70 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck size={18} className="text-[#DB0011] shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-800">
          <strong className="font-semibold text-zinc-900 block mb-0.5">Premier Fraud Shield Protection</strong>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Your accounts are safeguarded with continuous machine-learning fraud monitoring and biometric multi-factor authentication.
          </p>
        </div>
      </div>
    </div>
  );
};
