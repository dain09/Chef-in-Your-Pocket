
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoadingIndicator: React.FC = () => {
  const { t } = useTranslation();
  // Cast to string[] to ensure type safety
  const loadingTips = t('loadingTips', { returnObjects: true }) as string[];
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loadingTips.length]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 sm:p-8 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white text-center">{t('chefIsCooking')}</h2>
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <motion.div
          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2.5 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 15, ease: 'linear' }}
        ></motion.div>
      </div>
      <div className="h-12 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            className="text-white/80 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {loadingTips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingIndicator;