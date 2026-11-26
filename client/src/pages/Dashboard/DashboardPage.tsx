import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Snowflake,
  ShieldCheck,
  Lock,
  Copy,
  Bell,
  FileText,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Send,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { useAppLock } from '../../context/AppLockContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    accounts,
    transactions,
    cards,
    deposits,
    wealth,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    hideBalances,
    toggleBalanceVisibility,
    totalBalanceGbpOrInr,
    formatCurrency,
  } = useBanking();
  const { lockApp } = useAppLock();

  const recentTransactions = transactions.slice(0, 6);
  const recentAlerts = notifications.slice(0, 3);
  const primaryAccount = accounts[0];

  const totalDepositsValue = deposits.reduce((s, d) => s + (d.principalAmount || 0), 0);
  const totalWealthValue = wealth?.totalPortfolioValue ?? 0;
  const totalRelationshipAssets = totalBalanceGbpOrInr + totalWealthValue + totalDepositsValue;
  const totalAvailableCredit = cards
    .filter(c => c.cardType === 'CREDIT')
    .reduce((s, c) => s + (c.availableCredit || 0), 0);

  const handleCopyAccountDetails = () => {
    if (!primaryAccount) return;
    navigator.clipboard?.writeText(
      `Account: ${primaryAccount.accountNumber} | IFSC: ${primaryAccount.ifscCode}`
    );
    toast.success('Account number and IFSC copied to clipboard.');
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-[2px] border border-gray-200 shadow-xs overflow-hidden">
        {/* EXECUTIVE LIQUIDITY & BALANCE HERO PANEL (CLEAN LIGHT HSBC THEME) */}
        <div className="bg-white text-[#1f1f1f] px-4 sm:px-6 md:px-8 py-6 sm:py-7 border-b border-gray-200 relative">

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Primary Balance Display */}
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#666666]">
                  Primary Liquid Balance · Premier Savings
                </span>
                <button
                  type="button"
                  onClick={toggleBalanceVisibility}
                  aria-label={hideBalances ? 'Show Balances' : 'Hide Balances'}
                  className="min-w-[28px] min-h-[28px] px-2 flex items-center gap-1 rounded-[2px] border border-gray-300 bg-[#F8F9FA] hover:bg-gray-100 text-[10px] font-semibold text-[#1f1f1f] transition-colors cursor-pointer"
                >
                  {hideBalances ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
                      <span>Reveal</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#555555]" aria-hidden="true" />
                      <span>Mask</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <div className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[#1f1f1f] leading-none tabular-nums">
                  {formatCurrency(totalBalanceGbpOrInr, 'INR')}
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[#166534] text-[10px] font-bold uppercase tracking-wider rounded-[2px]">
                  Cleared &amp; Available
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#666666]">
                <span className="font-mono">
                  A/C {primaryAccount?.maskedAccountNumber || '•••• •••• •••• 4101'} · IFSC{' '}
                  {primaryAccount?.ifscCode || 'HSBC0641002'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccountDetails}
                  className="inline-flex items-center gap-1 text-[#DB0011] hover:underline font-semibold cursor-pointer"
                >
                  <Copy className="w-3 h-3" aria-hidden="true" />
                  <span>Copy Details</span>
                </button>
                <span className="text-[#777777]">Ledger Cut-off: 30 Aug 2026</span>
              </div>
            </div>

            {/* Executive Action Strip */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/payments')}
                className="flex-1 sm:flex-initial min-h-[42px] px-5 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white text-xs font-semibold rounded-full sm:rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Initiate Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/statements')}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-white hover:bg-[#F5F6F8] active:scale-[0.98] border border-gray-300 text-[#1f1f1f] text-xs font-semibold rounded-full sm:rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#1f1f1f]" aria-hidden="true" />
                <span>Certified Statement</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/security')}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-white hover:bg-[#F5F6F8] active:scale-[0.98] border border-gray-300 text-[#1f1f1f] text-xs font-semibold rounded-full sm:rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
                <span>Security</span>
              </button>
            </div>
          </div>

          {/* 4-COLUMN INSTITUTIONAL POSITION SUMMARY (LIGHT SLATE HAIRLINE CELLS) */}
          <div className="mt-6 pt-5 border-t border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 bg-[#F8F9FA] border border-gray-200 rounded-[2px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Total Relationship Position
              </div>
              <div className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-1 tabular-nums">
                {formatCurrency(totalRelationshipAssets, 'INR')}
              </div>
              <div className="text-[10px] text-[#777777] mt-0.5">
                Savings ({formatCurrency(totalBalanceGbpOrInr, 'INR')}) + Deposits ({formatCurrency(totalDepositsValue, 'INR')})
              </div>
            </div>

            <div className="p-3.5 bg-[#F8F9FA] border border-gray-200 rounded-[2px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Invested Wealth Portfolio
              </div>
              <div className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-1 tabular-nums">
                {formatCurrency(totalWealthValue, 'INR')}
              </div>
              <div className="text-[10px] text-[#777777] font-medium mt-0.5">
                No Active Holdings
              </div>
            </div>

            <div className="p-3.5 bg-[#F8F9FA] border border-gray-200 rounded-[2px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Term &amp; Fixed Deposits
              </div>
              <div className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-1 tabular-nums">
                {formatCurrency(totalDepositsValue, 'INR')}
              </div>
              <div className="text-[10px] text-[#777777] mt-0.5">
                {deposits.length} Active Term Instruments
              </div>
            </div>

            <div className="p-3.5 bg-[#F8F9FA] border border-gray-200 rounded-[2px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Credit Line Headroom
              </div>
              <div className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-1 tabular-nums">
                {formatCurrency(totalAvailableCredit, 'INR')}
              </div>
              <div className="text-[10px] text-[#777777] mt-0.5">
                Across {cards.filter(c => c.cardType === 'CREDIT').length} Premier Cards
              </div>
            </div>
          </div>
        </div>

        {/* CIRCULAR PRIMARY ACTIONS ROW (MATCHING REFERENCE UI) */}
        <div className="px-4 sm:px-6 md:px-8 py-5 bg-white border-b border-gray-100">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              {
                label: 'Funds\ntransfer',
                path: '/payments',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="4" y="6" width="24" height="20" rx="3" fill="#F4F5F7" stroke="#333333" strokeWidth="1.4" />
                    <path d="M9 13h14M17 9l4 4-4 4" stroke="#DB0011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="20" r="1.5" fill="#1f1f1f" />
                    <circle cx="16" cy="20" r="1.5" fill="#1f1f1f" />
                    <circle cx="21" cy="20" r="1.5" fill="#1f1f1f" />
                  </svg>
                ),
              },
              {
                label: 'Card\ncontrols',
                path: '/cards',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="4" y="8" width="24" height="16" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
                    <path d="M4 13h24" stroke="#DB0011" strokeWidth="2" />
                    <rect x="7" y="18" width="6" height="3" rx="0.5" fill="#DB0011" />
                    <circle cx="23" cy="19.5" r="1.5" fill="#252525" />
                  </svg>
                ),
              },
              {
                label: 'Term\ndeposits',
                path: '/deposits',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="11" stroke="#252525" strokeWidth="1.5" fill="white" />
                    <rect x="14" y="9" width="4" height="14" rx="1" fill="#DB0011" />
                    <circle cx="16" cy="16" r="4.5" fill="#F4F5F7" stroke="#252525" strokeWidth="1.2" />
                    <text x="16" y="19" textAnchor="middle" fill="#DB0011" fontSize="9" fontWeight="bold">₹</text>
                  </svg>
                ),
              },
              {
                label: 'e-Statements\n& tax',
                path: '/statements',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="7" y="5" width="18" height="22" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
                    <path d="M11 11h10M11 15h10M11 19h6" stroke="#DB0011" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                label: 'App-Lock\nsecurity',
                path: '/security',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="8" y="13" width="16" height="13" rx="2.5" fill="#DB0011" stroke="#252525" strokeWidth="1.2" />
                    <path d="M11 13V9a5 5 0 0 1 10 0v4" stroke="#252525" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <circle cx="16" cy="19.5" r="1.5" fill="white" />
                    <path d="M16 21v2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                label: 'Premier\nconcierge',
                path: '/support',
                icon: (
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="5" y="7" width="18" height="14" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
                    <path d="M9 19l-3 4V19" fill="white" stroke="#252525" strokeWidth="1.5" />
                    <circle cx="10" cy="13.5" r="1.2" fill="#DB0011" />
                    <circle cx="14" cy="13.5" r="1.2" fill="#DB0011" />
                    <circle cx="18" cy="13.5" r="1.2" fill="#DB0011" />
                  </svg>
                ),
              },
            ].map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(btn.path)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full bg-[#F5F6F8] group-hover:bg-[#EBECEF] active:scale-[0.96] transition-all flex items-center justify-center shadow-xs">
                  {btn.icon}
                </div>
                <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center whitespace-pre-line">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RESPONSIVE 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* LEFT COLUMN: ACCOUNT PORTFOLIO & CARDS */}
          <div className="lg:col-span-7 px-4 sm:px-6 md:px-8 py-6 space-y-7">
            {/* Primary Account Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#777777] block">
                    Core Deposit Relationship
                  </span>
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">
                    Personal Account ({accounts.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/accounts')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>Account details</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="border border-gray-200/80 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white">
                {accounts.map(account => (
                  <button
                    key={account.accountId}
                    type="button"
                    onClick={() => navigate('/accounts')}
                    className="w-full min-h-[58px] p-4 flex items-center justify-between gap-3 hover:bg-[#F9FAFB] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" aria-hidden="true">
                          <rect x="5" y="7" width="18" height="14" rx="2.5" fill="#DB0011" />
                          <rect x="8" y="9.5" width="12" height="2" rx="1" fill="white" />
                          <circle cx="14" cy="15.5" r="1.6" fill="white" />
                          <line x1="14" y1="16.5" x2="14" y2="18.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-semibold text-[#1f1f1f] truncate">
                          Manage account
                        </div>
                        <div className="text-[12px] text-[#777777] font-mono mt-0.5 truncate">
                          A/C {account.maskedAccountNumber} · {account.branchName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[15px] font-bold text-[#1f1f1f] tabular-nums">
                          {formatCurrency(account.managedBalance, account.currency)}
                        </div>
                        <div className="text-[10px] font-bold text-[#16864A] uppercase tracking-wider">
                          {account.accountStatus}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1f1f1f] transition-colors shrink-0" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Cards (Strict 2-Card Executive Preview) */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#777777] block">
                    Payment Instruments
                  </span>
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">
                    Cards ({Math.min(2, cards.length)} of {cards.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/cards')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>View all {cards.length} cards</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {cards.slice(0, 2).map(card => {
                  const frozen = card.cardStatus === 'FROZEN' || card.cardStatus === 'BLOCKED';
                  const tier = card.cardTier;
                  const isLightCard = tier === 'VISA_PLATINUM';
                  const cardTheme =
                    tier === 'PREMIER_WORLD_ELITE'
                      ? 'bg-gradient-to-br from-[#1A0D10] via-[#2B1218] to-[#0E0709] text-white border-red-900/50'
                      : tier === 'TRAVEL_ONE'
                      ? 'bg-gradient-to-br from-[#0F2A44] via-[#17517E] to-[#0B1E30] text-white border-sky-800/50'
                      : tier === 'LIVE_PLUS'
                      ? 'bg-gradient-to-br from-[#DB0011] via-[#B8000E] to-[#8C000A] text-white border-red-900/40'
                      : tier === 'VISA_PLATINUM'
                      ? 'bg-gradient-to-br from-[#F3F5F8] via-[#E3E7EE] to-[#CDD3DE] text-[#1f1f1f] border-gray-300'
                      : 'bg-gradient-to-br from-[#14161A] via-[#1E2229] to-[#0B0C0F] text-white border-neutral-800';

                  return (
                    <button
                      key={card.cardId}
                      type="button"
                      onClick={() => navigate('/cards')}
                      className={`p-5 rounded-xl text-left shadow-md relative overflow-hidden transition-shadow hover:shadow-lg cursor-pointer border ${cardTheme}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-xs font-bold truncate">
                            {card.cardName || `HSBC ${card.cardType} Card`}
                          </span>
                        </div>
                        {frozen ? (
                          <span className="px-2 py-0.5 rounded-[2px] bg-[#DB0011] text-white text-[10px] font-bold flex items-center gap-1 shrink-0">
                            <Snowflake className="w-2.5 h-2.5" aria-hidden="true" />
                            FROZEN
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${isLightCard ? 'text-gray-600' : 'text-white/80'}`}>
                            {card.cardType}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 font-mono text-sm font-bold tracking-wider">
                        •••• •••• •••• {card.maskedCardNumber.slice(-4)}
                      </div>

                      <div className="mt-3 flex items-end justify-between text-[11px]">
                        <div>
                          <div className={`font-bold uppercase tracking-wide ${isLightCard ? 'text-[#1f1f1f]' : 'text-white'}`}>
                            {card.cardholderName || currentUser?.displayName || 'KARTHICK KRISHNA'}
                          </div>
                          <span className={`font-mono text-[10px] ${isLightCard ? 'text-gray-600' : 'text-white/75'}`}>
                            Exp {card.expiryMonth}/{card.expiryYear}
                          </span>
                        </div>
                        <span className={`font-black italic text-base ${isLightCard ? 'text-[#1434CB]' : 'text-white'}`}>
                          {card.network === 'MASTERCARD' ? 'MC' : 'VISA'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: LEDGER ACTIVITY & SECURITY NOTIFICATIONS */}
          <div className="lg:col-span-5 px-4 sm:px-6 md:px-8 py-6 space-y-7">
            {/* Security & Account Notifications Feed */}
            <section className="border border-gray-200 rounded-[2px] overflow-hidden">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-[#1f1f1f]">
                    Security &amp; Account Alerts
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-[#1f1f1f] text-white">
                  {unreadNotificationsCount} Unread
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {recentAlerts.map(alert => (
                  <div
                    key={alert.notificationId}
                    className={`p-3.5 text-xs ${alert.read ? 'bg-white' : 'bg-[#F8F9FA]'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#1f1f1f]">{alert.title}</span>
                      {!alert.read && (
                        <button
                          type="button"
                          onClick={() => markNotificationAsRead(alert.notificationId)}
                          className="text-[10px] font-semibold text-[#DB0011] hover:underline cursor-pointer shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#555555] mt-1 leading-snug">{alert.message}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Verified Transactions */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#777777] block">
                    Statement Activity (Till 30 Aug 2026)
                  </span>
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">
                    Recent Verified Ledger
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/transactions')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>Full ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="border border-gray-200 rounded-[2px] divide-y divide-gray-100">
                {recentTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <button
                      key={tx.transactionId}
                      type="button"
                      onClick={() => navigate('/transactions')}
                      className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-50 text-[#166534] border border-emerald-200' : 'bg-[#F2F4F7] text-[#1f1f1f] border border-gray-200'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[#1f1f1f] truncate">
                            {tx.description}
                          </div>
                          <div className="text-[10px] text-[#777777] font-mono truncate">
                            {tx.transactionDate} · {tx.reference}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-[13px] font-bold tabular-nums ${isCredit ? 'text-[#166534]' : 'text-[#1f1f1f]'}`}>
                          {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#777777] flex items-center justify-end gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#166534]" aria-hidden="true" />
                          <span>Posted</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Premier Concierge & Compliance Services */}
            <section className="border border-gray-200 rounded-[2px] divide-y divide-gray-100">
              {[
                { label: 'Premier Rewards & Privileges', sub: '48,250 Premier points available', path: '/rewards' },
                { label: 'Insurance & Protection', sub: 'Canara HSBC Life & Tata AIG active', path: '/insurance' },
                { label: '24/7 Operations & Support Desk', sub: 'Encrypted ticketing with Mumbai HQ', path: '/support' },
              ].map(row => (
                <button
                  key={row.path}
                  type="button"
                  onClick={() => navigate(row.path)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F8F9FA] transition-colors group cursor-pointer"
                >
                  <div>
                    <div className="text-[13px] font-bold text-[#1f1f1f]">{row.label}</div>
                    <div className="text-[11px] text-[#777777]">{row.sub}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
                </button>
              ))}
            </section>
          </div>
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
