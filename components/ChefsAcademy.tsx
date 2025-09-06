import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import { GraduationCap, X, ChevronRight, Loader } from 'lucide-react';
import * as geminiService from '../services/geminiService';
import type { AcademyLesson } from '../types';

interface ChefsAcademyProps {
    onClose: () => void;
}

const lessonCategories = [
    { en: 'Basic Knife Skills', ar: 'مهارات السكين الأساسية' },
    { en: 'How to Cook Perfect Pasta', ar: 'كيفية طهي المكرونة المثالية' },
    { en: 'Simple Meals for Expats', ar: 'وجبات بسيطة للمغتربين' },
    { en: 'Understanding Spices', ar: 'فهم البهارات' },
];

const ChefsAcademy: React.FC<ChefsAcademyProps> = ({ onClose }) => {
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
     <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-2xl h-[90vh] p-6 flex flex-col gap-4 relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button onClick={onClose} className="absolute top-4 end-4 p-1 text-amber-300/70 hover:text-amber-200 z-10">
          <X size={24} />
        </button>
        
        <div className="text-center">
            <GraduationCap size={40} className="mx-auto text-amber-400" />
            <h2 className="mt-2 text-2xl font-bold text-stone-100">{t('chefsAcademy')}</h2>
            <p className="mt-1 text-stone-100/70">{t('academy.description')}</p>
        </div>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-amber-300">{t('academy.lessonsTitle')}</h3>
                {lessonCategories.map((cat, index) => (
                    <motion.button
                        key={index}
                        className="w-full text-start p-3 bg-black/30 rounded-lg hover:bg-black/40 flex justify-between items-center"
                        onClick={() => handleLessonClick(cat.en)}
                        whileHover={{ y: -2 }}
                    >
                        <span>{cat[langKey]}</span>
                        <ChevronRight className="flex-shrink-0 text-amber-300/70" />
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
                        >
                            <h3 className="text-xl font-bold text-amber-300 break-words">{selectedLesson.title[langKey]}</h3>
                            <div className="flex gap-4 text-sm text-stone-100/70 my-2">
                                <span><strong>{t('academy.difficultyLabel')}:</strong> {t(`difficulty.${selectedLesson.difficulty}` as const, selectedLesson.difficulty)}</span>
                                <span><strong>{t('academy.durationLabel')}:</strong> {selectedLesson.duration[langKey]}</span>
                            </div>
                            <p className="whitespace-pre-wrap text-stone-100 break-words">{selectedLesson.content[langKey]}</p>
                        </motion.div>
                    ) : (
                         <motion.div key="placeholder" className="flex items-center justify-center h-full text-center text-stone-100/60" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <p>{t('academy.selectPrompt')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ChefsAcademy;