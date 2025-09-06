import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// FIX: Import GoogleGenAI for image analysis as it's not exported from the service.
import { GoogleGenAI } from "@google/genai";
import { Heart, Archive, GraduationCap, X, Utensils, Clock, Users, Youtube, Edit, BookOpen, Plus, Soup, Star, IceCream, BrainCircuit, Lightbulb, GlassWater, ChevronLeft, ChevronRight, Minus, Check } from 'lucide-react';

// Components
import SplashScreen from './components/SplashScreen';
import ParticleBackground from './components/AuroraBackground';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import LoadingOverlay from './components/LoadingOverlay';
import FavoritesList from './components/FavoritesList';
import ShoppingList from './components/ShoppingList';
import PantryManager from './components/PantryManager';
import ImageCaptureModal from './components/ImageCaptureModal';
import MenuCard from './components/MenuCard';
import MealPlanCard from './components/MealPlanCard';
import RecipeOfTheDay from './components/RecipeOfTheDay';
import MonthlyFestival from './components/MonthlyFestival';
import LanguageSwitcher from './components/LanguageSwitcher';
import Logo from './components/Logo';
import OnboardingTutorial from './components/OnboardingTutorial';
import WhatsNewModal from './components/WhatsNewModal';
import Footer from './components/Footer';
import HandsFreeCookingMode from './components/HandsFreeCookingMode';
import ChefsAcademy from './components/ChefsAcademy';
import GlassCard from './components/GlassCard';
import PantryCheckModal from './components/PantryCheckModal';

// Services
import * as geminiService from './services/geminiService';
import { audioService } from './services/audioService';

// Hooks
import useLocalStorage from './hooks/useLocalStorage';
import { useToast } from './contexts/ToastContext';
import { useBlobUrl } from './hooks/useBlobUrl';

// Types
import type { Recipe, LoadingMessages, PantryItem, Menu, MealPlan, MultilingualString, Ingredient } from './types';

// Utils
import { getYouTubeEmbedUrl } from './utils/youtubeParser';
import { parseIngredient } from './utils/ingredientParser';

// Data
import { changelog } from './data/changelog';


const LATEST_VERSION = changelog[0].version;

// FIX: Initialize Gemini AI client for image analysis as it's not exported from the service.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A simple component for displaying extra recipe info fetched on demand
const InfoCard: React.FC<{ title: string; icon: React.ElementType; content: MultilingualString | null; isLoading: boolean }> = ({ title, icon: Icon, content, isLoading }) => {
    const { i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    return (
        <GlassCard className="p-4 space-y-2 bg-black/20">
            <h4 className="font-semibold text-amber-300 flex items-center gap-2"><Icon size={18} /> {title}</h4>
            <div className="text-sm text-stone-100/80 min-h-[40px]">
                {isLoading ? '...' : content ? content[langKey] : ''}
            </div>
        </GlassCard>
    );
};


// The main view for a single recipe, handling details, scaling, and actions.
const RecipeDetailView: React.FC<{ recipe: Recipe, onBack: () => void, onToggleFavorite: (id: string) => void, isFavorite: boolean, onAddToShoppingList: (items: string[]) => void, onRemix: (recipe: Recipe) => void, onStartCooking: (recipe: Recipe) => void }> =
    ({ recipe, onBack, onToggleFavorite, isFavorite, onAddToShoppingList, onRemix, onStartCooking }) => {

    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const { addToast } = useToast();

    const [servings, setServings] = useState(recipe.servings);
    const [substitutions, setSubstitutions] = useState<MultilingualString | null>(null);
    const [nutritionInfo, setNutritionInfo] = useState<MultilingualString | null>(null);
    const [trivia, setTrivia] = useState<MultilingualString | null>(null);
    const [drinks, setDrinks] = useState<MultilingualString | null>(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState< 'substitutions' | 'nutrition' | 'trivia' | 'drinks' | false>(false);

    const blobImageUrl = useBlobUrl(recipe.imageUrl);
    const embedUrl = useMemo(() => getYouTubeEmbedUrl(recipe.youtubeUrl || ''), [recipe.youtubeUrl]);

    const handleGetInfo = useCallback(async (infoType: 'substitutions' | 'nutrition' | 'trivia' | 'drinks') => {
        if (isLoadingInfo) return;
        setIsLoadingInfo(infoType);
        try {
            let result: MultilingualString | null = null;
            if (infoType === 'substitutions') {
                result = await geminiService.generateSubstitutions(recipe.ingredients);
                setSubstitutions(result);
            } else {
                result = await geminiService.getExtraRecipeInfo(recipe.title.en, infoType);
                if (infoType === 'nutrition') setNutritionInfo(result);
                if (infoType === 'trivia') setTrivia(result);
                if (infoType === 'drinks') setDrinks(result);
            }
        } catch (error) {
            console.error(`Failed to fetch ${infoType}`, error);
            addToast(t('toastError'), 'error');
        } finally {
            setIsLoadingInfo(false);
        }
    }, [recipe.ingredients, recipe.title.en, t, addToast, isLoadingInfo]);

    const scaledIngredients = useMemo(() => {
        if (servings === recipe.servings) return recipe.ingredients;
        const scaleFactor = servings / recipe.servings;
        return recipe.ingredients.map(ing => {
            const scaleAmount = (amountStr: string) => {
                const parsed = parseIngredient(amountStr);
                 if (parsed && parsed.quantity > 0) {
                    const newQuantity = parsed.quantity * scaleFactor;
                    // Handle fractions and clean up decimals
                    const formattedQuantity = Number.isInteger(newQuantity) ? newQuantity : newQuantity.toFixed(1).replace(/\.0$/, '');
                    return `${formattedQuantity} ${parsed.unit}`;
                }
                return amountStr;
            };
            
            return { 
                ...ing, 
                amount: { 
                    en: scaleAmount(ing.amount.en), 
                    ar: scaleAmount(ing.amount.ar) 
                } 
            };
        });
    }, [servings, recipe.ingredients, recipe.servings]);


    return (
        <motion.div
            layoutId={`recipe-${recipe.id}`}
            className="w-full max-w-4xl mx-auto p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <GlassCard className="p-4 sm:p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <motion.button whileHover={{x: -5}} onClick={onBack} className="flex items-center gap-2 text-amber-300">
                        <ChevronLeft /> {t('backToSearch')}
                    </motion.button>
                    <motion.button
                        onClick={() => onToggleFavorite(recipe.id)}
                        className={`p-2 rounded-full ${isFavorite ? 'bg-rose-500 text-white' : 'bg-black/40 text-stone-100/80'}`}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>
                </div>
                
                {blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? (
                    <img src={blobImageUrl} alt={recipe.title[langKey]} className="w-full h-64 object-cover rounded-lg" />
                ) : (
                     <div className="w-full h-64 bg-black/20 rounded-lg flex items-center justify-center text-amber-500/50">
                        <Utensils size={64} />
                    </div>
                )}
                
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-stone-100">{recipe.title[langKey]}</h1>
                    <p className="text-stone-100/80 max-w-2xl mx-auto">{recipe.description[langKey]}</p>
                </div>
                
                <div className="flex justify-center flex-wrap gap-4 sm:gap-8 text-stone-100/80">
                    <div className="flex items-center gap-2"><Utensils size={16} /> {recipe.cuisine[langKey]}</div>
                    <div className="flex items-center gap-2"><Clock size={16} /> {recipe.cookTime[langKey]}</div>
                    <div className="flex items-center gap-2"><Users size={16} /> 
                         <motion.button whileTap={{scale:0.9}} onClick={() => setServings(s => Math.max(1, s - 1))} className="p-1 bg-black/20 rounded-full"><Minus size={14}/></motion.button>
                         <span>{servings} {t('Servings')}</span>
                         <motion.button whileTap={{scale:0.9}} onClick={() => setServings(s => s + 1)} className="p-1 bg-black/20 rounded-full"><Plus size={14}/></motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-amber-300/10">
                    <motion.button onClick={() => onAddToShoppingList(scaledIngredients.map(i => `${i.amount[langKey]} ${i.name[langKey]}`))} className="flex-1 text-lg flex items-center justify-center gap-2 p-3 bg-black/30 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                        <Plus size={20}/> {t('shoppingList')}
                    </motion.button>
                     <motion.button onClick={() => onRemix(recipe)} className="flex-1 text-lg flex items-center justify-center gap-2 p-3 bg-black/30 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                        <Edit size={20}/> {t('remix')}
                    </motion.button>
                     <motion.button onClick={() => onStartCooking(recipe)} className="flex-1 text-lg flex items-center justify-center gap-2 p-3 bg-teal-500 text-white rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                        <BookOpen size={20}/> {t('startCooking')}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-amber-300 mb-4">{t('ingredients')}</h3>
                        <ul className="space-y-2">
                        {scaledIngredients.map((ing, i) => (
                            <li key={i} className="flex gap-3 items-start p-2 bg-black/10 rounded-md">
                                <Check className="text-amber-400 mt-1 flex-shrink-0" size={16}/>
                                <div>
                                    <span className="font-semibold text-stone-100">{ing.name[langKey]}</span>
                                    <span className="text-stone-100/70"> - {ing.amount[langKey]}</span>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold text-amber-300 mb-4">{t('Steps')}</h3>
                        <ol className="space-y-4">
                        {recipe.steps.map((step, i) => (
                             <li key={i} className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/20 text-amber-300 font-bold rounded-full">{i + 1}</div>
                                <p className="text-stone-100/90 pt-1">{step.text[langKey]}</p>
                            </li>
                        ))}
                        </ol>
                    </div>
                </div>
                
                {embedUrl && (
                     <div className="pt-4 border-t border-amber-300/10">
                        <h3 className="text-2xl font-bold text-amber-300 mb-4 text-center">{t('Tutorial')}</h3>
                         <div className="aspect-video">
                            <iframe
                                className="w-full h-full rounded-lg"
                                src={embedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-amber-300/10 space-y-4">
                    <motion.button onClick={() => handleGetInfo('substitutions')} className="w-full p-2 text-center text-amber-300 bg-black/20 rounded-lg">{t('suggestSubstitutions')}</motion.button>
                    <AnimatePresence>
                        {substitutions && <InfoCard title={t('substitutionsModalTitle')} icon={Soup} content={substitutions} isLoading={isLoadingInfo === 'substitutions'} />}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button onClick={() => handleGetInfo('nutrition')} className="w-full p-2 text-center text-amber-300 bg-black/20 rounded-lg">{t('nutritionalInfo')}</motion.button>
                        <motion.button onClick={() => handleGetInfo('trivia')} className="w-full p-2 text-center text-amber-300 bg-black/20 rounded-lg">{t('funFacts')}</motion.button>
                        <motion.button onClick={() => handleGetInfo('drinks')} className="w-full p-2 text-center text-amber-300 bg-black/20 rounded-lg">{t('suggestedDrinks')}</motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <AnimatePresence>
                            {nutritionInfo && <InfoCard title={t('nutritionalInfo')} icon={BrainCircuit} content={nutritionInfo} isLoading={isLoadingInfo === 'nutrition'} />}
                         </AnimatePresence>
                         <AnimatePresence>
                            {trivia && <InfoCard title={t('funFacts')} icon={Lightbulb} content={trivia} isLoading={isLoadingInfo === 'trivia'} />}
                         </AnimatePresence>
                         <AnimatePresence>
                            {drinks && <InfoCard title={t('suggestedDrinks')} icon={GlassWater} content={drinks} isLoading={isLoadingInfo === 'drinks'} />}
                         </AnimatePresence>
                    </div>
                </div>

            </GlassCard>
        </motion.div>
    );
};

function App() {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const { addToast } = useToast();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingMessages | false>(false);
  
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
  
  const [recentRecipes, setRecentRecipes] = useLocalStorage<Recipe[]>('recentRecipes', []);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>('shoppingList', []);
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantryItems', []);
  const [hasOnboarded, setHasOnboarded] = useLocalStorage('hasOnboarded', false);
  const [lastSeenVersion, setLastSeenVersion] = useLocalStorage('lastSeenVersion', '0.0.0');

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [isImageCaptureOpen, setIsImageCaptureOpen] = useState(false);
  const [isHandsFreeOpen, setIsHandsFreeOpen] = useState(false);
  const [isChefsAcademyOpen, setIsChefsAcademyOpen] = useState(false);
  const [isPantryCheckOpen, setIsPantryCheckOpen] = useState<Recipe | null>(null);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!recipeOfTheDay) {
        try {
          const recipe = await geminiService.generateRecipe(t('form.randomPrompt'), 'random', 'none');
          if (recipe) setRecipeOfTheDay(recipe);
        } catch (error) {
          console.error("Failed to fetch Recipe of the Day:", error);
        }
      }
    };
    init();
    
    setTimeout(() => {
        if (!hasOnboarded) {
            setShowOnboarding(true);
        } else if (lastSeenVersion < LATEST_VERSION) {
            setShowWhatsNew(true);
        }
        setIsInitialized(true)
    }, 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleBackToSearch = useCallback(() => {
    audioService.playSwoosh();
    setCurrentRecipe(null);
    setCurrentMenu(null);
    setCurrentMealPlan(null);
  }, []);

  const handleGenerateRecipe = useCallback(async (ingredients: string, cuisine: string, diet: string, name?: string, remixRecipe?: Recipe, availableIngredients?: string[]) => {
    setIsLoading(remixRecipe ? (availableIngredients ? 'remixingLeftovers' : 'remixing') : 'generating');
    handleBackToSearch();
    try {
      const recipe = await geminiService.generateRecipe(ingredients, cuisine, diet, name, remixRecipe, availableIngredients);
      if (recipe) {
        addToast(t('toastRecipeGenerated'), 'success');
        setCurrentRecipe(recipe);
        setRecentRecipes(prev => [recipe, ...prev.filter(r => r.id !== recipe.id)].slice(0, 10));
      } else {
        throw new Error("Recipe generation failed.");
      }
    } catch (error) {
      console.error(error);
      addToast(t('toastError'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, setRecentRecipes, t, handleBackToSearch]);

  const handlePlanMenu = useCallback(async (occasion: string) => {
    setIsLoading('planningMenu');
    handleBackToSearch();
    try {
      const menu = await geminiService.generateMenuForOccasion(occasion);
      if (menu) {
        addToast(t('toastMenuGenerated'), 'success');
        setCurrentMenu(menu);
      } else {
        throw new Error("Menu generation failed.");
      }
    } catch (error) {
      addToast(t('toastError'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, handleBackToSearch]);

  const handlePlanWeek = useCallback(async (goals: string) => {
    // This function is not implemented in geminiService.ts, but let's assume it exists for UI purposes
    console.log("Planning week with goals:", goals);
    addToast("Weekly planning coming soon!", 'info');
  }, [addToast]);

  const handleLeftoverRemix = useCallback(async (leftovers: string) => {
    handleGenerateRecipe(leftovers, 'random', 'none');
  }, [handleGenerateRecipe]);
  
  const handleAnalyzeImage = useCallback(() => setIsImageCaptureOpen(true), []);

  const handleImageCapture = useCallback(async (imageDataUrl: string) => {
    setIsImageCaptureOpen(false);
    setIsLoading('analyzing');
    try {
        const base64Data = imageDataUrl.split(',')[1];
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                { text: 'Identify the food ingredients in this image. List them clearly in a single comma-separated string.' }
            ]},
        });
        const ingredients = response.text;
        await handleGenerateRecipe(ingredients, 'random', 'none');
    } catch (error) {
        console.error("Image analysis failed:", error);
        addToast(t('toastError'), 'error');
    } finally {
        setIsLoading(false);
    }
  }, [handleGenerateRecipe, addToast, t]);

  const handleToggleFavorite = useCallback((recipeId: string) => {
    const allRecipes = [currentRecipe, recipeOfTheDay, ...recentRecipes, ...favorites].filter((r): r is Recipe => r !== null);
    const recipe = allRecipes.find(r => r?.id === recipeId);
    if (!recipe) return;

    setFavorites(favs => {
        if (favs.some(f => f.id === recipeId)) {
            addToast(t('toastFavoriteRemoved'), 'info');
            return favs.filter(f => f.id !== recipeId);
        } else {
            addToast(t('toastFavoriteAdded'), 'success');
            return [recipe, ...favs];
        }
    });
  }, [setFavorites, addToast, t, recentRecipes, currentRecipe, recipeOfTheDay, favorites]);
  
  const handleAddToShoppingList = useCallback((items: string[]) => {
    setShoppingList(prev => [...new Set([...prev, ...items])]);
    addToast(t('toastShoppingListAdded', { count: items.length }), 'success');
  }, [setShoppingList, addToast, t]);
  
  const handlePantryChallenge = useCallback(() => {
      setIsPantryOpen(false);
      if(pantryItems.length === 0) return;
      const ingredients = pantryItems.map(i => i.name).join(', ');
      handleGenerateRecipe(ingredients, 'random', 'none');
      addToast(t('toastPantryChallengeSuccess'), 'success');
  }, [pantryItems, handleGenerateRecipe, addToast, t]);

  const handleFestivalIdeaClick = (idea: string) => {
    handleGenerateRecipe('', 'random', 'none', idea);
  }
  
  const selectRecipe = useCallback((recipe: Recipe) => {
      setCurrentRecipe(recipe);
      setCurrentMenu(null);
      setCurrentMealPlan(null);
  }, []);


  const renderContent = () => {
    if (currentRecipe) {
      return <RecipeDetailView
                recipe={currentRecipe}
                onBack={handleBackToSearch}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.id === currentRecipe.id)}
                onAddToShoppingList={handleAddToShoppingList}
                onRemix={() => setIsPantryCheckOpen(currentRecipe)}
                onStartCooking={() => setIsHandsFreeOpen(true)}
            />;
    }
    if (currentMenu) {
      return <MenuCard menu={currentMenu} onRecipeSelect={selectRecipe} />;
    }
    if (currentMealPlan) {
      return <MealPlanCard mealPlan={currentMealPlan} onRecipeSelect={selectRecipe} />;
    }
    return (
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 space-y-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <RecipeForm
            onGenerate={(...args) => handleGenerateRecipe(...args)}
            onAnalyzeImage={handleAnalyzeImage}
            onPlanMenu={handlePlanMenu}
            onPlanWeek={handlePlanWeek}
            onLeftoverRemix={handleLeftoverRemix}
            isGenerating={!!isLoading}
        />
        <div className="space-y-8">
            {recipeOfTheDay && <RecipeOfTheDay recipe={recipeOfTheDay} onRecipeSelect={selectRecipe} />}
            <MonthlyFestival onIdeaClick={handleFestivalIdeaClick} />
            {recentRecipes.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-stone-100/90 mb-4 text-center">{t('recentCreations')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {recentRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id} recipe={recipe} onSelect={selectRecipe}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={favorites.some(f => f.id === recipe.id)}
                                onAddToShoppingList={(ingredients) => handleAddToShoppingList(ingredients)}
                                onRemix={() => setIsPantryCheckOpen(recipe)}
                                onStartCooking={selectRecipe}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {!isInitialized && <SplashScreen />}
      </AnimatePresence>
      <ParticleBackground />
      
      <div className={`min-h-screen flex flex-col text-stone-100 font-sans transition-opacity duration-1000 ${isInitialized ? 'opacity-100' : 'opacity-0'}`}>
        <header className="w-full max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Logo className="w-12 h-12 text-amber-300" />
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => setIsFavoritesOpen(true)} className="p-2 bg-black/20 rounded-lg"><Heart /></motion.button>
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => setIsPantryOpen(true)} className="p-2 bg-black/20 rounded-lg"><Archive /></motion.button>
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => setIsChefsAcademyOpen(true)} className="p-2 bg-black/20 rounded-lg"><GraduationCap /></motion.button>
          </div>
        </header>
        
        <main className="flex-grow py-8">
           <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>

      <AnimatePresence>
        {isLoading && <LoadingOverlay type={isLoading} />}
        {isFavoritesOpen && <FavoritesList favorites={favorites} onClose={() => setIsFavoritesOpen(false)} onSelectRecipe={(r) => {selectRecipe(r); setIsFavoritesOpen(false);}} onDeleteFavorite={handleToggleFavorite} />}
        {isPantryOpen && <PantryManager isOpen={isPantryOpen} onClose={() => setIsPantryOpen(false)} pantryItems={pantryItems} onUpdatePantry={setPantryItems} onPantryChallenge={handlePantryChallenge} />}
        {isImageCaptureOpen && <ImageCaptureModal isOpen={isImageCaptureOpen} onClose={() => setIsImageCaptureOpen(false)} onCapture={handleImageCapture} />}
        {isHandsFreeOpen && currentRecipe && <HandsFreeCookingMode recipe={currentRecipe} onClose={() => setIsHandsFreeOpen(false)} />}
        {isChefsAcademyOpen && <ChefsAcademy onClose={() => setIsChefsAcademyOpen(false)} />}
        {isPantryCheckOpen && (
          <PantryCheckModal
            ingredients={isPantryCheckOpen.ingredients.map(i => `${i.amount[langKey]} ${i.name[langKey]}`)}
            onClose={() => setIsPantryCheckOpen(null)}
            onConfirm={(available) => {
              setIsPantryCheckOpen(null);
              const newIngredients = prompt(t('toastRemixPrompt'));
              if(newIngredients) {
                const availableIngredientNames = available.map(full => {
                   const parts = full.split(' ');
                   // A simple heuristic to separate amount from name
                   return parts.slice(1).join(' ');
                });
                handleGenerateRecipe(newIngredients, isPantryCheckOpen.cuisine.en, isPantryCheckOpen.diet.en, undefined, isPantryCheckOpen, availableIngredientNames)
              }
            }}
          />
        )}
        {showOnboarding && <OnboardingTutorial onFinish={() => { setShowOnboarding(false); setHasOnboarded(true); }} />}
        {showWhatsNew && <WhatsNewModal onClose={() => { setShowWhatsNew(false); setLastSeenVersion(LATEST_VERSION); }} />}
      </AnimatePresence>
      
      <ShoppingList items={shoppingList} onClear={() => setShoppingList([])} onUpdateItems={setShoppingList} />
    </>
  );
}

export default App;
