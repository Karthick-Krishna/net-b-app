import React from 'react';
import { ChartNoAxesCombined, TrendingUp, PieChart, ShieldCheck, DollarSign } from 'lucide-react';
import { formatINR } from '@shared/utils/formatters';

export const WealthAdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Wealth & Asset Management Supervision
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Supervise customer mutual fund holdings, asset allocation thresholds, and offshore advisory records
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Total Wealth AUM</span>
          <div className="text-2xl font-black text-[#252525] mt-1">{formatINR(4560000)}</div>
          <span className="text-[11px] text-[#16864A] font-bold">+18.42% Total Portfolio Return</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Equity Allocation</span>
          <div className="text-2xl font-black text-[#252525] mt-1">65.0%</div>
          <span className="text-[11px] text-gray-500">Large & Mid Cap Dominant</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Dedicated Relationship Manager</span>
          <div className="text-base font-bold text-[#252525] mt-1">Vikram Singhania</div>
          <span className="text-[11px] text-gray-500">VP, Private Banking & Wealth</span>
        </div>
      </div>

      {/* Holdings Overview Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E8E8E8] font-bold text-xs text-[#252525] uppercase tracking-wider">
          Managed Mutual Fund Portfolios
        </div>
        <div className="divide-y divide-[#E8E8E8] text-xs">
          {[
            { fund: 'HSBC Large Cap Equity Fund — Direct Growth', aum: 1850000, cat: 'Large Cap', returns: '+19.4%' },
            { fund: 'HSBC Midcap Opportunities Fund — Direct Growth', aum: 1420000, cat: 'Mid Cap', returns: '+26.2%' },
            { fund: 'HSBC Balanced Advantage Dynamic Fund', aum: 890000, cat: 'Hybrid', returns: '+14.1%' },
            { fund: 'HSBC Corporate Bond Liquid Fund', aum: 400000, cat: 'Debt AAA', returns: '+7.8%' },
          ].map((h, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/70">
              <div>
                <div className="font-bold text-[#252525]">{h.fund}</div>
                <div className="text-[11px] text-[#777777] mt-0.5">{h.cat} • 1Y CAGR: <span className="text-[#16864A] font-bold">{h.returns}</span></div>
              </div>
              <div className="text-right">
                <div className="font-black font-mono text-sm text-[#252525]">{formatINR(h.aum)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
