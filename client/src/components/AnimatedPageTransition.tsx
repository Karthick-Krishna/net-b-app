import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedPageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.94 }}
      animate={{ opacity: 1, transition: { duration: 0.14, ease: 'easeOut' } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
