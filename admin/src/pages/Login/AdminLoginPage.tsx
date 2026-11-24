import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import toast from 'react-hot-toast';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@hsbc.co.in');
  const [password, setPassword] = useState('AdminSecret@2026');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      toast.success('Administrator authenticated.');
      navigate('/');
    } else {
      toast.error(res.error || 'Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-card border border-[#E8E8E8] mb-4 p-2">
          <img src="/logo.png" alt="HSBC India" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-black text-[#252525] tracking-tight">
          HSBC INDIA
        </h2>
        <div className="text-xs font-bold uppercase tracking-wider text-[#DB0011] mt-0.5">
          Operations Console
        </div>
        <p className="mt-1 text-xs text-[#777777]">
          Administrative Ledger & Core Banking Management Platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-[#E8E8E8] sm:px-10 space-y-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase tracking-wider mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs text-[#252525] focus:outline-none focus:border-[#DB0011]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase tracking-wider mb-1.5">
                Operations Security Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs text-[#252525] focus:outline-none focus:border-[#DB0011]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Authenticate to Operations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E8E8] text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#16864A] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 256-bit Encrypted Management Gateway</span>
            </div>
            <p className="text-[10px] text-[#777777]">
              Authorized personnel only. All access events are recorded to the immutable regulatory audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
