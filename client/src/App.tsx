import React from 'react';
import { useAuth } from './context/AuthContext';
import { useBanking } from './context/BankingContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ReceiptModal } from './components/ReceiptModal';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/AccountsPage';
import { TransfersPage } from './pages/TransfersPage';
import { CardsPage } from './pages/CardsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { DepositsPage } from './pages/DepositsPage';
import { LoansPage } from './pages/LoansPage';
import { InternationalPage } from './pages/InternationalPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SecurityPage } from './pages/SecurityPage';
import { SupportPage } from './pages/SupportPage';
import { LocatorPage } from './pages/LocatorPage';
import { AdminPage } from './pages/AdminPage';

export const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeTab, viewportMode } = useBanking();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-12 h-12 rounded-xl bg-[#DB0011] flex items-center justify-center text-white animate-pulse mb-3">
          <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current">
            <polygon points="50,10 90,32 90,68 50,90 10,68 10,32" />
            <polygon points="50,28 72,40 72,60 50,72 28,60 28,40" fill="#FFFFFF" />
            <polygon points="50,38 62,44 62,56 50,62 38,56 38,44" fill="#DB0011" />
          </svg>
        </div>
        <p className="text-xs font-bold text-zinc-800 tracking-wide">SECURE PREMIER BANKING</p>
        <span className="text-[10px] text-zinc-400 mt-0.5">Initializing Core Ledger Gateway...</span>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return <AuthPage />;
  }

  // Admin View
  if (viewportMode === 'admin' || (user.role !== 'USER' && activeTab === 'admin')) {
    return <AdminPage />;
  }

  // Main Customer Experience
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'payments':
        return <TransfersPage />;
      case 'cards':
        return <CardsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'history':
        return <HistoryPage />;
      case 'deposits':
        return <DepositsPage />;
      case 'loans':
        return <LoansPage />;
      case 'intl':
        return <InternationalPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'security':
        return <SecurityPage />;
      case 'support':
        return <SupportPage />;
      case 'locator':
        return <LocatorPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-bank-bg relative">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {renderActiveScreen()}
      </div>
      <BottomNav />
      <ReceiptModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MobileFrame>
      <AppContent />
    </MobileFrame>
  );
};
