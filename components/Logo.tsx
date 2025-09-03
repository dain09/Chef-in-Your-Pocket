
import React from 'react';
import { motion, Variants } from 'framer-motion';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  const svgVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const puffVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 1.2,
        ease: 'easeInOut',
      },
    },
  };

  const smileVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      aria-label="Smiling Chef Hat Logo"
    >
      <defs>
        <linearGradient id="hatGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FECACA" /> {/* Light Pink */}
          <stop offset="100%" stopColor="#F97316" /> {/* Vibrant Orange */}
        </linearGradient>
      </defs>
      
      {/* Puffy Top part */}
      <motion.path
        d="M78.5 43.5C86 43.5 90 35.5 86.5 29.5C83 23.5 76.5 25 73 28C73 21 68 15 60.5 15C53 15 47.5 21.5 47.5 28C43.5 25 37 23.5 33.5 29.5C30 35.5 34.5 43.5 41.5 43.5"
        fill="white"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={puffVariants}
      />

      {/* Hat Base */}
      <path
        d="M25 85V75C25 61.19 36.19 50 50 50C63.81 50 75 61.19 75 75V85H25Z"
        fill="url(#hatGradient)"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Smile on the base */}
      <motion.path
        d="M40 70C43.33 75 56.67 75 60 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={smileVariants}
      />
    </motion.svg>
  );
};

export default Logo;