import React from 'react';
import { motion, MotionProps } from 'framer-motion';

// Fix: Updated GlassCardProps to accept all MotionProps.
// This allows passing 'initial', 'animate', 'exit', and other motion-related props to the underlying motion.div.
type GlassCardProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
};

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...rest }) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
