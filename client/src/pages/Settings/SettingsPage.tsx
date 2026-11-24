import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { useAppLock } from '../../context/AppLockContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { Icon } from '../../components/common/Icon';
import {
  Shield,
  LockKeyhole,
  KeyRound,
  RotateCcw,
  Fingerprint,
  Smartphone,
  Bell,
  Eye,
  EyeOff,
  Globe,
  Sliders,
  CircleUserRound,
  FileText,
  CircleHelp,
  Headset,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  X,
  Laptop,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { hideBalances, toggleBalanceVisibility } = useBanking();
  const {
    appLockEnabled,
    enableAppLock,
    disableAppLock,
    changeMpin,
    resetMpin,
    autoLockTimeout,
    setAutoLockTimeout,
    biometricsEnabled,
    setBiometricsEnabled,
    lockApp,
  } = useAppLock();

  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'privacy' | 'preferences' | 'account' | 'support'>('security');

  // MPIN Form States
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  // Reset MPIN Modal
  const [showResetMpinModal, setShowResetMpinModal] = useState(false);
  const [resetAuthPassword, setResetAuthPassword] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Notifications preferences
  const [notifications, setNotifications] = useState({
    transactions: true,
    accountAlerts: true,
    cardActivity: true,
    securityNotice: true,
    promotions: false,
    pushEnabled: true,
    emailEnabled: true,
  });

  // Privacy preferences
  const [maskAccountNumbers, setMaskAccountNumbers] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  // App preferences
  const [selectedLanguage, setSelectedLanguage] = useState('English (IN)');
  const [currencyDisplay, setCurrencyDisplay] = useState('INR (₹)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  // Modals for legal / support
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showChequeRequestModal, setShowChequeRequestModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  // Weak MPIN detection
  const isWeakPin = (p: string) => {
    const weakList = ['123456', '654321', '000000', '111111', '222222', '333333', '999999', '121212'];
    return weakList.includes(p);
  };

  const handleChangeMpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast.error('New MPIN must be exactly 6 digits');
      return;
    }
    if (isWeakPin(newPin)) {
      toast.error('Weak MPIN. Sequential or repeated digits (e.g. 123456, 111111) are not allowed.');
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

    toast.success('6-Digit Application MPIN successfully updated!');
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
      toast.error('Weak MPIN. Please choose a non-sequential 6-digit PIN.');
      return;
    }
    if (resetNewPin !== resetConfirmPin) {
      toast.error('PIN entries do not match');
      return;
    }

    resetMpin(resetNewPin);
    toast.success('Application MPIN reset successfully!');
    setShowResetMpinModal(false);
    setResetAuthPassword('');
    setResetNewPin('');
    setResetConfirmPin('');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success('Notification preference saved');
      return updated;
    });
  };

  return (
    <AnimatedPageTransition className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Application Settings & Preferences
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Configure security MPIN, notification gates, privacy safeguards, and profile details
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-[#E8E8E8] shadow-xs">
        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'security'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & MPIN</span>
        </button>

        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'notifications'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveSection('privacy')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'privacy'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <EyeOff className="w-4 h-4" />
          <span>Privacy</span>
        </button>

        <button
          onClick={() => setActiveSection('preferences')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'preferences'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Preferences</span>
        </button>

        <button
          onClick={() => setActiveSection('account')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'account'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <CircleUserRound className="w-4 h-4" />
          <span>Profile & KYC</span>
        </button>

        <button
          onClick={() => setActiveSection('support')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeSection === 'support'
              ? 'bg-[#DB0011] text-white shadow-xs'
              : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
          }`}
        >
          <Headset className="w-4 h-4" />
          <span>Help & About</span>
        </button>
      </div>

      {/* SECTION A & B: SECURITY & MPIN */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          {/* MPIN Status Banner */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center flex-shrink-0">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#252525]">
                    6-Digit Application MPIN Shield
                  </h3>
                  <p className="text-xs text-[#777777]">
                    Secures opening of the application, transfer confirmations, and sensitive transactions
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 self-start sm:self-auto rounded-full text-xs font-bold ${
                  appLockEnabled
                    ? 'bg-emerald-50 text-[#16864A] border border-emerald-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {appLockEnabled ? 'MPIN Enforced' : 'Disabled'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={lockApp}
                className="py-2.5 px-4 bg-[#252525] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Lock App Now
              </button>
              <button
                type="button"
                onClick={() => setShowResetMpinModal(true)}
                className="py-2.5 px-4 bg-gray-50 text-[#252525] hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors border border-[#E8E8E8] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#DB0011]" />
                <span>Reset MPIN</span>
              </button>
              {appLockEnabled && (
                <button
                  type="button"
                  onClick={disableAppLock}
                  className="py-2.5 px-4 bg-red-50 text-[#DB0011] hover:bg-red-100 rounded-xl text-xs font-bold transition-colors border border-red-200"
                >
                  Disable MPIN
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Change MPIN Form */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E8]">
                <KeyRound className="w-4 h-4 text-[#DB0011]" />
                <h3 className="text-sm font-bold text-[#252525]">
                  {appLockEnabled ? 'Change 6-Digit MPIN' : 'Set Up New 6-Digit MPIN'}
                </h3>
              </div>

              <form onSubmit={handleChangeMpin} className="space-y-3.5 text-xs">
                {appLockEnabled && (
                  <div>
                    <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                      Current 6-Digit MPIN
                    </label>
                    <input
                      type={showPinInput ? 'text' : 'password'}
                      maxLength={6}
                      required
                      value={currentPin}
                      onChange={e => setCurrentPin(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono tracking-widest text-[#252525]"
                      placeholder="••••••"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                    New 6-Digit MPIN
                  </label>
                  <input
                    type={showPinInput ? 'text' : 'password'}
                    maxLength={6}
                    required
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono tracking-widest text-[#252525]"
                    placeholder="••••••"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Must not be sequential (123456) or repeated (111111)
                  </span>
                </div>

                <div>
                  <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                    Confirm New MPIN
                  </label>
                  <input
                    type={showPinInput ? 'text' : 'password'}
                    maxLength={6}
                    required
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono tracking-widest text-[#252525]"
                    placeholder="••••••"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPinInput(!showPinInput)}
                    className="text-[11px] text-[#777777] hover:text-[#252525] font-semibold"
                  >
                    {showPinInput ? 'Hide PIN characters' : 'Show PIN characters'}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold transition-colors shadow-xs"
                  >
                    Save New MPIN
                  </button>
                </div>
              </form>
            </div>

            {/* Timeout & Biometric Settings */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E8]">
                <Smartphone className="w-4 h-4 text-[#DB0011]" />
                <h3 className="text-sm font-bold text-[#252525]">
                  Auto-Lock & Biometrics
                </h3>
              </div>

              {/* Inactivity Timeout selector */}
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-2">
                  Inactivity Auto-Lock Timeout
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setAutoLockTimeout(t);
                        toast.success(`Auto-lock timeout set to ${t} minute${t > 1 ? 's' : ''}`);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                        autoLockTimeout === t
                          ? 'bg-[#DB0011] text-white border-[#DB0011] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t} Min{t > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Biometrics Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-[#E8E8E8]">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-[#DB0011]" />
                  <div>
                    <div className="text-xs font-bold text-[#252525]">Biometric Fast Unlock</div>
                    <div className="text-[10px] text-gray-500">Touch ID / Face ID simulation</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBiometricsEnabled(!biometricsEnabled);
                    toast.success(biometricsEnabled ? 'Biometrics disabled' : 'Biometrics enabled');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${biometricsEnabled ? 'bg-[#DB0011]' : 'bg-gray-300'}`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${biometricsEnabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Password update shortcut */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#252525] rounded-xl text-xs font-bold transition-colors"
                >
                  Change Internet Banking Password
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Connected Devices & Sessions
            </h3>
            <div className="divide-y divide-[#E8E8E8] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-[#777777]" />
                  <div>
                    <span className="font-bold text-[#252525]">MacBook Pro — Safari 18.1</span>
                    <span className="text-[10px] bg-red-100 text-[#DB0011] font-bold px-1.5 py-0.2 rounded ml-2">Current Session</span>
                    <div className="text-[11px] text-[#777777]">Mumbai, Maharashtra • IP: 103.21.144.12</div>
                  </div>
                </div>
                <span className="text-[#16864A] font-bold">Active Now</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#777777]" />
                  <div>
                    <span className="font-bold text-[#252525]">iPhone 15 Pro — HSBC India Mobile App</span>
                    <div className="text-[11px] text-[#777777]">Mumbai, Maharashtra • Last sync 1 hour ago</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success('Session token revoked')}
                  className="text-[#DB0011] hover:underline font-bold"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#252525]">Real-Time Notification Preferences</h3>
            <p className="text-xs text-[#777777]">Choose which alerts are transmitted to your verified mobile number and email</p>
          </div>

          <div className="divide-y divide-[#E8E8E8] text-xs">
            {[
              { key: 'transactions' as const, label: 'Transaction SMS & Push Alerts', desc: 'Instant alerts on all debit, credit and transfer activity above ₹0' },
              { key: 'accountAlerts' as const, label: 'Account Balance & Statement Notices', desc: 'Monthly e-Statement ready notifications and minimum balance alerts' },
              { key: 'cardActivity' as const, label: 'Card Fraud & Usage Alerts', desc: 'Real-time notification for POS, online e-commerce and international transactions' },
              { key: 'securityNotice' as const, label: 'Security & App-Lock Alerts', desc: 'Alerts when App-Lock PIN is changed or new device logs in' },
              { key: 'promotions' as const, label: 'Premier Offers & Wealth Insights', desc: 'Curated investment reports and Premier reward point multiplier promos' },
              { key: 'pushEnabled' as const, label: 'Browser Push Notifications', desc: 'Receive high-priority alerts even when browser is minimized' },
              { key: 'emailEnabled' as const, label: 'Certified Email Dispatches', desc: 'Receive digitally signed PDF receipts for all funds transfers' },
            ].map(item => (
              <div key={item.key} className="py-3.5 flex items-center justify-between">
                <div className="pr-4">
                  <div className="font-bold text-[#252525]">{item.label}</div>
                  <div className="text-[11px] text-[#777777] mt-0.5">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    notifications[item.key] ? 'bg-[#DB0011]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                    notifications[item.key] ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: PRIVACY */}
      {activeSection === 'privacy' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#252525]">Display Privacy & Safeguards</h3>
            <p className="text-xs text-[#777777]">Manage visibility of sensitive banking balances in public or shared environments</p>
          </div>

          <div className="divide-y divide-[#E8E8E8] text-xs">
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#252525]">Hide Sensitive Account Balances by Default</div>
                <div className="text-[11px] text-[#777777]">Replaces rupees balances with •••••• until explicitly tapped</div>
              </div>
              <button
                type="button"
                onClick={toggleBalanceVisibility}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  hideBalances ? 'bg-[#DB0011]' : 'bg-gray-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  hideBalances ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#252525]">Mask Account & Card Numbers</div>
                <div className="text-[11px] text-[#777777]">Display only the trailing 4 digits across all screens and receipts</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaskAccountNumbers(!maskAccountNumbers);
                  toast.success('Account masking setting saved');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  maskAccountNumbers ? 'bg-[#DB0011]' : 'bg-gray-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  maskAccountNumbers ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#252525]">Privacy Screen Shield</div>
                <div className="text-[11px] text-[#777777]">Blurs application preview in mobile multitasking app switcher</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPrivacyMode(!privacyMode);
                  toast.success('App switcher privacy shield enabled');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  privacyMode ? 'bg-[#DB0011]' : 'bg-gray-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  privacyMode ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="pt-3 flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-[#DB0011] hover:underline font-bold"
            >
              View HSBC India Privacy Notice →
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-[#DB0011] hover:underline font-bold"
            >
              Terms & Conditions →
            </button>
          </div>
        </div>
      )}

      {/* SECTION E: PREFERENCES */}
      {activeSection === 'preferences' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#252525]">Regional & Display Preferences</h3>
            <p className="text-xs text-[#777777]">Customise numerical format, date notation, and language</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Language</label>
              <select
                value={selectedLanguage}
                onChange={e => {
                  setSelectedLanguage(e.target.value);
                  toast.success(`Language set to ${e.target.value}`);
                }}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              >
                <option value="English (IN)">English (India)</option>
                <option value="Hindi (हिन्दी)">हिन्दी (Hindi)</option>
                <option value="English (UK)">English (UK)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Currency Notation</label>
              <select
                value={currencyDisplay}
                onChange={e => {
                  setCurrencyDisplay(e.target.value);
                  toast.success(`Currency display set to ${e.target.value}`);
                }}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              >
                <option value="INR (₹)">INR — Indian Rupee (₹)</option>
                <option value="USD ($)">USD — US Dollar ($)</option>
                <option value="GBP (£)">GBP — British Pound (£)</option>
                <option value="EUR (€)">EUR — Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Date Format</label>
              <select
                value={dateFormat}
                onChange={e => {
                  setDateFormat(e.target.value);
                  toast.success(`Date format set to ${e.target.value}`);
                }}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Interface Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setThemeMode(m);
                      toast.success(`Theme set to ${m} mode`);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold capitalize transition-colors ${
                      themeMode === m
                        ? 'bg-[#DB0011] text-white border-[#DB0011]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: ACCOUNT & KYC */}
      {activeSection === 'account' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-[#252525]">Personal Account & KYC Verification</h3>
              <p className="text-xs text-[#777777]">Official KYC details verified with Reserve Bank of India compliant central registry</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#16864A] border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full KYC Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-[#E8E8E8] text-xs">
            <div>
              <span className="text-gray-500 block">Full Legal Name</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{currentUser?.displayName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Customer Relationship Number (CRN)</span>
              <span className="font-mono font-bold text-gray-900 mt-0.5 block">{currentUser?.customerId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Primary Email</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Registered Mobile</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{currentUser?.phone}</span>
            </div>
            <div>
              <span className="text-gray-500 block">PAN Number</span>
              <span className="font-mono font-bold text-gray-900 mt-0.5 block">ABCDE1234F (Verified)</span>
            </div>
            <div>
              <span className="text-gray-500 block">Home Branch</span>
              <span className="font-bold text-gray-900 mt-0.5 block">Mumbai Main Branch, Fort (002)</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 block">Permanent Communication Address</span>
              <span className="font-medium text-gray-900 mt-0.5 block">{currentUser?.address}, {currentUser?.city} - 400001</span>
            </div>
          </div>

          {/* Service Requests */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-2">Account Service Requests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowChequeRequestModal(true)}
                className="p-3.5 rounded-2xl border border-[#E8E8E8] hover:border-gray-400 text-left transition-colors"
              >
                <div className="font-bold text-xs text-[#252525]">Request New Cheque Book</div>
                <div className="text-[11px] text-[#777777] mt-0.5">25 or 50 personalized leaves dispatched to home address</div>
              </button>
              <button
                type="button"
                onClick={() => toast.success('Address update request opened with relationship manager')}
                className="p-3.5 rounded-2xl border border-[#E8E8E8] hover:border-gray-400 text-left transition-colors"
              >
                <div className="font-bold text-xs text-[#252525]">Update Registered Address</div>
                <div className="text-[11px] text-[#777777] mt-0.5">Upload Aadhaar / Passport utility proof via DigiLocker</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION G: SUPPORT & ABOUT */}
      {activeSection === 'support' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#252525]">Help Centre & Frequently Asked Questions</h3>
              <p className="text-xs text-[#777777]">Quick answers to common questions about Premier internet banking</p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { q: 'How do I reset my 6-digit MPIN if forgotten?', a: 'Click the Reset MPIN button under Security Settings, or authenticate via your Premier Relationship Manager.' },
                { q: 'What is the daily RTGS / NEFT transfer limit?', a: 'Standard daily online transfer limit is ₹10,00,000. Higher limits can be scheduled via Operations Console.' },
                { q: 'How do I temporarily freeze my debit or credit card?', a: 'Navigate to Cards, choose your card and tap Freeze Card. Unfreezing is instantaneous.' },
                { q: 'Are deposits insured by DICGC?', a: 'Yes, all eligible customer deposits up to ₹5,00,000 per depositor are insured by DICGC.' },
              ].map((faq, i) => (
                <div key={i} className="p-3.5 bg-gray-50 rounded-2xl border border-[#E8E8E8]">
                  <div className="font-bold text-[#252525]">{faq.q}</div>
                  <div className="text-[11px] text-[#555555] mt-1">{faq.a}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowComplaintModal(true)}
                className="px-4 py-2.5 bg-red-50 text-[#DB0011] rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-200"
              >
                Raise Formal Complaint / Grievance
              </button>
              <button
                type="button"
                onClick={() => toast.success('Connected to 24/7 Premier Emergency Helpline: 1800 266 3456')}
                className="px-4 py-2.5 bg-gray-100 text-[#252525] rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Emergency Helpline (1800 266 3456)
              </button>
            </div>
          </div>

          {/* About App Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="HSBC India" className="w-9 h-9 object-contain" />
              <div>
                <div className="font-black text-[#252525]">HSBC India Personal Internet Banking</div>
                <div className="text-[11px] text-[#777777]">Version 3.4.0 (Build 2026.11) • Official Mobile Banking</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#DB0011] rounded-xl font-bold transition-colors border border-red-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Securely</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset MPIN Modal */}
      {showResetMpinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2 text-[#DB0011]">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-sm font-black text-[#252525]">Reset 6-Digit MPIN</h3>
              </div>
              <button onClick={() => setShowResetMpinModal(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-[#555555]">
              Verify your authenticated session to establish a brand-new 6-digit MPIN.
            </p>

            <form onSubmit={handleExecuteResetMpin} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  New 6-Digit MPIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={resetNewPin}
                  onChange={e => setResetNewPin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono text-center text-lg tracking-widest text-[#252525]"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Confirm New MPIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={resetConfirmPin}
                  onChange={e => setResetConfirmPin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-mono text-center text-lg tracking-widest text-[#252525]"
                  placeholder="••••••"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setShowResetMpinModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold"
                >
                  Authorize New MPIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Change Login Password</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              toast.success('Internet Banking Password successfully changed');
              setShowPasswordModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={e => setCurrPassword(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">New Strong Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl"
                  placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#DB0011] text-white rounded-xl font-bold">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cheque Book Request Modal */}
      {showChequeRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Request New Cheque Book</h3>
              <button onClick={() => setShowChequeRequestModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="text-xs space-y-3">
              <p className="text-[#555555]">
                Account: <strong>HSBC Premier Savings (•••• 8829)</strong>
              </p>
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Number of Leaves</label>
                <select className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold">
                  <option value="25">25 Leaves (Personalized)</option>
                  <option value="50">50 Leaves (Personalized)</option>
                </select>
              </div>
              <p className="text-[11px] text-gray-500">
                Delivery Address: {currentUser?.address}, {currentUser?.city} (Est. 3 working days).
              </p>
              <button
                type="button"
                onClick={() => {
                  toast.success('Cheque book request dispatched to Fort Branch!');
                  setShowChequeRequestModal(false);
                }}
                className="w-full py-2.5 bg-[#DB0011] text-white rounded-xl font-bold shadow-xs"
              >
                Confirm Cheque Book Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Raise Formal Grievance</h3>
              <button onClick={() => setShowComplaintModal(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              toast.success('Grievance lodged under ticket HSBC/GRV/' + Date.now().toString().slice(-5));
              setShowComplaintModal(false);
              setComplaintText('');
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Nature of Complaint</label>
                <select className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold">
                  <option>Transaction Dispute / Delay</option>
                  <option>Card Charges / Interest Calculation</option>
                  <option>Service Quality / Staff</option>
                  <option>Digital Banking Technical Issue</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Details</label>
                <textarea
                  rows={4}
                  required
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl"
                  placeholder="Describe your grievance..."
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#DB0011] text-white rounded-xl font-bold">
                Submit Formal Grievance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">HSBC India Privacy Policy</h3>
              <button onClick={() => setShowPrivacyPolicy(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="text-xs text-[#555555] space-y-2 leading-relaxed">
              <p>
                The Hongkong and Shanghai Banking Corporation Limited, India (“HSBC India”) is committed to safeguarding your personal data in accordance with the Digital Personal Data Protection Act (DPDP), 2023 and Reserve Bank of India regulations.
              </p>
              <p>
                We process your personal information, financial identifiers, and device telemetry strictly for authentication, fraud mitigation, regulatory compliance, and transaction settlement.
              </p>
              <p>
                All data in transit is encrypted using TLS 1.3 with 256-bit encryption. Card credentials are never stored in plaintext and conform with PCI-DSS guidelines.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="px-4 py-2 bg-[#DB0011] text-white rounded-xl text-xs font-bold"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="text-xs text-[#555555] space-y-2 leading-relaxed">
              <p>
                By accessing HSBC India Personal Internet Banking, you agree to maintain the confidentiality of your 6-digit MPIN, password, and security tokens.
              </p>
              <p>
                Security notice: All electronic fund transfers, account statements, and financial services are subject to Reserve Bank of India (RBI) guidelines and HSBC India terms & conditions.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 bg-[#DB0011] text-white rounded-xl text-xs font-bold"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
