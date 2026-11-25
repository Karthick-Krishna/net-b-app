import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 650);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="HSBC India"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-3 text-center">
          <h1 className="text-lg font-bold tracking-tight text-[#1f1f1f]">
            HSBC India
          </h1>
          <p className="text-xs text-[#777777] font-medium mt-0.5">
            Personal Banking
          </p>
        </div>
      </div>
    </motion.div>
  );
};
