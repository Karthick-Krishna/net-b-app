import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  ArrowLeftRight,
  Users,
  Wallet,
  CreditCard,
  Lock,
  FileCheck2,
  Headphones,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Operations Dashboard', icon: LayoutDashboard },
    { to: '/balances', label: 'Balance Adjustments', icon: DollarSign, highlight: true },
    { to: '/transactions', label: 'Transaction Manager', icon: ArrowLeftRight, highlight: true },
    { to: '/customers', label: 'Customer Registry', icon: Users },
    { to: '/accounts', label: 'Account Portfolios', icon: Wallet },
    { to: '/cards', label: 'Card Management', icon: CreditCard },
    { to: '/security', label: 'App-Lock Security', icon: Lock, highlight: true },
    { to: '/audit-logs', label: 'Immutable Audit Trail', icon: FileCheck2 },
    { to: '/support', label: 'Concierge Support', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E293B] border-r border-slate-800 flex flex-col">
        {/* Admin Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DB0011] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              P
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-white text-sm">PREMIER OPS</div>
              <div className="text-[10px] text-red-400 font-mono font-semibold uppercase">Central Admin Console</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Control Center
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#DB0011] text-white shadow-sm'
                      : item.highlight
                      ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Client Launch Link */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 rounded-lg text-xs font-semibold transition-colors border border-red-800/40"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Launch Client (Port 4000)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Admin profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{adminUser?.displayName}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{adminUser?.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#1E293B] border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Central Database Connected
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Branch: <strong className="text-white">{adminUser?.assignedBranch}</strong></span>
            <span>•</span>
            <span className="font-mono text-red-400 font-bold uppercase">{adminUser?.role}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
