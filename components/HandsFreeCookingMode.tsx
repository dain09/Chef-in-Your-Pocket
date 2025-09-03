

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../types';
import type { CookingSession } from '../App';
import { X, ChevronLeft, ChevronRight, Mic, Send, ChefHat } from 'lucide-react';
import { audioService } from '../services/audioService';

// SpeechRecognition interfaces for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

declare const window: Window;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface HandsFreeCookingModeProps {
  session: CookingSession;
  onClose: () => void;
}

const HandsFreeCookingMode: React.FC<HandsFreeCookingModeProps> = ({ session, onClose }) => {
  const { recipe, chat } = session;
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState(t('listening'));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatHistory([{ role: 'model', text: t('chatWelcomeMessage') }]);
  }, [t]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (!SpeechRecognition) {
      setStatus(t('micNotSupported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = i18n.language;

    recognition.onresult = (event) => {
      let lastTranscript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      
      const nextCommands = ['next', 'التالي'];
      const prevCommands = ['previous', 'back', 'السابق', 'ارجع'];

      if (nextCommands.some(cmd => lastTranscript.includes(cmd))) {
        goNext();
      } else if (prevCommands.some(cmd => lastTranscript.includes(cmd))) {
        goPrev();
      } else {
        handleSendMessage(lastTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setStatus(t('micPermissionDenied'));
        recognitionRef.current = null;
      } else {
        console.error('Speech recognition error:', event.error);
      }
    };
    
    recognition.onend = () => {
        if (recognitionRef.current) {
            try { recognition.start(); } catch(e) { console.error("Could not restart recognition", e); }
        }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch(e) {
      console.error("Speech recognition could not be started: ", e);
      setStatus(t('micNotSupported'));
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Prevent restart on component unmount
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [i18n.language, t]);

  const handleSendMessage = async (message: string) => {
    if (!message || isThinking) return;

    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setIsThinking(true);
    setStatus(t('chefIsTyping'));

    try {
      const response = await chat.sendMessage({ message });
      setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: t('chatError') }]);
    } finally {
      setIsThinking(false);
      setStatus(t('listening'));
    }
  };

  const goNext = () => {
      audioService.playClick();
      setCurrentStep((prev) => Math.min(prev + 1, recipe.steps.length - 1));
  };
  const goPrev = () => {
      audioService.playClick();
      setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const handleClose = () => {
      audioService.playPop();
      onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-6 md:p-8 text-white"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <header className="flex-shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold truncate pr-4">{recipe.recipeName[langKey]}</h2>
        <motion.button onClick={handleClose} className="p-2 bg-white/20 rounded-full" whileHover={{ scale: 1.1, rotate: 90 }}>
          <X size={24} />
        </motion.button>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row gap-4 lg:gap-6 overflow-hidden">
        {/* Left Side: Step */}
        <div className="md:w-1/2 lg:w-3/5 flex flex-col justify-center text-center bg-white/5 rounded-lg p-4">
          <p className="text-lg sm:text-xl font-semibold text-pink-300 mb-4 sm:mb-6">
            {t('stepOf', { current: currentStep + 1, total: recipe.steps.length })}
          </p>
          <div className="flex-grow flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              >
                {recipe.steps[currentStep][langKey]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center gap-8 mt-6">
            <motion.button onClick={goPrev} disabled={currentStep === 0} className="p-3 bg-white/20 rounded-full disabled:opacity-30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {i18n.dir() === 'rtl' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </motion.button>
            <motion.button onClick={goNext} disabled={currentStep === recipe.steps.length - 1} className="p-3 bg-white/20 rounded-full disabled:opacity-30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {i18n.dir() === 'rtl' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </motion.button>
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="md:w-1/2 lg:w-2/5 flex flex-col bg-white/5 rounded-lg p-4 overflow-hidden h-full">
          <div ref={chatContainerRef} className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg.role === 'model' && <ChefHat className="w-6 h-6 flex-shrink-0 text-pink-300 mt-1" />}
                <div className={`max-w-xs sm:max-w-sm p-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isThinking && (
              <motion.div className="flex items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ChefHat className="w-6 h-6 flex-shrink-0 text-pink-300 mt-1" />
                <div className="bg-gray-700 rounded-2xl rounded-bl-none p-3">
                  <motion.div className="flex gap-1.5" variants={{
                    start: { transition: { staggerChildren: 0.15 } },
                    end: {}
                  }} initial="start" animate="end">
                    {[...Array(3)].map((_, i) => (
                      <motion.div key={i} className="w-2 h-2 bg-white/50 rounded-full" variants={{
                        start: { y: "0%" },
                        end: { y: "100%" }
                      }} transition={{ duration: 0.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex-shrink-0 mt-4 text-center">
            <div className="flex items-center gap-2 justify-center">
              <Mic size={16} className={`transition-colors ${isThinking ? 'text-gray-500' : 'text-pink-300 animate-pulse'}`} />
              <p className="text-sm text-white/70">{status}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HandsFreeCookingMode;
