import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { BankCard } from '../types';
import { api } from '../services/api';
import {
  CreditCard,
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  Globe,
  Wifi,
  Sliders,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  CheckCircle,
  X,
  Radio
} from 'lucide-react';

export const CardsPage: React.FC = () => {
  const { formatAmount, accounts, refreshAccounts, showReceipt, showToast } = useBanking();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<string>('');
  const [revealedCard, setRevealedCard] = useState<{ fullCardNumber: string; cvv: string; expiry: string } | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState<string>('');
  const [changePinModalOpen, setChangePinModalOpen] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [payBillModalOpen, setPayBillModalOpen] = useState<boolean>(false);
  const [billPayAmount, setBillPayAmount] = useState<string>('250.00');
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<string>('');
  const [blockModalOpen, setBlockModalOpen] = useState<boolean>(false);

  // Fetch cards
  const loadCards = async () => {
    try {
      const res = await api.getCards();
      setCards(res.cards);
      if (res.cards.length > 0 && !activeCardId) {
        setActiveCardId(res.cards[0].id);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load cards', 'error');
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  // Toggle Freeze
  const handleToggleFreeze = async () => {
    if (!activeCard) return;
    try {
      const res = await api.toggleCardFreeze(activeCard.id);
      showToast(res.message, 'success');
      loadCards();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  // Toggle Controls (Online, International, Contactless)
  const handleToggleControl = async (field: 'onlineEnabled' | 'internationalEnabled' | 'contactlessEnabled', currentValue: number) => {
    if (!activeCard) return;
    try {
      await api.updateCardControls(activeCard.id, {
        [field]: currentValue ? 0 : 1
      });
      loadCards();
      showToast('Card control preference updated', 'success');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // Update Daily Spending Limit
  const handleLimitChange = async (newLimit: number) => {
    if (!activeCard) return;
    try {
      await api.updateCardControls(activeCard.id, {
        dailySpendingLimit: newLimit
      });
      loadCards();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // Reveal Credentials via PIN Challenge
  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;
    try {
      const res = await api.revealCardCredentials(activeCard.id, inputPin);
      setRevealedCard(res);
      setPinModalOpen(false);
      setInputPin('');
      showToast('Card credentials verified and displayed', 'success');
    } catch (err: any) {
      showToast(err.message || 'Invalid PIN code', 'error');
    }
  };

  // Change PIN
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard || newPin.length !== 4) {
      showToast('PIN must be 4 digits', 'error');
      return;
    }
    try {
      await api.changeCardPin(activeCard.id, newPin);
      showToast('ATM and transaction PIN updated successfully!', 'success');
      setChangePinModalOpen(false);
      setNewPin('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change PIN', 'error');
    }
  };

  // Block Card Permanently
  const handleBlockCard = async () => {
    if (!activeCard) return;
    try {
      const res = await api.blockCard(activeCard.id, 'LOST_OR_STOLEN');
      showToast(res.message, 'success');
      setBlockModalOpen(false);
      loadCards();
    } catch (err: any) {
      showToast(err.message || 'Failed to block card', 'error');
    }
  };

  // Pay Credit Card Bill
  const handlePayCreditBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;
    const sourceAcc = selectedSourceAccount || accounts[0]?.id;
    try {
      const res = await api.payCardBill(activeCard.id, {
        sourceAccountId: sourceAcc,
        amount: parseFloat(billPayAmount)
      });
      showToast(res.message, 'success');
      setPayBillModalOpen(false);
      refreshAccounts();
      loadCards();
      showReceipt(res.receipt);
    } catch (err: any) {
      showToast(err.message || 'Bill payment failed', 'error');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Card Management</h1>
        <p className="text-xs text-bank-muted">Premier World Elite & Contactless Debit Cards</p>
      </div>

      {/* Card Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {cards.map(c => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCardId(c.id);
              setRevealedCard(null);
            }}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeCard?.id === c.id
                ? 'bg-[#DB0011] text-white shadow-xs'
                : 'bg-white border border-bank-border text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {c.card_type === 'CREDIT' ? 'Premier World Elite' : c.card_tier.replace('_', ' ')} (••{c.card_number_last4})
          </button>
        ))}
      </div>

      {/* 3D Realistic Card Visual */}
      {activeCard && (
        <div className="relative">
          <div
            className={`w-full aspect-[1.586/1] rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden transition-all duration-300 ${
              activeCard.card_type === 'CREDIT'
                ? 'bg-gradient-to-tr from-[#121214] via-[#1E1E24] to-[#2E2E38] border border-zinc-700/60'
                : 'bg-gradient-to-tr from-[#8E000B] via-[#B0000D] to-[#DB0011] border border-red-800'
            }`}
          >
            {/* Background geometric watermark */}
            <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-radial from-white/10 to-transparent pointer-events-none opacity-40"></div>

            {/* Frozen / Blocked Overlay */}
            {activeCard.is_frozen === 1 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 z-20">
                <Lock size={20} className="text-white" />
                <span className="text-xs font-bold tracking-widest uppercase">CARD FROZEN</span>
              </div>
            )}

            {/* Top Row: Network & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-extrabold tracking-widest uppercase opacity-90">
                PREMIER WORLD ELITE
              </span>
              <div className="flex items-center gap-2">
                <Wifi size={18} className="rotate-90 opacity-90" />
                <span className="text-xs font-black italic tracking-tighter">
                  {activeCard.card_network}
                </span>
              </div>
            </div>

            {/* EMV Chip */}
            <div className="mt-4 w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-yellow-300 shadow-inner flex items-center justify-center relative">
              <div className="w-8 h-5 border border-amber-700/40 rounded-xs"></div>
            </div>

            {/* Card Number */}
            <div className="mt-5 font-mono text-lg tracking-widest font-semibold flex items-center justify-between">
              <span>
                {revealedCard ? revealedCard.fullCardNumber : activeCard.card_number_masked}
              </span>
              <button
                type="button"
                onClick={() => (revealedCard ? setRevealedCard(null) : setPinModalOpen(true))}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                title={revealedCard ? 'Hide details' : 'Reveal details'}
              >
                {revealedCard ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Cardholder & Expiry */}
            <div className="mt-4 flex items-center justify-between text-xs tracking-wider uppercase font-mono">
              <div>
                <span className="text-[9px] opacity-70 block">CARDHOLDER</span>
                <span className="font-bold text-[11px]">{activeCard.cardholder_name}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] opacity-70 block">EXPIRES</span>
                <span className="font-bold text-[11px]">
                  {activeCard.expiry_month}/{activeCard.expiry_year}
                </span>
              </div>
              {revealedCard && (
                <div className="text-right">
                  <span className="text-[9px] opacity-70 block text-amber-300">CVV</span>
                  <span className="font-bold text-sm text-amber-300 font-mono">{revealedCard.cvv}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Card Financial Summary Widget (If Credit Card) */}
      {activeCard?.card_type === 'CREDIT' && (
        <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div>
              <span className="text-[11px] text-zinc-500 font-medium">Available Credit</span>
              <div className="text-xl font-bold text-bank-text">
                {formatAmount(activeCard.available_credit, 'GBP')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-500 font-medium">Credit Limit</span>
              <div className="text-sm font-semibold text-zinc-700">
                {formatAmount(activeCard.credit_limit, 'GBP')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-zinc-500 text-[10px]">Current Month Spent</span>
              <div className="font-bold text-zinc-900">{formatAmount(activeCard.current_month_spent, 'GBP')}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px]">Payment Due Date</span>
              <div className="font-bold text-zinc-900">{activeCard.payment_due_date || '15 Dec 2026'}</div>
            </div>
          </div>

          <button
            onClick={() => setPayBillModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs shadow-xs transition"
          >
            Pay Credit Card Bill
          </button>
        </div>
      )}

      {/* Card Security & Action Controls */}
      {activeCard && (
        <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Card Controls & Security
          </h2>

          <div className="space-y-3 text-xs">
            {/* Freeze / Unfreeze Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2.5">
                {activeCard.is_frozen ? (
                  <Lock size={18} className="text-[#DB0011]" />
                ) : (
                  <Unlock size={18} className="text-emerald-600" />
                )}
                <div>
                  <div className="font-bold text-zinc-900">
                    {activeCard.is_frozen ? 'Unfreeze Card' : 'Temporary Freeze'}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Instantly block/unblock all payment authorizations
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleFreeze}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition ${
                  activeCard.is_frozen
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                }`}
              >
                {activeCard.is_frozen ? 'Unfreeze' : 'Freeze'}
              </button>
            </div>

            {/* Online Transactions */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-800 block">Online Transactions</span>
                <span className="text-[11px] text-zinc-500">E-commerce and in-app checkout</span>
              </div>
              <button
                onClick={() => handleToggleControl('onlineEnabled', activeCard.online_enabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  activeCard.online_enabled ? 'bg-[#DB0011]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeCard.online_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* International Transactions */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-800 block">International Usage</span>
                <span className="text-[11px] text-zinc-500">Cross-border POS & foreign websites</span>
              </div>
              <button
                onClick={() => handleToggleControl('internationalEnabled', activeCard.international_enabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  activeCard.international_enabled ? 'bg-[#DB0011]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeCard.international_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Contactless Payments */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-800 block">Contactless Payments</span>
                <span className="text-[11px] text-zinc-500">Tap to pay up to £100 per tap</span>
              </div>
              <button
                onClick={() => handleToggleControl('contactlessEnabled', activeCard.contactless_enabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  activeCard.contactless_enabled ? 'bg-[#DB0011]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeCard.contactless_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily Spending Limit Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-800">Daily Spending Limit:</span>
                <span className="font-bold text-[#DB0011]">
                  {formatAmount(activeCard.daily_spending_limit, 'GBP')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={activeCard.daily_spending_limit}
                onChange={e => handleLimitChange(Number(e.target.value))}
                className="w-full accent-[#DB0011] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>£500</span>
                <span>£10,000</span>
                <span>£20,000</span>
              </div>
            </div>
          </div>

          {/* PIN & Replacement Action Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setChangePinModalOpen(true)}
              className="py-2.5 px-3 rounded-xl border border-zinc-300 font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-1.5 transition"
            >
              <KeyRound size={14} />
              <span>Change ATM PIN</span>
            </button>
            <button
              onClick={() => setBlockModalOpen(true)}
              className="py-2.5 px-3 rounded-xl border border-red-200 font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldAlert size={14} />
              <span>Report Lost/Stolen</span>
            </button>
          </div>
        </div>
      )}

      {/* PIN Challenge Modal for Reveal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900">Security Verification</h3>
              <button onClick={() => setPinModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Enter your 4-digit transaction PIN to reveal full card number and CVV.
            </p>
            <form onSubmit={handleReveal} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={inputPin}
                onChange={e => setInputPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-2xl font-bold py-2 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]"
                autoFocus
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Authenticate & Reveal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900">Change ATM PIN</h3>
              <button onClick={() => setChangePinModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleChangePin} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 block mb-1">Enter New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-2xl font-bold py-2 rounded-xl border border-zinc-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Save New PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay Credit Card Bill Modal */}
      {payBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900">Pay Credit Card Bill</h3>
              <button onClick={() => setPayBillModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePayCreditBill} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 block mb-1">Pay From Account</label>
                <select
                  value={selectedSourceAccount}
                  onChange={e => setSelectedSourceAccount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({formatAmount(acc.available_balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-600 block mb-1">Payment Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={billPayAmount}
                  onChange={e => setBillPayAmount(e.target.value)}
                  className="w-full p-2.5 text-base font-bold rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Confirm Payment of £{billPayAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Block Lost/Stolen Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#DB0011] flex items-center justify-center mx-auto">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Block Lost/Stolen Card?</h3>
            <p className="text-xs text-zinc-500">
              This card will be permanently deactivated. A new contactless card will be issued to your registered address.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockCard}
                className="flex-1 py-2 rounded-xl bg-[#DB0011] text-white text-xs font-bold hover:bg-[#B0000D]"
              >
                Block & Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
