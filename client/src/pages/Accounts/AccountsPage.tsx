import React, { useState } from 'react';
import { Building2, ArrowUpRight, ArrowDownLeft, FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useNavigate } from 'react-router-dom';

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions, formatCurrency } = useBanking();
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.accountId || '');

  const activeAccount = accounts.find(a => a.accountId === selectedAccount) || accounts[0];
  const accountTransactions = transactions.filter(t => t.accountId === activeAccount?.accountId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
            Accounts & Deposit Portfolios
          </h2>
          <p className="text-xs text-gray-500">
            Managed account balances, transaction records, and account statements
          </p>
        </div>
        <button
          onClick={() => navigate('/statements')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          <span>Generate Statement</span>
        </button>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const isSelected = acc.accountId === activeAccount?.accountId;
          return (
            <div
              key={acc.accountId}
              onClick={() => setSelectedAccount(acc.accountId)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-white border-[#DB0011] shadow-md ring-2 ring-red-100'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#DB0011]">
                  {acc.accountType}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {acc.accountStatus}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xs text-gray-500 font-mono">{acc.maskedAccountNumber}</div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {formatCurrency(acc.managedBalance, acc.currency)}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-[11px] text-gray-500">
                <span>IFSC: {acc.ifscCode}</span>
                <span className="font-semibold text-[#DB0011]">Select &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Account Details View */}
      {activeAccount && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-gray-100 gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {activeAccount.accountType === 'SAVINGS'
                  ? 'Premier Savings Account'
                  : activeAccount.accountType === 'CURRENT'
                  ? 'Business Current Account'
                  : 'Corporate Salary Account'}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Full Account Number: {activeAccount.accountNumber} • Branch: {activeAccount.branchName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/payments')}
                className="px-4 py-2 bg-[#DB0011] text-white text-xs font-bold rounded-lg hover:bg-[#B0000D] transition-colors"
              >
                Make Payment
              </button>
            </div>
          </div>

          {/* Balance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500">Managed Available Balance</div>
              <div className="text-xl font-extrabold text-gray-900 mt-1">
                {formatCurrency(activeAccount.managedBalance, activeAccount.currency)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Real-time Admin-Controlled</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500">General Ledger Cleared Balance</div>
              <div className="text-xl font-extrabold text-gray-900 mt-1">
                {formatCurrency(activeAccount.ledgerBalance, activeAccount.currency)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Double-Entry Reconciled</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500">Branch & Routing</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{activeAccount.ifscCode}</div>
              <div className="text-[10px] text-gray-400 mt-1">{activeAccount.branchName}</div>
            </div>
          </div>

          {/* Transactions for this account */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              Account Activity ({accountTransactions.length} records)
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {accountTransactions.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No transaction records for this account
                </div>
              ) : (
                accountTransactions.map(tx => {
                  const isCredit = tx.transactionType === 'CREDIT';
                  return (
                    <div key={tx.transactionId} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                            isCredit ? 'text-emerald-600' : 'text-gray-900'
                          }`}
                        >
                          {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded">
                          {tx.status}
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
    </div>
  );
};
