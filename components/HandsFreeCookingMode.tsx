import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../types';
import { X, Mic, MicOff, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import GlassCard from './GlassCard';
import { audioService } from '../services/audioService';

// FIX: Cast window to any to access browser-specific SpeechRecognition APIs without TypeScript errors.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = false;
}

const getSoundForStep = (stepText: string): 'sizzle' | 'chopping' | 'boiling' | null => {
    const text = stepText.toLowerCase();
    if (/\b(fry|sauté|sear|brown)\b/.test(text)) return 'sizzle';
    if (/\b(chop|dice|slice|mince|cut)\b/.test(text)) return 'chopping';
    if (/\b(boil|simmer|stew)\b/.test(text)) return 'boiling';
    return null;
}

const HandsFreeCookingMode: React.FC<{ recipe: Recipe; onClose: () => void; }> = ({ recipe, onClose }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const speak = useCallback((text: string) => {
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langKey === 'ar' ? 'ar-SA' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.current.speak(utterance);
  }, [langKey]);

  const readStep = useCallback((stepIndex: number) => {
    const stepText = `Step ${stepIndex + 1}: ${recipe.steps[stepIndex].text[langKey]}`;
    speak(stepText);
  }, [speak, recipe.steps, langKey]);
  
  const readIngredients = useCallback(() => {
    const ingredientsText = recipe.ingredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`).join(', ');
    speak(`${t('ingredients')}: ${ingredientsText}`);
  }, [speak, recipe.ingredients, t, langKey]);

  const nextStep = useCallback(() => {
    if (currentStep < recipe.steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      readStep(next);
    }
  }, [currentStep, recipe.steps.length, readStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      readStep(prev);
    }
  }, [currentStep, readStep]);

  // Handle Ambiance Sound
  useEffect(() => {
    const stepText = recipe.steps[currentStep].text.en; // Use English for keyword consistency
    const sound = getSoundForStep(stepText);
    if (sound) {
        audioService.playAmbiance(sound);
    } else {
        audioService.stopAmbiance();
    }
  }, [currentStep, recipe.steps]);


  useEffect(() => {
    if (!recognition) return;
    
    recognition.lang = langKey === 'ar' ? 'ar-SA' : 'en-US';

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      if (command.includes(t('commandNext'))) {
        nextStep();
      } else if (command.includes(t('commandPrevious'))) {
        prevStep();
      } else if (command.includes(t('commandIngredients'))) {
        readIngredients();
      } else if (command.includes(t('commandExit'))) {
        onClose();
      }
    };
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
      synth.current.cancel();
      audioService.stopAmbiance(); // Stop ambiance on exit
    };
  }, [langKey, t, nextStep, prevStep, readIngredients, onClose]);

  const toggleListening = () => {
    if (!recognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      speak(t('listening'));
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
      synth.current.cancel();
      audioService.stopAmbiance();
    }
  }, [isListening]);

  const handleMuteToggle = () => {
      setIsMuted(!isMuted);
      audioService.toggleMute(!isMuted);
  };

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-2xl h-[90vh] p-6 flex flex-col gap-6 relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
            <button onClick={handleMuteToggle} className="p-1 text-amber-300/70 hover:text-amber-200">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button onClick={onClose} className="p-1 text-amber-300/70 hover:text-amber-200">
                <X size={24} />
            </button>
        </div>
        
        <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-300">{t('handsFreeTitle')}</h2>
            <p className="text-sm text-stone-100/70">{t('handsFreeDescription')}</p>
        </div>
        
        <div className="flex-grow flex flex-col justify-center items-center text-center bg-black/20 rounded-lg p-6">
            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
            >
                <p className="font-bold text-amber-300 text-lg mb-4">{t('step')} {currentStep + 1} / {recipe.steps.length}</p>
                <p className="text-xl md:text-3xl font-semibold text-stone-100">{recipe.steps[currentStep].text[langKey]}</p>
            </motion.div>
        </div>

        <div className="flex items-center justify-between">
            <button onClick={prevStep} disabled={currentStep === 0} className="p-3 bg-white/10 rounded-full disabled:opacity-50">
                {i18n.dir() === 'rtl' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>

            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.button 
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white ${isListening ? 'bg-rose-600' : 'bg-teal-500'}`}
                animate={{ scale: isSpeaking ? 1.1 : 1 }}
                transition={{ type: 'spring' }}
            >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </motion.button>

            <button onClick={nextStep} disabled={currentStep === recipe.steps.length - 1} className="p-3 bg-white/10 rounded-full disabled:opacity-50">
                {i18n.dir() === 'rtl' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default HandsFreeCookingMode;