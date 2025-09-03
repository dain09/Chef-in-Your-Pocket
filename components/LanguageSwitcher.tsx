import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { audioService } from '../services/audioService';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    audioService.playClick();
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const currentLangDisplay = i18n.language === 'ar' ? 'EN' : 'ع';

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-900 font-semibold hover:bg-pink-500/30 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${i18n.language === 'ar' ? 'English' : 'Arabic'}`}
    >
      <Languages size={20} />
      <span>{currentLangDisplay}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;