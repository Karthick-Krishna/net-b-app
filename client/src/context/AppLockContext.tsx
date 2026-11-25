import React, { createContext, useContext, useState, useEffect } from 'react';
import { RealtimeStore } from '@shared/realtimeStore';
import { useAuth } from './AuthContext';

interface AppLockContextType {
  isLocked: boolean;
  appLockEnabled: boolean;
  failedAttempts: number;
  remainingAttempts: number;
  lockedUntil: string | null;
  autoLockTimeout: number; // in minutes
  biometricsEnabled: boolean;
  verifyPin: (pin: string) => { success: boolean; message?: string };
  enableAppLock: (pin: string) => void;
  disableAppLock: () => void;
  changeMpin: (currentPin: string, newPin: string) => { success: boolean; message?: string };
  resetMpin: (newPin: string) => { success: boolean; message?: string };
  resetAppLockToDefault: () => void;
  setAutoLockTimeout: (mins: number) => void;
  setBiometricsEnabled: (enabled: boolean) => void;
  lockApp: () => void;
  unlockApp: () => void;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [appLockEnabled, setAppLockEnabled] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(5);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [autoLockTimeout, setAutoLockTimeoutState] = useState<number>(() => {
    return parseInt(localStorage.getItem('hsbc_autolock_timeout') || '3', 10);
  });
  const [biometricsEnabled, setBiometricsEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('hsbc_biometrics_enabled') !== 'false';
  });

  const setAutoLockTimeout = (mins: number) => {
    setAutoLockTimeoutState(mins);
    localStorage.setItem('hsbc_autolock_timeout', mins.toString());
  };

  const setBiometricsEnabled = (enabled: boolean) => {
    setBiometricsEnabledState(enabled);
    localStorage.setItem('hsbc_biometrics_enabled', enabled ? 'true' : 'false');
  };

  const loadLockState = () => {
    if (!currentUser) return;
    const sec = RealtimeStore.getAppLock(currentUser.uid);
    setAppLockEnabled(sec.appLockEnabled);
    setFailedAttempts(sec.failedAttempts);
    setRemainingAttempts(Math.max(0, 5 - sec.failedAttempts));
    setLockedUntil(sec.lockedUntil || null);

    if (sec.appLockEnabled && !sessionStorage.getItem('hsbc_session_unlocked')) {
      setIsLocked(true);
    }
  };

  useEffect(() => {
    loadLockState();

    const unsub = RealtimeStore.onSync(msg => {
      if (msg.type === 'APPLOCK_UPDATED') {
        loadLockState();
      }
    });

    return () => unsub();
  }, [currentUser]);

  // Inactivity auto-lock based on configured timeout
  useEffect(() => {
    if (!appLockEnabled || isLocked) return;

    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.removeItem('hsbc_session_unlocked');
        setIsLocked(true);
      }, autoLockTimeout * 60 * 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [appLockEnabled, isLocked, autoLockTimeout]);

  const verifyPin = (pin: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    const res = RealtimeStore.verifyAppLockPin(currentUser.uid, pin);
    setFailedAttempts(5 - res.remainingAttempts);
    setRemainingAttempts(res.remainingAttempts);

    if (res.verified) {
      sessionStorage.setItem('hsbc_session_unlocked', 'true');
      setIsLocked(false);
      return { success: true };
    } else {
      if (res.lockedOut) {
        return { success: false, message: 'Maximum attempts exceeded. Account security lock active.' };
      }
      return { success: false, message: `Incorrect PIN. ${res.remainingAttempts} attempts remaining.` };
    }
  };

  const enableAppLock = (pin: string) => {
    if (!currentUser) return;
    RealtimeStore.setAppLockPin(currentUser.uid, pin);
    setAppLockEnabled(true);
    sessionStorage.setItem('hsbc_session_unlocked', 'true');
  };

  const disableAppLock = () => {
    if (!currentUser) return;
    RealtimeStore.adminResetAppLock('self', currentUser.email, currentUser.uid, 'User disabled App-Lock');
    setAppLockEnabled(false);
    setIsLocked(false);
    sessionStorage.removeItem('hsbc_session_unlocked');
  };

  const changeMpin = (currentPin: string, newPin: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    const check = verifyPin(currentPin);
    if (!check.success) {
      return { success: false, message: 'Current MPIN is incorrect' };
    }
    enableAppLock(newPin);
    return { success: true };
  };

  const resetMpin = (newPin: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    enableAppLock(newPin);
    return { success: true };
  };

  const resetAppLockToDefault = () => {
    if (!currentUser) return;
    RealtimeStore.setAppLockPin(currentUser.uid, '002831');
    setAppLockEnabled(true);
    setFailedAttempts(0);
    setRemainingAttempts(5);
    setLockedUntil(null);
    sessionStorage.setItem('hsbc_session_unlocked', 'true');
    setIsLocked(false);
  };

  const lockApp = () => {
    sessionStorage.removeItem('hsbc_session_unlocked');
    setIsLocked(true);
  };

  const unlockApp = () => {
    sessionStorage.setItem('hsbc_session_unlocked', 'true');
    setIsLocked(false);
  };

  return (
    <AppLockContext.Provider
      value={{
        isLocked,
        appLockEnabled,
        failedAttempts,
        remainingAttempts,
        lockedUntil,
        autoLockTimeout,
        biometricsEnabled,
        verifyPin,
        enableAppLock,
        disableAppLock,
        changeMpin,
        resetMpin,
        resetAppLockToDefault,
        setAutoLockTimeout,
        setBiometricsEnabled,
        lockApp,
        unlockApp,
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = () => {
  const context = useContext(AppLockContext);
  if (!context) throw new Error('useAppLock must be used within an AppLockProvider');
  return context;
};
