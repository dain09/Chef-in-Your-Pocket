import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { audioService } from '../services/audioService';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction on component mount
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  const toggleLanguage = () => {
    audioService.playClick();
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang).then(() => {
        document.documentElement.lang = newLang;
        document.documentElement.dir = i18n.dir(newLang);
    });
  };

  const currentLangDisplay = i18n.language === 'ar' ? 'EN' : 'ع';

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-black/20 border border-amber-300/10 rounded-lg text-stone-100/80 font-semibold hover:bg-black/40 transition-colors"
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