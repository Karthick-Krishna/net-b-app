import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Fingerprint, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('PRM-882941');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your Customer ID or Email');
      return;
    }
    setIsSubmitting(true);
    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Welcome to Premier Digital Banking');
      navigate('/');
    } else {
      toast.error(res.error || 'Authentication failed');
    }
  };

  const handleQuickLogin = async (customerId: string) => {
    setIsSubmitting(true);
    const res = await login(customerId);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Logged in successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Disclaimer Header */}
      <div className="max-w-md mx-auto w-full mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#B0000D] text-white text-[11px] font-medium py-1 px-3 rounded-full shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Premier Digital Banking — Authenticated Client Portal</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-[#DB0011] rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-3xl leading-none">P</span>
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-[#222222] tracking-tight">
          Log On to Online Banking
        </h2>
        <p className="mt-1 text-center text-xs text-[#777777]">
          Secure personal and international digital wealth management
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-[#E5E5E5] sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Customer ID or Email
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB0011] focus:border-[#DB0011]"
                  placeholder="e.g. PRM-882941 or email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB0011] focus:border-[#DB0011]"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberId}
                  onChange={e => setRememberId(e.target.checked)}
                  className="rounded border-gray-300 text-[#DB0011] focus:ring-[#DB0011]"
                />
                <span className="text-gray-600">Remember Customer ID</span>
              </label>
              <a href="#" className="font-medium text-[#DB0011] hover:underline">
                Forgot Details?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-[#DB0011] hover:bg-[#B0000D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB0011] transition-all disabled:opacity-50"
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

          {/* Quick Demo Sandboxes */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Demonstration Accounts</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('PRM-882941')}
                className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-[#DB0011] hover:bg-red-50/50 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900">Karthick Krishna (Premier VIP)</div>
                  <div className="text-[10px] text-gray-500">ID: PRM-882941 • ₹ 25,50,250 Balance</div>
                </div>
                <span className="text-[10px] font-bold text-[#DB0011]">Use &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('PRM-991245')}
                className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-[#DB0011] hover:bg-red-50/50 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900">Ananya Deshmukh (Corporate)</div>
                  <div className="text-[10px] text-gray-500">ID: PRM-991245 • Pune Branch</div>
                </div>
                <span className="text-[10px] font-bold text-[#DB0011]">Use &rarr;</span>
              </button>
            </div>
          </div>

          {/* Biometric Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleQuickLogin('PRM-882941')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Fingerprint className="w-4 h-4 text-[#DB0011]" />
              <span>Log On with Touch ID / Face ID</span>
            </button>
          </div>
        </div>

        {/* Regulatory disclaimer footer */}
        <p className="mt-6 text-center text-[11px] text-gray-500 leading-relaxed px-4">
          Independently managed digital banking application. All account balances and transactions are application-managed platform records.
        </p>
      </div>
    </div>
  );
};
