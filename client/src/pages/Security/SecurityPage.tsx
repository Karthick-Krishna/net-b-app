import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle, Fingerprint, Smartphone, Laptop, History, Shield, LogOut } from 'lucide-react';
import { useAppLock } from '../../context/AppLockContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { appLockEnabled, enableAppLock, disableAppLock, lockApp } = useAppLock();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast.error('PIN must be exactly 6 numeric digits');
      return;
    }
    if (newPin !== confirmPin) {
      toast.error('PIN entries do not match');
      return;
    }

    enableAppLock(newPin);
    toast.success('App-Lock 6-digit PIN successfully updated!');
    setNewPin('');
    setConfirmPin('');
  };

  const handleEmergencyLock = () => {
    if (window.confirm('Are you sure you want to trigger emergency lockdown? This will immediately lock this session and require your 6-digit PIN to re-enter.')) {
      lockApp();
      toast.success('Emergency app lockdown engaged');
    }
  };

  return (
    <AnimatedPageTransition className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Security & App-Lock Controls
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Manage 6-digit keypad security, device authentication, and session protection
        </p>
      </div>

      {/* App Lock Status Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#DB0011] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#252525]">
                App-Lock Keypad Shield
              </h3>
              <p className="text-xs text-[#777777] mt-0.5">
                Mandatory 6-digit PIN entry required on launch and after 3 minutes of background inactivity
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 self-start sm:self-auto rounded-full text-xs font-bold ${
              appLockEnabled
                ? 'bg-emerald-50 text-[#16864A] border border-emerald-200'
                : 'bg-gray-100 text-[#777777]'
            }`}
          >
            {appLockEnabled ? 'Active & Enforced' : 'Disabled'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {appLockEnabled ? (
            <>
              <button
                type="button"
                onClick={lockApp}
                className="py-2.5 px-4 bg-[#252525] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Lock App Screen Now
              </button>
              <button
                type="button"
                onClick={disableAppLock}
                className="py-2.5 px-4 bg-red-50 text-[#DB0011] rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-200"
              >
                Disable App-Lock PIN
              </button>
            </>
          ) : (
            <div className="text-xs text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex-1">
              App-Lock is currently disabled. Configure a 6-digit PIN below to activate instant lock-screen protection.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Set / Update PIN Form */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8E8E8]">
            <KeyRound className="w-4 h-4 text-[#DB0011]" />
            <h3 className="text-sm font-bold text-[#252525]">
              {appLockEnabled ? 'Change 6-Digit PIN' : 'Set Up 6-Digit App-Lock PIN'}
            </h3>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                New 6-Digit PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-sm font-mono tracking-widest text-[#252525] focus:outline-none focus:border-[#DB0011]"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                Confirm 6-Digit PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-sm font-mono tracking-widest text-[#252525] focus:outline-none focus:border-[#DB0011]"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Security PIN
            </button>
          </form>
        </div>

        {/* Biometrics & Fast Auth */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8E8E8]">
            <Fingerprint className="w-4 h-4 text-[#DB0011]" />
            <h3 className="text-sm font-bold text-[#252525]">
              Biometric & Quick Access
            </h3>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-[#E8E8E8]">
            <div>
              <div className="text-xs font-bold text-[#252525]">Touch ID / Face ID Login</div>
              <div className="text-[11px] text-[#777777] mt-0.5">Use biometric authentication for faster secure unlock</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBiometricEnabled(!biometricEnabled);
                toast.success(biometricEnabled ? 'Biometrics disabled' : 'Biometrics enabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${biometricEnabled ? 'bg-[#DB0011]' : 'bg-gray-300'}`}
            >
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${biometricEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#16864A] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#16864A]">
              <span className="font-bold block">Two-Factor Authentication (2FA)</span>
              SMS OTP & HSBC India Secure Key token active for all outbound transactions above ₹10,000.
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleEmergencyLock}
              className="w-full py-2.5 bg-red-50 text-[#DB0011] hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Session Lockdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#DB0011]" />
            <h3 className="text-sm font-bold text-[#252525]">
              Active Devices & Logged-in Sessions
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#16864A] bg-emerald-50 px-2 py-0.5 rounded">
            2 Devices Connected
          </span>
        </div>

        <div className="divide-y divide-[#E8E8E8] text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-[#777777]" />
              <div>
                <div className="font-bold text-[#252525] flex items-center gap-2">
                  <span>Apple MacBook Pro — macOS Safari</span>
                  <span className="text-[10px] bg-red-100 text-[#DB0011] font-bold px-1.5 py-0.2 rounded">This Session</span>
                </div>
                <div className="text-[11px] text-[#777777]">IP: 103.21.144.12 • Mumbai, India • Active right now</div>
              </div>
            </div>
            <span className="text-[#16864A] font-bold text-[11px]">Active</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-[#777777]" />
              <div>
                <div className="font-bold text-[#252525]">Apple iPhone 15 Pro — HSBC India Mobile App</div>
                <div className="text-[11px] text-[#777777]">IP: 49.36.128.9 • Mumbai, India • Last active 2 hours ago</div>
              </div>
            </div>
            <button
              onClick={() => toast.success('Revoked session token for iPhone 15 Pro')}
              className="text-[#DB0011] hover:underline font-bold text-[11px]"
            >
              Revoke Access
            </button>
          </div>
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
