import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, resolveValue } from 'react-hot-toast';
import { ShieldCheck, AlertCircle, Loader2, Info } from 'lucide-react';
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
import { ServiceRequestsPage } from './pages/Requests/ServiceRequestsPage';
import { WealthAdminPage } from './pages/Wealth/WealthAdminPage';
import { RewardsAdminPage } from './pages/Rewards/RewardsAdminPage';
import { AdminSettingsPage } from './pages/Settings/AdminSettingsPage';

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
          <Toaster position="top-right" gutter={8} toastOptions={{ duration: 3500 }}>
            {(t) => (
              <div
                role="status"
                aria-live="polite"
                className={`${
                  t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                } transition-all duration-150 max-w-sm w-full bg-white text-[#1f1f1f] border border-gray-200 border-l-[3px] ${
                  t.type === 'error'
                    ? 'border-l-[#DB0011]'
                    : t.type === 'loading'
                    ? 'border-l-[#6B7280]'
                    : 'border-l-[#16864A]'
                } shadow-lg rounded-[2px] px-4 py-3 flex items-start gap-3 pointer-events-auto`}
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
                    {t.type === 'error' ? 'HSBC Operations Alert' : 'HSBC Operations Console'}
                  </div>
                  <div className="text-xs font-medium text-[#1f1f1f] mt-0.5 leading-snug">
                    {resolveValue(t.message, t)}
                  </div>
                </div>
              </div>
            )}
          </Toaster>
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
              <Route path="requests" element={<ServiceRequestsPage />} />
              <Route path="wealth" element={<WealthAdminPage />} />
              <Route path="rewards" element={<RewardsAdminPage />} />
              <Route path="security" element={<AppLockAdminPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="support" element={<SupportTicketsAdminPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AdminStoreProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
