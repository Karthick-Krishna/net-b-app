import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { Bell, Eye, EyeOff, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { showBalances, toggleShowBalances, unreadCount, setActiveTab } = useBanking();

  // Get appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white border-b border-bank-border px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-2.5">
        {/* Brand Hexagon Symbol */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DB0011] to-[#B0000D] flex items-center justify-center text-white shadow-xs">
            <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current">
              <polygon points="50,10 90,32 90,68 50,90 10,68 10,32" />
              <polygon points="50,28 72,40 72,60 50,72 28,60 28,40" fill="#FFFFFF" />
              <polygon points="50,38 62,44 62,56 50,62 38,56 38,44" fill="#DB0011" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-bank-muted leading-tight">
              Premier Banking
            </div>
            <div className="text-sm font-bold text-bank-text leading-none">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Member'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Toggle Balance Visibility Button */}
        <button
          onClick={toggleShowBalances}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition"
          title={showBalances ? 'Hide financial balances' : 'Reveal financial balances'}
          aria-label={showBalances ? 'Hide balances' : 'Show balances'}
        >
          {showBalances ? <Eye size={18} /> : <EyeOff size={18} className="text-[#DB0011]" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 relative transition"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#DB0011] text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Customer Support Icon */}
        <button
          onClick={() => setActiveTab('support')}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition"
          title="24/7 Premier Help & Support"
          aria-label="Customer support"
        >
          <HelpCircle size={18} />
        </button>

        {/* User Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 ml-1 rounded-full overflow-hidden border border-zinc-200 ring-1 ring-zinc-300 hover:ring-[#DB0011] transition shrink-0"
          title="View Profile & Security"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#DB0011] text-white flex items-center justify-center text-xs font-bold">
              {user?.full_name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
