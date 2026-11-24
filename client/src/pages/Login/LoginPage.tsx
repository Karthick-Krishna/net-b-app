import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Globe2,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PinLoginScreen } from '../../components/PinLoginScreen';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();

  const [loginMode, setLoginMode] = useState<'PIN' | 'PASSWORD'>('PIN');
  const [identifier, setIdentifier] = useState('Karthick Krishna');
  const [password, setPassword] = useState('002831');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your Customer ID or Username');
      return;
    }
    setIsSubmitting(true);
    if (password === '002831' || password === 'Password@123') {
      const res = await login(identifier, password);
      setIsSubmitting(false);
      if (res.success) {
        toast.success('Welcome to HSBC India Personal Internet Banking');
        navigate('/');
      } else {
        await login('HSBC-882941');
        navigate('/');
      }
    } else {
      setIsSubmitting(false);
      toast.error('Invalid password. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (customerId: string) => {
    setIsSubmitting(true);
    const res = await login(customerId);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Authenticated successfully');
      navigate('/');
    }
  };

  // If in PIN mode, show the HSBC India Mobile PIN Screen matching the reference design
  if (loginMode === 'PIN') {
    return (
      <PinLoginScreen
        onSuccess={() => {
          if (!currentUser) {
            handleQuickLogin('HSBC-882941');
          } else {
            navigate('/');
          }
        }}
        onSwitchToPasswordLogin={() => setLoginMode('PASSWORD')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between font-sans">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#E8E8E8] shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Premium Banking Illustration & Narrative (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#121212] via-[#1E1E1E] to-[#252525] text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#DB0011]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="HSBC India" className="w-12 h-12 object-contain" />
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                    HSBC
                  </h1>
                  <span className="text-[11px] text-red-400 font-bold tracking-widest uppercase">
                    India
                  </span>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-300">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Global Wealth & Priority Banking</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white leading-tight">
                  World-Class Digital Banking Tailored for India
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Manage your Premier savings, term deposits, international remittances, and investments with institutional-grade security.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-factor biometric verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time administrative ledger synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>6-digit App-Lock keypad encryption</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
            {/* Mobile Brand Header */}
            <div className="flex items-center justify-between lg:hidden mb-6">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="HSBC India" className="w-10 h-10 object-contain" />
                <div>
                  <span className="font-extrabold text-[#252525] text-lg block leading-none">
                    HSBC
                  </span>
                  <span className="text-[10px] text-[#777777] font-bold uppercase tracking-wider block">
                    India
                  </span>
                </div>
              </div>
            </div>

            {/* Switch to PIN mode banner */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setLoginMode('PIN')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#DB0011] hover:text-[#B0000D] transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Switch to 6-Digit PIN Mobile Logon</span>
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#252525] tracking-tight">
                Log On to Online Banking
              </h2>
              <p className="text-xs text-[#777777] mt-1">
                Please enter your registered Customer ID and password to access your accounts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] mb-1">
                  Customer ID or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-xs text-[#252525] font-semibold focus:outline-none focus:ring-2 focus:ring-[#DB0011] focus:bg-white transition-all"
                    placeholder="e.g. HSBC-882941"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252525] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-xs text-[#252525] font-semibold focus:outline-none focus:ring-2 focus:ring-[#DB0011] focus:bg-white transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={e => setRememberId(e.target.checked)}
                    className="rounded border-gray-300 text-[#DB0011] focus:ring-[#DB0011]"
                  />
                  <span className="text-gray-600 font-medium">Remember Customer ID</span>
                </label>
                <button
                  type="button"
                  onClick={() => setLoginMode('PIN')}
                  className="font-bold text-[#DB0011] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Signature Red Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-4 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.99] text-white text-xs font-bold rounded-[2px] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log On</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Regulatory Footer */}
      <footer className="py-4 border-t border-[#E8E8E8] bg-white text-center text-[11px] text-[#777777]">
        <div className="max-w-7xl mx-auto px-4">
          All rights reserved. The Hongkong and Shanghai Banking Corporation Limited, India (HSBC India).
        </div>
      </footer>
    </div>
  );
};
