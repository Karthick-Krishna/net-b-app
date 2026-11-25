import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Menu,
  X,
  User,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  LogOut,
  FileText,
  Gift,
  HelpCircle,
  Landmark,
  KeyRound,
  Bell,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppLock } from '../../context/AppLockContext';

export const HsbcTopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { lockApp } = useAppLock();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active tab detection
  const isHome = location.pathname === '/';
  const isPay = location.pathname.startsWith('/payments') || location.pathname.startsWith('/transactions');
  const isCards = location.pathname.startsWith('/cards');
  const isInvest = location.pathname.startsWith('/wealth') || location.pathname.startsWith('/deposits');

  return (
    <>
      {/* AUTHENTIC HSBC MOBILE TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs select-none">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Home outline icon + vertical divider */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`p-1.5 -ml-1 transition-colors ${
                isHome ? 'text-[#DB0011]' : 'text-[#1f1f1f] hover:text-[#DB0011]'
              }`}
              aria-label="Home"
            >
              <Home className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Thin vertical separator */}
            <div className="h-6 w-[1.5px] bg-gray-200 ml-2.5 mr-3" />
          </div>

          {/* Navigation Links: Pay | Cards | Invest */}
          <nav className="flex items-center gap-6 sm:gap-7 flex-1">
            {/* Pay */}
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="relative py-3.5 text-[16px] font-semibold text-[#1f1f1f] hover:text-[#DB0011] transition-colors flex flex-col items-center"
            >
              <span>Pay</span>
              {isPay && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-[#DB0011] rounded-full"
                />
              )}
            </button>

            {/* Cards */}
            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="relative py-3.5 text-[16px] font-semibold text-[#1f1f1f] hover:text-[#DB0011] transition-colors flex flex-col items-center"
            >
              <span>Cards</span>
              {isCards && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-[#DB0011] rounded-full"
                />
              )}
            </button>

            {/* Invest */}
            <button
              type="button"
              onClick={() => navigate('/wealth')}
              className="relative py-3.5 text-[16px] font-semibold text-[#1f1f1f] hover:text-[#DB0011] transition-colors flex flex-col items-center"
            >
              <span>Invest</span>
              {isInvest && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-[#DB0011] rounded-full"
                />
              )}
            </button>
          </nav>

          {/* Right: Hamburger menu [三] */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 -mr-1 text-[#1f1f1f] hover:text-[#DB0011] transition-colors"
            aria-label="Open HSBC Menu"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* SLIDE-OVER HSBC MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="HSBC" className="w-7 h-7 object-contain" />
                  <div>
                    <span className="font-bold text-[#1f1f1f] text-base leading-none block">
                      HSBC India
                    </span>
                    <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block mt-0.5">
                      Premier Banking
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-black rounded-full"
                >
                  <X className="w-6 h-6 stroke-[1.8]" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#DB0011] text-white flex items-center justify-center font-bold text-lg">
                    {currentUser?.displayName?.[0] || 'K'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1f1f1f]">
                      {currentUser?.displayName || 'Karthick Krishna'}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono">
                      ID: {currentUser?.customerId || 'HSBC-882941'} • Premier
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Navigation Links */}
              <div className="p-3 flex-1 space-y-1">
                {[
                  { label: 'My Accounts & Balances', path: '/accounts', icon: Landmark },
                  { label: 'Pay & Transfer Money', path: '/payments', icon: ArrowRight },
                  { label: 'Manage Cards & Limits', path: '/cards', icon: CreditCard },
                  { label: 'Invest & Wealth Management', path: '/wealth', icon: ArrowRight },
                  { label: 'Fixed Deposits & Savings', path: '/deposits', icon: Landmark },
                  { label: 'E-Statements & Tax Certs', path: '/statements', icon: FileText },
                  { label: 'Premier Rewards & Privileges', path: '/rewards', icon: Gift },
                  { label: 'App Lock & 6-Digit MPIN', path: '/security', icon: KeyRound },
                  { label: 'Profile & Relationship Manager', path: '/settings', icon: User },
                  { label: '24/7 Phone Banking & Support', path: '/support', icon: HelpCircle },
                ].map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-left text-[14px] font-medium text-[#222222] hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <span>{item.label}</span>
                    <item.icon className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    lockApp();
                  }}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#1f1f1f] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#DB0011]" />
                  <span>Lock Session (MPIN Shield)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full py-2.5 px-4 text-[#D92D20] hover:bg-red-50 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Off HSBC India</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
