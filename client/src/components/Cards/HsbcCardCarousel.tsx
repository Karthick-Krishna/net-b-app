import React from 'react';
import { ChevronLeft, ChevronRight, Snowflake, Wifi } from 'lucide-react';
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

/**
 * Faceted geometric HSBC Guardian Lion artwork matching HSBC's Shift Global Card Design System.
 */
const FacetedLionArtwork: React.FC<{ accent?: string; stroke?: string }> = ({
  accent = 'rgba(255,255,255,0.14)',
  stroke = 'rgba(255,255,255,0.22)',
}) => (
  <svg viewBox="0 0 220 150" className="absolute right-0 bottom-0 h-full w-3/4 pointer-events-none" aria-hidden="true">
    <polygon points="120,10 175,28 145,62" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="175,28 215,52 178,86 145,62" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="120,10 145,62 95,55" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="95,55 145,62 128,108 78,94" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="145,62 178,86 165,134 128,108" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="178,86 218,95 205,146 165,134" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="78,94 128,108 112,148 58,136" fill={accent} stroke={stroke} strokeWidth="0.7" />
    <polygon points="128,108 165,134 148,150 112,148" fill={accent} stroke={stroke} strokeWidth="0.7" />
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
  const isDebit = card.cardType === 'DEBIT';
  const isMastercard = card.network === 'MASTERCARD' || tier === 'PREMIER_WORLD_ELITE' || tier === 'TRAVEL_ONE';

  // Real HSBC India Global Card Design System colorways
  let bgStyle = 'bg-gradient-to-br from-[#121418] via-[#1C2027] to-[#0B0D10] border-neutral-800 text-white';
  let isLightCard = false;
  let lionAccent = 'rgba(255,255,255,0.08)';
  let lionStroke = 'rgba(255,255,255,0.16)';

  if (tier === 'PREMIER_PLATINUM') {
    // HSBC India Premier Debit Card: Sleek matte obsidian black with red debit core edge & lion
    bgStyle = 'bg-gradient-to-br from-[#14161A] via-[#1E2229] to-[#0B0C0F] border-neutral-800 text-white';
    lionAccent = 'rgba(219,0,17,0.12)';
    lionStroke = 'rgba(255,255,255,0.14)';
  } else if (tier === 'PREMIER_WORLD_ELITE') {
    // HSBC Premier Credit Card: Matte black/charcoal crimson luxury with Stephen & Stitt Lion artwork
    bgStyle = 'bg-gradient-to-br from-[#1A0D10] via-[#2B1218] to-[#0E0709] border-red-900/50 text-white';
    lionAccent = 'rgba(219,0,17,0.20)';
    lionStroke = 'rgba(255,255,255,0.18)';
  } else if (tier === 'TRAVEL_ONE') {
    // HSBC TravelOne Credit Card: Metallic teal/ocean blue multi-tone global motif
    bgStyle = 'bg-gradient-to-br from-[#0F2A44] via-[#17517E] to-[#0B1E30] border-sky-800/50 text-white';
    lionAccent = 'rgba(56,189,248,0.15)';
    lionStroke = 'rgba(255,255,255,0.20)';
  } else if (tier === 'LIVE_PLUS') {
    // HSBC Live+ Credit Card: Signature vibrant HSBC Red
    bgStyle = 'bg-gradient-to-br from-[#DB0011] via-[#B8000E] to-[#8C000A] border-red-900/40 text-white';
    lionAccent = 'rgba(255,255,255,0.13)';
    lionStroke = 'rgba(255,255,255,0.24)';
  } else if (tier === 'VISA_PLATINUM') {
    // HSBC Visa Platinum Credit Card: Bright clean silver-white & brushed platinum
    bgStyle = 'bg-gradient-to-br from-[#F3F5F8] via-[#E3E7EE] to-[#CDD3DE] border-gray-300 text-[#1f1f1f]';
    isLightCard = true;
    lionAccent = 'rgba(31,31,31,0.06)';
    lionStroke = 'rgba(31,31,31,0.12)';
  }

  const holderName = (card.cardholderName || cardholderFallback).toUpperCase();
  const last4 = (card.maskedCardNumber || '4281').slice(-4);
  const displayNumber = `•••• •••• •••• ${last4}`;

  const shortProductTitle =
    tier === 'PREMIER_PLATINUM'
      ? 'Premier Debit'
      : tier === 'PREMIER_WORLD_ELITE'
      ? 'Premier'
      : tier === 'TRAVEL_ONE'
      ? 'TravelOne'
      : tier === 'LIVE_PLUS'
      ? 'Live+'
      : 'Platinum';

  return (
    <div className={`relative w-full h-full rounded-2xl p-3.5 sm:p-5 border flex flex-col justify-between overflow-hidden ${bgStyle}`}>
      {/* Debit Card Colored Core Edge (Authentic HSBC visual distinction for Debit cards) */}
      {isDebit && (
        <div
          className="absolute inset-y-0 left-0 w-[3.5px] bg-[#DB0011] z-20 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Faceted Lion Global Artwork */}
      <FacetedLionArtwork accent={lionAccent} stroke={lionStroke} />

      {/* Tactile Accessibility Edge Notch */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full ${isLightCard ? 'bg-gray-400/50' : 'bg-white/25'} pointer-events-none`}
        aria-hidden="true"
      />

      {/* Specular Finish */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15 pointer-events-none" />

      {/* Frozen Overlay */}
      {isFrozen && isCenter && (
        <div className="absolute inset-0 z-30 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-[#DB0011] text-white shadow-md flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase border border-white/30">
            <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Card Frozen</span>
          </div>
        </div>
      )}

      {/* Top Row: HSBC Hexagon + Product Name | Debit/Credit + Contactless */}
      <div className="flex items-center justify-between relative z-10 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <HsbcMiniHexagon className="w-5 h-3 sm:w-6 sm:h-3.5 shrink-0" />
          <span className={`text-[12px] sm:text-[13px] font-bold tracking-tight truncate ${isLightCard ? 'text-[#1f1f1f]' : 'text-white'}`}>
            {shortProductTitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Wifi className={`w-3.5 h-3.5 rotate-90 opacity-75 ${isLightCard ? 'text-[#1f1f1f]' : 'text-white'}`} aria-hidden="true" />
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isLightCard ? 'text-[#333333]' : 'text-white/90'}`}>
            {isCredit ? 'CREDIT' : 'DEBIT'}
          </span>
        </div>
      </div>

      {/* Middle Row: EMV Metallic Chip */}
      <div className="my-auto flex items-center justify-between relative z-10">
        <div className="w-9 h-6 rounded-[4px] bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-700/40 shadow-inner flex items-center justify-center overflow-hidden">
          <div className="w-4 h-2.5 border border-amber-800/35 rounded-[2px]" />
        </div>
      </div>

      {/* Bottom Row: Masked Number + Cardholder Name + Network Mark */}
      <div className="relative z-10 space-y-1">
        <div className={`font-mono text-[12px] min-[360px]:text-[13px] sm:text-[14px] font-bold tracking-[0.14em] ${isLightCard ? 'text-[#1f1f1f]' : 'text-white'}`}>
          {displayNumber}
        </div>

        <div className="flex items-end justify-between gap-2 pt-0.5">
          <div className="min-w-0">
            <div className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate ${isLightCard ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {holderName}
            </div>
            <div className={`text-[8px] sm:text-[9px] font-mono ${isLightCard ? 'text-[#555555]' : 'text-white/75'}`}>
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
              <span className={`font-black italic text-base sm:text-xl tracking-tighter ${isLightCard ? 'text-[#1434CB]' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'}`}>
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
