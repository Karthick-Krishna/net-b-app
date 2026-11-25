import React, { useState } from 'react';
import { CardRecord } from '@shared/types';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { HsbcCardCarousel } from '../../components/Cards/HsbcCardCarousel';
import { formatINR } from '@shared/utils/formatters';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  Snowflake,
  CreditCard,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CardsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { cards, accounts, updateCardSettings } = useBanking();

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Modals state
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showGamblingModal, setShowGamblingModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);

  // View PIN state
  const [pinVerificationInput, setPinVerificationInput] = useState('');
  const [pinRevealed, setPinRevealed] = useState(false);

  // Active card selection
  const activeCard: CardRecord = cards[activeCardIndex] || cards[0] || {
    cardId: 'card-sb-debit-01',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'DEBIT',
    cardTier: 'PREMIER_PLATINUM',
    maskedCardNumber: '•••• •••• •••• 1234',
    expiryMonth: '09',
    expiryYear: '29',
    cardStatus: 'ACTIVE',
    spendingLimit: 250000,
    currentMonthSpent: 18450,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    createdAt: '2026-11-24T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  };

  const maskedFourDigits = activeCard.maskedCardNumber
    ? activeCard.maskedCardNumber.slice(-4)
    : '1234';

  const cardTitle = activeCard.cardType === 'CREDIT' ? 'Credit Card' : 'Debit Card';

  // Toggle Card Freeze
  const handleToggleFreeze = () => {
    const isFrozen = activeCard.cardStatus === 'FROZEN';
    const newStatus = isFrozen ? 'ACTIVE' : 'FROZEN';
    updateCardSettings(activeCard.cardId, { cardStatus: newStatus });
    toast.success(
      isFrozen
        ? 'Card un-frozen and active for transactions.'
        : 'Card temporarily frozen. All transactions blocked.',
      { icon: isFrozen ? '🔓' : '❄️' }
    );
  };

  // Toggle Gambling Restriction
  const [gamblingBlocked, setGamblingBlocked] = useState(true);
  const handleToggleGambling = () => {
    setGamblingBlocked(!gamblingBlocked);
    toast.success(
      !gamblingBlocked
        ? 'Gambling restriction activated. Betting and gambling merchant codes blocked.'
        : 'Gambling restriction turned off.',
      { icon: '🛡️' }
    );
  };

  // View PIN verification
  const handleVerifyPinForReveal = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinVerificationInput === '002831' || pinVerificationInput.length === 6) {
      setPinRevealed(true);
      toast.success('Security verified. 4-Digit Card PIN revealed.');
    } else {
      toast.error('Incorrect MPIN. Please enter your 6-digit App-Lock PIN (002831).');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto select-none font-sans pb-10">
      {/* CARD TITLE & MASKED DIGITS (MATCHING SCREENSHOT) */}
      <div className="pt-2 pb-1 text-center">
        <h2 className="text-[17px] font-semibold text-[#1f1f1f]">
          {cardTitle}
        </h2>
        <p className="text-[14px] text-[#777777] font-medium tracking-wide mt-0.5">
          •••• {maskedFourDigits}
        </p>
      </div>

      {/* PEEKING CARD CAROUSEL (WITH ICONIC 3D METALLIC EMBLEM & PEEKING SIDES) */}
      <div className="pt-2 pb-5">
        <HsbcCardCarousel
          cards={cards.length > 0 ? cards : [activeCard]}
          activeIndex={activeCardIndex}
          onCardChange={index => setActiveCardIndex(index)}
        />
      </div>

      {/* 4 CIRCULAR ACTION BUTTONS (EXACT SCREENSHOT ICONS & TWO-LINE LABELS) */}
      <div className="px-3 py-4 grid grid-cols-4 gap-2">
        {/* 1. Report a card issue */}
        <button
          type="button"
          onClick={() => setShowReportIssueModal(true)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#F3F4F6] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Card with alert triangle inside */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.8]" fill="none" stroke="currentColor">
              <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="1.8" />
              <line x1="2" y1="10" x2="22" y2="10" strokeWidth="1.8" />
              <polygon points="12,12 15,17 9,17" stroke="#DB0011" strokeWidth="1.8" fill="#DB0011" fillOpacity="0.2" />
              <line x1="12" y1="14" x2="12" y2="15.5" stroke="#DB0011" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
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
          <div className="w-14 h-14 rounded-full bg-[#F3F4F6] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Overlapping cards with PIN dots */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.8]" fill="none" stroke="currentColor">
              <rect x="5" y="4" width="16" height="11" rx="1.5" strokeWidth="1.8" />
              <rect x="3" y="8" width="16" height="11" rx="1.5" strokeWidth="1.8" stroke="#DB0011" />
              <circle cx="6.5" cy="14" r="0.9" fill="#DB0011" />
              <circle cx="9.5" cy="14" r="0.9" fill="#DB0011" />
              <circle cx="12.5" cy="14" r="0.9" fill="#DB0011" />
              <circle cx="15.5" cy="14" r="0.9" fill="#DB0011" />
            </svg>
          </div>
          <span className="text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
            View card<br />PIN
          </span>
        </button>

        {/* 3. Freeze card */}
        <button
          type="button"
          onClick={handleToggleFreeze}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#F3F4F6] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Card with snowflake badge */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.8]" fill="none" stroke="currentColor">
              <rect x="3" y="6" width="18" height="13" rx="2" strokeWidth="1.8" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
              <path d="M12 12v5M9.5 13.5l5 2M14.5 13.5l-5 2" stroke="#DB0011" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
            {activeCard.cardStatus === 'FROZEN' ? 'Unfreeze' : 'Freeze'}<br />card
          </span>
        </button>

        {/* 4. Gambling restriction */}
        <button
          type="button"
          onClick={() => setShowGamblingModal(true)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#F3F4F6] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Gambling restriction roulette/chip symbol */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.8]" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4.5" strokeWidth="1.8" stroke="#DB0011" />
              <circle cx="12" cy="5.5" r="0.8" fill="currentColor" />
              <circle cx="12" cy="18.5" r="0.8" fill="currentColor" />
              <circle cx="5.5" cy="12" r="0.8" fill="currentColor" />
              <circle cx="18.5" cy="12" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
            Gambling<br />restriction
          </span>
        </button>
      </div>

      {/* LIST ACTION ROWS (MATCHING SCREENSHOT) */}
      <div className="px-4 pt-3 pb-8 space-y-3">
        {/* Row 1: Manage account */}
        <button
          type="button"
          onClick={() => setShowManageModal(true)}
          className="w-full py-4 px-3 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Red safe/mailbox icon inside light gray square */}
            <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <div className="w-6 h-6 rounded-xs bg-[#DB0011] text-white flex flex-col items-center justify-between p-1 shadow-xs">
                <span className="w-3.5 h-0.5 bg-white/90 rounded-full" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              </div>
            </div>
            <span className="text-[16px] font-semibold text-[#1f1f1f]">
              Manage account
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] stroke-[2] transition-colors" />
        </button>

        {/* Row 2: Explore more products */}
        <button
          type="button"
          onClick={() => setShowExploreModal(true)}
          className="w-full py-4 px-3 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Red credit cards/wallet icon inside light gray square */}
            <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <div className="w-6 h-5 rounded-xs bg-[#DB0011] text-white flex items-center justify-center shadow-xs">
                <div className="w-4 h-2.5 border border-white/90 rounded-xs" />
              </div>
            </div>
            <span className="text-[16px] font-semibold text-[#1f1f1f]">
              Explore more products
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] stroke-[2] transition-colors" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. REPORT A CARD ISSUE MODAL                             */}
      {/* ========================================================= */}
      {showReportIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">Report a card issue</h3>
              <button
                type="button"
                onClick={() => setShowReportIssueModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
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
                    toast.success(`Case logged for ${opt.title}. Card temporarily locked for security.`);
                  }}
                  className="w-full p-3 text-left rounded-xl border border-gray-200 hover:border-[#DB0011] hover:bg-red-50/30 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#1f1f1f]">{opt.title}</div>
                    <div className="text-[11px] text-gray-500">{opt.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VIEW CARD PIN MODAL                                   */}
      {/* ========================================================= */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 text-center">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                HSBC Card Security
              </span>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-12 h-12 rounded-full bg-red-50 text-[#DB0011] mx-auto flex items-center justify-center mb-2">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#1f1f1f]">View card PIN</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Confirm your 6-digit application MPIN to reveal the ATM/POS PIN for card •••• {maskedFourDigits}.
            </p>

            {!pinRevealed ? (
              <form onSubmit={handleVerifyPinForReveal} className="mt-5 space-y-3">
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  value={pinVerificationInput}
                  onChange={e => setPinVerificationInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit MPIN"
                  className="w-full py-2.5 px-4 text-center tracking-widest font-mono text-sm font-bold bg-gray-50 border border-gray-200 rounded-lg text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-[2px] transition-colors"
                >
                  Reveal 4-Digit PIN
                </button>
              </form>
            ) : (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Your 4-Digit ATM PIN
                </span>
                <span className="text-3xl font-extrabold tracking-[0.35em] font-mono text-[#DB0011] mt-1 block">
                  4829
                </span>
                <span className="text-[10px] text-gray-400 mt-2 block">
                  Auto-conceals in 15 seconds. Never disclose this to anyone.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GAMBLING RESTRICTION MODAL                            */}
      {/* ========================================================= */}
      {showGamblingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">Gambling restriction</h3>
              <button
                type="button"
                onClick={() => setShowGamblingModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              HSBC Gambling Restriction helps manage your financial wellbeing by automatically blocking debit and credit card transactions to online betting websites, casinos, and gambling venues.
            </p>

            <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1f1f1f] block">
                  Block Gambling Transactions
                </span>
                <span className="text-[11px] text-gray-500">
                  {gamblingBlocked ? 'Currently active (Protected)' : 'Currently disabled'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleGambling}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  gamblingBlocked ? 'bg-[#16864A]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    gamblingBlocked ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 text-[11px] text-gray-400">
              * Turning off the restriction triggers a mandatory 48-hour cooling-off safety window before gambling transactions can be approved.
            </div>

            <button
              type="button"
              onClick={() => setShowGamblingModal(false)}
              className="w-full mt-4 py-2.5 bg-[#1f1f1f] text-white text-xs font-bold rounded-[2px]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MANAGE ACCOUNT & LIMITS MODAL                         */}
      {/* ========================================================= */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">Manage account</h3>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spending Limit Slider */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-gray-600">Daily Spending Limit</span>
                <span className="font-black text-[#DB0011]">{formatINR(activeCard.spendingLimit || 200000)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={activeCard.spendingLimit || 200000}
                onChange={e => updateCardSettings(activeCard.cardId, { spendingLimit: Number(e.target.value) })}
                className="w-full accent-[#DB0011]"
              />
            </div>

            {/* Channels */}
            <div className="mt-5 space-y-3">
              {[
                { key: 'onlineEnabled', label: 'E-Commerce / Online Usage' },
                { key: 'contactlessEnabled', label: 'Contactless Tap to Pay' },
                { key: 'internationalEnabled', label: 'International / Forex Usage' },
              ].map(ch => (
                <div key={ch.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-semibold text-[#1f1f1f]">{ch.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const curVal = (activeCard as any)[ch.key] !== false;
                      updateCardSettings(activeCard.cardId, { [ch.key]: !curVal });
                      toast.success(`${ch.label} ${!curVal ? 'activated' : 'disabled'}`);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      (activeCard as any)[ch.key] !== false ? 'bg-[#16864A]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        (activeCard as any)[ch.key] !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowManageModal(false)}
              className="w-full mt-5 py-2.5 bg-[#1f1f1f] text-white text-xs font-bold rounded-[2px]"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EXPLORE MORE PRODUCTS MODAL                           */}
      {/* ========================================================= */}
      {showExploreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">Explore more products</h3>
              <button
                type="button"
                onClick={() => setShowExploreModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { title: 'HSBC Premier Metal Credit Card', desc: 'Unlimited global airport lounge access, 4X reward points & concierge' },
                { title: 'Global Money Multi-Currency Account', desc: 'Hold, send and spend in 14 foreign currencies with zero markup' },
                { title: 'HSBC SmartValue Card', desc: '3X cashback on dining, groceries, fuel and streaming subscriptions' },
                { title: 'Pre-Approved Instant Personal Loan', desc: 'Funds disbursed in 2 hours with preferential Premier rates' },
              ].map(prod => (
                <div key={prod.title} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-xs text-[#1f1f1f]">{prod.title}</div>
                  <div className="text-[11px] text-gray-500 mt-1">{prod.desc}</div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(`Application initiated for ${prod.title}. A Premier Executive will connect.`);
                      setShowExploreModal(false);
                    }}
                    className="mt-2.5 text-xs font-bold text-[#DB0011] hover:underline flex items-center gap-1"
                  >
                    <span>Apply with 1-Click</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
