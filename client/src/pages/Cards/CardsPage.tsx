import React, { useState } from 'react';
import { CardRecord } from '@shared/types';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { formatINR } from '@shared/utils/formatters';
import { CardArtwork } from '../../components/Cards/CardArtwork';
import { DebitCard } from '../../components/Cards/DebitCard';
import { CreditCard } from '../../components/Cards/CreditCard';
import { VirtualCard } from '../../components/Cards/VirtualCard';
import { CardCarousel } from '../../components/Cards/CardCarousel';
import {
  CreditCard as CardIcon,
  Snowflake,
  ShieldCheck,
  Globe,
  Wifi,
  Sliders,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  FileText,
  BadgePercent,
  PhoneCall,
  X,
  CheckCircle2,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CardsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { cards, accounts, updateCardSettings } = useBanking();

  const [activeTab, setActiveTab] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [selectedCard, setSelectedCard] = useState<CardRecord | null>(null);

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);

  // Form states
  const [newCardPin, setNewCardPin] = useState('');
  const [confirmCardPin, setConfirmCardPin] = useState('');
  const [billPayAmount, setBillPayAmount] = useState('15000');
  const [emiTenure, setEmiTenure] = useState(12);
  const [emiAmount, setEmiAmount] = useState('45000');

  const filteredCards = cards.filter(c => {
    if (activeTab === 'DEBIT') return c.cardType === 'DEBIT';
    if (activeTab === 'CREDIT') return c.cardType === 'CREDIT';
    return true;
  });

  const handleToggleFreeze = (card: CardRecord) => {
    const newStatus = card.cardStatus === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    updateCardSettings(card.cardId, { cardStatus: newStatus });
    toast.success(newStatus === 'FROZEN' ? 'Card frozen temporarily.' : 'Card un-frozen and active.');
    if (selectedCard?.cardId === card.cardId) {
      setSelectedCard({ ...card, cardStatus: newStatus });
    }
  };

  const handleToggleChannel = (card: CardRecord, key: 'onlineEnabled' | 'internationalEnabled' | 'contactlessEnabled', val?: boolean) => {
    updateCardSettings(card.cardId, { [key]: !val });
    toast.success('Card security channel updated');
    if (selectedCard?.cardId === card.cardId) {
      setSelectedCard({ ...selectedCard, [key]: !val });
    }
  };

  const handleLimitSlider = (card: CardRecord, val: number) => {
    updateCardSettings(card.cardId, { spendingLimit: val });
    if (selectedCard?.cardId === card.cardId) {
      setSelectedCard({ ...selectedCard, spendingLimit: val });
    }
  };

  const handleOpenDetails = (card: CardRecord) => {
    setSelectedCard(card);
    setShowDetailModal(true);
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardPin.length !== 4 || !/^\d+$/.test(newCardPin)) {
      toast.error('Card ATM PIN must be exactly 4 digits');
      return;
    }
    if (newCardPin !== confirmCardPin) {
      toast.error('PIN confirmation does not match');
      return;
    }
    toast.success('Card 4-digit PIN updated successfully on Central Switch');
    setShowPinModal(false);
    setNewCardPin('');
    setConfirmCardPin('');
  };

  const handleReportLost = () => {
    if (!selectedCard) return;
    updateCardSettings(selectedCard.cardId, { cardStatus: 'BLOCKED' });
    toast.success('Card has been permanently blocked. Replacement order dispatched.');
    setShowLostModal(false);
  };

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Payment of ${formatINR(parseFloat(billPayAmount))} authorized for credit card!`);
    setShowPayBillModal(false);
  };

  const handleConvertEmi = (e: React.FormEvent) => {
    e.preventDefault();
    const emi = (parseFloat(emiAmount) * 1.13) / emiTenure;
    toast.success(`Cash on EMI booked! Monthly installment: ${formatINR(emi)} for ${emiTenure} months.`);
    setShowEmiModal(false);
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Card Management & Risk Controls
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Real-time debit & credit card supervision, instant freeze, contactless controls, and EMI conversion
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E8E8] rounded-xl self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'ALL' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            All Cards ({cards.length})
          </button>
          <button
            onClick={() => setActiveTab('DEBIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'DEBIT' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Debit Cards
          </button>
          <button
            onClick={() => setActiveTab('CREDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'CREDIT' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Credit Cards
          </button>
        </div>
      </div>

      {/* Interactive Card Carousel on Mobile & Tablets */}
      <div className="block lg:hidden">
        <CardCarousel
          cards={filteredCards}
          cardholderName={currentUser?.displayName}
          onSelectCard={handleOpenDetails}
        />
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCards.map(card => {
          const isCredit = card.cardType === 'CREDIT';
          const linkedAccount = accounts.find(a => a.accountId === card.accountId) || accounts[0];

          return isCredit ? (
            <CreditCard
              key={card.cardId}
              card={card}
              cardholderName={currentUser?.displayName}
              onManage={() => handleOpenDetails(card)}
              onPayBill={() => {
                setSelectedCard(card);
                setShowPayBillModal(true);
              }}
            />
          ) : (
            <DebitCard
              key={card.cardId}
              card={card}
              linkedAccount={linkedAccount}
              cardholderName={currentUser?.displayName}
              onManage={() => handleOpenDetails(card)}
              onToggleFreeze={() => handleToggleFreeze(card)}
            />
          );
        })}
      </div>

      {/* Virtual Card Showcase Module */}
      <div className="pt-2">
        <div className="mb-3">
          <h3 className="text-sm font-black text-[#252525] uppercase tracking-wider">
            Digital & Virtual Cards
          </h3>
          <p className="text-xs text-[#777777]">
            Tokenized virtual debit cards for instant online checkout with dynamic CVV protection
          </p>
        </div>
        <div className="max-w-md">
          {cards[0] && (
            <VirtualCard
              card={cards[0]}
              cardholderName={currentUser?.displayName}
              onManage={() => handleOpenDetails(cards[0])}
            />
          )}
        </div>
      </div>

      {/* Full Card Detail & Action Modal */}
      {showDetailModal && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-[#E8E8E8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2">
                <CardIcon className="w-5 h-5 text-[#DB0011]" />
                <h3 className="text-base font-black text-[#252525]">
                  {selectedCard.cardTier.replace(/_/g, ' ')} ({selectedCard.cardType})
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Card in Modal */}
            <div className="max-w-sm mx-auto">
              <CardArtwork
                card={selectedCard}
                cardholderName={currentUser?.displayName}
                interactive={false}
              />
            </div>

            {/* Spending Limit Slider */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-[#E8E8E8] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#777777] uppercase text-[10px]">Daily Transaction Limit</span>
                <span className="font-black text-sm text-[#252525]">
                  {formatINR(selectedCard.spendingLimit)}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={selectedCard.spendingLimit}
                onChange={e => handleLimitSlider(selectedCard, parseInt(e.target.value))}
                className="w-full accent-[#DB0011] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Channel Toggles */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#777777] uppercase text-[10px] block">
                Channel Preferences
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleChannel(selectedCard, 'onlineEnabled', selectedCard.onlineEnabled)}
                  className={`p-3 rounded-2xl border text-center transition-colors ${
                    selectedCard.onlineEnabled !== false
                      ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">Online E-Com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleChannel(selectedCard, 'internationalEnabled', selectedCard.internationalEnabled)}
                  className={`p-3 rounded-2xl border text-center transition-colors ${
                    selectedCard.internationalEnabled !== false
                      ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <Globe className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">International</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleChannel(selectedCard, 'contactlessEnabled', selectedCard.contactlessEnabled)}
                  className={`p-3 rounded-2xl border text-center transition-colors ${
                    selectedCard.contactlessEnabled !== false
                      ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <Wifi className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">Contactless</span>
                </button>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={() => handleToggleFreeze(selectedCard)}
                className={`p-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border ${
                  selectedCard.cardStatus === 'FROZEN'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-red-50 text-[#DB0011] border-red-200 hover:bg-red-100'
                }`}
              >
                <Snowflake className="w-4 h-4" />
                <span>{selectedCard.cardStatus === 'FROZEN' ? 'Unfreeze Card' : 'Freeze Card'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="p-3 bg-gray-50 hover:bg-gray-100 text-[#252525] rounded-xl text-xs font-bold transition-colors border border-[#E8E8E8] flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-gray-600" />
                <span>Reset ATM PIN</span>
              </button>

              {selectedCard.cardType === 'CREDIT' && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowEmiModal(true)}
                    className="p-3 bg-red-50 text-[#DB0011] hover:bg-red-100 rounded-xl text-xs font-bold transition-colors border border-red-200 flex items-center justify-center gap-2"
                  >
                    <BadgePercent className="w-4 h-4" />
                    <span>Cash on EMI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPayBillModal(true)}
                    className="p-3 bg-gray-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <CardIcon className="w-4 h-4" />
                    <span>Pay Card Bill</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowLostModal(true)}
                className="p-3 bg-gray-50 hover:bg-red-50 text-[#DB0011] rounded-xl text-xs font-bold transition-colors border border-[#E8E8E8] flex items-center justify-center gap-2 col-span-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Lost or Stolen Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Reset 4-Digit Card PIN</h3>
              <button onClick={() => setShowPinModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleResetPin} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newCardPin}
                  onChange={e => setNewCardPin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono text-center text-lg tracking-widest"
                  placeholder="••••"
                />
              </div>
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Confirm 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmCardPin}
                  onChange={e => setConfirmCardPin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono text-center text-lg tracking-widest"
                  placeholder="••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold"
              >
                Authorize New PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Lost Card Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex items-center gap-2 text-[#DB0011]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-black text-[#252525]">Report Lost or Stolen Card</h3>
            </div>
            <p className="text-xs text-[#555555]">
              This will permanently block <strong>{selectedCard?.maskedCardNumber}</strong> and initiate an automated priority replacement to your registered Fort, Mumbai address.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLostModal(false)}
                className="px-4 py-2 border border-[#E8E8E8] rounded-xl text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReportLost}
                className="px-4 py-2 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D]"
              >
                Permanently Block & Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash on EMI Modal */}
      {showEmiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-black text-[#252525]">Credit Card Cash on EMI</h3>
              <button onClick={() => setShowEmiModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>

            <form onSubmit={handleConvertEmi} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Eligible Conversion Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  value={emiAmount}
                  onChange={e => setEmiAmount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-black text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Tenure
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 12, 24].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEmiTenure(m)}
                      className={`p-2 rounded-xl text-xs font-bold border ${
                        emiTenure === m
                          ? 'bg-[#DB0011] text-white border-[#DB0011]'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {m} Mos
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 border border-[#E8E8E8]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Applicable Interest:</span>
                  <span className="font-bold text-gray-900">13.00% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Processing Fee:</span>
                  <span className="font-bold text-gray-900">₹499 + GST</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-200">
                  <span className="text-gray-900">Estimated Monthly EMI:</span>
                  <span className="text-[#DB0011]">
                    {formatINR((parseFloat(emiAmount || '0') * 1.13) / emiTenure)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs"
              >
                Confirm & Convert to EMI
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay Credit Card Bill Modal */}
      {showPayBillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-black text-[#252525]">Pay Credit Card Bill</h3>
              <button onClick={() => setShowPayBillModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>

            <form onSubmit={handlePayBill} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Payment Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  value={billPayAmount}
                  onChange={e => setBillPayAmount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-black text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBillPayAmount('12500')}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-left"
                >
                  <span className="text-[10px] text-gray-500 block">Min Amount Due</span>
                  <span className="font-bold">₹12,500.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillPayAmount('215000')}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-left"
                >
                  <span className="text-[10px] text-gray-500 block">Total Due</span>
                  <span className="font-bold">₹2,15,000.00</span>
                </button>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#16864A]">
                Debit Account: HSBC Premier Savings (•••• 8829)
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs"
              >
                Pay {formatINR(parseFloat(billPayAmount || '0'))}
              </button>
            </form>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
