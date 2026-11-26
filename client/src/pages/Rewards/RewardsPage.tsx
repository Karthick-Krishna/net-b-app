import React, { useState } from 'react';
import { Gift, Award, CheckCircle2 } from 'lucide-react';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { useBanking } from '../../context/BankingContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
import toast from 'react-hot-toast';

export const RewardsPage: React.FC = () => {
  const { cards, updateCardSettings } = useBanking();
  const { requestAction } = useActionFeedback();
  const premierCard = cards.find(c => c.cardTier === 'PREMIER_WORLD_ELITE') || cards[0];
  const [fallbackPoints, setFallbackPoints] = useState(82636);
  const points = premierCard?.rewardPoints ?? fallbackPoints;
  const [redeemedList, setRedeemedList] = useState<string[]>([]);

  const catalog = [
    { id: 'taj', title: 'Taj Hotels & Resorts Dining Voucher', points: 15000, value: '₹5,000 Dining Credit' },
    { id: 'ba', title: 'British Airways Executive Club Miles', points: 25000, value: '10,000 Avios Air Miles' },
    { id: 'cash', title: 'Statement Cashback Credit', points: 30000, value: '₹10,000 Direct Account Credit' },
    { id: 'apple', title: 'Apple Store Digital Gift Card', points: 45000, value: '₹15,000 Voucher' },
  ];

  const handleRedeem = (_id: string, title: string, requiredPoints: number, value: string) => {
    if (points < requiredPoints) {
      toast.error('Insufficient reward points balance');
      return;
    }

    const ref = 'RWD/' + Date.now().toString().slice(-6);
    requestAction({
      title: `Redeem ${requiredPoints.toLocaleString('en-IN')} Premier Points?`,
      message: `Authorize redemption of ${requiredPoints.toLocaleString('en-IN')} PTS for ${title} (${value}).`,
      confirmLabel: 'Authorize with MPIN',
      requireMpin: true,
      onConfirm: () => {
        const nextPoints = Math.max(0, points - requiredPoints);
        if (premierCard) {
          updateCardSettings(premierCard.cardId, { rewardPoints: nextPoints });
        } else {
          setFallbackPoints(nextPoints);
        }
        setRedeemedList(prev => [`${title} (${ref})`, ...prev]);
        return {
          title: 'Voucher Redeemed',
          message: `${title} (${value}) redeemed using ${requiredPoints.toLocaleString('en-IN')} PTS. Remaining balance: ${nextPoints.toLocaleString('en-IN')} PTS.`,
          icon: 'check',
          referenceId: ref,
        };
      },
    });
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            HSBC Premier Rewards
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Redeem Premier points for travel miles, dining, and statement credits
          </p>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
          <div className="p-4 sm:p-5 bg-[#F5F6F8] text-[#1f1f1f] rounded-2xl border border-gray-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#666666] font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                <span>Available Premier Points</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mt-1 text-[#1f1f1f] tabular-nums">
                {points.toLocaleString('en-IN')} PTS
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200/80 text-xs shadow-2xs">
              <span className="text-[#777777] mr-1.5 font-medium">Tier:</span>
              <span className="font-bold text-[#DB0011]">Premier World Elite</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {catalog.map(item => {
              const canAfford = points >= item.points;
              return (
                <div key={item.id} className="p-4 sm:p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#DB0011]">
                      <span>{item.points.toLocaleString('en-IN')} Points</span>
                      <Gift className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h2 className="text-sm font-bold text-[#1f1f1f] mt-2">{item.title}</h2>
                    <p className="text-xs text-[#777777] mt-0.5">{item.value}</p>
                  </div>
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleRedeem(item.id, item.title, item.points, item.value)}
                    className="w-full min-h-[42px] bg-[#1f1f1f] hover:bg-black active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-semibold rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    {canAfford ? 'Redeem Voucher' : 'Insufficient Points'}
                  </button>
                </div>
              );
            })}
          </div>

          {redeemedList.length > 0 && (
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-[#16864A]">Recent Redemptions This Session</div>
              {redeemedList.map((title, idx) => (
                <div key={idx} className="text-xs text-[#1f1f1f] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16864A] shrink-0" aria-hidden="true" />
                  <span>{title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
