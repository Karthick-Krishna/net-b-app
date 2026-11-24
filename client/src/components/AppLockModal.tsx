import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppLock } from '../context/AppLockContext';
import { PinLoginScreen } from './PinLoginScreen';

export const AppLockModal: React.FC = () => {
  const { isLocked, unlockApp } = useAppLock();

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-white"
      >
        <PinLoginScreen isModal onSuccess={unlockApp} />
      </motion.div>
    </AnimatePresence>
  );
};
