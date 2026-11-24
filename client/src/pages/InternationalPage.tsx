import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { api } from '../services/api';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const InternationalPage: React.FC = () => {
  const { accounts, formatAmount, setActiveTab, showToast } = useBanking();
  const [fxRates, setFxRates] = useState<Record<string, any>>({});
  const [calcFromAmount, setCalcFromAmount] = useState<string>('1000');
  const [calcTargetCurr, setCalcTargetCurr] = useState<string>('USD');

  useEffect(() => {
    api.getFxRates().then(res => {
      setFxRates(res.rates);
    }).catch(() => {});
  }, []);

  const foreignAccounts = accounts.filter(a => a.currency !== 'GBP' || a.account_type === 'FOREIGN_CURRENCY');

  const selectedRate = fxRates[calcTargetCurr]?.rate || 1.2845;
  const convertedAmount = (parseFloat(calcFromAmount) || 0) * selectedRate;

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">International Banking</h1>
        <p className="text-xs text-bank-muted">Global Multi-Currency Services & Live FX Rates</p>
      </div>

      {/* Zero Markup FX Guarantee Banner */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 text-white rounded-2xl p-4 border border-red-900/60 shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-red-400">
          <Sparkles size={14} />
          <span>PREMIER GLOBAL FX PRIVILEGE</span>
        </div>
        <h3 className="text-base font-extrabold text-white">0% Foreign Exchange Markup</h3>
        <p className="text-[11px] text-zinc-300 leading-relaxed">
          Hold, exchange, and transfer up to 14 global currencies at true wholesale interbank exchange rates with zero hidden retail spreads.
        </p>
      </div>

      {/* Multi-Currency Pockets / Foreign Accounts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Global Currency Pockets
          </h2>
          <button
            onClick={() => setActiveTab('accounts')}
            className="text-xs text-[#DB0011] font-semibold hover:underline"
          >
            + Add Currency
          </button>
        </div>

        {foreignAccounts.length === 0 ? (
          <div className="bg-white p-4 rounded-xl border border-bank-border text-center text-xs text-zinc-500">
            No foreign currency pockets opened yet.
          </div>
        ) : (
          foreignAccounts.map(fa => (
            <div
              key={fa.id}
              className="bg-white p-4 rounded-2xl border border-bank-border shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] font-extrabold flex items-center justify-center text-xs">
                  {fa.currency}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 leading-tight">{fa.account_name}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{fa.account_number}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-bank-text">
                  {formatAmount(fa.available_balance, fa.currency)}
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  Active Pocket
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live FX Rates Matrix */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted flex items-center gap-1.5">
            <Globe size={14} className="text-[#DB0011]" />
            <span>Live Interbank FX Rates (Base: 1 GBP)</span>
          </h2>
          <span className="text-[10px] text-zinc-400 font-mono">Live Feed</span>
        </div>

        <div className="divide-y divide-zinc-100 text-xs">
          {Object.entries(fxRates).map(([curr, data]: [string, any]) => {
            const isPositive = data.change24h >= 0;

            return (
              <div key={curr} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-zinc-100 font-bold flex items-center justify-center text-xs text-zinc-800">
                    {curr}
                  </span>
                  <div>
                    <div className="font-bold text-zinc-900">{curr} / GBP</div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Buy: {data.buy} • Sell: {data.sell}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-zinc-900 font-mono">{data.rate}</div>
                  <div
                    className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    <span>{isPositive ? '+' : ''}{data.change24h}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Converter & Wire Calculator */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Instant Currency Exchange Preview
        </h2>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-zinc-500 text-[11px] block mb-1">You Send (GBP)</label>
            <input
              type="number"
              value={calcFromAmount}
              onChange={e => setCalcFromAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 font-extrabold text-base"
            />
          </div>

          <div>
            <label className="text-zinc-500 text-[11px] block mb-1">Destination Currency</label>
            <select
              value={calcTargetCurr}
              onChange={e => setCalcTargetCurr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 font-bold bg-white"
            >
              {Object.keys(fxRates).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex items-center justify-between">
          <span className="text-zinc-600">Converted Payout:</span>
          <span className="font-black text-base text-[#DB0011]">
            {formatAmount(convertedAmount, calcTargetCurr)}
          </span>
        </div>

        <button
          onClick={() => setActiveTab('payments')}
          className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition"
        >
          Send International Wire Transfer
        </button>
      </div>

      {/* SWIFT / Routing Information Box */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-2 text-xs">
        <h3 className="font-bold text-zinc-900 text-xs">Receiving Foreign Inward Remittances</h3>
        <p className="text-zinc-600 text-[11px] leading-relaxed">
          To receive international wires from abroad into your account, share the following verified routing instructions:
        </p>
        <div className="space-y-1 font-mono text-[11px] text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
          <div><strong>SWIFT/BIC:</strong> HBUKGB41LHR</div>
          <div><strong>Bank Name:</strong> Premier International Bank UK</div>
          <div><strong>Branch Address:</strong> 8 Canada Square, Canary Wharf, London E14 5HQ</div>
          <div><strong>Settlement Format:</strong> SWIFT MT103 / ISO 20022 Direct</div>
        </div>
      </div>
    </div>
  );
};
