import React from 'react';
import { CardRecord } from '@shared/types';
import { Snowflake, Wifi, ShieldCheck, Copy, Check } from 'lucide-react';

export type CardVisualVariant =
  | 'standard-debit'
  | 'premium-debit'
  | 'standard-credit'
  | 'premium-credit'
  | 'virtual';

export interface CardArtworkProps {
  card: CardRecord;
  cardholderName?: string;
  variant?: CardVisualVariant;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export const CardArtwork: React.FC<CardArtworkProps> = ({
  card,
  cardholderName = 'Premier Cardholder',
  variant,
  onClick,
  className = '',
  interactive = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Determine variant from card tier / type if not explicitly passed
  const resolvedVariant: CardVisualVariant = variant || (
    card.cardType === 'CREDIT'
      ? (card.cardTier === 'PREMIER_WORLD_ELITE' ? 'premium-credit' : 'standard-credit')
      : (card.cardTier === 'PREMIER_PLATINUM' ? 'premium-debit' : 'standard-debit')
  );

  const isFrozen = card.cardStatus === 'FROZEN';

  // Visual styles by variant
  const getBackgroundStyles = () => {
    switch (resolvedVariant) {
      case 'premium-credit':
        return 'bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#0A0A0A] border border-neutral-700/60 text-white';
      case 'standard-credit':
        return 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-slate-700 text-white';
      case 'premium-debit':
        return 'bg-gradient-to-br from-[#B0000D] via-[#DB0011] to-[#80000A] border border-red-700/50 text-white';
      case 'virtual':
        return 'bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#311042] border border-purple-500/40 text-white';
      case 'standard-debit':
      default:
        return 'bg-gradient-to-br from-[#334155] via-[#475569] to-[#1E293B] border border-slate-600 text-white';
    }
  };

  const getTierLabel = () => {
    switch (resolvedVariant) {
      case 'premium-credit':
        return 'PREMIER WORLD ELITE';
      case 'standard-credit':
        return 'ADVANCE PLATINUM';
      case 'premium-debit':
        return 'PREMIER PLATINUM DEBIT';
      case 'virtual':
        return 'DIGITAL VIRTUAL TOKEN';
      case 'standard-debit':
      default:
        return 'GLOBAL CLASSIC DEBIT';
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(card.maskedCardNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-card select-none transition-shadow duration-200 ${
        interactive ? 'cursor-pointer hover:shadow-elevated' : ''
      } ${getBackgroundStyles()} ${className}`}
    >
      {/* Background Decorative Guilloche / Laser Pattern SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 250"
        fill="none"
      >
        <path
          d="M-50 150 Q100 50 250 180 T500 120"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-50 120 Q120 20 280 150 T500 90"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="340" cy="80" r="120" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <circle cx="340" cy="80" r="80" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </svg>

      {/* Frozen Overlay */}
      {isFrozen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
          <div className="px-4 py-1.5 bg-red-600/90 text-white rounded-full text-xs font-black tracking-wider flex items-center gap-2 shadow-lg border border-red-400">
            <Snowflake className="w-4 h-4" />
            <span>CARD TEMPORARILY FROZEN</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="HSBC"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
          />
          <div>
            <div className="text-xs sm:text-sm font-black tracking-tight leading-none">
              HSBC INDIA
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-80 mt-0.5">
              {getTierLabel()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {resolvedVariant === 'virtual' && (
            <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 text-[9px] font-bold border border-purple-400/40">
              VIRTUAL
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
              isFrozen
                ? 'bg-red-500/30 text-red-200 border border-red-500/40'
                : 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
            }`}
          >
            {card.cardStatus}
          </span>
        </div>
      </div>

      {/* Chip & Contactless Icons */}
      <div className="flex items-center justify-between relative z-10 my-1">
        {/* EMV Microchip */}
        <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/50 shadow-inner relative flex items-center justify-center overflow-hidden">
          <div className="w-full h-[1px] bg-amber-700/40 absolute top-2.5" />
          <div className="w-full h-[1px] bg-amber-700/40 absolute bottom-2.5" />
          <div className="h-full w-[1px] bg-amber-700/40 absolute left-3.5" />
          <div className="h-full w-[1px] bg-amber-700/40 absolute right-3.5" />
          <div className="w-3.5 h-2 rounded-[2px] border border-amber-700/50" />
        </div>

        {/* Contactless Signal */}
        <div className="flex items-center gap-1 opacity-80" title="Contactless Enabled">
          <Wifi className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Card PAN Number */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-base sm:text-lg lg:text-xl font-bold tracking-widest drop-shadow-sm">
          {card.maskedCardNumber || '•••• •••• •••• 9924'}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded text-white/60 hover:text-white transition-colors"
          title="Copy masked number"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Card Footer: Cardholder & Expiry & Network Brand */}
      <div className="flex items-end justify-between relative z-10 pt-1">
        <div className="min-w-0 pr-2">
          <div className="text-[8px] sm:text-[9px] uppercase tracking-wider opacity-70">
            Cardholder Name
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-wide uppercase truncate">
            {cardholderName}
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="text-right">
            <div className="text-[8px] sm:text-[9px] uppercase tracking-wider opacity-70">
              Valid Thru
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold">
              {card.expiryMonth || '09'}/{card.expiryYear || '29'}
            </div>
          </div>

          {/* Network Logo: Mastercard Intersecting Circles */}
          <div className="flex items-center -space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-[#EB001B] opacity-90 shadow-sm" />
            <div className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-90 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
