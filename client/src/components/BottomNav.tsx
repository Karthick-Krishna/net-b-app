import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './common/Icon';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Home', icon: 'House' as const },
    { to: '/accounts', label: 'Accounts', icon: 'WalletCards' as const },
    { to: '/payments', label: 'Payments', icon: 'ArrowLeftRight' as const },
    { to: '/cards', label: 'Cards', icon: 'CreditCard' as const },
    { to: '/settings', label: 'Settings', icon: 'Settings' as const },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E8E8] shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-16">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-[#DB0011]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={tab.icon}
                  size="bottomNav"
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={isActive ? 'text-[#DB0011]' : 'text-gray-500'}
                  title={tab.label}
                />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && <div className="w-1.5 h-1.5 bg-[#DB0011] rounded-full mt-[-2px]" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
