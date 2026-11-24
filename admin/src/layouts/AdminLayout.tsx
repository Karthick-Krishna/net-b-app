import React, { useState } from 'react';
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
  Building2,
  Menu,
  X,
  Radio,
  Sliders,
  Settings,
  Gift,
  ChartNoAxesCombined,
  ClipboardCheck,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Operations Dashboard', icon: LayoutDashboard },
    { to: '/balances', label: 'Balance Adjustments', icon: DollarSign, highlight: true },
    { to: '/transactions', label: 'Transaction Manager', icon: ArrowLeftRight, highlight: true },
    { to: '/customers', label: 'Customer Registry', icon: Users },
    { to: '/accounts', label: 'Account Portfolios', icon: Wallet },
    { to: '/cards', label: 'Card Management', icon: CreditCard },
    { to: '/requests', label: 'Service & KYC Requests', icon: ClipboardCheck, highlight: true },
    { to: '/wealth', label: 'Wealth Portfolios', icon: ChartNoAxesCombined },
    { to: '/rewards', label: 'Rewards Program', icon: Gift },
    { to: '/security', label: 'App-Lock & MPIN Security', icon: Lock, highlight: true },
    { to: '/audit-logs', label: 'Immutable Audit Trail', icon: FileCheck2 },
    { to: '/support', label: 'Concierge Support', icon: Headphones },
    { to: '/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#252525] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-[#E8E8E8] flex-col flex-shrink-0 z-20">
        {/* Admin Brand */}
        <div className="p-5 border-b border-[#E8E8E8] flex items-center gap-3">
          <img src="/logo.png" alt="HSBC India" className="w-9 h-9 object-contain flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-black tracking-tight text-[#252525] text-sm uppercase">
              HSBC INDIA
            </div>
            <div className="text-[10px] text-[#DB0011] font-bold uppercase tracking-wider">
              Operations Console
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#777777]">
            Banking Operations
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#DB0011] text-white shadow-xs'
                      : 'text-[#555555] hover:bg-gray-100 hover:text-[#252525]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DB0011]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Client Launch Link */}
        <div className="p-3 border-t border-[#E8E8E8] bg-gray-50/70 space-y-2">
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2.5 bg-red-50 hover:bg-red-100/80 text-[#DB0011] rounded-xl text-xs font-bold transition-colors border border-red-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DB0011] animate-ping" />
              <span>Launch Client (Port 4000)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Admin User Info */}
          <div className="p-2.5 rounded-xl bg-white border border-[#E8E8E8] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-[#252525] truncate">
                {adminUser?.displayName.split(' ')[0] || 'Admin'}
              </div>
              <div className="text-[10px] text-[#777777] font-semibold uppercase">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#777777] hover:text-[#DB0011] hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-[#E8E8E8] p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="HSBC India" className="w-8 h-8 object-contain" />
          <div>
            <div className="font-black text-xs text-[#252525] tracking-tight">HSBC INDIA</div>
            <div className="text-[9px] text-[#DB0011] font-bold uppercase">Operations Console</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 bg-red-50 text-[#DB0011] rounded-lg text-[10px] font-bold border border-red-200"
          >
            Port 4000
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E8E8] p-4 space-y-2 z-20">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-[#DB0011] text-white' : 'text-[#555555] hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-[#E8E8E8] flex justify-between items-center">
            <span className="text-xs text-[#777777]">{adminUser?.email}</span>
            <button
              onClick={logout}
              className="text-xs font-bold text-[#DB0011] hover:underline"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operations Header Bar */}
        <header className="bg-white border-b border-[#E8E8E8] px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16864A]"></span>
              </span>
              <span className="text-xs font-bold text-[#16864A]">
                Live Real-Time Sync Active
              </span>
            </div>
            <span className="text-[#E8E8E8]">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#777777]">
              <Building2 className="w-3.5 h-3.5 text-[#DB0011]" />
              <span>{adminUser?.assignedBranch || 'Mumbai Main Branch, Fort (HQ)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden lg:block text-right">
              <div className="font-bold text-[#252525]">{adminUser?.displayName}</div>
              <div className="text-[10px] text-[#777777] font-mono">{adminUser?.email}</div>
            </div>
            <a
              href="http://localhost:4000"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs"
            >
              <span>Open Client App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
