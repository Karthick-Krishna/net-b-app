import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Deposit } from '../types';
import { api } from '../services/api';
import {
  PiggyBank,
  TrendingUp,
  Clock,
  PlusCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  X
} from 'lucide-react';

export const DepositsPage: React.FC = () => {
  const { formatAmount, accounts, refreshAccounts, showToast, showReceipt } = useBanking();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [depositType, setDepositType] = useState<'FIXED' | 'RECURRING'>('FIXED');

  // Calculator inputs
  const [calcAmount, setCalcAmount] = useState<number>(5000);
  const [calcTenure, setCalcTenure] = useState<number>(24);
  const [calculation, setCalculation] = useState<any | null>(null);

  // Open Deposit Modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedSourceAcc, setSelectedSourceAcc] = useState<string>('');
  const [withdrawalSimulation, setWithdrawalSimulation] = useState<any | null>(null);

  const loadDeposits = async () => {
    try {
      const res = await api.getDeposits();
      setDeposits(res.deposits);
    } catch (err: any) {
      showToast(err.message || 'Failed to load deposits', 'error');
    }
  };

  useEffect(() => {
    loadDeposits();
    if (accounts.length > 0 && !selectedSourceAcc) {
      setSelectedSourceAcc(accounts[0].id);
    }
  }, [accounts]);

  // Dynamic Calculation
  useEffect(() => {
    api.calculateDeposit({
      type: depositType,
      amount: calcAmount,
      tenureMonths: calcTenure,
    }).then(res => {
      setCalculation(res.calculation);
    }).catch(() => {});
  }, [depositType, calcAmount, calcTenure]);

  const handleCreateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createDeposit({
        sourceAccountId: selectedSourceAcc || accounts[0].id,
        type: depositType,
        amount: calcAmount,
        tenureMonths: calcTenure,
      });

      showToast(res.message, 'success');
      setOpenModal(false);
      await refreshAccounts();
      await loadDeposits();
      if (res.receipt) showReceipt(res.receipt);
    } catch (err: any) {
      showToast(err.message || 'Deposit creation failed', 'error');
    }
  };

  const handleSimulateWithdrawal = async (depId: string) => {
    try {
      const res = await api.simulateDepositWithdrawal(depId);
      setWithdrawalSimulation(res.simulation);
    } catch (err: any) {
      showToast(err.message || 'Simulation failed', 'error');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title & Open Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-bank-text">Savings & Deposits</h1>
          <p className="text-xs text-bank-muted">Fixed & Systematic Wealth Accumulation</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle size={14} />
          <span>Open Deposit</span>
        </button>
      </div>

      {/* Active Deposits Portfolio */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Active Deposits Portfolio ({deposits.length})
        </h2>

        {deposits.map(dep => (
          <div
            key={dep.id}
            className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 leading-tight">
                    {dep.deposit_type === 'FIXED' ? 'High Yield Fixed Deposit' : 'Recurring Deposit'}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{dep.deposit_number}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-bank-text">
                  {formatAmount(dep.principal_amount, 'GBP')}
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  {dep.interest_rate}% p.a.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-2.5 rounded-xl text-[11px] border border-zinc-100">
              <div>
                <span className="text-zinc-500 block text-[10px]">Expected Payout at Maturity</span>
                <span className="font-bold text-zinc-900">{formatAmount(dep.expected_maturity_amount, 'GBP')}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block text-[10px]">Maturity Date</span>
                <span className="font-semibold text-zinc-800">{dep.maturity_date}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-[11px] text-zinc-500 font-medium">Tenure: {dep.tenure_months} Months</span>
              <button
                onClick={() => handleSimulateWithdrawal(dep.id)}
                className="text-[11px] text-[#DB0011] hover:underline font-semibold"
              >
                Simulate Premature Exit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Deposit Calculator */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#DB0011]" />
            <span>Interactive Deposit Calculator</span>
          </h2>

          <div className="flex rounded-lg bg-zinc-100 p-0.5 text-xs">
            <button
              onClick={() => setDepositType('FIXED')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${
                depositType === 'FIXED' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              Fixed Deposit
            </button>
            <button
              onClick={() => setDepositType('RECURRING')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${
                depositType === 'RECURRING' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              Recurring
            </button>
          </div>
        </div>

        {/* Principal Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-zinc-600">Deposit Amount:</span>
            <span className="font-bold text-[#DB0011]">{formatAmount(calcAmount, 'GBP')}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={calcAmount}
            onChange={e => setCalcAmount(Number(e.target.value))}
            className="w-full accent-[#DB0011] cursor-pointer"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-zinc-600">Tenure:</span>
            <span className="font-bold text-zinc-900">{calcTenure} Months</span>
          </div>
          <input
            type="range"
            min="3"
            max="60"
            step="3"
            value={calcTenure}
            onChange={e => setCalcTenure(Number(e.target.value))}
            className="w-full accent-[#DB0011] cursor-pointer"
          />
        </div>

        {/* Dynamic Result Box */}
        {calculation && (
          <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Applicable Interest Rate:</span>
              <span className="font-bold text-emerald-700">{calculation.annualInterestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Interest Earned:</span>
              <span className="font-bold text-zinc-900">{formatAmount(calculation.interestEarned, 'GBP')}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-200">
              <span className="font-semibold text-zinc-800">Total Maturity Value:</span>
              <span className="font-black text-sm text-[#DB0011]">
                {formatAmount(calculation.expectedMaturityAmount, 'GBP')}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpenModal(true)}
          className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition"
        >
          Book Deposit for {formatAmount(calcAmount, 'GBP')}
        </button>
      </div>

      {/* Premature Withdrawal Simulation Modal */}
      {withdrawalSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Premature Withdrawal</span>
              </h3>
              <button onClick={() => setWithdrawalSimulation(null)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {withdrawalSimulation.message}
            </p>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Original Principal:</span>
                <span className="font-semibold">£{withdrawalSimulation.originalPrincipal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Contracted Rate:</span>
                <span className="font-semibold">{withdrawalSimulation.contractedRate}%</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Penalty Rate:</span>
                <span>-{withdrawalSimulation.penaltyPercentage}%</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-zinc-200">
                <span>Net Estimated Payout:</span>
                <span className="text-emerald-700">£{withdrawalSimulation.estimatedNetPayout}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Premature withdrawal request submitted for processing', 'success');
                setWithdrawalSimulation(null);
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs"
            >
              Confirm Closure & Return Funds
            </button>
          </div>
        </div>
      )}

      {/* Open Deposit Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Open Term Deposit</h3>
              <button onClick={() => setOpenModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDeposit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Debit From Source Account</label>
                <select
                  value={selectedSourceAcc}
                  onChange={e => setSelectedSourceAcc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({formatAmount(acc.available_balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Deposit Type</label>
                <select
                  value={depositType}
                  onChange={e => setDepositType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="FIXED">Fixed Deposit (Quarterly Compounding)</option>
                  <option value="RECURRING">Recurring Deposit (Monthly Systematic)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Principal Amount (£)</label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={e => setCalcAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Tenure (Months)</label>
                <select
                  value={calcTenure}
                  onChange={e => setCalcTenure(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-medium"
                >
                  <option value="6">6 Months (4.25% p.a.)</option>
                  <option value="12">12 Months (4.85% p.a.)</option>
                  <option value="24">24 Months (5.25% p.a.)</option>
                  <option value="36">36 Months (5.50% p.a.)</option>
                  <option value="60">60 Months (5.50% p.a.)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
