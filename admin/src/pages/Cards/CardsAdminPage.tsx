import React from 'react';
import { CreditCard, Snowflake, CheckCircle2, ShieldCheck, Globe, Wifi, ShoppingBag } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const CardsAdminPage: React.FC = () => {
  const { cards, customers, updateCard } = useAdminStore();

  const handleToggleFreeze = (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    updateCard(cardId, { cardStatus: newStatus });
    toast.success(`Card ${cardId} marked as ${newStatus} in real-time.`);
  };

  const handleToggleFeature = (cardId: string, feature: 'onlineEnabled' | 'internationalEnabled' | 'contactlessEnabled', currentValue?: boolean) => {
    updateCard(cardId, { [feature]: !currentValue });
    toast.success(`Updated card channel settings`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Card Administration & Security Supervision
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Supervise active customer debit and credit cards, toggle emergency freezes, and configure channel limits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => {
          const isFrozen = card.cardStatus === 'FROZEN';
          const isCredit = card.cardType === 'CREDIT';
          const cardholder = customers.find(c => c.uid === card.ownerUid)?.displayName || 'Premier Cardholder';

          return (
            <div
              key={card.cardId}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs space-y-5"
            >
              {/* Card visual mockup header */}
              <div
                className={`p-5 rounded-2xl text-white relative overflow-hidden shadow-card ${
                  isCredit
                    ? 'bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#0A0A0A]'
                    : 'bg-gradient-to-br from-[#B0000D] via-[#DB0011] to-[#80000A]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase font-bold text-white/80">
                      HSBC INDIA • {isCredit ? 'CREDIT' : 'DEBIT'}
                    </div>
                    <div className="text-sm font-black tracking-wide mt-0.5">
                      {card.cardTier.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isFrozen ? 'bg-red-500/80 text-white' : 'bg-emerald-500/80 text-white'
                    }`}
                  >
                    {card.cardStatus}
                  </span>
                </div>

                <div className="my-6">
                  <div className="text-base font-mono tracking-widest font-bold">
                    {card.maskedCardNumber}
                  </div>
                </div>

                <div className="flex justify-between items-end text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Cardholder</span>
                    <span className="font-bold tracking-wide">{cardholder}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expires</span>
                    <span className="font-mono font-bold">{card.expiryMonth}/{card.expiryYear}</span>
                  </div>
                </div>
              </div>

              {/* Financial metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#777777] block">Daily Spend Limit</span>
                  <span className="font-black text-sm text-[#252525] mt-0.5 block">
                    {formatINR(card.spendingLimit)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#777777] block">Card Brand & Network</span>
                  <span className="font-bold text-sm text-[#252525] mt-0.5 block">
                    Mastercard World Elite
                  </span>
                </div>
              </div>

              {/* Channel Controls */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
                  Security Channel Gates
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(card.cardId, 'onlineEnabled', card.onlineEnabled)}
                    className={`p-2 rounded-xl border text-center transition-colors ${
                      card.onlineEnabled !== false
                        ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mx-auto mb-1" />
                    <span className="text-[10px] block">Online</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(card.cardId, 'internationalEnabled', card.internationalEnabled)}
                    className={`p-2 rounded-xl border text-center transition-colors ${
                      card.internationalEnabled !== false
                        ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 mx-auto mb-1" />
                    <span className="text-[10px] block">Global</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(card.cardId, 'contactlessEnabled', card.contactlessEnabled)}
                    className={`p-2 rounded-xl border text-center transition-colors ${
                      card.contactlessEnabled !== false
                        ? 'bg-emerald-50 border-emerald-200 text-[#16864A] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Wifi className="w-3.5 h-3.5 mx-auto mb-1" />
                    <span className="text-[10px] block">Tap & Pay</span>
                  </button>
                </div>
              </div>

              {/* Emergency Action */}
              <div className="pt-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => handleToggleFreeze(card.cardId, card.cardStatus)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                    isFrozen
                      ? 'bg-[#16864A] hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-red-50 hover:bg-red-100 text-[#DB0011] border border-red-200'
                  }`}
                >
                  <Snowflake className="w-4 h-4" />
                  <span>{isFrozen ? 'Lift Emergency Card Freeze' : 'Force Emergency Card Freeze'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
