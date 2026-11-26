import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, resolveValue } from 'react-hot-toast';
import { ShieldCheck, AlertCircle, Loader2, Info } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import { AppLockProvider } from './context/AppLockContext';
import { ActionFeedbackProvider } from './context/ActionFeedbackContext';
import { AppLayout } from './layouts/AppLayout';
import { SplashScreen } from './components/SplashScreen';

import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AccountsPage } from './pages/Accounts/AccountsPage';
import { TransactionsPage } from './pages/Transactions/TransactionsPage';
import { PaymentsPage } from './pages/Payments/PaymentsPage';
import { CardsPage } from './pages/Cards/CardsPage';
import { WealthPage } from './pages/Wealth/WealthPage';
import { DepositsPage } from './pages/Deposits/DepositsPage';
import { RewardsPage } from './pages/Rewards/RewardsPage';
import { InsurancePage } from './pages/Insurance/InsurancePage';
import { StatementsPage } from './pages/Statements/StatementsPage';
import { SecurityPage } from './pages/Security/SecurityPage';
import { SupportPage } from './pages/Support/SupportPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#F6F7F9] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#DB0011] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash once per session
    return !sessionStorage.getItem('hsbc_splash_shown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('hsbc_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="wealth" element={<WealthPage />} />
            <Route path="deposits" element={<DepositsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="insurance" element={<InsurancePage />} />
            <Route path="statements" element={<StatementsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BankingProvider>
          <AppLockProvider>
            <ActionFeedbackProvider>
              <Toaster position="top-center" gutter={8} toastOptions={{ duration: 3000 }}>
                {(t) => {
                  const accentClass =
                    t.type === 'error'
                      ? 'border-l-[#DB0011]'
                      : t.type === 'loading'
                      ? 'border-l-[#6B7280]'
                      : 'border-l-[#16864A]';
                  const headerLabel =
                    t.type === 'error'
                      ? 'Security & Validation Notice'
                      : t.type === 'loading'
                      ? 'Processing Request'
                      : 'HSBC India';
                  return (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`${
                        t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                      } transition-all duration-150 max-w-sm w-full bg-white text-[#1f1f1f] border border-gray-200 border-l-[3px] ${accentClass} shadow-lg rounded-2xl px-4 py-3 flex items-start gap-3 pointer-events-auto`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {t.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-[#DB0011]" aria-hidden="true" />
                        ) : t.type === 'loading' ? (
                          <Loader2 className="w-4 h-4 text-[#555555] animate-spin" aria-hidden="true" />
                        ) : t.type === 'success' ? (
                          <ShieldCheck className="w-4 h-4 text-[#16864A]" aria-hidden="true" />
                        ) : (
                          <Info className="w-4 h-4 text-[#1f1f1f]" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#777777]">
                          {headerLabel}
                        </div>
                        <div className="text-xs font-medium text-[#1f1f1f] mt-0.5 leading-snug">
                          {resolveValue(t.message, t)}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Toaster>
            <AppContent />
            </ActionFeedbackProvider>
          </AppLockProvider>
        </BankingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
