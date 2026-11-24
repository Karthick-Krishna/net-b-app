import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Globe,
  Edit2,
  X
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { setActiveTab, showToast } = useBanking();
  const [profile, setProfile] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  // Edit fields
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const loadProfile = async () => {
    try {
      const res = await api.getProfile();
      setProfile(res.profile);
      setPhone(res.profile.phone || '');
      setEmail(res.profile.email || '');
      setAddress(res.profile.address || '');
      setCity(res.profile.city || '');
    } catch (err: any) {
      showToast(err.message || 'Failed to load profile', 'error');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({ phone, email, address, city });
      showToast('Personal information updated successfully', 'success');
      setEditModalOpen(false);
      loadProfile();
      refreshUser();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Personal Profile</h1>
        <p className="text-xs text-bank-muted">Customer Identity & Account Verification</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-bank-border shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#DB0011] shadow-xs">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#DB0011] text-white flex items-center justify-center font-bold text-lg">
                {profile?.full_name?.slice(0, 2).toUpperCase() || 'AV'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-bank-text leading-tight">{profile?.full_name}</h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Customer ID: {profile?.customer_id}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-flex border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>Tier 3 Premier Verified</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setEditModalOpen(true)}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition"
          title="Edit Contact Info"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* Personal Contact Details */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Registered Contact & Address
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 py-1">
            <Phone size={15} className="text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-400 text-[10px] block">Mobile Phone</span>
              <span className="font-semibold text-zinc-800">{profile?.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1 border-t border-zinc-100">
            <Mail size={15} className="text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-400 text-[10px] block">Email Address</span>
              <span className="font-semibold text-zinc-800">{profile?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1 border-t border-zinc-100">
            <MapPin size={15} className="text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-400 text-[10px] block">Residential Address</span>
              <span className="font-semibold text-zinc-800">
                {profile?.address}, {profile?.city}, {profile?.country} ({profile?.postal_code})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1 border-t border-zinc-100">
            <Calendar size={15} className="text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-400 text-[10px] block">Date of Birth</span>
              <span className="font-semibold text-zinc-800">{profile?.dob || '14 June 1988'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="bg-white rounded-2xl border border-bank-border shadow-card divide-y divide-zinc-100 text-xs overflow-hidden">
        <div
          onClick={() => setActiveTab('security')}
          className="p-3.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-2.5">
            <Lock size={16} className="text-[#DB0011]" />
            <span className="font-bold text-zinc-900">Security Centre & Devices</span>
          </div>
          <ChevronRight size={16} className="text-zinc-400" />
        </div>

        <div
          onClick={() => setActiveTab('payments')}
          className="p-3.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-2.5">
            <Globe size={16} className="text-zinc-700" />
            <span className="font-bold text-zinc-900">Manage Beneficiaries</span>
          </div>
          <ChevronRight size={16} className="text-zinc-400" />
        </div>

        <div
          onClick={() => setActiveTab('support')}
          className="p-3.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={16} className="text-zinc-700" />
            <span className="font-bold text-zinc-900">24/7 Premier Concierge Support</span>
          </div>
          <ChevronRight size={16} className="text-zinc-400" />
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-[#DB0011] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
      >
        <LogOut size={16} />
        <span>Secure Log Out</span>
      </button>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Update Contact Information</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Save Contact Updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
