import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Camera, UtensilsCrossed, Wand2, CalendarClock, BookUser, Recycle, Dices } from 'lucide-react';
import { cuisines } from '../data/cuisines';
import { diets } from '../data/diets';
import CustomSelect from './CustomSelect';
import { audioService } from '../services/audioService';

type FormMode = 'ingredients' | 'name' | 'leftovers' | 'occasion' | 'weekly';

interface RecipeFormProps {
  onGenerate: (ingredients: string, cuisine: string, diet: string, name?: string) => void;
  onAnalyzeImage: () => void;
  onPlanMenu: (occasion: string) => void;
  onPlanWeek: (goals: string) => void;
  onLeftoverRemix: (leftovers: string) => void;
  isGenerating: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ 
    onGenerate, 
    onAnalyzeImage, 
    onPlanMenu, 
    onPlanWeek, 
    onLeftoverRemix, 
    isGenerating 
}) => {
  const { i18n, t } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const [mode, setMode] = useState<FormMode>('ingredients');
  const [prompt, setPrompt] = useState('');
  const [cuisine, setCuisine] = useState('random');
  const [diet, setDiet] = useState('none');

  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playSwoosh();
    switch (mode) {
      case 'ingredients':
        onGenerate(prompt, cuisine, diet);
        break;
      case 'name':
        onGenerate('', 'random', 'none', prompt);
        break;
      case 'leftovers':
        onLeftoverRemix(prompt);
        break;
      case 'occasion':
        onPlanMenu(prompt);
        break;
      case 'weekly':
        onPlanWeek(prompt);
        break;
    }
  };

  const handleRandomClick = () => {
    audioService.playSwoosh();
    onGenerate(t('form.randomPrompt'), 'random', 'none');
  };

  const getPlaceholderText = () => {
      switch(mode) {
          case 'ingredients': return t('form.placeholderIngredients');
          case 'name': return t('form.placeholderName');
          case 'leftovers': return t('form.placeholderLeftovers');
          case 'occasion': return t('form.placeholderOccasion');
          case 'weekly': return t('form.placeholderWeekly');
          default: return '';
      }
  }

  const getButtonText = () => {
    switch(mode) {
        case 'ingredients': return t('form.generateButton');
        case 'name': return t('form.findButton');
        case 'leftovers': return t('form.remixButton');
        case 'occasion': return t('form.planMenuButton');
        case 'weekly': return t('form.planWeekButton');
        default: return t('form.generateButton');
    }
  }

  const handleModeChange = (newMode: FormMode) => {
      audioService.playClick();
      setMode(newMode);
      setPrompt('');
      inputRef.current?.focus();
  }

  const sortedCuisineOptions = useMemo(() => {
    const sorted = [...cuisines].sort((a, b) => {
      if (a.value === 'random') return -1;
      if (b.value === 'random') return 1;
      return a[langKey].localeCompare(b[langKey]);
    });
    return sorted.map(c => ({ value: c.value, label: c[langKey] }));
  }, [langKey]);

  const sortedDietOptions = useMemo(() => {
    const sorted = [...diets].sort((a, b) => {
        if (a.value === 'none') return -1;
        if (b.value === 'none') return 1;
        return a[langKey].localeCompare(b[langKey]);
    });
    return sorted.map(d => ({ value: d.value, label: d[langKey] }));
  }, [langKey]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="flex justify-center flex-wrap gap-2 text-sm">
            <ModeButton icon={UtensilsCrossed} label={t('form.modeIngredients')} isActive={mode === 'ingredients'} onClick={() => handleModeChange('ingredients')} />
            <ModeButton icon={BookUser} label={t('form.modeName')} isActive={mode === 'name'} onClick={() => handleModeChange('name')} />
            <ModeButton icon={Recycle} label={t('form.modeLeftovers')} isActive={mode === 'leftovers'} onClick={() => handleModeChange('leftovers')} />
            <ModeButton icon={Wand2} label={t('form.modeOccasion')} isActive={mode === 'occasion'} onClick={() => handleModeChange('occasion')} />
            <ModeButton icon={CalendarClock} label={t('form.modeWeekly')} isActive={mode === 'weekly'} onClick={() => handleModeChange('weekly')} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={getPlaceholderText()}
                className="flex-grow p-3 bg-black/30 border border-amber-400/30 rounded-lg text-stone-100 placeholder-stone-100/50 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow w-full"
                required
            />
            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.button 
                type="button" 
                onClick={() => { audioService.playClick(); onAnalyzeImage(); }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-3 bg-black/30 border border-amber-400/30 rounded-lg text-amber-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('form.analyzeImage')}
            >
                <Camera size={20} />
                <span>{t('form.analyzeImageShort')}</span>
            </motion.button>
             {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
             <motion.button
                type="button"
                onClick={handleRandomClick}
                disabled={isGenerating}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-3 bg-black/30 border border-amber-400/30 rounded-lg text-amber-300 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('form.randomButtonTooltip')}
              >
                  <Dices size={20} />
                  <span>{t('form.randomButton')}</span>
              </motion.button>
            </div>

            {mode === 'ingredients' && (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <div>
                        <label className="text-sm text-stone-100/70 ps-1 mb-1 block">{t('form.cuisineLabel')}</label>
                        <CustomSelect options={sortedCuisineOptions} selectedValue={cuisine} onValueChange={setCuisine} />
                    </div>
                    <div>
                        <label className="text-sm text-stone-100/70 ps-1 mb-1 block">{t('form.dietLabel')}</label>
                        <CustomSelect options={sortedDietOptions} selectedValue={diet} onValueChange={setDiet} />
                    </div>
                </motion.div>
            )}

            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.button
                type="submit"
                disabled={isGenerating || !prompt}
                className="w-full py-3 text-lg font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
            {isGenerating ? t('form.generating') : getButtonText()}
            </motion.button>
        </form>
    </div>
  );
};

const ModeButton = ({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) => (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-stone-100/80 transition-colors ${
            isActive ? 'bg-black/40' : 'bg-black/20 hover:bg-black/30'
        }`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
    >
        <Icon size={16} className={`${isActive ? 'text-amber-300' : ''}`} />
        <span>{label}</span>
    </motion.button>
);


export default RecipeForm;