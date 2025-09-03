import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { audioService } from '../services/audioService';

interface OnboardingTutorialProps {
  onFinish: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onFinish }) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = t('onboarding.steps', { returnObjects: true }) as { title: string; description: string }[];
  const totalSteps = steps.length;

  const nextStep = () => {
    audioService.playClick();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    audioService.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = () => {
    audioService.playSuccess();
    onFinish();
  };
  
  const isRtl = i18n.dir() === 'rtl';

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-lg p-6 flex flex-col gap-6 relative !bg-pink-50/90 backdrop-blur-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: 'spring' } }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={handleFinish} className="absolute top-4 right-4 p-1 text-pink-900/70 hover:text-pink-900 z-20">
          <X size={24} />
        </button>
        
        <div className="text-center h-28">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-pink-900">{steps[currentStep].title}</h2>
                    <p className="text-pink-900/80 mt-2">{steps[currentStep].description}</p>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                    key={index}
                    className={`h-2 rounded-full ${index === currentStep ? 'bg-pink-500' : 'bg-pink-900/20'}`}
                    animate={{ width: index === currentStep ? 24 : 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
            ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
            <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg disabled:opacity-30"
                whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
            >
                {t('onboarding.prev')}
            </motion.button>
            
            {currentStep < totalSteps - 1 ? (
                <motion.button
                    onClick={nextStep}
                    className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t('onboarding.next')}
                    {isRtl ? <ArrowLeft size={18}/> : <ArrowRight size={18}/>}
                </motion.button>
            ) : (
                <motion.button
                    onClick={handleFinish}
                    className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t('onboarding.finish')}
                </motion.button>
            )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default OnboardingTutorial;