import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { audioService } from '../services/audioService';

interface OnboardingTutorialProps {
  onFinish: () => void;
}

const WelcomeIcon = () => (
  <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24 text-pink-500" initial="hidden" animate="visible">
    <motion.path d="M78.5 43.5C86 43.5 90 35.5 86.5 29.5C83 23.5 76.5 25 73 28C73 21 68 15 60.5 15C53 15 47.5 21.5 47.5 28C43.5 25 37 23.5 33.5 29.5C30 35.5 34.5 43.5 41.5 43.5" fill="currentColor" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" variants={{hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', delay: 0.2 }}}} />
    <motion.path d="M25 85V75C25 61.19 36.19 50 50 50C63.81 50 75 61.19 75 75V85H25Z" fill="currentColor" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" variants={{hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' }}}} />
    <motion.path d="M40 70C43.33 75 56.67 75 60 70" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" variants={{hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { delay: 0.5, duration: 0.8 }}}} />
  </motion.svg>
);
const CraftIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-pink-500" initial="hidden" animate="visible" variants={{visible: { transition: { staggerChildren: 0.2 }}}}>
    <motion.path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" variants={{hidden: { scale: 0 }, visible: { scale: 1, transition: { type: 'spring' }}}} />
    <motion.path d="M12 5V1" strokeWidth="1" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
    <motion.path d="M12 19v4" strokeWidth="1" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
    <motion.path d="m15.7 15.7 2.8 2.8" strokeWidth="1" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
    <motion.path d="m5.5 5.5 2.8 2.8" strokeWidth="1" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
  </motion.svg>
);
const MenuIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-pink-500" initial="hidden" animate="visible" variants={{visible: { transition: { staggerChildren: 0.3 }}}}>
    <motion.path d="M2 15.5C2 13.5 3.5 12 5.5 12h13c2 0 3.5 1.5 3.5 3.5v0c0 1.5-1.5 2.5-3.5 2.5h-13C3.5 18 2 16.5 2 15.5v0Z" variants={{hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring'}}}} />
    <motion.path d="M12 12V3" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
    <motion.path d="M12 3H8" variants={{hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', delay: 0.5 }}}} />
    <motion.path d="M16 3h-4" variants={{hidden: { x: 10, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', delay: 0.5 }}}} />
  </motion.svg>
);
const ScanIcon = () => (
  <motion.div className="w-24 h-24 text-pink-500 relative flex items-center justify-center" initial="hidden" animate="visible" variants={{visible: {transition: {staggerChildren: 0.2}}}}>
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" variants={{hidden:{scale:0.8, opacity:0}, visible:{scale:1, opacity:1}}}>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </motion.svg>
    <motion.div className="absolute w-2 h-14 bg-cyan-300 rounded-full" style={{boxShadow: '0 0 10px #22d3ee'}} variants={{hidden:{y:-40, opacity:0}, visible:{y:[ -30, 30, -30 ], opacity:[1, 1, 1], transition:{duration:2, repeat: Infinity, ease:'easeInOut'}}}} />
  </motion.div>
);
const InteractIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-pink-500" initial="hidden" animate="visible" variants={{visible: { transition: { staggerChildren: 0.2 }}}}>
    <motion.path d="M14.5 2H18a2 2 0 0 1 2 2v3.5" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1 }}} />
    <motion.path d="M5 12V2" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: {delay: 0.2} }}} />
    <motion.path d="M12 5 2.5 14.5" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: {delay: 0.4} }}} />
    <motion.path d="m20 2-8.5 8.5" variants={{hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: {delay: 0.4} }}} />
    <motion.path d="M12 22v-2" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: {delay: 0.6} }}} />
    <motion.path d="m20 12-2-2" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: {delay: 0.7} }}} />
    <motion.path d="m4 12-2-2" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: {delay: 0.8} }}} />
  </motion.svg>
);
const FinishIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-pink-500" initial="hidden" animate="visible">
    <motion.path d="M12 2.69l.346.666L13.4 5.5l2.428.353.184 2.41L15.5 9.4l1.09 2.218-.002.364L15.5 14.6l-1.09 2.218.002.364L15.5 19.4l-.184 2.41-2.428.353L12.346 22l-.346-.666L10.6 19.5l-2.428-.353-.184-2.41L9.5 15.6l-1.09-2.218.002-.364L9.5 11.4l1.09-2.218-.002-.364L9.5 6.6l.184-2.41 2.428-.353L11.654 3.334 12 2.69z" variants={{hidden: { scale: 0, rotate: -90}, visible: { scale: 1, rotate: 0, transition: { type: 'spring'}}}} />
    <motion.path d="m9 12 2 2 4-4" variants={{hidden: { pathLength: 0}, visible: { pathLength: 1, transition: { delay: 0.5, duration: 0.5 }}}}/>
  </motion.svg>
);

const illustrations = [
  <WelcomeIcon />, <CraftIcon />, <MenuIcon />, <ScanIcon />, <InteractIcon />, <FinishIcon />
];

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
        className="w-full max-w-lg p-6 flex flex-col gap-4 relative !bg-pink-50/90 backdrop-blur-xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: 'spring' } }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={handleFinish} className="absolute top-4 right-4 p-1 text-pink-900/70 hover:text-pink-900 z-20">
          <X size={24} />
        </button>
        
        <div className="text-center h-28 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {illustrations[currentStep]}
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="text-center h-24">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep + '-text'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
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
        <div className="flex justify-between items-center mt-2">
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
