

// FIX: Imported `useMemo` from react to fix reference error.
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import type { Chat } from "@google/genai";

import type { Recipe, Menu, Ingredient, MealPlan, PantryItem, RecipeNotes, LoadingMessages } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { ToastProvider, useToast } from './contexts/ToastContext';
import * as geminiService from './services/geminiService';

import SplashScreen from './components/SplashScreen';
import AuroraBackground from './components/AuroraBackground';
import Logo from './components/Logo';
import LanguageSwitcher from './components/LanguageSwitcher';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import MenuCard from './components/MenuCard';
import MealPlanCard from './components/MealPlanCard';
import LoadingOverlay from './components/LoadingOverlay';
import FavoritesList from './components/FavoritesList';
import ShoppingList from './components/ShoppingList';
import PantryManager from './components/PantryManager';
import HandsFreeCookingMode from './components/HandsFreeCookingMode';
import OnboardingTutorial from './components/OnboardingTutorial';
import WhatsNewModal from './components/WhatsNewModal';
import RecipeOfTheDay from './components/RecipeOfTheDay';
import Footer from './components/Footer';
// FIX: Imported GlassCard component to fix reference error.
import GlassCard from './components/GlassCard';
// FIX: Imported ToastContainer component to fix reference error.
import ToastContainer from './components/ToastContainer';
import { Home, Star, Archive } from 'lucide-react';
import { changelog } from './data/changelog';
import { audioService } from './services/audioService';

export type CookingSession = { recipe: Recipe; chat: Chat; };
type View = 'form' | 'recipe' | 'favorites' | 'pantry' | 'plan' | 'menu';

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ToastProvider>
            <AnimatePresence>
                {showSplash && <SplashScreen />}
            </AnimatePresence>
            {!showSplash && <AppContent />}
        </ToastProvider>
    );
};


const NavButton: React.FC<{
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <motion.button
    onClick={() => { audioService.playClick(); onClick(); }}
    className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${isActive ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}
  >
    {isActive && <motion.div layoutId="navPill" className="absolute inset-0 bg-white/40 rounded-lg" />}
    <span className="relative z-10 flex items-center gap-2"><Icon size={18} /> {label}</span>
  </motion.button>
);


const AppContent = memo(() => {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<LoadingMessages>('generating');
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('form');
    
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
    const [cookingSession, setCookingSession] = useState<CookingSession | null>(null);
    
    const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
    const [shoppingListItems, setShoppingListItems] = useLocalStorage<string[]>('shoppingList', []);
    const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantryItems', []);
    const [recipeNotes, setRecipeNotes] = useLocalStorage<RecipeNotes>('recipeNotes', {});
    
    const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('hasSeenTutorial-v2', false);
    const [lastSeenVersion, setLastSeenVersion] = useLocalStorage('lastSeenVersion', '0.0.0');
    const [showOnboarding, setShowOnboarding] = useState(!hasSeenTutorial);
    const [showWhatsNew, setShowWhatsNew] = useState(false);

    useEffect(() => {
        if (hasSeenTutorial && lastSeenVersion !== changelog[0].version) {
            setShowWhatsNew(true);
        }
    }, [hasSeenTutorial, lastSeenVersion]);

    const handleFinishOnboarding = useCallback(() => {
        setShowOnboarding(false);
        setHasSeenTutorial(true);
        setLastSeenVersion(changelog[0].version);
    }, [setHasSeenTutorial, setLastSeenVersion]);

    const handleCloseWhatsNew = useCallback(() => {
        setShowWhatsNew(false);
        setLastSeenVersion(changelog[0].version);
    }, [setLastSeenVersion]);

    const handleError = useCallback((err: any) => {
        console.error(err);
        setError(t(err.message || 'errorFailedToGenerate'));
    }, [t]);

    const generateImageAndUpdateState = useCallback(async (recipe: Recipe, updateFn: (recipe: Recipe) => void) => {
        const imageUrl = await geminiService.generateRecipeImage(recipe.recipeName.en, recipe.description.en);
        const finalImageUrl = imageUrl ?? 'error';
        updateFn({ ...recipe, imageUrl: finalImageUrl });
    }, []);

    const handleRecipeGeneration = useCallback(async (ingredients: string, cuisine: string, allergies: string, diet: string) => {
        setIsLoading(true);
        setLoadingType('generating');
        setError(null);
        try {
            const recipe = await geminiService.generateRecipe(ingredients, cuisine, allergies, diet);
            setCurrentRecipe(recipe);
            setCurrentView('recipe');
            audioService.playSuccess();
            generateImageAndUpdateState(recipe, (r) => setCurrentRecipe(r));
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, generateImageAndUpdateState]);

    const handleRecipeSearch = useCallback(async (recipeName: string) => {
        setIsLoading(true);
        setLoadingType('generating');
        setError(null);
        try {
            const recipe = await geminiService.searchRecipeByName(recipeName);
            setCurrentRecipe(recipe);
            setCurrentView('recipe');
            audioService.playSuccess();
            generateImageAndUpdateState(recipe, (r) => setCurrentRecipe(r));
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, generateImageAndUpdateState]);

    const handleLeftoverRemix = useCallback(async (ingredients: string) => {
        setIsLoading(true);
        setLoadingType('remixingLeftovers');
        setError(null);
        try {
            const recipe = await geminiService.remixLeftovers(ingredients);
            setCurrentRecipe(recipe);
            setCurrentView('recipe');
            audioService.playSuccess();
            generateImageAndUpdateState(recipe, (r) => setCurrentRecipe(r));
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, generateImageAndUpdateState]);

    const handlePlanGeneration = useCallback(async (prompt: string) => {
        setIsLoading(true);
        setLoadingType('planningWeek');
        setError(null);
        try {
            const plan = await geminiService.generateWeeklyMealPlan(prompt);
            setCurrentPlan(plan);
            setCurrentView('plan');
            audioService.playSuccess();
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);


    const handleAnalyzeImage = useCallback(async (base64: string): Promise<string> => {
        setIsLoading(true);
        setLoadingType('analyzing');
        setError(null);
        try {
            const ingredients = await geminiService.identifyIngredientsFromImage(base64);
            audioService.playSuccess();
            return ingredients;
        } catch (err) {
            handleError(err);
            return '';
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const handleSelectRecipe = useCallback((recipe: Recipe) => {
        setCurrentRecipe(recipe);
        setCurrentView('recipe');
        audioService.playSwoosh();
    }, []);

    const handleAddToFavorites = useCallback((recipe: Recipe) => {
        setFavorites(prev => {
            const isFav = prev.some(f => f.id === recipe.id);
            if (isFav) {
                addToast(t('toastRemovedFromFavorites'), 'info');
                return prev.filter(f => f.id !== recipe.id);
            } else {
                addToast(t('toastAddedToFavorites'), 'success');
                return [...prev, recipe];
            }
        });
    }, [setFavorites, addToast, t]);

    const handleAddToShoppingList = useCallback((ingredients: Ingredient[]) => {
        const { i18n } = require('i18next');
        const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
        const newItems = ingredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`);
        setShoppingListItems(prev => {
            const combined = [...prev, ...newItems];
            return [...new Set(combined)]; // Remove duplicates
        });
    }, [setShoppingListItems]);
    
    const handleGenerateShoppingListForPlan = useCallback((plan: MealPlan) => {
        const { i18n } = require('i18next');
        const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
        const allIngredients = plan.plan.flatMap(day => day.recipe.ingredients);
        const newItems = allIngredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`);
        setShoppingListItems(prev => [...new Set([...prev, ...newItems])]);
        addToast(t('toastShoppingListGenerated'), 'success');
    }, [setShoppingListItems, addToast, t]);

    const handleStartHandsFree = useCallback((recipe: Recipe) => {
        const { i18n } = require('i18next');
        const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
        const chat = geminiService.startCookingChat(recipe, langKey);
        setCookingSession({ recipe, chat });
    }, []);

    const handleRemixRecipe = useCallback(async (remixPrompt: string) => {
        if (!currentRecipe) return;
        setIsLoading(true);
        setLoadingType('remixing');
        setError(null);
        try {
            const recipe = await geminiService.remixRecipe(currentRecipe, remixPrompt);
            setCurrentRecipe(recipe);
            setCurrentView('recipe');
            audioService.playSuccess();
            generateImageAndUpdateState(recipe, (r) => setCurrentRecipe(r));
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentRecipe, handleError, generateImageAndUpdateState]);

    const handleUpdateNote = useCallback((recipeId: string, note: string) => {
        setRecipeNotes(prev => ({ ...prev, [recipeId]: note }));
    }, [setRecipeNotes]);

    const handleNavigation = (view: View) => {
        setCurrentView(view);
        if (view === 'form') {
          setIsFormVisible(true);
        }
    };
    
    useEffect(() => {
        if (error) {
            addToast(error, 'error');
        }
    }, [error, addToast]);

    const mainContent = useMemo(() => {
        switch(currentView) {
            case 'recipe': return currentRecipe && <RecipeCard recipe={currentRecipe} onAddToFavorites={handleAddToFavorites} onAddToShoppingList={handleAddToShoppingList} onStartHandsFree={handleStartHandsFree} isFavorite={favorites.some(f => f.id === currentRecipe.id)} onRemix={handleRemixRecipe} notes={recipeNotes[currentRecipe.id] || ''} onUpdateNote={handleUpdateNote} />;
            case 'favorites': return <FavoritesList favorites={favorites} onSelect={handleSelectRecipe} onRemove={(id) => setFavorites(favs => favs.filter(f => f.id !== id))} />;
            case 'pantry': return <PantryManager pantryItems={pantryItems} setPantryItems={setPantryItems} />;
            case 'menu': return currentMenu && <MenuCard menu={currentMenu} onAddToShoppingList={() => {}} onViewRecipe={handleSelectRecipe} />;
            case 'plan': return currentPlan && <MealPlanCard mealPlan={currentPlan} onGenerateShoppingList={handleGenerateShoppingListForPlan} />;
            case 'form':
            default:
                return (
                    <div className="w-full flex flex-col items-center justify-center">
                        <AnimatePresence>
                            {!isFormVisible && (
                                <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                    <RecipeOfTheDay onSelectRecipe={handleSelectRecipe} />
                                    <motion.button
                                        onClick={() => { audioService.playSwoosh(); setIsFormVisible(true); }}
                                        className="mt-8 px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg shadow-lg"
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    >
                                        {t('createYourOwnRecipe')}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {isFormVisible && (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                                    <RecipeForm onRecipeSubmit={handleRecipeGeneration} onPlanSubmit={handlePlanGeneration} onRecipeSearch={handleRecipeSearch} onLeftoverRemix={handleLeftoverRemix} isLoading={isLoading} onAnalyzeImage={handleAnalyzeImage} setError={setError} pantryItems={pantryItems}/>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
        }
    }, [currentView, currentRecipe, favorites, pantryItems, currentMenu, currentPlan, recipeNotes, isLoading, isFormVisible, handleAddToFavorites, handleAddToShoppingList, handleStartHandsFree, handleRemixRecipe, handleUpdateNote, handleSelectRecipe, setFavorites, setPantryItems, handleRecipeGeneration, handlePlanGeneration, handleRecipeSearch, handleLeftoverRemix, handleAnalyzeImage, setError, handleGenerateShoppingListForPlan, t]);

    return (
        <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col items-center overflow-x-hidden custom-scrollbar">
            <AuroraBackground colorOverlay={isLoading ? 'rgba(0,0,0,0.5)' : null} />
             <AnimatePresence>
                {isLoading && <LoadingOverlay type={loadingType} />}
                {showOnboarding && <OnboardingTutorial onFinish={handleFinishOnboarding} />}
                {showWhatsNew && <WhatsNewModal onClose={handleCloseWhatsNew} />}
                {cookingSession && <HandsFreeCookingMode session={cookingSession} onClose={() => setCookingSession(null)} />}
            </AnimatePresence>

            <header className="w-full max-w-7xl mx-auto p-4 flex justify-between items-center">
                <Logo className="w-12 h-12" />
                <GlassCard className="p-1.5 flex items-center gap-1 rounded-xl">
                   <NavButton label={t('newRecipe')} icon={Home} isActive={currentView === 'form'} onClick={() => handleNavigation('form')} />
                   <NavButton label={t('myFavorites')} icon={Star} isActive={currentView === 'favorites'} onClick={() => handleNavigation('favorites')} />
                   <NavButton label={t('myPantry')} icon={Archive} isActive={currentView === 'pantry'} onClick={() => handleNavigation('pantry')} />
                </GlassCard>
                <LanguageSwitcher />
            </header>

            <main className="w-full flex-grow flex flex-col justify-center items-center p-2 sm:p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center"
                    >
                      {mainContent}
                    </motion.div>
                </AnimatePresence>
            </main>
            
            <ShoppingList 
                items={shoppingListItems} 
                onClear={() => setShoppingListItems([])} 
                onUpdateItems={(items) => setShoppingListItems(items)}
            />
            <ToastContainer />
            <Footer />
        </div>
    );
});

export default App;
