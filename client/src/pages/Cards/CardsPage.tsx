import React from 'react';
import { CreditCard, Snowflake, ShieldCheck, Globe, Wifi, Sliders, AlertCircle } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
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
    toast.success('Card security settings updated.');
  };

  const handleLimitChange = (cardId: string, newLimit: number) => {
    updateCardSettings(cardId, { spendingLimit: newLimit });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
          Card Management & Controls
        </h2>
        <p className="text-xs text-gray-500">
          Instant card freeze, contactless toggles, and real-time spending limit adjustments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map(card => {
          const isFrozen = card.cardStatus === 'FROZEN';
          const isCredit = card.cardType === 'CREDIT';

          return (
            <div key={card.cardId} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
              {/* Card Visualization */}
              <div
                className={`p-6 rounded-2xl text-white shadow-card relative overflow-hidden transition-all ${
                  isFrozen
                    ? 'bg-slate-700 opacity-90 grayscale'
                    : isCredit
                    ? 'bg-gradient-to-tr from-slate-900 via-gray-900 to-slate-800'
                    : 'bg-gradient-to-tr from-[#B0000D] via-[#DB0011] to-red-600'
                }`}
              >
                {isFrozen && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5">
                      <Snowflake className="w-3.5 h-3.5" /> CARD FROZEN
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                      {card.cardTier.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs font-semibold mt-0.5">{card.cardType} CARD</div>
                  </div>
                  <span className="text-xs font-extrabold tracking-wider">PREMIER</span>
                </div>

                <div className="my-8">
                  <div className="text-lg font-mono tracking-widest">{card.maskedCardNumber}</div>
                </div>

                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-[9px] uppercase opacity-75">Cardholder</div>
                    <div className="font-semibold">{currentUser?.displayName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase opacity-75">Expires</div>
                    <div className="font-mono">{card.expiryMonth}/{card.expiryYear}</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Snowflake className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Freeze Card</div>
                      <div className="text-[10px] text-gray-500">Temporarily prevent all transactions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFreeze(card.cardId, card.cardStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isFrozen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-50 text-[#DB0011] border border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {isFrozen ? 'Unfreeze' : 'Freeze Card'}
                  </button>
                </div>

                {/* Spending Limit Slider */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
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
                    <span>₹ 10,000</span>
                    <span>₹ 10,00,000</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleToggleFeature(card.cardId, 'onlineEnabled', card.onlineEnabled)}
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
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
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
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
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
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
    </div>
  );
};
