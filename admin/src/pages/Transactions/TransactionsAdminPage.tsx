import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const TransactionsAdminPage: React.FC = () => {
  const { customers, accounts, transactions, createTransaction } = useAdminStore();

  const [selectedCustomerUid, setSelectedCustomerUid] = useState(customers[0]?.uid || '');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.accountId || '');
  const [amount, setAmount] = useState('50000');
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [category, setCategory] = useState<'TRANSFER' | 'SALARY' | 'UTILITIES' | 'DINING' | 'SHOPPING' | 'INVESTMENT' | 'CHARGES' | 'CASH_WITHDRAWAL' | 'OTHER'>('TRANSFER');
  const [description, setDescription] = useState('Direct Administrative Ledger Credit');
  const [counterpartyName, setCounterpartyName] = useState('Central Reserve Clearing');
  const [reference, setReference] = useState('HSBC/ADM/' + Date.now().toString().slice(-6));
  const [updateBalance, setUpdateBalance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInjectModal, setShowInjectModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const customerAccounts = accounts.filter(a => a.ownerUid === selectedCustomerUid);
  const currentAccount = customerAccounts.find(a => a.accountId === selectedAccountId) || customerAccounts[0];

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a positive transaction amount');
      return;
    }
    if (!currentAccount) {
      toast.error('Please select an account');
      return;
    }

    setIsSubmitting(true);
    const res = await createTransaction(
      {
        ownerUid: selectedCustomerUid,
        accountId: currentAccount.accountId,
        category,
        description,
        amount: numAmount,
        currency: currentAccount.currency,
        transactionType: type,
        status: 'COMPLETED',
        reference,
        counterpartyName,
        transactionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      updateBalance
    );
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Transaction record injected and account balance updated!');
      setShowInjectModal(false);
      setReference('HSBC/ADM/' + Date.now().toString().slice(-6));
    } else {
      toast.error(res.error || 'Failed to create transaction');
    }
  };

  const filtered = transactions.filter(
    t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Transaction Manager & Ledger Injection
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Audit ledger transactions, create manual credit/debit records, and atomically update balances
          </p>
        </div>
        <button
          onClick={() => setShowInjectModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Inject Transaction Record</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by description, reference ID, or counterparty..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#252525] placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#555555]">
            <thead className="bg-[#F9F9F9] text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#E8E8E8] font-bold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description & Ref</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filtered.map(tx => {
                const isCredit = tx.transactionType === 'CREDIT';
                return (
                  <tr key={tx.transactionId} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-[#777777] font-medium">
                      {tx.transactionDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCredit
                            ? 'bg-emerald-50 text-[#16864A] border border-emerald-200'
                            : 'bg-red-50 text-[#DB0011] border border-red-200'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#252525]">{tx.description}</div>
                      <div className="text-[10px] text-[#777777] font-mono mt-0.5">Ref: {tx.reference}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#252525]">{tx.counterpartyName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-[#555555]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      <span className={isCredit ? 'text-[#16864A]' : 'text-[#252525]'}>
                        {isCredit ? '+' : '-'}{formatINR(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Injection Modal */}
      {showInjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2 text-[#DB0011]">
                <ArrowLeftRight className="w-5 h-5" />
                <h3 className="text-base font-black text-[#252525]">Inject Core Banking Transaction</h3>
              </div>
              <button
                onClick={() => setShowInjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Customer</label>
                  <select
                    value={selectedCustomerUid}
                    onChange={e => {
                      setSelectedCustomerUid(e.target.value);
                      const f = accounts.find(a => a.ownerUid === e.target.value);
                      if (f) setSelectedAccountId(f.accountId);
                    }}
                    className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl font-semibold"
                  >
                    {customers.map(c => (
                      <option key={c.uid} value={c.uid}>
                        {c.displayName} ({c.customerId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Target Account</label>
                  <select
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl font-semibold"
                  >
                    {customerAccounts.map(a => (
                      <option key={a.accountId} value={a.accountId}>
                        {a.accountType} ({a.maskedAccountNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('CREDIT')}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        type === 'CREDIT'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-[#777777]'
                      }`}
                    >
                      Credit (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('DEBIT')}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        type === 'DEBIT'
                          ? 'bg-[#DB0011] text-white'
                          : 'bg-gray-100 text-[#777777]'
                      }`}
                    >
                      Debit (-)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl font-black text-[#252525]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl"
                  placeholder="e.g. Dividend Payout / Inward Clearing"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Counterparty</label>
                  <input
                    type="text"
                    required
                    value={counterpartyName}
                    onChange={e => setCounterpartyName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-gray-50 border border-[#E8E8E8] rounded-xl font-semibold"
                  >
                    <option value="TRANSFER">Transfer</option>
                    <option value="SALARY">Salary</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="DINING">Dining</option>
                    <option value="SHOPPING">Shopping</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="CHARGES">Charges</option>
                    <option value="CASH_WITHDRAWAL">Cash Withdrawal</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#252525] block">Atomic Balance Update</span>
                  <span className="text-[10px] text-[#777777]">
                    Automatically recalculate and update customer managed balance
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={updateBalance}
                  onChange={e => setUpdateBalance(e.target.checked)}
                  className="w-4 h-4 text-[#DB0011] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setShowInjectModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs"
                >
                  {isSubmitting ? 'Injecting...' : 'Inject Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
