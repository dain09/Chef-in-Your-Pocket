import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import Logo from './Logo';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingTutorialProps {
  onFinish: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onFinish }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);

  const onboardingSteps = t('onboarding.steps', { returnObjects: true }) as { title: string; description: string }[];
  const totalSteps = onboardingSteps.length;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const isLastStep = step === totalSteps - 1;
  const isFirstStep = step === 0;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-md p-6 flex flex-col items-center gap-6 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <Logo className="w-20 h-20" />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-32 flex flex-col justify-center"
          >
            <h2 className="text-2xl font-bold text-pink-900">{onboardingSteps[step].title}</h2>
            <p className="mt-2 text-pink-900/80">{onboardingSteps[step].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between w-full">
          <motion.button
            onClick={prevStep}
            className="p-2 text-pink-900/70 hover:text-pink-900 disabled:opacity-30"
            disabled={isFirstStep}
            whileHover={{ scale: isFirstStep ? 1 : 1.1 }}
            whileTap={{ scale: isFirstStep ? 1 : 0.9 }}
          >
            {i18n.dir() === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            <span className="sr-only">{t('onboarding.prev')}</span>
          </motion.button>

          <div className="flex gap-2">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${step === i ? 'bg-pink-500' : 'bg-pink-500/30'}`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextStep}
            className="p-2 text-pink-900/70 hover:text-pink-900 disabled:opacity-30"
            disabled={isLastStep}
            whileHover={{ scale: isLastStep ? 1 : 1.1 }}
            whileTap={{ scale: isLastStep ? 1 : 0.9 }}
          >
            {i18n.dir() === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
            <span className="sr-only">{t('onboarding.next')}</span>
          </motion.button>
        </div>

        {isLastStep && (
          <motion.button
            onClick={onFinish}
            className="w-full mt-4 px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('onboarding.finish')}
          </motion.button>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default OnboardingTutorial;
