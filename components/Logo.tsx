import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className }: { className?: string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sparkleVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        // FIX: Added `as const` to ensure TypeScript infers 'spring' as a literal type, not a generic string.
        type: 'spring' as const,
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }
    },
    twinkle: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        // FIX: Added `as const` to ensure TypeScript infers 'easeInOut' as a literal type.
        ease: 'easeInOut' as const,
      },
    },
  };
  
  const hatPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 1,
            // FIX: Added `as const` to ensure TypeScript infers 'easeInOut' as a literal type.
            ease: 'easeInOut' as const,
        }
    }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Animated logo of a chef hat with a sparkling star"
    >
        {/* Chef Hat */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <motion.path
            d="M30 60 C 20 45, 20 25, 35 20 C 45 15, 55 15, 65 20 C 80 25, 80 45, 70 60 C 75 65, 65 70, 50 70 C 35 70, 25 65, 30 60 Z"
            fill="white"
            stroke="#BE185D" // pink-700
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={hatPathVariants}
          />
          <motion.path
            d="M28 70 H 72 V 80 H 28 Z"
            fill="#DB2777" // pink-600
            stroke="#BE185D"
            strokeWidth="3.5"
            variants={hatPathVariants}
          />
        </motion.g>
        
        {/* Magic Sparkle */}
        <motion.path
          d="M75 25 L77 30 L82 32 L77 34 L75 39 L73 34 L68 32 L73 30 Z"
          fill="#FBBF24" // amber-400
          variants={sparkleVariants}
          animate={['visible', 'twinkle']}
        />
    </motion.svg>
  );
};

export default memo(Logo);