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
      {/* CARD TITLE & MASKED DIGITS (EXACT MATCH TO REFERENCE SCREENSHOT) */}
      <div className="pt-3 pb-1 text-center">
        <h2 className="text-[17px] font-semibold text-[#1f1f1f]">
          {cardTitle}
        </h2>
        <p className="text-[14px] text-[#777777] font-medium tracking-wide mt-0.5">
          •••• {maskedFourDigits}
        </p>
      </div>

      {/* PEEKING CARD CAROUSEL (METALLIC EMBLEM & PEEKING SIDES) */}
      <div className="pt-2 pb-5">
        <HsbcCardCarousel
          cards={cards.length > 0 ? cards : [activeCard]}
          activeIndex={activeCardIndex}
          onCardChange={index => setActiveCardIndex(index)}
        />
      </div>

      {/* 4 CIRCULAR ACTION BUTTONS (IDENTICAL ICONS & 2-LINE LABELS) */}
      <div className="px-3 py-4 grid grid-cols-4 gap-2">
        {/* 1. Report a card issue */}
        <button
          type="button"
          onClick={() => setShowReportIssueModal(true)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Custom SVG: Card with red warning alert triangle inside */}
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <rect x="4" y="8" width="24" height="16" rx="2.5" fill="white" stroke="#252525" strokeWidth="1.5" />
              <path d="M4 12.5h24" stroke="#DB0011" strokeWidth="2" />
              <polygon points="16,14 21,22 11,22" fill="#DB0011" />
              <line x1="16" y1="16.5" x2="16" y2="19.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="16" cy="21" r="0.6" fill="white" />
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
          <div className="w-14 h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Custom SVG: Overlapping cards with PIN dots */}
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <rect x="10" y="6" width="18" height="13" rx="2" fill="white" stroke="#555555" strokeWidth="1.3" />
              <rect x="4" y="11" width="19" height="14" rx="2" fill="white" stroke="#DB0011" strokeWidth="1.5" />
              <rect x="7" y="16" width="13" height="6" rx="1.2" fill="#F3F4F6" stroke="#999999" strokeWidth="0.8" />
              <circle cx="9.5" cy="19" r="0.9" fill="#1f1f1f" />
              <circle cx="12" cy="19" r="0.9" fill="#1f1f1f" />
              <circle cx="14.5" cy="19" r="0.9" fill="#1f1f1f" />
              <circle cx="17" cy="19" r="0.9" fill="#1f1f1f" />
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
          <div className="w-14 h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Custom SVG: Red card with white magnetic stripe and snowflake */}
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <rect x="4" y="8" width="24" height="16" rx="2.5" fill="#DB0011" />
              <rect x="4" y="10.5" width="24" height="2.5" fill="white" opacity="0.9" />
              <g transform="translate(11, 18)" stroke="white" strokeWidth="1.4" strokeLinecap="round">
                <line x1="0" y1="-4" x2="0" y2="4" />
                <line x1="-3.46" y1="-2" x2="3.46" y2="2" />
                <line x1="-3.46" y1="2" x2="3.46" y2="-2" />
              </g>
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
          <div className="w-14 h-14 rounded-full bg-[#F2F4F7] group-hover:bg-[#E5E7EB] active:bg-gray-300 transition-colors flex items-center justify-center text-[#1f1f1f]">
            {/* Custom SVG: Casino chip with alternating red/white perimeter */}
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <circle cx="16" cy="16" r="11" stroke="#252525" strokeWidth="1.5" fill="white" />
              <circle cx="16" cy="16" r="9" stroke="#DB0011" strokeWidth="2.2" strokeDasharray="3.8 3.2" fill="none" />
              <circle cx="16" cy="16" r="5.5" stroke="#252525" strokeWidth="1.2" fill="white" />
              <circle cx="16" cy="16" r="2.5" fill="#DB0011" />
              <circle cx="16" cy="16" r="1" fill="white" />
            </svg>
          </div>
          <span className="text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
            Gambling<br />restriction
          </span>
        </button>
      </div>

      {/* LIST ACTION ROWS (MATCHING REFERENCE DESIGN) */}
      <div className="px-4 pt-3 pb-8 space-y-2">
        {/* Row 1: Manage account */}
        <button
          type="button"
          onClick={() => setShowManageModal(true)}
          className="w-full py-4 px-2 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50/60 active:bg-gray-100 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Red terminal / mailbox icon */}
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                <rect x="5" y="7" width="18" height="14" rx="2.5" fill="#DB0011" />
                <rect x="8" y="9.5" width="12" height="2" rx="1" fill="white" />
                <circle cx="14" cy="15.5" r="1.6" fill="white" />
                <line x1="14" y1="16.5" x2="14" y2="18.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
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
          className="w-full py-4 px-2 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50/60 active:bg-gray-100 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Overlapping red cards icon */}
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                <rect x="8" y="6" width="15" height="11" rx="2" fill="#99000A" />
                <rect x="5" y="10" width="16" height="12" rx="2" fill="#DB0011" stroke="white" strokeWidth="0.8" />
                <line x1="5" y1="13.5" x2="21" y2="13.5" stroke="white" strokeWidth="1.2" />
              </svg>
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
      {/* 2. VIEW CARD PIN MODAL (ENTER MPIN 002831)              */}
      {/* ========================================================= */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">View card PIN</h3>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!pinRevealed ? (
              <form onSubmit={handleVerifyPinForReveal} className="mt-4 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your 6-digit App-Lock PIN to reveal your 4-digit card ATM PIN.
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    6-Digit App-Lock PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    autoFocus
                    required
                    value={pinVerificationInput}
                    onChange={e => setPinVerificationInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-base font-bold bg-gray-50 border border-gray-200 rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-[2px] transition-colors"
                >
                  Verify & Reveal PIN
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-4 text-center">
                <p className="text-xs text-gray-500">
                  Your 4-digit ATM PIN for card ending in {maskedFourDigits}:
                </p>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-3xl font-extrabold font-mono tracking-[0.3em] text-[#1f1f1f]">
                    8829
                  </span>
                </div>

                <p className="text-[11px] text-gray-400">
                  Do not disclose this PIN to anyone. This screen will auto-hide.
                </p>

                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-full py-2.5 bg-[#1f1f1f] text-white text-xs font-bold rounded-[2px] transition-colors"
                >
                  Hide PIN
                </button>
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

            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Block transactions categorized as betting, casinos, lottery tickets, and online gambling (Merchant Category Code 7995).
            </p>

            <div className="my-5 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#1f1f1f] block">
                  Block Gambling Merchants
                </span>
                <span className="text-[11px] text-gray-500">
                  {gamblingBlocked ? 'Currently active' : 'Restriction disabled'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleGambling}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  gamblingBlocked ? 'bg-[#16864A]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    gamblingBlocked ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="text-[11px] text-gray-400 leading-normal">
              Turning off this restriction requires a 48-hour cooling-off period under HSBC India responsible gaming safeguards.
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
      {/* 4. MANAGE ACCOUNT MODAL                                  */}
      {/* ========================================================= */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1f1f1f]">Manage account & limits</h3>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Daily Domestic Limit */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Daily Domestic Limit (INR)
                </label>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1f1f1f]">
                    {formatINR(activeCard.spendingLimit)}
                  </span>
                  <span className="text-[10px] text-gray-400">Max ₹5,00,000</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    key: 'onlineEnabled',
                    label: 'Online / E-Commerce Usage',
                    desc: 'Required for merchant websites and apps',
                    val: activeCard.onlineEnabled,
                  },
                  {
                    key: 'contactlessEnabled',
                    label: 'Contactless Tap to Pay',
                    desc: 'Wave & pay without PIN up to ₹5,000',
                    val: activeCard.contactlessEnabled,
                  },
                  {
                    key: 'internationalEnabled',
                    label: 'International Usage',
                    desc: 'Overseas POS and foreign currency websites',
                    val: activeCard.internationalEnabled,
                  },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-bold text-xs text-[#1f1f1f]">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateCardSettings(activeCard.cardId, { [item.key]: !item.val });
                        toast.success(`${item.label} ${!item.val ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        item.val ? 'bg-[#16864A]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                          item.val ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="w-full mt-2 py-2.5 bg-[#DB0011] text-white text-xs font-bold rounded-[2px]"
              >
                Save Settings
              </button>
            </div>
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
