import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Icon, IconName } from './common/Icon';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const primaryLinks: { to: string; label: string; icon: IconName }[] = [
    { to: '/', label: 'Home Dashboard', icon: 'House' },
    { to: '/accounts', label: 'My Accounts', icon: 'WalletCards' },
    { to: '/payments', label: 'Pay & Transfer', icon: 'ArrowLeftRight' },
    { to: '/cards', label: 'Manage Cards', icon: 'CreditCard' },
    { to: '/transactions', label: 'Transaction Activity', icon: 'ReceiptText' },
  ];

  const secondaryLinks: { to: string; label: string; icon: IconName }[] = [
    { to: '/wealth', label: 'Wealth & Investments', icon: 'ChartNoAxesCombined' },
    { to: '/deposits', label: 'Fixed Deposits', icon: 'Landmark' },
    { to: '/rewards', label: 'Rewards & Offers', icon: 'Gift' },
    { to: '/insurance', label: 'Protection & Insurance', icon: 'ShieldCheck' },
    { to: '/statements', label: 'Statements & Reports', icon: 'FileText' },
    { to: '/security', label: 'Security & App-Lock', icon: 'LockKeyhole' },
    { to: '/settings', label: 'Settings & Preferences', icon: 'Settings' },
    { to: '/support', label: 'Help & Concierge', icon: 'Headset' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E8E8E8] min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E8E8E8]">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="HSBC India"
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className="font-extrabold text-[#252525] tracking-tight text-lg block leading-none">
              HSBC
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-bold mt-0.5">
              India
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Personal Banking
        </div>
        {primaryLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon
                    name={link.icon}
                    size="sidebar"
                    strokeWidth={1.8}
                    className={isActive ? 'text-white' : 'text-gray-500'}
                  />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Wealth & Services
        </div>
        {secondaryLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon
                    name={link.icon}
                    size="sidebar"
                    strokeWidth={1.8}
                    className={isActive ? 'text-white' : 'text-gray-500'}
                  />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Portal Shortcut */}
      <div className="p-3 border-t border-[#E8E8E8] bg-gray-50">
        <a
          href="http://localhost:4001"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 bg-white border border-[#E8E8E8] rounded-xl text-xs font-bold text-gray-800 hover:border-[#DB0011] hover:text-[#DB0011] transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DB0011] animate-ping" />
            <span>Operations Console (Port 4001)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      {/* Customer User Info / Logout */}
      <div className="p-3.5 border-t border-[#E8E8E8] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-red-100 text-[#DB0011] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {currentUser?.displayName?.charAt(0) || 'C'}
          </div>
          <div className="min-w-0 pr-2">
            <div className="text-xs font-bold text-gray-900 truncate">
              {currentUser?.displayName || 'Premier Customer'}
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {currentUser?.customerId}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out securely"
          className="p-1.5 text-gray-400 hover:text-[#DB0011] hover:bg-red-50 rounded-lg transition-colors"
        >
          <Icon name="LogOut" size="sm" strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  );
};
