import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Snowflake } from 'lucide-react';
import { CardRecord } from '@shared/types';

export interface HsbcCardCarouselProps {
  cards: CardRecord[];
  activeIndex: number;
  onCardChange: (index: number) => void;
}

export const HsbcCardCarousel: React.FC<HsbcCardCarouselProps> = ({
  cards,
  activeIndex,
  onCardChange,
}) => {
  const currentCard = cards[activeIndex] || cards[0];
  const isFrozen = currentCard?.cardStatus === 'FROZEN' || currentCard?.cardStatus === 'BLOCKED';
  const isCredit = currentCard?.cardType === 'CREDIT';

  const handlePrev = () => {
    if (cards.length <= 1) return;
    onCardChange(activeIndex === 0 ? cards.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    if (cards.length <= 1) return;
    onCardChange(activeIndex === cards.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="w-full select-none overflow-hidden py-1">
      {/* 3D PEEKING CAROUSEL CONTAINER */}
      <div className="relative w-full h-[175px] min-[360px]:h-[195px] sm:h-[225px] flex items-center justify-center overflow-hidden">
        {/* LEFT PEEKING CARD: HSBC RED CARD WITH MASTERCARD LOGO */}
        <motion.button
          type="button"
          onClick={handlePrev}
          whileHover={{ scale: 0.96 }}
          aria-label="Select previous card"
          className="absolute right-[calc(50%+122px+10px)] min-[360px]:right-[calc(50%+140px+12px)] sm:right-[calc(50%+164px+14px)] w-[238px] min-[360px]:w-[275px] sm:w-[320px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#C4000F] via-[#DB0011] to-[#99000A] shadow-lg border border-red-900/30 cursor-pointer opacity-85 hover:opacity-100 transition-opacity flex flex-col justify-between p-4 sm:p-5 overflow-hidden shrink-0 z-0 text-left"
        >
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
            <span className="text-white text-[12px] font-bold tracking-tight">HSBC</span>
          </div>

          <div className="my-auto text-center opacity-30">
            <div className="w-16 h-10 border-2 border-white/40 rounded-xs mx-auto" />
          </div>

          <div className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#EB001B] opacity-95 inline-block shadow-xs" />
            <span className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-95 -ml-3 inline-block shadow-xs" />
          </div>
        </motion.button>

        {/* ACTIVE CENTER CARD */}
        <motion.div
          key={currentCard?.cardId || activeIndex}
          initial={{ opacity: 0.85, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-[244px] min-[360px]:w-[280px] sm:w-[328px] aspect-[1.586/1] rounded-2xl p-4 sm:p-5 shadow-2xl border flex flex-col justify-between overflow-hidden shrink-0 z-10 transition-all ${
            isCredit
              ? 'border-slate-700/80 bg-gradient-to-br from-[#1B1F29] via-[#272D3B] to-[#11151E] text-white'
              : 'border-gray-300/80 bg-gradient-to-b from-[#EAECEF] via-[#DFE2E8] to-[#CDD1D9] text-[#1f1f1f]'
          }`}
        >
          {/* Specular sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/10 pointer-events-none" />

          {/* Frost Glass Overlay when Card is Frozen */}
          {isFrozen && (
            <div className="absolute inset-0 z-20 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-[#DB0011] text-white shadow-lg flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase border border-white/30">
                <Snowflake className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
                <span>Card Frozen</span>
              </div>
            </div>
          )}

          {/* Top Row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src="/logo.png"
                alt="HSBC"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
              <span className={`text-[13px] sm:text-[14px] font-bold tracking-tight ${isCredit ? 'text-white' : 'text-[#1f1f1f]'}`}>
                HSBC India
              </span>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase ${isCredit ? 'text-gray-300' : 'text-[#333333]'}`}>
              {currentCard?.cardType || 'DEBIT'}
            </span>
          </div>

          {/* CENTER: SIGNATURE 3D FACETED HSBC HEXAGON EMBLEM */}
          <div className="my-auto py-0.5 flex items-center justify-center relative z-10">
            <div className="relative w-28 h-16 min-[360px]:w-32 min-[360px]:h-18 sm:w-40 sm:h-22 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
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

          {/* Bottom Row */}
          <div className="flex items-center justify-between relative z-10">
            <div className={`text-[10px] font-semibold tracking-wider ${isCredit ? 'text-gray-300' : 'text-gray-600'}`}>
              {isFrozen ? 'BLOCKED' : currentCard?.contactlessEnabled ? 'CONTACTLESS' : 'CHIP & PIN'}
            </div>

            <div className="text-right">
              <span className="font-black italic text-lg sm:text-2xl tracking-tighter text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                VISA
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PEEKING CARD: DEEP BLUE PREMIER WORLD CARD */}
        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={{ scale: 0.96 }}
          aria-label="Select next card"
          className="absolute left-[calc(50%+122px+10px)] min-[360px]:left-[calc(50%+140px+12px)] sm:left-[calc(50%+164px+14px)] w-[238px] min-[360px]:w-[275px] sm:w-[320px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#071329] via-[#0E2042] to-[#040A17] shadow-lg border border-blue-900/40 cursor-pointer opacity-85 hover:opacity-100 transition-opacity flex flex-col justify-between p-4 sm:p-5 overflow-hidden shrink-0 z-0 text-right"
        >
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-white text-[11px] font-bold tracking-tight">PREMIER</span>
            <img src="/logo.png" alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
          </div>

          <div className="my-auto flex items-center justify-center opacity-40">
            <div className="w-16 h-16 rounded-full border border-blue-400/50 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-blue-300/40" />
            </div>
          </div>

          <div>
            <span className="font-black italic text-base tracking-tight text-white/80">
              VISA
            </span>
          </div>
        </motion.button>
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
                  idx === activeIndex
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
