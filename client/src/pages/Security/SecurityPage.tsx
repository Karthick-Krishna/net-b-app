import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, Fingerprint, Smartphone, Laptop, ShieldCheck, Copy, ScanFace } from 'lucide-react';
import { useAppLock } from '../../context/AppLockContext';
import { useBanking } from '../../context/BankingContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { ModalDialog } from '../../components/common/ModalDialog';
import toast from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { appLockEnabled, enableAppLock, disableAppLock, lockApp, resetAppLockToDefault, biometricsEnabled, setBiometricsEnabled, verifyPin } = useAppLock();
  const { addSecurityNotification } = useBanking();
  const { requestAction, showSuccess } = useActionFeedback();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otcCode, setOtcCode] = useState('482 915');
  const [otcTimer, setOtcTimer] = useState(30);
  const [showFaceIdSetupModal, setShowFaceIdSetupModal] = useState(false);
  const [faceIdPinInput, setFaceIdPinInput] = useState('');
  const [s24Revoked, setS24Revoked] = useState(() => localStorage.getItem('hsbc_s24_revoked') === 'true');

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

        {/* 4 CIRCULAR ACTION BUTTONS (MATCHES REFERENCE DESIGN) */}
        <div className="px-4 sm:px-6 md:px-8 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto sm:max-w-xl">
            <button
              type="button"
              onClick={lockApp}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full bg-[#F5F6F8] group-hover:bg-[#EBECEF] active:scale-[0.96] transition-all flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6 text-[#DB0011] stroke-[1.8]" aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Lock app<br />now
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('sec-new-pin');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full bg-[#F5F6F8] group-hover:bg-[#EBECEF] active:scale-[0.96] transition-all flex items-center justify-center shadow-xs">
                <KeyRound className="w-6 h-6 text-[#1f1f1f] stroke-[1.8]" aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Change<br />MPIN
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (biometricsEnabled) {
                  setBiometricsEnabled(false);
                  toast.success('Face ID disabled');
                } else {
                  setFaceIdPinInput('');
                  setShowFaceIdSetupModal(true);
                }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full transition-all flex items-center justify-center shadow-xs active:scale-[0.96] ${biometricsEnabled ? 'bg-red-50 ring-2 ring-[#DB0011]' : 'bg-[#F5F6F8] group-hover:bg-[#EBECEF]'
                }`}>
                <Fingerprint className={`w-6 h-6 stroke-[1.8] ${biometricsEnabled ? 'text-[#DB0011]' : 'text-[#1f1f1f]'}`} aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Biometric<br />unlock
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetAppLock}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-full bg-[#F5F6F8] group-hover:bg-[#EBECEF] active:scale-[0.96] transition-all flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#DB0011] stroke-[1.8]" aria-hidden="true" />
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] text-[#1f1f1f] font-medium leading-tight mt-2 text-center">
                Reset app<br />lock
              </span>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* App Lock Status Banner */}
          <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#DB0011] border border-gray-200/70 flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1f1f1f]">App-Lock Keypad Shield</h2>
                  <p className="text-xs text-[#777777]">6-digit PIN required on launch and background resume</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 self-start sm:self-auto rounded-full text-[11px] font-bold ${appLockEnabled ? 'bg-emerald-50 text-[#16864A] border border-emerald-200' : 'bg-gray-200 text-gray-600'
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
                    className="min-h-[42px] px-6 bg-[#1f1f1f] hover:bg-black active:scale-[0.98] text-white rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs"
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
                    className="min-h-[42px] px-5 bg-white border border-gray-300 text-[#1f1f1f] hover:bg-gray-50 active:scale-[0.98] rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Disable App-Lock
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleResetAppLock}
                className="min-h-[42px] px-5 bg-white border border-[#DB0011] text-[#DB0011] hover:bg-red-50 active:scale-[0.98] rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Reset App Lock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update PIN */}
            <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
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
                    className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-mono tracking-widest"
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
                    className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-mono tracking-widest"
                    placeholder="••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Save Security PIN
                </button>
              </form>
            </div>

            {/* Biometrics & Emergency Lockdown */}
            <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/70">
                <Fingerprint className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#1f1f1f]">Biometrics &amp; Protection</h2>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-gray-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1f1f1f]">Face ID / Touch ID</div>
                  <div className="text-[11px] text-[#777777]">
                    {biometricsEnabled ? 'Enrolled & active for unlock' : 'Not set up — tap to enroll'}
                  </div>
                </div>
                <ToggleSwitch
                  checked={biometricsEnabled}
                  onChange={val => {
                    if (val) {
                      setFaceIdPinInput('');
                      setShowFaceIdSetupModal(true);
                    } else {
                      setBiometricsEnabled(false);
                      toast.success('Face ID disabled');
                    }
                  }}
                  ariaLabel="Toggle Face ID or Touch ID"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5 text-xs text-[#16864A]">
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
                className="w-full min-h-[44px] bg-white hover:bg-red-50 active:scale-[0.98] text-[#DB0011] border border-[#DB0011] rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Emergency Session Lockdown</span>
              </button>
            </div>
          </div>

          {/* Digital Secure Key (In-App OTC Token) */}
          <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#DB0011] border border-gray-200/70 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1f1f1f]">Digital Secure Key (OTC)</h2>
                <p className="text-xs text-[#777777]">Single-use security code for high-value authorization ({otcTimer}s)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-xs">
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
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <h2 className="text-sm font-bold text-[#1f1f1f]">Active Devices &amp; Login Activity</h2>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5 text-[#16864A] stroke-[2]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1f1f1f]">MacBook Pro — HSBC NetBanking Web</div>
                    <div className="text-[11px] text-[#777777]">Coimbatore, Tamil Nadu • Current Device (Active now)</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shrink-0">
                    <Smartphone className={`w-5 h-5 stroke-[2] ${s24Revoked ? 'text-gray-400' : 'text-[#DB0011]'}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#1f1f1f] truncate">Samsung Galaxy S24 Ultra — Mobile App</div>
                    <div className="text-[11px] text-[#777777] truncate">
                      {s24Revoked ? 'Coimbatore, Tamil Nadu • Session revoked' : 'Coimbatore, Tamil Nadu • Active 2h ago'}
                    </div>
                  </div>
                </div>
                {s24Revoked ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200 shrink-0">
                    Revoked
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      requestAction({
                        title: 'Revoke Device Session?',
                        message: 'Sign out Samsung Galaxy S24 Ultra (Coimbatore) from your HSBC India Mobile Banking profile?',
                        confirmLabel: 'Yes, Revoke',
                        tone: 'danger',
                        onConfirm: () => {
                          setS24Revoked(true);
                          localStorage.setItem('hsbc_s24_revoked', 'true');
                          addSecurityNotification(
                            'Device Session Revoked',
                            'Access token for Samsung Galaxy S24 Ultra was permanently terminated.',
                            'SECURITY'
                          );
                          return {
                            title: 'Session Revoked',
                            message: 'Samsung Galaxy S24 Ultra has been signed out.',
                            icon: 'shield',
                          };
                        },
                      })
                    }
                    className="min-h-[32px] px-4 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#DB0011] font-semibold cursor-pointer active:scale-[0.98] transition-all shrink-0"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SET UP FACE ID MODAL */}
      <ModalDialog
        open={showFaceIdSetupModal}
        onClose={() => setShowFaceIdSetupModal(false)}
        title="Set Up Face ID"
        subtitle="Biometric Authentication Enrollment"
        maxWidthClass="max-w-sm"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const res = verifyPin(faceIdPinInput);
            if (!res.success && faceIdPinInput !== '002831') {
              toast.error(res.message || 'Incorrect 6-digit PIN');
              setFaceIdPinInput('');
              return;
            }
            setBiometricsEnabled(true);
            setShowFaceIdSetupModal(false);
            setFaceIdPinInput('');
            addSecurityNotification(
              'Face ID Enrolled',
              'Biometric Face ID logon has been enabled for your HSBC India profile.',
              'SECURITY'
            );
            showSuccess({
              title: 'Face ID Enabled',
              message: 'You can now use Face ID on the lock screen to unlock your HSBC India account.',
              icon: 'check',
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="flex items-center gap-3 p-3.5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#DB0011] flex items-center justify-center shrink-0">
              <ScanFace className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-[#444444] leading-relaxed">
              Enter your 6-digit App-Lock PIN (<strong className="text-[#1f1f1f]">002831</strong>) to enroll Face ID on this device.
            </p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            required
            value={faceIdPinInput}
            onChange={e => setFaceIdPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full h-11 px-4 text-center tracking-[0.4em] font-mono text-base font-bold bg-[#F6F7F9] border border-gray-200 rounded-xl"
          />
          <button
            type="submit"
            className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white font-semibold rounded-full transition-all cursor-pointer shadow-xs"
          >
            Enroll &amp; Enable Face ID
          </button>
        </form>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
