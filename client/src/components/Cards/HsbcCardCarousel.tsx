import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="w-full select-none">
      {/* PEEKING CAROUSEL CONTAINER */}
      <div className="relative w-full overflow-hidden flex items-center justify-center py-2">
        {/* LEFT PEEKING CARD (HSBC Red Credit Card with Mastercard) */}
        <div
          onClick={handlePrev}
          className="absolute -left-[240px] sm:-left-[200px] w-[290px] sm:w-[320px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#B0000D] via-[#DB0011] to-[#80000A] shadow-md border border-red-900/30 cursor-pointer opacity-70 scale-95 transition-all overflow-hidden flex flex-col justify-between p-4"
        >
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain" />
            <span className="text-white text-[11px] font-bold">HSBC</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90 inline-block" />
            <span className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90 -ml-2.5 inline-block" />
          </div>
        </div>

        {/* CENTER ACTIVE CARD (Iconic HSBC Platinum / Silver Metallic Card) */}
        <motion.div
          key={currentCard?.cardId || activeIndex}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative w-[300px] sm:w-[335px] aspect-[1.586/1] rounded-2xl p-5 shadow-xl border border-gray-300/60 bg-gradient-to-br from-[#F5F6F8] via-[#E6E8EC] to-[#CDD0D6] flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Metallic Specular Horizontal Brush */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/5 pointer-events-none" />

          {/* Top Bar on Card: Logo + "HSBC India" (Left) and "DEBIT" (Right) */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="HSBC"
                className="w-6 h-6 object-contain"
              />
              <span className="text-[13px] font-bold text-[#1f1f1f] tracking-tight">
                HSBC India
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#555555] uppercase">
              {currentCard?.cardType || 'DEBIT'}
            </span>
          </div>

          {/* CENTER: THE ICONIC HSBC MULTIFACETED 3D RED HEXAGON EMBLEM */}
          <div className="my-auto py-1 flex items-center justify-center relative z-10">
            <div className="relative w-36 h-20 sm:w-40 sm:h-24 flex items-center justify-center filter drop-shadow-md">
              <svg viewBox="0 0 240 140" className="w-full h-full">
                <defs>
                  {/* Facet gradients for 3D metallic gem look */}
                  <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3342" />
                    <stop offset="50%" stopColor="#DB0011" />
                    <stop offset="100%" stopColor="#9E000C" />
                  </linearGradient>
                  <linearGradient id="facetBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C4000F" />
                    <stop offset="50%" stopColor="#DB0011" />
                    <stop offset="100%" stopColor="#FF4755" />
                  </linearGradient>
                  <linearGradient id="facetLeftWing" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#B0000D" />
                    <stop offset="100%" stopColor="#FF2E3E" />
                  </linearGradient>
                  <linearGradient id="facetRightWing" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#B0000D" />
                    <stop offset="100%" stopColor="#FF2E3E" />
                  </linearGradient>
                  <linearGradient id="facetWhiteLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E2E4E8" />
                  </linearGradient>
                  <linearGradient id="facetWhiteRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#D8DCE2" />
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

          {/* Bottom Bar: Contactless / Frozen Status (Left) and VISA Logo (Right) */}
          <div className="flex items-center justify-between relative z-10">
            {currentCard?.cardStatus === 'FROZEN' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#DB0011] text-white text-[10px] font-bold tracking-wider">
                <Snowflake className="w-3 h-3" />
                <span>CARD FROZEN</span>
              </div>
            ) : (
              <div className="text-[10px] text-gray-500 font-semibold tracking-wider">
                {currentCard?.contactlessEnabled ? 'CONTACTLESS • PAY' : 'CHIP & PIN'}
              </div>
            )}

            {/* VISA Logo in Crisp Silver / White typography */}
            <div className="text-right">
              <span className="font-extrabold italic text-lg sm:text-xl tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                VISA
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PEEKING CARD (HSBC Premier Globe Card) */}
        <div
          onClick={handleNext}
          className="absolute -right-[240px] sm:-right-[200px] w-[290px] sm:w-[320px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#102244] to-[#050C18] shadow-md border border-blue-900/40 cursor-pointer opacity-70 scale-95 transition-all overflow-hidden flex flex-col justify-between p-4"
        >
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="HSBC" className="w-5 h-5 object-contain" />
            <span className="text-white text-[11px] font-bold">PREMIER</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30" />
        </div>
      </div>

      {/* CAROUSEL NAVIGATION: <  • ▬ •  > */}
      <div className="mt-3 flex items-center justify-center gap-5">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="p-1.5 text-gray-700 hover:text-[#DB0011] transition-colors"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Pagination Dots: Active is an elongated pill */}
        <div className="flex items-center gap-2">
          {cards.map((c, idx) => (
            <button
              key={c.cardId || idx}
              type="button"
              onClick={() => onCardChange(idx)}
              className={`transition-all duration-200 ${
                idx === activeIndex
                  ? 'w-5 h-1.5 bg-[#1f1f1f] rounded-full'
                  : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="p-1.5 text-gray-700 hover:text-[#DB0011] transition-colors"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
