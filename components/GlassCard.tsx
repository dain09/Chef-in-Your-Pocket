import React, { memo } from 'react';
// FIX: Changed import to pull HTMLMotionProps for better typing
import { motion, HTMLMotionProps } from 'framer-motion';

// FIX: Updated GlassCardProps to use HTMLMotionProps which correctly includes animation props and standard element props.
type GlassCardProps = HTMLMotionProps<"div">;

const GlassCard = ({ children, className = '', ...rest }: GlassCardProps) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default memo(GlassCard);