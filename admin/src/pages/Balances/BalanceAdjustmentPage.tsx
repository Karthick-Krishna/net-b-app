import React, { useState } from 'react';
import {
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  Search,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Building2,
  X,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const BalanceAdjustmentPage: React.FC = () => {
  const { customers, accounts, adjustBalance } = useAdminStore();

  const [selectedCustomerUid, setSelectedCustomerUid] = useState(customers[0]?.uid || '');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.accountId || '');
  const [newBalance, setNewBalance] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const customerAccounts = accounts.filter(a => a.ownerUid === selectedCustomerUid);
  const currentAccount = customerAccounts.find(a => a.accountId === selectedAccountId) || customerAccounts[0];
  const selectedCustomer = customers.find(c => c.uid === selectedCustomerUid);

  const parsedNewBalance = parseFloat(newBalance);
  const currentBal = currentAccount?.managedBalance || 0;
  const balanceDiff = !isNaN(parsedNewBalance) ? parsedNewBalance - currentBal : 0;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(parsedNewBalance) || parsedNewBalance < 0) {
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
      parsedNewBalance,
      adjustmentReason.trim()
    );
    setIsSubmitting(false);
    setShowConfirmModal(false);

    if (res.success) {
      toast.success(
        `Balance updated to ${formatINR(parsedNewBalance)} and synchronized with Client (Port 4000)!`
      );
      setNewBalance('');
      setAdjustmentReason('');
    } else {
      toast.error(res.error || 'Balance adjustment failed.');
    }
  };

  const applyPresetDiff = (delta: number) => {
    const updated = Math.max(0, currentBal + delta);
    setNewBalance(updated.toString());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
              Administrative Balance Overrides
            </h2>
            <p className="text-xs text-[#777777] mt-0.5">
              Direct balance modifications with immutable compliance auditing and instant real-time sync
            </p>
          </div>
        </div>
      </div>

      {/* Main Adjustment Card */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-card space-y-6">
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          {/* Step 1: Customer Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-2">
              1. Select Customer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customers.map(c => {
                const isSelected = c.uid === selectedCustomerUid;
                return (
                  <div
                    key={c.uid}
                    onClick={() => {
                      setSelectedCustomerUid(c.uid);
                      const firstAcc = accounts.find(a => a.ownerUid === c.uid);
                      if (firstAcc) setSelectedAccountId(firstAcc.accountId);
                    }}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'border-[#DB0011] bg-red-50/50 shadow-xs ring-1 ring-red-200'
                        : 'border-[#E8E8E8] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#252525]">{c.displayName}</div>
                      <span className="font-mono text-[10px] text-[#DB0011] font-bold">{c.customerId}</span>
                    </div>
                    <div className="text-[11px] text-[#777777] mt-1">{c.email}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Account Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-2">
              2. Select Bank Account to Adjust
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customerAccounts.map(acc => {
                const isSelected = acc.accountId === currentAccount?.accountId;
                return (
                  <div
                    key={acc.accountId}
                    onClick={() => setSelectedAccountId(acc.accountId)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'border-[#DB0011] bg-red-50/50 shadow-xs ring-1 ring-red-200'
                        : 'border-[#E8E8E8] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#252525]">{acc.accountType}</span>
                      <span className="font-mono text-[11px] text-[#777777]">{acc.maskedAccountNumber}</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[10px] text-[#777777] uppercase font-semibold">Current Balance</span>
                      <span className="text-sm font-black text-[#252525]">
                        {formatINR(acc.managedBalance)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Current vs New Balance */}
          {currentAccount && (
            <div className="bg-[#F9F9F9] p-5 rounded-2xl border border-[#E8E8E8] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current */}
                <div className="p-4 bg-white rounded-xl border border-[#E8E8E8]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                    Current Managed Balance
                  </span>
                  <div className="text-xl font-black text-[#252525] mt-1">
                    {formatINR(currentAccount.managedBalance)}
                  </div>
                  <div className="text-[10px] text-[#777777] mt-1 font-mono">
                    Account: {currentAccount.accountNumber}
                  </div>
                </div>

                {/* Target */}
                <div className="p-4 bg-white rounded-xl border border-[#E8E8E8]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                    New Target Managed Balance
                  </span>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#777777]">₹</span>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="0.00"
                      value={newBalance}
                      onChange={e => setNewBalance(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-[#E8E8E8] rounded-lg text-sm font-black text-[#252525] focus:outline-none focus:border-[#DB0011]"
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => applyPresetDiff(100000)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#252525] rounded text-[10px] font-bold"
                    >
                      +₹1 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDiff(500000)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#252525] rounded text-[10px] font-bold"
                    >
                      +₹5 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDiff(-50000)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#252525] rounded text-[10px] font-bold"
                    >
                      -₹50,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewBalance(currentAccount.managedBalance.toString())}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#777777] rounded text-[10px]"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Diff Preview */}
              {!isNaN(parsedNewBalance) && newBalance !== '' && (
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  balanceDiff > 0
                    ? 'bg-emerald-50 text-[#16864A] border-emerald-200'
                    : balanceDiff < 0
                    ? 'bg-red-50 text-[#DB0011] border-red-200'
                    : 'bg-gray-100 text-[#777777] border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {balanceDiff > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : balanceDiff < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>
                      {balanceDiff > 0
                        ? `Net Balance Increase (Credit Adjustment)`
                        : balanceDiff < 0
                        ? `Net Balance Decrease (Debit Adjustment)`
                        : 'No Net Change'}
                    </span>
                  </div>
                  <span className="font-mono text-sm">
                    {balanceDiff >= 0 ? '+' : ''}{formatINR(balanceDiff)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Mandatory Audit Reason */}
          <div>
            <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1.5">
              4. Mandatory Regulatory Justification & Audit Reason *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Approved high-net-worth liquidity adjustment per relationship manager request / Inward wire clearing"
              value={adjustmentReason}
              onChange={e => setAdjustmentReason(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs text-[#252525] focus:outline-none focus:border-[#DB0011]"
            />
            <p className="text-[10px] text-[#777777] mt-1">
              Minimum 5 characters. This text is permanently stored in the immutable compliance audit log.
            </p>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Review & Authorize Balance Modification</span>
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && currentAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-[#E8E8E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2 text-[#DB0011]">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-black text-[#252525]">Authorize Executive Ledger Override</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-red-50/70 rounded-xl border border-red-200 text-[#B0000D] leading-relaxed">
                <strong>Attention:</strong> You are about to directly override an account balance in the HSBC India Core Banking Ledger. This will immediately update the live customer dashboard on Port 4000.
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-[#E8E8E8]">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Customer Name:</span>
                  <span className="font-bold text-[#252525]">{selectedCustomer?.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Account Number:</span>
                  <span className="font-mono text-[#252525]">{currentAccount.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Previous Balance:</span>
                  <span className="font-mono text-[#252525]">{formatINR(currentAccount.managedBalance)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#E8E8E8]">
                  <span className="text-[#252525]">New Authorized Balance:</span>
                  <span className="text-[#DB0011] font-mono">{formatINR(parsedNewBalance)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-[#777777]">Net Variance:</span>
                  <span className={`font-mono font-bold ${balanceDiff >= 0 ? 'text-[#16864A]' : 'text-[#DB0011]'}`}>
                    {balanceDiff >= 0 ? '+' : ''}{formatINR(balanceDiff)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-[#777777] block mb-1">
                  Recorded Justification:
                </span>
                <div className="p-2.5 bg-gray-50 rounded-lg text-[#252525] border border-[#E8E8E8] italic">
                  "{adjustmentReason}"
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 border border-[#E8E8E8] rounded-xl font-bold text-[#777777] hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteAdjustment}
                className="px-5 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                {isSubmitting ? 'Recording Mutation...' : 'Confirm & Commit Balance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
