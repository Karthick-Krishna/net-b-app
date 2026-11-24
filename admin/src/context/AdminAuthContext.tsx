import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'admin';
  assignedBranch: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEFAULT_SUPERADMIN: AdminUser = {
  uid: 'hsbc-admin-001',
  email: 'admin@hsbc.co.in',
  displayName: 'Rajesh Singhania (Chief Operations Officer)',
  role: 'superadmin',
  assignedBranch: 'Mumbai Main Branch, Fort (HQ)',
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('hsbc_admin_user');
    return saved ? JSON.parse(saved) : DEFAULT_SUPERADMIN;
  });

  const login = async (email: string, _password?: string) => {
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('hsbc')) {
      const user: AdminUser = {
        ...DEFAULT_SUPERADMIN,
        email,
      };
      setAdminUser(user);
      localStorage.setItem('hsbc_admin_user', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: 'Unauthorized. Administrative credentials required.' };
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('hsbc_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
