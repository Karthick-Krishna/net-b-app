import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Loan } from '../types';
import { api } from '../services/api';
import {
  Landmark,
  Calculator,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Home,
  Car,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';

export const LoansPage: React.FC = () => {
  const { formatAmount, showToast } = useBanking();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [eligibility, setEligibility] = useState<any | null>(null);

  // EMI Calculator State
  const [loanType, setLoanType] = useState<string>('PERSONAL');
  const [amount, setAmount] = useState<number>(20000);
  const [tenure, setTenure] = useState<number>(36);
  const [rate, setRate] = useState<number>(6.9);
  const [emiCalc, setEmiCalc] = useState<any | null>(null);

  // Application Modal
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [employmentType, setEmploymentType] = useState<string>('SALARIED');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('7500');
  const [loanPurpose, setLoanPurpose] = useState<string>('Home Improvement / Modernization');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.getLoans().then(res => setLoans(res.loans)).catch(() => {});
    api.getLoanEligibility().then(res => setEligibility(res.eligibility)).catch(() => {});
  }, []);

  // Update rates according to loan type
  useEffect(() => {
    const rates: Record<string, number> = {
      PERSONAL: 6.9,
      HOME: 3.85,
      VEHICLE: 5.4,
      EDUCATION: 4.5,
    };
    const defaultAmounts: Record<string, number> = {
      PERSONAL: 20000,
      HOME: 350000,
      VEHICLE: 40000,
      EDUCATION: 30000,
    };
    const defaultTenures: Record<string, number> = {
      PERSONAL: 36,
      HOME: 240,
      VEHICLE: 60,
      EDUCATION: 48,
    };

    setRate(rates[loanType] || 6.5);
    setAmount(defaultAmounts[loanType] || 25000);
    setTenure(defaultTenures[loanType] || 36);
  }, [loanType]);

  // Recalculate EMI
  useEffect(() => {
    api.calculateEmi({ amount, rate, tenureMonths: tenure }).then(res => {
      setEmiCalc(res.calculation);
    }).catch(() => {});
  }, [amount, rate, tenure]);

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.applyLoan({
        loanType,
        amount,
        tenureMonths: tenure,
        employmentType,
        monthlyIncome: parseFloat(monthlyIncome),
        purpose: loanPurpose,
      });

      showToast(res.message, 'success');
      setApplyModalOpen(false);
      // Reload loans
      const updated = await api.getLoans();
      setLoans(updated.loans);
    } catch (err: any) {
      showToast(err.message || 'Loan application submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Loans & Mortgages</h1>
        <p className="text-xs text-bank-muted">Premier Lending Products & Instant Decisioning</p>
      </div>

      {/* Pre-Approved Eligibility Banner */}
      {eligibility && (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-2xl p-4 shadow-xl space-y-2 border border-zinc-700">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Sparkles size={14} />
              <span>PRE-APPROVED PREMIER CREDIT</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
              Score: 820
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-zinc-400 block">Personal Loan Pre-Approved Up To</span>
              <div className="text-2xl font-black tracking-tight text-white">
                {formatAmount(eligibility.preApprovedPersonalLoan, 'GBP')}
              </div>
            </div>
            <button
              onClick={() => {
                setLoanType('PERSONAL');
                setApplyModalOpen(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] font-bold text-xs text-white shadow-xs transition"
            >
              Apply Instant
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 border-t border-zinc-700/60 pt-2 mt-1">
            {eligibility.documentRequirement} • Funds disbursed within 2 hours
          </p>
        </div>
      )}

      {/* Active Borrowings */}
      {loans.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Active Loans & Mortgages ({loans.length})
          </h2>

          {loans.map(ln => (
            <div key={ln.id} className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                    {ln.loan_type === 'HOME' ? <Home size={18} /> : <Landmark size={18} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900">{ln.loan_type} LOAN</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{ln.loan_number}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-zinc-900">
                    {formatAmount(ln.outstanding_balance, 'GBP')}
                  </div>
                  <span className="text-[10px] text-zinc-500">Remaining</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-2.5 rounded-xl text-xs border border-zinc-100">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Monthly Repayment (EMI)</span>
                  <span className="font-bold text-zinc-900">{formatAmount(ln.emi_amount, 'GBP')}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 text-[10px] block">Next Due Date</span>
                  <span className="font-semibold text-zinc-800">{ln.next_emi_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive EMI Calculator */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted flex items-center gap-1.5">
            <Calculator size={14} className="text-[#DB0011]" />
            <span>Interactive EMI Calculator</span>
          </h2>
        </div>

        {/* Product Selector */}
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'PERSONAL', label: 'Personal', icon: Landmark },
            { id: 'HOME', label: 'Mortgage', icon: Home },
            { id: 'VEHICLE', label: 'Vehicle', icon: Car },
            { id: 'EDUCATION', label: 'Education', icon: GraduationCap },
          ].map(p => {
            const Icon = p.icon;
            const isSelected = loanType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setLoanType(p.id)}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Icon size={14} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loan Amount Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-zinc-600">Borrowing Amount:</span>
            <span className="font-bold text-[#DB0011]">{formatAmount(amount, 'GBP')}</span>
          </div>
          <input
            type="range"
            min={loanType === 'HOME' ? 50000 : 2000}
            max={loanType === 'HOME' ? 1000000 : 75000}
            step={loanType === 'HOME' ? 10000 : 1000}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full accent-[#DB0011] cursor-pointer"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-zinc-600">Tenure:</span>
            <span className="font-bold text-zinc-900">{tenure} Months ({(tenure / 12).toFixed(1)} Yrs)</span>
          </div>
          <input
            type="range"
            min="12"
            max={loanType === 'HOME' ? 360 : 84}
            step="12"
            value={tenure}
            onChange={e => setTenure(Number(e.target.value))}
            className="w-full accent-[#DB0011] cursor-pointer"
          />
        </div>

        {/* EMI Result Card */}
        {emiCalc && (
          <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Interest Rate:</span>
              <span className="font-bold text-emerald-700">{emiCalc.annualRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Interest Payable:</span>
              <span className="font-semibold text-zinc-800">{formatAmount(emiCalc.totalInterest, 'GBP')}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-200 items-baseline">
              <span className="font-semibold text-zinc-800">Monthly EMI:</span>
              <span className="font-black text-xl text-[#DB0011]">
                {formatAmount(emiCalc.monthlyEmi, 'GBP')}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setApplyModalOpen(true)}
          className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition"
        >
          Proceed to Apply for {formatAmount(amount, 'GBP')}
        </button>
      </div>

      {/* Loan Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Apply for Premier {loanType} Loan</h3>
              <button onClick={() => setApplyModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApplyLoan} className="space-y-3 text-xs">
              <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 block text-[10px]">Requested Facility</span>
                <div className="font-bold text-sm text-zinc-900">{formatAmount(amount, 'GBP')} @ {rate}% p.a.</div>
                <div className="text-[11px] text-zinc-500">Tenure: {tenure} Months • Estimated Monthly EMI: {formatAmount(emiCalc?.monthlyEmi, 'GBP')}</div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Employment Status</label>
                <select
                  value={employmentType}
                  onChange={e => setEmploymentType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="SALARIED">Salaried Corporate Executive</option>
                  <option value="SELF_EMPLOYED">Self-Employed / Business Owner</option>
                  <option value="PROFESSIONAL">Licensed Professional (Doctor / Solicitor)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Monthly Net Income (£)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={e => setMonthlyIncome(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Facility Purpose</label>
                <input
                  type="text"
                  value={loanPurpose}
                  onChange={e => setLoanPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-800">
                <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                <span>KYC Tier 3 Identity already verified. Zero documents required.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs shadow-md transition"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
