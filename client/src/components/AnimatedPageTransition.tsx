import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedPageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.18, ease: 'easeIn' } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
