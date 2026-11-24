import React from 'react';
import { CreditCard, Snowflake, ShieldCheck, Globe, Wifi, Sliders, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const CardsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { cards, updateCardSettings, formatCurrency } = useBanking();

  const handleToggleFreeze = (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    updateCardSettings(cardId, { cardStatus: newStatus });
    toast.success(newStatus === 'FROZEN' ? 'Card frozen temporarily.' : 'Card un-frozen and active.');
  };

  const handleToggleFeature = (cardId: string, key: 'onlineEnabled' | 'internationalEnabled' | 'contactlessEnabled', val?: boolean) => {
    updateCardSettings(cardId, { [key]: !val });
    toast.success('Card security setting updated.');
  };

  const handleLimitChange = (cardId: string, newLimit: number) => {
    updateCardSettings(cardId, { spendingLimit: newLimit });
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
          Card Management & Controls
        </h2>
        <p className="text-xs text-[#777777]">
          Instant card freeze, contactless toggles, and real-time spending limit adjustments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map(card => {
          const isFrozen = card.cardStatus === 'FROZEN';
          const isCredit = card.cardType === 'CREDIT';

          return (
            <div key={card.cardId} className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-8 shadow-card space-y-6">
              {/* Realistic Card Graphic Visualizer */}
              <div
                className={`p-7 rounded-3xl text-white shadow-elevated relative overflow-hidden transition-all ${
                  isFrozen
                    ? 'bg-slate-700 opacity-90 grayscale'
                    : isCredit
                    ? 'bg-gradient-to-tr from-[#121212] via-[#222222] to-slate-800'
                    : 'bg-gradient-to-tr from-[#B0000D] via-[#DB0011] to-red-600'
                }`}
              >
                {isFrozen && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
                    <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5">
                      <Snowflake className="w-3.5 h-3.5" /> CARD FROZEN
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase opacity-85">
                      {card.cardTier.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs font-bold mt-0.5">{card.cardType} CARD</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src="/logo.png" alt="HSBC" className="w-6 h-6 object-contain brightness-0 invert" />
                    <span className="text-xs font-extrabold tracking-wider">HSBC</span>
                  </div>
                </div>

                <div className="my-8">
                  <div className="text-lg font-mono tracking-widest">{card.maskedCardNumber}</div>
                </div>

                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-[9px] uppercase opacity-75">Cardholder</div>
                    <div className="font-bold">{currentUser?.displayName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase opacity-75">Expires</div>
                    <div className="font-mono font-bold">{card.expiryMonth}/{card.expiryYear}</div>
                  </div>
                </div>
              </div>

              {/* Credit Specific Indicators */}
              {isCredit && (
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-500 block">Available Credit</span>
                    <span className="font-bold text-gray-900">{formatCurrency(card.availableCredit || 785000, 'INR')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Credit Limit</span>
                    <span className="font-bold text-gray-900">{formatCurrency(card.creditLimit || 1000000, 'INR')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Min Due (Due: {card.dueDate})</span>
                    <span className="font-bold text-[#DB0011]">{formatCurrency(card.minDue || 10750, 'INR')}</span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Snowflake className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Freeze Card</div>
                      <div className="text-[10px] text-gray-500">Temporarily prevent all transactions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFreeze(card.cardId, card.cardStatus)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isFrozen
                        ? 'bg-[#16864A] text-white'
                        : 'bg-red-50 text-[#DB0011] border border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {isFrozen ? 'Unfreeze' : 'Freeze Card'}
                  </button>
                </div>

                {/* Spending Limit Slider */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-700">Daily Spending Limit</span>
                    <span className="text-[#DB0011] font-mono">{formatCurrency(card.spendingLimit, 'INR')}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={card.spendingLimit}
                    onChange={e => handleLimitChange(card.cardId, Number(e.target.value))}
                    className="w-full accent-[#DB0011] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleToggleFeature(card.cardId, 'onlineEnabled', card.onlineEnabled)}
                    className={`p-3 rounded-2xl border text-center transition-colors ${
                      card.onlineEnabled
                        ? 'bg-red-50/50 border-[#DB0011] text-[#DB0011]'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Globe className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">Online</span>
                    <span className="text-[9px]">{card.onlineEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeature(card.cardId, 'internationalEnabled', card.internationalEnabled)}
                    className={`p-3 rounded-2xl border text-center transition-colors ${
                      card.internationalEnabled
                        ? 'bg-red-50/50 border-[#DB0011] text-[#DB0011]'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Globe className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">International</span>
                    <span className="text-[9px]">{card.internationalEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeature(card.cardId, 'contactlessEnabled', card.contactlessEnabled)}
                    className={`p-3 rounded-2xl border text-center transition-colors ${
                      card.contactlessEnabled
                        ? 'bg-red-50/50 border-[#DB0011] text-[#DB0011]'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Wifi className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">Contactless</span>
                    <span className="text-[9px]">{card.contactlessEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedPageTransition>
  );
};
