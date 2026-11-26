import React, { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import { InsuranceRecord } from '@shared/types';
import toast from 'react-hot-toast';

export const InsurancePage: React.FC = () => {
  const { insurance, formatCurrency } = useBanking();
  const [selectedPolicy, setSelectedPolicy] = useState<InsuranceRecord | null>(null);

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Insurance &amp; Protection
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Premier health, wealth, and family protection plans
          </p>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {insurance.map(policy => (
            <div key={policy.policyId} className="p-4 sm:p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white text-[#DB0011] border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <Shield className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#1f1f1f] truncate">{policy.providerName}</h2>
                    <div className="text-[11px] text-[#777777] font-mono">{policy.policyNumber}</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200 shrink-0">
                  {policy.policyStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/70 text-xs">
                <div>
                  <span className="text-[#777777] block">Sum Insured</span>
                  <span className="font-bold text-[#1f1f1f]">{formatCurrency(policy.coverageAmount, 'INR')}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Annual Premium</span>
                  <span className="font-bold text-[#1f1f1f]">{formatCurrency(policy.annualPremium, 'INR')}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Type</span>
                  <span className="font-bold text-[#1f1f1f]">{policy.policyType}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Renewal Due</span>
                  <span className="font-bold text-[#1f1f1f]">{policy.dueDate}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPolicy(policy)}
                className="w-full min-h-[42px] bg-white hover:bg-gray-50 active:scale-[0.98] border border-gray-300 text-[#1f1f1f] text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Policy Certificate &amp; Claims</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ModalDialog
        open={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
        title={selectedPolicy?.providerName || 'Policy Details'}
        subtitle={selectedPolicy?.policyNumber}
        maxWidthClass="max-w-sm"
      >
        {selectedPolicy && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F6F7F9] rounded-2xl space-y-2 border border-gray-200/70">
              <div className="flex justify-between"><span>Sum Insured:</span><strong>{formatCurrency(selectedPolicy.coverageAmount, 'INR')}</strong></div>
              <div className="flex justify-between"><span>Annual Premium:</span><strong>{formatCurrency(selectedPolicy.annualPremium, 'INR')}</strong></div>
              <div className="flex justify-between"><span>Next Due Date:</span><strong>{selectedPolicy.dueDate}</strong></div>
            </div>
            <button
              type="button"
              onClick={() => {
                toast.success(`Policy schedule downloaded for ${selectedPolicy.policyNumber}`);
                setSelectedPolicy(null);
              }}
              className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white font-semibold rounded-full transition-all cursor-pointer shadow-xs"
            >
              Download Policy Document
            </button>
          </div>
        )}
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
