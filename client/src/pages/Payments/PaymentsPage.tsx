import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, ShieldAlert, Send, Building2 } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const { accounts, submitTransfer, formatCurrency } = useBanking();
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.accountId || '');
  const [recipientName, setRecipientName] = useState('Rajesh Kumar');
  const [recipientAccount, setRecipientAccount] = useState('50100492819201');
  const [recipientBank, setRecipientBank] = useState('HDFC Bank Ltd');
  const [ifscCode, setIfscCode] = useState('HDFC0000060');
  const [amount, setAmount] = useState('25000');
  const [category, setCategory] = useState('TRANSFER');
  const [reference, setReference] = useState('TXN/NEFT/' + Date.now().toString().slice(-6));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = accounts.find(a => a.accountId === sourceAccountId) || accounts[0];

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid transfer amount');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance');
      return;
    }

    setIsSubmitting(true);
    const res = await submitTransfer(sourceAccountId, {
      recipientName,
      recipientAccount,
      recipientBank,
      ifscCode,
      amount: numAmount,
      reference,
      category,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Transfer executed successfully! Ledger and account balance updated.');
      setReference('TXN/NEFT/' + Date.now().toString().slice(-6));
    } else {
      toast.error(res.error || 'Payment execution failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
          Send Money & Domestic Transfers
        </h2>
        <p className="text-xs text-gray-500">
          Execute instant domestic NEFT/IMPS transfers with atomic balance ledger updates
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <form onSubmit={handleTransfer} className="space-y-5">
          {/* Source Account */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Transfer From
            </label>
            <select
              value={sourceAccountId}
              onChange={e => setSourceAccountId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.accountType} ({acc.maskedAccountNumber}) — Available: {formatCurrency(acc.managedBalance, acc.currency)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Amount (INR ₹)
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Beneficiary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Beneficiary Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                required
                value={recipientAccount}
                onChange={e => setRecipientAccount(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Destination Bank
              </label>
              <input
                type="text"
                required
                value={recipientBank}
                onChange={e => setRecipientBank(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                required
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Payment Reference
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={e => setReference(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#DB0011] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Confirm & Send Payment</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
