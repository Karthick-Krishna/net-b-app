import React from 'react';
import { CreditCard, Snowflake, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const CardsAdminPage: React.FC = () => {
  const { cards, updateCard, formatCurrency } = useAdminStore();

  const handleToggleFreeze = (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    updateCard(cardId, { cardStatus: newStatus });
    toast.success(`Card ${cardId} marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Card Administration & Risk Controls
        </h2>
        <p className="text-xs text-slate-400">
          Supervise active customer debit and credit cards, toggle emergency freezes, and audit limits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => {
          const isFrozen = card.cardStatus === 'FROZEN';
          return (
            <div key={card.cardId} className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/50 text-[#DB0011] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{card.cardType} — {card.cardTier.replace(/_/g, ' ')}</h3>
                    <div className="text-xs text-slate-400 font-mono">{card.maskedCardNumber}</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isFrozen ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {card.cardStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div>
                  <span className="block text-slate-500">Spending Limit:</span>
                  <span className="font-bold text-white">{formatCurrency(card.spendingLimit, 'INR')}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Expires:</span>
                  <span className="font-mono text-white">{card.expiryMonth}/{card.expiryYear}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleToggleFreeze(card.cardId, card.cardStatus)}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                    isFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/40'
                  }`}
                >
                  {isFrozen ? 'Lift Emergency Freeze' : 'Force Emergency Card Freeze'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
