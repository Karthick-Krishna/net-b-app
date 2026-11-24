import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<void>;
  biometricLogin: () => Promise<void>;
  register: (data: any) => Promise<string>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('premier_access_token');
      if (token) {
        const res = await api.getCurrentUser();
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session expired or offline:', err);
      localStorage.removeItem('premier_access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password?: string) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem('premier_access_token', res.accessToken);
    localStorage.setItem('premier_refresh_token', res.refreshToken);
    localStorage.setItem('premier_remembered_id', identifier);
    setUser(res.user);
  };

  const biometricLogin = async () => {
    const rememberedId = localStorage.getItem('premier_remembered_id') || 'premier_user';
    const res = await api.login({ identifier: rememberedId, isBiometric: true });
    localStorage.setItem('premier_access_token', res.accessToken);
    localStorage.setItem('premier_refresh_token', res.refreshToken);
    setUser(res.user);
  };

  const register = async (userData: any): Promise<string> => {
    const res = await api.register(userData);
    return res.customer_id;
  };

  const logout = () => {
    localStorage.removeItem('premier_access_token');
    localStorage.removeItem('premier_refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, biometricLogin, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
