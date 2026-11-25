import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, Fingerprint, Smartphone, Laptop, ShieldCheck, Copy } from 'lucide-react';
import { useAppLock } from '../../context/AppLockContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import toast from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { appLockEnabled, enableAppLock, disableAppLock, lockApp, resetAppLockToDefault, biometricsEnabled, setBiometricsEnabled } = useAppLock();
  const { requestAction } = useActionFeedback();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otcCode, setOtcCode] = useState('482 915');
  const [otcTimer, setOtcTimer] = useState(30);

  useEffect(() => {
    const id = setInterval(() => {
      setOtcTimer(prev => {
        if (prev <= 1) {
          const r1 = Math.floor(100 + Math.random() * 900);
          const r2 = Math.floor(100 + Math.random() * 900);
          setOtcCode(`${r1} ${r2}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleResetAppLock = () => {
    requestAction({
      title: 'Reset App Lock?',
      message: 'This will reset your App-Lock 6-digit PIN back to the default PIN (002831), clear any failed PIN attempt counters, and re-enable App Lock.',
      confirmLabel: 'Yes, Reset App Lock',
      tone: 'danger',
      onConfirm: () => {
        resetAppLockToDefault();
        return {
          title: 'App Lock Reset Complete',
          message: 'App-Lock security has been reset. Default 6-digit PIN (002831) is active and failed attempts are cleared.',
          icon: 'key',
          relatedButtons: [
            { label: 'Lock App Now', variant: 'secondary', onClick: () => lockApp() },
          ],
        };
      },
    });
  };

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

    const pinToSave = newPin;
    requestAction({
      title: 'Update App-Lock PIN?',
      message: 'Confirm changing your 6-digit App-Lock PIN for future banking launches?',
      confirmLabel: 'Yes, Save PIN',
      onConfirm: () => {
        enableAppLock(pinToSave);
        setNewPin('');
        setConfirmPin('');
        return {
          title: 'App-Lock PIN Updated',
          message: 'Your new 6-digit App-Lock PIN has been activated.',
          icon: 'key',
          relatedButtons: [
            { label: 'Lock Screen Now', variant: 'secondary', onClick: () => lockApp() },
          ],
        };
      },
    });
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
                    onClick={() =>
                      requestAction({
                        title: 'Disable App-Lock Shield?',
                        message: 'Disabling App-Lock removes the 6-digit PIN requirement on app launch.',
                        confirmLabel: 'Yes, Disable',
                        tone: 'danger',
                        onConfirm: () => {
                          disableAppLock();
                          return {
                            title: 'App-Lock Disabled',
                            message: '6-digit PIN lock has been turned off for this device.',
                            icon: 'unlock',
                          };
                        },
                      })
                    }
                    className="min-h-[42px] px-4 bg-white border border-[#333333] text-[#1f1f1f] hover:bg-gray-50 rounded-[2px] text-xs font-semibold cursor-pointer"
                  >
                    Disable App-Lock
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleResetAppLock}
                className="min-h-[42px] px-4 bg-white border border-[#DB0011] text-[#DB0011] hover:bg-red-50 rounded-[2px] text-xs font-semibold cursor-pointer"
              >
                Reset App Lock
              </button>
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
                onClick={() =>
                  requestAction({
                    title: 'Confirm Emergency Lockdown?',
                    message: 'This will immediately lock your active banking session and require your 6-digit PIN to re-enter.',
                    confirmLabel: 'Yes, Lock Immediately',
                    tone: 'danger',
                    onConfirm: () => {
                      lockApp();
                      return {
                        title: 'Emergency Lockdown Engaged',
                        message: 'Session locked securely.',
                        icon: 'shield',
                      };
                    },
                  })
                }
                className="w-full min-h-[44px] bg-white hover:bg-red-50 text-[#DB0011] border border-[#DB0011] rounded-[2px] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Emergency Session Lockdown</span>
              </button>
            </div>
          </div>

          {/* Digital Secure Key (In-App OTC Token) */}
          <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#DB0011] border border-gray-200/70 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1f1f1f]">Digital Secure Key (OTC)</h2>
                <p className="text-xs text-[#777777]">Single-use security code for high-value authorization ({otcTimer}s)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-gray-200">
              <span className="font-mono text-lg font-extrabold tracking-widest text-[#1f1f1f]">{otcCode}</span>
              <button
                type="button"
                aria-label="Copy security code"
                onClick={() => {
                  navigator.clipboard?.writeText(otcCode.replace(/\s+/g, ''));
                  toast.success('Digital Secure Key copied');
                }}
                className="text-gray-500 hover:text-[#DB0011] cursor-pointer"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
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
    </AnimatedPageTransition>
  );
};
