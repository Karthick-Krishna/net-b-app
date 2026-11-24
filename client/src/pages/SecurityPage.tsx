import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { api } from '../services/api';
import {
  ShieldAlert,
  KeyRound,
  Fingerprint,
  Smartphone,
  AlertOctagon,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useBanking();
  const [sessions, setSessions] = useState<any[]>([]);
  const [biometricActive, setBiometricActive] = useState<boolean>(!!user?.biometric_enabled);

  // Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Freeze Modal
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

  const loadSessions = async () => {
    try {
      const res = await api.getSessions();
      setSessions(res.sessions);
    } catch (err: any) {
      showToast(err.message || 'Failed to load active sessions', 'error');
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleToggleBiometric = async () => {
    const next = !biometricActive;
    try {
      await api.toggleBiometric(next);
      setBiometricActive(next);
      showToast(`Biometric authentication ${next ? 'enabled' : 'disabled'}`, 'success');
      refreshUser();
    } catch (err: any) {
      showToast(err.message || 'Failed to update biometric settings', 'error');
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await api.revokeSession(id);
      showToast('Device session revoked', 'success');
      loadSessions();
    } catch (err: any) {
      showToast(err.message || 'Revoke failed', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      await api.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Password update failed', 'error');
    }
  };

  const handleEmergencyFreeze = async () => {
    try {
      const res = await api.emergencyFreeze();
      showToast(res.message, 'success');
      setEmergencyModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to freeze accounts', 'error');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Security Centre</h1>
        <p className="text-xs text-bank-muted">Authentication Controls & Threat Prevention</p>
      </div>

      {/* Security Health Score Card */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Security Grade: Optimal</span>
            <h2 className="text-sm font-bold text-zinc-900 leading-tight">Advanced Threat Shield Active</h2>
            <p className="text-[11px] text-zinc-500">2-Factor Authentication & Biometrics Enforced</p>
          </div>
        </div>
      </div>

      {/* Authentication Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
          Authentication Settings
        </h3>

        <div className="divide-y divide-zinc-100 text-xs">
          {/* Biometrics Toggle */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Fingerprint size={18} className="text-[#DB0011]" />
              <div>
                <span className="font-bold text-zinc-900 block">Biometric Authentication</span>
                <span className="text-[11px] text-zinc-500">Log in with Face ID or Touch ID</span>
              </div>
            </div>

            <button
              onClick={handleToggleBiometric}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                biometricActive ? 'bg-[#DB0011]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  biometricActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Change Password */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <KeyRound size={18} className="text-zinc-700" />
              <div>
                <span className="font-bold text-zinc-900 block">Online Banking Password</span>
                <span className="text-[11px] text-zinc-500">Last changed 45 days ago</span>
              </div>
            </div>

            <button
              onClick={() => setPasswordModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 font-semibold text-xs text-zinc-800 transition"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Active Devices & Sessions ({sessions.length})
          </h3>
        </div>

        <div className="divide-y divide-zinc-100 text-xs">
          {sessions.map(s => (
            <div key={s.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone size={16} className="text-zinc-600" />
                <div>
                  <div className="font-bold text-zinc-900 leading-tight">{s.device_name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    IP: {s.ip_address} • {new Date(s.created_at).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRevokeSession(s.id)}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Lockdown Action */}
      <div className="bg-red-50/70 rounded-2xl p-4 border border-red-200 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-red-700 font-bold">
          <AlertOctagon size={16} />
          <span>Emergency Security Lockdown</span>
        </div>
        <p className="text-zinc-700 text-[11px] leading-relaxed">
          If your device is compromised or you suspect unauthorized account access, initiate an immediate security lockdown. All cards will be frozen and debit capabilities suspended.
        </p>
        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs shadow-xs transition"
        >
          Initiate Emergency Lockdown
        </button>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Change Password</h3>
              <button onClick={() => setPasswordModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Lockdown Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#DB0011] flex items-center justify-center mx-auto">
              <AlertOctagon size={26} />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Confirm Security Lockdown?</h3>
            <p className="text-xs text-zinc-500">
              This will instantly freeze all credit & debit cards and suspend money transfers until identity verification with support.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyFreeze}
                className="flex-1 py-2 rounded-xl bg-[#DB0011] text-white text-xs font-bold hover:bg-[#B0000D]"
              >
                Yes, Freeze Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
