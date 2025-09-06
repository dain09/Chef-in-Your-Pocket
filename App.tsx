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


// The main view for a single recipe, handling details, scaling, and actions.
const RecipeDetailView: React.FC<{ recipe: Recipe, onBack: () => void, onToggleFavorite: (id: string) => void, isFavorite: boolean, onAddToShoppingList: (items: string[]) => void, onRemix: (recipe: Recipe) => void, onStartCooking: (recipe: Recipe) => void }> =
    ({ recipe, onBack, onToggleFavorite, isFavorite, onAddToShoppingList, onRemix, onStartCooking }) => {

    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const { addToast } = useToast();

    const [servings, setServings] = useState(recipe.servings);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
    const [activeInfoType, setActiveInfoType] = useState< 'substitutions' | 'nutrition' | 'trivia' | 'drinks' | null>(null);
    const [infoContent, setInfoContent] = useState<MultilingualString | null>(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState< 'substitutions' | 'nutrition' | 'trivia' | 'drinks' | false>(false);

    const blobImageUrl = useBlobUrl(recipe.imageUrl);
    const embedUrl = useMemo(() => getYouTubeEmbedUrl(recipe.youtubeUrl || ''), [recipe.youtubeUrl]);

    const handleGetInfo = useCallback(async (infoType: 'substitutions' | 'nutrition' | 'trivia' | 'drinks') => {
        if (isLoadingInfo) return;

        if (activeInfoType === infoType) {
            setActiveInfoType(null);
            setInfoContent(null);
            return;
        }

        setIsLoadingInfo(infoType);
        setActiveInfoType(infoType);
        setInfoContent(null);
        try {
            let result: MultilingualString | null = null;
            if (infoType === 'substitutions') {
                result = await geminiService.generateSubstitutions(recipe.ingredients);
            } else {
                result = await geminiService.getExtraRecipeInfo(recipe.title.en, infoType);
            }
            setInfoContent(result);
        } catch (error) {
            console.error(`Failed to fetch ${infoType}`, error);
            addToast(t('toastError'), 'error');
            setActiveInfoType(null);
        } finally {
            setIsLoadingInfo(false);
        }
    }, [recipe.ingredients, recipe.title.en, t, addToast, isLoadingInfo, activeInfoType]);

    const scaledIngredients = useMemo(() => {
        if (servings === recipe.servings) return recipe.ingredients;
        const scaleFactor = servings / recipe.servings;
        return recipe.ingredients.map(ing => {
            const scaleAmount = (amountStr: string) => {
                const parsed = parseIngredient(amountStr);
                 if (parsed && parsed.quantity > 0) {
                    const newQuantity = parsed.quantity * scaleFactor;
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

    const TabButton: React.FC<{ title: string, isActive: boolean, onClick: () => void }> = ({ title, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`relative py-3 px-6 font-semibold transition-colors w-1/2 ${isActive ? 'text-amber-300' : 'text-stone-100/60 hover:text-stone-100/80'}`}
        >
            {title}
            {isActive && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-300" layoutId="tab-underline" />}
        </button>
    );

    const InfoButton: React.FC<{ icon: React.ElementType, label: string, onClick: () => void, isActive: boolean, isLoading: boolean }> = ({ icon: Icon, label, onClick, isActive, isLoading }) => (
        <motion.button 
            onClick={onClick} 
            disabled={!!isLoading}
            className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-black/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center
                ${isActive ? 'text-amber-300 ring-2 ring-amber-400' : 'text-stone-100/80 hover:bg-black/30'}
                ${isLoading ? 'animate-pulse' : ''}
            `}
        >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
        </motion.button>
    );

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
                
                <div className={`grid grid-cols-1 ${blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 items-center`}>
                    {blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? (
                        <motion.img 
                            src={blobImageUrl} 
                            alt={recipe.title[langKey]} 
                            className="w-full h-64 object-cover rounded-lg" 
                            initial={{opacity: 0}} animate={{opacity: 1}}
                        />
                    ) : null}
                    
                    <div className="text-center md:text-start space-y-2 md:col-span-1">
                        <h1 className="text-3xl font-bold text-stone-100">{recipe.title[langKey]}</h1>
                        <p className="text-stone-100/80 max-w-2xl mx-auto md:mx-0">{recipe.description[langKey]}</p>
                    </div>
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

                <div className="pt-4 border-t border-amber-300/10">
                    <div className="flex border-b border-amber-300/10">
                        <TabButton title={t('ingredients')} isActive={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} />
                        <TabButton title={t('Steps')} isActive={activeTab === 'steps'} onClick={() => setActiveTab('steps')} />
                    </div>
                    <div className="mt-4 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'ingredients' ? (
                                <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                                </motion.div>
                            ) : (
                                <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <ol className="space-y-4">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/20 text-amber-300 font-bold rounded-full">{i + 1}</div>
                                            <p className="text-stone-100/90 pt-1">{step.text[langKey]}</p>
                                        </li>
                                    ))}
                                    </ol>
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-amber-300/10 space-y-4">
                    <h3 className="text-2xl font-bold text-amber-300 text-center">{t('chefsTips')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoButton icon={Soup} label={t('suggestSubstitutions')} onClick={() => handleGetInfo('substitutions')} isActive={activeInfoType === 'substitutions'} isLoading={isLoadingInfo === 'substitutions'} />
                        <InfoButton icon={BrainCircuit} label={t('nutritionalInfo')} onClick={() => handleGetInfo('nutrition')} isActive={activeInfoType === 'nutrition'} isLoading={isLoadingInfo === 'nutrition'} />
                        <InfoButton icon={Lightbulb} label={t('funFacts')} onClick={() => handleGetInfo('trivia')} isActive={activeInfoType === 'trivia'} isLoading={isLoadingInfo === 'trivia'} />
                        <InfoButton icon={GlassWater} label={t('suggestedDrinks')} onClick={() => handleGetInfo('drinks')} isActive={activeInfoType === 'drinks'} isLoading={isLoadingInfo === 'drinks'} />
                    </div>
                    <div className="min-h-[100px] bg-black/20 rounded-lg p-4 transition-all">
                        <AnimatePresence mode="wait">
                            {isLoadingInfo ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-full text-stone-100/70">
                                    ...
                                </motion.div>
                            ) : infoContent ? (
                                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-stone-100/90 text-sm">
                                    {infoContent[langKey]}
                                </motion.div>
                            ) : (
                                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-full text-stone-100/70">
                                    {t('selectTip')}
                                </motion.div>
                            )}
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
          <div className="flex items-center gap-4">
            <Logo className="w-12 h-12 text-amber-300" />
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => setIsFavoritesOpen(true)} className="p-2 bg-black/20 rounded-lg"><Heart /></motion.button>
            <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => setIsPantryOpen(true)} className="p-2 bg-black/20 rounded-lg"><Archive /></motion.button>
            <motion.a 
              href="/academy.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={t('chefsAcademy')}
              whileHover={{scale: 1.1}} 
              whileTap={{scale:0.9}} 
              className="p-2 bg-black/20 rounded-lg block"
            >
              <GraduationCap />
            </motion.a>
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