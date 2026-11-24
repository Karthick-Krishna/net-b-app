import React from 'react';
import { TrendingUp, PieChart, Sparkles, ArrowUpRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const WealthPage: React.FC = () => {
  const { wealth, formatCurrency } = useBanking();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
            Premier Wealth Management
          </h2>
          <p className="text-xs text-gray-500">
            Curated investment holdings, asset allocations, and wealth portfolios
          </p>
        </div>
      </div>

      {/* Portfolio Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] text-gray-400 uppercase">Equity</div>
            <div className="text-sm font-bold text-emerald-400">{wealth?.equityAllocation}%</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] text-gray-400 uppercase">Debt</div>
            <div className="text-sm font-bold text-blue-400">{wealth?.debtAllocation}%</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] text-gray-400 uppercase">Gold</div>
            <div className="text-sm font-bold text-amber-400">{wealth?.goldAllocation}%</div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Active Mutual Fund Holdings
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {wealth?.mutualFunds.map((fund, i) => (
            <div key={i} className="p-4 sm:p-5 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-gray-900">{fund.fundName}</div>
                <div className="text-xs text-gray-500 mt-0.5">{fund.category}</div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Invested</div>
                  <div className="text-xs font-semibold text-gray-700">
                    {formatCurrency(fund.investedAmount, 'INR')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Current Value</div>
                  <div className="text-xs font-bold text-gray-900">
                    {formatCurrency(fund.currentValue, 'INR')}
                  </div>
                </div>

                <div className="w-16">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +{fund.returnPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
