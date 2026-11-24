import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Beneficiary } from '../types';
import { api } from '../services/api';
import { BiometricModal } from '../components/BiometricModal';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Globe,
  Landmark,
  UserCheck,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export const TransfersPage: React.FC = () => {
  const { accounts, formatAmount, refreshAccounts, showReceipt, showToast } = useBanking();

  // Wizard state: 'form' | 'review' | 'biometric'
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [showBiometric, setShowBiometric] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<'DOMESTIC_TRANSFER' | 'OWN_TRANSFER' | 'INTL_TRANSFER'>('DOMESTIC_TRANSFER');

  // Form Fields
  const [sourceAccountId, setSourceAccountId] = useState<string>(accounts[0]?.id || '');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBenId, setSelectedBenId] = useState<string>('');
  const [customRecipient, setCustomRecipient] = useState<string>('');
  const [customAccount, setCustomAccount] = useState<string>('');
  const [customBank, setCustomBank] = useState<string>('Barclays Bank UK');
  const [customSwift, setCustomSwift] = useState<string>('BARCGB22XXX');
  const [amount, setAmount] = useState<string>('250');
  const [currency, setCurrency] = useState<string>('GBP');
  const [reference, setReference] = useState<string>('Invoice Settlement');
  const [note, setNote] = useState<string>('Consulting & Services Nov 2026');

  // Real-time calculation preview
  const [calculation, setCalculation] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load Beneficiaries
  useEffect(() => {
    api.getBeneficiaries().then(res => {
      setBeneficiaries(res.beneficiaries);
      if (res.beneficiaries.length > 0 && !selectedBenId) {
        setSelectedBenId(res.beneficiaries[0].id);
      }
    }).catch(() => {});
  }, []);

  // Update Source Account if none selected
  useEffect(() => {
    if (!sourceAccountId && accounts.length > 0) {
      setSourceAccountId(accounts[0].id);
    }
  }, [accounts]);

  // Recalculate fee, tax & delivery when amount, currency or type changes
  useEffect(() => {
    const num = parseFloat(amount) || 0;
    if (num > 0) {
      api.calculateTransfer({ transferType, amount: num, currency }).then(res => {
        setCalculation(res.calculation);
      }).catch(() => {});
    }
  }, [amount, currency, transferType]);

  const sourceAccount = accounts.find(a => a.id === sourceAccountId) || accounts[0];
  const selectedBen = beneficiaries.find(b => b.id === selectedBenId);

  const recipientName = selectedBenId === 'custom' || !selectedBen ? customRecipient || 'Recipient' : selectedBen.name;
  const recipientAccount = selectedBenId === 'custom' || !selectedBen ? customAccount || '400515-99882211' : selectedBen.account_number;
  const recipientBank = selectedBenId === 'custom' || !selectedBen ? customBank : selectedBen.bank_name;
  const recipientSwift = selectedBenId === 'custom' || !selectedBen ? customSwift : selectedBen.ifsc_swift;

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount) || 0;
    if (num <= 0) {
      showToast('Please enter a valid transfer amount', 'error');
      return;
    }
    if (sourceAccount && sourceAccount.available_balance < num) {
      showToast(`Insufficient funds in ${sourceAccount.account_name}`, 'error');
      return;
    }
    setStep('review');
  };

  const handleExecuteTransfer = async () => {
    setIsProcessing(true);
    try {
      const idempotencyKey = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await api.processTransfer(
        {
          sourceAccountId: sourceAccount.id,
          counterpartyName: recipientName,
          counterpartyAccount: recipientAccount,
          bankName: recipientBank,
          ifscSwift: recipientSwift,
          amount: parseFloat(amount),
          currency,
          fee: calculation?.transferFee || 0,
          tax: calculation?.applicableTax || 0,
          exchangeRate: calculation?.exchangeRate || 1.0,
          description: `${reference}: ${note}`,
          transactionType: transferType,
        },
        idempotencyKey
      );

      await refreshAccounts();
      showToast('Transfer completed successfully!', 'success');
      setStep('form');
      showReceipt(res.receipt);
    } catch (err: any) {
      showToast(err.message || 'Transfer failed', 'error');
    } finally {
      setIsProcessing(false);
      setShowBiometric(false);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Money Transfers</h1>
        <p className="text-xs text-bank-muted">Instant Faster Payments & International Wire</p>
      </div>

      {/* Transfer Type Selector */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { id: 'DOMESTIC_TRANSFER', label: 'Domestic UK', icon: Landmark },
          { id: 'INTL_TRANSFER', label: 'International', icon: Globe },
          { id: 'OWN_TRANSFER', label: 'Between Accounts', icon: ArrowRight },
        ].map(item => {
          const Icon = item.icon;
          const isSelected = transferType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTransferType(item.id as any);
                setStep('form');
              }}
              className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                  : 'bg-white border-bank-border text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Icon size={16} />
              <span className="text-[11px] leading-tight text-center">{item.label}</span>
            </button>
          );
        })}
      </div>

      {step === 'form' ? (
        /* STEP 1: Form Entry */
        <form onSubmit={handleProceedToReview} className="space-y-4">
          {/* Source Account Selector */}
          <div className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bank-muted block">
              1. Transfer From Account
            </label>
            <select
              value={sourceAccountId}
              onChange={e => setSourceAccountId(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-300 bg-white font-semibold text-xs text-zinc-900 focus:ring-2 focus:ring-[#DB0011]/30 focus:outline-hidden"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} — {formatAmount(acc.available_balance, acc.currency)} ({acc.account_number})
                </option>
              ))}
            </select>
          </div>

          {/* Beneficiary / Destination Account */}
          <div className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-bank-muted block">
              2. Select Beneficiary
            </label>

            {transferType === 'OWN_TRANSFER' ? (
              <div>
                <select
                  value={customAccount}
                  onChange={e => {
                    setCustomAccount(e.target.value);
                    const dest = accounts.find(a => a.id === e.target.value);
                    if (dest) setCustomRecipient(dest.account_name);
                  }}
                  className="w-full p-3 rounded-xl border border-zinc-300 bg-white font-semibold text-xs text-zinc-900"
                >
                  <option value="">Select destination internal account...</option>
                  {accounts.filter(a => a.id !== sourceAccountId).map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({formatAmount(acc.available_balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedBenId}
                  onChange={e => setSelectedBenId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-300 bg-white font-semibold text-xs text-zinc-900"
                >
                  {beneficiaries.map(ben => (
                    <option key={ben.id} value={ben.id}>
                      {ben.name} ({ben.bank_name} • {ben.account_number})
                    </option>
                  ))}
                  <option value="custom">+ Enter New Recipient Details</option>
                </select>

                {selectedBenId === 'custom' && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs animate-in fade-in">
                    <div>
                      <span className="text-zinc-500 block text-[11px] mb-1">Beneficiary Legal Name</span>
                      <input
                        type="text"
                        value={customRecipient}
                        onChange={e => setCustomRecipient(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px] mb-1">Account Number or IBAN</span>
                      <input
                        type="text"
                        value={customAccount}
                        onChange={e => setCustomAccount(e.target.value)}
                        placeholder="400515-XXXXXXXX or GB29..."
                        className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-mono"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-zinc-500 block text-[11px] mb-1">Bank Name</span>
                        <input
                          type="text"
                          value={customBank}
                          onChange={e => setCustomBank(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px] mb-1">Sort Code / SWIFT</span>
                        <input
                          type="text"
                          value={customSwift}
                          onChange={e => setCustomSwift(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-bank-muted block">
              3. Transfer Amount
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-zinc-400">
                  {currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-zinc-300 font-extrabold text-2xl text-zinc-900 focus:ring-2 focus:ring-[#DB0011]/30 focus:outline-hidden"
                  placeholder="0.00"
                  required
                />
              </div>

              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-24 p-3 rounded-xl border border-zinc-300 bg-white font-bold text-sm text-zinc-900"
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              {['50', '100', '250', '500', '1000'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition"
                >
                  +£{val}
                </button>
              ))}
            </div>

            {/* Reference & Description */}
            <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 block text-[11px] mb-1">Payment Reference (Mandatory)</span>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="Reference (e.g. Invoice 881)"
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fee & Delivery Preview Breakdown */}
          {calculation && (
            <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-600">
                <span>Transfer Fee:</span>
                <span className="font-semibold text-emerald-700">
                  {calculation.transferFee === 0 ? '£0.00 (Free Faster Payments)' : `£${calculation.transferFee.toFixed(2)}`}
                </span>
              </div>
              {calculation.exchangeRate !== 1.0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Indicative Exchange Rate:</span>
                  <span className="font-mono font-medium">1 GBP = {calculation.exchangeRate} {calculation.destinationCurrency}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Delivery:</span>
                <span className="font-medium text-zinc-900 flex items-center gap-1">
                  <Clock size={12} className="text-[#DB0011]" />
                  <span>{calculation.estimatedDelivery}</span>
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md transition"
          >
            Review Transfer
          </button>
        </form>
      ) : (
        /* STEP 2: Payment Review Screen */
        <div className="bg-white rounded-2xl p-5 border border-bank-border shadow-card space-y-5 animate-in fade-in">
          <div className="text-center pb-4 border-b border-zinc-100">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Review & Authorize</span>
            <div className="text-3xl font-extrabold text-bank-text mt-1">
              {formatAmount(parseFloat(amount), currency)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Faster Payments Settlement</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">From Account:</span>
              <span className="font-semibold text-zinc-900 text-right">
                {sourceAccount?.account_name}
                <br />
                <span className="font-mono text-zinc-500 text-[11px] font-normal">{sourceAccount?.account_number}</span>
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">To Recipient:</span>
              <span className="font-bold text-zinc-900 text-right">
                {recipientName}
                <br />
                <span className="font-mono text-zinc-500 text-[11px] font-normal">{recipientAccount}</span>
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Recipient Bank:</span>
              <span className="font-medium text-zinc-800">{recipientBank}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Payment Reference:</span>
              <span className="font-mono font-medium text-zinc-800">{reference}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Transfer Fees:</span>
              <span className="font-semibold text-emerald-700">£0.00 (Waived)</span>
            </div>
          </div>

          <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/60 flex items-center gap-2 text-xs text-zinc-700">
            <ShieldCheck size={16} className="text-[#DB0011] shrink-0" />
            <span>Authorized by Premier Multi-Factor Authentication.</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="flex-1 py-3 rounded-xl border border-zinc-300 font-semibold text-xs text-zinc-700 hover:bg-zinc-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setShowBiometric(true)}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] font-bold text-xs text-white shadow-md transition disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm & Send'}
            </button>
          </div>
        </div>
      )}

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={showBiometric}
        title="Authorize Transfer"
        subtitle={`Approve transfer of ${currency} ${amount} to ${recipientName}`}
        onSuccess={handleExecuteTransfer}
        onCancel={() => setShowBiometric(false)}
      />
    </div>
  );
};
