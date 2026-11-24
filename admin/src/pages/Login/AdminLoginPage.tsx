import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import toast from 'react-hot-toast';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@premierbanking.com');
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
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-[#DB0011] rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mb-4">
          P
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Central Administration Console
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Premier Digital Banking Operations & Financial Ledger Access
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1E293B] py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Admin Email
              </label>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Administrative Passphrase
              </label>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#DB0011]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Authenticate to Operations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Authorized personnel only. All access attempts are logged to immutable audit trail.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
