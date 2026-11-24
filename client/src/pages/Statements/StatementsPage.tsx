import React, { useState } from 'react';
import { FileText, Download, Printer, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';

export const StatementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { accounts, transactions, formatCurrency } = useBanking();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.accountId || '');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');

  const account = accounts.find(a => a.accountId === selectedAccount) || accounts[0];
  const accountTxs = transactions.filter(t => t.accountId === account?.accountId);

  const totalCredits = accountTxs
    .filter(t => t.transactionType === 'CREDIT')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalDebits = accountTxs
    .filter(t => t.transactionType === 'DEBIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
            Account Statements & Financial Reports
          </h2>
          <p className="text-xs text-gray-500">
            Generate and export official application-managed financial records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#DB0011] text-white rounded-lg text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center print:hidden">
        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Select Account</label>
          <select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-xs"
          >
            {accounts.map(acc => (
              <option key={acc.accountId} value={acc.accountId}>
                {acc.accountType} ({acc.maskedAccountNumber}) — {formatCurrency(acc.managedBalance, acc.currency)}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Statement Period</label>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-xs"
          >
            <option value="LAST_30_DAYS">Current Month / Last 30 Days</option>
            <option value="LAST_90_DAYS">Last Quarter (90 Days)</option>
            <option value="FINANCIAL_YEAR">Current Financial Year (2026-27)</option>
          </select>
        </div>
      </div>

      {/* Formatted Statement Paper */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-card print:border-none print:shadow-none print:p-0 space-y-6">
        {/* Statement Header */}
        <div className="flex justify-between items-start pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#DB0011] rounded flex items-center justify-center text-white font-extrabold text-lg">
                P
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">PREMIER DIGITAL BANKING</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                  Account Activity Statement
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-600 space-y-0.5">
              <div>Customer: <strong>{currentUser?.displayName}</strong></div>
              <div>Customer ID: <strong className="font-mono">{currentUser?.customerId}</strong></div>
              <div>Registered Address: {currentUser?.address}, {currentUser?.city}</div>
            </div>
          </div>

          <div className="text-right text-xs text-gray-600 space-y-0.5">
            <div>Branch: <strong>{account?.branchName}</strong></div>
            <div>Account No: <strong className="font-mono">{account?.accountNumber}</strong></div>
            <div>IFSC Code: <strong className="font-mono">{account?.ifscCode}</strong></div>
            <div>Statement Date: <strong>{new Date().toISOString().split('T')[0]}</strong></div>
          </div>
        </div>

        {/* Regulatory Disclaimer Notice */}
        <div className="bg-red-50/60 p-3 rounded-lg border border-red-200 text-[11px] text-[#B0000D] leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Application-Managed Record:</strong> This document is generated from an independently managed demonstration digital banking platform. All records and balances are simulated platform records.
          </span>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl text-xs">
          <div>
            <span className="text-gray-500 block">Closing Managed Balance</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(account?.managedBalance || 0, account?.currency)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">General Ledger Balance</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(account?.ledgerBalance || 0, account?.currency)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Period Total Credits</span>
            <span className="text-sm font-bold text-emerald-600">+{formatCurrency(totalCredits, account?.currency)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Period Total Debits</span>
            <span className="text-sm font-bold text-gray-900">-{formatCurrency(totalDebits, account?.currency)}</span>
          </div>
        </div>

        {/* Statement Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Description & Reference</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5 text-right">Debit</th>
                <th className="py-2.5 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accountTxs.map(tx => {
                const isCredit = tx.transactionType === 'CREDIT';
                return (
                  <tr key={tx.transactionId} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-600 whitespace-nowrap">{tx.transactionDate}</td>
                    <td className="py-3">
                      <div className="font-semibold text-gray-900">{tx.description}</div>
                      <div className="text-[10px] text-gray-400 font-mono">Ref: {tx.reference}</div>
                    </td>
                    <td className="py-3 text-gray-600">{tx.category}</td>
                    <td className="py-3 text-right font-mono text-gray-900">
                      {!isCredit ? formatCurrency(tx.amount, tx.currency) : '-'}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-600">
                      {isCredit ? '+' + formatCurrency(tx.amount, tx.currency) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
