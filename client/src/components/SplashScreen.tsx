import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'logo' | 'loading' | 'exit'>('initial');

  useEffect(() => {
    // Stage 1 -> Stage 2: Logo scale & fade (600ms)
    const t1 = setTimeout(() => {
      setStage('logo');
    }, 200);

    // Stage 2 -> Stage 3: Loading animation
    const t2 = setTimeout(() => {
      setStage('loading');
    }, 900);

    // Stage 3 -> Exit
    const t3 = setTimeout(() => {
      setStage('exit');
    }, 1800);

    const t4 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={
              stage === 'initial'
                ? { scale: 0.85, opacity: 0 }
                : { scale: 1, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }
            className="flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="HSBC India"
                className="w-full h-full object-contain"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={
                stage === 'loading' || stage === 'logo'
                  ? { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }
                  : { opacity: 0, y: 10 }
              }
              className="mt-4 text-center"
            >
              <h1 className="text-xl font-bold tracking-tight text-[#252525]">
                HSBC India
              </h1>
              <p className="text-xs text-[#777777] font-medium tracking-wide mt-0.5">
                Mobile Banking & Wealth
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom subtle progress line */}
          <div className="absolute bottom-16 w-32 h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={
                stage === 'loading'
                  ? { x: '100%', transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' } }
                  : { x: '-100%' }
              }
              className="w-full h-full bg-[#DB0011] rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
