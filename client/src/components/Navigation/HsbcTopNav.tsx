import React, { useEffect, useState } from 'react';
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
  Lock,
  PiggyBank,
  Shield,
  Activity,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppLock } from '../../context/AppLockContext';
import { useActionFeedback } from '../../context/ActionFeedbackContext';

export const HsbcTopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { lockApp, resetAppLockToDefault } = useAppLock();
  const { requestAction } = useActionFeedback();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  // Active tab detection
  const isHome = location.pathname === '/';
  const isAccounts = location.pathname.startsWith('/accounts');
  const isPay = location.pathname.startsWith('/payments');
  const isCards = location.pathname.startsWith('/cards');
  const isInvest = location.pathname.startsWith('/wealth') || location.pathname.startsWith('/deposits');
  const isActivity = location.pathname.startsWith('/transactions') || location.pathname.startsWith('/statements');

  const mobileTabs = [
    { label: 'Pay', path: '/payments', active: isPay || location.pathname.startsWith('/transactions') },
    { label: 'Cards', path: '/cards', active: isCards },
    { label: 'Invest', path: '/wealth', active: isInvest },
  ];

  const desktopTabs = [
    { label: 'Overview', path: '/', active: isHome },
    { label: 'Accounts', path: '/accounts', active: isAccounts },
    { label: 'Pay', path: '/payments', active: isPay },
    { label: 'Cards', path: '/cards', active: isCards },
    { label: 'Invest', path: '/wealth', active: isInvest },
    { label: 'Activity', path: '/transactions', active: isActivity },
  ];

  return (
    <>
      {/* UNIFIED HSBC TOP NAVIGATION (Matches Mobile Cards UI + Expands Cleanly for Desktop) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 select-none pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-2">
          {/* Left: Mobile Home Icon + Divider | Desktop HSBC Logo + Divider */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-current={isHome ? 'page' : undefined}
              aria-label="Home"
              className={`min-w-[44px] min-h-[44px] -ml-1.5 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isHome ? 'text-[#DB0011]' : 'text-[#1f1f1f] hover:text-[#DB0011]'
              }`}
            >
              <Home className="w-[22px] h-[22px] stroke-[1.8]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="hidden md:flex items-center gap-2 ml-2 cursor-pointer"
            >
              <img src="/logo.png" alt="HSBC India" className="w-6 h-6 object-contain" />
              <span className="text-[15px] font-bold tracking-tight text-[#1f1f1f]">
                HSBC <span className="font-normal text-[#555555]">India</span>
              </span>
            </button>

            {/* Thin vertical separator matching reference UI */}
            <div className="h-6 w-[1.5px] bg-gray-200 mx-1.5 sm:mx-2.5 md:mx-4" aria-hidden="true" />
          </div>

          {/* Mobile Primary Navigation: Pay | Cards | Invest (Matches Screenshot) */}
          <nav aria-label="Primary mobile" className="flex md:hidden items-center gap-4 min-[375px]:gap-6 sm:gap-8 flex-1">
            {mobileTabs.map(tab => (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                aria-current={tab.active ? 'page' : undefined}
                className={`relative min-h-[44px] px-1 text-[15px] min-[375px]:text-[16px] font-semibold transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap ${
                  tab.active ? 'text-[#1f1f1f]' : 'text-[#333333] hover:text-[#DB0011]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.active && (
                  <motion.div
                    layoutId="mobileActiveTabUnderline"
                    className="absolute -bottom-[5px] left-0 right-0 h-[3px] bg-[#DB0011] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Primary Navigation: Overview | Accounts | Pay | Cards | Invest | Activity */}
          <nav aria-label="Primary desktop" className="hidden md:flex items-center gap-6 lg:gap-8 flex-1">
            {desktopTabs.map(tab => (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                aria-current={tab.active ? 'page' : undefined}
                className={`relative h-16 px-1 text-[14px] font-semibold transition-colors flex items-center cursor-pointer whitespace-nowrap ${
                  tab.active ? 'text-[#1f1f1f]' : 'text-[#555555] hover:text-[#DB0011]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.active && (
                  <motion.div
                    layoutId="desktopActiveTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Controls: Desktop Profile/Lock + Hamburger Menu [三] */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={lockApp}
              title="Lock Session (MPIN Shield)"
              aria-label="Lock Session"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-[#F2F4F7] hover:bg-gray-200 text-xs font-semibold text-[#1f1f1f] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
              <span>Lock</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="hidden lg:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 text-xs font-semibold text-[#1f1f1f] transition-colors cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-[#DB0011] text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser?.displayName?.[0] || 'K'}
              </span>
              <span className="max-w-[110px] truncate">{currentUser?.displayName?.split(' ')[0] || 'Karthick'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] -mr-1.5 flex items-center justify-center rounded-lg text-[#1f1f1f] hover:text-[#DB0011] transition-colors cursor-pointer"
              aria-label="Open HSBC Menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* SLIDE-OVER HSBC MENU DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="HSBC Navigation Menu">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto w-full max-w-sm bg-white h-dvh shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
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
                  aria-label="Close Menu"
                  className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-gray-500 hover:text-black rounded-full cursor-pointer"
                >
                  <X className="w-6 h-6 stroke-[1.8]" aria-hidden="true" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-5 bg-[#F6F7F9] border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#DB0011] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {currentUser?.displayName?.[0] || 'K'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#1f1f1f] truncate">
                      {currentUser?.displayName || 'Karthick Krishna'}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono truncate">
                      ID: {currentUser?.customerId || 'HSBC-882941'} • Premier
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Navigation Links */}
              <div className="p-3 flex-1 space-y-0.5">
                {[
                  { label: 'Home Overview', path: '/', icon: Home },
                  { label: 'My Accounts & Balances', path: '/accounts', icon: Landmark },
                  { label: 'Pay & Transfer Money', path: '/payments', icon: ArrowRight },
                  { label: 'Manage Cards & Limits', path: '/cards', icon: CreditCard },
                  { label: 'Transaction Activity', path: '/transactions', icon: Activity },
                  { label: 'Invest & Wealth Management', path: '/wealth', icon: ArrowRight },
                  { label: 'Fixed & Recurring Deposits', path: '/deposits', icon: PiggyBank },
                  { label: 'E-Statements & Tax Certs', path: '/statements', icon: FileText },
                  { label: 'Premier Rewards & Privileges', path: '/rewards', icon: Gift },
                  { label: 'Insurance & Protection', path: '/insurance', icon: Shield },
                  { label: 'App Lock & 6-Digit MPIN', path: '/security', icon: KeyRound },
                  { label: 'Profile & Settings', path: '/settings', icon: User },
                  { label: '24/7 Support & Concierge', path: '/support', icon: HelpCircle },
                ].map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(item.path);
                      }}
                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left text-[14px] font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        active
                          ? 'bg-red-50/70 text-[#DB0011] font-semibold'
                          : 'text-[#222222] hover:bg-[#F2F4F7] active:bg-gray-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      <item.icon className={`w-4 h-4 ${active ? 'text-[#DB0011]' : 'text-gray-400'}`} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-gray-100 space-y-2 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    lockApp();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-[#F2F4F7] hover:bg-gray-200 text-[#1f1f1f] text-xs font-bold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  <span>Lock Session (MPIN Shield)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    requestAction({
                      title: 'Reset App Lock?',
                      message: 'Reset your 6-digit App-Lock PIN back to default (002831) and clear any failed PIN attempts?',
                      confirmLabel: 'Yes, Reset App Lock',
                      tone: 'danger',
                      onConfirm: () => {
                        resetAppLockToDefault();
                        return {
                          title: 'App Lock Reset Complete',
                          message: 'App-Lock PIN reset to 002831 and lockouts cleared.',
                          icon: 'key',
                          relatedButtons: [
                            { label: 'Lock App Now', variant: 'secondary', onClick: () => lockApp() },
                          ],
                        };
                      },
                    });
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-white border border-[#333333] hover:bg-gray-50 text-[#1f1f1f] text-xs font-bold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                  <span>Reset App Lock</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 text-[#D92D20] hover:bg-red-50 text-xs font-bold rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
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
