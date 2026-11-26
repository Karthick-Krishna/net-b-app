import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  FileText,
  Send,
  AlertTriangle,
  RotateCcw,
  Globe2,
  Copy,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

const GLOBAL_VIEW_ACCOUNTS = [
  { country: 'United Kingdom', flag: '🇬🇧', bank: 'HSBC UK Bank plc', account: '40-05-15 • 88210944', currency: 'GBP', balance: 28450.00, rate: 106.40 },
  { country: 'Singapore', flag: '🇸🇬', bank: 'HSBC Singapore', account: '141-882910-001', currency: 'SGD', balance: 42100.00, rate: 63.10 },
  { country: 'UAE', flag: '🇦🇪', bank: 'HSBC Bank Middle East', account: 'AE410200000882910', currency: 'AED', balance: 95000.00, rate: 23.00 },
];

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions, formatCurrency } = useBanking();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const activeAccount = accounts.find(a => a.accountId === selectedAccountId) || accounts[0];
  const accountTransactions = transactions.filter(t => t.accountId === activeAccount?.accountId);

  const isDormant = activeAccount?.accountStatus === 'DORMANT' || activeAccount?.accountStatus === 'INOPERATIVE';

  const handleReactivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account reactivation request submitted. Reference: HSBC/ACT/' + Date.now().toString().slice(-5));
    setShowReactivateModal(false);
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Page Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
              My Accounts
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              HSBC Premier Personal Savings &amp; linked relationship account
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isDormant && (
              <button
                type="button"
                onClick={() => setShowReactivateModal(true)}
                className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-[2px] text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reactivate Account</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/statements')}
              className="min-h-[40px] flex items-center gap-2 px-4 py-2 bg-white border border-[#333333] rounded-[2px] text-xs font-semibold text-[#1f1f1f] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
              <span>e-Statement</span>
            </button>
          </div>
        </div>

        {/* Account Card Container */}
        <div className="px-4 sm:px-6 md:px-8 py-5 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map(acc => {
            const isSelected = acc.accountId === activeAccount?.accountId;
            const accDormant = acc.accountStatus === 'DORMANT' || acc.accountStatus === 'INOPERATIVE';

            return (
              <button
                key={acc.accountId}
                type="button"
                onClick={() => setSelectedAccountId(acc.accountId)}
                className={`p-4 sm:p-5 rounded-xl text-left cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white border-[#DB0011] ring-1 ring-[#DB0011] shadow-xs'
                    : 'bg-[#F6F7F9] border-gray-200/70 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#DB0011] border border-red-100">
                    {acc.accountType}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      accDormant ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-[#16864A]'
                    }`}
                  >
                    {acc.accountStatus}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-[#777777] block">Available Balance</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#1f1f1f] tracking-tight mt-0.5 block">
                    {formatCurrency(acc.managedBalance, acc.currency)}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex justify-between items-center text-[11px] text-[#777777]">
                  <span className="font-mono">{acc.maskedAccountNumber}</span>
                  <span className="truncate max-w-[130px]">{acc.branchName}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Account Details & Activity */}
        {activeAccount && (
          <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f]">
                  HSBC Premier Savings Account
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777] font-mono mt-0.5">
                  <span>A/C: {activeAccount.accountNumber} • IFSC: {activeAccount.ifscCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`A/C: ${activeAccount.accountNumber} | IFSC: ${activeAccount.ifscCode}`);
                      toast.success('Account number & IFSC copied');
                    }}
                    className="inline-flex items-center gap-1 text-[#DB0011] font-sans font-semibold hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/payments')}
                className="min-h-[44px] px-5 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Transfer From This Account</span>
              </button>
            </div>

            {isDormant && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" aria-hidden="true" />
                  <div>
                    <strong className="block font-bold">Inoperative Account Alert</strong>
                    Per RBI directives, this account requires re-KYC or a verified transaction to lift operational holds.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReactivateModal(true)}
                  className="min-h-[40px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-[2px] font-bold whitespace-nowrap cursor-pointer"
                >
                  Submit Reactivation
                </button>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
                <div className="text-[11px] text-[#777777] font-medium">Available Balance</div>
                <div className="text-lg font-bold text-[#1f1f1f] mt-1">
                  {formatCurrency(activeAccount.managedBalance, activeAccount.currency)}
                </div>
                <div className="text-[10px] text-[#16864A] mt-0.5 font-semibold">Real-Time Core Balance</div>
              </div>
              <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
                <div className="text-[11px] text-[#777777] font-medium">General Ledger Balance</div>
                <div className="text-lg font-bold text-[#1f1f1f] mt-1">
                  {formatCurrency(activeAccount.ledgerBalance, activeAccount.currency)}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 font-semibold">Cleared Funds</div>
              </div>
              <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
                <div className="text-[11px] text-[#777777] font-medium">Branch &amp; Routing</div>
                <div className="text-sm font-bold text-[#1f1f1f] mt-1 font-mono">{activeAccount.ifscCode}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 truncate">{activeAccount.branchName}</div>
              </div>
            </div>

            {/* Activity Rows (Cards UI Hairline List) */}
            <div>
              <h3 className="text-sm font-semibold text-[#1f1f1f] mb-2">
                Recent Account Activity ({accountTransactions.length})
              </h3>
              <div className="divide-y divide-gray-100 border-t border-gray-100">
                {accountTransactions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No transaction records recorded for this account.
                  </div>
                ) : (
                  accountTransactions.map(tx => {
                    const isCredit = tx.transactionType === 'CREDIT';
                    return (
                      <button
                        key={tx.transactionId}
                        type="button"
                        onClick={() => navigate('/transactions')}
                        className="w-full py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors text-left cursor-pointer"
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
                            <div className="text-[13px] font-semibold text-[#1f1f1f] truncate">{tx.description}</div>
                            <div className="text-[11px] text-[#777777] mt-0.5 truncate">
                              {tx.transactionDate} • {tx.reference}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div className={`text-[13px] font-bold font-mono ${isCredit ? 'text-[#16864A]' : 'text-[#1f1f1f]'}`}>
                              {isCredit ? '+' : '-'} {formatINR(tx.amount)}
                            </div>
                            <span className="text-[10px] text-gray-400 uppercase">{tx.category}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300" aria-hidden="true" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            {/* HSBC Global View Linked International Accounts */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">HSBC Global View (Linked Overseas Accounts)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/payments')}
                  className="text-xs font-semibold text-[#DB0011] hover:underline cursor-pointer"
                >
                  Global Transfer →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {GLOBAL_VIEW_ACCOUNTS.map(g => (
                  <div key={g.country} className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1f1f1f]">{g.flag} {g.country}</span>
                      <span className="text-[10px] font-mono text-[#777777]">{g.currency}</span>
                    </div>
                    <div className="text-[11px] text-[#777777]">{g.bank}</div>
                    <div className="text-base font-bold text-[#1f1f1f] pt-1">
                      {g.currency} {g.balance.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#16864A] font-semibold">
                      ≈ {formatINR(Math.round(g.balance * g.rate))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reactivation Modal */}
      <ModalDialog
        open={showReactivateModal}
        onClose={() => setShowReactivateModal(false)}
        title="Reactivate Inoperative Account"
        subtitle={`${activeAccount?.accountType} (${activeAccount?.maskedAccountNumber})`}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleReactivateSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 bg-[#F6F7F9] rounded-xl space-y-2 border border-gray-200/70">
            <div className="font-bold text-[#1f1f1f]">Regulatory Re-KYC Checklist:</div>
            <label className="flex items-center gap-2.5 cursor-pointer text-gray-600 min-h-[32px]">
              <input type="checkbox" defaultChecked className="accent-[#DB0011]" />
              <span>Aadhaar XML e-KYC linked</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-gray-600 min-h-[32px]">
              <input type="checkbox" defaultChecked className="accent-[#DB0011]" />
              <span>PAN Card verified with NSDL</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-gray-600 min-h-[32px]">
              <input type="checkbox" defaultChecked className="accent-[#DB0011]" />
              <span>Registered Fort, Mumbai address reaffirmed</span>
            </label>
          </div>

          <div>
            <label htmlFor="reactivate-reason" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">
              Reactivation Reason
            </label>
            <select id="reactivate-reason" className="w-full p-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold">
              <option>Resuming regular personal transactions</option>
              <option>Domestic / International remittance receipt</option>
              <option>Fixed Deposit investment linkage</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowReactivateModal(false)}
              className="min-h-[44px] px-4 border border-gray-300 rounded-[2px] font-semibold text-[#555555] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] font-semibold cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
