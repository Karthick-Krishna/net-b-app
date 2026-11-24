import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';
import { AppLockModal } from '../components/AppLockModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row text-[#222222]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      {/* App Lock PIN Modal (when locked) */}
      <AppLockModal />
    </div>
  );
};
