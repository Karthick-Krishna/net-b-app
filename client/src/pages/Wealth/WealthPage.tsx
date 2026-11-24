import React from 'react';
import { TrendingUp, PieChart, Sparkles, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';

export const WealthPage: React.FC = () => {
  const { wealth, formatCurrency } = useBanking();

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
            HSBC Wealth & Investments
          </h2>
          <p className="text-xs text-[#777777]">
            Institutional-grade asset management, curated mutual funds, and asset allocation
          </p>
        </div>
      </div>

      {/* Portfolio Value Banner */}
      <div className="bg-gradient-to-r from-[#121212] via-[#1E1E1E] to-[#252525] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Total Invested Portfolio</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            {formatCurrency(wealth?.totalPortfolioValue || 4560000, 'INR')}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Equity</div>
            <div className="text-sm font-extrabold text-emerald-400">{wealth?.equityAllocation}%</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Debt</div>
            <div className="text-sm font-extrabold text-blue-400">{wealth?.debtAllocation}%</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Gold</div>
            <div className="text-sm font-extrabold text-amber-400">{wealth?.goldAllocation}%</div>
          </div>
        </div>
      </div>

      {/* Mutual Funds Holdings Table */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-card">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Active Mutual Fund Holdings
          </h3>
          <span className="text-xs font-semibold text-[#DB0011]">
            4 Holdings Active
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {wealth?.mutualFunds.map((fund, i) => (
            <div key={i} className="p-5 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-gray-900">{fund.fundName}</div>
                <div className="text-xs text-gray-500 mt-0.5">{fund.category}</div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Invested</div>
                  <div className="text-xs font-semibold text-gray-700">
                    {formatCurrency(fund.investedAmount, 'INR')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Current Value</div>
                  <div className="text-xs font-bold text-gray-900">
                    {formatCurrency(fund.currentValue, 'INR')}
                  </div>
                </div>

                <div className="w-16">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                    +{fund.returnPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
