import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRecord } from '@shared/types';
import { RealtimeStore } from '@shared/realtimeStore';

interface AuthContextType {
  currentUser: UserRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchCustomer: (uid: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session or default to demo customer
    const savedUid = localStorage.getItem('premier_client_active_uid') || 'cust-karthick-8829';
    const user = RealtimeStore.getCustomerByUid(savedUid);
    if (user) {
      setCurrentUser(user);
    } else {
      const customers = RealtimeStore.getCustomers();
      if (customers.length > 0) {
        setCurrentUser(customers[0]);
        localStorage.setItem('premier_client_active_uid', customers[0].uid);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, _password?: string) => {
    setIsLoading(true);
    // Find customer by email or customerId
    const customers = RealtimeStore.getCustomers();
    const user = customers.find(
      c =>
        c.email.toLowerCase() === identifier.toLowerCase().trim() ||
        c.customerId.toLowerCase() === identifier.toLowerCase().trim()
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('premier_client_active_uid', user.uid);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid Customer ID or Password. (Use Demo 1-Click Login below)' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('premier_client_active_uid');
  };

  const switchCustomer = (uid: string) => {
    const user = RealtimeStore.getCustomerByUid(uid);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('premier_client_active_uid', user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        switchCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
