import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChefHat } from 'lucide-react';
import type { LoadingMessages, MultilingualString } from '../types';
// FIX: Correctly import the getCookingTip function from the geminiService.
import { getCookingTip } from '../services/geminiService';

interface LoadingOverlayProps {
  type: LoadingMessages;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ type }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const getMessagesForType = (currentType: LoadingMessages): string[] => {
      switch (currentType) {
          case 'generating':
              return [t('generatingRecipe')];
          case 'remixing':
              return [t('remixingRecipe')];
          case 'remixingLeftovers':
              return [t('remixingLeftovers')];
          case 'analyzing':
              return [t('analyzingImage')];
          case 'planningMenu':
              return [
                  t('planningMenu'),
                  t('preparingAppetizer'),
                  t('craftingMainCourse'),
                  t('perfectingDessert')
              ];
          case 'planningWeek':
              return [t('planningWeek')];
          default:
              return [t('generating')];
      }
  };
  
  const [messages, setMessages] = useState(getMessagesForType(type));
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState<MultilingualString | null>(null);

  useEffect(() => {
    const newMessages = getMessagesForType(type);
    setMessages(newMessages);
    setMessageIndex(0);

    if (newMessages.length > 1) {
      const interval = setInterval(() => {
        setMessageIndex(prevIndex => {
          if (prevIndex + 1 < newMessages.length) {
            return prevIndex + 1;
          }
          clearInterval(interval);
          return prevIndex;
        });
      }, 4000); // Progress through main status messages every 4 seconds

      return () => clearInterval(interval);
    }
  }, [type, t]);

  useEffect(() => {
    let isMounted = true;

    const fetchTip = async () => {
        try {
            const tip = await getCookingTip();
            if (isMounted) {
                setCurrentTip(tip);
            }
        } catch (error) {
            console.error("Failed to fetch cooking tip:", error);
            if (isMounted) {
                setCurrentTip({
                    en: "Sharpen your knives for safer and easier cooking.",
                    ar: "اشحذ سكاكينك لطبخ أكثر أمانًا وسهولة."
                });
            }
        }
    };

    fetchTip(); // Initial fetch

    const tipInterval = setInterval(fetchTip, 6000); // Fetch a new tip every 6 seconds

    return () => {
        isMounted = false;
        clearInterval(tipInterval);
    };
  }, []);

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex flex-col justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center text-stone-100 space-y-8">
        {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChefHat size={64} className="mx-auto text-amber-400" />
        </motion.div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="h-12">
            <AnimatePresence mode="wait">
              {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
              <motion.p
                key={messageIndex + messages[messageIndex]} 
                className="text-stone-100/90 text-xl font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="h-16 flex items-center justify-center">
             <AnimatePresence mode="wait">
                {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                <motion.p
                    key={currentTip ? currentTip.en : 'loading-tip'}
                    className="text-stone-100/70 italic text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {currentTip ? currentTip[langKey] : '...'}
                </motion.p>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;