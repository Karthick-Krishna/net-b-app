import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Gift,
  Shield,
  FileText,
  Lock,
  Headphones,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/accounts', label: 'Accounts & Deposits', icon: Wallet },
    { to: '/transactions', label: 'Activity & History', icon: ArrowLeftRight },
    { to: '/payments', label: 'Payments & Transfers', icon: ArrowLeftRight },
    { to: '/cards', label: 'Manage Cards', icon: CreditCard },
    { to: '/wealth', label: 'Wealth Portfolio', icon: TrendingUp },
    { to: '/deposits', label: 'Fixed Deposits', icon: PiggyBank },
    { to: '/rewards', label: 'Premier Rewards', icon: Gift },
    { to: '/insurance', label: 'Protection & Insurance', icon: Shield },
    { to: '/statements', label: 'Statements & Tax', icon: FileText },
    { to: '/security', label: 'Security & App-Lock', icon: Lock },
    { to: '/support', label: 'Premier Support', icon: Headphones },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E5E5] min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5E5E5]">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#DB0011] rounded flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <span className="text-white font-extrabold text-xl leading-none">P</span>
          </div>
          <div>
            <span className="font-extrabold text-[#222222] tracking-tight text-lg block leading-none">
              PREMIER
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-semibold mt-0.5">
              Digital Banking
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Main Banking
        </div>
        {navLinks.slice(0, 6).map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#DB0011] text-white shadow-xs font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Services & Protection
        </div>
        {navLinks.slice(6).map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#DB0011] text-white shadow-xs font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Central Portal Link (Quick reviewer test link) */}
      <div className="p-3 border-t border-[#E5E5E5] bg-gray-50">
        <a
          href="http://localhost:4001"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Admin Console (4001)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      {/* User Card */}
      <div className="p-3 border-t border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DB0011] text-white flex items-center justify-center text-xs font-bold">
              {currentUser?.displayName?.slice(0, 2).toUpperCase() || 'KK'}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 leading-tight">
                {currentUser?.displayName}
              </div>
              <div className="text-[10px] text-gray-500 font-mono">
                {currentUser?.customerId}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-[#DB0011] transition-colors rounded hover:bg-white"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
