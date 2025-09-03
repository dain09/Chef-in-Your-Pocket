import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { audioService } from '../services/audioService';
import type { Recipe, Ingredient, Substitute } from '../types';
import GlassCard from './GlassCard';
import { Heart, ListPlus, ChefHat, VenetianMask, BookOpen, PlayCircle, Apple, BrainCircuit, Youtube, Wand2, X, Wine, GlassWater } from 'lucide-react';
import { parseIngredient } from '../utils/ingredientParser';
import { getIngredientSubstitutes } from '../services/geminiService';


interface RecipeCardProps {
  recipe: Recipe;
  onAddToFavorites: (recipe: Recipe) => void;
  onAddToShoppingList: (ingredients: Ingredient[]) => void;
  onStartHandsFree: (recipe: Recipe) => void;
  isFavorite: boolean;
  onRemix: (remixPrompt: string) => void;
}

interface RemixModalProps {
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

interface SubstitutesModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  recipe: Recipe;
  langKey: 'en' | 'ar';
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button
        onClick={() => { audioService.playPop(); onClick(); }}
        className={`relative px-3 sm:px-4 py-2 text-xs sm:text-base font-semibold rounded-full transition-colors ${active ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}
    >
        {active && <motion.div layoutId="recipeTabPill" className="absolute inset-0 bg-white/50 rounded-full" />}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
);

const RemixModal: React.FC<RemixModalProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      audioService.playClick();
      onSubmit(prompt);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-lg"
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { type: 'spring' } },
          exit: { opacity: 0, scale: 0.8 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-pink-900">{t('addYourTouch')}</h3>
            <button type="button" onClick={onClose} className="p-1 text-pink-900/70 hover:text-pink-900">
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-pink-900/80">{t('remixInstruction')}</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow resize-none"
            placeholder={t('remixPlaceholder')}
            autoFocus
          />
          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg hover:bg-black/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('cancel')}
            </motion.button>
            <motion.button
              type="submit"
              disabled={!prompt.trim()}
              className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('remixRecipe')}
            </motion.button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
};

const SubstitutesModal: React.FC<SubstitutesModalProps> = ({ ingredient, onClose, recipe, langKey }) => {
  const { t } = useTranslation();
  const [substitutes, setSubstitutes] = useState<Substitute[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ingredient) {
      const fetchSubstitutes = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getIngredientSubstitutes(ingredient, recipe);
          setSubstitutes(result);
        } catch (err) {
          setError(t('errorFindingSubstitutes'));
        } finally {
          setIsLoading(false);
        }
      };
      fetchSubstitutes();
    }
  }, [ingredient, recipe, t]);

  if (!ingredient) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-lg"
        variants={{ hidden: { scale: 0.8 }, visible: { scale: 1 }, exit: { scale: 0.8 } }}
        initial="hidden" animate="visible" exit="exit"
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-pink-900">{t('ingredientSubstitutesTitle', { ingredientName: ingredient.name[langKey] })}</h3>
            <button type="button" onClick={onClose} className="p-1 text-pink-900/70 hover:text-pink-900">
              <X size={24} />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <p className="text-pink-900/80 animate-pulse">{t('findingSubstitutes')}</p>
              </div>
            )}
            {error && <p className="text-red-500 p-4 text-center">{error}</p>}
            {!isLoading && !error && substitutes && substitutes.length > 0 && (
              <ul className="space-y-4">
                {substitutes.map((sub, i) => (
                  <li key={i} className="p-3 bg-white/20 rounded-lg">
                    <strong className="block font-semibold text-pink-800">{sub.name[langKey]}</strong>
                    <p className="text-sm text-pink-900/80">{sub.description[langKey]}</p>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && !error && (!substitutes || substitutes.length === 0) && (
              <p className="text-pink-900/70 text-center p-4">{t('noSubstitutesFound')}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAddToFavorites, onAddToShoppingList, onStartHandsFree, isFavorite, onRemix }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const [servings, setServings] = useState(recipe.servings);
  const [scaledIngredients, setScaledIngredients] = useState<Ingredient[]>(recipe.ingredients);
  const [activeTab, setActiveTab] = useState<'method' | 'nutrition' | 'fun' | 'pairings'>('method');
  const [isRemixing, setIsRemixing] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);


  useEffect(() => {
    setServings(recipe.servings);
    setScaledIngredients(recipe.ingredients);
    setActiveTab('method');
    audioService.playSuccess();
  }, [recipe]);


  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newServings = parseInt(e.target.value, 10);
    if (!isNaN(newServings) && newServings > 0) {
      setServings(newServings);
      const scale = newServings / recipe.servings;
      const quantityRegex = /^(\d*\.?\d+)/;

      const newIngredients = recipe.ingredients.map(ing => {
        // Parse the English amount as it's more likely to have a consistent number format
        const parsed = parseIngredient(ing.amount.en); 
        if (parsed) {
          const newQuantity = parsed.quantity * scale;
          const formattedQuantity = parseFloat(newQuantity.toFixed(2));
          
          const newAmountEn = ing.amount.en.replace(quantityRegex, String(formattedQuantity));
          const newAmountAr = ing.amount.ar.replace(quantityRegex, String(formattedQuantity));

          return { ...ing, amount: { en: newAmountEn, ar: newAmountAr } };
        }
        return ing;
      });
      setScaledIngredients(newIngredients);
    } else if (e.target.value === '') {
        setServings(0);
        setScaledIngredients(recipe.ingredients);
    }
  };

  const difficultyKey = recipe.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard';
  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500/80',
    medium: 'bg-yellow-500/80',
    hard: 'bg-red-500/80',
  };


  const renderTabContent = () => {
    switch (activeTab) {
        case 'method': return (
            <div className="space-y-4">
                 <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-pink-900">{t('ingredients')}</h3>
                     <motion.button
                      onClick={() => onAddToShoppingList(scaledIngredients)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/80 text-white text-sm font-semibold hover:bg-pink-500 transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <ListPlus className="w-4 h-4" /> {t('addToShoppingList')}
                    </motion.button>
                 </div>
                 <ul className="list-none list-inside columns-1 sm:columns-2 gap-x-8 text-pink-900/90 space-y-2">
                    {scaledIngredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 justify-between">
                        <span>{ing.amount[langKey]} {ing.name[langKey]}</span>
                        <motion.button
                          onClick={() => {
                            audioService.playPop();
                            setSelectedIngredient(ing);
                          }}
                          className="text-purple-500 hover:text-purple-400 p-1"
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Find substitutes for ${ing.name[langKey]}`}
                        >
                          <Wand2 size={16} />
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                  <hr className="border-white/30 my-6" />
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-pink-900">{t('preparationMethod')}</h3>
                    <motion.button
                        onClick={() => onStartHandsFree(recipe)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/90 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        <PlayCircle size={18} /> <span className="hidden sm:inline">{t('startCooking')}</span>
                    </motion.button>
                  </div>
                 <ol className="list-decimal list-inside space-y-4 text-pink-900/90">
                    {recipe.steps.map((step, i) => ( <li key={i}>{step[langKey]}</li> ))}
                 </ol>
            </div>
        );
        case 'nutrition': return (
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4">{t('nutritionFacts')}</h3>
                <ul className="space-y-2 text-pink-900/90">
                    {Object.entries(recipe.nutrition).map(([key, value]) => (
                        <li key={key} className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                            <span className="font-semibold">{t(key as keyof typeof recipe.nutrition)}</span>
                            <span>{value[langKey]}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
        case 'pairings': return (
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-pink-900 mb-6 text-center">{t('pairings')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recipe.pairings?.alcoholic && recipe.pairings.alcoholic.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-orange-600 mb-2 flex items-center gap-2">
                                <Wine size={20} /> {t('alcoholicPairings')}
                            </h4>
                            <ul className="space-y-4">
                                {recipe.pairings.alcoholic.map((p, i) => (
                                    <li key={`alc-${i}`} className="p-3 bg-white/20 rounded-lg">
                                        <strong className="block font-semibold text-pink-800">{p.name[langKey]}</strong>
                                        <p className="text-sm text-pink-900/80 mt-1">{p.description[langKey]}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {recipe.pairings?.nonAlcoholic && recipe.pairings.nonAlcoholic.length > 0 && (
                         <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-cyan-600 mb-2 flex items-center gap-2">
                                <GlassWater size={20} /> {t('nonAlcoholicPairings')}
                            </h4>
                            <ul className="space-y-4">
                                {recipe.pairings.nonAlcoholic.map((p, i) => (
                                     <li key={`non-alc-${i}`} className="p-3 bg-white/20 rounded-lg">
                                        <strong className="block font-semibold text-pink-800">{p.name[langKey]}</strong>
                                        <p className="text-sm text-pink-900/80 mt-1">{p.description[langKey]}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
        case 'fun': return (
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4">{t('funSection')}</h3>
                <div className="space-y-6 text-pink-900/90">
                    <div>
                        <h4 className="text-lg font-semibold text-orange-600 mb-2 flex items-center gap-2"><BrainCircuit size={20} /> {t('proTips')}</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {recipe.funStuff.proTips.map((tip, i) => <li key={i}>{tip[langKey]}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-orange-600 mb-2 flex items-center gap-2"><VenetianMask size={20} /> {t('foodJokes')}</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {recipe.funStuff.jokes.map((joke, i) => <li key={i}>{joke[langKey]}</li>)}
                        </ul>
                    </div>
                    <div>
                         <h4 className="text-lg font-semibold text-orange-600 mb-2 flex items-center gap-2"><BookOpen size={20} /> {t('historyCorner')}</h4>
                         <p>{recipe.funStuff.historyFact[langKey]}</p>
                    </div>
                </div>
            </div>
        );
    }
  }


  return (
    <>
      <AnimatePresence>
        {isRemixing && (
          <RemixModal
            onClose={() => { audioService.playPop(); setIsRemixing(false); }}
            onSubmit={(remixPrompt) => {
              onRemix(remixPrompt);
              setIsRemixing(false);
            }}
          />
        )}
        {selectedIngredient && (
          <SubstitutesModal
            ingredient={selectedIngredient}
            onClose={() => { audioService.playPop(); setSelectedIngredient(null); }}
            recipe={recipe}
            langKey={langKey}
          />
        )}
      </AnimatePresence>
      <motion.div
        variants={itemVariants}
        className="w-full max-w-7xl mx-auto space-y-6"
      >
        {/* Recipe Header with Image */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="relative aspect-video sm:aspect-[2.5/1] w-full">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.recipeName[langKey]} className="absolute inset-0 w-full h-full object-cover"/>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-400 to-orange-300"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
               <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-shadow-lg mb-2">{recipe.recipeName[langKey]}</h1>
               <p className="text-md sm:text-lg text-white/90 italic max-w-3xl text-shadow">{recipe.description[langKey]}</p>
            </div>
          </div>
          <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-pink-900/90 text-sm sm:text-base flex-wrap">
                <span>{t('prepTime')}: {recipe.prepTime[langKey]}</span>
                <span>{t('cookTime')}: {recipe.cookTime[langKey]}</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="servings-scaler">{t('servings')}:</label>
                  <input 
                    id="servings-scaler" type="number" min="1"
                    value={servings || ''} onChange={handleServingsChange}
                    className="bg-white/20 text-pink-900 rounded-md p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-900/50 border border-pink-500/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>{t('difficulty')}:</span>
                  <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${difficultyColors[difficultyKey] ?? 'bg-gray-400'}`}>
                      {t(difficultyKey)}
                  </span>
                </div>
              </div>
               <div className="flex justify-center gap-4 flex-wrap mt-6">
                  <motion.button
                    onClick={() => onAddToFavorites(recipe)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${ isFavorite ? 'bg-pink-500 text-white' : 'bg-black/10 text-pink-900 hover:bg-black/20' }`}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    <motion.span animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }} className="inline-block">
                      <Heart className="w-5 h-5" />
                    </motion.span>
                    {isFavorite ? t('inFavorites') : t('addToFavorites')}
                  </motion.button>
                  {recipe.youtubeLink && recipe.youtubeLink[langKey] && (
                      <motion.a
                          href={recipe.youtubeLink[langKey]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-red-500/90 text-white hover:bg-red-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      >
                          <Youtube className="w-5 h-5" />
                          {t('watchTutorial')}
                      </motion.a>
                  )}
                   <motion.button
                    onClick={() => { audioService.playPop(); setIsRemixing(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-purple-500/90 text-white hover:bg-purple-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wand2 className="w-5 h-5" />
                    {t('addYourTouch')}
                  </motion.button>
               </div>
          </div>
        </GlassCard>
        
        {/* Tabs and Content */}
         <GlassCard className="p-4 sm:p-6">
           <div className="flex justify-center items-center gap-1 sm:gap-4 mb-6">
              <TabButton active={activeTab === 'method'} onClick={() => setActiveTab('method')}><ChefHat size={18} /> {t('preparationMethod')}</TabButton>
              <TabButton active={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')}><Apple size={18} /> {t('nutritionFacts')}</TabButton>
              {recipe.pairings && (recipe.pairings.alcoholic.length > 0 || recipe.pairings.nonAlcoholic.length > 0) && (
                <TabButton active={activeTab === 'pairings'} onClick={() => setActiveTab('pairings')}><Wine size={18} /> {t('pairings')}</TabButton>
              )}
              <TabButton active={activeTab === 'fun'} onClick={() => setActiveTab('fun')}><VenetianMask size={18} /> {t('funSection')}</TabButton>
           </div>
           <AnimatePresence mode="wait">
              <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
              >
                  {renderTabContent()}
              </motion.div>
           </AnimatePresence>
         </GlassCard>
      </motion.div>
    </>
  );
};

export default RecipeCard;
