import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { BillPayment } from '../types';
import { api } from '../services/api';
import {
  Zap,
  Droplets,
  Flame,
  Smartphone,
  Wifi,
  CreditCard,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  FileCheck
} from 'lucide-react';

export const BillsPage: React.FC = () => {
  const { accounts, formatAmount, refreshAccounts, showReceipt, showToast } = useBanking();
  const [bills, setBills] = useState<BillPayment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ELECTRICITY');
  const [billerName, setBillerName] = useState<string>('EDF Energy UK');
  const [consumerNumber, setConsumerNumber] = useState<string>('EDF-9941-802');
  const [fetchedBill, setFetchedBill] = useState<any | null>(null);
  const [selectedSourceAcc, setSelectedSourceAcc] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const billCategories = [
    { id: 'ELECTRICITY', label: 'Electricity', icon: Zap, defaultBiller: 'EDF Energy UK' },
    { id: 'GAS', label: 'Gas', icon: Flame, defaultBiller: 'British Gas Residential' },
    { id: 'WATER', label: 'Water', icon: Droplets, defaultBiller: 'Thames Water UK' },
    { id: 'MOBILE', label: 'Mobile Recharge', icon: Smartphone, defaultBiller: 'EE Telecom' },
    { id: 'BROADBAND', label: 'Broadband Fibre', icon: Wifi, defaultBiller: 'Vodafone Gigafast' },
    { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard, defaultBiller: 'Premier World Elite' },
    { id: 'INSURANCE', label: 'Insurance', icon: Shield, defaultBiller: 'Aviva Premier Insurance' },
    { id: 'GOVERNMENT', label: 'Council Tax', icon: Building, defaultBiller: 'Tower Hamlets Council' },
  ];

  const loadBills = async () => {
    try {
      const res = await api.getBills();
      setBills(res.bills);
    } catch (err: any) {
      showToast(err.message || 'Failed to load bills', 'error');
    }
  };

  useEffect(() => {
    loadBills();
    if (accounts.length > 0 && !selectedSourceAcc) {
      setSelectedSourceAcc(accounts[0].id);
    }
  }, [accounts]);

  const handleFetchBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const res = await api.fetchBill({
        category: selectedCategory,
        billerName,
        consumerNumber,
      });
      setFetchedBill(res.bill);
      showToast('Bill fetched successfully from provider registry', 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not fetch bill', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  const handlePayBill = async () => {
    if (!fetchedBill) return;
    setIsPaying(true);
    try {
      const idempotencyKey = `billpay-${Date.now()}-${consumerNumber}`;
      const res = await api.payBill(
        {
          sourceAccountId: selectedSourceAcc || accounts[0].id,
          billerCategory: fetchedBill.biller_category || selectedCategory,
          billerName: fetchedBill.biller_name || billerName,
          consumerNumber: fetchedBill.consumer_number || consumerNumber,
          amount: fetchedBill.bill_amount,
        },
        idempotencyKey
      );

      showToast('Bill paid successfully!', 'success');
      setFetchedBill(null);
      await refreshAccounts();
      await loadBills();
      showReceipt(res.receipt);
    } catch (err: any) {
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Bill Payments & Utilities</h1>
        <p className="text-xs text-bank-muted">Direct Debit, Utility Payments & Instant Settlements</p>
      </div>

      {/* Bill Categories Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted mb-2.5">
          Select Utility Category
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {billCategories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setBillerName(cat.defaultBiller);
                  setFetchedBill(null);
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition group ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-bank-border text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-[#DB0011]' : 'text-zinc-600'} />
                <span className="text-[10px] font-semibold mt-1 leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biller Lookup Form */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Fetch Bill Details
        </h3>

        <form onSubmit={handleFetchBill} className="space-y-3 text-xs">
          <div>
            <label className="text-zinc-600 block mb-1 font-semibold">Service Provider</label>
            <input
              type="text"
              value={billerName}
              onChange={e => setBillerName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-zinc-600 block mb-1 font-semibold">Consumer Reference / Account Number</label>
            <input
              type="text"
              value={consumerNumber}
              onChange={e => setConsumerNumber(e.target.value)}
              placeholder="e.g. EDF-9941-802"
              className="w-full p-2.5 rounded-xl border border-zinc-300 font-mono font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isFetching}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs transition"
          >
            {isFetching ? 'Fetching Provider Records...' : 'Fetch Bill Details'}
          </button>
        </form>
      </div>

      {/* Fetched Bill Review & Pay Card */}
      {fetchedBill && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#DB0011] shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#DB0011] tracking-wider block">
                Verified Biller Record
              </span>
              <h4 className="text-sm font-bold text-zinc-900">{fetchedBill.biller_name}</h4>
              <p className="text-[11px] text-zinc-500 font-mono">Ref: {fetchedBill.consumer_number}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500">Amount Due</span>
              <div className="text-2xl font-black text-bank-text">
                {formatAmount(fetchedBill.bill_amount, 'GBP')}
              </div>
            </div>
          </div>

          <div className="text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Customer Name:</span>
              <span className="font-semibold text-zinc-800">{fetchedBill.consumer_name || 'Alexander Vance'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Payment Due Date:</span>
              <span className="font-bold text-zinc-900">{fetchedBill.due_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Select Debit Account:</span>
              <select
                value={selectedSourceAcc}
                onChange={e => setSelectedSourceAcc(e.target.value)}
                className="p-1 rounded border border-zinc-300 font-medium"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.account_name} ({formatAmount(a.available_balance, a.currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePayBill}
            disabled={isPaying}
            className="w-full py-3.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md transition"
          >
            {isPaying ? 'Authorizing Payment...' : `Pay ${formatAmount(fetchedBill.bill_amount, 'GBP')} Now`}
          </button>
        </div>
      )}

      {/* Saved / Upcoming Bills List */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Upcoming & Recent Bills
        </h3>

        <div className="divide-y divide-zinc-100 text-xs">
          {bills.map(b => (
            <div key={b.id} className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-zinc-900 leading-tight">{b.biller_name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  Due: {b.due_date} • {b.consumer_number}
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-xs text-zinc-900">
                  {formatAmount(b.bill_amount, 'GBP')}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                    b.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
