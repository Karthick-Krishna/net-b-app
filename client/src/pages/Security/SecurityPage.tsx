import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { useAppLock } from '../../context/AppLockContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { appLockEnabled, enableAppLock, disableAppLock, lockApp } = useAppLock();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
          Security & App-Lock Controls
        </h2>
        <p className="text-xs text-gray-500">
          Manage application locks, 6-digit PIN security, and active session protection
        </p>
      </div>

      {/* App Lock Status */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">App-Lock Keypad Shield</h3>
              <p className="text-xs text-gray-500">
                Requires 6-digit PIN entry on app launch and after 3 minutes of inactivity
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              appLockEnabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {appLockEnabled ? 'Active' : 'Disabled'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {appLockEnabled ? (
            <>
              <button
                type="button"
                onClick={lockApp}
                className="py-2.5 px-4 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
              >
                Lock App Screen Now
              </button>
              <button
                type="button"
                onClick={disableAppLock}
                className="py-2.5 px-4 bg-red-50 text-[#DB0011] rounded-lg text-xs font-bold hover:bg-red-100 transition-colors border border-red-200"
              >
                Disable App-Lock PIN
              </button>
            </>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              App-Lock is currently disabled. Configure a 6-digit PIN below to protect your application.
            </div>
          )}
        </div>
      </div>

      {/* Change / Set PIN Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-[#DB0011]" />
          <h3 className="text-sm font-bold text-gray-900">
            {appLockEnabled ? 'Change 6-Digit PIN' : 'Set Up 6-Digit App-Lock PIN'}
          </h3>
        </div>

        <form onSubmit={handleUpdatePin} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New 6-Digit PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono tracking-widest focus:ring-2 focus:ring-[#DB0011]"
              placeholder="••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm 6-Digit PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono tracking-widest focus:ring-2 focus:ring-[#DB0011]"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Save Security PIN
          </button>
        </form>
      </div>
    </div>
  );
};
