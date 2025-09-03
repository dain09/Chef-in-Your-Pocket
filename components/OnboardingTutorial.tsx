import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { ChevronLeft, ChevronRight, PartyPopper, Cookie, GlassWater, Camera, Wand2, ChefHat } from 'lucide-react';

interface OnboardingTutorialProps {
  onFinish: () => void;
}

const tutorialIcons = [PartyPopper, Cookie, GlassWater, Camera, Wand2, ChefHat];

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onFinish }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);

  const onboardingSteps = t('onboarding.steps', { returnObjects: true }) as { title: string; description: string }[];
  const totalSteps = onboardingSteps.length;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const isLastStep = step === totalSteps - 1;

  const CurrentIcon = tutorialIcons[step];

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-sm p-6 flex flex-col items-center gap-6 text-center overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 150 } }}
            exit={{ opacity: 0, x: -50, scale: 0.7 }}
            className="flex flex-col items-center gap-4 h-52" // Fixed height for content
          >
            <div className="p-4 bg-amber-400/20 rounded-full text-amber-300">
               <CurrentIcon size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-stone-100">{onboardingSteps[step].title}</h2>
            <p className="text-stone-100/80">{onboardingSteps[step].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center w-full gap-4">
          {onboardingSteps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === i ? 'bg-amber-400 scale-125' : 'bg-stone-100/30'}`}
            />
          ))}
        </div>
        
        <div className="flex w-full items-center" style={{ minHeight: '48px' }}>
          {step > 0 && (
             // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
             <motion.button onClick={prevStep} className="p-2 text-stone-100/70 hover:text-stone-100" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {i18n.dir() === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                <span className="sr-only">{t('onboarding.prev')}</span>
            </motion.button>
          )}

          <div className="flex-grow">
            {isLastStep ? (
              // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
              <motion.button
                onClick={onFinish}
                className="w-full px-6 py-3 text-lg font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('onboarding.finish')}
              </motion.button>
            ) : (
                 // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                 <motion.button
                    onClick={nextStep}
                    className="w-full px-6 py-3 text-lg font-bold text-gray-900 bg-amber-400/90 rounded-lg"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgb(251 191 36)' }} // amber-400
                    whileTap={{ scale: 0.95 }}
                 >
                    {t('onboarding.next')}
                 </motion.button>
            )}
          </div>
            {step > 0 && <div className="w-[32px] h-[32px]"/>}
        </div>
        
      </GlassCard>
    </motion.div>
  );
};

export default OnboardingTutorial;