import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ShieldAlert, Fingerprint } from 'lucide-react';
import { useAppLock } from '../context/AppLockContext';

export const AppLockModal: React.FC = () => {
  const { isLocked, verifyPin, failedAttempts, lockedUntil } = useAppLock();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 6) {
        setTimeout(() => {
          const res = verifyPin(nextPin);
          if (!res.success) {
            setErrorMsg(res.message || 'Incorrect PIN entered.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleTouchUnlock = () => {
    verifyPin('123456');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
        >
          {/* Logo Symbol */}
          <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="HSBC" className="w-full h-full object-contain" />
          </div>

          <h3 className="text-lg font-bold text-[#252525] tracking-tight">
            HSBC Security Lock
          </h3>
          <p className="text-xs text-[#777777] mt-1">
            Enter your 6-digit PIN to access your accounts
          </p>

          {/* PIN Indicators */}
          <div className="flex justify-center gap-3 my-6">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                  i < pin.length
                    ? 'bg-[#DB0011] border-[#DB0011] scale-110'
                    : 'border-gray-300 bg-gray-50'
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 text-xs text-[#D92D20] font-semibold bg-red-50 p-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-red-200">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-[#252525] text-xl font-bold transition-all shadow-xs flex items-center justify-center"
              >
                {key}
              </button>
            ))}
            <button
              onClick={handleTouchUnlock}
              className="h-14 rounded-2xl bg-red-50 hover:bg-red-100 text-[#DB0011] text-[10px] font-bold transition-all flex flex-col items-center justify-center leading-tight"
              title="Instant Touch ID"
            >
              <Fingerprint className="w-5 h-5 mb-0.5" />
              <span>Touch ID</span>
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              className="h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-[#252525] text-xl font-bold transition-all shadow-xs flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-base font-semibold transition-all shadow-xs flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Demonstration Hint */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
            Default Demo PIN: <strong className="font-mono text-gray-700">123456</strong>
            {failedAttempts > 0 && (
              <div className="text-[10px] text-red-500 font-semibold mt-1">
                Failed Attempts: {failedAttempts}/5
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
