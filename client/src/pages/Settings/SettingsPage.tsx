import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { useAppLock } from '../../context/AppLockContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import {
  LockKeyhole,
  KeyRound,
  RotateCcw,
  Fingerprint,
  Smartphone,
  LogOut,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { hideBalances, toggleBalanceVisibility, addSecurityNotification } = useBanking();
  const {
    appLockEnabled,
    enableAppLock,
    disableAppLock,
    changeMpin,
    resetMpin,
    resetAppLockToDefault,
    autoLockTimeout,
    setAutoLockTimeout,
    biometricsEnabled,
    setBiometricsEnabled,
    lockApp,
  } = useAppLock();
  const { requestAction } = useActionFeedback();

  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'privacy' | 'preferences' | 'account' | 'support'>('security');

  // MPIN states
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  // Modals
  const [showResetMpinModal, setShowResetMpinModal] = useState(false);
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showChequeRequestModal, setShowChequeRequestModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  const [notifications, setNotifications] = useState({
    transactions: true,
    accountAlerts: true,
    cardActivity: true,
    securityNotice: true,
    promotions: false,
    pushEnabled: true,
    emailEnabled: true,
  });

  const [maskAccountNumbers, setMaskAccountNumbers] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (IN)');
  const [currencyDisplay, setCurrencyDisplay] = useState('INR (₹)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  const isWeakPin = (p: string) => ['123456', '654321', '000000', '111111', '222222', '333333', '999999', '121212'].includes(p);

  const handleChangeMpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast.error('New MPIN must be exactly 6 digits');
      return;
    }
    if (isWeakPin(newPin)) {
      toast.error('Weak MPIN. Sequential or repeated digits are not allowed.');
      return;
    }
    if (newPin !== confirmPin) {
      toast.error('New MPIN confirmation does not match');
      return;
    }
    if (appLockEnabled) {
      const res = changeMpin(currentPin, newPin);
      if (!res.success) {
        toast.error(res.message || 'Current MPIN is incorrect');
        return;
      }
    } else {
      enableAppLock(newPin);
    }
    toast.success('6-digit MPIN updated successfully.');
    addSecurityNotification(
      '6-Digit MPIN Updated',
      'Your application security MPIN was changed from Settings.',
      'SECURITY'
    );
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleExecuteResetMpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPin.length !== 6 || !/^\d+$/.test(resetNewPin)) {
      toast.error('New MPIN must be exactly 6 digits');
      return;
    }
    if (isWeakPin(resetNewPin)) {
      toast.error('Please choose a non-sequential 6-digit PIN.');
      return;
    }
    if (resetNewPin !== resetConfirmPin) {
      toast.error('PIN entries do not match');
      return;
    }
    resetMpin(resetNewPin);
    toast.success('Application MPIN reset completed.');
    addSecurityNotification(
      'Application MPIN Reset',
      'Your 6-digit application MPIN was reset and enforced.',
      'SECURITY'
    );
    setShowResetMpinModal(false);
    setResetNewPin('');
    setResetConfirmPin('');
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Header + Cards-UI Underline Navigation Tabs */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 border-b border-gray-200">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Settings &amp; Profile
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            MPIN security, notification alerts, privacy &amp; KYC profile
          </p>

          <div className="mt-4 flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar">
            {[
              { id: 'security' as const, label: 'Security' },
              { id: 'notifications' as const, label: 'Alerts' },
              { id: 'privacy' as const, label: 'Privacy' },
              { id: 'preferences' as const, label: 'Regional' },
              { id: 'account' as const, label: 'Profile & KYC' },
              { id: 'support' as const, label: 'Help' },
            ].map(tab => {
              const active = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`relative pb-3 min-h-[40px] text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-[#1f1f1f]' : 'text-[#777777] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6">
          {/* SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#F6F7F9] rounded-xl border border-gray-200/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-[#DB0011] border border-gray-200/70 flex items-center justify-center shrink-0">
                      <LockKeyhole className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1f1f1f]">6-Digit Application MPIN Shield</h2>
                      <p className="text-xs text-[#777777]">Secures launch &amp; sensitive actions</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold self-start sm:self-auto ${appLockEnabled ? 'bg-emerald-50 text-[#16864A] border border-emerald-200' : 'bg-gray-200 text-gray-600'}`}>
                    {appLockEnabled ? 'MPIN Enforced' : 'Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={lockApp}
                    className="min-h-[40px] px-4 bg-[#1f1f1f] hover:bg-black active:scale-[0.98] text-white rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Lock App Now
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      requestAction({
                        title: 'Reset App Lock?',
                        message: 'Restore default 6-digit App-Lock PIN (002831) and clear all lockout counters?',
                        confirmLabel: 'Yes, Reset App Lock',
                        tone: 'danger',
                        onConfirm: () => {
                          resetAppLockToDefault();
                          return {
                            title: 'App Lock Reset Complete',
                            message: 'App-Lock has been reset to default PIN (002831).',
                            icon: 'key',
                            relatedButtons: [
                              { label: 'Lock App Now', variant: 'secondary', onClick: () => lockApp() },
                              { label: 'Set Custom PIN', variant: 'primary', onClick: () => setShowResetMpinModal(true) },
                            ],
                          };
                        },
                      })
                    }
                    className="min-h-[40px] px-4 bg-white border border-[#DB0011] text-[#DB0011] hover:bg-red-50 active:scale-[0.98] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
                    <span>Reset App Lock (Default)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetMpinModal(true)}
                    className="min-h-[40px] px-4 bg-white border border-gray-300 text-[#1f1f1f] hover:bg-gray-50 active:scale-[0.98] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#1f1f1f]" aria-hidden="true" />
                    <span>Custom MPIN</span>
                  </button>
                  {appLockEnabled && (
                    <button
                      type="button"
                      onClick={disableAppLock}
                      className="min-h-[40px] px-4 bg-white border border-[#DB0011] text-[#DB0011] hover:bg-red-50 active:scale-[0.98] rounded-full text-xs font-semibold transition-all cursor-pointer"
                    >
                      Disable MPIN
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200/70">
                    <KeyRound className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-[#1f1f1f]">Change 6-Digit MPIN</h2>
                  </div>

                  <form onSubmit={handleChangeMpin} className="space-y-3 text-xs">
                    {appLockEnabled && (
                      <div>
                        <label htmlFor="set-cur-pin" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Current MPIN</label>
                        <input
                          id="set-cur-pin"
                          type={showPinInput ? 'text' : 'password'}
                          maxLength={6}
                          required
                          value={currentPin}
                          onChange={e => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-mono tracking-widest"
                          placeholder="••••••"
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="set-new-pin" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New MPIN</label>
                      <input
                        id="set-new-pin"
                        type={showPinInput ? 'text' : 'password'}
                        maxLength={6}
                        required
                        value={newPin}
                        onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-mono tracking-widest"
                        placeholder="••••••"
                      />
                    </div>
                    <div>
                      <label htmlFor="set-conf-pin" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Confirm MPIN</label>
                      <input
                        id="set-conf-pin"
                        type={showPinInput ? 'text' : 'password'}
                        maxLength={6}
                        required
                        value={confirmPin}
                        onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl font-mono tracking-widest"
                        placeholder="••••••"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPinInput(!showPinInput)}
                        className="text-[11px] text-[#555555] hover:text-[#1f1f1f] font-semibold cursor-pointer min-h-[32px]"
                      >
                        {showPinInput ? 'Hide PIN' : 'Show PIN'}
                      </button>
                      <button
                        type="submit"
                        className="min-h-[40px] px-5 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs"
                      >
                        Save MPIN
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200/70">
                    <Smartphone className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-[#1f1f1f]">Auto-Lock &amp; Biometrics</h2>
                  </div>

                  <div>
                    <span className="font-bold text-[#777777] uppercase text-[10px] block mb-2">Inactivity Timeout</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 3, 5].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setAutoLockTimeout(t);
                            toast.success(`Auto-lock set to ${t} min${t > 1 ? 's' : ''}`);
                          }}
                          className={`min-h-[40px] rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            autoLockTimeout === t ? 'bg-[#DB0011] text-white border-[#DB0011] shadow-xs' : 'bg-white text-[#1f1f1f] border-gray-200'
                          }`}
                        >
                          {t} Min{t > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-200/70">
                    <div className="flex items-center gap-2.5">
                      <Fingerprint className="w-5 h-5 text-[#DB0011]" aria-hidden="true" />
                      <div>
                        <div className="text-xs font-bold text-[#1f1f1f]">Biometric Fast Unlock</div>
                        <div className="text-[10px] text-[#777777]">Face ID / Touch ID</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={biometricsEnabled}
                      onChange={val => {
                        setBiometricsEnabled(val);
                        toast.success(val ? 'Biometrics enabled' : 'Biometrics disabled');
                      }}
                      ariaLabel="Biometric Fast Unlock"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full min-h-[42px] bg-white hover:bg-gray-50 active:scale-[0.98] border border-gray-300 text-[#1f1f1f] rounded-full text-xs font-semibold transition-all cursor-pointer"
                  >
                    Change Login Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="divide-y divide-gray-100 text-xs">
              {[
                { key: 'transactions' as const, label: 'Transaction SMS & Push Alerts', desc: 'Instant alerts on all debit & credit movements' },
                { key: 'accountAlerts' as const, label: 'Account Balance Notices', desc: 'Monthly e-Statement & minimum balance alerts' },
                { key: 'cardActivity' as const, label: 'Card Fraud & Usage Alerts', desc: 'Real-time alert for online and overseas spend' },
                { key: 'securityNotice' as const, label: 'Security & App-Lock Alerts', desc: 'Alerts when MPIN is changed or device logs in' },
                { key: 'promotions' as const, label: 'Premier Offers & Insights', desc: 'Curated wealth insights & reward multipliers' },
              ].map(item => (
                <div key={item.key} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1f1f1f]">{item.label}</div>
                    <div className="text-[11px] text-[#777777] mt-0.5">{item.desc}</div>
                  </div>
                  <ToggleSwitch
                    checked={notifications[item.key]}
                    onChange={val => {
                      setNotifications(prev => ({ ...prev, [item.key]: val }));
                      toast.success('Notification preference saved');
                    }}
                    ariaLabel={item.label}
                  />
                </div>
              ))}
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <div className="divide-y divide-gray-100 text-xs">
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1f1f1f]">Hide Sensitive Balances</div>
                    <div className="text-[11px] text-[#777777]">Replaces currency amounts with ••••••</div>
                  </div>
                  <ToggleSwitch
                    checked={hideBalances}
                    onChange={() => toggleBalanceVisibility()}
                    ariaLabel="Hide Sensitive Balances"
                  />
                </div>
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1f1f1f]">Mask Account &amp; Card Numbers</div>
                    <div className="text-[11px] text-[#777777]">Display only trailing 4 digits across screens</div>
                  </div>
                  <ToggleSwitch
                    checked={maskAccountNumbers}
                    onChange={val => {
                      setMaskAccountNumbers(val);
                      toast.success('Masking setting saved');
                    }}
                    ariaLabel="Mask Account and Card Numbers"
                  />
                </div>
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1f1f1f]">Privacy Screen Shield</div>
                    <div className="text-[11px] text-[#777777]">Blurs preview in multitasking switcher</div>
                  </div>
                  <ToggleSwitch
                    checked={privacyMode}
                    onChange={val => {
                      setPrivacyMode(val);
                      toast.success('Privacy screen shield updated');
                    }}
                    ariaLabel="Privacy Screen Shield"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-[#DB0011] hover:underline font-semibold cursor-pointer min-h-[32px]"
                >
                  HSBC India Privacy Notice →
                </button>
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-[#DB0011] hover:underline font-semibold cursor-pointer min-h-[32px]"
                >
                  Terms &amp; Conditions →
                </button>
              </div>
            </div>
          )}

          {/* PREFERENCES */}
          {activeSection === 'preferences' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label htmlFor="pref-lang" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Language</label>
                <select
                  id="pref-lang"
                  value={selectedLanguage}
                  onChange={e => {
                    setSelectedLanguage(e.target.value);
                    toast.success(`Language set to ${e.target.value}`);
                  }}
                  className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="English (IN)">English (India)</option>
                  <option value="Hindi (हिन्दी)">हिन्दी (Hindi)</option>
                  <option value="English (UK)">English (UK)</option>
                </select>
              </div>
              <div>
                <label htmlFor="pref-curr" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Currency Display</label>
                <select
                  id="pref-curr"
                  value={currencyDisplay}
                  onChange={e => {
                    setCurrencyDisplay(e.target.value);
                    toast.success(`Currency set to ${e.target.value}`);
                  }}
                  className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="INR (₹)">INR — Indian Rupee (₹)</option>
                  <option value="USD ($)">USD — US Dollar ($)</option>
                  <option value="GBP (£)">GBP — British Pound (£)</option>
                </select>
              </div>
              <div>
                <label htmlFor="pref-date" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Date Format</label>
                <select
                  id="pref-date"
                  value={dateFormat}
                  onChange={e => {
                    setDateFormat(e.target.value);
                    toast.success(`Date format set to ${e.target.value}`);
                  }}
                  className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>
            </div>
          )}

          {/* PROFILE & KYC */}
          {activeSection === 'account' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-[#1f1f1f]">Personal Profile &amp; KYC</h2>
                  <p className="text-xs text-[#777777]">Verified with Central KYC Registry</p>
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Full KYC Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70 text-xs">
                <div>
                  <span className="text-[#777777] block">Full Legal Name</span>
                  <span className="font-bold text-[#1f1f1f]">{currentUser?.displayName}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Customer Relationship ID</span>
                  <span className="font-mono font-bold text-[#1f1f1f]">{currentUser?.customerId}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Primary Email</span>
                  <span className="font-bold text-[#1f1f1f]">{currentUser?.email}</span>
                </div>
                <div>
                  <span className="text-[#777777] block">Registered Mobile</span>
                  <span className="font-bold text-[#1f1f1f]">{currentUser?.phone}</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowChequeRequestModal(true)}
                  className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#1f1f1f]">Request New Cheque Book</div>
                    <div className="text-[11px] text-[#777777]">25 or 50 personalized leaves</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#DB0011]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Address update request opened with Relationship Manager')}
                  className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#1f1f1f]">Update Registered Address</div>
                    <div className="text-[11px] text-[#777777]">Via Aadhaar DigiLocker verification</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#DB0011]" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* HELP & ABOUT */}
          {activeSection === 'support' && (
            <div className="space-y-5 text-xs">
              <div className="space-y-2.5">
                {[
                  { q: 'How do I reset my 6-digit MPIN?', a: 'Tap Reset MPIN in Security settings, or use Forgot your PIN? on the lock screen.' },
                  { q: 'How do I freeze my debit or credit card?', a: 'Navigate to Cards and tap the Freeze card circular action button.' },
                  { q: 'Are deposits insured?', a: 'Eligible customer deposits up to ₹5,00,000 are insured by DICGC.' },
                ].map((faq, i) => (
                  <div key={i} className="p-4 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
                    <div className="font-bold text-[#1f1f1f]">{faq.q}</div>
                    <div className="text-[#555555] mt-1">{faq.a}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(true)}
                  className="min-h-[42px] px-5 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Raise Formal Grievance
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="min-h-[42px] px-5 bg-white border border-gray-300 text-[#1f1f1f] hover:bg-gray-50 active:scale-[0.98] rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Log Off</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalDialog open={showResetMpinModal} onClose={() => setShowResetMpinModal(false)} title="Reset 6-Digit MPIN" maxWidthClass="max-w-sm">
        <form onSubmit={handleExecuteResetMpin} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="rst-new" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New 6-Digit MPIN</label>
            <input id="rst-new" type="password" maxLength={6} required value={resetNewPin} onChange={e => setResetNewPin(e.target.value.replace(/\D/g, ''))} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono text-center text-base tracking-widest" placeholder="••••••" />
          </div>
          <div>
            <label htmlFor="rst-conf" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Confirm MPIN</label>
            <input id="rst-conf" type="password" maxLength={6} required value={resetConfirmPin} onChange={e => setResetConfirmPin(e.target.value.replace(/\D/g, ''))} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-mono text-center text-base tracking-widest" placeholder="••••••" />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">
            Authorize New MPIN
          </button>
        </form>
      </ModalDialog>

      <ModalDialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Login Password" maxWidthClass="max-w-sm">
        <form onSubmit={e => { e.preventDefault(); toast.success('Password updated'); setShowPasswordModal(false); }} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="pwd-cur" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Current Password</label>
            <input id="pwd-cur" type="password" required value={currPassword} onChange={e => setCurrPassword(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label htmlFor="pwd-new" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New Password</label>
            <input id="pwd-new" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">Update Password</button>
        </form>
      </ModalDialog>

      <ModalDialog open={showChequeRequestModal} onClose={() => setShowChequeRequestModal(false)} title="Request New Cheque Book" maxWidthClass="max-w-sm">
        <div className="space-y-3.5 text-xs">
          <p className="text-[#555555]">Account: <strong>HSBC Premier Savings (•••• 4101)</strong></p>
          <select aria-label="Number of cheque leaves" className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold">
            <option value="25">25 Leaves (Personalized)</option>
            <option value="50">50 Leaves (Personalized)</option>
          </select>
          <button type="button" onClick={() => { toast.success('Cheque book dispatch request logged.'); setShowChequeRequestModal(false); }} className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">
            Confirm Order
          </button>
        </div>
      </ModalDialog>

      <ModalDialog open={showComplaintModal} onClose={() => setShowComplaintModal(false)} title="Raise Formal Grievance" maxWidthClass="max-w-md">
        <form onSubmit={e => { e.preventDefault(); toast.success('Grievance lodged: HSBC/GRV/' + Date.now().toString().slice(-5)); setShowComplaintModal(false); setComplaintText(''); }} className="space-y-3.5 text-xs">
          <textarea rows={4} required value={complaintText} onChange={e => setComplaintText(e.target.value)} className="w-full p-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" placeholder="Describe your grievance..." />
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">Submit Grievance</button>
        </form>
      </ModalDialog>

      <ModalDialog open={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} title="HSBC India Privacy Notice" maxWidthClass="max-w-md">
        <div className="text-xs text-[#555555] space-y-2.5 leading-relaxed">
          <p>The Hongkong and Shanghai Banking Corporation Limited, India protects personal data under the DPDP Act, 2023 and RBI directives.</p>
          <p>All data in transit is encrypted using TLS 1.3 with 256-bit security.</p>
        </div>
      </ModalDialog>

      <ModalDialog open={showTerms} onClose={() => setShowTerms(false)} title="Terms & Conditions" maxWidthClass="max-w-md">
        <div className="text-xs text-[#555555] space-y-2.5 leading-relaxed">
          <p>Maintain confidentiality of your 6-digit MPIN and Security Key credentials at all times.</p>
          <p>All electronic transfers are governed by Reserve Bank of India settlement rules.</p>
        </div>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
