import React from 'react';
import { useBanking } from '../context/BankingContext';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Monitor, Shield, LogOut, CheckCircle, Wifi, BatteryCharging } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewportMode, setViewportMode, notificationMessage } = useBanking();
  const { user, login, logout } = useAuth();

  const handleQuickLogin = async (identifier: string, pass: string) => {
    try {
      await login(identifier, pass);
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-white flex flex-col items-center">
      {/* Top Device & Developer Toolbar */}
      <header className="w-full bg-[#121214] border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <span className="w-5 h-5 bg-[#DB0011] rounded flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm">
              ▲
            </span>
            <span className="text-sm font-semibold tracking-normal">PREMIER MOBILE BANKING</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CORE LEDGER: ONLINE
          </span>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewportMode('iphone')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewportMode === 'iphone'
                ? 'bg-zinc-700 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="iPhone 16 Pro View"
          >
            <Smartphone size={13} />
            <span className="hidden md:inline">iPhone 16 Pro</span>
          </button>
          <button
            onClick={() => setViewportMode('pixel')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewportMode === 'pixel'
                ? 'bg-zinc-700 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Google Pixel 9 View"
          >
            <Smartphone size={13} />
            <span className="hidden md:inline">Pixel 9</span>
          </button>
          <button
            onClick={() => setViewportMode('responsive')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewportMode === 'responsive'
                ? 'bg-zinc-700 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Full Screen Mobile View"
          >
            <Monitor size={13} />
            <span className="hidden md:inline">Full Screen</span>
          </button>
          <button
            onClick={() => setViewportMode('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewportMode === 'admin'
                ? 'bg-red-950 border border-red-800 text-red-300 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Admin Management Portal"
          >
            <Shield size={13} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Quick Sandbox Credentials & Auth Indicator */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-zinc-400">
                Logged in as <strong className="text-zinc-200">{user.full_name}</strong> ({user.role})
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                title="Log Out"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-[11px] mr-1 hidden sm:inline">Sandbox:</span>
              <button
                onClick={() => handleQuickLogin('premier_user', 'Password@123')}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] transition"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  handleQuickLogin('super_admin', 'Admin@123');
                  setViewportMode('admin');
                }}
                className="px-2 py-0.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-[11px] transition"
              >
                Admin
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Toast Notification */}
      {notificationMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border transition-all animate-bounce ${
            notificationMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-800 text-emerald-200'
              : notificationMessage.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-200'
              : 'bg-zinc-900 border-zinc-700 text-white'
          }`}
        >
          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
          <span>{notificationMessage.text}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        {viewportMode === 'responsive' || viewportMode === 'admin' ? (
          <div className="w-full max-w-5xl min-h-[840px] bg-white text-bank-text rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-zinc-300">
            {children}
          </div>
        ) : (
          /* Mobile Chassis Simulator */
          <div
            className={`relative transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden bg-bank-bg text-bank-text ${
              viewportMode === 'iphone'
                ? 'w-[400px] h-[850px] rounded-[52px] border-[12px] border-[#2E2E32] ring-1 ring-zinc-600'
                : 'w-[410px] h-[860px] rounded-[44px] border-[10px] border-[#1C1C1E] ring-1 ring-zinc-700'
            }`}
          >
            {/* Status Bar */}
            <div className="h-11 bg-white text-zinc-900 px-7 pt-2 flex items-center justify-between text-[13px] font-semibold select-none shrink-0 z-40 border-b border-zinc-100">
              <span>18:38</span>
              {viewportMode === 'iphone' ? (
                /* Dynamic Island */
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A365D]"></div>
                </div>
              ) : (
                /* Android Hole-punch */
                <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-zinc-800"></div>
              )}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>5G</span>
                <Wifi size={13} />
                <BatteryCharging size={14} className="text-emerald-600" />
              </div>
            </div>

            {/* Mobile Content Screen */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-bank-bg">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="h-5 bg-white flex items-center justify-center shrink-0 border-t border-zinc-100/50">
              <div className="w-32 h-1 bg-zinc-300 rounded-full"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
