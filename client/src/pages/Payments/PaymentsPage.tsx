import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Building2,
  Users,
  Globe2,
  Zap,
  ArrowRight,
  QrCode,
  UserPlus,
  CalendarClock,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BILL_CATEGORIES } from '@shared/constants';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import toast from 'react-hot-toast';

interface Beneficiary {
  name: string;
  account: string;
  bank: string;
  ifsc: string;
}

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { name: 'Rajesh Kumar', account: '50100492819201', bank: 'HDFC Bank Ltd', ifsc: 'HDFC0000060' },
  { name: 'Ananya Deshmukh', account: '50200099124501', bank: 'HSBC India', ifsc: 'HSBC0400002' },
  { name: 'Vikram Singhania', account: '00040152839100', bank: 'ICICI Bank Ltd', ifsc: 'ICIC0000004' },
];

export const PaymentsPage: React.FC = () => {
  const { accounts, submitTransfer, formatCurrency } = useBanking();

  const [activeTab, setActiveTab] = useState<'UPI' | 'TRANSFER' | 'GLOBAL' | 'BILL_PAY'>('UPI');

  // SimplyPay UPI State
  const [upiVpa, setUpiVpa] = useState('merchant@okicici');
  const [upiAmount, setUpiAmount] = useState('1500');
  const [upiRemark, setUpiRemark] = useState('HSBC SimplyPay UPI');
  const [showQrModal, setShowQrModal] = useState(false);

  // Saved Beneficiaries + Add Payee Modal
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeBank, setNewPayeeBank] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('');

  // Standing Instructions
  const [scheduledPayments, setScheduledPayments] = useState([
    { id: 'si-1', to: 'Ananya Deshmukh', amount: 35000, freq: 'Monthly • 1st', nextDate: '01 Dec 2026' },
  ]);

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
  const [recipientName, setRecipientName] = useState(INITIAL_BENEFICIARIES[0].name);
  const [recipientAccount, setRecipientAccount] = useState(INITIAL_BENEFICIARIES[0].account);
  const [recipientBank, setRecipientBank] = useState(INITIAL_BENEFICIARIES[0].bank);
  const [ifscCode, setIfscCode] = useState(INITIAL_BENEFICIARIES[0].ifsc);
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

  const handleUpiPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(upiAmount);
    if (!upiVpa.includes('@') || isNaN(numAmt) || numAmt <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid UPI ID (e.g. name@bank) and amount');
      return;
    }
    setIsSubmitting(true);
    const res = await submitTransfer(effectiveSourceAccountId, {
      recipientName: upiVpa,
      recipientAccount: upiVpa,
      recipientBank: 'NPCI UPI Switch (SimplyPay)',
      ifscCode: 'HSBC0UPI001',
      amount: numAmt,
      reference: 'UPI/' + Date.now().toString().slice(-8),
      category: 'TRANSFER',
      note: upiRemark,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success(`Paid ${formatCurrency(numAmt, 'INR')} to ${upiVpa} via HSBC SimplyPay!`);
    } else {
      toast.error(res.error || 'UPI payment failed');
    }
  };

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      name: newPayeeName.trim(),
      account: newPayeeAcc.trim(),
      bank: newPayeeBank.trim(),
      ifsc: newPayeeIfsc.trim().toUpperCase(),
    };
    setBeneficiaries(prev => [item, ...prev]);
    setRecipientName(item.name);
    setRecipientAccount(item.account);
    setRecipientBank(item.bank);
    setIfscCode(item.ifsc);
    toast.success(`Beneficiary ${item.name} added & verified!`);
    setNewPayeeName('');
    setNewPayeeAcc('');
    setNewPayeeBank('');
    setNewPayeeIfsc('');
    setShowAddPayeeModal(false);
  };

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
    } else if (type === 'SAVED' && beneficiaries[0]) {
      setRecipientName(beneficiaries[0].name);
      setRecipientAccount(beneficiaries[0].account);
      setRecipientBank(beneficiaries[0].bank);
      setIfscCode(beneficiaries[0].ifsc);
    }
  };

  const handleExecuteGlobalTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(globalInrAmount);
    if (isNaN(numAmount) || numAmount <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid INR transfer amount');
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
      toast.success(`HSBC Global Transfer of ${globalCountry.currency} ${fxVal} dispatched to ${globalBeneficiaryName}!`);
    } else {
      toast.error(res.error || 'Global transfer failed');
    }
  };

  const handleExecuteTransfer = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid transfer amount');
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
    if (isNaN(numAmount) || numAmount <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid bill amount');
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
                Pay &amp; Transfer
              </h1>
              <p className="text-xs text-[#777777] mt-0.5">
                SimplyPay UPI, NEFT/RTGS/IMPS, Global Money &amp; Utility Bills
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPayeeModal(true)}
              className="self-start sm:self-auto min-h-[36px] px-3 bg-[#F2F4F7] hover:bg-gray-200 text-[#1f1f1f] rounded-[2px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
              <span>Add Payee</span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'UPI' as const, label: 'SimplyPay UPI' },
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
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6">
          {/* TAB 0: HSBC SIMPLYPAY UPI */}
          {activeTab === 'UPI' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DB0011]">HSBC SimplyPay UPI</span>
                  <div className="text-sm font-bold text-[#1f1f1f] mt-0.5">Your UPI ID: <span className="font-mono">karthick@hsbc</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="min-h-[40px] px-4 bg-[#1f1f1f] hover:bg-black text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                  <span>Scan &amp; Pay QR</span>
                </button>
              </div>

              <form onSubmit={handleUpiPay} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="upi-src" className="font-bold text-[#555555] block mb-1.5">Debit Account</label>
                  <select id="upi-src" value={effectiveSourceAccountId} onChange={e => setSourceAccountId(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold">
                    {accounts.map(acc => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.accountType === 'CURRENT' ? 'Business Current' : 'Premier Savings'} ({acc.maskedAccountNumber}) — {formatCurrency(acc.managedBalance, acc.currency)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="upi-vpa" className="font-bold text-[#555555] block mb-1.5">Recipient UPI ID / VPA</label>
                    <input id="upi-vpa" type="text" required value={upiVpa} onChange={e => setUpiVpa(e.target.value)} placeholder="name@okbank" className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono" />
                  </div>
                  <div>
                    <label htmlFor="upi-amt" className="font-bold text-[#555555] block mb-1.5">Amount (INR ₹)</label>
                    <input id="upi-amt" type="number" min="1" max="100000" required value={upiAmount} onChange={e => setUpiAmount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-bold text-sm" />
                  </div>
                </div>

                <div>
                  <label htmlFor="upi-note" className="font-bold text-[#555555] block mb-1.5">UPI Note</label>
                  <input id="upi-note" type="text" value={upiRemark} onChange={e => setUpiRemark(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-semibold rounded-[2px] cursor-pointer">
                  {isSubmitting ? 'Processing UPI...' : 'Send Instant UPI Payment'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 1: DOMESTIC TRANSFERS */}
          {activeTab === 'TRANSFER' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-1">
                {[1, 2, 3, 4, 5, 6].map(step => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        transferStep === step ? 'bg-[#DB0011] text-white' : transferStep > step ? 'bg-[#16864A] text-white' : 'bg-[#F2F4F7] text-gray-500'
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
                            isSelected ? 'border-[#DB0011] bg-red-50/30 ring-1 ring-[#DB0011]' : 'border-gray-200 hover:border-gray-300 bg-white'
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

                  {/* Scheduled Recurring Instructions */}
                  <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1f1f1f] flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                        Standing Instructions ({scheduledPayments.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setScheduledPayments(prev => [
                            ...prev,
                            { id: 'si-' + Date.now(), to: recipientName || 'Rajesh Kumar', amount: 15000, freq: 'Monthly • 15th', nextDate: '15 Dec 2026' },
                          ]);
                          toast.success('Added monthly standing instruction');
                        }}
                        className="text-[#DB0011] font-semibold hover:underline cursor-pointer"
                      >
                        + Schedule Recurring
                      </button>
                    </div>
                    {scheduledPayments.map(si => (
                      <div key={si.id} className="flex items-center justify-between py-1.5 border-t border-gray-200/60">
                        <div>
                          <span className="font-semibold text-[#1f1f1f]">{si.to}</span>
                          <span className="block text-[10px] text-[#777777]">{si.freq} • Next: {si.nextDate}</span>
                        </div>
                        <span className="font-bold text-[#1f1f1f]">{formatCurrency(si.amount, 'INR')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (transferType === 'INTERNATIONAL') setActiveTab('GLOBAL');
                        else setTransferStep(2);
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
                          className={`w-full p-4 cursor-pointer transition-colors flex items-center justify-between text-left ${isSelected ? 'bg-red-50/40' : 'bg-white hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#DB0011]' : 'border-gray-300'}`}>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-[#DB0011]" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#1f1f1f]">{acc.accountType === 'CURRENT' ? 'Business Current' : 'Premier Savings'}</div>
                              <div className="text-[11px] text-[#777777] font-mono">{acc.maskedAccountNumber}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] text-[#777777]">Available</div>
                            <div className="text-sm font-bold text-[#1f1f1f]">{formatCurrency(acc.managedBalance, acc.currency)}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(1)} className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold hover:bg-gray-200 cursor-pointer">Back</button>
                    <button type="button" onClick={() => setTransferStep(3)} className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"><span>Continue</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {transferStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 3: Beneficiary Details</h2>
                  {transferType === 'SAVED' && (
                    <div className="flex flex-wrap gap-2">
                      {beneficiaries.map(b => (
                        <button
                          key={b.account}
                          type="button"
                          onClick={() => { setRecipientName(b.name); setRecipientAccount(b.account); setRecipientBank(b.bank); setIfscCode(b.ifsc); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                            recipientAccount === b.account ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]' : 'bg-[#F2F4F7] text-[#1f1f1f] border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {b.name} ({b.bank.split(' ')[0]})
                        </button>
                      ))}
                    </div>
                  )}
                  {transferType === 'OWN' && (
                    <div className="flex flex-wrap gap-2">
                      {accounts.filter(a => a.accountId !== effectiveSourceAccountId).map(acc => (
                        <button
                          key={acc.accountId}
                          type="button"
                          onClick={() => { setRecipientName(acc.customerName || 'Karthick Krishna'); setRecipientAccount(acc.accountNumber); setRecipientBank(`HSBC India (${acc.accountType})`); setIfscCode(acc.ifscCode); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                            recipientAccount === acc.accountNumber ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]' : 'bg-[#F2F4F7] text-[#1f1f1f] border-transparent hover:bg-gray-200'
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
                      <input id="pay-rec-name" type="text" required value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-acc" className="font-bold text-[#555555] block mb-1.5">Account Number</label>
                      <input id="pay-rec-acc" type="text" required value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-bank" className="font-bold text-[#555555] block mb-1.5">Bank Name</label>
                      <input id="pay-rec-bank" type="text" required value={recipientBank} onChange={e => setRecipientBank(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-ifsc" className="font-bold text-[#555555] block mb-1.5">IFSC Code</label>
                      <input id="pay-rec-ifsc" type="text" required value={ifscCode} onChange={e => setIfscCode(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(2)} className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold cursor-pointer">Back</button>
                    <button type="button" onClick={() => { if (!recipientName.trim() || !recipientAccount.trim()) { toast.error('Enter beneficiary details'); return; } setTransferStep(4); }} className="min-h-[44px] px-6 bg-[#DB0011] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"><span>Continue</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {transferStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 4: Amount &amp; Reference</h2>
                  <div>
                    <label htmlFor="pay-amount" className="font-bold text-[#555555] block mb-1.5 text-xs">Amount (INR ₹)</label>
                    <input id="pay-amount" type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3.5 bg-[#F6F7F9] border border-gray-200 rounded-[2px] text-2xl font-bold text-[#1f1f1f]" placeholder="0.00" />
                    <span className="text-[11px] text-[#777777] mt-1 block">Available: {formatCurrency(selectedAccount?.managedBalance || 0, 'INR')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label htmlFor="pay-ref" className="font-bold text-[#555555] block mb-1.5">Reference</label>
                      <input id="pay-ref" type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono" />
                    </div>
                    <div>
                      <label htmlFor="pay-desc" className="font-bold text-[#555555] block mb-1.5">Remarks</label>
                      <input id="pay-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(3)} className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold cursor-pointer">Back</button>
                    <button type="button" onClick={() => setTransferStep(5)} className="min-h-[44px] px-6 bg-[#DB0011] text-white rounded-[2px] text-xs font-semibold flex items-center gap-2 cursor-pointer"><span>Review</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {transferStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 5: Review Authorization</h2>
                  <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200 space-y-3 text-xs">
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">From</span><span className="font-bold">{selectedAccount?.accountType} ({selectedAccount?.maskedAccountNumber})</span></div>
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">To</span><span className="font-bold">{recipientName}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">Bank</span><span className="font-mono">{recipientBank} ({ifscCode})</span></div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200"><span>Total Amount</span><span className="text-[#DB0011]">{formatCurrency(parseFloat(amount) || 0, 'INR')}</span></div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(4)} className="min-h-[44px] px-5 bg-[#F2F4F7] text-[#1f1f1f] rounded-[2px] text-xs font-semibold cursor-pointer">Back</button>
                    <button type="button" disabled={isSubmitting} onClick={handleExecuteTransfer} className="min-h-[44px] px-7 bg-[#DB0011] text-white rounded-[2px] text-xs font-semibold cursor-pointer">{isSubmitting ? 'Authorizing...' : 'Confirm & Pay'}</button>
                  </div>
                </div>
              )}

              {transferStep === 6 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-[#16864A] rounded-full mx-auto flex items-center justify-center"><CheckCircle2 className="w-7 h-7" aria-hidden="true" /></div>
                  <h2 className="text-lg font-bold text-[#1f1f1f]">Payment Successful</h2>
                  <p className="text-xs text-[#777777]">{formatCurrency(parseFloat(amount) || 0, 'INR')} transferred to {recipientName}</p>
                  <button type="button" onClick={() => { setTransferStep(1); setReference('TXN/NEFT/' + Date.now().toString().slice(-6)); }} className="min-h-[44px] px-6 bg-[#DB0011] text-white rounded-[2px] text-xs font-semibold cursor-pointer">Make Another Transfer</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBAL MONEY */}
          {activeTab === 'GLOBAL' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DB0011] text-white uppercase">HSBC Global Money</span>
                  <span className="text-[10px] font-bold text-[#16864A] bg-emerald-50 px-2 py-0.5 rounded">Zero FX Fee for Premier</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-2">International Remittance</h2>
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
                    <button key={c.code} type="button" onClick={() => setGlobalCountry(c)} className={`p-3 rounded-xl text-left cursor-pointer border ${globalCountry.code === c.code ? 'border-[#DB0011] bg-red-50/40 ring-1 ring-[#DB0011]' : 'border-gray-200 bg-white'}`}>
                      <div className="text-base">{c.flag}</div>
                      <div className="font-bold text-[#1f1f1f] mt-1">{c.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">1 {c.currency} = ₹{c.rate.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="global-inr" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">You Send (INR ₹)</label>
                    <input id="global-inr" type="number" required min="1000" value={globalInrAmount} onChange={e => setGlobalInrAmount(e.target.value)} className="w-full h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-bold text-sm" />
                  </div>
                  <div>
                    <div className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Recipient Gets ({globalCountry.currency})</div>
                    <div className="h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-bold text-sm font-mono text-[#16864A] flex items-center">{globalCountry.currency} {(parseFloat(globalInrAmount || '0') / globalCountry.rate).toFixed(2)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" required aria-label="Beneficiary Name" value={globalBeneficiaryName} onChange={e => setGlobalBeneficiaryName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                  <select aria-label="Purpose" value={globalPurpose} onChange={e => setGlobalPurpose(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold">
                    <option>Education &amp; University Fees</option>
                    <option>Family Maintenance</option>
                    <option>Medical Treatment</option>
                    <option>Overseas Travel</option>
                  </select>
                  <input type="text" required aria-label="IBAN" value={globalIban} onChange={e => setGlobalIban(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase" />
                  <input type="text" required aria-label="SWIFT" value={globalSwift} onChange={e => setGlobalSwift(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] font-semibold cursor-pointer">{isSubmitting ? 'Dispatching Wire...' : 'Authorize Global Transfer'}</button>
              </form>
            </div>
          )}

          {/* TAB 3: BILL PAYMENTS */}
          {activeTab === 'BILL_PAY' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BILL_CATEGORIES.map(b => (
                  <button key={b.id} type="button" onClick={() => { setSelectedBillCategory(b.id); setBillerProvider(b.billerExample.split(' / ')[0]); }} className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${selectedBillCategory === b.id ? 'bg-red-50/40 border-[#DB0011] text-[#DB0011]' : 'bg-[#F6F7F9] border-transparent text-[#1f1f1f]'}`}>
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[10px] font-semibold truncate max-w-full">{b.name}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleExecuteBillPayment} className="space-y-4 text-xs border-t border-gray-100 pt-5">
                <h2 className="text-base font-bold text-[#1f1f1f]">Pay {selectedBillCategory} Bill</h2>
                <input type="text" required aria-label="Service Provider" value={billerProvider} onChange={e => setBillerProvider(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
                <input type="text" required aria-label="Consumer Number" value={consumerNumber} onChange={e => setConsumerNumber(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select aria-label="Source Account" value={effectiveSourceAccountId} onChange={e => setSourceAccountId(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold">
                    {accounts.map(acc => <option key={acc.accountId} value={acc.accountId}>{acc.accountType} ({acc.maskedAccountNumber})</option>)}
                  </select>
                  <input type="number" required min="1" aria-label="Bill Amount" value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-bold" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full min-h-[44px] bg-[#DB0011] text-white text-xs font-semibold rounded-[2px] cursor-pointer">{isSubmitting ? 'Authorizing...' : 'Authorize & Pay Bill'}</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Beneficiary Dialog */}
      <ModalDialog open={showAddPayeeModal} onClose={() => setShowAddPayeeModal(false)} title="Add New Beneficiary" maxWidthClass="max-w-sm">
        <form onSubmit={handleAddBeneficiary} className="space-y-3 text-xs">
          <input type="text" required placeholder="Full Legal Name" value={newPayeeName} onChange={e => setNewPayeeName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
          <input type="text" required placeholder="Account Number" value={newPayeeAcc} onChange={e => setNewPayeeAcc(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono" />
          <input type="text" required placeholder="Bank Name" value={newPayeeBank} onChange={e => setNewPayeeBank(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px]" />
          <input type="text" required placeholder="IFSC Code (e.g. HDFC0000060)" value={newPayeeIfsc} onChange={e => setNewPayeeIfsc(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-mono uppercase" />
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-semibold rounded-[2px] cursor-pointer">
            Verify &amp; Save Payee
          </button>
        </form>
      </ModalDialog>

      {/* UPI Scan QR Dialog */}
      <ModalDialog open={showQrModal} onClose={() => setShowQrModal(false)} title="HSBC SimplyPay QR" subtitle="Scan any BharatQR / UPI code" maxWidthClass="max-w-sm">
        <div className="space-y-4 text-center text-xs">
          <div className="p-6 bg-[#F6F7F9] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2">
            <QrCode className="w-24 h-24 text-[#1f1f1f]" aria-hidden="true" />
            <span className="font-mono text-[11px] text-[#555555]">UPI ID: karthick@hsbc</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUpiVpa('tajhotels@hdfcbank');
              setUpiAmount('2450');
              setShowQrModal(false);
              toast.success('Merchant QR scanned: tajhotels@hdfcbank');
            }}
            className="w-full min-h-[44px] bg-[#DB0011] text-white font-semibold rounded-[2px] cursor-pointer"
          >
            Simulate Merchant QR Scan
          </button>
        </div>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
