import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Snowflake,
  Copy,
  Bell,
  FileText,
  Send,
  KeyRound,
  Award,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    accounts,
    transactions,
    cards,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    hideBalances,
    toggleBalanceVisibility,
    totalBalanceGbpOrInr,
    formatCurrency,
  } = useBanking();

  const recentTransactions = transactions.slice(0, 6);
  const recentAlerts = notifications.slice(0, 3);
  const primaryAccount = accounts[0];

  const handleCopyAccountDetails = () => {
    if (!primaryAccount) return;
    navigator.clipboard?.writeText(
      `Account: ${primaryAccount.accountNumber} | IFSC: ${primaryAccount.ifscCode}`
    );
    toast.success('Account number and IFSC copied');
  };

  return (
    <AnimatedPageTransition className="pb-6 sm:pb-10">
      <div className="bg-white md:rounded-[2px] md:border md:border-[#E5E5E5] overflow-hidden">
        {/* REAL HSBC MOBILE-FIRST & DESKTOP PREMIER HERO */}
        <div className="bg-white text-[#1f1f1f] px-4 sm:px-6 md:px-8 pt-4 pb-5 sm:py-6 md:py-7 border-b border-[#EAEAEA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-6 lg:gap-10">
            {/* Clean Flat White HSBC Balance Strip (7 cols on Desktop, Full on Mobile) */}
            <div className="lg:col-span-7 py-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] sm:text-[14px] font-medium text-[#4A4A4A]">
                  Premier Savings · INR
                </span>
                <button
                  type="button"
                  onClick={toggleBalanceVisibility}
                  aria-label={hideBalances ? 'Show Balances' : 'Hide Balances'}
                  className="min-h-[32px] px-2 flex items-center gap-1.5 text-[12px] font-medium text-[#4A4A4A] hover:text-[#1f1f1f] transition-colors cursor-pointer shrink-0"
                >
                  {hideBalances ? (
                    <>
                      <Eye className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-[#666666]" aria-hidden="true" />
                      <span>Hide</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-1.5">
                <div className="text-[30px] min-[375px]:text-[34px] sm:text-[40px] font-semibold tracking-tight text-[#1f1f1f] leading-tight tabular-nums">
                  {formatCurrency(totalBalanceGbpOrInr, 'INR')}
                </div>
                <div className="text-[12px] text-[#666666] mt-1">
                  Available balance
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#666666]">
                <span className="font-mono">
                  A/C •••• {primaryAccount?.accountNumber?.slice(-4) || '4101'} · {primaryAccount?.ifscCode || 'HSBC0641002'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccountDetails}
                  className="inline-flex items-center gap-1 text-[#DB0011] hover:underline font-medium cursor-pointer min-h-[28px] shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* 4-COLUMN CIRCULAR QUICK ACTIONS (RIGHT OF BALANCE ON DESKTOP, BELOW ON MOBILE) */}
            <div className="lg:col-span-5">
              <div className="hidden lg:block text-[12px] font-medium text-[#666666] mb-3.5">
                Quick Actions
              </div>
              <div className="pt-1 pb-1 grid grid-cols-4 gap-1.5 sm:gap-3 max-w-md sm:max-w-xl lg:max-w-none mx-auto">
                {[
                  {
                    label: 'Send\nmoney',
                    path: '/payments',
                    icon: (
                      <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                        <rect x="4" y="6" width="24" height="20" rx="3" fill="white" stroke="#252525" strokeWidth="1.5" />
                        <path d="M9 13h14M17 9l4 4-4 4" stroke="#DB0011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="11" cy="20" r="1.4" fill="#1f1f1f" />
                        <circle cx="16" cy="20" r="1.4" fill="#1f1f1f" />
                        <circle cx="21" cy="20" r="1.4" fill="#1f1f1f" />
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
                        <circle cx="16" cy="16" r="4.5" fill="#F5F6F8" stroke="#252525" strokeWidth="1.2" />
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
          </div>
        </div>

        {/* RESPONSIVE 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* LEFT COLUMN: ACCOUNT PORTFOLIO & CARDS */}
          <div className="lg:col-span-7 px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-6">
            {/* Primary Account Section */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1f1f1f]">
                  Personal Account ({accounts.length})
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/accounts')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>Account details</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="border-t border-b border-[#EAEAEA] md:border md:border-[#E5E5E5] md:rounded-[2px] overflow-hidden divide-y divide-[#EAEAEA] bg-white">
                {accounts.map(account => (
                  <button
                    key={account.accountId}
                    type="button"
                    onClick={() => navigate('/accounts')}
                    className="w-full min-h-[60px] py-3.5 px-1 md:px-4 flex items-center justify-between gap-2.5 sm:gap-3 hover:bg-[#FAFAFA] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F6F8] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" aria-hidden="true">
                          <rect x="5" y="7" width="18" height="14" rx="2" fill="#DB0011" />
                          <rect x="8" y="9.5" width="12" height="2" rx="1" fill="white" />
                          <circle cx="14" cy="15.5" r="1.6" fill="white" />
                          <line x1="14" y1="16.5" x2="14" y2="18.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] sm:text-[15px] font-medium text-[#1f1f1f] truncate">
                          Manage account
                        </div>
                        <div className="text-[12px] text-[#666666] font-mono mt-0.5 truncate">
                          A/C {account.maskedAccountNumber} · {account.branchName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[14px] sm:text-[15px] font-semibold text-[#1f1f1f] tabular-nums">
                          {formatCurrency(account.managedBalance, account.currency)}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#333333] group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Cards (Strict 2-Card Executive Preview) */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1f1f1f]">
                  Cards ({Math.min(2, cards.length)} of {cards.length})
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/cards')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>View all {cards.length}</span>
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
                      className={`p-4 sm:p-5 rounded-2xl text-left shadow-md relative overflow-hidden transition-shadow hover:shadow-lg active:scale-[0.99] cursor-pointer border ${cardTheme}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-xs font-bold truncate">
                            {card.cardName || `HSBC ${card.cardType} Card`}
                          </span>
                        </div>
                        {frozen ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#DB0011] text-white text-[10px] font-bold flex items-center gap-1 shrink-0">
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

          {/* RIGHT COLUMN: LEDGER ACTIVITY, ALERTS & CONCIERGE LIST */}
          <div className="lg:col-span-5 px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-6">
            {/* Recent Verified Transactions */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1f1f1f]">
                  Recent Activity
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/transactions')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="border-t border-b border-[#EAEAEA] md:border md:border-[#E5E5E5] md:rounded-[2px] divide-y divide-[#EAEAEA] bg-white overflow-hidden">
                {recentTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <button
                      key={tx.transactionId}
                      type="button"
                      onClick={() => navigate('/transactions')}
                      className="w-full py-3.5 px-1 md:px-4 flex items-center justify-between gap-2.5 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F6F8] flex items-center justify-center shrink-0">
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4 text-[#16864A] stroke-[1.8]" aria-hidden="true" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-[#DB0011] stroke-[1.8]" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] sm:text-[14px] font-medium text-[#1f1f1f] truncate">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-[#666666] truncate mt-0.5">
                            {tx.transactionDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className={`text-[13px] sm:text-[14px] font-semibold tabular-nums ${isCredit ? 'text-[#16864A]' : 'text-[#1f1f1f]'}`}>
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#888888] group-hover:text-[#DB0011] transition-colors" aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Security & Account Notifications Feed */}
            <section className="border-t border-b border-[#EAEAEA] md:border md:border-[#E5E5E5] md:rounded-[2px] overflow-hidden bg-white">
              <div className="px-1 md:px-4 py-3 bg-white border-b border-[#EAEAEA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  <h2 className="text-[13px] font-semibold text-[#1f1f1f]">
                    Security &amp; Alerts
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-[#666666]">
                  {unreadNotificationsCount} unread
                </span>
              </div>

              <div className="divide-y divide-[#EAEAEA]">
                {recentAlerts.map(alert => (
                  <div
                    key={alert.notificationId}
                    className={`py-3.5 px-1 md:px-4 text-xs ${alert.read ? 'bg-white' : 'bg-[#FAFAFA]'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#1f1f1f]">{alert.title}</span>
                      {!alert.read && (
                        <button
                          type="button"
                          onClick={() => markNotificationAsRead(alert.notificationId)}
                          className="text-[11px] font-medium text-[#DB0011] hover:underline cursor-pointer shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] text-[#555555] mt-1 leading-snug">{alert.message}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick HSBC Mobile App Services List (Matching Cards List Row Design) */}
            <section className="divide-y divide-[#EAEAEA] border-t border-b border-[#EAEAEA] bg-white">
              {[
                { label: 'App-Lock & MPIN Security', sub: '6-digit PIN, biometrics & active devices', path: '/security', icon: KeyRound },
                { label: 'Premier Rewards', sub: '48,250 Premier points available', path: '/rewards', icon: Award },
                { label: 'Insurance & Protection', sub: 'Canara HSBC Life & Tata AIG active', path: '/insurance', icon: Shield },
                { label: 'Statements & Tax Certificates', sub: 'Download certified PDF & Form 16A', path: '/statements', icon: FileText },
                { label: '24/7 Premier Concierge', sub: 'Direct priority assistance & messaging', path: '/support', icon: MessageSquare },
              ].map(row => {
                const Icon = row.icon;
                return (
                  <button
                    key={row.path}
                    type="button"
                    onClick={() => navigate(row.path)}
                    className="w-full min-h-[58px] py-3 px-1 flex items-center justify-between gap-3 text-left hover:bg-[#FAFAFA] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F6F8] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#DB0011] stroke-[1.7]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] sm:text-[15px] font-medium text-[#1f1f1f] truncate">{row.label}</div>
                        <div className="text-[12px] text-[#666666] truncate">{row.sub}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#333333] group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
