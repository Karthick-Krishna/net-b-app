import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

interface FundItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  risk: string;
  nav: string;
  oneYearReturn: string;
  threeYearReturn: string;
  rating: string;
  heldAmount: number;
  heldUnits: string;
  sipMonthly?: number;
  sipActive?: boolean;
  sipDate?: string;
}

const INITIAL_FUNDS: FundItem[] = [
  {
    id: 'hsbc-large-cap',
    name: 'HSBC Large Cap Equity Fund — Direct Growth',
    category: 'LARGE_CAP',
    categoryLabel: 'Large Cap Equity',
    risk: 'Very High',
    nav: '₹342.80',
    oneYearReturn: '+19.4%',
    threeYearReturn: '+16.8%',
    rating: '5 Star',
    heldAmount: 1850000,
    heldUnits: '5,396.73',
    sipMonthly: 50000,
    sipActive: true,
    sipDate: '5th of every month',
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
    rating: '5 Star',
    heldAmount: 1420000,
    heldUnits: '11,054.88',
    sipMonthly: 25000,
    sipActive: true,
    sipDate: '10th of every month',
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

export const WealthPage: React.FC = () => {
  const { wealth } = useBanking();

  const [activeTab, setActiveTab] = useState<'HOLDINGS' | 'EXPLORE' | 'SIP'>('HOLDINGS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [funds, setFunds] = useState<FundItem[]>(INITIAL_FUNDS);
  const [investModalFund, setInvestModalFund] = useState<FundItem | null>(null);
  const [redeemModalFund, setRedeemModalFund] = useState<FundItem | null>(null);
  const [investAmount, setInvestAmount] = useState('25000');

  const totalInvestedDynamic = funds.reduce((acc, f) => acc + f.heldAmount, 0);

  const filteredFunds = funds.filter(f => {
    if (activeTab === 'HOLDINGS') return f.heldAmount > 0;
    if (activeTab === 'SIP') return (f.sipMonthly || 0) > 0;
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  });

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investModalFund) return;
    const amt = Math.max(500, parseFloat(investAmount) || 0);
    setFunds(prev =>
      prev.map(f =>
        f.id === investModalFund.id
          ? { ...f, heldAmount: f.heldAmount + amt }
          : f
      )
    );
    toast.success(`Invested ${formatINR(amt)} in ${investModalFund.name}. Units allotted T+1.`);
    setInvestModalFund(null);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemModalFund) return;
    const redeemedAmt = redeemModalFund.heldAmount;
    setFunds(prev =>
      prev.map(f =>
        f.id === redeemModalFund.id
          ? { ...f, heldAmount: 0, heldUnits: '0.00' }
          : f
      )
    );
    toast.success(`Redeemed ${formatINR(redeemedAmt)} from ${redeemModalFund.name} to Primary Savings.`);
    setRedeemModalFund(null);
  };

  const handleToggleSip = (fundId: string, nextVal: boolean) => {
    setFunds(prev => prev.map(f => (f.id === fundId ? { ...f, sipActive: nextVal } : f)));
    toast.success(nextVal ? 'SIP mandate resumed' : 'SIP mandate paused');
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Header + Cards-Style Underline Sub-Tabs */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 border-b border-gray-200">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Invest &amp; Wealth
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Direct mutual funds, asset allocation &amp; automated SIPs
          </p>

          <div className="mt-4 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'HOLDINGS' as const, label: 'My Holdings' },
              { id: 'EXPLORE' as const, label: 'Explore Funds' },
              { id: 'SIP' as const, label: 'Active SIPs' },
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 min-h-[40px] text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-[#1f1f1f]' : 'text-[#777777] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* Portfolio Value Strip */}
          <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
                <span>Invested Portfolio Valuation</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] mt-1">
                {formatINR(totalInvestedDynamic)}
              </div>
              <div className="text-xs text-[#16864A] font-semibold mt-0.5">
                Overall Returns: +18.42% unrealized gain
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center">
              <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200/70">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Equity</div>
                <div className="text-sm font-bold text-[#1f1f1f] mt-0.5">{wealth?.equityAllocation || 60}%</div>
              </div>
              <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200/70">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Debt</div>
                <div className="text-sm font-bold text-[#1f1f1f] mt-0.5">{wealth?.debtAllocation || 30}%</div>
              </div>
              <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200/70">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Gold</div>
                <div className="text-sm font-bold text-[#1f1f1f] mt-0.5">{wealth?.goldAllocation || 10}%</div>
              </div>
            </div>
          </div>

          {activeTab === 'EXPLORE' && (
            <div className="flex flex-wrap gap-2">
              {['ALL', 'LARGE_CAP', 'MID_CAP', 'HYBRID', 'DEBT', 'INTERNATIONAL'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 min-h-[32px] rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                      : 'bg-white border-gray-200 text-[#555555] hover:bg-gray-50'
                  }`}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}

          {/* Fund Hairline List */}
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredFunds.map(fund => (
              <div key={fund.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-50 text-[#DB0011] rounded text-[10px] font-bold">
                      {fund.categoryLabel}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">{fund.rating}</span>
                  </div>
                  <h2 className="text-sm font-bold text-[#1f1f1f]">{fund.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#777777]">
                    <span>NAV: <strong className="text-[#1f1f1f]">{fund.nav}</strong></span>
                    <span>•</span>
                    <span>1Y: <strong className="text-[#16864A]">{fund.oneYearReturn}</strong></span>
                    <span>•</span>
                    <span>Risk: <strong className="text-[#1f1f1f]">{fund.risk}</strong></span>
                  </div>
                </div>

                {activeTab === 'SIP' ? (
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-left md:text-right text-xs">
                      <span className="text-[10px] font-bold uppercase text-[#777777] block">Monthly SIP</span>
                      <span className="text-base font-bold text-[#1f1f1f]">{formatINR(fund.sipMonthly || 0)}</span>
                      <span className="block text-[10px] text-gray-500">{fund.sipDate}</span>
                    </div>
                    <ToggleSwitch
                      checked={!!fund.sipActive}
                      onChange={val => handleToggleSip(fund.id, val)}
                      ariaLabel={`Toggle SIP for ${fund.name}`}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
                    {fund.heldAmount > 0 && (
                      <div className="text-left md:text-right text-xs">
                        <span className="text-[10px] font-bold uppercase text-[#777777] block">Held Valuation</span>
                        <span className="text-base font-bold text-[#1f1f1f]">{formatINR(fund.heldAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvestModalFund(fund)}
                        className="min-h-[40px] px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] text-xs font-semibold cursor-pointer"
                      >
                        Invest
                      </button>
                      {fund.heldAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => setRedeemModalFund(fund)}
                          className="min-h-[40px] px-4 bg-[#F2F4F7] hover:bg-gray-200 text-[#1f1f1f] rounded-[2px] text-xs font-semibold cursor-pointer"
                        >
                          Redeem
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Advisory List Row */}
          <button
            type="button"
            onClick={() => toast.success('Advisory consultation booked with Relationship Manager Vikram Singhania')}
            className="w-full p-4 bg-[#F6F7F9] hover:bg-gray-100 rounded-xl border border-gray-200/70 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DB0011]">
                HSBC Simply Invest
              </span>
              <div className="text-sm font-bold text-[#1f1f1f] mt-0.5">
                Request Wealth Relationship Manager Call
              </div>
              <div className="text-[11px] text-[#777777]">
                Bespoke portfolio review &amp; tax harvesting guidance
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#DB0011] shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Invest Dialog */}
      <ModalDialog
        open={!!investModalFund}
        onClose={() => setInvestModalFund(null)}
        title="Invest in Mutual Fund"
        subtitle={investModalFund?.name}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleInvest} className="space-y-4 text-xs">
          <div>
            <label htmlFor="wealth-invest-amt" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">
              Investment Amount (INR ₹)
            </label>
            <input
              id="wealth-invest-amt"
              type="number"
              required
              min="500"
              value={investAmount}
              onChange={e => setInvestAmount(e.target.value)}
              className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-[2px] font-bold text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 25000, 50000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setInvestAmount(amt.toString())}
                className="min-h-[38px] rounded-[2px] bg-[#F2F4F7] hover:bg-gray-200 font-bold text-[#1f1f1f] cursor-pointer"
              >
                +₹{amt / 1000}k
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] font-semibold cursor-pointer"
          >
            Confirm Purchase ({formatINR(parseFloat(investAmount || '0'))})
          </button>
        </form>
      </ModalDialog>

      {/* Redeem Dialog */}
      <ModalDialog
        open={!!redeemModalFund}
        onClose={() => setRedeemModalFund(null)}
        title="Redeem Units"
        subtitle={redeemModalFund?.name}
        maxWidthClass="max-w-md"
      >
        {redeemModalFund && (
          <form onSubmit={handleRedeem} className="space-y-4 text-xs">
            <div className="p-4 bg-[#F6F7F9] rounded-xl space-y-1.5 border border-gray-200/70">
              <div className="flex justify-between"><span>Available Units:</span><strong>{redeemModalFund.heldUnits}</strong></div>
              <div className="flex justify-between"><span>Estimated Valuation:</span><strong className="text-[#16864A]">{formatINR(redeemModalFund.heldAmount)}</strong></div>
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] bg-[#1f1f1f] hover:bg-black text-white rounded-[2px] font-semibold cursor-pointer"
            >
              Confirm Full Redemption to Savings
            </button>
          </form>
        )}
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
