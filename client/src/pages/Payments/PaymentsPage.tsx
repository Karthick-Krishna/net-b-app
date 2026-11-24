import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  ShieldAlert,
  Send,
  Building2,
  Users,
  Globe2,
  Zap,
  Droplets,
  Flame,
  Smartphone,
  Wifi,
  CreditCard,
  Shield,
  GraduationCap,
  MoreHorizontal,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BILL_CATEGORIES } from '@shared/constants';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const { accounts, submitTransfer, formatCurrency } = useBanking();

  // Mode: Transfers vs Bill Payment
  const [activeTab, setActiveTab] = useState<'TRANSFER' | 'BILL_PAY'>('TRANSFER');

  // Transfer Step-by-Step State
  const [transferStep, setTransferStep] = useState<number>(1);
  const [transferType, setTransferType] = useState<'OWN' | 'SAVED' | 'NEW' | 'INTERNATIONAL'>('SAVED');
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.accountId || '');
  const [recipientName, setRecipientName] = useState('Rajesh Kumar');
  const [recipientAccount, setRecipientAccount] = useState('50100492819201');
  const [recipientBank, setRecipientBank] = useState('HDFC Bank Ltd');
  const [ifscCode, setIfscCode] = useState('HDFC0000060');
  const [amount, setAmount] = useState('25000');
  const [category, setCategory] = useState('TRANSFER');
  const [reference, setReference] = useState('TXN/NEFT/' + Date.now().toString().slice(-6));
  const [description, setDescription] = useState('Consulting & Retainer Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bill Pay State
  const [selectedBillCategory, setSelectedBillCategory] = useState<string>('ELECTRICITY');
  const [billerProvider, setBillerProvider] = useState('Tata Power - Mumbai Distribution');
  const [consumerNumber, setConsumerNumber] = useState('90001249821');
  const [billAmount, setBillAmount] = useState('4250');

  const selectedAccount = accounts.find(a => a.accountId === sourceAccountId) || accounts[0];

  const handleExecuteTransfer = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid transfer amount');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance in selected account');
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
      note: description,
    });
    setIsSubmitting(false);

    if (res.success) {
      setTransferStep(6); // Confirmation screen
      toast.success('Transfer executed successfully!');
    } else {
      toast.error(res.error || 'Payment execution failed');
    }
  };

  const handleExecuteBillPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(billAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }
    setIsSubmitting(true);
    const res = await submitTransfer(sourceAccountId, {
      recipientName: billerProvider,
      recipientAccount: consumerNumber,
      recipientBank: 'Utility Aggregator Gateway',
      ifscCode: 'HSBC0400002',
      amount: numAmount,
      reference: 'BILL/' + Date.now().toString().slice(-6),
      category: 'UTILITIES',
      note: `Bill Payment - ${selectedBillCategory}`,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(`Bill payment of ${formatCurrency(numAmount, 'INR')} processed successfully!`);
    } else {
      toast.error(res.error || 'Bill payment failed');
    }
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
            Payments & Transfers
          </h2>
          <p className="text-xs text-[#777777]">
            Domestic NEFT/IMPS remittance, internal transfers, and instant utility bill payments
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white border border-[#E8E8E8] rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab('TRANSFER')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'TRANSFER'
                ? 'bg-[#DB0011] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Money Transfers
          </button>
          <button
            onClick={() => setActiveTab('BILL_PAY')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'BILL_PAY'
                ? 'bg-[#DB0011] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bill Payments
          </button>
        </div>
      </div>

      {activeTab === 'TRANSFER' ? (
        /* STEP-BY-STEP TRANSFER EXPERIENCE */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E8E8E8] shadow-card p-6 sm:p-10 space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    transferStep === step
                      ? 'bg-[#DB0011] text-white'
                      : transferStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {transferStep > step ? '✓' : step}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-gray-700">
                  {step === 1 ? 'Type' : step === 2 ? 'Source' : step === 3 ? 'Recipient' : step === 4 ? 'Amount' : step === 5 ? 'Review' : 'Receipt'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Select Transfer Type */}
          {transferStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Step 1: Select Transfer Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'SAVED', title: 'Registered Beneficiary', desc: 'Transfer to previously saved beneficiary accounts', icon: Users },
                  { id: 'OWN', title: 'Between Own Accounts', desc: 'Instant transfer between your HSBC accounts', icon: ArrowLeftRight },
                  { id: 'NEW', title: 'One-Time / New Beneficiary', desc: 'Enter new account number and IFSC code', icon: Building2 },
                  { id: 'INTERNATIONAL', title: 'International Wire Remittance', desc: 'Send foreign currency or cross-border payment', icon: Globe2 },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = transferType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setTransferType(item.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#DB0011] bg-red-50/30 ring-1 ring-[#DB0011]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#DB0011]' : 'text-gray-500'}`} />
                      <div className="text-xs font-bold text-gray-900">{item.title}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setTransferStep(2)}
                  className="px-6 py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Source Account */}
          {transferStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Step 2: Select Originating Account</h3>
              <div className="space-y-3">
                {accounts.map(acc => {
                  const isSelected = acc.accountId === sourceAccountId;
                  return (
                    <div
                      key={acc.accountId}
                      onClick={() => setSourceAccountId(acc.accountId)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#DB0011] bg-red-50/30 ring-1 ring-[#DB0011]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className={`w-5 h-5 ${isSelected ? 'text-[#DB0011]' : 'text-gray-400'}`} />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{acc.accountType}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{acc.maskedAccountNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Available Balance</div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(acc.managedBalance, acc.currency)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setTransferStep(1)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setTransferStep(3)}
                  className="px-6 py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Beneficiary Selection / Entry */}
          {transferStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Step 3: Beneficiary Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Beneficiary Legal Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#DB0011]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={recipientAccount}
                    onChange={e => setRecipientAccount(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-[#DB0011]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Destination Bank Name</label>
                  <input
                    type="text"
                    required
                    value={recipientBank}
                    onChange={e => setRecipientBank(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#DB0011]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">IFSC / Routing Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-[#DB0011]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setTransferStep(2)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setTransferStep(4)}
                  className="px-6 py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Amount & Details */}
          {transferStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Step 4: Enter Transfer Details</h3>
              <div>
                <label className="font-bold text-gray-700 block mb-1 text-xs">Amount (INR ₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl text-2xl font-extrabold text-gray-900 focus:ring-2 focus:ring-[#DB0011]"
                  placeholder="0.00"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Available in source account: {formatCurrency(selectedAccount?.managedBalance || 0, 'INR')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Payment Reference</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Transfer Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setTransferStep(3)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setTransferStep(5)}
                  className="px-6 py-3 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors flex items-center gap-2"
                >
                  <span>Review Transfer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {transferStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Step 5: Review Payment Authorization</h3>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">From Account</span>
                  <span className="font-bold text-gray-900">{selectedAccount?.accountType} ({selectedAccount?.maskedAccountNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To Beneficiary</span>
                  <span className="font-bold text-gray-900">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Beneficiary Bank & IFSC</span>
                  <span className="font-mono text-gray-900">{recipientBank} ({ifscCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference ID</span>
                  <span className="font-mono text-gray-900">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applicable Charges</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Premier Free Transfer)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Deducted Amount</span>
                  <span className="text-[#DB0011]">{formatCurrency(parseFloat(amount) || 0, 'INR')}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setTransferStep(4)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleExecuteTransfer}
                  className="px-8 py-3 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Authorizing...' : 'Confirm & Execute Transfer'}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation Screen */}
          {transferStep === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Payment Successfully Processed</h3>
              <p className="text-xs text-gray-500">
                {formatCurrency(parseFloat(amount) || 0, 'INR')} transferred to {recipientName}
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl max-w-sm mx-auto text-xs font-mono text-gray-600">
                Reference ID: {reference}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransferStep(1);
                    setReference('TXN/NEFT/' + Date.now().toString().slice(-6));
                  }}
                  className="px-5 py-2.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D]"
                >
                  Make Another Transfer
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* BILL PAYMENT GRID */
        <div className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {BILL_CATEGORIES.map(b => {
              const isSelected = selectedBillCategory === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBillCategory(b.id);
                    setBillerProvider(b.billerExample.split(' / ')[0]);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-50/50 border-[#DB0011] text-[#DB0011] shadow-xs'
                      : 'bg-white border-[#E8E8E8] text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Zap className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-bold truncate max-w-full">{b.name}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-8 shadow-card max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Pay Utility Bill: {selectedBillCategory}
            </h3>

            <form onSubmit={handleExecuteBillPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Service Provider</label>
                <input
                  type="text"
                  required
                  value={billerProvider}
                  onChange={e => setBillerProvider(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Consumer Number / Customer ID
                </label>
                <input
                  type="text"
                  required
                  value={consumerNumber}
                  onChange={e => setConsumerNumber(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Debit From Account</label>
                  <select
                    value={sourceAccountId}
                    onChange={e => setSourceAccountId(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
                  >
                    {accounts.map(acc => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.accountType} ({acc.maskedAccountNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Bill Amount (INR ₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={billAmount}
                    onChange={e => setBillAmount(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Authorizing Payment...' : 'Authorize & Pay Bill'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
