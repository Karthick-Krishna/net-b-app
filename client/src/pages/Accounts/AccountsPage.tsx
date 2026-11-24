import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Send,
  AlertTriangle,
  RotateCcw,
  X,
  FileCheck,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions } = useBanking();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.accountId || '');
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [reactivationStep, setReactivationStep] = useState(1);

  const activeAccount = accounts.find(a => a.accountId === selectedAccountId) || accounts[0];
  const accountTransactions = transactions.filter(t => t.accountId === activeAccount?.accountId);

  const isDormant = activeAccount?.accountStatus === 'DORMANT' || activeAccount?.accountStatus === 'INOPERATIVE';

  const handleReactivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account reactivation request submitted! Reference: HSBC/ACT/' + Date.now().toString().slice(-5) + '. Verification completed in 24 hours.');
    setShowReactivateModal(false);
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            My Account Portfolios
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Supervise savings, corporate current, and fixed deposit portfolios
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDormant && (
            <button
              onClick={() => setShowReactivateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reactivate Inoperative Account</span>
            </button>
          )}
          <button
            onClick={() => navigate('/statements')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E8E8] rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>Generate e-Statement</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const isSelected = acc.accountId === activeAccount?.accountId;
          const accDormant = acc.accountStatus === 'DORMANT' || acc.accountStatus === 'INOPERATIVE';

          return (
            <div
              key={acc.accountId}
              onClick={() => setSelectedAccountId(acc.accountId)}
              className={`p-6 rounded-3xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-white border-[#DB0011] shadow-card ring-2 ring-red-100'
                  : 'bg-white border-[#E8E8E8] hover:border-gray-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#DB0011]">
                  {acc.accountType}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    accDormant
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-50 text-[#16864A]'
                  }`}
                >
                  {acc.accountStatus}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] text-[#777777] font-medium block">Managed Available Balance</span>
                <span className="text-2xl font-black text-[#252525] tracking-tight mt-0.5 block">
                  {formatINR(acc.managedBalance)}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E8E8] flex justify-between items-center text-xs text-[#777777]">
                <span className="font-mono">{acc.maskedAccountNumber}</span>
                <span className="font-medium text-[11px] truncate max-w-[120px]">{acc.branchName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Account Deep Dive Details */}
      {activeAccount && (
        <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E8]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#252525]">
                  {activeAccount.accountType}
                </h3>
                {isDormant && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                    Inoperative (No Debit for 24+ Mos)
                  </span>
                )}
              </div>
              <div className="text-xs text-[#777777] font-mono mt-0.5">
                Account: {activeAccount.accountNumber} • IFSC: {activeAccount.ifscCode}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/payments')}
                className="px-4 py-2 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transfer Funds</span>
              </button>
            </div>
          </div>

          {/* Dormant Account Alert Banner */}
          {isDormant && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <div>
                  <strong className="block font-bold">Inoperative Account Alert</strong>
                  Per RBI directives, this account requires re-KYC or a verified transaction to lift operational holds.
                </div>
              </div>
              <button
                onClick={() => setShowReactivateModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold whitespace-nowrap shadow-xs"
              >
                Submit Reactivation Request
              </button>
            </div>
          )}

          {/* Balance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-[#E8E8E8]">
              <div className="text-xs text-[#777777] font-medium">Available Balance</div>
              <div className="text-xl font-black text-[#252525] mt-1">
                {formatINR(activeAccount.managedBalance)}
              </div>
              <div className="text-[10px] text-[#16864A] mt-1 font-semibold">Real-Time Core Balance</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-[#E8E8E8]">
              <div className="text-xs text-[#777777] font-medium">General Ledger Balance</div>
              <div className="text-xl font-black text-[#252525] mt-1">
                {formatINR(activeAccount.ledgerBalance)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1 font-semibold">Cleared Funds</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-[#E8E8E8]">
              <div className="text-xs text-[#777777] font-medium">Branch & Routing</div>
              <div className="text-sm font-bold text-[#252525] mt-1 font-mono">{activeAccount.ifscCode}</div>
              <div className="text-[10px] text-gray-500 mt-1 truncate">{activeAccount.branchName}</div>
            </div>
          </div>

          {/* Account Activity Table */}
          <div>
            <h4 className="text-sm font-bold text-[#252525] mb-3">
              Recent Account Activity ({accountTransactions.length} records)
            </h4>
            <div className="divide-y divide-[#E8E8E8] border border-[#E8E8E8] rounded-2xl overflow-hidden">
              {accountTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No transaction records recorded for this account.
                </div>
              ) : (
                accountTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <div key={tx.transactionId} className="p-4 hover:bg-gray-50/70 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isCredit ? 'bg-emerald-50 text-[#16864A]' : 'bg-red-50 text-[#DB0011]'
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#252525]">{tx.description}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {tx.transactionDate} • Ref: {tx.reference}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold font-mono ${
                            isCredit ? 'text-[#16864A]' : 'text-[#252525]'
                          }`}
                        >
                          {isCredit ? '+' : '-'} {formatINR(tx.amount)}
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dormant Account Reactivation Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2 text-amber-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-base font-black text-[#252525]">Reactivate Inoperative Account</h3>
              </div>
              <button onClick={() => setShowReactivateModal(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Submit your re-activation request for <strong>{activeAccount?.accountType} ({activeAccount?.maskedAccountNumber})</strong>.
            </p>

            <form onSubmit={handleReactivateSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-[#E8E8E8]">
                <div className="font-bold text-[#252525]">Regulatory Re-KYC Checklist:</div>
                <div className="space-y-1 text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#DB0011]" />
                    <span>Aadhaar XML e-KYC linked</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#DB0011]" />
                    <span>PAN Card verified with NSDL</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#DB0011]" />
                    <span>Permanent Fort, Mumbai address reaffirmed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Reactivation Reason
                </label>
                <select className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold">
                  <option>Resuming salary / business transactions</option>
                  <option>Domestic / International remittance receipt</option>
                  <option>Fixed Deposit investment linkage</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setShowReactivateModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs"
                >
                  Submit for Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
