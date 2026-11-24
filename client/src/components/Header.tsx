import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { useAppLock } from '../context/AppLockContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { hideBalances, toggleBalanceVisibility, notifications, markNotificationAsRead } = useBanking();
  const { lockApp, appLockEnabled } = useAppLock();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E8] shadow-xs">
      {/* Top Security & Regulatory Bar */}
      <div className="bg-[#B0000D] text-white text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">
          HSBC India Personal Internet Banking — Demonstration Application
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity on Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="HSBC India"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-extrabold text-[#252525] tracking-tight text-base block leading-none">
                HSBC
              </span>
              <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block mt-0.5">
                India
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Welcome info */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-sm font-bold text-[#252525]">
              Welcome, {currentUser?.displayName || 'Customer'}
            </div>
            <div className="text-xs text-[#777777] flex items-center gap-2">
              <span>Customer ID: <strong className="text-gray-900 font-mono">{currentUser?.customerId}</strong></span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-50 text-[#16864A] text-[10px] font-semibold rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5" /> KYC Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hide/Show Sensitive Balances */}
          <button
            onClick={toggleBalanceVisibility}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
            title={hideBalances ? 'Show sensitive balances' : 'Hide sensitive balances'}
          >
            {hideBalances ? (
              <>
                <EyeOff className="w-4 h-4 text-[#DB0011]" />
                <span className="hidden sm:inline">Show Balance</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">Hide Balance</span>
              </>
            )}
          </button>

          {/* Quick App-Lock button if enabled */}
          {appLockEnabled && (
            <button
              onClick={lockApp}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
              title="Lock Screen"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Help link */}
          <button
            onClick={() => navigate('/support')}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
            title="Help & Contact"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DB0011] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Notifications ({unreadCount} new)
                  </h4>
                  <span className="text-[11px] text-[#DB0011] font-semibold cursor-pointer">
                    Clear all
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.notificationId}
                        onClick={() => markNotificationAsRead(n.notificationId)}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-red-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#DB0011] mt-1.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-900">{n.title}</div>
                            <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</div>
                            <div className="text-[10px] text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-[#DB0011] text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.displayName?.slice(0, 2).toUpperCase() || 'HS'}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-900">{currentUser?.displayName}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{currentUser?.customerId}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{currentUser?.email}</div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/security');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> Security & App-Lock
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/support');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" /> Customer Concierge
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#DB0011] hover:bg-red-50 flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
