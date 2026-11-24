import React, { useState } from 'react';
import { PiggyBank, Calculator, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const DepositsPage: React.FC = () => {
  const { deposits, formatCurrency } = useBanking();
  const [calcPrincipal, setCalcPrincipal] = useState(500000);
  const [calcTenure, setCalcTenure] = useState(24);
  const [rate] = useState(7.8);

  const interestEarned = Math.round((calcPrincipal * rate * (calcTenure / 12)) / 100);
  const totalMaturity = calcPrincipal + interestEarned;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
          Fixed & Recurring Deposits
        </h2>
        <p className="text-xs text-gray-500">
          High-yield term deposits with premier sovereign compounding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Deposits */}
        <div className="lg:col-span-2 space-y-4">
          {deposits.map(dep => (
            <div key={dep.depositId} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {dep.depositType === 'FIXED' ? 'High Yield Fixed Deposit' : 'Smart Recurring Deposit'}
                    </h3>
                    <div className="text-[11px] text-gray-400 font-mono">{dep.depositNumber}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {dep.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-gray-500 block">Principal</span>
                  <span className="font-bold text-gray-900">{formatCurrency(dep.principalAmount, 'INR')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Interest Rate</span>
                  <span className="font-bold text-emerald-600">{dep.interestRate}% p.a.</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Tenure</span>
                  <span className="font-bold text-gray-900">{dep.tenureMonths} Months</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Maturity Date</span>
                  <span className="font-bold text-gray-900">{dep.maturityDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit Calculator */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#DB0011]" />
            <h3 className="text-sm font-bold text-gray-900">Term Deposit Calculator</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-600 font-semibold block mb-1">
                Deposit Amount: ₹ {calcPrincipal.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={calcPrincipal}
                onChange={e => setCalcPrincipal(Number(e.target.value))}
                className="w-full accent-[#DB0011]"
              />
            </div>

            <div>
              <label className="text-gray-600 font-semibold block mb-1">
                Tenure: {calcTenure} Months
              </label>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={calcTenure}
                onChange={e => setCalcTenure(Number(e.target.value))}
                className="w-full accent-[#DB0011]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 bg-gray-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Interest Rate</span>
              <span className="font-bold text-emerald-600">{rate}% p.a.</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Est. Total Interest</span>
              <span className="font-bold text-gray-900">₹ {interestEarned.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200 font-bold">
              <span>Maturity Value</span>
              <span className="text-[#DB0011]">₹ {totalMaturity.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
