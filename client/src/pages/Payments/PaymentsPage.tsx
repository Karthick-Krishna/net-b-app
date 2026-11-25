import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Building2,
  Users,
  Globe2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BILL_CATEGORIES } from '@shared/constants';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

const SAVED_BENEFICIARIES = [
  { name: 'Rajesh Kumar', account: '50100492819201', bank: 'HDFC Bank Ltd', ifsc: 'HDFC0000060' },
  { name: 'Ananya Deshmukh', account: '50200099124501', bank: 'HSBC India', ifsc: 'HSBC0400002' },
  { name: 'Vikram Singhania', account: '00040152839100', bank: 'ICICI Bank Ltd', ifsc: 'ICIC0000004' },
];

export const PaymentsPage: React.FC = () => {
  const { accounts, submitTransfer, formatCurrency } = useBanking();

  const [activeTab, setActiveTab] = useState<'TRANSFER' | 'GLOBAL' | 'BILL_PAY'>('TRANSFER');

  // Global Transfer State
  const [globalCountry, setGlobalCountry] = useState({ code: 'GB', name: 'United Kingdom', currency: 'GBP', rate: 106.40, flag: '🇬🇧' });
  const [globalInrAmount, setGlobalInrAmount] = useState('100000');
  const [globalBeneficiaryName, setGlobalBeneficiaryName] = useState('Alexander Wright');
  const [globalIban, setGlobalIban] = useState('GB29MIDL40051512345678');
  const [globalSwift, setGlobalSwift] = useState('HBUKGB41400');
  const [globalPurpose, setGlobalPurpose] = useState('Education & University Fees');

  // Domestic Transfer Step State
  const [transferStep, setTransferStep] = useState<number>(1);
  const [transferType, setTransferType] = useState<'OWN' | 'SAVED' | 'NEW' | 'INTERNATIONAL'>('SAVED');
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [recipientName, setRecipientName] = useState(SAVED_BENEFICIARIES[0].name);
  const [recipientAccount, setRecipientAccount] = useState(SAVED_BENEFICIARIES[0].account);
  const [recipientBank, setRecipientBank] = useState(SAVED_BENEFICIARIES[0].bank);
  const [ifscCode, setIfscCode] = useState(SAVED_BENEFICIARIES[0].ifsc);
  const [amount, setAmount] = useState('25000');
  const [category] = useState('TRANSFER');
  const [reference, setReference] = useState('TXN/NEFT/' + Date.now().toString().slice(-6));
  const [description, setDescription] = useState('Consulting & Retainer Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bill Payment State
  const [selectedBillCategory, setSelectedBillCategory] = useState<string>('ELECTRICITY');
  const [billerProvider, setBillerProvider] = useState('Tata Power - Mumbai Distribution');
  const [consumerNumber, setConsumerNumber] = useState('90001249821');
  const [billAmount, setBillAmount] = useState('4250');

  const selectedAccount = accounts.find(a => a.accountId === sourceAccountId) || accounts[0];
  const effectiveSourceAccountId = selectedAccount?.accountId || '';

  const handleSelectTransferType = (type: 'OWN' | 'SAVED' | 'NEW' | 'INTERNATIONAL') => {
    setTransferType(type);
    if (type === 'OWN' && accounts.length > 1) {
      const target = accounts.find(a => a.accountId !== effectiveSourceAccountId) || accounts[1];
      setRecipientName(target.customerName || 'Karthick Krishna');
      setRecipientAccount(target.accountNumber);
      setRecipientBank('HSBC India (' + target.accountType + ')');
      setIfscCode(target.ifscCode);
    } else if (type === 'NEW') {
      setRecipientName('');
      setRecipientAccount('');
      setRecipientBank('');
      setIfscCode('');
    } else if (type === 'SAVED') {
      setRecipientName(SAVED_BENEFICIARIES[0].name);
      setRecipientAccount(SAVED_BENEFICIARIES[0].account);
      setRecipientBank(SAVED_BENEFICIARIES[0].bank);
      setIfscCode(SAVED_BENEFICIARIES[0].ifsc);
    }
  };

  const handleExecuteGlobalTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(globalInrAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid INR transfer amount');
      return;
    }
    if (!effectiveSourceAccountId) {
      toast.error('No source account available');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance in selected account');
      return;
    }

    const fxVal = (numAmount / globalCountry.rate).toFixed(2);
    setIsSubmitting(true);
    const res = await submitTransfer(effectiveSourceAccountId, {
      recipientName: globalBeneficiaryName,
      recipientAccount: globalIban,
      recipientBank: `HSBC ${globalCountry.name} Core Switch`,
      ifscCode: globalSwift,
      amount: numAmount,
      reference: 'HSBC/GLB/' + Date.now().toString().slice(-6),
      category: 'TRANSFER',
      note: `Global Money Transfer - ${globalPurpose} (${fxVal} ${globalCountry.currency})`,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(
        `HSBC Global Transfer of ${globalCountry.currency} ${fxVal} dispatched to ${globalBeneficiaryName}!`
      );
    } else {
      toast.error(res.error || 'Global transfer failed');
    }
  };

  const handleExecuteTransfer = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid transfer amount');
      return;
    }
    if (!effectiveSourceAccountId) {
      toast.error('No source account available');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance in selected account');
      return;
    }

    setIsSubmitting(true);
    const res = await submitTransfer(effectiveSourceAccountId, {
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
      setTransferStep(6);
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
    if (!effectiveSourceAccountId) {
      toast.error('No source account available');
      return;
    }
    setIsSubmitting(true);
    const res = await submitTransfer(effectiveSourceAccountId, {
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
      toast.success(`Bill payment of ${formatCurrency(numAmount, 'INR')} processed!`);
    } else {
      toast.error(res.error || 'Bill payment failed');
    }
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Header + Cards-Style Underline Sub-Tabs */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 border-b border-gray-200">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Pay &amp; Transfer
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Instant NEFT/IMPS, Global Money remittance, and utility bill payments
          </p>

          <div className="mt-4 flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'TRANSFER' as const, label: 'Domestic Transfer' },
              { id: 'GLOBAL' as const, label: 'Global Money' },
              { id: 'BILL_PAY' as const, label: 'Pay Bills' },
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 min-h-[40px] text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-[#1f1f1f]' : 'text-[#777777] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6">
          {/* TAB 1: DOMESTIC TRANSFERS */}
          {activeTab === 'TRANSFER' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Stepper */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-1">
                {[1, 2, 3, 4, 5, 6].map(step => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        transferStep === step
                          ? 'bg-[#DB0011] text-white'
                          : transferStep > step
                          ? 'bg-[#16864A] text-white'
                          : 'bg-[#F2F4F7] text-gray-500'
                      }`}
                    >
                      {transferStep > step ? '✓' : step}
                    </div>
                    <span className="hidden sm:inline text-[11px] font-semibold text-[#555555]">
                      {step === 1 ? 'Type' : step === 2 ? 'From' : step === 3 ? 'To' : step === 4 ? 'Amount' : step === 5 ? 'Review' : 'Done'}
                    </span>
                  </div>
                ))}
              </div>

              {transferStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 1: Select Transfer Type</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'SAVED' as const, title: 'Registered Beneficiary', desc: 'Send to saved payee accounts', icon: Users },
                      { id: 'OWN' as const, title: 'Between Own Accounts', desc: 'Instant transfer between your HSBC accounts', icon: ArrowLeftRight },
                      { id: 'NEW' as const, title: 'One-Time / New Payee', desc: 'Enter account number and IFSC code', icon: Building2 },
                      { id: 'INTERNATIONAL' as const, title: 'Global Wire Remittance', desc: 'Cross-border transfer in 50+ countries', icon: Globe2 },
                    ].map(item => {
                      const Icon = item.icon;
                      const isSelected = transferType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTransferType(item.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#DB0011] bg-red-50/30 ring-1 ring-[#DB0011]'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-[#F2F4F7] flex items-center justify-center mb-2.5">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
                          </div>
                          <div className="text-xs font-bold text-[#1f1f1f]">{item.title}</div>
                          <div className="text-[11px] text-[#777777] mt-0.5">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (transferType === 'INTERNATIONAL') {
                          setActiveTab('GLOBAL');
                        } else {
                          setTransferStep(2);
                        }
                      }}
                      className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {transferStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 2: Select Source Account</h2>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {accounts.map(acc => {
                      const isSelected = acc.accountId === effectiveSourceAccountId;
                      return (
                        <button
                          key={acc.accountId}
                          type="button"
                          onClick={() => setSourceAccountId(acc.accountId)}
                          className={`w-full p-4 cursor-pointer transition-colors flex items-center justify-between text-left ${
                            isSelected ? 'bg-red-50/40' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#DB0011]' : 'border-gray-300'}`}>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-[#DB0011]" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#1f1f1f]">{acc.accountType}</div>
                              <div className="text-[11px] text-[#777777] font-mono">{acc.maskedAccountNumber}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] text-[#777777]">Available</div>
                            <div className="text-sm font-bold text-[#1f1f1f]">
                              {formatCurrency(acc.managedBalance, acc.currency)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferStep(1)}
                      className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferStep(3)}
                      className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {transferStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 3: Beneficiary Details</h2>

                  {transferType === 'SAVED' && (
                    <div className="flex flex-wrap gap-2">
                      {SAVED_BENEFICIARIES.map(b => (
                        <button
                          key={b.account}
                          type="button"
                          onClick={() => {
                            setRecipientName(b.name);
                            setRecipientAccount(b.account);
                            setRecipientBank(b.bank);
                            setIfscCode(b.ifsc);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                            recipientAccount === b.account
                              ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                              : 'bg-[#F2F4F7] text-[#1f1f1f] border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {b.name} ({b.bank.split(' ')[0]})
                        </button>
                      ))}
                    </div>
                  )}

                  {transferType === 'OWN' && (
                    <div className="flex flex-wrap gap-2">
                      {accounts
                        .filter(a => a.accountId !== effectiveSourceAccountId)
                        .map(acc => (
                          <button
                            key={acc.accountId}
                            type="button"
                            onClick={() => {
                              setRecipientName(acc.customerName || 'Karthick Krishna');
                              setRecipientAccount(acc.accountNumber);
                              setRecipientBank(`HSBC India (${acc.accountType})`);
                              setIfscCode(acc.ifscCode);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                              recipientAccount === acc.accountNumber
                                ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                                : 'bg-[#F2F4F7] text-[#1f1f1f] border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {acc.accountType} ({acc.maskedAccountNumber.slice(-4)})
                          </button>
                        ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label htmlFor="pay-rec-name" className="font-bold text-[#555555] block mb-1.5">Beneficiary Name</label>
                      <input
                        id="pay-rec-name"
                        type="text"
                        required
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] focus:bg-white focus:border-[#DB0011] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-acc" className="font-bold text-[#555555] block mb-1.5">Account Number</label>
                      <input
                        id="pay-rec-acc"
                        type="text"
                        required
                        value={recipientAccount}
                        onChange={e => setRecipientAccount(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono focus:bg-white focus:border-[#DB0011] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-bank" className="font-bold text-[#555555] block mb-1.5">Bank Name</label>
                      <input
                        id="pay-rec-bank"
                        type="text"
                        required
                        value={recipientBank}
                        onChange={e => setRecipientBank(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] focus:bg-white focus:border-[#DB0011] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-ifsc" className="font-bold text-[#555555] block mb-1.5">IFSC Code</label>
                      <input
                        id="pay-rec-ifsc"
                        type="text"
                        required
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase focus:bg-white focus:border-[#DB0011] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferStep(2)}
                      className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!recipientName.trim() || !recipientAccount.trim()) {
                          toast.error('Please enter beneficiary name and account number');
                          return;
                        }
                        setTransferStep(4);
                      }}
                      className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {transferStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 4: Amount &amp; Reference</h2>
                  <div>
                    <label htmlFor="pay-amount" className="font-bold text-[#555555] block mb-1.5 text-xs">Amount (INR ₹)</label>
                    <input
                      id="pay-amount"
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full p-3.5 bg-[#F6F7F9] border border-gray-200 rounded-[2px] text-2xl font-bold text-[#1f1f1f] focus:bg-white focus:border-[#DB0011] focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="text-[11px] text-[#777777] mt-1 block">
                      Available in source account: {formatCurrency(selectedAccount?.managedBalance || 0, 'INR')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label htmlFor="pay-ref" className="font-bold text-[#555555] block mb-1.5">Reference</label>
                      <input
                        id="pay-ref"
                        type="text"
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="pay-desc" className="font-bold text-[#555555] block mb-1.5">Remarks</label>
                      <input
                        id="pay-desc"
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferStep(3)}
                      className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferStep(5)}
                      className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {transferStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 5: Review Authorization</h2>
                  <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200 space-y-3 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-[#777777]">From Account</span>
                      <span className="font-bold text-[#1f1f1f]">{selectedAccount?.accountType} ({selectedAccount?.maskedAccountNumber})</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#777777]">To Beneficiary</span>
                      <span className="font-bold text-[#1f1f1f]">{recipientName}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#777777]">Bank &amp; IFSC</span>
                      <span className="font-mono text-[#1f1f1f]">{recipientBank} ({ifscCode})</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#777777]">Charges</span>
                      <span className="font-bold text-[#16864A]">₹0.00 (Premier Free)</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                      <span className="text-[#1f1f1f]">Total Amount</span>
                      <span className="text-[#DB0011]">{formatCurrency(parseFloat(amount) || 0, 'INR')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferStep(4)}
                      className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleExecuteTransfer}
                      className="min-h-[44px] px-7 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Authorizing...' : 'Confirm & Pay'}
                    </button>
                  </div>
                </div>
              )}

              {transferStep === 6 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-[#16864A] rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1f1f1f]">Payment Successful</h2>
                  <p className="text-xs text-[#777777]">
                    {formatCurrency(parseFloat(amount) || 0, 'INR')} transferred to {recipientName}
                  </p>
                  <div className="p-3 bg-[#F6F7F9] rounded-lg max-w-xs mx-auto text-xs font-mono text-gray-600">
                    Ref: {reference}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferStep(1);
                      setReference('TXN/NEFT/' + Date.now().toString().slice(-6));
                    }}
                    className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold cursor-pointer"
                  >
                    Make Another Transfer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBAL MONEY */}
          {activeTab === 'GLOBAL' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DB0011] text-white uppercase">
                    HSBC Global Money
                  </span>
                  <span className="text-[10px] font-bold text-[#16864A] bg-emerald-50 px-2 py-0.5 rounded">
                    Zero FX Fee for Premier
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-2">
                  International Remittance
                </h2>
              </div>

              <form onSubmit={handleExecuteGlobalTransfer} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { code: 'GB', name: 'United Kingdom', currency: 'GBP', rate: 106.40, flag: '🇬🇧' },
                    { code: 'US', name: 'United States', currency: 'USD', rate: 84.50, flag: '🇺🇸' },
                    { code: 'AE', name: 'UAE', currency: 'AED', rate: 23.00, flag: '🇦🇪' },
                    { code: 'SG', name: 'Singapore', currency: 'SGD', rate: 63.10, flag: '🇸🇬' },
                    { code: 'EU', name: 'Eurozone', currency: 'EUR', rate: 91.20, flag: '🇪🇺' },
                    { code: 'CA', name: 'Canada', currency: 'CAD', rate: 61.80, flag: '🇨🇦' },
                  ].map(c => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setGlobalCountry(c)}
                      className={`p-3 rounded-xl text-left cursor-pointer border transition-all ${
                        globalCountry.code === c.code
                          ? 'border-[#DB0011] bg-red-50/40 ring-1 ring-[#DB0011]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-base">{c.flag}</div>
                      <div className="font-bold text-[#1f1f1f] mt-1">{c.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">1 {c.currency} = ₹{c.rate.toFixed(2)}</div>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="global-inr" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                      You Send (INR ₹)
                    </label>
                    <input
                      id="global-inr"
                      type="number"
                      required
                      min="1000"
                      value={globalInrAmount}
                      onChange={e => setGlobalInrAmount(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-bold text-sm"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                      Recipient Gets ({globalCountry.currency})
                    </div>
                    <div className="h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-bold text-sm font-mono text-[#16864A] flex items-center">
                      {globalCountry.currency} {(parseFloat(globalInrAmount || '0') / globalCountry.rate).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="global-ben" className="text-[11px] font-semibold text-gray-600 block mb-1">Beneficiary Name</label>
                    <input
                      id="global-ben"
                      type="text"
                      required
                      value={globalBeneficiaryName}
                      onChange={e => setGlobalBeneficiaryName(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="global-purpose" className="text-[11px] font-semibold text-gray-600 block mb-1">Purpose (RBI LRS)</label>
                    <select
                      id="global-purpose"
                      value={globalPurpose}
                      onChange={e => setGlobalPurpose(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold"
                    >
                      <option>Education &amp; University Fees</option>
                      <option>Family Maintenance</option>
                      <option>Medical Treatment</option>
                      <option>Overseas Travel</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="global-iban" className="text-[11px] font-semibold text-gray-600 block mb-1">IBAN / Account</label>
                    <input
                      id="global-iban"
                      type="text"
                      required
                      value={globalIban}
                      onChange={e => setGlobalIban(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label htmlFor="global-swift" className="text-[11px] font-semibold text-gray-600 block mb-1">SWIFT / BIC</label>
                    <input
                      id="global-swift"
                      type="text"
                      required
                      value={globalSwift}
                      onChange={e => setGlobalSwift(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] font-semibold cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching Wire...' : 'Authorize Global Transfer'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: BILL PAYMENTS */}
          {activeTab === 'BILL_PAY' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BILL_CATEGORIES.map(b => {
                  const isSelected = selectedBillCategory === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBillCategory(b.id);
                        setBillerProvider(b.billerExample.split(' / ')[0]);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-red-50/40 border-[#DB0011] text-[#DB0011]'
                          : 'bg-[#F6F7F9] border-transparent text-[#1f1f1f] hover:bg-gray-100'
                      }`}
                    >
                      <Zap className="w-4 h-4" aria-hidden="true" />
                      <span className="text-[10px] font-semibold truncate max-w-full">{b.name}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleExecuteBillPayment} className="space-y-4 text-xs border-t border-gray-100 pt-5">
                <h2 className="text-base font-bold text-[#1f1f1f]">Pay {selectedBillCategory} Bill</h2>
                <div>
                  <label htmlFor="bill-provider" className="font-bold text-[#555555] block mb-1.5">Service Provider</label>
                  <input
                    id="bill-provider"
                    type="text"
                    required
                    value={billerProvider}
                    onChange={e => setBillerProvider(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]"
                  />
                </div>
                <div>
                  <label htmlFor="bill-consumer" className="font-bold text-[#555555] block mb-1.5">Consumer / Account Number</label>
                  <input
                    id="bill-consumer"
                    type="text"
                    required
                    value={consumerNumber}
                    onChange={e => setConsumerNumber(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bill-source" className="font-bold text-[#555555] block mb-1.5">Source Account</label>
                    <select
                      id="bill-source"
                      value={effectiveSourceAccountId}
                      onChange={e => setSourceAccountId(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold"
                    >
                      {accounts.map(acc => (
                        <option key={acc.accountId} value={acc.accountId}>
                          {acc.accountType} ({acc.maskedAccountNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bill-amt" className="font-bold text-[#555555] block mb-1.5">Amount (INR ₹)</label>
                    <input
                      id="bill-amt"
                      type="number"
                      required
                      min="1"
                      value={billAmount}
                      onChange={e => setBillAmount(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] cursor-pointer"
                >
                  {isSubmitting ? 'Authorizing...' : 'Authorize & Pay Bill'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
