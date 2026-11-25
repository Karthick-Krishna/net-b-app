import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Snowflake,
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
  const firstName = currentUser?.displayName?.split(' ')[0] || 'Karthick';

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* TOP HERO BALANCE HEADER (Matches Cards UI Clean White Aesthetic) */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-xs font-medium text-[#777777]">
                Welcome back, <span className="text-[#1f1f1f] font-semibold">{firstName}</span>
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Total Assets
                </span>
                <button
                  type="button"
                  onClick={toggleBalanceVisibility}
                  aria-label={hideBalances ? 'Show Balances' : 'Hide Balances'}
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full text-gray-500 hover:text-[#DB0011] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
                >
                  {hideBalances ? (
                    <EyeOff className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="mt-1 text-[28px] sm:text-[34px] font-bold text-[#1f1f1f] tracking-tight leading-tight">
                {formatCurrency(totalBalanceGbpOrInr, 'INR')}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-[11px] text-[#777777]">
                <span>Premier Banking • INR (₹)</span>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-1.5 text-[#16864A] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16864A]" aria-hidden="true" />
                  Live Sync Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/payments')}
                className="flex-1 sm:flex-initial min-h-[44px] px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer whitespace-nowrap"
              >
                Pay &amp; Transfer
              </button>
              <button
                type="button"
                onClick={() => navigate('/statements')}
                className="flex-1 sm:flex-initial min-h-[44px] px-5 bg-white hover:bg-gray-50 border border-[#333333] text-[#1f1f1f] text-xs font-semibold rounded-[2px] transition-colors cursor-pointer whitespace-nowrap"
              >
                Statements
              </button>
            </div>
          </div>

          {/* 4 CIRCULAR QUICK ACTION BUTTONS (Identical Style to Cards Page) */}
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-4 gap-2 max-w-md mx-auto md:mx-0 md:max-w-lg">
            {/* 1. Pay & Transfer */}
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] transition-colors flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                  <path d="M7 12h16l-4-4" stroke="#DB0011" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M25 20H9l4 4" stroke="#1f1f1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Pay &amp;<br />transfer
              </span>
            </button>

            {/* 2. Manage Cards */}
            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] transition-colors flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                  <rect x="4" y="8" width="24" height="16" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
                  <path d="M4 13h24" stroke="#DB0011" strokeWidth="2.2" />
                  <rect x="8" y="17" width="6" height="3.5" rx="0.8" fill="#DB0011" />
                </svg>
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Manage<br />cards
              </span>
            </button>

            {/* 3. Wealth & SIP */}
            <button
              type="button"
              onClick={() => navigate('/wealth')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] transition-colors flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                  <path d="M6 22l6-6 4 4 10-10" stroke="#DB0011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 10h5v5" stroke="#DB0011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="6" y1="25" x2="26" y2="25" stroke="#252525" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Invest<br />wealth
              </span>
            </button>

            {/* 4. Fixed Deposits */}
            <button
              type="button"
              onClick={() => navigate('/deposits')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] transition-colors flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                  <rect x="6" y="9" width="20" height="15" rx="2" fill="white" stroke="#252525" strokeWidth="1.5" />
                  <circle cx="16" cy="16.5" r="4" fill="#DB0011" />
                  <circle cx="16" cy="16.5" r="1.5" fill="white" />
                </svg>
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Term<br />deposits
              </span>
            </button>
          </div>
        </div>

        {/* RESPONSIVE 2-COLUMN BODY (Stacked clean list on Mobile -> 12-Col Grid on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* LEFT COLUMN: ACCOUNTS & CARDS */}
          <div className="lg:col-span-7 px-4 sm:px-6 md:px-8 py-6 space-y-7">
            {/* My Accounts List */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-semibold text-[#1f1f1f]">
                  My Accounts ({accounts.length})
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/accounts')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {accounts.map(account => (
                  <button
                    key={account.accountId}
                    type="button"
                    onClick={() => navigate('/accounts')}
                    className="w-full py-4 flex items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none" aria-hidden="true">
                          <path d="M5 11l9-5 9 5H5z" fill="#DB0011" />
                          <rect x="7" y="13" width="2.2" height="7" fill="#1f1f1f" />
                          <rect x="12.9" y="13" width="2.2" height="7" fill="#1f1f1f" />
                          <rect x="18.8" y="13" width="2.2" height="7" fill="#1f1f1f" />
                          <rect x="5" y="21" width="18" height="2" fill="#DB0011" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-[#1f1f1f] truncate">
                          {account.accountType === 'SAVINGS'
                            ? 'Premier Savings Account'
                            : 'Business Current Account'}
                        </div>
                        <div className="text-[11px] text-[#777777] font-mono mt-0.5 truncate">
                          {account.maskedAccountNumber} • {account.ifscCode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="text-[14px] font-bold text-[#1f1f1f]">
                          {formatCurrency(account.managedBalance, account.currency)}
                        </div>
                        <div className="text-[10px] font-semibold text-[#16864A] uppercase">
                          {account.accountStatus}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#DB0011] transition-colors" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Active Cards Strip */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-semibold text-[#1f1f1f]">
                  Cards ({cards.length})
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/cards')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>Manage cards</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {cards.map(card => {
                  const frozen = card.cardStatus === 'FROZEN' || card.cardStatus === 'BLOCKED';
                  const isCredit = card.cardType === 'CREDIT';
                  return (
                    <button
                      key={card.cardId}
                      type="button"
                      onClick={() => navigate('/cards')}
                      className={`p-5 rounded-2xl text-left shadow-md relative overflow-hidden transition-transform hover:-translate-y-0.5 cursor-pointer border ${
                        isCredit
                          ? 'bg-gradient-to-br from-[#1B1F29] via-[#272D3B] to-[#11151E] text-white border-slate-700'
                          : 'bg-gradient-to-b from-[#EAECEF] via-[#DFE2E8] to-[#CDD1D9] text-[#1f1f1f] border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-xs font-bold truncate">
                            {card.cardName || `HSBC ${card.cardType} Card`}
                          </span>
                        </div>
                        {frozen ? (
                          <span className="px-2 py-0.5 rounded bg-[#DB0011] text-white text-[10px] font-bold flex items-center gap-1 shrink-0">
                            <Snowflake className="w-2.5 h-2.5" aria-hidden="true" />
                            FROZEN
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${isCredit ? 'text-gray-300' : 'text-gray-600'}`}>
                            {card.cardTier === 'GLOBAL_TRAVEL' ? 'BUSINESS DEBIT' : card.cardType}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 font-mono text-sm font-bold tracking-wider">
                        •••• •••• •••• {card.maskedCardNumber.slice(-4)}
                      </div>

                      <div className="mt-3 flex items-end justify-between text-[11px]">
                        <div>
                          <div className={`font-bold uppercase tracking-wide ${isCredit ? 'text-white' : 'text-[#1f1f1f]'}`}>
                            {card.cardholderName || currentUser?.displayName || 'KARTHICK KRISHNA'}
                          </div>
                          <span className={`font-mono text-[10px] ${isCredit ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exp {card.expiryMonth}/{card.expiryYear}
                          </span>
                        </div>
                        <span className={`font-black italic text-base ${isCredit ? 'text-white' : 'text-[#1434CB]'}`}>
                          {card.network === 'MASTERCARD' ? 'MC' : 'VISA'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: RECENT ACTIVITY, WEALTH & EXPLORE */}
          <div className="lg:col-span-5 px-4 sm:px-6 md:px-8 py-6 space-y-7">
            {/* Recent Transactions */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-semibold text-[#1f1f1f]">
                  Recent Activity
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/transactions')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                >
                  <span>Full ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {recentTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <button
                      key={tx.transactionId}
                      type="button"
                      onClick={() => navigate('/transactions')}
                      className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-50 text-[#16864A]' : 'bg-[#F2F4F7] text-[#DB0011]'
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
                          <div className="text-[11px] text-[#777777] truncate">
                            {tx.transactionDate}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-[13px] font-bold ${isCredit ? 'text-[#16864A]' : 'text-[#1f1f1f]'}`}>
                          {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Wealth Snapshot List Row */}
            <section className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Invested Wealth Portfolio
                </span>
                <span className="text-[11px] font-bold text-[#16864A]">+18.42%</span>
              </div>
              <div className="text-2xl font-bold text-[#1f1f1f]">
                {formatCurrency(wealth?.totalPortfolioValue || 4560000, 'INR')}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-gray-200/60">
                  <div className="text-[10px] text-[#777777]">Equity</div>
                  <div className="font-bold text-[#1f1f1f]">{wealth?.equityAllocation || 60}%</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200/60">
                  <div className="text-[10px] text-[#777777]">Debt</div>
                  <div className="font-bold text-[#1f1f1f]">{wealth?.debtAllocation || 30}%</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200/60">
                  <div className="text-[10px] text-[#777777]">Gold</div>
                  <div className="font-bold text-[#1f1f1f]">{wealth?.goldAllocation || 10}%</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/wealth')}
                className="w-full min-h-[40px] bg-[#1f1f1f] hover:bg-black text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                Open Wealth &amp; Mutual Funds
              </button>
            </section>

            {/* More Banking Services (Cards-UI Action List) */}
            <section className="divide-y divide-gray-100 border-t border-gray-100">
              {[
                { label: 'Premier Rewards & Points', sub: '48,250 pts ready to redeem', path: '/rewards' },
                { label: 'Insurance & Protection', sub: 'Health & Term Life active policies', path: '/insurance' },
                { label: 'App Lock & 6-Digit MPIN', sub: 'Biometrics & security controls', path: '/security' },
                { label: '24/7 Concierge & Support', sub: 'Live operations desk messaging', path: '/support' },
              ].map(row => (
                <button
                  key={row.path}
                  type="button"
                  onClick={() => navigate(row.path)}
                  className="w-full py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors group cursor-pointer"
                >
                  <div>
                    <div className="text-[14px] font-semibold text-[#1f1f1f]">{row.label}</div>
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
