import React, { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, Search, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const BalanceAdjustmentPage: React.FC = () => {
  const { customers, accounts, adjustBalance, formatCurrency } = useAdminStore();

  const [selectedCustomerUid, setSelectedCustomerUid] = useState(customers[0]?.uid || '');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.accountId || '');
  const [newBalance, setNewBalance] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const customerAccounts = accounts.filter(a => a.ownerUid === selectedCustomerUid);
  const currentAccount = customerAccounts.find(a => a.accountId === selectedAccountId) || customerAccounts[0];
  const selectedCustomer = customers.find(c => c.uid === selectedCustomerUid);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBalance);
    if (isNaN(val) || val < 0) {
      toast.error('Please enter a valid, non-negative balance.');
      return;
    }
    if (adjustmentReason.trim().length < 5) {
      toast.error('A clear business adjustment reason is mandatory (minimum 5 characters).');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteAdjustment = async () => {
    if (!currentAccount) return;
    setIsSubmitting(true);
    const res = await adjustBalance(
      currentAccount.accountId,
      parseFloat(newBalance),
      adjustmentReason.trim()
    );
    setIsSubmitting(false);
    setShowConfirmModal(false);

    if (res.success) {
      toast.success(
        `Balance updated to ${formatCurrency(parseFloat(newBalance), currentAccount.currency)} and synchronized with Client.`
      );
      setNewBalance('');
      setAdjustmentReason('');
    } else {
      toast.error(res.error || 'Balance adjustment failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Admin-Controlled Account Balances
            </h2>
            <p className="text-xs text-slate-400">
              Direct administrative balance override with immutable audit logging and instant real-time synchronization
            </p>
          </div>
        </div>
      </div>

      {/* Main Adjustment Card */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          {/* Step 1: Customer Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Target Customer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customers.map(c => {
                const isSelected = c.uid === selectedCustomerUid;
                return (
                  <div
                    key={c.uid}
                    onClick={() => {
                      setSelectedCustomerUid(c.uid);
                      const accs = accounts.filter(a => a.ownerUid === c.uid);
                      if (accs.length > 0) setSelectedAccountId(accs[0].accountId);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-950/30 border-[#DB0011] text-white ring-1 ring-[#DB0011]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{c.displayName}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {c.customerId} • {c.email}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Account Selection */}
          {customerAccounts.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Select Account to Override
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {customerAccounts.map(acc => {
                  const isSelected = acc.accountId === (currentAccount?.accountId || selectedAccountId);
                  return (
                    <div
                      key={acc.accountId}
                      onClick={() => setSelectedAccountId(acc.accountId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-red-950/30 border-[#DB0011] text-white ring-1 ring-[#DB0011]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                        {acc.accountType}
                      </div>
                      <div className="text-xs font-mono text-slate-300 mt-1">{acc.maskedAccountNumber}</div>
                      <div className="text-base font-extrabold text-white mt-2">
                        {formatCurrency(acc.managedBalance, acc.currency)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Current Balance</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Balance Display */}
          {currentAccount && (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Active Managed Balance:</span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {formatCurrency(currentAccount.managedBalance, currentAccount.currency)}
                </div>
              </div>
              <div>
                <span className="text-slate-400">General Ledger Cleared Balance:</span>
                <div className="text-lg font-bold text-slate-300 mt-0.5">
                  {formatCurrency(currentAccount.ledgerBalance, currentAccount.currency)}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Enter New Managed Balance */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              3. New Managed Available Balance (INR ₹)
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              placeholder="e.g. 500000.00"
              value={newBalance}
              onChange={e => setNewBalance(e.target.value)}
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
            />
          </div>

          {/* Step 4: Mandatory Adjustment Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              4. Mandatory Business & Regulatory Reason (Audit Trail)
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Approved credit facility enhancement, relationship reward adjustment, inward overseas clearing reconciliation..."
              value={adjustmentReason}
              onChange={e => setAdjustmentReason(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              This reason will be permanently recorded in the immutable audit log and cannot be deleted.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Preview & Apply Balance Adjustment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && currentAccount && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Confirm Balance Override</h3>
            </div>

            <div className="space-y-2 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Customer:</span>
                <span className="font-bold text-white">{selectedCustomer?.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account:</span>
                <span className="font-mono text-white">{currentAccount.maskedAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Previous Balance:</span>
                <span className="font-mono text-slate-400">{formatCurrency(currentAccount.managedBalance, currentAccount.currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                <span className="text-emerald-400">New Balance:</span>
                <span className="text-emerald-400">{formatCurrency(parseFloat(newBalance), currentAccount.currency)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <strong className="text-white">Reason:</strong> {adjustmentReason}
            </div>

            <div className="text-[11px] text-slate-400 bg-red-950/40 p-3 rounded-lg border border-red-800/40">
              This action executes an atomic database transaction. The customer's client dashboard on Port 4000 will update immediately without page refresh.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteAdjustment}
                className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Synchronizing...' : 'Authorize & Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
