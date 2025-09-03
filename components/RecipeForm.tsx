

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cuisines } from '../data/cuisines';
import { diets } from '../data/diets';
import GlassCard from './GlassCard';
import { audioService } from '../services/audioService';
import { Sparkles, Camera, X, ChefHat, Utensils, Search } from 'lucide-react';
import CustomSelect from './CustomSelect'; 

interface ImageScanModalProps {
  onClose: () => void;
  onScanComplete: (base64Image: string) => void;
  onCameraError: (error: string) => void;
}

type FormMode = 'recipe' | 'menu' | 'search';

const ImageScanModal: React.FC<ImageScanModalProps> = ({ onClose, onScanComplete, onCameraError }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                onCameraError(t('errorCamera'));
                onClose();
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [onCameraError, onClose, t]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            audioService.playClick();
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            stream?.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleRetake = () => {
        audioService.playClick();
        setCapturedImage(null);
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                 onCameraError(t('errorCamera'));
                 onClose();
            }
        };
        startCamera();
    };

    const handleUsePhoto = () => {
        if (capturedImage) {
            audioService.playSuccess();
            const base64Image = capturedImage.split(',')[1];
            onScanComplete(base64Image);
        }
    };
    
    return (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <GlassCard
                className="w-full max-w-lg p-4 flex flex-col gap-4 relative"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            >
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-pink-900/70 hover:text-pink-900 z-10">
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold text-pink-900 text-center">{t('scanModalTitle')}</h3>
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                    {capturedImage ? (
                        <img src={capturedImage} alt="Captured ingredients" className="w-full h-full object-contain" />
                    ) : (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                 <div className="flex justify-center gap-4">
                    {capturedImage ? (
                        <>
                            <motion.button onClick={handleRetake} className="px-4 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{t('retake')}</motion.button>
                            <motion.button onClick={handleUsePhoto} className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{t('usePhoto')}</motion.button>
                        </>
                    ) : (
                        <motion.button onClick={handleCapture} className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{t('capture')}</motion.button>
                    )}
                 </div>
            </GlassCard>
        </motion.div>
    );
};

const ModeButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button
        onClick={() => { audioService.playPop(); onClick(); }}
        className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors w-1/3 ${active ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}
    >
        {active && <motion.div layoutId="formModePill" className="absolute inset-0 bg-white/50 rounded-full" />}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
);


interface RecipeFormProps {
  onRecipeSubmit: (ingredients: string, cuisine: string, allergies: string, diet: string) => void;
  onMenuSubmit: (occasion: string) => void;
  onRecipeSearch: (recipeName: string) => void;
  isLoading: boolean;
  onAnalyzeImage: (base64: string) => Promise<string>;
  setError: (error: string | null) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onRecipeSubmit, onMenuSubmit, onRecipeSearch, isLoading, onAnalyzeImage, setError }) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<FormMode>('recipe');
  const [mainInput, setMainInput] = useState(''); // Used for ingredients, occasion, and recipe name search
  const [cuisineValue, setCuisineValue] = useState('random');
  const [allergies, setAlleries] = useState('');
  const [diet, setDiet] = useState('none');
  const [isScanModalOpen, setScanModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClick();
    if (mainInput.trim()) {
      if (mode === 'recipe') {
        const selectedCuisine = cuisines.find(c => c.value === cuisineValue);
        const cuisineForPrompt = selectedCuisine ? selectedCuisine.en : cuisineValue;
        onRecipeSubmit(mainInput, cuisineForPrompt, allergies, diet);
      } else if (mode === 'menu') {
        onMenuSubmit(mainInput);
      } else { // mode === 'search'
        onRecipeSearch(mainInput);
      }
    }
  };

  const handleSurprise = () => {
    audioService.playPop();
    const actualCuisines = cuisines.filter(c => c.value !== 'random');
    const randomCuisine = actualCuisines[Math.floor(Math.random() * actualCuisines.length)];
    setCuisineValue(randomCuisine.value);
    const cuisineForPrompt = randomCuisine.en;
    onRecipeSubmit(mainInput || 'common household staples', cuisineForPrompt, allergies, diet);
  };
  
  const handleScanComplete = async (base64Image: string) => {
    setScanModalOpen(false);
    const identifiedIngredients = await onAnalyzeImage(base64Image);
    if (identifiedIngredients) {
        setMainInput(prev => prev ? `${prev}, ${identifiedIngredients}` : identifiedIngredients);
    }
  };

  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const cuisineOptions = useMemo(() => {
    const sorted = [...cuisines].sort((a, b) => {
        if (a.value === 'random') return -1;
        if (b.value === 'random') return 1;
        return a[langKey].localeCompare(b[langKey], langKey === 'ar' ? 'ar-EG' : 'en-US');
    });
    return sorted.map(c => ({ value: c.value, label: c[langKey] }));
  }, [langKey]);
  
  const dietOptions = useMemo(() => {
    const sorted = [...diets].sort((a, b) => a[langKey].localeCompare(b[langKey], langKey === 'ar' ? 'ar-EG' : 'en-US'));
    return sorted.map(d => ({ value: d.value, label: d[langKey] }));
  }, [langKey]);


  return (
    <>
      <AnimatePresence>
        {isScanModalOpen && (
            <ImageScanModal 
                onClose={() => setScanModalOpen(false)}
                onScanComplete={handleScanComplete}
                onCameraError={(err) => setError(err)}
            />
        )}
      </AnimatePresence>
      <GlassCard className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-900">{t('findYourRecipe')}</h2>
            <p className="text-pink-900/70 mt-2">{t('tagline')}</p>
          </div>
          
          <GlassCard className="p-1 flex items-center gap-1 rounded-full mx-auto w-full">
            <ModeButton active={mode === 'recipe'} onClick={() => setMode('recipe')}><ChefHat size={18}/> {t('singleRecipe')}</ModeButton>
            <ModeButton active={mode === 'menu'} onClick={() => setMode('menu')}><Utensils size={18}/> {t('menuPlanner')}</ModeButton>
            <ModeButton active={mode === 'search'} onClick={() => setMode('search')}><Search size={18}/> {t('searchByName')}</ModeButton>
          </GlassCard>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="main-input" className="block text-sm font-medium text-pink-900/90">
                    {mode === 'recipe' ? t('availableIngredients') : mode === 'menu' ? t('occasionDescription') : t('searchByName')}
                  </label>
                  {mode === 'recipe' && (
                    <motion.button 
                      type="button" 
                      onClick={() => { audioService.playPop(); setScanModalOpen(true); }}
                      className="flex items-center gap-2 text-sm text-purple-600 font-semibold"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <Camera size={16} /> {t('scanIngredients')}
                    </motion.button>
                  )}
                </div>
                <motion.textarea
                  id="main-input"
                  value={mainInput}
                  onChange={(e) => setMainInput(e.target.value)}
                  rows={mode === 'recipe' ? 4 : 2}
                  className="w-full p-3 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow resize-none"
                  placeholder={mode === 'recipe' ? t('ingredientsPlaceholder') : mode === 'menu' ? t('occasionPlaceholder') : t('recipeNamePlaceholder')}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                />
              </div>

              {mode === 'recipe' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-pink-900/90">
                        {t('allergies')} <span className="text-pink-900/50 text-xs">({t('optional')})</span>
                      </label>
                      <motion.input
                        id="allergies"
                        type="text"
                        value={allergies}
                        onChange={(e) => setAlleries(e.target.value)}
                        className="w-full p-3 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow"
                        placeholder={t('allergiesPlaceholder')}
                        whileFocus={{ scale: 1.02, boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                      />
                    </div>
                     <div>
                      <label className="block mb-2 text-sm font-medium text-pink-900/90">
                        {t('diet')} <span className="text-pink-900/50 text-xs">({t('optional')})</span>
                      </label>
                      <CustomSelect 
                        options={dietOptions}
                        selectedValue={diet}
                        onValueChange={setDiet}
                      />
                    </div>
                  </div>
              )}

              {mode === 'recipe' && (
                 <div>
                    <label className="block mb-2 text-sm font-medium text-pink-900/90">
                      {t('chooseCuisine')}
                    </label>
                     <CustomSelect 
                        options={cuisineOptions}
                        selectedValue={cuisineValue}
                        onValueChange={setCuisineValue}
                      />
                  </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-col sm:flex-row gap-4">
              {mode === 'recipe' ? (
                <motion.button
                  type="button"
                  onClick={handleSurprise}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform"
                  whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -2, boxShadow: '0 0 20px rgba(236, 72, 153, 0.7)' }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  <Sparkles size={20} /> {t('surpriseMe')}
                </motion.button>
              ) : <div className="hidden sm:block sm:w-full"></div>}
              <motion.button
                type="submit"
                disabled={isLoading || !mainInput.trim()}
                className={`w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform ${mode !== 'recipe' ? 'sm:col-span-2' : ''}`}
                whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -2, boxShadow: '0 0 20px rgba(251, 146, 60, 0.7)' }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? t('generating') : (mode === 'recipe' ? t('getRecipe') : mode === 'menu' ? t('getMenu') : t('searchForRecipe'))}
              </motion.button>
          </div>
        </motion.form>
      </GlassCard>
    </>
  );
};

export default RecipeForm;