import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Transaction } from '../types';
import { api } from '../services/api';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { formatAmount, accounts, showReceipt, showToast } = useBanking();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<{ totalCount: number; totalCredits: number; totalDebits: number }>({
    totalCount: 0,
    totalCredits: 0,
    totalDebits: 0
  });

  // Filters
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('ALL');
  const [type, setType] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      const res = await api.getTransactions({
        search,
        category: category !== 'ALL' ? category : undefined,
        type: type || undefined,
        accountId: accountId !== 'ALL' ? accountId : undefined,
      });
      setTransactions(res.transactions);
      setStats(res.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load transaction history', 'error');
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [search, category, type, accountId]);

  const handleExportCsv = () => {
    let csv = 'Reference,Date,Counterparty,Type,Category,Amount,Currency,Status\n';
    transactions.forEach(t => {
      csv += `"${t.reference}","${t.created_at}","${t.counterparty_name}","${t.transaction_type}","${t.category}",${t.amount},"${t.currency}","${t.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `premier_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Transaction statement exported as CSV', 'success');
  };

  return (
    <div className="p-4 space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Title & Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-bank-text">Transaction History</h1>
          <p className="text-xs text-bank-muted">Audited Double-Entry Ledger Records</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold shadow-xs transition"
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Aggregate Statistics Header */}
      <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-bank-border shadow-card text-xs">
        <div>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">Total Inflow (Credits)</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            +{formatAmount(stats.totalCredits, 'GBP')}
          </div>
        </div>
        <div>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">Total Outflow (Debits)</span>
          <div className="text-base font-extrabold text-zinc-900 mt-0.5">
            -{formatAmount(stats.totalDebits, 'GBP')}
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by merchant, note, or reference code..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-bank-border bg-white text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'TRANSFER', label: 'Transfers' },
            { id: 'SALARY', label: 'Salary' },
            { id: 'UTILITIES', label: 'Utilities & Bills' },
            { id: 'DINING', label: 'Dining' },
            { id: 'SHOPPING', label: 'Shopping' },
            { id: 'INVESTMENT', label: 'Investments' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                category === c.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-bank-border text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-bank-border shadow-card divide-y divide-zinc-100 overflow-hidden text-xs">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-xs">
            No transactions found matching your criteria.
          </div>
        ) : (
          transactions.map(txn => {
            const isCredit = txn.transaction_type === 'SALARY' || txn.transaction_type === 'DEPOSIT_CREDIT' || txn.category === 'SALARY';

            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="p-3.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {isCredit ? '+' : '–'}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 leading-tight">{txn.counterparty_name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {new Date(txn.created_at).toLocaleDateString('en-GB')} • Ref: {txn.reference}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-black text-xs ${
                      isCredit ? 'text-emerald-700' : 'text-zinc-900'
                    }`}
                  >
                    {isCredit ? '+' : ''}
                    {formatAmount(txn.amount, txn.currency)}
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold">
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Transaction Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <div className="text-center py-2 border-b border-zinc-100">
              <span className="text-[11px] text-zinc-500">Amount</span>
              <div className="text-2xl font-extrabold text-bank-text mt-0.5">
                {formatAmount(selectedTxn.amount, selectedTxn.currency)}
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                COMPLETED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Counterparty:</span>
                <span className="font-bold text-zinc-900">{selectedTxn.counterparty_name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Reference:</span>
                <span className="font-mono font-medium text-zinc-800">{selectedTxn.reference}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="text-zinc-800">{new Date(selectedTxn.created_at).toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Category:</span>
                <span className="text-zinc-800">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Description:</span>
                <span className="text-zinc-800 text-right">{selectedTxn.description}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  showReceipt({
                    reference: selectedTxn.reference,
                    date: selectedTxn.created_at,
                    sourceAccountName: 'Premier Account',
                    sourceAccountNumber: '400515-89410291',
                    counterpartyName: selectedTxn.counterparty_name,
                    amount: selectedTxn.amount,
                    currency: selectedTxn.currency,
                    fee: selectedTxn.fee || 0,
                    tax: selectedTxn.tax || 0,
                    status: 'COMPLETED'
                  });
                  setSelectedTxn(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                View Full Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
