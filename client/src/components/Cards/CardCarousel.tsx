import React, { useState } from 'react';
import { CardRecord } from '@shared/types';
import { CardArtwork } from './CardArtwork';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CardCarouselProps {
  cards: CardRecord[];
  cardholderName?: string;
  onSelectCard?: (card: CardRecord) => void;
  selectedCardId?: string;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  cardholderName,
  onSelectCard,
  selectedCardId,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!cards.length) return null;

  const currentCard = cards[activeIndex] || cards[0];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Carousel container */}
      <div className="relative max-w-md mx-auto">
        <CardArtwork
          card={currentCard}
          cardholderName={cardholderName}
          onClick={() => onSelectCard?.(currentCard)}
        />

        {cards.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous card"
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E8E8E8] shadow-md flex items-center justify-center text-gray-700 hover:text-[#DB0011] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next card"
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E8E8E8] shadow-md flex items-center justify-center text-gray-700 hover:text-[#DB0011] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {cards.length > 1 && (
        <div className="flex justify-center items-center gap-2 pt-1">
          {cards.map((c, i) => (
            <button
              key={c.cardId}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-[#DB0011]' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              title={`Card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
