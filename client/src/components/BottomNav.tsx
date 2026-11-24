import React from 'react';
import { useBanking } from '../context/BankingContext';
import { Home, Landmark, ArrowLeftRight, CreditCard, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useBanking();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: Landmark },
    { id: 'payments', label: 'Payments', icon: ArrowLeftRight },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="bg-white border-t border-bank-border px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-40 shadow-lg shrink-0"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-[#DB0011] font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isActive ? 'scale-110' : ''}`}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            </div>
            <span className="text-[11px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 bg-[#DB0011] rounded-full absolute -top-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
