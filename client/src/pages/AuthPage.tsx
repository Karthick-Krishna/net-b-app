import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { BiometricModal } from '../components/BiometricModal';
import {
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  User,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, biometricLogin, register } = useAuth();
  const { showToast, setViewportMode } = useBanking();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Fields
  const [identifier, setIdentifier] = useState<string>(() => {
    return localStorage.getItem('premier_remembered_id') || 'premier_user';
  });
  const [password, setPassword] = useState<string>('Password@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberId, setRememberId] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBiometric, setShowBiometric] = useState<boolean>(false);

  // Register Fields
  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('+44 7700 900555');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regAddress, setRegAddress] = useState<string>('25 Park Lane');
  const [regCity, setRegCity] = useState<string>('London');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (rememberId) {
        localStorage.setItem('premier_remembered_id', identifier);
      } else {
        localStorage.removeItem('premier_remembered_id');
      }
      await login(identifier, password);
      showToast('Welcome to Premier Mobile Banking', 'success');
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricConfirm = async () => {
    try {
      await biometricLogin();
      showToast('Biometric authentication verified', 'success');
    } catch (err: any) {
      showToast(err.message || 'Biometric login failed', 'error');
    } finally {
      setShowBiometric(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const custId = await register({
        username: regUsername,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        full_name: regFullName,
        address: regAddress,
        city: regCity,
      });

      showToast(`Registration complete! Your Customer ID is ${custId}`, 'success');
      // Auto-fill login
      setIdentifier(regUsername);
      setPassword(regPassword);
      setActiveTab('login');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string, isAdmin: boolean = false) => {
    setIdentifier(user);
    setPassword(pass);
    if (isAdmin) {
      setViewportMode('admin');
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-white animate-in fade-in duration-300">
      {/* Top Bank Identity Branding */}
      <div className="pt-4 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DB0011] to-[#B0000D] flex items-center justify-center text-white shadow-lg mb-3">
          <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current">
            <polygon points="50,10 90,32 90,68 50,90 10,68 10,32" />
            <polygon points="50,28 72,40 72,60 50,72 28,60 28,40" fill="#FFFFFF" />
            <polygon points="50,38 62,44 62,56 50,62 38,56 38,44" fill="#DB0011" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-bank-text">PREMIER BANKING</h1>
        <p className="text-xs text-bank-muted mt-0.5">International Mobile Banking Experience</p>
      </div>

      {/* Auth Tabs */}
      <div className="my-6">
        <div className="flex rounded-xl bg-zinc-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'login' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'register' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
            }`}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Username / Customer ID */}
            <div>
              <label className="text-zinc-600 font-semibold block mb-1">
                Username or Customer ID
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. GB4490182 or premier_user"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-zinc-300 font-medium text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-600 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('For demo testing, default password is Password@123', 'info')}
                  className="text-[11px] text-[#DB0011] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-zinc-300 font-medium text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Customer ID */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                <input
                  type="checkbox"
                  checked={rememberId}
                  onChange={e => setRememberId(e.target.checked)}
                  className="accent-[#DB0011] rounded"
                />
                <span>Remember Customer ID</span>
              </label>
            </div>

            {/* Primary Action Button (Signature Red) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.99] text-white font-bold text-xs tracking-wider uppercase shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In Securely'}
            </button>

            {/* Biometric Login Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBiometric(true)}
                className="w-full py-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 font-bold text-xs text-zinc-800 flex items-center justify-center gap-2 transition"
              >
                <Fingerprint size={16} className="text-[#DB0011]" />
                <span>Sign in with Biometrics (Face ID)</span>
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={regFullName}
                onChange={e => setRegFullName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full p-2.5 rounded-xl border border-zinc-300"
                required
              />
            </div>

            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Username</label>
              <input
                type="text"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                placeholder="e.g. eleanor_vance"
                className="w-full p-2.5 rounded-xl border border-zinc-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="eleanor@example.com"
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Phone</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Create Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full p-2.5 rounded-xl border border-zinc-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wider uppercase shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register for Online Banking'}
            </button>
          </form>
        )}

        {/* Quick Sandbox Credentials Helper */}
        <div className="mt-5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-zinc-700 text-[11px] mb-2">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Sandbox Test Accounts (Instant One-Click Login):</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('premier_user', 'Password@123', false)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 font-semibold text-[10px] text-zinc-800 transition"
            >
              Customer (Alexander Vance)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('super_admin', 'Admin@123', true)}
              className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 border border-red-200 font-semibold text-[10px] text-red-800 transition"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ops_officer', 'Admin@123', true)}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 font-semibold text-[10px] text-zinc-700 transition"
            >
              Operations Officer
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="text-center text-[10px] text-zinc-400 border-t border-zinc-100 pt-3">
        <p>Premier Mobile Banking • 256-Bit TLS End-to-End Encryption</p>
        <p className="mt-0.5">Authorised by the Prudential Regulation Authority (PRA)</p>
      </footer>

      {/* Biometric Challenge Modal */}
      <BiometricModal
        isOpen={showBiometric}
        title="Biometric Sign In"
        subtitle="Authenticate with Face ID to access your accounts"
        onSuccess={handleBiometricConfirm}
        onCancel={() => setShowBiometric(false)}
      />
    </div>
  );
};
