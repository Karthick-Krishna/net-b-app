import React from 'react';
import { ChevronLeft, ChevronRight, Snowflake } from 'lucide-react';
import { CardRecord } from '@shared/types';

export interface HsbcCardCarouselProps {
  cards: CardRecord[];
  activeIndex: number;
  onCardChange: (index: number) => void;
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

const CardFace: React.FC<{ card: CardRecord; isCenter: boolean }> = ({ card, isCenter }) => {
  const isFrozen = card.cardStatus === 'FROZEN' || card.cardStatus === 'BLOCKED';
  const tier = card.cardTier;
  const isCrimsonCredit = tier === 'PREMIER_WORLD_ELITE' || card.cardType === 'CREDIT';
  const isGlobalBlue = tier === 'GLOBAL_TRAVEL';

  const bgStyle = isCrimsonCredit
    ? 'bg-gradient-to-br from-[#DB0011] via-[#B8000E] to-[#8C000A] border-red-900/40 text-white'
    : isGlobalBlue
    ? 'bg-gradient-to-b from-[#040B1A] via-[#0B2250] to-[#1D54B5] border-blue-900/50 text-white'
    : 'bg-gradient-to-b from-[#ECEEF2] via-[#DFE3EA] to-[#CBD0DA] border-gray-300/90 text-[#1f1f1f]';

  return (
    <div className={`relative w-full h-full rounded-2xl p-4 sm:p-5 border flex flex-col justify-between overflow-hidden ${bgStyle}`}>
      {/* Subtle Specular Metallic Finish */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/15 pointer-events-none" />

      {/* Blue Earth Horizon Glow for Global Business Debit Card */}
      {isGlobalBlue && (
        <div
          className="absolute -bottom-16 -left-8 -right-8 h-32 rounded-[100%] bg-gradient-to-t from-[#60A5FA]/50 via-[#3B82F6]/30 to-transparent blur-md pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Frozen Overlay (Static crisp glass — no childish animations) */}
      {isFrozen && isCenter && (
        <div className="absolute inset-0 z-20 bg-slate-900/45 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-[#DB0011] text-white shadow-md flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase border border-white/30">
            <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Card Frozen</span>
          </div>
        </div>
      )}

      {/* Top Row: HSBC Vector Emblem + Name | Card Type */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <HsbcMiniHexagon className="w-6 h-3.5 sm:w-7 sm:h-4 shrink-0" />
          <span className={`text-[12px] sm:text-[13px] font-bold tracking-tight ${isCrimsonCredit || isGlobalBlue ? 'text-white' : 'text-[#1f1f1f]'}`}>
            HSBC <span className="font-normal opacity-90">India</span>
          </span>
        </div>
        <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${isCrimsonCredit || isGlobalBlue ? 'text-white/90' : 'text-[#333333]'}`}>
          {card.cardTier === 'GLOBAL_TRAVEL' ? 'BUSINESS DEBIT' : card.cardType}
        </span>
      </div>

      {/* Center Card Artwork */}
      {!isCrimsonCredit && !isGlobalBlue ? (
        /* Signature 3D Faceted HSBC Hexagon Emblem (Reference Platinum Debit Card) */
        <div className="my-auto py-0.5 flex items-center justify-center relative z-10">
          <div className="relative w-28 h-16 min-[360px]:w-32 min-[360px]:h-18 sm:w-40 sm:h-22 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]">
            <svg viewBox="0 0 240 140" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF3848" />
                  <stop offset="45%" stopColor="#DB0011" />
                  <stop offset="100%" stopColor="#96000B" />
                </linearGradient>
                <linearGradient id="facetBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A8000C" />
                  <stop offset="55%" stopColor="#DB0011" />
                  <stop offset="100%" stopColor="#FF4D5B" />
                </linearGradient>
                <linearGradient id="facetLeftWing" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#9E000B" />
                  <stop offset="50%" stopColor="#DB0011" />
                  <stop offset="100%" stopColor="#FF3848" />
                </linearGradient>
                <linearGradient id="facetRightWing" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="#9E000B" />
                  <stop offset="50%" stopColor="#DB0011" />
                  <stop offset="100%" stopColor="#FF3848" />
                </linearGradient>
                <linearGradient id="facetWhiteLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E0E3E8" />
                </linearGradient>
                <linearGradient id="facetWhiteRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#D5D9E0" />
                </linearGradient>
              </defs>
              <polygon points="50,20 10,70 50,120" fill="url(#facetLeftWing)" />
              <polygon points="190,20 230,70 190,120" fill="url(#facetRightWing)" />
              <polygon points="50,20 120,70 190,20" fill="url(#facetTop)" />
              <polygon points="50,120 120,70 190,120" fill="url(#facetBottom)" />
              <polygon points="50,20 120,70 50,120" fill="url(#facetWhiteLeft)" />
              <polygon points="190,20 120,70 190,120" fill="url(#facetWhiteRight)" />
            </svg>
          </div>
        </div>
      ) : (
        /* Clean EMV Chip + Pan Tail for Business Global & Credit Cards */
        <div className="my-auto flex items-center justify-between relative z-10">
          <div className="w-9 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-700/40 shadow-inner" />
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest opacity-90">
            •••• {card.maskedCardNumber.slice(-4)}
          </span>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between relative z-10">
        {isCrimsonCredit ? (
          <div className="flex items-center">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EB001B] inline-block shadow-xs" />
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F79E1B] -ml-2.5 inline-block shadow-xs opacity-95" />
          </div>
        ) : (
          <div className={`text-[10px] font-semibold tracking-wider ${isGlobalBlue ? 'text-blue-100' : 'text-gray-600'}`}>
            {isFrozen ? 'BLOCKED' : card.contactlessEnabled ? 'CONTACTLESS' : 'CHIP & PIN'}
          </div>
        )}

        <div className="text-right">
          {isCrimsonCredit ? (
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
              WORLD ELITE
            </span>
          ) : (
            <span className="font-black italic text-lg sm:text-2xl tracking-tighter text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
              VISA
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const HsbcCardCarousel: React.FC<HsbcCardCarouselProps> = ({
  cards,
  activeIndex,
  onCardChange,
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
      <div className="relative w-full h-[172px] min-[360px]:h-[192px] sm:h-[222px] flex items-center justify-center overflow-hidden">
        {/* LEFT PEEKING CARD (Dynamic Previous Card) */}
        {count > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Select previous card"
            className="absolute right-[calc(50%+122px+10px)] min-[360px]:right-[calc(50%+140px+12px)] sm:right-[calc(50%+164px+14px)] w-[238px] min-[360px]:w-[275px] sm:w-[320px] aspect-[1.586/1] rounded-2xl shadow-lg cursor-pointer opacity-85 hover:opacity-100 transition-opacity duration-200 shrink-0 z-0 text-left"
          >
            <CardFace card={cards[prevIdx]} isCenter={false} />
          </button>
        )}

        {/* ACTIVE CENTER CARD */}
        <div className="relative w-[244px] min-[360px]:w-[280px] sm:w-[328px] aspect-[1.586/1] rounded-2xl shadow-2xl shrink-0 z-10 transition-all duration-200 ease-out">
          <CardFace card={currentCard} isCenter={true} />
        </div>

        {/* RIGHT PEEKING CARD (Dynamic Next Card) */}
        {count > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Select next card"
            className="absolute left-[calc(50%+122px+10px)] min-[360px]:left-[calc(50%+140px+12px)] sm:left-[calc(50%+164px+14px)] w-[238px] min-[360px]:w-[275px] sm:w-[320px] aspect-[1.586/1] rounded-2xl shadow-lg cursor-pointer opacity-85 hover:opacity-100 transition-opacity duration-200 shrink-0 z-0 text-left"
          >
            <CardFace card={cards[nextIdx]} isCenter={false} />
          </button>
        )}
      </div>

      {/* CAROUSEL NAVIGATION CONTROLS: <  • ▬ •  > */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={handlePrev}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 hover:text-[#DB0011] transition-colors cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {cards.map((c, idx) => (
            <button
              key={c.cardId || idx}
              type="button"
              onClick={() => onCardChange(idx)}
              className="min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer"
              aria-label={`Select card ${idx + 1}`}
            >
              <span
                className={`block transition-all duration-200 ${
                  idx === safeIdx
                    ? 'w-6 h-1.5 bg-[#1f1f1f] rounded-full'
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
