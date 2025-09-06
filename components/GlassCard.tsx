import React from 'react';
import { motion, MotionProps } from 'framer-motion';

type GlassCardProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
};

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...rest }) => {
  return (
    <motion.div
      className={`bg-black/30 backdrop-blur-lg border border-amber-300/10 shadow-lg rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
