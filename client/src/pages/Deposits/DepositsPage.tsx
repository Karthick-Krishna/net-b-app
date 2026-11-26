import React, { useState } from 'react';
import { PiggyBank, Calculator } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const DepositsPage: React.FC = () => {
  const { accounts, deposits, formatCurrency, createDeposit } = useBanking();
  const { requestAction } = useActionFeedback();
  const [calcPrincipal, setCalcPrincipal] = useState(100000);
  const [calcTenure, setCalcTenure] = useState(24);
  const [rate] = useState(7.8);

  const interestEarned = Math.round((calcPrincipal * rate * (calcTenure / 12)) / 100);
  const totalMaturity = calcPrincipal + interestEarned;

  const handleOpenDeposit = () => {
    const primaryAcc = accounts[0];
    if (!primaryAcc) {
      toast.error('No eligible funding account found');
      return;
    }
    requestAction({
      title: 'Open Fixed Deposit?',
      message: `Create an HSBC High Yield Fixed Deposit of ${formatCurrency(calcPrincipal, 'INR')} for ${calcTenure} months at ${rate}% p.a.?`,
      confirmLabel: 'Yes, Open Deposit',
      onConfirm: async () => {
        const res = await createDeposit(primaryAcc.accountId, 'FIXED', calcPrincipal, calcTenure, rate);
        if (!res.success) {
          toast.error(res.error || 'Could not open Fixed Deposit');
          return;
        }
        return {
          title: 'Fixed Deposit Opened',
          message: `Fixed Deposit ${res.deposit?.depositNumber} opened for ${formatCurrency(calcPrincipal, 'INR')} (Maturity: ₹${totalMaturity.toLocaleString('en-IN')}).`,
          icon: 'check',
          referenceId: res.deposit?.depositNumber,
        };
      },
    });
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Fixed &amp; Recurring Deposits
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            High-yield term deposits with sovereign compounding and instant liquidity
          </p>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Deposits List */}
          <div className="lg:col-span-7 divide-y divide-gray-100">
            {deposits.map(dep => (
              <div key={dep.depositId} className="py-5 first:pt-0 space-y-3">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] text-[#DB0011] flex items-center justify-center shrink-0">
                      <PiggyBank className="w-6 h-6 stroke-[1.8]" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1f1f1f]">
                        {dep.depositType === 'FIXED' ? 'HSBC High Yield Fixed Deposit' : 'HSBC Smart Recurring Deposit'}
                      </h2>
                      <div className="text-[11px] text-[#777777] font-mono">{dep.depositNumber}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                    {dep.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[#777777] block">Principal</span>
                    <span className="font-bold text-[#1f1f1f]">{formatCurrency(dep.principalAmount, 'INR')}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block">Rate</span>
                    <span className="font-bold text-[#16864A]">{dep.interestRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block">Tenure</span>
                    <span className="font-bold text-[#1f1f1f]">{dep.tenureMonths} Mos</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block">Maturity Date</span>
                    <span className="font-bold text-[#1f1f1f]">{dep.maturityDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Calculator + Instant Open */}
          <div className="lg:col-span-5 p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4 self-start">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#DB0011]" aria-hidden="true" />
              <h2 className="text-sm font-bold text-[#1f1f1f]">Open Term Deposit</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label htmlFor="fd-principal" className="text-[#555555] font-semibold block mb-1.5">
                  Deposit Amount: <strong className="text-[#1f1f1f]">₹{calcPrincipal.toLocaleString('en-IN')}</strong>
                </label>
                <input
                  id="fd-principal"
                  type="range"
                  min="25000"
                  max="1000000"
                  step="25000"
                  value={calcPrincipal}
                  onChange={e => setCalcPrincipal(Number(e.target.value))}
                  className="w-full accent-[#DB0011] cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="fd-tenure" className="text-[#555555] font-semibold block mb-1.5">
                  Tenure: <strong className="text-[#1f1f1f]">{calcTenure} Months</strong>
                </label>
                <input
                  id="fd-tenure"
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={calcTenure}
                  onChange={e => setCalcTenure(Number(e.target.value))}
                  className="w-full accent-[#DB0011] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200/70 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777777]">Interest Rate</span>
                <span className="font-bold text-[#16864A]">{rate}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Est. Interest</span>
                <span className="font-bold text-[#1f1f1f]">₹{interestEarned.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 font-bold">
                <span>Maturity Value</span>
                <span className="text-[#DB0011]">₹{totalMaturity.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenDeposit}
              className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white text-xs font-semibold rounded-full transition-all cursor-pointer shadow-xs"
            >
              Open Instant Fixed Deposit (₹{calcPrincipal.toLocaleString('en-IN')})
            </button>
          </div>
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
