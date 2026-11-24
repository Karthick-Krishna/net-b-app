import React, { useState } from 'react';
import { CardRecord } from '@shared/types';
import { CardArtwork } from './CardArtwork';
import { Eye, EyeOff, ShieldCheck, Zap, Copy, Check } from 'lucide-react';

export interface VirtualCardProps {
  card: CardRecord;
  cardholderName?: string;
  onManage?: () => void;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({
  card,
  cardholderName,
  onManage,
}) => {
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Visual Card Artwork with Virtual Variant */}
      <CardArtwork
        card={card}
        cardholderName={cardholderName}
        variant="virtual"
        onClick={onManage}
      />

      {/* Virtual Security Token Info */}
      <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200/60 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-[#252525]">Instant Digital Tokenization</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
            Active for E-Commerce
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[#777777]">Dynamic Security CVV:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-[#252525]">
              {showCvv ? '482' : '•••'}
            </span>
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="text-purple-700 hover:text-purple-900 text-[11px] font-bold"
            >
              {showCvv ? 'Hide' : 'Reveal (30s)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
