
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-pink-400 to-orange-300 flex flex-col justify-center items-center z-50 p-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      <Logo className="w-24 h-24 text-white" />
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 }}}
      >
        {t('appName')}
      </motion.h1>
    </motion.div>
  );
};

export default SplashScreen;
