import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ChevronRight, Loader, Home } from 'lucide-react';
import * as geminiService from '../services/geminiService';
import type { AcademyLesson } from '../types';
import Logo from './Logo';
import Footer from './Footer';

const lessonCategories = [
    { en: 'Basic Knife Skills', ar: 'مهارات السكين الأساسية' },
    { en: 'How to Cook Perfect Pasta', ar: 'كيفية طهي المكرونة المثالية' },
    { en: 'Simple Meals for One', ar: 'وجبات بسيطة لشخص واحد' },
    { en: 'Understanding Spices', ar: 'فهم عالم البهارات' },
    { en: 'The Art of Sautéing', ar: 'فن التشويح (السوتيه)' },
    { en: 'Mastering Egg Cooking', ar: 'إتقان طهي البيض' },
    { en: 'Simple Sauces for Everything', ar: 'صلصات بسيطة لكل شيء' },
    { en: 'How to Read a Recipe', ar: 'كيف تقرأ وصفة طعام' },
    { en: 'Kitchen Safety Basics', ar: 'أساسيات السلامة في المطبخ' },
    { en: 'Grilling for Beginners', ar: 'الشوي للمبتدئين' },
    { en: 'Introduction to Baking', ar: 'مقدمة في عالم الخبز' },
    { en: 'Making Great Salads', ar: 'تحضير سلطات رائعة' },
    { en: 'Secrets to Perfect Rice', ar: 'أسرار الأرز المثالي' },
    { en: 'Soups from Scratch', ar: 'شوربات من الصفر' },
];

const ChefsAcademyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (lng: string | undefined) => {
        if (lng) {
            const direction = i18n.dir(lng);
            document.documentElement.lang = lng;
            document.documentElement.dir = direction;
            document.title = `${t('chefsAcademy')} | ${t('appName')}`;
        }
    };
    handleLanguageChange(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
        i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, t]);

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

      <main className="flex-grow flex flex-col items-center p-4">
        <div className="text-center mb-6">
            <GraduationCap size={48} className="mx-auto text-amber-400" />
            <h1 className="mt-2 text-3xl font-bold text-stone-100">{t('chefsAcademy')}</h1>
            <p className="mt-1 text-stone-100/70">{t('academy.description')}</p>
        </div>
        
        <div className="w-full max-w-4xl flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/30 backdrop-blur-lg border border-amber-300/10 shadow-lg rounded-2xl p-6 min-h-[60vh]">
            <div className="bg-black/20 rounded-lg p-4 space-y-3 overflow-y-auto custom-scrollbar">
                <h3 className="font-semibold text-amber-300 text-start">{t('academy.lessonsTitle')}</h3>
                {lessonCategories.map((cat, index) => (
                    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
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
                        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                        <motion.div key="loader" className="flex items-center justify-center h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <Loader className="animate-spin text-amber-400" size={48} />
                        </motion.div>
                    ) : selectedLesson ? (
                        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                        <motion.div
                            key={selectedLesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pb-4 space-y-6"
                        >
                            <div className="text-start">
                                <h3 className="text-xl font-bold text-amber-300 break-words">{selectedLesson.title[langKey]}</h3>
                                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-sm text-stone-100/70 my-2">
                                    {/* FIX: Correct usage of the t function with a dynamic key to prevent type errors. */}
                                    <span><strong>{t('academy.difficultyLabel')}:</strong> {t(`difficulty.${selectedLesson.difficulty}`)}</span>
                                    <span><strong>{t('academy.durationLabel')}:</strong> {selectedLesson.duration[langKey]}</span>
                                </div>
                            </div>

                            <p className="whitespace-pre-wrap text-stone-100 text-start [dir='rtl']:leading-loose">{selectedLesson.content.introduction[langKey]}</p>

                            <ol className="space-y-4">
                                {selectedLesson.content.steps.map((step, index) => (
                                    <li key={index} className="flex gap-3 items-start text-start">
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/30 text-amber-300 font-bold rounded-full mt-1">{index + 1}</div>
                                        <div>
                                            <h4 className="font-semibold text-stone-100">{step.title[langKey]}</h4>
                                            <p className="text-stone-100/80 [dir='rtl']:leading-loose">{step.description[langKey]}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>

                        </motion.div>
                    ) : (
                         // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                         <motion.div key="placeholder" className="flex items-center justify-center h-full text-center text-stone-100/60" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <p>{t('academy.selectPrompt')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChefsAcademyPage;