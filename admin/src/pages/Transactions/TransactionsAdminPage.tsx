import React, { useState } from 'react';
import { ArrowLeftRight, Plus, CheckCircle2, ShieldCheck, Filter, Search } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const TransactionsAdminPage: React.FC = () => {
  const { customers, accounts, transactions, createTransaction, formatCurrency } = useAdminStore();

  const [selectedCustomerUid, setSelectedCustomerUid] = useState(customers[0]?.uid || '');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.accountId || '');
  const [amount, setAmount] = useState('50000');
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [category, setCategory] = useState<'TRANSFER' | 'SALARY' | 'UTILITIES' | 'DINING' | 'SHOPPING' | 'INVESTMENT' | 'CHARGES' | 'CASH_WITHDRAWAL' | 'OTHER'>('TRANSFER');
  const [description, setDescription] = useState('Direct Administrative Ledger Credit');
  const [counterpartyName, setCounterpartyName] = useState('Central Reserve Clearing');
  const [reference, setReference] = useState('TXN/ADM/' + Date.now().toString().slice(-6));
  const [updateBalance, setUpdateBalance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInjectModal, setShowInjectModal] = useState(false);

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
      setReference('TXN/ADM/' + Date.now().toString().slice(-6));
    } else {
      toast.error(res.error || 'Failed to create transaction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Transaction Manager & Ledger Injection
          </h2>
          <p className="text-xs text-slate-400">
            Create credit/debit records, assign reference numbers, and atomically adjust customer balances
          </p>
        </div>
        <button
          onClick={() => setShowInjectModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Inject Transaction Record</span>
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            All System Transactions ({transactions.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map(tx => {
                const isCredit = tx.transactionType === 'CREDIT';
                return (
                  <tr key={tx.transactionId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">{tx.transactionDate}</td>
                    <td className="py-3 px-4 font-semibold text-white">{tx.description}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.accountId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCredit ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{tx.category}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{tx.reference}</td>
                    <td className={`py-3 px-4 text-right font-bold font-mono ${isCredit ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inject Modal */}
      {showInjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white">
            <h3 className="text-base font-bold text-white">Inject Manual Transaction Record</h3>
            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Customer</label>
                  <select
                    value={selectedCustomerUid}
                    onChange={e => {
                      setSelectedCustomerUid(e.target.value);
                      const accs = accounts.filter(a => a.ownerUid === e.target.value);
                      if (accs.length > 0) setSelectedAccountId(accs[0].accountId);
                    }}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    {customers.map(c => (
                      <option key={c.uid} value={c.uid}>{c.displayName} ({c.customerId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Account</label>
                  <select
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    {customerAccounts.map(a => (
                      <option key={a.accountId} value={a.accountId}>{a.accountType} ({a.maskedAccountNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Entry Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('CREDIT')}
                      className={`p-2 rounded-lg font-bold text-center ${
                        type === 'CREDIT' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      CREDIT (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('DEBIT')}
                      className={`p-2 rounded-lg font-bold text-center ${
                        type === 'DEBIT' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      DEBIT (-)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Amount (INR ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Counterparty Name</label>
                  <input
                    type="text"
                    required
                    value={counterpartyName}
                    onChange={e => setCounterpartyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="TRANSFER">Transfers & Remittance</option>
                    <option value="SALARY">Salary & Compensation</option>
                    <option value="INVESTMENT">Investment & Wealth</option>
                    <option value="DINING">Dining & Hospitality</option>
                    <option value="UTILITIES">Utilities & Charges</option>
                    <option value="OTHER">Other Adjustment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Reference ID</label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={updateBalance}
                  onChange={e => setUpdateBalance(e.target.checked)}
                  className="rounded border-slate-700 text-[#DB0011] focus:ring-[#DB0011]"
                />
                <span className="text-slate-300">
                  Atomically adjust target account available balance (+/-)
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] rounded-lg font-bold"
                >
                  {isSubmitting ? 'Posting...' : 'Post Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
