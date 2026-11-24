import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MoreHorizontal,
  ScanFace,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  ArrowRight,
  X,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  Headset,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppLock } from '../context/AppLockContext';
import { RealtimeStore } from '@shared/realtimeStore';
import toast from 'react-hot-toast';

interface PinLoginScreenProps {
  onSuccess?: () => void;
  onSwitchToPasswordLogin?: () => void;
  isModal?: boolean;
}

export const PinLoginScreen: React.FC<PinLoginScreenProps> = ({
  onSuccess,
  onSwitchToPasswordLogin,
  isModal = false,
}) => {
  const { currentUser, switchCustomer, login } = useAuth();
  const { verifyPin, unlockApp, resetMpin, failedAttempts, remainingAttempts } = useAppLock();

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Modals & Sheets
  const [showForgotPinModal, setShowForgotPinModal] = useState<boolean>(false);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState<boolean>(false);
  const [showBiometricsModal, setShowBiometricsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState<boolean>(false);
  const [showKeypad, setShowKeypad] = useState<boolean>(true);

  // Forgot PIN Flow States
  const [forgotStep, setForgotStep] = useState<'IDENTITY' | 'OTP' | 'NEW_PIN'>('IDENTITY');
  const [regPhone, setRegPhone] = useState<string>('+91 98765 43210');
  const [panNumber, setPanNumber] = useState<string>('ABCDE1234F');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [showNewPinText, setShowNewPinText] = useState<boolean>(false);

  // Security Code Flow
  const [securityCode, setSecurityCode] = useState<string>('842 190');
  const [securityTimer, setSecurityTimer] = useState<number>(30);

  // Invisible input ref for native keyboard focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive Masked ID matching the screenshot: "Hi in000116****"
  const maskedUserId = React.useMemo(() => {
    if (!currentUser) return 'in000116****';
    const digitsOnly = currentUser.customerId.replace(/\D/g, '');
    const prefix = digitsOnly ? digitsOnly.slice(0, 3) : '116';
    return `in000${prefix}****`;
  }, [currentUser]);

  // Focus invisible input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle PIN input change
  const handleDigitInput = (digit: string) => {
    if (pin.length < 6 && !isVerifying) {
      const next = pin + digit;
      setPin(next);
      setErrorMsg('');

      if (next.length === 6) {
        submitPinVerification(next);
      }
    }
  };

  const handleDeleteDigit = () => {
    if (pin.length > 0 && !isVerifying) {
      setPin(prev => prev.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMsg('');
  };

  const submitPinVerification = (pinToVerify: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyPin(pinToVerify);
      if (res.success) {
        toast.success('PIN verified. Welcome to HSBC India!');
        if (onSuccess) onSuccess();
        else unlockApp();
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setErrorMsg(res.message || 'Incorrect PIN entered.');
        setPin('');
        setIsVerifying(false);
      }
    }, 220);
  };

  // Keyboard navigation listener (desktop typing 0-9 and backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal dialog is open, skip root PIN typing
      if (showForgotPinModal || showSecurityCodeModal || showBiometricsModal || showHelpModal) {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Escape') {
        setShowMenuDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isVerifying, showForgotPinModal, showSecurityCodeModal, showBiometricsModal, showHelpModal]);

  // Security Code 30s Countdown
  useEffect(() => {
    if (!showSecurityCodeModal) return;
    const interval = setInterval(() => {
      setSecurityTimer(prev => {
        if (prev <= 1) {
          // Generate new 6-digit random code
          const c1 = Math.floor(100 + Math.random() * 900);
          const c2 = Math.floor(100 + Math.random() * 900);
          setSecurityCode(`${c1} ${c2}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showSecurityCodeModal]);

  // OTP Countdown timer
  useEffect(() => {
    if (forgotStep !== 'OTP' || !showForgotPinModal) return;
    const interval = setInterval(() => {
      setOtpTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotStep, showForgotPinModal]);

  // Face ID Biometric Authentication simulation
  const handleFaceIdTrigger = () => {
    setShowBiometricsModal(true);
    setTimeout(() => {
      // Automatic biometric success after 1.2s scan
      unlockApp();
      if (onSuccess) onSuccess();
      toast.success('Face ID authenticated successfully');
      setShowBiometricsModal(false);
    }, 1300);
  };

  // Forgot PIN Flow Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPhone || regPhone.length < 10) {
      toast.error('Please enter a valid registered mobile number');
      return;
    }
    setOtpTimer(30);
    setForgotStep('OTP');
    toast.success('Security OTP sent to registered mobile ending in ••890');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== '882941' && otpInput.trim().length !== 6) {
      toast.error('Invalid OTP. Please enter the 6-digit verification code or use demo OTP.');
      return;
    }
    setForgotStep('NEW_PIN');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      toast.error('PIN must be exactly 6 numeric digits');
      return;
    }
    if (newPin === '123456' || newPin === '111111' || newPin === '000000') {
      toast.error('Weak PIN. Sequential or repetitive numbers are not permitted.');
      return;
    }
    if (newPin !== confirmNewPin) {
      toast.error('PIN confirmation does not match');
      return;
    }

    if (currentUser) {
      RealtimeStore.setAppLockPin(currentUser.uid, newPin);
    }
    resetMpin(newPin);
    toast.success('6-Digit PIN successfully updated! Welcome back.');
    setShowForgotPinModal(false);
    if (onSuccess) onSuccess();
    else unlockApp();
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between select-none overflow-x-hidden font-sans">
      {/* Invisible auto-focus input for virtual mobile keyboard */}
      <input
        ref={inputRef}
        type="tel"
        pattern="[0-9]*"
        inputMode="numeric"
        maxLength={6}
        value={pin}
        onChange={e => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          setPin(val);
          if (val.length === 6) submitPinVerification(val);
        }}
        className="sr-only"
        aria-hidden="true"
        autoFocus
      />

      {/* TOP BAR */}
      <header className="w-full max-w-md mx-auto pt-7 pb-3 px-6 flex items-center justify-between z-20">
        {/* Left: HSBC Logo + "India" */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="HSBC"
            className="w-9 h-9 object-contain"
          />
          <span className="text-[17px] font-semibold text-[#222222] tracking-tight">
            India
          </span>
        </div>

        {/* Right: Three red dots "..." */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#DB0011] hover:bg-red-50 active:bg-red-100 transition-colors"
            aria-label="Options Menu"
          >
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DB0011]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#DB0011]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#DB0011]" />
            </div>
          </button>

          {/* Menu Dropdown */}
          <AnimatePresence>
            {showMenuDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs text-[#252525]"
              >
                <div className="px-4 py-2 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Logon Options
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setShowKeypad(!showKeypad);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{showKeypad ? 'Hide On-Screen Keypad' : 'Show On-Screen Keypad'}</span>
                  <span className="text-[10px] text-gray-400">Toggle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setPin('123456');
                    submitPinVerification('123456');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between text-[#DB0011] font-semibold"
                >
                  <span>Auto-Fill Demo PIN (123456)</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                {onSwitchToPasswordLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuDropdown(false);
                      onSwitchToPasswordLogin();
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>Log on with User ID & Password</span>
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setShowHelpModal(true);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Security & Help</span>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-md mx-auto px-6 flex-1 flex flex-col justify-between relative z-10">
        {/* UPPER PORTION: GREETING & PIN ENTRY */}
        <div className="pt-4">
          {/* Greeting: "Hi in000116****" */}
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#222222] tracking-tight">
            Hi {maskedUserId}
          </h1>

          {/* Subtitle: "Enter your 6-digit PIN (?)" */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-[14px] text-[#333333] font-normal">
              Enter your 6-digit PIN
            </span>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-[#222222] hover:text-[#DB0011] transition-colors p-0.5"
              aria-label="PIN Security Information"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* 6 PIN HOLLOW CIRCLES */}
          <div
            onClick={() => inputRef.current?.focus()}
            className={`mt-6 flex items-center justify-between max-w-[320px] cursor-pointer ${
              shake ? 'animate-bounce' : ''
            }`}
          >
            {[0, 1, 2, 3, 4, 5].map(index => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[1.5px] transition-all duration-150 flex items-center justify-center ${
                    errorMsg
                      ? 'border-[#D92D20] bg-red-50/50'
                      : isFilled
                      ? 'border-[#222222] bg-[#222222]'
                      : 'border-[#444444] bg-transparent'
                  }`}
                >
                  {isFilled && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-[#D92D20] font-semibold flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Verifying Indicator */}
          {isVerifying && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#DB0011] border-t-transparent rounded-full animate-spin" />
              <span>Authorizing secure credentials...</span>
            </div>
          )}
        </div>

        {/* CENTER WATERMARK GRAPHIC */}
        <div className="my-auto py-4 flex items-center justify-center pointer-events-none relative overflow-hidden">
          {/* Subtle HSBC Rosette / Ribbon Watercolor Watermark */}
          <div className="relative w-56 h-56 flex items-center justify-center opacity-30">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transform rotate-12 filter blur-[0.6px]"
            >
              <defs>
                <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DB0011" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#FA5252" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FFE3E3" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="roseDark" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B0000D" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF8787" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {/* Multifaceted geometric rosette mimicking HSBC folded ribbons watermark */}
              <polygon points="100,20 140,75 100,100" fill="url(#roseGrad)" />
              <polygon points="100,20 60,75 100,100" fill="url(#roseDark)" />
              <polygon points="180,100 125,140 100,100" fill="url(#roseGrad)" />
              <polygon points="180,100 125,60 100,100" fill="url(#roseDark)" />
              <polygon points="100,180 60,125 100,100" fill="url(#roseGrad)" />
              <polygon points="100,180 140,125 100,100" fill="url(#roseDark)" />
              <polygon points="20,100 75,60 100,100" fill="url(#roseGrad)" />
              <polygon points="20,100 75,140 100,100" fill="url(#roseDark)" />
              {/* Secondary subtle facets */}
              <polygon points="140,75 180,100 125,60" fill="url(#roseGrad)" opacity="0.6" />
              <polygon points="140,125 180,100 125,140" fill="url(#roseDark)" opacity="0.6" />
              <polygon points="60,125 20,100 75,140" fill="url(#roseGrad)" opacity="0.6" />
              <polygon points="60,75 20,100 75,60" fill="url(#roseDark)" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* ON-SCREEN NUMERIC KEYPAD (Collapsible / Responsive) */}
        {showKeypad && (
          <div className="pb-3 pt-1">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[300px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitInput(num)}
                  className="h-11 sm:h-12 rounded-xl bg-gray-50/80 hover:bg-gray-100 active:bg-gray-200 text-[#222222] text-lg font-bold transition-all flex items-center justify-center border border-gray-100/80 shadow-xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="h-11 sm:h-12 rounded-xl bg-gray-50/80 hover:bg-gray-100 active:bg-gray-200 text-[11px] font-semibold text-gray-500 transition-all flex items-center justify-center border border-gray-100/80"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleDigitInput('0')}
                className="h-11 sm:h-12 rounded-xl bg-gray-50/80 hover:bg-gray-100 active:bg-gray-200 text-[#222222] text-lg font-bold transition-all flex items-center justify-center border border-gray-100/80 shadow-xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteDigit}
                className="h-11 sm:h-12 rounded-xl bg-gray-50/80 hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-semibold transition-all flex items-center justify-center border border-gray-100/80 shadow-xs"
                aria-label="Delete"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="pt-2 pb-6 space-y-3.5">
          {/* Primary Action Button: "Log on with Face ID" */}
          <button
            type="button"
            onClick={handleFaceIdTrigger}
            className="w-full h-12 bg-[#DB0011] hover:bg-[#B0000D] active:bg-[#90000A] text-white text-[14px] font-semibold rounded-xs tracking-normal shadow-xs transition-colors flex items-center justify-center"
          >
            Log on with Face ID
          </button>

          {/* Text Link: "Forgot your PIN?" */}
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                setForgotStep('IDENTITY');
                setShowForgotPinModal(true);
              }}
              className="text-[13px] text-[#222222] hover:text-[#DB0011] font-medium transition-colors cursor-pointer"
            >
              Forgot your PIN?
            </button>
          </div>

          {/* Secondary Action Button: "Generate a security code" */}
          <button
            type="button"
            onClick={() => {
              setSecurityTimer(30);
              setShowSecurityCodeModal(true);
            }}
            className="w-full h-12 bg-white hover:bg-gray-50 active:bg-gray-100 border border-[#222222] text-[#222222] text-[14px] font-medium rounded-xs tracking-normal transition-colors flex items-center justify-center"
          >
            Generate a security code
          </button>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 1. FORGOT PIN / PASSWORD RECOVERY MODAL                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showForgotPinModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="HSBC" className="w-6 h-6 object-contain" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Security Key Reset
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPinModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="px-6 pt-5 pb-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span className={forgotStep === 'IDENTITY' ? 'text-[#DB0011]' : ''}>1. Verify Details</span>
                  <span className={forgotStep === 'OTP' ? 'text-[#DB0011]' : ''}>2. SMS OTP</span>
                  <span className={forgotStep === 'NEW_PIN' ? 'text-[#DB0011]' : ''}>3. New 6-Digit PIN</span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#DB0011] h-full transition-all duration-300"
                    style={{
                      width:
                        forgotStep === 'IDENTITY' ? '33%' : forgotStep === 'OTP' ? '66%' : '100%',
                    }}
                  />
                </div>
              </div>

              {/* Step 1: Customer Identity Verification */}
              {forgotStep === 'IDENTITY' && (
                <form onSubmit={handleSendOtp} className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#222222]">
                      Forgot your Application PIN?
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Confirm your registered banking credentials to initiate an instantaneous self-service PIN reset.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      User Identifier
                    </label>
                    <input
                      type="text"
                      disabled
                      value={maskedUserId}
                      className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono font-semibold text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Registered Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Registered PAN or Date of Birth
                    </label>
                    <input
                      type="text"
                      required
                      value={panNumber}
                      onChange={e => setPanNumber(e.target.value)}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: 2FA OTP Verification */}
              {forgotStep === 'OTP' && (
                <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#222222]">
                      Enter One-Time Password
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      A 6-digit security code was dispatched to registered mobile ending in <strong className="text-gray-800">••890</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      6-Digit Security OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-base font-bold bg-gray-50 border border-gray-200 rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                    />
                  </div>

                  {/* Demo helper */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">Demo Sandbox OTP: </span>
                      <strong className="font-mono font-bold">882941</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpInput('882941')}
                      className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 rounded text-[11px] font-bold text-amber-950 transition-colors"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {otpTimer > 0 ? (
                        `Resend OTP in ${otpTimer}s`
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOtpTimer(30)}
                          className="text-[#DB0011] font-bold hover:underline"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForgotStep('IDENTITY')}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      Edit Mobile
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Verify Code</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Choose New PIN */}
              {forgotStep === 'NEW_PIN' && (
                <form onSubmit={handleSaveNewPin} className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#222222]">
                      Create New 6-Digit PIN
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a confidential 6-digit number to secure your mobile internet banking.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                        New 6-Digit PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewPinText(!showNewPinText)}
                        className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1"
                      >
                        {showNewPinText ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showNewPinText ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showNewPinText ? 'text' : 'password'}
                      maxLength={6}
                      required
                      value={newPin}
                      onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full px-4 py-2.5 tracking-widest text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Confirm New 6-Digit PIN
                    </label>
                    <input
                      type={showNewPinText ? 'text' : 'password'}
                      maxLength={6}
                      required
                      value={confirmNewPin}
                      onChange={e => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full px-4 py-2.5 tracking-widest text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 space-y-1">
                    <div className="font-bold text-gray-700">Security Criteria:</div>
                    <div>• Exactly 6 numerical digits</div>
                    <div>• Avoid repetitive numbers (e.g. 111111)</div>
                    <div>• Avoid sequential patterns (e.g. 123456)</div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Reset PIN & Log On</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. GENERATE A SECURITY CODE (SOFT TOKEN) MODAL           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showSecurityCodeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 text-center p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Digital Secure Key
                </span>
                <button
                  type="button"
                  onClick={() => setShowSecurityCodeModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-[#222222]">
                HSBC Security Code
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Use this single-use authentication token to authorize phone banking or desktop Internet Banking logon.
              </p>

              {/* Rolling Code Display */}
              <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-[0.25em] font-mono text-[#222222]">
                  {securityCode}
                </span>

                {/* 30s Countdown timer bar */}
                <div className="w-full mt-3 flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                  <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#DB0011] h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(securityTimer / 30) * 100}%` }}
                    />
                  </div>
                  <span>{securityTimer}s</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(securityCode.replace(/\s+/g, ''));
                    toast.success('Security code copied to clipboard');
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#222222] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSecurityCodeModal(false)}
                  className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3. FACE ID / BIOMETRICS SIMULATION MODAL                 */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showBiometricsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-64 bg-white/95 rounded-3xl p-6 text-center shadow-2xl border border-gray-100 flex flex-col items-center"
            >
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#DB0011]/30 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center shadow-inner">
                  <ScanFace className="w-9 h-9 animate-pulse" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-[#222222]">
                Face ID
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">
                Authenticating biometric key...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 4. PIN SECURITY & HELP MODAL                             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[#222222] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#DB0011]" />
                  <span>PIN Protection Guidance</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-gray-600 space-y-2.5 leading-relaxed">
                <p>
                  • Your 6-digit PIN is uniquely bound to your registered handset for fast, protected banking access.
                </p>
                <p>
                  • HSBC India will <strong>never</strong> ask you to reveal your 6-digit PIN, card ATM PIN, or One-Time Passwords via SMS, phone call, or email.
                </p>
                <p>
                  • If you forget your PIN, tap <strong>Forgot your PIN?</strong> below to securely verify your identity via SMS OTP and establish a new code.
                </p>
                <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-500 border border-gray-100">
                  Default Demo PIN for testing: <strong className="font-mono text-gray-800">123456</strong>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="w-full py-2.5 bg-[#222222] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
