import React from 'react';
import { Outlet } from 'react-router-dom';
import { HsbcTopNav } from '../components/Navigation/HsbcTopNav';
import { HsbcChatBar } from '../components/Navigation/HsbcChatBar';
import { AppLockModal } from '../components/AppLockModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex justify-center text-[#1f1f1f] font-sans">
      {/* Mobile-First Authentic HSBC India Device Container */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col justify-between shadow-2xl relative">
        {/* Top Header Navigation: [Home] | Pay | Cards | Invest | [Menu] */}
        <HsbcTopNav />

        {/* Main Viewport Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Bottom Floating Virtual Assistant Chat Bar: [Messages] [Start chat 🎙] [→] */}
        <HsbcChatBar />

        {/* App Lock Overlay (MPIN Security Shield) */}
        <AppLockModal />
      </div>
    </div>
  );
};
