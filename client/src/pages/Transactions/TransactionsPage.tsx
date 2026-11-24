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
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { TransactionRecord } from '@shared/types';

export const TransactionsPage: React.FC = () => {
  const { transactions, formatCurrency } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.transactionType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
            Transaction Activity & Ledger
          </h2>
          <p className="text-xs text-gray-500">
            Real-time atomic records synchronized with central administrative ledger
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search merchant, recipient, reference..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'CREDIT', 'DEBIT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 sm:flex-initial ${
                typeFilter === tab
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'ALL' ? 'All Activity' : tab === 'CREDIT' ? 'Money In' : 'Money Out'}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No transactions match your search criteria.
            </div>
          ) : (
            filtered.map(tx => {
              const isCredit = tx.transactionType === 'CREDIT';
              return (
                <div
                  key={tx.transactionId}
                  onClick={() => setSelectedTx(tx)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#DB0011]'
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
                      className={`text-sm font-bold ${
                        isCredit ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {tx.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Detail Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-gray-100">
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${
                  selectedTx.transactionType === 'CREDIT'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-[#DB0011]'
                }`}
              >
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Transaction Receipt</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedTx.transactionId}</p>
              <div className="mt-3 text-2xl font-extrabold text-gray-900">
                {selectedTx.transactionType === 'CREDIT' ? '+' : '-'}{' '}
                {formatCurrency(selectedTx.amount, selectedTx.currency)}
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-emerald-600">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-medium text-gray-900">{selectedTx.transactionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Counterparty</span>
                <span className="font-medium text-gray-900">{selectedTx.counterpartyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono text-gray-900">{selectedTx.reference}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 bg-[#DB0011] text-white rounded-lg text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Print Official Platform Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
