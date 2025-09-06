import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ChevronRight, Loader, Home } from 'lucide-react';
import * as geminiService from '../services/geminiService';
import type { AcademyLesson } from '../types';
import Logo from './Logo';

const lessonCategories = [
    { en: 'Basic Knife Skills', ar: 'مهارات السكين الأساسية' },
    { en: 'How to Cook Perfect Pasta', ar: 'كيفية طهي المكرونة المثالية' },
    { en: 'Simple Meals for Expats', ar: 'وجبات بسيطة للمغتربين' },
    { en: 'Understanding Spices', ar: 'فهم البهارات' },
];

const ChefsAcademyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLessonClick = useCallback(async (category: string) => {
    setIsLoading(true);
    setSelectedLesson(null);
    try {
        const lesson = await geminiService.generateAcademyLesson(category);
        if (lesson) {
            setSelectedLesson(lesson);
        } else {
            // Handle error case, maybe show a toast
        }
    } catch (error) {
        console.error("Failed to load lesson:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-stone-100 font-sans">
      <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-3">
          <Logo className="w-12 h-12 text-amber-300" />
          <span className="font-bold text-xl hidden sm:block">{t('appName')}</span>
        </a>
        <a href="/" className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg hover:bg-black/30">
          <Home size={20} />
          <span className="hidden sm:block">{t('Back to Main App')}</span>
        </a>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6">
            <GraduationCap size={48} className="mx-auto text-amber-400" />
            <h1 className="mt-2 text-3xl font-bold text-stone-100">{t('chefsAcademy')}</h1>
            <p className="mt-1 text-stone-100/70">{t('academy.description')}</p>
        </div>
        
        <div className="w-full max-w-4xl flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/30 backdrop-blur-lg border border-amber-300/10 shadow-lg rounded-2xl p-6">
            <div className="bg-black/20 rounded-lg p-4 space-y-3 overflow-y-auto custom-scrollbar">
                <h3 className="font-semibold text-amber-300 [dir='rtl']:text-right">{t('academy.lessonsTitle')}</h3>
                {lessonCategories.map((cat, index) => (
                    <motion.button
                        key={index}
                        className="w-full text-start p-3 bg-black/30 rounded-lg hover:bg-black/40 flex justify-between items-center"
                        onClick={() => handleLessonClick(cat.en)}
                        whileHover={{ y: -2 }}
                    >
                        <span>{cat[langKey]}</span>
                        <div className="[dir='rtl']:-scale-x-100">
                            <ChevronRight className="flex-shrink-0 text-amber-300/70" />
                        </div>
                    </motion.button>
                ))}
            </div>
            <div className="bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar min-w-0">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loader" className="flex items-center justify-center h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <Loader className="animate-spin text-amber-400" size={48} />
                        </motion.div>
                    ) : selectedLesson ? (
                        <motion.div
                            key={selectedLesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pb-4" // Padding bottom to prevent text from being cut off
                        >
                            <h3 className="text-xl font-bold text-amber-300 break-words [dir='rtl']:text-right">{selectedLesson.title[langKey]}</h3>
                            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-sm text-stone-100/70 my-2 [dir='rtl']:text-right">
                                <span><strong>{t('academy.difficultyLabel')}:</strong> {t(`difficulty.${selectedLesson.difficulty}` as const, selectedLesson.difficulty)}</span>
                                <span><strong>{t('academy.durationLabel')}:</strong> {selectedLesson.duration[langKey]}</span>
                            </div>
                            <p className="whitespace-pre-wrap text-stone-100 break-words [dir='rtl']:text-right [dir='rtl']:leading-loose">{selectedLesson.content[langKey]}</p>
                        </motion.div>
                    ) : (
                         <motion.div key="placeholder" className="flex items-center justify-center h-full text-center text-stone-100/60" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <p>{t('academy.selectPrompt')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ChefsAcademyPage;