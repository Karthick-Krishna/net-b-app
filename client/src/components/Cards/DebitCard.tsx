import React from 'react';
import { CardRecord, BankAccountRecord } from '@shared/types';
import { CardArtwork } from './CardArtwork';
import { formatINR } from '@shared/utils/formatters';
import { ShieldCheck, ArrowRight, Snowflake, Sliders } from 'lucide-react';

export interface DebitCardProps {
  card: CardRecord;
  linkedAccount?: BankAccountRecord;
  cardholderName?: string;
  onManage?: () => void;
  onToggleFreeze?: () => void;
}

export const DebitCard: React.FC<DebitCardProps> = ({
  card,
  linkedAccount,
  cardholderName,
  onManage,
  onToggleFreeze,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Visual Card Artwork */}
      <CardArtwork
        card={card}
        cardholderName={cardholderName}
        variant={card.cardTier === 'PREMIER_PLATINUM' ? 'premium-debit' : 'standard-debit'}
        onClick={onManage}
      />

      {/* Account & Limit Highlights */}
      <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-[#E8E8E8] text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
            Linked Primary Account
          </span>
          <span className="font-mono font-bold text-[#252525] mt-0.5 block">
            {linkedAccount?.maskedAccountNumber || '•••• 8829'}
          </span>
          <span className="text-[10px] text-gray-500">
            {linkedAccount ? formatINR(linkedAccount.managedBalance) : '₹12,45,680.50'}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
            Daily Domestic Limit
          </span>
          <span className="font-black text-sm text-[#252525] mt-0.5 block">
            {formatINR(card.spendingLimit || 200000)}
          </span>
          <span className="text-[10px] text-[#16864A] font-semibold">Verified Active</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onManage}
          className="flex-1 py-2.5 px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Manage Card</span>
        </button>
        {onToggleFreeze && (
          <button
            type="button"
            onClick={onToggleFreeze}
            className={`py-2.5 px-3.5 rounded-xl text-xs font-bold transition-colors border ${
              card.cardStatus === 'FROZEN'
                ? 'bg-emerald-50 text-[#16864A] border-emerald-200 hover:bg-emerald-100'
                : 'bg-red-50 text-[#DB0011] border-red-200 hover:bg-red-100'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
