import React from 'react';
import { ChevronLeft, ChevronRight, Snowflake } from 'lucide-react';
import { CardRecord } from '@shared/types';

export interface HsbcCardCarouselProps {
  cards: CardRecord[];
  activeIndex: number;
  onCardChange: (index: number) => void;
  cardholderFallback?: string;
}

const HsbcMiniHexagon: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg viewBox="0 0 120 70" className={className} aria-hidden="true">
    <polygon points="25,10 5,35 25,60" fill="#DB0011" />
    <polygon points="95,10 115,35 95,60" fill="#DB0011" />
    <polygon points="25,10 60,35 95,10" fill="#DB0011" />
    <polygon points="25,60 60,35 95,60" fill="#DB0011" />
    <polygon points="25,10 60,35 25,60" fill="#FFFFFF" />
    <polygon points="95,10 60,35 95,60" fill="#FFFFFF" />
  </svg>
);

const CardFace: React.FC<{ card: CardRecord; isCenter: boolean; cardholderFallback: string }> = ({
  card,
  isCenter,
  cardholderFallback,
}) => {
  const isFrozen = card.cardStatus === 'FROZEN' || card.cardStatus === 'BLOCKED';
  const tier = card.cardTier;
  const isCredit = card.cardType === 'CREDIT';
  const isMastercard = card.network === 'MASTERCARD' || tier === 'PREMIER_WORLD_ELITE' || tier === 'TRAVEL_ONE';

  let bgStyle = 'bg-gradient-to-b from-[#ECEEF2] via-[#DFE3EA] to-[#CBD0DA] border-gray-300/90 text-[#1f1f1f]';
  let isDarkText = true;

  if (tier === 'PREMIER_WORLD_ELITE') {
    bgStyle = 'bg-gradient-to-br from-[#DB0011] via-[#B8000E] to-[#8C000A] border-red-900/40 text-white';
    isDarkText = false;
  } else if (tier === 'GLOBAL_TRAVEL') {
    bgStyle = 'bg-gradient-to-b from-[#040B1A] via-[#0B2250] to-[#1D54B5] border-blue-900/50 text-white';
    isDarkText = false;
  } else if (tier === 'TRAVEL_ONE') {
    bgStyle = 'bg-gradient-to-br from-[#0F2A44] via-[#17466E] to-[#0B1E30] border-sky-900/50 text-white';
    isDarkText = false;
  } else if (tier === 'LIVE_PLUS') {
    bgStyle = 'bg-gradient-to-br from-[#1C1F26] via-[#2C303A] to-[#14171C] border-neutral-700/70 text-white';
    isDarkText = false;
  } else if (tier === 'VISA_PLATINUM') {
    bgStyle = 'bg-gradient-to-br from-[#374151] via-[#4B5563] to-[#1F2937] border-slate-600 text-white';
    isDarkText = false;
  }

  const holderName = (card.cardholderName || cardholderFallback).toUpperCase();
  const displayNumber = card.maskedCardNumber || '4532 8829 4101 4281';

  return (
    <div className={`relative w-full h-full rounded-2xl p-3.5 sm:p-5 border flex flex-col justify-between overflow-hidden ${bgStyle}`}>
      {/* Specular Finish */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15 pointer-events-none" />

      {/* Cosmic Horizon Accent for Business Debit */}
      {tier === 'GLOBAL_TRAVEL' && (
        <div
          className="absolute -bottom-16 -left-8 -right-8 h-32 rounded-[100%] bg-gradient-to-t from-[#60A5FA]/50 via-[#3B82F6]/30 to-transparent blur-md pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Crimson Accent Stripe for Live+ Credit */}
      {tier === 'LIVE_PLUS' && (
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-b from-[#DB0011]/40 via-[#DB0011]/15 to-transparent -skew-x-12 pointer-events-none" aria-hidden="true" />
      )}

      {/* Frozen Overlay */}
      {isFrozen && isCenter && (
        <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-[#DB0011] text-white shadow-md flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase border border-white/30">
            <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Card Frozen</span>
          </div>
        </div>
      )}

      {/* Top Row: HSBC Emblem + Tier Tag */}
      <div className="flex items-center justify-between relative z-10 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <HsbcMiniHexagon className="w-5 h-3 sm:w-6 sm:h-3.5 shrink-0" />
          <span className={`text-[11px] sm:text-[12px] font-bold tracking-tight truncate ${isDarkText ? 'text-[#1f1f1f]' : 'text-white'}`}>
            {card.cardName ? card.cardName.replace('HSBC ', '') : 'HSBC India'}
          </span>
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase shrink-0 ${isDarkText ? 'text-[#333333]' : 'text-white/90'}`}>
          {tier === 'GLOBAL_TRAVEL' ? 'BUSINESS DEBIT' : isCredit ? 'CREDIT' : 'DEBIT'}
        </span>
      </div>

      {/* Center Section: Faceted Emblem on Personal Debit OR Chip + Hexagon Watermark */}
      {tier === 'PREMIER_PLATINUM' ? (
        <div className="my-auto flex items-center justify-center relative z-10">
          <div className="w-24 h-12 min-[360px]:w-28 min-[360px]:h-14 sm:w-32 sm:h-16 flex items-center justify-center filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
            <svg viewBox="0 0 240 140" className="w-full h-full" aria-hidden="true">
              <polygon points="50,20 10,70 50,120" fill="#B8000E" />
              <polygon points="190,20 230,70 190,120" fill="#B8000E" />
              <polygon points="50,20 120,70 190,20" fill="#DB0011" />
              <polygon points="50,120 120,70 190,120" fill="#DB0011" />
              <polygon points="50,20 120,70 50,120" fill="#FFFFFF" />
              <polygon points="190,20 120,70 190,120" fill="#F1F3F5" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="my-auto flex items-center justify-between relative z-10">
          <div className="w-8 h-5.5 sm:w-9 sm:h-6 rounded bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-700/40 shadow-inner" />
          <span className="text-[9px] uppercase tracking-widest opacity-70 font-semibold">
            {isCredit ? 'HSBC Premier Suite' : 'Commercial Banking'}
          </span>
        </div>
      )}

      {/* Card Number & Cardholder Name + Network Logo */}
      <div className="relative z-10 space-y-1">
        <div className={`font-mono text-[12px] min-[360px]:text-[13px] sm:text-[15px] font-bold tracking-[0.12em] ${isDarkText ? 'text-[#1f1f1f]' : 'text-white'}`}>
          {displayNumber}
        </div>

        <div className="flex items-end justify-between gap-2 pt-0.5">
          <div className="min-w-0">
            <div className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate ${isDarkText ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {holderName}
            </div>
            <div className={`text-[8px] sm:text-[9px] font-mono ${isDarkText ? 'text-[#555555]' : 'text-white/75'}`}>
              VALID THRU {card.expiryMonth}/{card.expiryYear}
            </div>
          </div>

          <div className="shrink-0">
            {isMastercard ? (
              <div className="flex items-center" aria-label="Mastercard">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EB001B] inline-block shadow-xs" />
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F79E1B] -ml-2.5 inline-block shadow-xs opacity-95" />
              </div>
            ) : (
              <span className={`font-black italic text-base sm:text-xl tracking-tighter ${isDarkText ? 'text-[#1434CB]' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'}`}>
                VISA
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HsbcCardCarousel: React.FC<HsbcCardCarouselProps> = ({
  cards,
  activeIndex,
  onCardChange,
  cardholderFallback = 'KARTHICK KRISHNA',
}) => {
  if (!cards.length) return null;

  const count = cards.length;
  const safeIdx = activeIndex % count;
  const currentCard = cards[safeIdx];
  const prevIdx = (safeIdx - 1 + count) % count;
  const nextIdx = (safeIdx + 1) % count;

  const handlePrev = () => {
    if (count <= 1) return;
    onCardChange(prevIdx);
  };

  const handleNext = () => {
    if (count <= 1) return;
    onCardChange(nextIdx);
  };

  return (
    <div className="w-full select-none overflow-hidden py-1">
      {/* 3D PEEKING CAROUSEL CONTAINER */}
      <div className="relative w-full h-[176px] min-[360px]:h-[196px] sm:h-[224px] flex items-center justify-center overflow-hidden">
        {count > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Select previous card"
            className="absolute right-[calc(50%+124px+10px)] min-[360px]:right-[calc(50%+142px+12px)] sm:right-[calc(50%+166px+14px)] w-[240px] min-[360px]:w-[276px] sm:w-[322px] aspect-[1.586/1] rounded-2xl shadow-lg cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200 shrink-0 z-0 text-left"
          >
            <CardFace card={cards[prevIdx]} isCenter={false} cardholderFallback={cardholderFallback} />
          </button>
        )}

        <div className="relative w-[248px] min-[360px]:w-[284px] sm:w-[332px] aspect-[1.586/1] rounded-2xl shadow-2xl shrink-0 z-10 transition-all duration-200 ease-out">
          <CardFace card={currentCard} isCenter={true} cardholderFallback={cardholderFallback} />
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Select next card"
            className="absolute left-[calc(50%+124px+10px)] min-[360px]:left-[calc(50%+142px+12px)] sm:left-[calc(50%+166px+14px)] w-[240px] min-[360px]:w-[276px] sm:w-[322px] aspect-[1.586/1] rounded-2xl shadow-lg cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200 shrink-0 z-0 text-left"
          >
            <CardFace card={cards[nextIdx]} isCenter={false} cardholderFallback={cardholderFallback} />
          </button>
        )}
      </div>

      {/* CAROUSEL NAVIGATION CONTROLS */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={handlePrev}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 hover:text-[#DB0011] transition-colors cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((c, idx) => (
            <button
              key={c.cardId || idx}
              type="button"
              onClick={() => onCardChange(idx)}
              className="min-w-[20px] min-h-[24px] flex items-center justify-center cursor-pointer"
              aria-label={`Select ${c.cardName || `card ${idx + 1}`}`}
            >
              <span
                className={`block transition-all duration-200 ${
                  idx === safeIdx
                    ? 'w-5 h-1.5 bg-[#1f1f1f] rounded-full'
                    : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 hover:text-[#DB0011] transition-colors cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
