import React from 'react';
import { Gift, Award, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const RewardsPage: React.FC = () => {
  const points = 48250;

  const catalog = [
    { title: 'Taj Hotels & Resorts Dining Voucher', points: 15000, value: '₹ 5,000 Dining Credit' },
    { title: 'British Airways Executive Club Miles', points: 25000, value: '10,000 Avios Air Miles' },
    { title: 'Statement Cashback Credit', points: 30000, value: '₹ 10,000 Direct Account Credit' },
    { title: 'Apple Store Digital Gift Card', points: 45000, value: '₹ 15,000 Voucher' },
  ];

  const handleRedeem = (title: string, requiredPoints: number) => {
    if (points < requiredPoints) {
      toast.error('Insufficient reward points balance');
      return;
    }
    toast.success(`Redeemed: ${title}! Certificate sent to registered email.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
          Premier Rewards & Privileges
        </h2>
        <p className="text-xs text-gray-500">
          Earn points with every transaction and redeem for luxury experiences
        </p>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-[#B0000D] text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/80 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Available Premier Points</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            {points.toLocaleString('en-IN')} PTS
          </div>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-center text-xs">
          <div className="text-white/80">Tier Status</div>
          <div className="text-sm font-bold text-amber-300">World Elite Diamond</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {catalog.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#DB0011]">
                <span>{item.points.toLocaleString()} Points</span>
                <Gift className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-2">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.value}</p>
            </div>
            <button
              onClick={() => handleRedeem(item.title, item.points)}
              className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
            >
              Redeem Voucher
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
