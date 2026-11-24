import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Beneficiary } from '../types';
import { api } from '../services/api';
import {
  UserPlus,
  Star,
  Search,
  Trash2,
  ShieldCheck,
  Building2,
  X,
  Lock
} from 'lucide-react';

export const BeneficiariesPage: React.FC = () => {
  const { formatAmount, showToast, setActiveTab } = useBanking();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // New beneficiary form fields
  const [name, setName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [bankName, setBankName] = useState<string>('Barclays Bank UK');
  const [ifscSwift, setIfscSwift] = useState<string>('BARCGB22XXX');
  const [transferLimit, setTransferLimit] = useState<string>('25000');
  const [otp, setOtp] = useState<string>('123456');

  const loadBeneficiaries = async () => {
    try {
      const res = await api.getBeneficiaries();
      setBeneficiaries(res.beneficiaries);
    } catch (err: any) {
      showToast(err.message || 'Failed to load beneficiaries', 'error');
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleBeneficiaryFavorite(id);
      loadBeneficiaries();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this beneficiary?')) return;
    try {
      await api.deleteBeneficiary(id);
      showToast('Beneficiary deleted', 'success');
      loadBeneficiaries();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addBeneficiary({
        name,
        nickname,
        accountNumber,
        bankName,
        ifscSwift,
        transferLimit: parseFloat(transferLimit),
        otp
      });
      showToast('New beneficiary added and activated!', 'success');
      setAddModalOpen(false);
      // Reset form
      setName('');
      setNickname('');
      setAccountNumber('');
      loadBeneficiaries();
    } catch (err: any) {
      showToast(err.message || 'Failed to add beneficiary', 'error');
    }
  };

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.nickname && b.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.account_number.includes(searchTerm)
  );

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-bank-text">Beneficiaries</h1>
          <p className="text-xs text-bank-muted">Manage Trusted Payees & Limits</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold shadow-xs transition"
        >
          <UserPlus size={14} />
          <span>Add Payee</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search payees by name, nickname or account..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-bank-border bg-white text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
        />
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-3">
        {filtered.map(ben => (
          <div
            key={ben.id}
            onClick={() => setActiveTab('payments')}
            className="bg-white p-4 rounded-xl border border-bank-border shadow-card hover:border-zinc-300 transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] font-bold flex items-center justify-center text-xs shrink-0">
                {ben.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-zinc-900">{ben.name}</h3>
                  {ben.nickname && (
                    <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                      {ben.nickname}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {ben.bank_name} • {ben.account_number}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Daily Limit: {formatAmount(ben.transfer_limit, 'GBP')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={e => handleToggleFavorite(ben.id, e)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-amber-500 transition"
              >
                <Star size={16} fill={ben.is_favorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={e => handleDelete(ben.id, e)}
                className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-zinc-400 hover:text-red-600 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Beneficiary Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Add New Beneficiary</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Charlotte Vance"
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="e.g. Sister, Landlord"
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Account Number / IBAN</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="400515-XXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Sort Code / SWIFT</label>
                  <input
                    type="text"
                    value={ifscSwift}
                    onChange={e => setIfscSwift(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Daily Limit (£)</label>
                <input
                  type="number"
                  value={transferLimit}
                  onChange={e => setTransferLimit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <label className="text-zinc-600 font-semibold block mb-1 flex items-center gap-1">
                  <Lock size={12} className="text-[#DB0011]" />
                  <span>Security Authorization OTP (Sandbox: 123456)</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full p-2 text-center font-mono font-bold tracking-widest text-sm rounded-lg border border-zinc-300 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs shadow-md transition"
              >
                Authenticate & Add Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
