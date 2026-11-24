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
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions, formatCurrency } = useBanking();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.accountId || '');

  const activeAccount = accounts.find(a => a.accountId === selectedAccountId) || accounts[0];
  const accountTransactions = transactions.filter(t => t.accountId === activeAccount?.accountId);

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
            My Accounts
          </h2>
          <p className="text-xs text-[#777777]">
            Comprehensive view of your savings, current, and salary deposit accounts
          </p>
        </div>
        <button
          onClick={() => navigate('/statements')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E8E8] rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          <span>Generate Statement</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const isSelected = acc.accountId === activeAccount?.accountId;
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
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#16864A]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {acc.accountStatus}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-[#777777] font-mono">{acc.maskedAccountNumber}</div>
                <div className="text-2xl font-extrabold text-[#252525] mt-1 tracking-tight">
                  {formatCurrency(acc.managedBalance, acc.currency)}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-[#777777]">
                <span>IFSC: <strong className="font-mono text-gray-900">{acc.ifscCode}</strong></span>
                <span className="font-bold text-[#DB0011] flex items-center gap-0.5">
                  Select <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Account Overview */}
      {activeAccount && (
        <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
              <div className="text-[11px] font-bold text-[#DB0011] uppercase tracking-wider">
                Account Details & Activity
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                {activeAccount.accountType === 'SAVINGS'
                  ? 'HSBC Premier Savings Account'
                  : activeAccount.accountType === 'CURRENT'
                  ? 'HSBC Business Current Account'
                  : 'HSBC Corporate Salary Account'}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Full Account Number: {activeAccount.accountNumber} • Branch: {activeAccount.branchName}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/payments')}
                className="px-5 py-2.5 bg-[#DB0011] text-white text-xs font-bold rounded-xl hover:bg-[#B0000D] transition-colors shadow-xs flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Make Transfer</span>
              </button>
            </div>
          </div>

          {/* Standard Banking Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-gray-200">
              <div className="text-xs text-gray-500 font-medium">Available Balance</div>
              <div className="text-xl font-extrabold text-gray-900 mt-1">
                {formatCurrency(activeAccount.managedBalance, activeAccount.currency)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Real-time Admin-Controlled</div>
            </div>
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-gray-200">
              <div className="text-xs text-gray-500 font-medium">Ledger Balance</div>
              <div className="text-xl font-extrabold text-gray-900 mt-1">
                {formatCurrency(activeAccount.ledgerBalance, activeAccount.currency)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Double-Entry Cleared</div>
            </div>
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-gray-200">
              <div className="text-xs text-gray-500 font-medium">Branch & Routing</div>
              <div className="text-sm font-bold text-gray-900 mt-1 font-mono">{activeAccount.ifscCode}</div>
              <div className="text-[10px] text-gray-400 mt-1 truncate">{activeAccount.branchName}</div>
            </div>
          </div>

          {/* Account Activity Table */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              Recent Account Activity ({accountTransactions.length} records)
            </h4>
            <div className="divide-y divide-gray-100 border border-[#E8E8E8] rounded-2xl overflow-hidden">
              {accountTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No transaction records recorded for this account.
                </div>
              ) : (
                accountTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <div key={tx.transactionId} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#DB0011]'
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{tx.description}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {tx.transactionDate} • Ref: {tx.reference}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold ${
                            isCredit ? 'text-[#16864A]' : 'text-[#252525]'
                          }`}
                        >
                          {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
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
    </AnimatedPageTransition>
  );
};
