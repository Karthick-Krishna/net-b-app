import React from 'react';
import { Outlet } from 'react-router-dom';
import { HsbcTopNav } from '../components/Navigation/HsbcTopNav';
import { HsbcChatBar } from '../components/Navigation/HsbcChatBar';
import { AppLockModal } from '../components/AppLockModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-dvh bg-white md:bg-[#F6F7F9] text-[#1f1f1f] font-sans flex flex-col">
      {/* Unified HSBC India Top Navigation (Mobile Reference Header -> Desktop Expanded Header) */}
      <HsbcTopNav />

      {/* Main Responsive Content Workspace */}
      <main className="flex-1 w-full max-w-6xl mx-auto md:px-6 md:py-6">
        <Outlet />
      </main>

      {/* Bottom Floating Virtual Assistant Chat Bar */}
      <HsbcChatBar />

      {/* App Lock Overlay (MPIN Security Shield) */}
      <AppLockModal />
    </div>
  );
};
