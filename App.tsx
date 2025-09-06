import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Components
import SplashScreen from './components/SplashScreen';
import ParticleBackground from './components/AuroraBackground';
import GlassCard from './components/GlassCard';
import Logo from './components/Logo';
import LanguageSwitcher from './components/LanguageSwitcher';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import LoadingOverlay from './components/LoadingOverlay';
import ShoppingList from './components/ShoppingList';
import FavoritesList from './components/FavoritesList';
import OnboardingTutorial from './components/OnboardingTutorial';
import WhatsNewModal from './components/WhatsNewModal';
import PantryManager from './components/PantryManager';
import ImageCaptureModal from './components/ImageCaptureModal';
import MenuCard from './components/MenuCard';
import MealPlanCard from './components/MealPlanCard';
import RecipeOfTheDay from './components/RecipeOfTheDay';
import MonthlyFestival from './components/MonthlyFestival';
import Footer from './components/Footer';
import HandsFreeCookingMode from './components/HandsFreeCookingMode';

// Hooks
import useLocalStorage from './hooks/useLocalStorage';
import { useToast } from './contexts/ToastContext';
import { useBlobUrl } from './hooks/useBlobUrl';

// Services
import * as geminiService from './services/geminiService';
import { audioService } from './services/audioService';

// Types
import type { Recipe, LoadingMessages, PantryItem, Menu, MealPlan } from './types';

// Utils
import { getYouTubeEmbedUrl } from './utils/youtubeParser';
import { parseIngredient } from './utils/ingredientParser';

// Icons
import { Clock, Users, Utensils, Heart, Plus, Edit, Youtube, BookOpen, UtensilsCrossed } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  onAddToShoppingList: (ingredients: string[]) => void;
  onToggleFavorite: (recipeId: string) => void;
  isFavorite: boolean;
  onRemix: (recipe: Recipe) => void;
}

// FIX: Define RecipeDetail component locally within App.tsx to avoid creating a new file,
// resolving the missing module issue while adhering to project constraints.
const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onAddToShoppingList, onToggleFavorite, isFavorite, onRemix }) => {
    const { i18n, t } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const embedUrl = getYouTubeEmbedUrl(recipe.youtubeUrl || '');
    const [isCookingMode, setIsCookingMode] = useState(false);
    const blobImageUrl = useBlobUrl(recipe.imageUrl);
    const [servings, setServings] = useState(recipe.servings);

    const scaleIngredient = (amount: string, originalServings: number, newServings: number): string => {
        const parsed = parseIngredient(amount);
        if (!parsed || originalServings === 0) return amount;
        const newQuantity = (parsed.quantity / originalServings) * newServings;
        let displayQuantity: string;
        if (newQuantity < 1) displayQuantity = newQuantity.toFixed(2).replace(/\.?0+$/, "");
        else if (newQuantity < 10) displayQuantity = newQuantity.toFixed(1).replace(/\.0$/, "");
        else displayQuantity = Math.round(newQuantity).toString();
        return `${displayQuantity} ${parsed.unit}`;
    };

    const handleServingsChange = (newServings: number) => {
        if (newServings > 0) setServings(newServings);
    };
    
    if(!recipe) return null;

    return (
    <>
      <motion.div layoutId={`recipe-${recipe.id}`} className="w-full">
        <GlassCard className="overflow-hidden p-4 sm:p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-stone-100">{recipe.title[langKey]}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-100/70">
                        <span className="flex items-center gap-1.5"><Utensils size={14}/> {recipe.cuisine[langKey]}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {recipe.cookTime[langKey]}</span>
                    </div>
                    <p className="text-stone-100/80">{recipe.description[langKey]}</p>
                    <div className="flex gap-2 pt-2 flex-wrap">
                        <motion.button onClick={() => { audioService.playPop(); onAddToShoppingList(recipe.ingredients.map(i => `${scaleIngredient(i.amount[langKey], recipe.servings, servings)} ${i.name[langKey]}`)); }} className="flex-1 min-w-[120px] text-sm flex items-center justify-center gap-2 p-2 bg-black/30 rounded-lg hover:bg-black/50" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                            <Plus size={16}/> {t('shoppingList')}
                        </motion.button>
                        <motion.button onClick={() => onToggleFavorite(recipe.id)} className={`flex-1 min-w-[120px] text-sm flex items-center justify-center gap-2 p-2 rounded-lg ${isFavorite ? 'bg-rose-500/80 text-white' : 'bg-black/30'}`} whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                            <Heart size={16} fill={isFavorite ? 'currentColor': 'none'}/> {isFavorite ? t('Favorited') : t('Favorite')}
                        </motion.button>
                        <motion.button onClick={() => onRemix(recipe)} className="flex-1 min-w-[120px] text-sm flex items-center justify-center gap-2 p-2 bg-black/30 rounded-lg hover:bg-black/50" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                            <Edit size={16}/> {t('remix')}
                        </motion.button>
                    </div>
                    <motion.button onClick={() => setIsCookingMode(true)} className="w-full text-md flex items-center justify-center gap-2 p-3 bg-teal-500 text-white rounded-lg mt-2" whileHover={{scale: 1.02}} whileTap={{scale:0.98}}>
                        <BookOpen size={20}/> {t('startCooking')}
                    </motion.button>
                </div>
                {blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? (
                    <div className="aspect-video rounded-lg overflow-hidden"><img src={blobImageUrl} alt={recipe.title[langKey]} className="w-full h-full object-cover"/></div>
                ) : (
                    <div className="aspect-video rounded-lg bg-black/20 flex items-center justify-center text-amber-500/50"><Utensils size={64} /></div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-amber-300/10">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-amber-300">{t('ingredients')}</h3>
                         <div className="flex items-center gap-2">
                            <label htmlFor="servings" className="text-sm text-stone-100/80 flex items-center gap-1"><Users size={16}/> {t('Servings')}:</label>
                            <input type="number" id="servings" value={servings} onChange={(e) => handleServingsChange(parseInt(e.target.value, 10))} className="w-16 p-1 bg-black/30 border border-amber-400/30 rounded-md text-center" min="1"/>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, index) => (
                            <li key={index} className="flex gap-2 items-baseline">
                               <span className="text-amber-400">&bull;</span>
                               <span className="text-stone-100/90">
                                   <strong>{scaleIngredient(ing.amount[langKey], recipe.servings, servings)}</strong> {ing.name[langKey]}
                               </span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-xl font-bold text-amber-300 mb-4">{t('Steps')}</h3>
                    <ol className="space-y-4">
                        {recipe.steps.map((step, index) => (
                             <li key={index} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/30 rounded-full text-amber-300 font-bold">{index + 1}</div>
                                <p className="text-stone-100/90 pt-1">{step.text[langKey]}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            {embedUrl && (
                <div className="pt-4 border-t border-amber-300/10">
                    <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2"><Youtube /> {t('Tutorial')}</h3>
                    <div className="aspect-video"><iframe className="w-full h-full rounded-lg" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
                </div>
            )}
        </GlassCard>
      </motion.div>
      <AnimatePresence>{isCookingMode && <HandsFreeCookingMode recipe={recipe} onClose={() => setIsCookingMode(false)} />}</AnimatePresence>
    </>
    );
}

const LATEST_VERSION_SEEN = 'v3.0.0';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', []);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<LoadingMessages | null>(null);
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>('shoppingList', []);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantryItems', []);
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [isImageCaptureOpen, setIsImageCaptureOpen] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
  const [showOnboarding, setShowOnboarding] = useLocalStorage('onboardingComplete', true);
  const [lastVersionSeen, setLastVersionSeen] = useLocalStorage('lastVersionSeen', '0.0.0');
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!showOnboarding && lastVersionSeen < LATEST_VERSION_SEEN) {
        setShowWhatsNew(true);
    }
  }, [showOnboarding, lastVersionSeen]);
  
   useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      try {
        const recipe = await geminiService.generateRecipe("Surprise me with something popular and delicious", "random", "none", "Recipe of the Day");
        if (recipe) setRecipeOfTheDay(recipe);
      } catch (error) {
        console.error("Failed to fetch Recipe of the Day:", error);
      }
    };
    if(!recipeOfTheDay) fetchRecipeOfTheDay();
   }, [recipeOfTheDay]);

  const handleGenerateRecipe = async (ingredients: string, cuisine: string, diet: string, name?: string) => {
    setLoading('generating');
    setSelectedRecipe(null); setMenu(null); setMealPlan(null);
    try {
      const newRecipe = await geminiService.generateRecipe(ingredients, cuisine, diet, name);
      if (newRecipe) {
        setRecipes(prev => [newRecipe, ...prev].slice(0, 10));
        setSelectedRecipe(newRecipe);
        addToast(t('toastRecipeGenerated'), 'success');
      } else throw new Error("Recipe generation returned null");
    } catch (error) {
      console.error(error);
      addToast(t('toastError'), 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => setSelectedRecipe(recipe);
  
  const handleAddToShoppingList = (items: string[]) => {
      const newItems = items.filter(item => !shoppingList.includes(item));
      setShoppingList(prev => [...prev, ...newItems]);
      addToast(t('toastShoppingListAdded', { count: newItems.length }), 'success');
      audioService.playSuccess();
  }

  const handleToggleFavorite = (recipeId: string) => {
      const recipe = recipes.find(r => r.id === recipeId) || favorites.find(r => r.id === recipeId) || (selectedRecipe?.id === recipeId ? selectedRecipe : null);
      if(!recipe) return;
      if (favorites.some(fav => fav.id === recipeId)) {
          setFavorites(prev => prev.filter(fav => fav.id !== recipeId));
          addToast(t('toastFavoriteRemoved'), 'info');
      } else {
          setFavorites(prev => [recipe, ...prev]);
          addToast(t('toastFavoriteAdded'), 'success');
      }
  }
  
  const handleDeleteFavorite = (recipeId: string) => {
       setFavorites(prev => prev.filter(fav => fav.id !== recipeId));
       addToast(t('toastFavoriteRemoved'), 'info');
  }
  
  const handleRemix = (recipe: Recipe) => {
    setSelectedRecipe(null); setMenu(null); setMealPlan(null);
    addToast(t('toastRemixPrompt'), 'info');
  }
  
  const handlePantryChallenge = async () => {
    setIsPantryOpen(false); setLoading('generating');
    const pantryIngredients = pantryItems.map(item => item.name).join(', ');
    try {
        const recipe = await geminiService.generateRecipe(pantryIngredients, 'random', 'none');
        if (recipe) {
             setRecipes(prev => [recipe, ...prev].slice(0, 10));
             setSelectedRecipe(recipe);
             addToast(t('toastPantryChallengeSuccess'), 'success');
        } else throw new Error("Pantry challenge failed");
    } catch (error) {
        addToast(t('toastError'), 'error');
    } finally {
        setLoading(null);
    }
  }

  const handleImageAnalysis = async (base64Image: string) => {
      setIsImageCaptureOpen(false); setLoading('analyzing');
      addToast('Image analysis not implemented yet.', 'info');
      setLoading(null);
  }
  
   const handlePlanMenu = async (occasion: string) => {
        setLoading('planningMenu'); setSelectedRecipe(null); setMealPlan(null);
        try {
            const newMenu = await geminiService.generateMenuForOccasion(occasion);
            if (newMenu) {
                setMenu(newMenu);
                addToast(t('toastMenuGenerated'), 'success');
            } else throw new Error("Menu generation failed");
        } catch (error) {
            addToast(t('toastError'), 'error');
        } finally {
            setLoading(null);
        }
    }
  
    const handleLeftoverRemix = async (leftovers: string) => {
        setLoading('remixingLeftovers'); setSelectedRecipe(null); setMenu(null); setMealPlan(null);
        try {
            const newRecipe = await geminiService.generateRecipe(leftovers, 'random', 'none');
            if (newRecipe) {
                setRecipes(prev => [newRecipe, ...prev].slice(0,10));
                setSelectedRecipe(newRecipe);
                addToast(t('toastRecipeGenerated'), 'success');
            } else throw new Error("Leftover remix failed");
        } catch (error) {
            addToast(t('toastError'), 'error');
        } finally {
            setLoading(null);
        }
    }
    
    const handlePlanWeek = async (goals: string) => {
        setLoading('planningWeek');
        addToast('Weekly planning not implemented yet.', 'info');
        setLoading(null);
    }

  if (showSplash) return <SplashScreen />;
  
  const isResultView = !!selectedRecipe || !!menu || !!mealPlan;
  
  const resetToHome = () => {
      setSelectedRecipe(null); setMenu(null); setMealPlan(null);
      audioService.playSwoosh();
  }

  return (
    <>
        <ParticleBackground />
        <AnimatePresence>
            {showOnboarding && <OnboardingTutorial onFinish={() => setShowOnboarding(false)} />}
            {showWhatsNew && <WhatsNewModal onClose={() => { setShowWhatsNew(false); setLastVersionSeen(LATEST_VERSION_SEEN); }} />}
        </AnimatePresence>
        <div className="min-h-screen text-stone-100 flex flex-col relative p-4 sm:p-6 md:p-8">
            <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-8">
                <div className="flex items-center gap-3"><Logo className="w-10 h-10 text-amber-300" /><h1 className="text-xl font-bold">{t('appName')}</h1></div>
                <div className="flex items-center gap-3">
                    <motion.button onClick={() => { setShowFavorites(true); audioService.playClick();}} className="p-2" whileHover={{scale: 1.1}} whileTap={{scale:0.95}} aria-label={t('myFavorites')}><Heart /></motion.button>
                    <motion.button onClick={() => { setIsPantryOpen(true); audioService.playClick();}} className="p-2" whileHover={{scale: 1.1}} whileTap={{scale:0.95}} aria-label={t('myPantry')}><UtensilsCrossed /></motion.button>
                    <LanguageSwitcher />
                </div>
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                <AnimatePresence mode="wait">
                    {isResultView ? (
                        <motion.div key="results" className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <button onClick={resetToHome} className="mb-4 text-amber-300">{`< ${t('backToSearch')}`}</button>
                            {selectedRecipe && <RecipeDetail recipe={selectedRecipe} onAddToShoppingList={handleAddToShoppingList} onToggleFavorite={handleToggleFavorite} isFavorite={favorites.some(f => f.id === selectedRecipe.id)} onRemix={handleRemix} />}
                            {menu && <MenuCard menu={menu} onRecipeSelect={handleSelectRecipe} />}
                            {mealPlan && <MealPlanCard mealPlan={mealPlan} onRecipeSelect={handleSelectRecipe} />}
                        </motion.div>
                    ) : (
                        <motion.div key="form" className="w-full flex flex-col items-center gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <RecipeForm onGenerate={handleGenerateRecipe} isGenerating={!!loading} onAnalyzeImage={() => setIsImageCaptureOpen(true)} onPlanMenu={handlePlanMenu} onPlanWeek={handlePlanWeek} onLeftoverRemix={handleLeftoverRemix} />
                            {recipeOfTheDay && <RecipeOfTheDay recipe={recipeOfTheDay} onRecipeSelect={handleSelectRecipe} />}
                            <MonthlyFestival onIdeaClick={(idea) => handleGenerateRecipe(idea, 'random', 'none')} />
                            {recipes.length > 0 && !selectedRecipe && (
                                <div className="w-full max-w-4xl space-y-4">
                                    <h2 className="text-xl font-bold text-center">{t('recentCreations')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {recipes.map(r => <RecipeCard key={r.id} recipe={r} onSelect={handleSelectRecipe} onToggleFavorite={handleToggleFavorite} isFavorite={favorites.some(fav => fav.id === r.id)} />)}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
            <ShoppingList items={shoppingList} onClear={() => setShoppingList([])} onUpdateItems={setShoppingList} />
            <AnimatePresence>
                {loading && <LoadingOverlay type={loading} />}
                {showFavorites && <FavoritesList favorites={favorites} onClose={() => setShowFavorites(false)} onSelectRecipe={(r) => { setSelectedRecipe(r); setShowFavorites(false); }} onDeleteFavorite={handleDeleteFavorite} />}
                {isPantryOpen && <PantryManager isOpen={isPantryOpen} onClose={() => setIsPantryOpen(false)} pantryItems={pantryItems} onUpdatePantry={setPantryItems} onPantryChallenge={handlePantryChallenge} />}
                {isImageCaptureOpen && <ImageCaptureModal isOpen={isImageCaptureOpen} onClose={() => setIsImageCaptureOpen(false)} onCapture={handleImageAnalysis} />}
            </AnimatePresence>
        </div>
    </>
  );
};
export default App;