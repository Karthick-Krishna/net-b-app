import React, { useState } from 'react';
import { Lock, Delete, ShieldAlert, Fingerprint } from 'lucide-react';
import { useAppLock } from '../context/AppLockContext';

export const AppLockModal: React.FC = () => {
  const { isLocked, verifyPin, failedAttempts, remainingAttempts, lockedUntil } = useAppLock();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      // Auto-submit on 6 digits
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

  const handleDemoUnlock = () => {
    verifyPin('123456');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Shield Icon */}
        <div className="w-14 h-14 bg-red-50 text-[#DB0011] rounded-full mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Application Security Lock
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Enter your 6-digit Premier Security PIN to continue
        </p>

        {/* PIN Circles */}
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
          <div className="mb-4 text-xs text-[#D92D20] font-medium bg-red-50 p-2 rounded-lg flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Locked out warning */}
        {lockedUntil && (
          <div className="mb-4 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
            Account temporarily locked due to excessive failed attempts. Please contact Administrator for unlock.
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-14 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-900 text-xl font-bold transition-all shadow-xs flex items-center justify-center select-none"
            >
              {key}
            </button>
          ))}
          <button
            onClick={handleDemoUnlock}
            className="h-14 rounded-xl bg-red-50 hover:bg-red-100 text-[#DB0011] text-[11px] font-bold transition-all flex flex-col items-center justify-center leading-tight select-none"
            title="Fast Demo Bypass"
          >
            <Fingerprint className="w-5 h-5 mb-0.5" />
            <span>Touch ID</span>
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-900 text-xl font-bold transition-all shadow-xs flex items-center justify-center select-none"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 text-base font-semibold transition-all shadow-xs flex items-center justify-center select-none"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Demonstration Hint */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          Demo Default PIN: <span className="font-mono font-bold text-gray-700">123456</span>
          {failedAttempts > 0 && (
            <div className="text-[10px] text-gray-500 mt-1">
              Failed Attempts: {failedAttempts}/5
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
