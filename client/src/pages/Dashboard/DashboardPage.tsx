import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  CreditCard,
  FileText,
  PiggyBank,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Receipt,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    accounts,
    transactions,
    cards,
    wealth,
    hideBalances,
    toggleBalanceVisibility,
    totalBalanceGbpOrInr,
    formatCurrency,
  } = useBanking();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <AnimatedPageTransition className="space-y-6">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-card relative overflow-hidden">
        {/* Subtle decorative geometry */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                Total Assets
              </span>
              <button
                onClick={toggleBalanceVisibility}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                title={hideBalances ? 'Show Balances' : 'Hide Balances'}
              >
                {hideBalances ? <EyeOff className="w-4 h-4 text-[#DB0011]" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Formatted in Indian Numbering System: ₹12,45,680.50 */}
            <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
              {formatCurrency(totalBalanceGbpOrInr, 'INR')}
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs text-[#777777]">
              <span>Currency: <strong className="text-gray-900 font-semibold">INR (₹)</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/payments')}
              className="flex items-center gap-2 px-5 py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] active:scale-[0.98] transition-all shadow-sm"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transfer Money</span>
            </button>
            <button
              onClick={() => navigate('/statements')}
              className="flex items-center gap-2 px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-600" />
              <span>Statements</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Pay & Transfer', icon: ArrowLeftRight, to: '/payments' },
          { label: 'Manage Cards', icon: CreditCard, to: '/cards' },
          { label: 'Statements', icon: FileText, to: '/statements' },
          { label: 'Fixed Deposits', icon: PiggyBank, to: '/deposits' },
          { label: 'Wealth Portfolio', icon: TrendingUp, to: '/wealth' },
          { label: 'Beneficiaries', icon: Users, to: '/payments' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(action.to)}
              className="bg-white p-4 rounded-2xl border border-[#E8E8E8] hover:border-[#DB0011] hover:shadow-xs transition-all flex flex-col items-center justify-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#DB0011]">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Accounts Overview & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts List (2 Columns on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#252525] tracking-tight">
              My Accounts ({accounts.length})
            </h3>
            <button
              onClick={() => navigate('/accounts')}
              className="text-xs font-bold text-[#DB0011] hover:underline flex items-center gap-1"
            >
              <span>View All Accounts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map(account => (
              <div
                key={account.accountId}
                className="bg-white p-5 rounded-2xl border border-[#E8E8E8] hover:border-gray-300 shadow-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">
                        {account.accountType === 'SAVINGS'
                          ? 'HSBC Premier Savings Account'
                          : account.accountType === 'CURRENT'
                          ? 'HSBC Business Current Account'
                          : 'HSBC Corporate Salary Account'}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {account.accountStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {account.maskedAccountNumber} • IFSC: {account.ifscCode}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {account.branchName}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-gray-500">Available Balance</div>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {formatCurrency(account.managedBalance, account.currency)}
                  </div>
                  <div className="mt-2 flex items-center sm:justify-end gap-2">
                    <button
                      onClick={() => navigate('/payments')}
                      className="text-xs font-bold text-[#DB0011] hover:underline"
                    >
                      Pay from here &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cards Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#252525] tracking-tight">
                Active Cards ({cards.length})
              </h3>
              <button
                onClick={() => navigate('/cards')}
                className="text-xs font-bold text-[#DB0011] hover:underline flex items-center gap-1"
              >
                <span>Card Controls</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map(card => (
                <div
                  key={card.cardId}
                  className={`p-6 rounded-3xl text-white shadow-elevated relative overflow-hidden ${
                    card.cardType === 'CREDIT'
                      ? 'bg-gradient-to-tr from-[#121212] via-[#222222] to-slate-800'
                      : 'bg-gradient-to-tr from-[#B0000D] via-[#DB0011] to-red-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase opacity-85">
                        {card.cardTier.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs font-bold mt-0.5">
                        {card.cardType} CARD
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <img src="/logo.png" alt="HSBC" className="w-6 h-6 object-contain brightness-0 invert" />
                      <span className="text-xs font-extrabold tracking-wider">HSBC</span>
                    </div>
                  </div>

                  <div className="my-6">
                    <div className="text-base font-mono tracking-widest">
                      {card.maskedCardNumber}
                    </div>
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <div className="text-[9px] uppercase opacity-75">Cardholder</div>
                      <div className="font-bold">{currentUser?.displayName}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase opacity-75">Expires</div>
                      <div className="font-mono font-bold">{card.expiryMonth}/{card.expiryYear}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Transactions & Wealth Widget */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                Recent Transactions
              </h3>
              <button
                onClick={() => navigate('/transactions')}
                className="text-xs font-bold text-[#DB0011] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {recentTransactions.map(tx => {
                const isCredit = tx.transactionType === 'CREDIT';
                return (
                  <div key={tx.transactionId} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#DB0011]'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                            {tx.description}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {tx.transactionDate}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-bold ${
                            isCredit ? 'text-emerald-600' : 'text-gray-900'
                          }`}
                        >
                          {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <div className="text-[9px] text-gray-400 font-mono truncate max-w-[80px]">
                          {tx.reference.split('/')[1] || tx.reference}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wealth & Investment Snapshot */}
          <div className="bg-gradient-to-br from-[#121212] to-slate-900 text-white rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Wealth Allocation
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {formatCurrency(wealth?.totalPortfolioValue || 4560000, 'INR')}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/10 p-2 rounded-xl">
                <div className="text-[10px] text-gray-300">Equity</div>
                <div className="font-bold text-emerald-400">{wealth?.equityAllocation}%</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <div className="text-[10px] text-gray-300">Debt</div>
                <div className="font-bold text-blue-400">{wealth?.debtAllocation}%</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <div className="text-[10px] text-gray-300">Gold</div>
                <div className="font-bold text-amber-400">{wealth?.goldAllocation}%</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/wealth')}
              className="mt-4 w-full py-2.5 bg-white/15 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Explore HSBC Wealth Suite &rarr;
            </button>
          </div>
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
