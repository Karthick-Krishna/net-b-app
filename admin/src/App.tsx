import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminStoreProvider } from './context/AdminStoreContext';
import { AdminLayout } from './layouts/AdminLayout';

import { AdminLoginPage } from './pages/Login/AdminLoginPage';
import { AdminDashboardPage } from './pages/Dashboard/AdminDashboardPage';
import { BalanceAdjustmentPage } from './pages/Balances/BalanceAdjustmentPage';
import { TransactionsAdminPage } from './pages/Transactions/TransactionsAdminPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { AccountsManagementPage } from './pages/Accounts/AccountsManagementPage';
import { CardsAdminPage } from './pages/Cards/CardsAdminPage';
import { AppLockAdminPage } from './pages/Security/AppLockAdminPage';
import { AuditLogsPage } from './pages/AuditLogs/AuditLogsPage';
import { SupportTicketsAdminPage } from './pages/Support/SupportTicketsAdminPage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminStoreProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="balances" element={<BalanceAdjustmentPage />} />
              <Route path="transactions" element={<TransactionsAdminPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="accounts" element={<AccountsManagementPage />} />
              <Route path="cards" element={<CardsAdminPage />} />
              <Route path="security" element={<AppLockAdminPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="support" element={<SupportTicketsAdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AdminStoreProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
