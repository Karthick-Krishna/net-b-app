import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  X,
  CheckCircle2,
  Filter,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const WealthPage: React.FC = () => {
  const { wealth } = useBanking();

  const [activeTab, setActiveTab] = useState<'HOLDINGS' | 'EXPLORE' | 'SIP'>('HOLDINGS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [investModalFund, setInvestModalFund] = useState<any | null>(null);
  const [redeemModalFund, setRedeemModalFund] = useState<any | null>(null);
  const [investAmount, setInvestAmount] = useState('25000');
  const [redeemUnits, setRedeemUnits] = useState('All');

  // Curated HSBC India mutual funds catalogue
  const fundsCatalogue = [
    {
      id: 'hsbc-large-cap',
      name: 'HSBC Large Cap Equity Fund — Direct Growth',
      category: 'LARGE_CAP',
      categoryLabel: 'Large Cap Equity',
      risk: 'Very High',
      nav: '₹342.80',
      oneYearReturn: '+19.4%',
      threeYearReturn: '+16.8%',
      rating: '5 Star (Morningstar)',
      heldAmount: 1850000,
      heldUnits: '5,396.73',
    },
    {
      id: 'hsbc-mid-cap',
      name: 'HSBC Midcap Opportunities Fund — Direct Growth',
      category: 'MID_CAP',
      categoryLabel: 'Mid Cap Equity',
      risk: 'Very High',
      nav: '₹128.45',
      oneYearReturn: '+26.2%',
      threeYearReturn: '+21.5%',
      rating: '5 Star (Value Research)',
      heldAmount: 1420000,
      heldUnits: '11,054.88',
    },
    {
      id: 'hsbc-balanced-hybrid',
      name: 'HSBC Balanced Advantage Dynamic Fund',
      category: 'HYBRID',
      categoryLabel: 'Dynamic Asset Allocation',
      risk: 'Moderate',
      nav: '₹48.90',
      oneYearReturn: '+14.1%',
      threeYearReturn: '+13.2%',
      rating: '4 Star',
      heldAmount: 890000,
      heldUnits: '18,200.40',
    },
    {
      id: 'hsbc-liquid',
      name: 'HSBC Corporate Bond Liquid Fund',
      category: 'DEBT',
      categoryLabel: 'Corporate Debt AAA',
      risk: 'Low to Moderate',
      nav: '₹1,245.10',
      oneYearReturn: '+7.8%',
      threeYearReturn: '+7.4%',
      rating: 'AAA Safe',
      heldAmount: 400000,
      heldUnits: '321.26',
    },
    {
      id: 'hsbc-global-tech',
      name: 'HSBC Global Innovation Tech Equity Fund',
      category: 'INTERNATIONAL',
      categoryLabel: 'Global Innovation',
      risk: 'Very High',
      nav: '₹84.15',
      oneYearReturn: '+31.8%',
      threeYearReturn: '+18.9%',
      rating: '4 Star',
      heldAmount: 0,
      heldUnits: '0.00',
    },
  ];

  const filteredFunds = fundsCatalogue.filter(f => {
    if (activeTab === 'HOLDINGS') return f.heldAmount > 0;
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  });

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Purchase order of ${formatINR(parseFloat(investAmount))} executed for ${investModalFund?.name}! Units allotted within T+1 days.`);
    setInvestModalFund(null);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Redemption request submitted for ${redeemModalFund?.name}. Funds will credit to primary savings within 2 business days.`);
    setRedeemModalFund(null);
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            HSBC Wealth & Mutual Funds Management
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Institutional-grade asset allocation, curated mutual funds, and automated SIP investments
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E8E8] rounded-xl self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('HOLDINGS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'HOLDINGS' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            My Holdings
          </button>
          <button
            onClick={() => setActiveTab('EXPLORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'EXPLORE' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Explore All Funds
          </button>
          <button
            onClick={() => setActiveTab('SIP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'SIP' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Systematic SIPs
          </button>
        </div>
      </div>

      {/* Portfolio Value Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A2A2A] to-[#141414] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Total Invested Portfolio Value</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1">
            {formatINR(wealth?.totalPortfolioValue || 4560000)}
          </div>
          <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <span>Overall Returns: +18.42% (₹7,09,240.00 unrealized gain)</span>
          </div>
        </div>

        {/* Asset Allocation Metrics */}
        <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial bg-white/10 px-4 py-3 rounded-2xl text-center border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Equity</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">{wealth?.equityAllocation || 65}%</div>
          </div>
          <div className="flex-1 sm:flex-initial bg-white/10 px-4 py-3 rounded-2xl text-center border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Debt</div>
            <div className="text-base font-black text-blue-400 mt-0.5">{wealth?.debtAllocation || 25}%</div>
          </div>
          <div className="flex-1 sm:flex-initial bg-white/10 px-4 py-3 rounded-2xl text-center border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Gold</div>
            <div className="text-base font-black text-amber-400 mt-0.5">{wealth?.goldAllocation || 10}%</div>
          </div>
        </div>
      </div>

      {/* Explore Category Filters */}
      {activeTab === 'EXPLORE' && (
        <div className="flex flex-wrap gap-2">
          {['ALL', 'LARGE_CAP', 'MID_CAP', 'HYBRID', 'DEBT', 'INTERNATIONAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'bg-white border border-[#E8E8E8] text-[#555555] hover:bg-gray-50'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Funds Table / Grid */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
            {activeTab === 'HOLDINGS' ? 'Current Portfolio Holdings' : 'HSBC Curated Direct Mutual Funds'}
          </h3>
          <span className="text-xs font-bold text-[#DB0011]">
            {filteredFunds.length} Funds Available
          </span>
        </div>

        <div className="divide-y divide-[#E8E8E8]">
          {filteredFunds.map(fund => (
            <div key={fund.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
              <div className="space-y-1.5 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-50 text-[#DB0011] rounded text-[10px] font-bold">
                    {fund.categoryLabel}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{fund.rating}</span>
                </div>
                <h4 className="text-sm font-bold text-[#252525]">{fund.name}</h4>
                <div className="flex items-center gap-3 text-xs text-[#777777]">
                  <span>NAV: <strong className="text-[#252525]">{fund.nav}</strong></span>
                  <span>•</span>
                  <span>1Y Return: <strong className="text-[#16864A]">{fund.oneYearReturn}</strong></span>
                  <span>•</span>
                  <span>Risk: <strong className="text-amber-700">{fund.risk}</strong></span>
                </div>
              </div>

              {fund.heldAmount > 0 && (
                <div className="text-left md:text-right text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#777777] block">Invested Holding</span>
                  <span className="text-base font-black text-[#252525] mt-0.5 block">{formatINR(fund.heldAmount)}</span>
                  <span className="text-[11px] text-gray-400">{fund.heldUnits} Units</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvestModalFund(fund)}
                  className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Invest Now
                </button>
                {fund.heldAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => setRedeemModalFund(fund)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#252525] rounded-xl text-xs font-bold transition-colors"
                  >
                    Redeem
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simply Invest Referral Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-red-50/50 p-6 rounded-3xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DB0011] text-white uppercase">
            HSBC Simply Invest
          </span>
          <h4 className="text-sm font-bold text-[#252525] mt-1.5">
            Dedicated Wealth Relationship Manager & Global Advisory
          </h4>
          <p className="text-xs text-[#777777] mt-0.5">
            Consult with Vikram Singhania (VP, Wealth) for bespoke offshore portfolio allocation and tax harvesting.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.success('Advisory consultation booked with Relationship Manager')}
          className="px-5 py-2.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs whitespace-nowrap"
        >
          Request Advisory Call
        </button>
      </div>

      {/* Invest Modal */}
      {investModalFund && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-black text-[#252525]">Invest in Mutual Fund</h3>
              <button onClick={() => setInvestModalFund(null)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="text-xs text-gray-600 font-bold">{investModalFund.name}</div>
            <form onSubmit={handleInvest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Investment Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={investAmount}
                  onChange={e => setInvestAmount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-black text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[10000, 25000, 50000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInvestAmount(amt.toString())}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 font-bold"
                  >
                    +₹{amt / 1000}k
                  </button>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-gray-600">
                <div className="flex justify-between"><span>Payment Mode:</span><span className="font-bold">Net Banking Autopay</span></div>
                <div className="flex justify-between"><span>Exit Load:</span><span className="font-bold">1% if redeemed within 365 days</span></div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#DB0011] text-white rounded-xl font-bold shadow-xs">
                Confirm Purchase of {formatINR(parseFloat(investAmount || '0'))}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {redeemModalFund && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-black text-[#252525]">Redeem Mutual Fund Units</h3>
              <button onClick={() => setRedeemModalFund(null)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="text-xs text-gray-600 font-bold">{redeemModalFund.name}</div>
            <form onSubmit={handleRedeem} className="space-y-3.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between"><span>Total Units Available:</span><span className="font-bold">{redeemModalFund.heldUnits}</span></div>
                <div className="flex justify-between"><span>Estimated Valuation:</span><span className="font-bold text-[#16864A]">{formatINR(redeemModalFund.heldAmount)}</span></div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-xs">
                Confirm Full Redemption to Savings Account
              </button>
            </form>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
