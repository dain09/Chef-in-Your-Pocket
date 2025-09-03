


import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { generateRecipe, remixRecipe, identifyIngredientsFromImage, generateMenu, startCookingChat } from './services/geminiService';
import type { Recipe, Ingredient, LoadingMessages, Menu } from './types';
import type { Chat } from '@google/genai';


// Import components
import SplashScreen from './components/SplashScreen';
import AuroraBackground from './components/AuroraBackground';
import RecipeForm from './components/RecipeForm';
import LoadingOverlay from './components/LoadingOverlay';
import RecipeCard from './components/RecipeCard';
import MenuCard from './components/MenuCard';
import FavoritesList from './components/FavoritesList';
import ShoppingList from './components/ShoppingList';
import Logo from './components/Logo';
import LanguageSwitcher from './components/LanguageSwitcher';
import HandsFreeCookingMode from './components/HandsFreeCookingMode';
import GlassCard from './components/GlassCard';
import useLocalStorage from './hooks/useLocalStorage';
import { audioService } from './services/audioService';
import { Star, Soup } from 'lucide-react';
import OnboardingTutorial from './components/OnboardingTutorial';
import Footer from './components/Footer';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

export interface CookingSession {
  recipe: Recipe;
  chat: Chat;
}

const categoryColorMap: Record<Recipe['category'], string> = {
    'Healthy': 'rgba(34, 197, 94, 0.4)',      // green-500
    'Dessert': 'rgba(236, 72, 153, 0.4)',     // pink-500
    'Seafood': 'rgba(59, 130, 246, 0.4)',     // blue-500
    'Meat': 'rgba(239, 68, 68, 0.4)',         // red-500
    'Vegetarian': 'rgba(163, 230, 53, 0.4)',  // lime-400
    'Pasta': 'rgba(251, 146, 60, 0.4)',       // orange-400
    'General': 'rgba(167, 139, 250, 0.4)',    // violet-400
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<LoadingMessages>('generating');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('chef-favorites', []);
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>('chef-shopping-list', []);
  const [cookingSession, setCookingSession] = useState<CookingSession | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'favorites'>('home');
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('chef-hasSeenTutorial', false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (recipe) {
      setBackgroundColor(categoryColorMap[recipe.category] || null);
    } else {
      setBackgroundColor(null);
    }
  }, [recipe]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, [i18n.language, i18n.dir]);

  const handleRecipeGeneration = useCallback(async (ingredients: string, cuisine: string, allergies: string, diet: string) => {
    setIsLoading(true);
    setLoadingMessage('generating');
    setRecipe(null);
    setMenu(null);
    setError(null);
    try {
      const newRecipe = await generateRecipe(ingredients, cuisine, allergies, diet);
      setRecipe(newRecipe);
    } catch (err: any) {
      setError(t(err.message) || t("errorFailedToGenerate"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const handleMenuGeneration = useCallback(async (occasion: string) => {
    setIsLoading(true);
    setLoadingMessage('planning');
    setRecipe(null);
    setMenu(null);
    setError(null);
    try {
      const newMenu = await generateMenu(occasion);
      setMenu(newMenu);
    } catch (err: any) {
      setError(t(err.message) || t("errorFailedToGenerate"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const handleRemixRecipe = useCallback(async (remixPrompt: string) => {
    if (!recipe) return;

    setIsLoading(true);
    setLoadingMessage('remixing');
    setError(null);

    try {
      const remixedRecipe = await remixRecipe(recipe, remixPrompt);
      setRecipe(remixedRecipe);
    } catch (err: any) {
      setError(t(err.message) || t("errorFailedToGenerate"));
      setRecipe(null); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  }, [recipe, t]);

  const handleImageAnalysis = useCallback(async (base64Image: string): Promise<string> => {
    setIsLoading(true);
    setLoadingMessage('analyzing');
    setError(null);
    try {
      const ingredientsText = await identifyIngredientsFromImage(base64Image);
      return ingredientsText;
    } catch (err: any) {
      setError(t(err.message) || t("errorFailedToAnalyzeImage"));
      return "";
    } finally {
      setIsLoading(false);
    }
  }, [t]);
  
  const handleViewChange = (view: 'home' | 'favorites') => {
    audioService.playClick();
    if (view === 'home') {
      setRecipe(null);
      setMenu(null);
    }
    setActiveView(view);
  }

  const handleAddToFavorites = useCallback((recipeToAdd: Recipe) => {
      setFavorites(prev => {
          const isFavorited = prev.some(fav => fav.id === recipeToAdd.id);
          if (isFavorited) {
              return prev.filter(fav => fav.id !== recipeToAdd.id);
          } else {
              return [...prev, recipeToAdd];
          }
      });
  }, [setFavorites]);
  
  const handleAddToShoppingList = useCallback((ingredients: Ingredient[]) => {
      const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
      const ingredientNames = ingredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`);
      setShoppingList(prev => {
        const newItems = ingredientNames.filter(name => !prev.includes(name));
        return [...prev, ...newItems];
      });
  }, [setShoppingList, i18n.language]);
  
  const handleAddMenuToShoppingList = useCallback((menu: Menu) => {
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const allIngredients = [
      ...menu.appetizer.ingredients,
      ...menu.mainCourse.ingredients,
      ...menu.dessert.ingredients,
    ];
    const ingredientNames = allIngredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`);
     setShoppingList(prev => {
        const newItems = ingredientNames.filter(name => !prev.includes(name));
        return [...prev, ...newItems];
      });
  }, [setShoppingList, i18n.language]);


  const handleClearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, [setShoppingList]);

  const handleSelectFavorite = (selectedRecipe: Recipe) => {
      audioService.playSwoosh();
      setRecipe(selectedRecipe);
      setMenu(null);
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleRemoveFavorite = (recipeId: string) => {
      setFavorites(prev => prev.filter(fav => fav.id !== recipeId));
  }
  
  const handleStartCookingSession = (recipeToCook: Recipe) => {
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    try {
        const chat = startCookingChat(recipeToCook, langKey);
        setCookingSession({ recipe: recipeToCook, chat });
    } catch (error) {
        console.error("Failed to start cooking session:", error);
        setError(t('errorFailedToGenerate')); // A generic error for now
    }
  };

  const handleResetHomeView = () => {
    audioService.playClick();
    setRecipe(null);
    setMenu(null);
    setError(null);
  }

  const isCurrentRecipeFavorite = favorites.some(fav => fav.id === recipe?.id);

  return (
    <ToastProvider>
      <AnimatePresence>
        {!hasSeenTutorial && !showSplash && <OnboardingTutorial onFinish={() => setHasSeenTutorial(true)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <div className="relative flex flex-col min-h-screen text-pink-900 selection:bg-pink-300/50 overflow-x-hidden">
        <AuroraBackground colorOverlay={backgroundColor} />
        
        <ToastContainer />

        <AnimatePresence>
            {isLoading && <LoadingOverlay type={loadingMessage} />}
        </AnimatePresence>

        <AnimatePresence>
            {cookingSession && (
                <HandsFreeCookingMode 
                    session={cookingSession} 
                    onClose={() => setCookingSession(null)} 
                />
            )}
        </AnimatePresence>

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 flex-grow flex flex-col items-center w-full">
          <motion.header 
            className="w-full max-w-7xl flex items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.5, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <Logo className="w-10 h-10 sm:w-12 sm:h-12 text-pink-800" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-pink-900">{t('appName')}</h1>
            </div>
            <LanguageSwitcher />
          </motion.header>

          {/* View Switcher */}
           <motion.div
             className="mb-8"
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 2.7, ease: 'easeOut' }}
           >
              <GlassCard className="p-1 flex items-center gap-2 rounded-full">
                <button onClick={() => handleViewChange('home')} className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors ${activeView === 'home' ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}>
                    {activeView === 'home' && <motion.div layoutId="activePill" className="absolute inset-0 bg-white/50 rounded-full" />}
                    <span className="relative z-10 flex items-center gap-2"><Soup size={18}/> {t('newRecipe')}</span>
                </button>
                 <button onClick={() => handleViewChange('favorites')} className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors ${activeView === 'favorites' ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}>
                    {activeView === 'favorites' && <motion.div layoutId="activePill" className="absolute inset-0 bg-white/50 rounded-full" />}
                    <span className="relative z-10 flex items-center gap-2"><Star size={18}/> {t('myFavorites')}</span>
                </button>
              </GlassCard>
           </motion.div>


          <div className="w-full max-w-7xl flex-grow flex flex-col">
            <AnimatePresence mode="wait">
              {activeView === 'home' ? (
                <motion.div key="home-view" className="flex-grow flex flex-col">
                  <AnimatePresence mode="wait">
                    {!recipe && !menu && !error && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      >
                        <RecipeForm onRecipeSubmit={handleRecipeGeneration} onMenuSubmit={handleMenuGeneration} isLoading={isLoading} onAnalyzeImage={handleImageAnalysis} setError={setError} />
                      </motion.div>
                    )}

                    {recipe && !menu && !isLoading && (
                      <motion.div
                        key="recipe"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <RecipeCard 
                          recipe={recipe} 
                          onAddToFavorites={handleAddToFavorites}
                          onAddToShoppingList={handleAddToShoppingList}
                          onStartHandsFree={handleStartCookingSession}
                          isFavorite={isCurrentRecipeFavorite}
                          onRemix={handleRemixRecipe}
                        />
                         <motion.button
                            onClick={handleResetHomeView}
                            className="mt-8 mx-auto block px-6 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg hover:bg-black/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('searchAnotherRecipe')}
                        </motion.button>
                      </motion.div>
                    )}
                    
                    {menu && !isLoading && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <MenuCard menu={menu} onAddToShoppingList={handleAddMenuToShoppingList} />
                            <motion.button
                                onClick={handleResetHomeView}
                                className="mt-8 mx-auto block px-6 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg hover:bg-black/20 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('searchAnotherRecipe')}
                            </motion.button>
                        </motion.div>
                    )}

                    {error && !isLoading && (
                        <motion.div 
                            key="error"
                            className="mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard className="p-6 bg-red-500/30 border-red-500/50 max-w-lg mx-auto">
                                <p className="text-red-100 font-semibold">{error}</p>
                                <button
                                    onClick={handleResetHomeView}
                                    className="mt-4 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    {t('tryAgain')}
                                </button>
                            </GlassCard>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                    key="favorites-view"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <FavoritesList favorites={favorites} onSelect={handleSelectFavorite} onRemove={handleRemoveFavorite} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
        <ShoppingList items={shoppingList} onClear={handleClearShoppingList} onUpdateItems={setShoppingList} />
      </div>
    </ToastProvider>
  );
};

export default App;