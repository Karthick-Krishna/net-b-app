import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const { customers, createCustomer } = useAdminStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [initialBalance, setInitialBalance] = useState('100000');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('Heritage Tower, Nariman Point');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const custId = 'PRM-' + Math.floor(100000 + Math.random() * 900000);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Customer Directory & Onboarding
          </h2>
          <p className="text-xs text-slate-400">
            Registered Premier digital banking customers and account portfolios
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map(c => (
          <div key={c.uid} className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">{c.displayName}</h3>
                <span className="font-mono text-xs text-red-400 font-bold">{c.customerId}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {c.kycStatus}
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{c.address}, {c.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <h3 className="text-base font-bold text-white">Onboard New Premier Customer</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="e.g. Vikram Malhotra"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="vikram@example.com"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Initial Savings Balance (INR ₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] rounded-lg font-bold"
                >
                  Create Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
