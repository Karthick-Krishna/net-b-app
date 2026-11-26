import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Building2,
  Users,
  Globe2,
  Zap,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
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
  { name: 'Ananya Deshmukh', account: '06410099124501', bank: 'HSBC India', ifsc: 'HSBC0641002' },
  { name: 'Vikram Singhania', account: '00040152839100', bank: 'ICICI Bank Ltd', ifsc: 'ICIC0000004' },
];

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, submitTransfer, formatCurrency } = useBanking();
  const { requestAction, showSuccess } = useActionFeedback();

  // Domestic Transfer | Global Money | Pay Bills (UPI removed — handled on separate SimplyPay app)
  const [activeTab, setActiveTab] = useState<'TRANSFER' | 'GLOBAL' | 'BILL_PAY'>('TRANSFER');

  // Saved Beneficiaries + Add Payee Modal
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeBank, setNewPayeeBank] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('');

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

  // Bill Payment State
  const [selectedBillCategory, setSelectedBillCategory] = useState<string>('ELECTRICITY');
  const [billerProvider, setBillerProvider] = useState('Tata Power - Mumbai Distribution');
  const [consumerNumber, setConsumerNumber] = useState('90001249821');
  const [billAmount, setBillAmount] = useState('4250');

  const selectedAccount = accounts.find(a => a.accountId === sourceAccountId) || accounts[0];
  const effectiveSourceAccountId = selectedAccount?.accountId || '';

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
    setNewPayeeName('');
    setNewPayeeAcc('');
    setNewPayeeBank('');
    setNewPayeeIfsc('');
    setShowAddPayeeModal(false);
    showSuccess({
      title: 'Beneficiary Added',
      message: `${item.name} (${item.bank}) has been verified and saved to your payee directory.`,
      icon: 'check',
    });
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

  const handleExecuteGlobalTransfer = (e: React.FormEvent) => {
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
    const ref = 'HSBC/GLB/' + Date.now().toString().slice(-6);

    requestAction({
      title: `Confirm Global Transfer (${globalCountry.currency} ${fxVal})?`,
      message: `Send ${formatCurrency(numAmount, 'INR')} (${globalCountry.currency} ${fxVal}) to ${globalBeneficiaryName} in ${globalCountry.name}?`,
      confirmLabel: 'Authorize with MPIN',
      requireMpin: true,
      onConfirm: async () => {
        const res = await submitTransfer(effectiveSourceAccountId, {
          recipientName: globalBeneficiaryName,
          recipientAccount: globalIban,
          recipientBank: `HSBC ${globalCountry.name} Core Switch`,
          ifscCode: globalSwift,
          amount: numAmount,
          reference: ref,
          category: 'TRANSFER',
          note: `Global Money Transfer - ${globalPurpose} (${fxVal} ${globalCountry.currency})`,
        });
        if (!res.success) {
          toast.error(res.error || 'Global transfer failed');
          throw new Error(res.error || 'Global transfer failed');
        }
        return {
          title: 'Global Wire Dispatched',
          message: `HSBC Global Money Transfer of ${globalCountry.currency} ${fxVal} (${formatCurrency(numAmount, 'INR')}) sent to ${globalBeneficiaryName}.`,
          icon: 'check',
          referenceId: ref,
          relatedButtons: [
            { label: 'View Activity Ledger', variant: 'secondary', onClick: () => navigate('/transactions') },
          ],
        };
      },
    });
  };

  const handleExecuteTransfer = () => {
    const numAmount = Math.round(parseFloat(amount) * 100) / 100;
    if (isNaN(numAmount) || numAmount <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid transfer amount');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance in selected account');
      return;
    }

    requestAction({
      title: `Authorize Transfer of ${formatCurrency(numAmount, 'INR')}?`,
      message: `Transfer ${formatCurrency(numAmount, 'INR')} from ${selectedAccount?.accountType} (${selectedAccount?.maskedAccountNumber}) to ${recipientName} (${recipientBank})?`,
      confirmLabel: 'Authorize with MPIN',
      requireMpin: true,
      onConfirm: async () => {
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
        if (!res.success) {
          toast.error(res.error || 'Payment execution failed');
          throw new Error(res.error || 'Payment execution failed');
        }
        setTransferStep(1);
        const doneRef = reference;
        setReference('TXN/NEFT/' + Date.now().toString().slice(-6));
        return {
          title: 'Transfer Executed',
          message: `${formatCurrency(numAmount, 'INR')} transferred successfully to ${recipientName}.`,
          icon: 'check',
          referenceId: doneRef,
          relatedButtons: [
            { label: 'View Activity Ledger', variant: 'secondary', onClick: () => navigate('/transactions') },
            { label: 'Download Receipt', variant: 'primary', onClick: () => navigate('/statements') },
          ],
        };
      },
    });
  };

  const handleExecuteBillPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Math.round(parseFloat(billAmount) * 100) / 100;
    if (isNaN(numAmount) || numAmount <= 0 || !effectiveSourceAccountId) {
      toast.error('Please enter a valid bill amount');
      return;
    }
    if (selectedAccount && selectedAccount.managedBalance < numAmount) {
      toast.error('Insufficient available balance in selected account');
      return;
    }
    const ref = 'BILL/' + Date.now().toString().slice(-6);

    requestAction({
      title: `Pay ${billerProvider} Bill?`,
      message: `Confirm utility payment of ${formatCurrency(numAmount, 'INR')} for Consumer #${consumerNumber}?`,
      confirmLabel: 'Authorize with MPIN',
      requireMpin: true,
      onConfirm: async () => {
        const res = await submitTransfer(effectiveSourceAccountId, {
          recipientName: billerProvider,
          recipientAccount: consumerNumber,
          recipientBank: 'Utility Aggregator Gateway',
          ifscCode: 'HSBC0641002',
          amount: numAmount,
          reference: ref,
          category: 'UTILITIES',
          note: `Bill Payment - ${selectedBillCategory}`,
        });
        if (!res.success) {
          toast.error(res.error || 'Bill payment failed');
          throw new Error(res.error || 'Bill payment failed');
        }
        return {
          title: 'Bill Payment Processed',
          message: `Paid ${formatCurrency(numAmount, 'INR')} to ${billerProvider}.`,
          icon: 'check',
          referenceId: ref,
          relatedButtons: [
            { label: 'View Activity Ledger', variant: 'secondary', onClick: () => navigate('/transactions') },
          ],
        };
      },
    });
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
                Pay &amp; Transfer
              </h1>
              <p className="text-xs text-[#777777] mt-0.5">
                NEFT/RTGS/IMPS domestic transfers, Global Money &amp; utility bills (UPI available on HSBC SimplyPay)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPayeeModal(true)}
              className="self-start sm:self-auto min-h-[38px] px-4 bg-[#F5F6F8] hover:bg-[#EBECEF] active:scale-[0.98] text-[#1f1f1f] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
              <span>Add Payee</span>
            </button>
          </div>

          {/* 4 CIRCULAR ACTION BUTTONS (MATCHES REFERENCE DESIGN) */}
          <div className="pt-5 pb-3 grid grid-cols-4 gap-2 max-w-md mx-auto sm:max-w-xl">
            <button
              type="button"
              onClick={() => { setActiveTab('TRANSFER'); setTransferStep(1); }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full transition-all flex items-center justify-center shadow-xs active:scale-[0.96] ${
                activeTab === 'TRANSFER' ? 'bg-red-50 ring-2 ring-[#DB0011]' : 'bg-[#F5F6F8] group-hover:bg-[#EBECEF]'
              }`}>
                <ArrowLeftRight className={`w-6 h-6 stroke-[1.8] ${activeTab === 'TRANSFER' ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Domestic<br />transfer
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('GLOBAL')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full transition-all flex items-center justify-center shadow-xs active:scale-[0.96] ${
                activeTab === 'GLOBAL' ? 'bg-red-50 ring-2 ring-[#DB0011]' : 'bg-[#F5F6F8] group-hover:bg-[#EBECEF]'
              }`}>
                <Globe2 className={`w-6 h-6 stroke-[1.8] ${activeTab === 'GLOBAL' ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Global<br />money
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('BILL_PAY')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full transition-all flex items-center justify-center shadow-xs active:scale-[0.96] ${
                activeTab === 'BILL_PAY' ? 'bg-red-50 ring-2 ring-[#DB0011]' : 'bg-[#F5F6F8] group-hover:bg-[#EBECEF]'
              }`}>
                <Zap className={`w-6 h-6 stroke-[1.8] ${activeTab === 'BILL_PAY' ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Pay<br />bills
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddPayeeModal(true)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full bg-[#F5F6F8] group-hover:bg-[#EBECEF] transition-all flex items-center justify-center shadow-xs active:scale-[0.96]">
                <UserPlus className="w-6 h-6 text-[#DB0011] stroke-[1.8]" aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Add<br />payee
              </span>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
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
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#DB0011] rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6">
          {/* TAB 1: DOMESTIC TRANSFERS */}
          {activeTab === 'TRANSFER' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-1">
                {[1, 2, 3, 4, 5].map(step => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        transferStep === step ? 'bg-[#DB0011] text-white' : transferStep > step ? 'bg-[#16864A] text-white' : 'bg-[#F2F4F7] text-gray-500'
                      }`}
                    >
                      {transferStep > step ? '✓' : step}
                    </div>
                    <span className="hidden sm:inline text-[11px] font-semibold text-[#555555]">
                      {step === 1 ? 'Type' : step === 2 ? 'From' : step === 3 ? 'To' : step === 4 ? 'Amount' : 'Review'}
                    </span>
                  </div>
                ))}
              </div>

              {transferStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 1: Select Transfer Type</h2>
                  <div className="divide-y divide-gray-100 border border-gray-200/80 rounded-2xl overflow-hidden bg-white">
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
                          className={`w-full min-h-[58px] p-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group ${
                            isSelected ? 'bg-red-50/40' : 'hover:bg-gray-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shrink-0">
                              <Icon className={`w-5 h-5 stroke-[1.8] ${isSelected ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-[#1f1f1f]">{item.title}</div>
                              <div className="text-[12px] text-[#777777] mt-0.5">{item.desc}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#DB0011]" />
                            )}
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1f1f1f] transition-colors" aria-hidden="true" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (transferType === 'INTERNATIONAL') setActiveTab('GLOBAL');
                        else setTransferStep(2);
                      }}
                      className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
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
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
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
                              <div className="text-xs font-bold text-[#1f1f1f]">HSBC Premier Savings</div>
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
                    <button type="button" onClick={() => setTransferStep(1)} className="min-h-[44px] px-5 bg-[#F5F6F8] hover:bg-[#EBECEF] text-[#1f1f1f] rounded-full text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer">Back</button>
                    <button type="button" onClick={() => setTransferStep(3)} className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"><span>Continue</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
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
                          className={`px-4 py-2 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                            recipientAccount === b.account ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]' : 'bg-[#F5F6F8] text-[#1f1f1f] border-transparent hover:bg-gray-200'
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
                          className={`px-4 py-2 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                            recipientAccount === acc.accountNumber ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]' : 'bg-[#F5F6F8] text-[#1f1f1f] border-transparent hover:bg-gray-200'
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
                      <input id="pay-rec-name" type="text" required value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-acc" className="font-bold text-[#555555] block mb-1.5">Account Number</label>
                      <input id="pay-rec-acc" type="text" required value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-bank" className="font-bold text-[#555555] block mb-1.5">Bank Name</label>
                      <input id="pay-rec-bank" type="text" required value={recipientBank} onChange={e => setRecipientBank(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
                    </div>
                    <div>
                      <label htmlFor="pay-rec-ifsc" className="font-bold text-[#555555] block mb-1.5">IFSC Code</label>
                      <input id="pay-rec-ifsc" type="text" required value={ifscCode} onChange={e => setIfscCode(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono uppercase" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(2)} className="min-h-[44px] px-5 bg-[#F5F6F8] hover:bg-[#EBECEF] text-[#1f1f1f] rounded-full text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer">Back</button>
                    <button type="button" onClick={() => { if (!recipientName.trim() || !recipientAccount.trim()) { toast.error('Enter beneficiary details'); return; } setTransferStep(4); }} className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"><span>Continue</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {transferStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 4: Amount &amp; Reference</h2>
                  <div>
                    <label htmlFor="pay-amount" className="font-bold text-[#555555] block mb-1.5 text-xs">Amount (INR ₹)</label>
                    <input id="pay-amount" type="number" step="0.01" required min="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3.5 bg-[#F6F7F9] border border-gray-200 rounded-xl text-2xl font-bold text-[#1f1f1f]" placeholder="0.00" />
                    <span className="text-[11px] text-[#777777] mt-1 block">Available: {formatCurrency(selectedAccount?.managedBalance || 0, 'INR')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label htmlFor="pay-ref" className="font-bold text-[#555555] block mb-1.5">Reference</label>
                      <input id="pay-ref" type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono" />
                    </div>
                    <div>
                      <label htmlFor="pay-desc" className="font-bold text-[#555555] block mb-1.5">Remarks</label>
                      <input id="pay-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(3)} className="min-h-[44px] px-5 bg-[#F5F6F8] hover:bg-[#EBECEF] text-[#1f1f1f] rounded-full text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer">Back</button>
                    <button type="button" onClick={() => setTransferStep(5)} className="min-h-[44px] px-6 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"><span>Review</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {transferStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Step 5: Review Authorization</h2>
                  <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200 space-y-3 text-xs">
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">From</span><span className="font-bold">{selectedAccount?.accountType} ({selectedAccount?.maskedAccountNumber})</span></div>
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">To</span><span className="font-bold">{recipientName}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-[#777777]">Bank</span><span className="font-mono">{recipientBank} ({ifscCode})</span></div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200"><span>Total Amount</span><span className="text-[#DB0011]">{formatCurrency(parseFloat(amount) || 0, 'INR')}</span></div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setTransferStep(4)} className="min-h-[44px] px-5 bg-[#F5F6F8] hover:bg-[#EBECEF] text-[#1f1f1f] rounded-full text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer">Back</button>
                    <button type="button" onClick={handleExecuteTransfer} className="min-h-[44px] px-7 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs">Confirm &amp; Pay</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBAL MONEY */}
          {activeTab === 'GLOBAL' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DB0011] text-white uppercase">HSBC Global Money</span>
                  <span className="text-[10px] font-bold text-[#16864A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Zero FX Fee for Premier</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f] mt-2">International Remittance</h2>
              </div>
              <form onSubmit={handleExecuteGlobalTransfer} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { code: 'GB', name: 'United Kingdom', currency: 'GBP', rate: 118.40, flag: '🇬🇧' },
                    { code: 'US', name: 'United States', currency: 'USD', rate: 95.43, flag: '🇺🇸' },
                    { code: 'AE', name: 'UAE', currency: 'AED', rate: 25.98, flag: '🇦🇪' },
                    { code: 'SG', name: 'Singapore', currency: 'SGD', rate: 71.85, flag: '🇸🇬' },
                    { code: 'EU', name: 'Eurozone', currency: 'EUR', rate: 103.60, flag: '🇪🇺' },
                    { code: 'CA', name: 'Canada', currency: 'CAD', rate: 69.20, flag: '🇨🇦' },
                  ].map(c => (
                    <button key={c.code} type="button" onClick={() => setGlobalCountry(c)} className={`p-3 rounded-2xl text-left cursor-pointer border transition-all ${globalCountry.code === c.code ? 'border-[#DB0011] bg-red-50/40 ring-1 ring-[#DB0011]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <div className="text-base">{c.flag}</div>
                      <div className="font-bold text-[#1f1f1f] mt-1">{c.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">1 {c.currency} = ₹{c.rate.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-[#F6F7F9] rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="global-inr" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">You Send (INR ₹)</label>
                    <input id="global-inr" type="number" step="0.01" required min="100" value={globalInrAmount} onChange={e => setGlobalInrAmount(e.target.value)} className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-bold text-sm" />
                  </div>
                  <div>
                    <div className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Recipient Gets ({globalCountry.currency})</div>
                    <div className="h-11 px-3 bg-white border border-gray-200 rounded-xl font-bold text-sm font-mono text-[#16864A] flex items-center">{globalCountry.currency} {(parseFloat(globalInrAmount || '0') / globalCountry.rate).toFixed(2)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" required aria-label="Beneficiary Name" value={globalBeneficiaryName} onChange={e => setGlobalBeneficiaryName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
                  <select aria-label="Purpose" value={globalPurpose} onChange={e => setGlobalPurpose(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold">
                    <option>Education &amp; University Fees</option>
                    <option>Family Maintenance</option>
                    <option>Medical Treatment</option>
                    <option>Overseas Travel</option>
                  </select>
                  <input type="text" required aria-label="IBAN" value={globalIban} onChange={e => setGlobalIban(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono uppercase" />
                  <input type="text" required aria-label="SWIFT" value={globalSwift} onChange={e => setGlobalSwift(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono uppercase" />
                </div>
                <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">Authorize Global Transfer</button>
              </form>
            </div>
          )}

          {/* TAB 3: BILL PAYMENTS */}
          {activeTab === 'BILL_PAY' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BILL_CATEGORIES.map(b => (
                  <button key={b.id} type="button" onClick={() => { setSelectedBillCategory(b.id); setBillerProvider(b.billerExample.split(' / ')[0]); }} className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${selectedBillCategory === b.id ? 'bg-red-50/40 border-[#DB0011] text-[#DB0011]' : 'bg-[#F6F7F9] border-transparent text-[#1f1f1f] hover:bg-gray-100'}`}>
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[10px] font-semibold truncate max-w-full">{b.name}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleExecuteBillPayment} className="space-y-4 text-xs border-t border-gray-100 pt-5">
                <h2 className="text-base font-bold text-[#1f1f1f]">Pay {selectedBillCategory} Bill</h2>
                <input type="text" required aria-label="Service Provider" value={billerProvider} onChange={e => setBillerProvider(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
                <input type="text" required aria-label="Consumer Number" value={consumerNumber} onChange={e => setConsumerNumber(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select aria-label="Source Account" value={effectiveSourceAccountId} onChange={e => setSourceAccountId(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold">
                    {accounts.map(acc => <option key={acc.accountId} value={acc.accountId}>{acc.accountType} ({acc.maskedAccountNumber})</option>)}
                  </select>
                  <input type="number" step="0.01" required min="0.01" aria-label="Bill Amount" value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-bold" />
                </div>
                <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white text-xs font-semibold rounded-full transition-all cursor-pointer shadow-xs">Authorize &amp; Pay Bill</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Beneficiary Dialog */}
      <ModalDialog open={showAddPayeeModal} onClose={() => setShowAddPayeeModal(false)} title="Add New Beneficiary" maxWidthClass="max-w-sm">
        <form onSubmit={handleAddBeneficiary} className="space-y-3 text-xs">
          <input type="text" required placeholder="Full Legal Name" value={newPayeeName} onChange={e => setNewPayeeName(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
          <input type="text" required placeholder="Account Number" value={newPayeeAcc} onChange={e => setNewPayeeAcc(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono" />
          <input type="text" required placeholder="Bank Name" value={newPayeeBank} onChange={e => setNewPayeeBank(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
          <input type="text" required placeholder="IFSC Code (e.g. HDFC0000060)" value={newPayeeIfsc} onChange={e => setNewPayeeIfsc(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono uppercase" />
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white font-semibold rounded-full transition-all cursor-pointer shadow-xs">
            Verify &amp; Save Payee
          </button>
        </form>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
