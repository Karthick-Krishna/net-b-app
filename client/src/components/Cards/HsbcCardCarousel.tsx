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

  const handlePrev = () => {
    onCardChange(activeIndex === 0 ? cards.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    onCardChange(activeIndex === cards.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="w-full select-none overflow-hidden py-1">
      {/* 3D PEEKING CAROUSEL CONTAINER */}
      <div className="relative w-full h-[205px] sm:h-[220px] flex items-center justify-center overflow-hidden">
        {/* LEFT PEEKING CARD: HSBC RED CREDIT CARD WITH MASTERCARD LOGO */}
        <motion.div
          onClick={handlePrev}
          whileHover={{ scale: 0.94 }}
          className="absolute right-[calc(50%+150px+12px)] sm:right-[calc(50%+165px+14px)] w-[295px] sm:w-[325px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#C4000F] via-[#DB0011] to-[#99000A] shadow-lg border border-red-900/30 cursor-pointer opacity-85 hover:opacity-100 transition-opacity flex flex-col justify-between p-4 sm:p-5 overflow-hidden shrink-0 z-0"
        >
          {/* Top Left: HSBC Logo */}
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain" />
            <span className="text-white text-[12px] font-bold tracking-tight">HSBC</span>
          </div>

          {/* Center: Subtle geometric watermark */}
          <div className="my-auto text-center opacity-30">
            <div className="w-16 h-10 border-2 border-white/40 rounded-xs mx-auto" />
          </div>

          {/* Bottom Left: Mastercard Interlocking Circles */}
          <div className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#EB001B] opacity-95 inline-block shadow-xs" />
            <span className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-95 -ml-3 inline-block shadow-xs" />
          </div>
        </motion.div>

        {/* ACTIVE CENTER CARD: PLATINUM / SILVER METALLIC CARD WITH ICONIC 3D HSBC EMBLEM */}
        <motion.div
          key={currentCard?.cardId || activeIndex}
          initial={{ opacity: 0.85, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[300px] sm:w-[335px] aspect-[1.586/1] rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-300/80 bg-gradient-to-b from-[#EAECEF] via-[#DFE2E8] to-[#CDD1D9] flex flex-col justify-between overflow-hidden shrink-0 z-10"
        >
          {/* Subtle Metallic Specular Sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/10 pointer-events-none" />

          {/* Top Row: Logo + "HSBC India" (Left) & "DEBIT" (Right) */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="HSBC"
                className="w-6 h-6 object-contain"
              />
              <span className="text-[14px] font-bold text-[#1f1f1f] tracking-tight">
                HSBC India
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#333333] uppercase">
              {currentCard?.cardType || 'DEBIT'}
            </span>
          </div>

          {/* CENTER: THE SIGNATURE 3D FACETED HSBC HEXAGON EMBLEM */}
          <div className="my-auto py-0.5 flex items-center justify-center relative z-10">
            <div className="relative w-36 h-20 sm:w-42 sm:h-24 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]">
              <svg viewBox="0 0 240 140" className="w-full h-full">
                <defs>
                  {/* Rich 3D lighting gradients matching the authentic HSBC metallic card */}
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

                {/* Left Outer Red Wing Triangle */}
                <polygon points="50,20 10,70 50,120" fill="url(#facetLeftWing)" />

                {/* Right Outer Red Wing Triangle */}
                <polygon points="190,20 230,70 190,120" fill="url(#facetRightWing)" />

                {/* Center Top Red Triangle */}
                <polygon points="50,20 120,70 190,20" fill="url(#facetTop)" />

                {/* Center Bottom Red Triangle */}
                <polygon points="50,120 120,70 190,120" fill="url(#facetBottom)" />

                {/* Center Left White Diamond Triangle */}
                <polygon points="50,20 120,70 50,120" fill="url(#facetWhiteLeft)" />

                {/* Center Right White Diamond Triangle */}
                <polygon points="190,20 120,70 190,120" fill="url(#facetWhiteRight)" />
              </svg>
            </div>
          </div>

          {/* Bottom Row: Contactless Status & Crisp VISA Typography */}
          <div className="flex items-center justify-between relative z-10">
            {currentCard?.cardStatus === 'FROZEN' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DB0011] text-white text-[10px] font-bold tracking-wider">
                <Snowflake className="w-3 h-3" />
                <span>CARD FROZEN</span>
              </div>
            ) : (
              <div className="text-[10px] text-gray-500 font-semibold tracking-wider">
                {currentCard?.contactlessEnabled ? 'CONTACTLESS' : 'CHIP & PIN'}
              </div>
            )}

            {/* VISA Logo in Crisp Italic White */}
            <div className="text-right">
              <span className="font-black italic text-xl sm:text-2xl tracking-tighter text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                VISA
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PEEKING CARD: DEEP BLUE GLOBE / PREMIER WORLD CARD */}
        <motion.div
          onClick={handleNext}
          whileHover={{ scale: 0.94 }}
          className="absolute left-[calc(50%+150px+12px)] sm:left-[calc(50%+165px+14px)] w-[295px] sm:w-[325px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#071329] via-[#0E2042] to-[#040A17] shadow-lg border border-blue-900/40 cursor-pointer opacity-85 hover:opacity-100 transition-opacity flex flex-col justify-between p-4 sm:p-5 overflow-hidden shrink-0 z-0"
        >
          {/* Top Right: HSBC Logo */}
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-white text-[11px] font-bold tracking-tight">PREMIER</span>
            <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain" />
          </div>

          {/* Center: Stylized Earth Globe / Grid */}
          <div className="my-auto flex items-center justify-center opacity-40">
            <div className="w-16 h-16 rounded-full border border-blue-400/50 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-blue-300/40" />
            </div>
          </div>

          {/* Bottom Right: Gold Chip / Emblem */}
          <div className="text-right">
            <span className="font-black italic text-base tracking-tight text-white/80">
              VISA
            </span>
          </div>
        </motion.div>
      </div>

      {/* CAROUSEL NAVIGATION CONTROLS: <  • ▬ •  > */}
      <div className="mt-3 flex items-center justify-center gap-6">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="p-1 text-gray-700 hover:text-[#DB0011] transition-colors cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Pagination Indicators: Active is an elongated dark pill */}
        <div className="flex items-center gap-2">
          {cards.map((c, idx) => (
            <button
              key={c.cardId || idx}
              type="button"
              onClick={() => onCardChange(idx)}
              className={`transition-all duration-200 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 h-1.5 bg-[#1f1f1f] rounded-full'
                  : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Select card ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="p-1 text-gray-700 hover:text-[#DB0011] transition-colors cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
