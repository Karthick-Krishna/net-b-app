import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Calendar,
  X,
  FileCheck,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { TransactionRecord } from '@shared/types';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';

export const TransactionsPage: React.FC = () => {
  const { transactions, formatCurrency } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'7DAYS' | '30DAYS' | '3MONTHS' | 'ALL'>('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'CREDIT' && t.transactionType === 'CREDIT') ||
      (categoryFilter === 'DEBIT' && t.transactionType === 'DEBIT') ||
      t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
            Transaction Activity & Ledger
          </h2>
          <p className="text-xs text-[#777777]">
            Real-time financial movement synchronized with the central banking ledger
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchant, recipient, reference..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DB0011] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Date range filter buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'ALL', label: 'All Dates' },
              { id: '7DAYS', label: 'Last 7 Days' },
              { id: '30DAYS', label: 'Last 30 Days' },
              { id: '3MONTHS', label: 'Last 3 Months' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDateRangeFilter(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  dateRangeFilter === tab.id
                    ? 'bg-[#DB0011] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'CREDIT', label: 'Money In (Credits)' },
            { id: 'DEBIT', label: 'Money Out (Debits)' },
            { id: 'SALARY', label: 'Salary' },
            { id: 'TRANSFER', label: 'Transfers' },
            { id: 'INVESTMENT', label: 'Investments' },
            { id: 'DINING', label: 'Dining' },
            { id: 'UTILITIES', label: 'Bills & Utilities' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-card overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No transactions match your search criteria.
            </div>
          ) : (
            filtered.map(tx => {
              const isCredit = tx.transactionType === 'CREDIT';
              return (
                <div
                  key={tx.transactionId}
                  onClick={() => setSelectedTx(tx)}
                  className="p-4 sm:p-5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCredit ? 'bg-emerald-50 text-[#16864A]' : 'bg-red-50 text-[#DB0011]'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{tx.description}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>{tx.counterpartyName}</span>
                        <span>•</span>
                        <span className="font-mono text-gray-400">{tx.reference}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{tx.transactionDate}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-extrabold ${
                        isCredit ? 'text-[#16864A]' : 'text-[#252525]'
                      }`}
                    >
                      {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {tx.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Details Modal / Bottom Sheet */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-5 border-b border-gray-100">
              <div
                className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 ${
                  selectedTx.transactionType === 'CREDIT'
                    ? 'bg-emerald-50 text-[#16864A]'
                    : 'bg-red-50 text-[#DB0011]'
                }`}
              >
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Transaction Receipt</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedTx.transactionId}</p>
              <div className="mt-3 text-3xl font-extrabold text-gray-900">
                {selectedTx.transactionType === 'CREDIT' ? '+' : '-'}{' '}
                {formatCurrency(selectedTx.amount, selectedTx.currency)}
              </div>
            </div>

            <div className="py-5 space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-[#16864A] flex items-center gap-1">
                  ● {selectedTx.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-semibold text-gray-900">{selectedTx.transactionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-900">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Counterparty</span>
                <span className="font-semibold text-gray-900">{selectedTx.counterpartyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference Number</span>
                <span className="font-mono font-bold text-gray-900">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Originating Account</span>
                <span className="font-mono text-gray-900">{selectedTx.accountId}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Print Official Platform Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
