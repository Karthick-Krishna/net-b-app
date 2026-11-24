import React from 'react';
import { CardRecord } from '@shared/types';
import { CardArtwork } from './CardArtwork';
import { formatINR } from '@shared/utils/formatters';
import { Sliders, CreditCard as CardIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export interface CreditCardProps {
  card: CardRecord;
  cardholderName?: string;
  onManage?: () => void;
  onPayBill?: () => void;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  card,
  cardholderName,
  onManage,
  onPayBill,
}) => {
  const creditLimit = card.creditLimit || 1000000;
  const availableCredit = card.availableCredit || 785000;
  const outstanding = creditLimit - availableCredit;
  const minDue = card.minDue || 12500;
  const dueDate = card.dueDate || '2026-12-15';

  return (
    <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Visual Card Artwork */}
      <CardArtwork
        card={card}
        cardholderName={cardholderName}
        variant={card.cardTier === 'PREMIER_WORLD_ELITE' ? 'premium-credit' : 'standard-credit'}
        onClick={onManage}
      />

      {/* Credit Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-[#E8E8E8] text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
            Available Credit
          </span>
          <span className="font-black text-sm text-[#16864A] mt-0.5 block">
            {formatINR(availableCredit)}
          </span>
          <span className="text-[10px] text-gray-500">Limit: {formatINR(creditLimit)}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
            Total Outstanding
          </span>
          <span className="font-black text-sm text-[#252525] mt-0.5 block">
            {formatINR(outstanding)}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Min Due: {formatINR(minDue)}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
            Payment Due Date
          </span>
          <span className="font-bold text-xs text-[#DB0011] mt-0.5 block">
            {dueDate}
          </span>
          <span className="text-[10px] text-gray-500">Auto-debit active</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onManage}
          className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Card Controls</span>
        </button>
        {onPayBill && (
          <button
            type="button"
            onClick={onPayBill}
            className="flex-1 py-2.5 px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <CardIcon className="w-3.5 h-3.5" />
            <span>Pay Card Bill</span>
          </button>
        )}
      </div>
    </div>
  );
};
