import React, { useState } from 'react';
import { CardRecord } from '@shared/types';
import { useBanking } from '../../context/BankingContext';
import { useAppLock } from '../../context/AppLockContext';
import { HsbcCardCarousel } from '../../components/Cards/HsbcCardCarousel';
import { ModalDialog } from '../../components/common/ModalDialog';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { formatINR } from '@shared/utils/formatters';
import {
  ArrowRight,
  Snowflake,
  CheckCircle2,
  ShieldCheck,
  Copy,
  KeyRound,
  CreditCard,
  Calculator,
  Eye,
  PlusCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CardsPage: React.FC = () => {
  const { cards, accounts, transactions, updateCardSettings, submitTransfer } = useBanking();
  const { verifyPin } = useAppLock();

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Modals state
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showResetPinModal, setShowResetPinModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showGamblingModal, setShowGamblingModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);

  // View PIN / Card Details verification state
  const [pinVerificationInput, setPinVerificationInput] = useState('');
  const [pinRevealed, setPinRevealed] = useState(false);
  const [detailsRevealed, setDetailsRevealed] = useState(false);

  // Reset Card PIN state
  const [newCardPin, setNewCardPin] = useState('');
  const [confirmCardPin, setConfirmCardPin] = useState('');

  // Activate new card state
  const [activateLast4, setActivateLast4] = useState('');
  const [activateExpiry, setActivateExpiry] = useState('');

  // EMI calculator state
  const [emiAmount, setEmiAmount] = useState(50000);
  const [emiTenure, setEmiTenure] = useState(12);

  // Credit Card Bill Pay state
  const [payBillAmount, setPayBillAmount] = useState('10750');
  const [billSourceAccountId, setBillSourceAccountId] = useState('');

  // Active card selection
  const safeIndex = activeCardIndex < cards.length ? activeCardIndex : 0;
  const activeCard: CardRecord = cards[safeIndex] || {
    cardId: 'card-deb-4281',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'DEBIT',
    cardTier: 'PREMIER_PLATINUM',
    maskedCardNumber: '•••• •••• •••• 4281',
    expiryMonth: '08',
    expiryYear: '29',
    cardStatus: 'ACTIVE',
    spendingLimit: 250000,
    currentMonthSpent: 42100,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '8829',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  };

  const maskedFourDigits = activeCard.maskedCardNumber ? activeCard.maskedCardNumber.slice(-4) : '4281';
  const cardTitle =
    activeCard.cardTier === 'GLOBAL_TRAVEL'
      ? 'Business Debit Card'
      : activeCard.cardType === 'CREDIT'
      ? 'Credit Card'
      : 'Debit Card';

  const isFrozen = activeCard.cardStatus === 'FROZEN' || activeCard.cardStatus === 'BLOCKED';
  const gamblingBlocked = activeCard.gamblingRestricted ?? true;
  const linkedAccount = accounts.find(a => a.accountId === activeCard.accountId) || accounts[0];
  const spentPct = Math.min(
    100,
    Math.round(((activeCard.currentMonthSpent || 0) / Math.max(1, activeCard.spendingLimit || 200000)) * 100)
  );

  // Card Transactions
  const cardTransactions = transactions
    .filter(t => t.accountId === activeCard.accountId || t.category === 'DINING' || t.category === 'SHOPPING')
    .slice(0, 4);

  const revealedCardPin = activeCard.cardPin || (activeCard.cardType === 'CREDIT' ? '4192' : '8829');
  const fullVirtualNumber =
    activeCard.cardTier === 'GLOBAL_TRAVEL'
      ? `4532 8829 4102 ${maskedFourDigits}`
      : activeCard.cardType === 'CREDIT'
      ? `5412 7500 8829 ${maskedFourDigits}`
      : `4532 8829 4101 ${maskedFourDigits}`;

  const handleToggleFreeze = () => {
    const newStatus = isFrozen ? 'ACTIVE' : 'FROZEN';
    updateCardSettings(activeCard.cardId, { cardStatus: newStatus });
    toast.success(
      isFrozen
        ? `${cardTitle} •••• ${maskedFourDigits} un-frozen and active.`
        : `${cardTitle} •••• ${maskedFourDigits} frozen. All transactions blocked.`
    );
  };

  const handleToggleGambling = (nextVal: boolean) => {
    updateCardSettings(activeCard.cardId, { gamblingRestricted: nextVal });
    toast.success(
      nextVal
        ? 'Gambling restriction activated (MCC 7995 blocked).'
        : 'Gambling restriction turned off.'
    );
  };

  const handleVerifyPinForReveal = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyPin(pinVerificationInput);
    if (res.success || pinVerificationInput === '002831') {
      setPinRevealed(true);
      toast.success('Security verified. 4-Digit Card PIN revealed.');
    } else {
      toast.error(res.message || 'Incorrect 6-digit PIN. Please try again.');
    }
  };

  const handleVerifyForCardDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyPin(pinVerificationInput);
    if (res.success || pinVerificationInput === '002831') {
      setDetailsRevealed(true);
      toast.success('Card credentials unlocked.');
    } else {
      toast.error(res.message || 'Incorrect 6-digit PIN.');
    }
  };

  const handleSaveNewCardPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardPin.length !== 4 || !/^\d{4}$/.test(newCardPin)) {
      toast.error('Card ATM PIN must be exactly 4 numeric digits.');
      return;
    }
    if (newCardPin !== confirmCardPin) {
      toast.error('Card PIN entries do not match.');
      return;
    }
    updateCardSettings(activeCard.cardId, { cardPin: newCardPin });
    toast.success(`4-Digit PIN updated for ${cardTitle} •••• ${maskedFourDigits}.`);
    setNewCardPin('');
    setConfirmCardPin('');
    setShowResetPinModal(false);
  };

  const handleActivateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (activateLast4.length !== 4) {
      toast.error('Please enter the 4 trailing card digits.');
      return;
    }
    updateCardSettings(activeCard.cardId, { isActivated: true, cardStatus: 'ACTIVE' });
    toast.success(`Card ending in ${activateLast4} activated for contactless & online transactions!`);
    setActivateLast4('');
    setActivateExpiry('');
    setShowActivateModal(false);
  };

  const handlePayCreditBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const srcId = billSourceAccountId || accounts[0]?.accountId || '';
    const amt = parseFloat(payBillAmount);
    if (!srcId || isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid payment amount');
      return;
    }
    const res = await submitTransfer(srcId, {
      recipientName: `HSBC Credit Card •••• ${maskedFourDigits}`,
      recipientAccount: activeCard.maskedCardNumber,
      recipientBank: 'HSBC Card Services India',
      ifscCode: 'HSBC0400002',
      amount: amt,
      reference: 'CCBILL/' + Date.now().toString().slice(-6),
      category: 'TRANSFER',
      note: 'Credit Card Bill Settlement',
    });
    if (res.success) {
      updateCardSettings(activeCard.cardId, {
        currentMonthSpent: Math.max(0, (activeCard.currentMonthSpent || 0) - amt),
        availableCredit: Math.min(activeCard.creditLimit || 1000000, (activeCard.availableCredit || 785000) + amt),
      });
      toast.success(`Paid ${formatINR(amt)} towards Credit Card •••• ${maskedFourDigits}!`);
      setShowPayBillModal(false);
    } else {
      toast.error(res.error || 'Bill payment failed');
    }
  };

  const monthlyEmi = Math.round((emiAmount * (1 + (0.14 * (emiTenure / 12)))) / emiTenure);

  return (
    <div className="w-full select-none font-sans pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs md:p-6 lg:p-8">
        {/* Card Quick Switcher Pills (Ensures both Debit Cards & Credit Card are immediately accessible) */}
        {cards.length > 0 && (
          <div className="px-4 md:px-0 pt-4 md:pt-0 pb-2 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
            {cards.map((c, idx) => {
              const selected = idx === safeIndex;
              const label =
                c.cardTier === 'GLOBAL_TRAVEL'
                  ? `Business Debit •${c.maskedCardNumber.slice(-4)}`
                  : c.cardType === 'CREDIT'
                  ? `Credit •${c.maskedCardNumber.slice(-4)}`
                  : `Debit •${c.maskedCardNumber.slice(-4)}`;
              return (
                <button
                  key={c.cardId}
                  type="button"
                  onClick={() => setActiveCardIndex(idx)}
                  className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                      : 'bg-[#F2F4F7] text-[#333333] border-transparent hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-6">
            {/* CARD TITLE & MASKED DIGITS */}
            <div className="pt-2 pb-1 text-center">
              <div className="inline-flex items-center gap-2">
                <h1 className="text-[17px] font-semibold text-[#1f1f1f]">
                  {cardTitle}
                </h1>
                {isFrozen && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#DB0011] text-[10px] font-bold uppercase tracking-wider border border-red-200">
                    Frozen
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#777777] font-medium tracking-wide mt-0.5">
                •••• {maskedFourDigits}
              </p>
            </div>

            {/* PEEKING 3-CARD CAROUSEL */}
            <div className="pt-2 pb-4">
              <HsbcCardCarousel
                cards={cards.length > 0 ? cards : [activeCard]}
                activeIndex={safeIndex}
                onCardChange={index => setActiveCardIndex(index)}
              />
            </div>

            {/* 4 CIRCULAR ACTION BUTTONS */}
            <div className="px-2 sm:px-3 py-4 grid grid-cols-4 gap-1.5 sm:gap-3 max-w-md mx-auto">
              {/* 1. Report a card issue */}
              <button
                type="button"
                onClick={() => setShowReportIssueModal(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="4" y="8" width="24" height="16" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
                    <path d="M4 12.5h24" stroke="#DB0011" strokeWidth="2" />
                    <polygon points="16,14 21,22 11,22" fill="#DB0011" />
                    <line x1="16" y1="16.5" x2="16" y2="19.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="16" cy="21" r="0.6" fill="white" />
                  </svg>
                </div>
                <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                  Report a card<br />issue
                </span>
              </button>

              {/* 2. View card PIN */}
              <button
                type="button"
                onClick={() => {
                  setPinVerificationInput('');
                  setPinRevealed(false);
                  setShowPinModal(true);
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="10" y="6" width="18" height="13" rx="2" fill="white" stroke="#555555" strokeWidth="1.3" />
                    <rect x="4" y="11" width="19" height="14" rx="2" fill="white" stroke="#DB0011" strokeWidth="1.5" />
                    <rect x="7" y="16" width="13" height="6" rx="1.2" fill="#F3F4F6" stroke="#999999" strokeWidth="0.8" />
                    <circle cx="9.5" cy="19" r="0.9" fill="#1f1f1f" />
                    <circle cx="12" cy="19" r="0.9" fill="#1f1f1f" />
                    <circle cx="14.5" cy="19" r="0.9" fill="#1f1f1f" />
                    <circle cx="17" cy="19" r="0.9" fill="#1f1f1f" />
                  </svg>
                </div>
                <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                  View card<br />PIN
                </span>
              </button>

              {/* 3. Freeze / Unfreeze card */}
              <button
                type="button"
                onClick={handleToggleFreeze}
                aria-pressed={isFrozen}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full transition-colors flex items-center justify-center ${
                    isFrozen
                      ? 'bg-red-100 ring-2 ring-[#DB0011]'
                      : 'bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300'
                  }`}
                >
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <rect x="4" y="8" width="24" height="16" rx="2.5" fill={isFrozen ? '#1D4ED8' : '#DB0011'} />
                    <rect x="4" y="10.5" width="24" height="2.5" fill="white" opacity="0.9" />
                    <g transform="translate(11, 18)" stroke="white" strokeWidth="1.4" strokeLinecap="round">
                      <line x1="0" y1="-4" x2="0" y2="4" />
                      <line x1="-3.46" y1="-2" x2="3.46" y2="2" />
                      <line x1="-3.46" y1="2" x2="3.46" y2="-2" />
                    </g>
                  </svg>
                </div>
                <span className={`text-[11px] min-[360px]:text-[12px] font-medium leading-tight mt-2 text-center ${isFrozen ? 'text-[#DB0011] font-bold' : 'text-[#1f1f1f]'}`}>
                  {isFrozen ? 'Unfreeze' : 'Freeze'}<br />card
                </span>
              </button>

              {/* 4. Gambling restriction */}
              <button
                type="button"
                onClick={() => setShowGamblingModal(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f] relative">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="11" stroke="#252525" strokeWidth="1.5" fill="white" />
                    <circle cx="16" cy="16" r="9" stroke="#DB0011" strokeWidth="2.2" strokeDasharray="3.8 3.2" fill="none" />
                    <circle cx="16" cy="16" r="5.5" stroke="#252525" strokeWidth="1.2" fill="white" />
                    <circle cx="16" cy="16" r="2.5" fill="#DB0011" />
                    <circle cx="16" cy="16" r="1" fill="white" />
                  </svg>
                  {gamblingBlocked && (
                    <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#16864A] border-2 border-white" title="Gambling Restriction Active" />
                  )}
                </div>
                <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                  Gambling<br />restriction
                </span>
              </button>
            </div>

            {/* Recent Card Spend Summary */}
            <div className="px-4 md:px-0 pt-2 max-w-md mx-auto">
              <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1f1f1f]">
                    {activeCard.cardType === 'CREDIT' ? 'Credit Utilization' : 'Daily Limit & Monthly Spend'}
                  </span>
                  <span className="font-mono font-bold text-[#1f1f1f]">
                    {formatINR(activeCard.currentMonthSpent || 0)} / {formatINR(activeCard.spendingLimit || 250000)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${isFrozen ? 'bg-gray-400' : 'bg-[#DB0011]'}`}
                    style={{ width: `${spentPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#555555]">
                  <span>
                    Linked: <strong className="text-[#1f1f1f]">{linkedAccount?.accountType === 'CURRENT' ? 'Business Current' : 'Premier Savings'} ({linkedAccount?.maskedAccountNumber?.slice(-4) || '4101'})</strong>
                  </span>
                  <span className={`font-semibold flex items-center gap-1 ${isFrozen ? 'text-[#DB0011]' : 'text-[#16864A]'}`}>
                    {isFrozen ? <Snowflake className="w-3 h-3" aria-hidden="true" /> : <CheckCircle2 className="w-3 h-3" aria-hidden="true" />}
                    <span>{isFrozen ? 'Frozen' : 'Active'}</span>
                  </span>
                </div>

                {activeCard.cardType === 'CREDIT' && (
                  <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[#777777] text-[11px] block">Available Credit: <strong className="text-[#1f1f1f]">{formatINR(activeCard.availableCredit || 785000)}</strong></span>
                      <span className="text-[#777777] text-[10px]">Min Due {formatINR(activeCard.minDue || 10750)} • {activeCard.dueDate}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPayBillAmount(String(activeCard.minDue || 10750));
                        setShowPayBillModal(true);
                      }}
                      className="min-h-[34px] px-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-[11px] font-semibold rounded-[2px] cursor-pointer"
                    >
                      Pay Bill
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIST ACTION ROWS (Matching Cards UI + Legitimate In-Depth HSBC Card Tools) */}
          <div className="lg:col-span-6 space-y-5 px-4 md:px-0 pt-3 lg:pt-0 max-w-md mx-auto lg:max-w-none w-full">
            <div className="divide-y divide-gray-100">
              {/* Row 1: Manage account */}
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" aria-hidden="true">
                      <rect x="5" y="7" width="18" height="14" rx="2.5" fill="#DB0011" />
                      <rect x="8" y="9.5" width="12" height="2" rx="1" fill="white" />
                      <circle cx="14" cy="15.5" r="1.6" fill="white" />
                      <line x1="14" y1="16.5" x2="14" y2="18.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">Manage account</span>
                    <span className="text-[11px] text-[#777777] block">ATM, POS, online, contactless &amp; international limits</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>

              {/* Row 2: View full card number & CVV */}
              <button
                type="button"
                onClick={() => {
                  setPinVerificationInput('');
                  setDetailsRevealed(false);
                  setShowCardDetailsModal(true);
                }}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0 text-[#DB0011]">
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">View card number &amp; CVV</span>
                    <span className="text-[11px] text-[#777777] block">Reveal full 16-digit PAN and expiry safely</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>

              {/* Row 3: Reset / Change 4-digit card PIN */}
              <button
                type="button"
                onClick={() => setShowResetPinModal(true)}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0 text-[#1f1f1f]">
                    <KeyRound className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">Reset card ATM PIN</span>
                    <span className="text-[11px] text-[#777777] block">Instant 4-digit PIN update without branch visit</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>

              {/* Row 4: Activate new physical card */}
              <button
                type="button"
                onClick={() => setShowActivateModal(true)}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0 text-[#DB0011]">
                    <PlusCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">Activate physical card</span>
                    <span className="text-[11px] text-[#777777] block">Enable newly delivered replacement or debit card</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>

              {/* Row 5: Cash on EMI / Convert to EMI */}
              <button
                type="button"
                onClick={() => setShowEmiModal(true)}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0 text-[#1f1f1f]">
                    <Calculator className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">Convert to EMI &amp; Cash on EMI</span>
                    <span className="text-[11px] text-[#777777] block">Split high-value purchases into 3 to 24 installments</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>

              {/* Row 6: Explore more products */}
              <button
                type="button"
                onClick={() => setShowExploreModal(true)}
                className="w-full min-h-[60px] py-3.5 px-2 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" aria-hidden="true">
                      <rect x="8" y="6" width="15" height="11" rx="2" fill="#99000A" />
                      <rect x="5" y="10" width="16" height="12" rx="2" fill="#DB0011" stroke="white" strokeWidth="0.8" />
                      <line x1="5" y1="13.5" x2="21" y2="13.5" stroke="white" strokeWidth="1.2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[15px] font-semibold text-[#1f1f1f] block">Explore more products</span>
                    <span className="text-[11px] text-[#777777] block">Premier Metal cards &amp; Global Money multi-currency</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] transition-colors shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* Card Recent Transactions Preview */}
            {cardTransactions.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-2">
                  Recent Activity on Linked Account
                </div>
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {cardTransactions.map(tx => (
                    <div key={tx.transactionId} className="py-3 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1f1f1f] truncate">{tx.description}</div>
                        <div className="text-[10px] text-[#777777]">{tx.transactionDate}</div>
                      </div>
                      <div className={`font-bold shrink-0 ${tx.transactionType === 'CREDIT' ? 'text-[#16864A]' : 'text-[#1f1f1f]'}`}>
                        {tx.transactionType === 'CREDIT' ? '+' : '-'} {formatINR(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. REPORT A CARD ISSUE */}
      <ModalDialog open={showReportIssueModal} onClose={() => setShowReportIssueModal(false)} title="Report a card issue" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        <p className="text-xs text-gray-500 leading-relaxed">
          If your card has been lost, stolen, or compromised, report it immediately to freeze authorization.
        </p>
        <div className="mt-4 space-y-2">
          {[
            { title: 'Lost or misplaced card', desc: 'Temporary block while you search' },
            { title: 'Stolen card', desc: 'Permanent cancellation and replacement dispatch' },
            { title: 'Damaged or unreadable chip', desc: 'Order replacement contactless card' },
            { title: 'Unrecognized transaction dispute', desc: 'Zero liability fraud investigation' },
          ].map(opt => (
            <button
              key={opt.title}
              type="button"
              onClick={() => {
                setShowReportIssueModal(false);
                updateCardSettings(activeCard.cardId, { cardStatus: 'FROZEN' });
                toast.success(`Case logged for ${opt.title}. Card frozen for security.`);
              }}
              className="w-full p-3.5 text-left rounded-xl border border-gray-200 hover:border-[#DB0011] hover:bg-red-50/30 transition-all flex items-center justify-between text-xs cursor-pointer"
            >
              <div>
                <div className="font-bold text-[#1f1f1f]">{opt.title}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </ModalDialog>

      {/* 2. VIEW CARD PIN */}
      <ModalDialog open={showPinModal} onClose={() => setShowPinModal(false)} title="View card PIN" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        {!pinRevealed ? (
          <form onSubmit={handleVerifyPinForReveal} className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter your 6-digit App-Lock PIN (<strong className="text-[#1f1f1f]">002831</strong>) to reveal your 4-digit card ATM PIN.
            </p>
            <div>
              <label htmlFor="view-card-pin-input" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                6-Digit App-Lock PIN
              </label>
              <input
                id="view-card-pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                required
                value={pinVerificationInput}
                onChange={e => setPinVerificationInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-base font-bold bg-[#F6F7F9] border border-gray-200 rounded-[2px] text-[#222222] focus:outline-none focus:border-[#DB0011]"
              />
            </div>
            <button type="submit" className="w-full min-h-[44px] py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-[2px] transition-colors cursor-pointer">
              Verify &amp; Reveal PIN
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-500">4-digit ATM PIN for card ending in <strong>{maskedFourDigits}</strong>:</p>
            <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200 flex items-center justify-center gap-3">
              <span className="text-3xl font-extrabold font-mono tracking-[0.3em] text-[#1f1f1f]">{revealedCardPin}</span>
              <button
                type="button"
                aria-label="Copy PIN"
                onClick={() => {
                  navigator.clipboard?.writeText(revealedCardPin);
                  toast.success('Card PIN copied temporarily');
                }}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-gray-500 hover:text-[#DB0011] hover:bg-white cursor-pointer"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <button type="button" onClick={() => setShowPinModal(false)} className="w-full min-h-[44px] py-2.5 bg-[#1f1f1f] hover:bg-black text-white text-xs font-bold rounded-[2px] cursor-pointer">
              Hide PIN
            </button>
          </div>
        )}
      </ModalDialog>

      {/* 3. GAMBLING RESTRICTION */}
      <ModalDialog open={showGamblingModal} onClose={() => setShowGamblingModal(false)} title="Gambling restriction" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        <p className="text-xs text-gray-500 leading-relaxed">
          Block transactions categorized as betting, casinos, lottery tickets, and online gambling (Merchant Category Code 7995).
        </p>
        <div className="my-5 p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-xs text-[#1f1f1f] block">Block Gambling Merchants</span>
            <span className="text-[11px] text-gray-500">{gamblingBlocked ? 'Currently active & protected' : 'Restriction disabled'}</span>
          </div>
          <ToggleSwitch checked={gamblingBlocked} onChange={handleToggleGambling} ariaLabel="Block Gambling Merchants" />
        </div>
        <div className="text-[11px] text-gray-500 leading-normal flex items-start gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-[#16864A] shrink-0 mt-0.5" aria-hidden="true" />
          <span>Turning off this restriction is subject to HSBC India responsible spending safeguards.</span>
        </div>
        <button type="button" onClick={() => setShowGamblingModal(false)} className="w-full min-h-[44px] py-2.5 bg-[#1f1f1f] hover:bg-black text-white text-xs font-bold rounded-[2px] cursor-pointer">
          Done
        </button>
      </ModalDialog>

      {/* 4. MANAGE ACCOUNT & GRANULAR CHANNEL LIMITS */}
      <ModalDialog open={showManageModal} onClose={() => setShowManageModal(false)} title="Manage account & limits" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-md">
        <div className="space-y-4">
          <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-gray-200 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-[#1f1f1f]">Temporary Card Freeze</div>
              <div className="text-[11px] text-gray-500">{isFrozen ? 'Card frozen — unblock anytime' : 'Card active for spending'}</div>
            </div>
            <ToggleSwitch checked={isFrozen} onChange={() => handleToggleFreeze()} ariaLabel="Temporary Card Freeze" activeColor="bg-[#DB0011]" />
          </div>

          <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="card-limit-slider" className="font-bold text-[#1f1f1f]">Daily Spending Limit</label>
              <span className="font-mono font-extrabold text-[#DB0011]">{formatINR(activeCard.spendingLimit || 250000)}</span>
            </div>
            <input
              id="card-limit-slider"
              type="range"
              min={25000}
              max={1000000}
              step={25000}
              value={activeCard.spendingLimit || 250000}
              onChange={e => updateCardSettings(activeCard.cardId, { spendingLimit: Number(e.target.value) })}
              className="w-full accent-[#DB0011] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>₹25,000</span>
              <span>₹5,00,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { key: 'atmEnabled' as const, label: 'ATM Cash Withdrawal', desc: 'Domestic & global ATM cash disbursements', val: activeCard.atmEnabled ?? true },
              { key: 'posEnabled' as const, label: 'In-Store POS Swipes', desc: 'Chip & PIN retail terminal purchases', val: activeCard.posEnabled ?? true },
              { key: 'onlineEnabled' as const, label: 'Online / E-Commerce Usage', desc: 'Merchant websites and apps', val: !!activeCard.onlineEnabled },
              { key: 'contactlessEnabled' as const, label: 'Contactless Tap to Pay', desc: 'Wave & pay without PIN up to ₹5,000', val: !!activeCard.contactlessEnabled },
              { key: 'internationalEnabled' as const, label: 'International Usage', desc: 'Overseas POS and foreign currency websites', val: !!activeCard.internationalEnabled },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
                <div className="pr-3">
                  <div className="font-bold text-xs text-[#1f1f1f]">{item.label}</div>
                  <div className="text-[11px] text-gray-500">{item.desc}</div>
                </div>
                <ToggleSwitch
                  checked={item.val}
                  onChange={checked => {
                    updateCardSettings(activeCard.cardId, { [item.key]: checked });
                    toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`);
                  }}
                  ariaLabel={item.label}
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={() => { setShowManageModal(false); toast.success('Card limits and channels saved'); }} className="w-full min-h-[44px] py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-[2px] cursor-pointer">
            Done
          </button>
        </div>
      </ModalDialog>

      {/* 5. VIEW FULL CARD NUMBER & CVV */}
      <ModalDialog open={showCardDetailsModal} onClose={() => setShowCardDetailsModal(false)} title="Card number & CVV" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        {!detailsRevealed ? (
          <form onSubmit={handleVerifyForCardDetails} className="space-y-4">
            <p className="text-xs text-gray-500">Enter your 6-digit App-Lock PIN (<strong>002831</strong>) to reveal your 16-digit card number and CVV.</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
              value={pinVerificationInput}
              onChange={e => setPinVerificationInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-base font-bold bg-[#F6F7F9] border border-gray-200 rounded-[2px]"
            />
            <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-[2px] cursor-pointer">
              Unlock Card Details
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#777777]">Card Number</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(fullVirtualNumber.replace(/\s+/g, ''));
                    toast.success('Card number copied');
                  }}
                  className="text-[#DB0011] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-base font-bold text-[#1f1f1f] tracking-wider">{fullVirtualNumber}</div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <span className="text-[#777777] block">Valid Thru</span>
                  <span className="font-mono font-bold text-[#1f1f1f]">{activeCard.expiryMonth}/{activeCard.expiryYear}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">CVV / Security Code</span>
                  <span className="font-mono font-bold text-[#1f1f1f]">{activeCard.cardType === 'CREDIT' ? '742' : '318'}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setShowCardDetailsModal(false)} className="w-full min-h-[44px] bg-[#1f1f1f] text-white font-bold rounded-[2px] cursor-pointer">
              Hide Details
            </button>
          </div>
        )}
      </ModalDialog>

      {/* 6. RESET / CHANGE 4-DIGIT CARD ATM PIN */}
      <ModalDialog open={showResetPinModal} onClose={() => setShowResetPinModal(false)} title="Reset card ATM PIN" subtitle={`${cardTitle} •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        <form onSubmit={handleSaveNewCardPin} className="space-y-3.5 text-xs">
          <p className="text-gray-500">Establish a new 4-digit ATM &amp; POS PIN for this card.</p>
          <div>
            <label htmlFor="rst-card-pin1" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New 4-Digit Card PIN</label>
            <input id="rst-card-pin1" type="password" inputMode="numeric" maxLength={4} required value={newCardPin} onChange={e => setNewCardPin(e.target.value.replace(/\D/g, ''))} className="w-full h-11 px-3 text-center tracking-[0.4em] font-mono font-bold bg-[#F6F7F9] border border-gray-200 rounded-[2px]" placeholder="••••" />
          </div>
          <div>
            <label htmlFor="rst-card-pin2" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Confirm 4-Digit Card PIN</label>
            <input id="rst-card-pin2" type="password" inputMode="numeric" maxLength={4} required value={confirmCardPin} onChange={e => setConfirmCardPin(e.target.value.replace(/\D/g, ''))} className="w-full h-11 px-3 text-center tracking-[0.4em] font-mono font-bold bg-[#F6F7F9] border border-gray-200 rounded-[2px]" placeholder="••••" />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold rounded-[2px] cursor-pointer">
            Update Card PIN
          </button>
        </form>
      </ModalDialog>

      {/* 7. ACTIVATE NEW PHYSICAL CARD */}
      <ModalDialog open={showActivateModal} onClose={() => setShowActivateModal(false)} title="Activate physical card" maxWidthClass="max-w-sm">
        <form onSubmit={handleActivateCard} className="space-y-3.5 text-xs">
          <p className="text-gray-500">Enter the last 4 digits and expiry date printed on your newly delivered HSBC card.</p>
          <div>
            <label htmlFor="act-last4" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Last 4 Digits</label>
            <input id="act-last4" type="text" inputMode="numeric" maxLength={4} required value={activateLast4} onChange={e => setActivateLast4(e.target.value.replace(/\D/g, ''))} className="w-full h-11 px-3 font-mono font-bold bg-[#F6F7F9] border border-gray-200 rounded-[2px]" placeholder="e.g. 4281" />
          </div>
          <div>
            <label htmlFor="act-exp" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Expiry Date (MM/YY)</label>
            <input id="act-exp" type="text" maxLength={5} required value={activateExpiry} onChange={e => setActivateExpiry(e.target.value)} className="w-full h-11 px-3 font-mono bg-[#F6F7F9] border border-gray-200 rounded-[2px]" placeholder="08/29" />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold rounded-[2px] cursor-pointer">
            Activate Card Instantly
          </button>
        </form>
      </ModalDialog>

      {/* 8. CONVERT TO EMI / CASH ON EMI */}
      <ModalDialog open={showEmiModal} onClose={() => setShowEmiModal(false)} title="Convert to EMI & Cash on EMI" subtitle={`Card •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        <div className="space-y-4 text-xs">
          <div>
            <label htmlFor="emi-amt" className="font-bold text-[#1f1f1f] flex justify-between mb-1.5">
              <span>Amount to Convert</span>
              <span className="font-mono text-[#DB0011]">{formatINR(emiAmount)}</span>
            </label>
            <input id="emi-amt" type="range" min={10000} max={500000} step={5000} value={emiAmount} onChange={e => setEmiAmount(Number(e.target.value))} className="w-full accent-[#DB0011]" />
          </div>
          <div>
            <span className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Tenure</span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map(m => (
                <button key={m} type="button" onClick={() => setEmiTenure(m)} className={`min-h-[36px] rounded-[2px] font-bold border cursor-pointer ${emiTenure === m ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]' : 'bg-[#F6F7F9] border-gray-200 text-[#1f1f1f]'}`}>
                  {m}M
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200 flex justify-between items-center">
            <span className="text-[#555555]">Estimated Monthly EMI (14% p.a.)</span>
            <span className="text-base font-bold text-[#1f1f1f]">{formatINR(monthlyEmi)}/mo</span>
          </div>
          <button
            type="button"
            onClick={() => {
              toast.success(`EMI plan for ${formatINR(emiAmount)} (${emiTenure} months @ ${formatINR(monthlyEmi)}/mo) confirmed!`);
              setShowEmiModal(false);
            }}
            className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold rounded-[2px] cursor-pointer"
          >
            Confirm EMI Conversion
          </button>
        </div>
      </ModalDialog>

      {/* 9. PAY CREDIT CARD BILL */}
      <ModalDialog open={showPayBillModal} onClose={() => setShowPayBillModal(false)} title="Pay Credit Card Bill" subtitle={`Card •••• ${maskedFourDigits}`} maxWidthClass="max-w-sm">
        <form onSubmit={handlePayCreditBill} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="cc-src" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Pay From Account</label>
            <select id="cc-src" value={billSourceAccountId || accounts[0]?.accountId || ''} onChange={e => setBillSourceAccountId(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-semibold">
              {accounts.map(acc => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.accountType} ({acc.maskedAccountNumber}) — {formatINR(acc.managedBalance)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cc-amt" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Payment Amount (INR ₹)</label>
            <input id="cc-amt" type="number" min={100} required value={payBillAmount} onChange={e => setPayBillAmount(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-bold text-sm" />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold rounded-[2px] cursor-pointer">
            Authorize Card Payment
          </button>
        </form>
      </ModalDialog>

      {/* 10. EXPLORE MORE PRODUCTS */}
      <ModalDialog open={showExploreModal} onClose={() => setShowExploreModal(false)} title="Explore more products" subtitle="Exclusive HSBC India Premier offers" maxWidthClass="max-w-md">
        <div className="space-y-3">
          {[
            { title: 'HSBC Premier Metal Credit Card', desc: 'Unlimited global airport lounge access, 4X reward points & concierge' },
            { title: 'Global Money Multi-Currency Account', desc: 'Hold, send and spend in 14 foreign currencies with zero markup' },
            { title: 'HSBC SmartValue Card', desc: '3X cashback on dining, groceries, fuel and streaming subscriptions' },
            { title: 'Pre-Approved Instant Personal Loan', desc: 'Funds disbursed in 2 hours with preferential Premier rates' },
          ].map(prod => (
            <div key={prod.title} className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200">
              <div className="font-bold text-xs text-[#1f1f1f]">{prod.title}</div>
              <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{prod.desc}</div>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Application initiated for ${prod.title}. A Premier Executive will connect.`);
                  setShowExploreModal(false);
                }}
                className="mt-3 min-h-[36px] text-xs font-bold text-[#DB0011] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Apply with 1-Click</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </ModalDialog>
    </div>
  );
};
