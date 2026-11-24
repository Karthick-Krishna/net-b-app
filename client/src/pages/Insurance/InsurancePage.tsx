import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';

export const InsurancePage: React.FC = () => {
  const { insurance, formatCurrency } = useBanking();

  return (
    <AnimatedPageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
          Protection & Life Insurance
        </h2>
        <p className="text-xs text-[#777777]">
          Premier health, wealth, and family protection plans underwritten by authorized insurance partners
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insurance.map(policy => (
          <div key={policy.policyId} className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#DB0011] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{policy.providerName}</h3>
                  <div className="text-[11px] text-gray-400 font-mono">{policy.policyNumber}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                {policy.policyStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 block">Sum Insured</span>
                <span className="font-bold text-gray-900">{formatCurrency(policy.coverageAmount, 'INR')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Annual Premium</span>
                <span className="font-bold text-gray-900">{formatCurrency(policy.annualPremium, 'INR')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Policy Type</span>
                <span className="font-bold text-gray-900">{policy.policyType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Next Renewal Due</span>
                <span className="font-bold text-gray-900">{policy.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedPageTransition>
  );
};
