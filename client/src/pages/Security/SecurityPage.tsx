import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, Fingerprint, Smartphone, Laptop } from 'lucide-react';
import { useAppLock } from '../../context/AppLockContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { ModalDialog } from '../../components/common/ModalDialog';
import toast from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { appLockEnabled, enableAppLock, disableAppLock, lockApp, biometricsEnabled, setBiometricsEnabled } = useAppLock();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

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
    toast.success('App-Lock 6-digit PIN updated!');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Security &amp; App-Lock
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            6-digit MPIN protection, biometrics, and active device sessions
          </p>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* App Lock Status Banner */}
          <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white text-[#DB0011] border border-gray-200/70 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1f1f1f]">App-Lock Keypad Shield</h2>
                  <p className="text-xs text-[#777777]">6-digit PIN required on launch and background resume</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 self-start sm:self-auto rounded text-[11px] font-bold ${
                  appLockEnabled ? 'bg-emerald-50 text-[#16864A] border border-emerald-200' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {appLockEnabled ? 'Active & Enforced' : 'Disabled'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {appLockEnabled && (
                <>
                  <button
                    type="button"
                    onClick={lockApp}
                    className="min-h-[42px] px-5 bg-[#1f1f1f] hover:bg-black text-white rounded-[2px] text-xs font-semibold cursor-pointer"
                  >
                    Lock App Now
                  </button>
                  <button
                    type="button"
                    onClick={disableAppLock}
                    className="min-h-[42px] px-4 bg-white border border-[#DB0011] text-[#DB0011] hover:bg-red-50 rounded-[2px] text-xs font-semibold cursor-pointer"
                  >
                    Disable App-Lock
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update PIN */}
            <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/70">
                <KeyRound className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#1f1f1f]">
                  {appLockEnabled ? 'Change 6-Digit PIN' : 'Set 6-Digit App-Lock PIN'}
                </h2>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="sec-new-pin" className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                    New 6-Digit PIN
                  </label>
                  <input
                    id="sec-new-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-mono tracking-widest"
                    placeholder="••••••"
                  />
                </div>
                <div>
                  <label htmlFor="sec-confirm-pin" className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                    Confirm 6-Digit PIN
                  </label>
                  <input
                    id="sec-confirm-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-3 bg-white border border-gray-200 rounded-[2px] font-mono tracking-widest"
                    placeholder="••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] font-semibold cursor-pointer"
                >
                  Save Security PIN
                </button>
              </form>
            </div>

            {/* Biometrics & Emergency Lockdown */}
            <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/70">
                <Fingerprint className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#1f1f1f]">Biometrics &amp; Protection</h2>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1f1f1f]">Face ID / Touch ID</div>
                  <div className="text-[11px] text-[#777777]">Fast biometric unlock</div>
                </div>
                <ToggleSwitch
                  checked={biometricsEnabled}
                  onChange={val => {
                    setBiometricsEnabled(val);
                    toast.success(val ? 'Biometrics enabled' : 'Biometrics disabled');
                  }}
                  ariaLabel="Toggle Face ID or Touch ID"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-[#16864A]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Two-Factor Authentication (2FA) &amp; Digital Secure Key active.</span>
              </div>

              <button
                type="button"
                onClick={() => setShowEmergencyDialog(true)}
                className="w-full min-h-[44px] bg-white hover:bg-red-50 text-[#DB0011] border border-[#DB0011] rounded-[2px] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Emergency Session Lockdown</span>
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="border-t border-gray-100 pt-5 space-y-2">
            <h2 className="text-sm font-bold text-[#1f1f1f]">Active Devices &amp; Sessions</h2>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-[#777777]" aria-hidden="true" />
                  <div>
                    <div className="font-bold text-[#1f1f1f]">Web Browser Session — Current Device</div>
                    <div className="text-[11px] text-[#777777]">Mumbai, India • Active now</div>
                  </div>
                </div>
                <span className="text-[#16864A] font-bold">Active</span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#777777]" aria-hidden="true" />
                  <div>
                    <div className="font-bold text-[#1f1f1f]">iPhone 15 Pro — HSBC Mobile App</div>
                    <div className="text-[11px] text-[#777777]">Mumbai, India • 2h ago</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success('Revoked mobile session token')}
                  className="text-[#DB0011] hover:underline font-bold cursor-pointer min-h-[32px]"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Lockdown Confirmation Dialog */}
      <ModalDialog
        open={showEmergencyDialog}
        onClose={() => setShowEmergencyDialog(false)}
        title="Confirm Emergency Lockdown?"
        maxWidthClass="max-w-sm"
      >
        <p className="text-xs text-[#555555] leading-relaxed">
          This will immediately lock your active session and require your 6-digit PIN to re-enter.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowEmergencyDialog(false)}
            className="min-h-[42px] px-4 bg-[#F2F4F7] hover:bg-gray-200 text-[#1f1f1f] text-xs font-semibold rounded-[2px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setShowEmergencyDialog(false);
              lockApp();
              toast.success('Emergency session lockdown engaged');
            }}
            className="min-h-[42px] px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] cursor-pointer"
          >
            Lock Immediately
          </button>
        </div>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
