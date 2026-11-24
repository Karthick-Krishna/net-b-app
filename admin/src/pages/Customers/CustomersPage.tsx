import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Search, Building2, X } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const { customers, accounts, createCustomer } = useAdminStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [initialBalance, setInitialBalance] = useState('100000');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('Fort Heritage Tower, Fort');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const custId = 'HSBC-' + Math.floor(100000 + Math.random() * 900000);
    const res = await createCustomer({
      displayName,
      email,
      phone,
      role: 'customer',
      customerId: custId,
      accountStatus: 'active',
      kycStatus: 'VERIFIED',
      address,
      city,
      country: 'India',
      initialBalance: parseFloat(initialBalance) || 50000,
    });

    if (res.success) {
      toast.success(`Customer ${displayName} onboarded with ID ${custId}`);
      setShowAddModal(false);
      setDisplayName('');
      setEmail('');
    }
  };

  const filtered = customers.filter(
    c =>
      c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Customer Registry & Onboarding
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Registered HSBC India Premier clients, account status, and KYC verification records
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Premier Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name, Customer ID (e.g. HSBC-882941), or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#252525] placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(c => {
          const userAccounts = accounts.filter(a => a.ownerUid === c.uid);
          const totalBal = userAccounts.reduce((acc, a) => acc + (a.managedBalance || 0), 0);

          return (
            <div
              key={c.uid}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs space-y-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#DB0011] font-black flex items-center justify-center text-sm border border-red-100">
                    {c.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#252525]">{c.displayName}</h3>
                    <span className="font-mono text-xs text-[#DB0011] font-bold">{c.customerId}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>KYC {c.kycStatus}</span>
                </span>
              </div>

              <div className="text-xs text-[#555555] space-y-1.5 pt-3 border-t border-[#E8E8E8]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.address}, {c.city}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-[#E8E8E8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#777777] block">Active Accounts</span>
                  <span className="font-bold text-[#252525]">{userAccounts.length} Portfolios</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-[#777777] block">Combined Balance</span>
                  <span className="font-black text-sm text-[#252525]">{formatINR(totalBal)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-black text-[#252525]">Onboard New Premier Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Birla"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-[#252525] focus:outline-none focus:border-[#DB0011]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-[#252525] focus:outline-none focus:border-[#DB0011]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-[#252525] focus:outline-none focus:border-[#DB0011]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Initial Savings Balance (INR)</label>
                <input
                  type="number"
                  required
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-[#252525] font-black focus:outline-none focus:border-[#DB0011]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-[#252525]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Branch</label>
                  <div className="p-2.5 bg-gray-100 rounded-xl font-bold text-[#252525]">
                    Mumbai Main, Fort
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
