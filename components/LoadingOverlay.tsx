import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChefHat } from 'lucide-react';
import type { LoadingMessages } from '../types';

interface LoadingOverlayProps {
  type: LoadingMessages;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ type }) => {
  const { t } = useTranslation();
  
  const getMessagesForType = (currentType: LoadingMessages): string[] => {
      switch (currentType) {
          case 'generating':
              return [t('generatingRecipe'), t('generatingImage')];
          case 'remixing':
              return [t('remixingRecipe')];
          case 'analyzing':
              return [t('analyzingImage')];
          case 'planning':
              return [
                  t('planningMenu'),
                  t('preparingAppetizer'),
                  t('craftingMainCourse'),
                  t('perfectingDessert')
              ];
          default:
              return [t('generating')];
      }
  };

  const loadingTips = t('loadingTips', { returnObjects: true }) as string[];
  
  const [messages, setMessages] = useState(getMessagesForType(type));
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

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
    const tipInterval = setInterval(() => {
      setTipIndex(prevIndex => (prevIndex + 1) % loadingTips.length);
    }, 4000); 

    return () => clearInterval(tipInterval);
  }, [loadingTips.length]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex flex-col justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center text-white space-y-8">
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
          <ChefHat size={64} className="mx-auto text-pink-300" />
        </motion.div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="h-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex + messages[messageIndex]} 
                className="text-white/90 text-xl font-semibold"
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
                <motion.p
                    key={tipIndex}
                    className="text-white/70 italic text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {loadingTips[tipIndex]}
                </motion.p>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
