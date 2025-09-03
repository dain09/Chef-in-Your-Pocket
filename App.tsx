import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import useLocalStorage from '@/hooks/useLocalStorage';
import * as geminiService from '@/services/geminiService';
import type { Recipe, Menu, MealPlan, PantryItem, LoadingMessages, Cookbook } from '@/types';
import { audioService } from '@/services/audioService';

// Components
import SplashScreen from '@/components/SplashScreen';
import ParticleBackground from '@/components/AuroraBackground';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import RecipeForm from '@/components/RecipeForm';
import LoadingOverlay from '@/components/LoadingOverlay';
import RecipeDetail from '@/components/RecipeDetail';
import FavoritesList from '@/components/FavoritesList';
import MenuCard from '@/components/MenuCard';
import MealPlanCard from '@/components/MealPlanCard';
import ShoppingList from '@/components/ShoppingList';
import RecipeOfTheDay from '@/components/RecipeOfTheDay';
import MonthlyFestival from '@/components/MonthlyFestival';
import ImageCaptureModal from '@/components/ImageCaptureModal';
import PantryManager from '@/components/PantryManager';
import PantryCheckModal from '@/components/PantryCheckModal';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import WhatsNewModal from '@/components/WhatsNewModal';
import PantrySpotlight from '@/components/PantrySpotlight';
import Footer from '@/components/Footer';
import AddToCookbookModal from '@/components/AddToCookbookModal';
import CookbookModal from '@/components/CookbookModal';
import { useToast } from '@/contexts/ToastContext';
import HeaderMenu from './components/HeaderMenu';


const LATEST_VERSION = '5.0.0'; // Corresponds to the latest changelog version

const App: React.FC = () => {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  
  // App State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingType, setLoadingType] = useState<LoadingMessages>('generating');
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>('shoppingList', []);
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantryItems', []);
  const [history, setHistory] = useLocalStorage<Recipe[]>('history', []);
  const [cookbooks, setCookbooks] = useLocalStorage<Cookbook[]>('cookbooks', []);


  // UI State
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [pantryCheck, setPantryCheck] = useState<{ recipe: Recipe, ingredients: string[] } | null>(null);
  const [showOnboarding, setShowOnboarding] = useLocalStorage('hasCompletedOnboarding', false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [lastVersion, setLastVersion] = useLocalStorage('lastVersion', '0.0.0');
  const [recipeToAddToCookbook, setRecipeToAddToCookbook] = useState<Recipe | null>(null);
  const [isCookbookModalOpen, setIsCookbookModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && lastVersion !== LATEST_VERSION) {
      setShowWhatsNew(true);
      setLastVersion(LATEST_VERSION);
    }
  }, [showSplash, lastVersion, setLastVersion]);

  const resetView = () => {
    setCurrentRecipe(null);
    setCurrentMenu(null);
    setCurrentMealPlan(null);
    setError(null);
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    resetView();
    setCurrentRecipe(recipe);
    window.scrollTo(0, 0);
  };

  const handleGenerateRecipe = useCallback(async (
    ingredients: string,
    cuisine: string,
    diet: string,
    recipeName?: string,
    remixRecipe?: Recipe,
    availableIngredients?: string[]
  ) => {
    resetView();
    setIsGenerating(true);
    setError(null);
    if (remixRecipe) setLoadingType('remixing');
    else if (recipeName) setLoadingType('generating');
    else setLoadingType('generating');
    
    try {
      const recipe = await geminiService.generateRecipe(ingredients, cuisine, diet, recipeName, remixRecipe, availableIngredients);
      if (recipe) {
        setCurrentRecipe(recipe);
        setHistory(prev => [recipe, ...prev.filter(r => r.id !== recipe.id).slice(0, 9)]);
      } else {
        setError(t('Could not generate recipe. Please try again.'));
      }
    } catch (err) {
      setError(t('An error occurred. Please check your connection or API key.'));
    } finally {
      setIsGenerating(false);
    }
  }, [t, setHistory]);

  const handleGenerateFromPantry = useCallback((ingredients: string[]) => {
      handleGenerateRecipe(ingredients.join(', '), 'random', 'none');
  }, [handleGenerateRecipe]);
  
  const handleAnalyzeImage = () => {
      setShowImageCapture(true);
  };
  
  const handleImageCapture = async (imageDataUrl: string) => {
      setShowImageCapture(false);
      // Implement Gemini call to identify ingredients from image
  };

  const handlePlanMenu = useCallback(async (occasion: string) => {
      resetView();
      setIsGenerating(true);
      setLoadingType('planningMenu');
      setError(null);
      try {
          const menu = await geminiService.generateMenuForOccasion(occasion);
          if (menu) {
              setCurrentMenu(menu);
          } else {
              setError(t('Could not plan menu. Please try again.'));
          }
      } catch (err) {
          setError(t('An error occurred while planning the menu.'));
      } finally {
          setIsGenerating(false);
      }
  }, [t]);

  const handlePlanWeek = async (goals: string) => {
      // Logic for weekly plan generation
  };

  const handleLeftoverRemix = async (leftovers: string) => {
      // Logic for leftover remix generation
  };

  // Favorite Management
  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some(fav => fav.id === recipe.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== recipe.id));
      addToast(t('toast.recipeRemovedFromFavorites'), 'info');
    } else {
      setFavorites([...favorites, recipe]);
      addToast(t('toast.recipeAddedToFavorites'), 'success');
    }
  };

  const isFavorited = (recipeId: string) => favorites.some(fav => fav.id === recipeId);

  // Shopping List Management
  const handleAddToShoppingList = (items: string[]) => {
    setShoppingList(prev => [...new Set([...prev, ...items])]);
    addToast(t('toast.addedToShoppingList', { count: items.length }), 'success');
  };

  const clearShoppingList = () => setShoppingList([]);

  // Cookbook Management
  const handleOpenAddToCookbook = (recipe: Recipe) => setRecipeToAddToCookbook(recipe);
  
  const handleAddToCookbooks = (recipeId: string, cookbookIds: string[]) => {
    setCookbooks(prev => prev.map(cb => {
        const shouldHaveRecipe = cookbookIds.includes(cb.id);
        const hasRecipe = cb.recipeIds.includes(recipeId);

        if (shouldHaveRecipe && !hasRecipe) {
            return { ...cb, recipeIds: [...cb.recipeIds, recipeId] };
        }
        if (!shouldHaveRecipe && hasRecipe) {
            return { ...cb, recipeIds: cb.recipeIds.filter(id => id !== recipeId) };
        }
        return cb;
    }));
  };
  
  const handleCreateCookbook = (name: string, description: string): Cookbook => {
      const newCookbook: Cookbook = { id: uuidv4(), name, description, recipeIds: [] };
      setCookbooks(prev => [...prev, newCookbook]);
      return newCookbook;
  };

  const handleDeleteCookbook = (id: string) => {
      setCookbooks(prev => prev.filter(cb => cb.id !== id));
  }

  const handleUpdateCookbook = (updatedCookbook: Cookbook) => {
      setCookbooks(prev => prev.map(cb => cb.id === updatedCookbook.id ? updatedCookbook : cb));
  }
  
  const MainContent = () => {
      if (currentRecipe) {
          return <RecipeDetail 
                    recipe={currentRecipe} 
                    onBack={resetView}
                    isFavorite={isFavorited(currentRecipe.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToShoppingList={handleAddToShoppingList}
                    onRemix={() => setPantryCheck({ recipe: currentRecipe, ingredients: currentRecipe.ingredients.map(i => i.name.en) })}
                    onAddToCookbook={handleOpenAddToCookbook}
                 />
      }
      if (currentMenu) {
          return <MenuCard menu={currentMenu} onRecipeSelect={handleSelectRecipe} />
      }
      if (currentMealPlan) {
          return <MealPlanCard mealPlan={currentMealPlan} onRecipeSelect={handleSelectRecipe} />
      }
      
      return (
          <div className="space-y-8">
              <RecipeForm
                  onGenerate={handleGenerateRecipe}
                  onAnalyzeImage={handleAnalyzeImage}
                  onPlanMenu={handlePlanMenu}
                  onPlanWeek={handlePlanWeek}
                  onLeftoverRemix={handleLeftoverRemix}
                  isGenerating={isGenerating}
              />
              <PantrySpotlight pantryItems={pantryItems} onGenerateFromPantry={handleGenerateFromPantry} />
              {recipeOfTheDay ? 
                <RecipeOfTheDay recipe={recipeOfTheDay} onRecipeSelect={handleSelectRecipe} /> : null
              }
              <MonthlyFestival onIdeaClick={(idea) => handleGenerateRecipe('', 'random', 'none', idea)} />
          </div>
      )
  };

  const allKnownRecipes = useMemo(() => {
    const all = [...favorites, ...history];
    const unique = all.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    return unique;
  }, [favorites, history]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      <ParticleBackground />
      <div className="relative min-h-screen flex flex-col items-center p-4 sm:p-6 text-stone-100 font-sans z-10">
        
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <Logo className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
             <h1 className="text-2xl sm:text-3xl font-bold">{t('appName')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <HeaderMenu 
                onCookbooksClick={() => setIsCookbookModalOpen(true)}
                onFavoritesClick={() => setShowFavorites(true)}
                onPantryClick={() => setShowPantry(true)}
             />
            <LanguageSwitcher />
          </div>
        </header>
        
        <main className="w-full max-w-7xl mx-auto flex-grow">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentRecipe?.id || currentMenu?.id || 'form'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {error && (
                        <div className="text-center p-4 my-4 bg-red-500/20 text-red-300 rounded-lg flex items-center justify-center gap-2">
                            <AlertCircle size={20}/> {error}
                        </div>
                    )}
                    <MainContent />
                </motion.div>
            </AnimatePresence>
        </main>
        
        <Footer />
      </div>

      <AnimatePresence>
        {isGenerating && <LoadingOverlay type={loadingType} />}
        {showFavorites && <FavoritesList favorites={favorites} onClose={() => setShowFavorites(false)} onSelectRecipe={handleSelectRecipe} onDeleteFavorite={(id) => setFavorites(f => f.filter(fav => fav.id !== id))} />}
        {showPantry && <PantryManager isOpen={showPantry} onClose={() => setShowPantry(false)} pantryItems={pantryItems} onUpdatePantry={setPantryItems} onPantryChallenge={() => { setShowPantry(false); handleGenerateRecipe(pantryItems.map(i => i.name).join(', '), 'random', 'none'); }} />}
        {showImageCapture && <ImageCaptureModal isOpen={showImageCapture} onClose={() => setShowImageCapture(false)} onCapture={handleImageCapture} />}
        {pantryCheck && <PantryCheckModal ingredients={pantryCheck.ingredients} onClose={() => setPantryCheck(null)} onConfirm={(available) => handleGenerateRecipe(pantryCheck.recipe.title.en, pantryCheck.recipe.cuisine.en, pantryCheck.recipe.diet.en, undefined, pantryCheck.recipe, available)} />}
        {!showOnboarding && !showSplash && <OnboardingTutorial onFinish={() => setShowOnboarding(true)} />}
        {showWhatsNew && <WhatsNewModal onClose={() => setShowWhatsNew(false)} />}
        {recipeToAddToCookbook && <AddToCookbookModal isOpen={!!recipeToAddToCookbook} onClose={() => setRecipeToAddToCookbook(null)} recipe={recipeToAddToCookbook} cookbooks={cookbooks} onAddToCookbooks={handleAddToCookbooks} onCreateCookbook={handleCreateCookbook} />}
        {isCookbookModalOpen && <CookbookModal isOpen={isCookbookModalOpen} onClose={() => setIsCookbookModalOpen(false)} cookbooks={cookbooks} allRecipes={allKnownRecipes} onUpdateCookbook={handleUpdateCookbook} onDeleteCookbook={handleDeleteCookbook} onRecipeSelect={handleSelectRecipe} />}
      </AnimatePresence>

      <ShoppingList items={shoppingList} onClear={clearShoppingList} onUpdateItems={setShoppingList} />
    </>
  );
};

export default App;
