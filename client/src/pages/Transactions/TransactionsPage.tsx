import React, { useState } from 'react';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { TransactionRecord } from '@shared/types';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';

export const TransactionsPage: React.FC = () => {
  const { transactions, formatCurrency } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'7DAYS' | '30DAYS' | '3MONTHS' | 'ALL'>('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const anchorMs = transactions[0]?.createdAt ? new Date(transactions[0].createdAt).getTime() : Date.now();
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

    let matchesDate = true;
    if (dateRangeFilter !== 'ALL' && t.createdAt) {
      const txMs = new Date(t.createdAt).getTime();
      const diffDays = (anchorMs - txMs) / (1000 * 60 * 60 * 24);
      if (dateRangeFilter === '7DAYS') matchesDate = diffDays <= 7;
      else if (dateRangeFilter === '30DAYS') matchesDate = diffDays <= 30;
      else if (dateRangeFilter === '3MONTHS') matchesDate = diffDays <= 90;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const filteredNet = filtered.reduce(
    (sum, t) => sum + (t.transactionType === 'CREDIT' ? t.amount : -t.amount),
    0
  );

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
                Transaction Activity
              </h1>
              <p className="text-xs text-[#777777] mt-0.5">
                HSBC Premier Savings personal ledger · {filtered.length} transactions shown (Net{' '}
                <span className="font-semibold text-[#1f1f1f]">
                  {filteredNet >= 0 ? '+' : '-'}{formatCurrency(Math.abs(filteredNet))}
                </span>
                )
              </p>
            </div>
          </div>

          {/* Search & Date Filter Row */}
          <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search payee, description, reference..."
                aria-label="Search transactions"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#DB0011] transition-all shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {[
                { id: 'ALL' as const, label: 'All Dates' },
                { id: '7DAYS' as const, label: '7 Days' },
                { id: '30DAYS' as const, label: '30 Days' },
                { id: '3MONTHS' as const, label: '3 Months' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDateRangeFilter(tab.id)}
                  className={`min-h-[36px] px-4 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all active:scale-[0.98] ${
                    dateRangeFilter === tab.id
                      ? 'bg-[#DB0011] text-white shadow-xs'
                      : 'bg-[#F5F6F8] text-[#1f1f1f] hover:bg-[#EBECEF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Underline/Pill Filter */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'CREDIT', label: 'Credits' },
              { id: 'DEBIT', label: 'Debits' },
              { id: 'SALARY', label: 'Salary' },
              { id: 'TRANSFER', label: 'Transfers' },
              { id: 'INVESTMENT', label: 'Investments' },
              { id: 'DINING', label: 'Dining' },
              { id: 'UTILITIES', label: 'Bills' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 min-h-[32px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                    : 'bg-white text-[#555555] border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hairline List Rows */}
        <div className="px-4 sm:px-6 md:px-8 divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              No transactions match your search criteria.
            </div>
          ) : (
            filtered.map(tx => {
              const isCredit = tx.transactionType === 'CREDIT';
              return (
                <button
                  key={tx.transactionId}
                  type="button"
                  onClick={() => setSelectedTx(tx)}
                  className="w-full py-4 hover:bg-gray-50/70 cursor-pointer transition-colors flex items-center justify-between gap-3 text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shrink-0">
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5 text-[#16864A] stroke-[2]" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-[#DB0011] stroke-[2]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#1f1f1f] truncate">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-[#777777] mt-0.5 truncate">
                        {tx.counterpartyName} • {tx.transactionDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div className={`text-[14px] font-bold font-mono ${isCredit ? 'text-[#16864A]' : 'text-[#1f1f1f]'}`}>
                        {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase">
                        {tx.category}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1f1f1f] transition-colors" aria-hidden="true" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Receipt Dialog */}
      <ModalDialog
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Receipt"
        subtitle={selectedTx ? `ID: ${selectedTx.transactionId}` : ''}
        maxWidthClass="max-w-md"
      >
        {selectedTx && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-100">
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 ${
                  selectedTx.transactionType === 'CREDIT'
                    ? 'bg-emerald-50 text-[#16864A]'
                    : 'bg-red-50 text-[#DB0011]'
                }`}
              >
                <FileCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-[#1f1f1f]">
                {selectedTx.transactionType === 'CREDIT' ? '+' : '-'}{' '}
                {formatCurrency(selectedTx.amount, selectedTx.currency)}
              </div>
              <p className="text-xs text-[#777777] mt-1">{selectedTx.description}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-[#777777]">Status</span>
                <span className="font-bold text-[#16864A]">● {selectedTx.status}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#777777]">Date &amp; Time</span>
                <span className="font-semibold text-[#1f1f1f]">{selectedTx.transactionDate}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#777777]">Category</span>
                <span className="font-semibold text-[#1f1f1f]">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#777777]">Counterparty</span>
                <span className="font-semibold text-[#1f1f1f] text-right">{selectedTx.counterpartyName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#777777]">Reference Number</span>
                <span className="font-mono font-bold text-[#1f1f1f]">{selectedTx.reference}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        )}
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
