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
        {/* TOP INSTITUTIONAL BAR (LIGHT CORPORATE BANKING THEME) */}
        <div className="px-4 sm:px-6 md:px-8 py-2.5 bg-[#F8F9FA] text-[#555555] border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold tracking-[0.12em] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" aria-hidden="true" />
            <span className="text-[#666666] font-mono">
              CIF: {currentUser?.customerId || 'HSBC-882941'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={lockApp}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-gray-300 hover:border-gray-400 text-[#1f1f1f] rounded-[2px] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#DB0011]" aria-hidden="true" />
              <span>Lock Session</span>
            </button>
          </div>
        </div>

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
                className="flex-1 sm:flex-initial min-h-[42px] px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Initiate Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/statements')}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-white hover:bg-[#F8F9FA] border border-[#333333] text-[#1f1f1f] text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#1f1f1f]" aria-hidden="true" />
                <span>Certified Statement</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/security')}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-white hover:bg-[#F8F9FA] border border-gray-300 text-[#1f1f1f] text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
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

        {/* INSTITUTIONAL COMMAND GRID (REPLACES CASUAL ROUND CONSUMER ICONS) */}
        <div className="px-4 sm:px-6 md:px-8 py-4 bg-[#F8F9FA] border-b border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { label: 'Funds Transfer', sub: 'NEFT / RTGS / IMPS', path: '/payments', icon: Send },
              { label: 'Card Controls', sub: `${cards.length} Active Cards`, path: '/cards', icon: CreditCard },
              { label: 'Wealth & Funds', sub: 'No Active Investments', path: '/wealth', icon: TrendingUp },
              { label: 'Term Deposits', sub: 'Up to 7.80% p.a.', path: '/deposits', icon: PiggyBank },
              { label: 'e-Statements', sub: 'Ledger & Form 16A', path: '/statements', icon: FileText },
              { label: 'Security & MPIN', sub: 'App-Lock Shield', path: '/security', icon: ShieldCheck },
            ].map(cmd => (
              <button
                key={cmd.path}
                type="button"
                onClick={() => navigate(cmd.path)}
                className="p-3 bg-white border border-gray-200 hover:border-[#DB0011] rounded-[2px] text-left transition-colors group cursor-pointer flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-[2px] bg-[#F2F4F7] group-hover:bg-[#DB0011] text-[#1f1f1f] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <cmd.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1f1f1f] truncate">{cmd.label}</div>
                  <div className="text-[10px] text-[#777777] truncate">{cmd.sub}</div>
                </div>
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

              <div className="border border-gray-200 rounded-[2px] divide-y divide-gray-100">
                {accounts.map(account => (
                  <button
                    key={account.accountId}
                    type="button"
                    onClick={() => navigate('/accounts')}
                    className="w-full p-4 flex items-center justify-between gap-3 hover:bg-[#F8F9FA] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-[2px] bg-[#F2F4F7] border border-gray-200 text-[#1f1f1f] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold tracking-wider">INR</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-[#1f1f1f] truncate">
                          HSBC Premier Savings Account
                        </div>
                        <div className="text-[11px] text-[#666666] font-mono mt-0.5 truncate">
                          {account.maskedAccountNumber} · IFSC {account.ifscCode} · {account.branchName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="text-[15px] font-bold text-[#1f1f1f] tabular-nums">
                          {formatCurrency(account.managedBalance, account.currency)}
                        </div>
                        <div className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                          {account.accountStatus}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#DB0011] transition-colors" aria-hidden="true" />
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
