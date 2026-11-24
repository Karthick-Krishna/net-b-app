import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import { AppLockProvider } from './context/AppLockContext';
import { AppLayout } from './layouts/AppLayout';

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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#DB0011] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BankingProvider>
          <AppLockProvider>
            <Toaster position="top-right" />
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
                <Route path="support" element={<SupportPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AppLockProvider>
        </BankingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
