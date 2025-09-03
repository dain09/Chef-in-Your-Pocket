import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../types';
import { getRecipeOfTheDay, generateRecipeImage } from '../services/geminiService';
import GlassCard from './GlassCard';
import { Sparkles, ImageOff } from 'lucide-react';
import { audioService } from '../services/audioService';

interface RecipeOfTheDayProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const SkeletonPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-white/20 rounded-md ${className} animate-pulse`}></div>
);

const RecipeOfTheDaySkeleton = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <SkeletonPlaceholder className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-video" />
        <div className="flex-1 w-full space-y-3">
            <SkeletonPlaceholder className="h-6 w-3/4" />
            <SkeletonPlaceholder className="h-4 w-full" />
            <SkeletonPlaceholder className="h-4 w-5/6" />
            <SkeletonPlaceholder className="h-10 w-1/2 mt-2" />
        </div>
    </div>
);

const RecipeOfTheDay: React.FC<RecipeOfTheDayProps> = ({ onSelectRecipe }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecipe = async () => {
      try {
        // Use session storage to cache the recipe for the day
        const cachedRecipeRaw = sessionStorage.getItem('recipeOfTheDay');
        if (cachedRecipeRaw) {
            const cachedRecipe = JSON.parse(cachedRecipeRaw);
            // Check if cache is from today
            if (cachedRecipe.id.includes(new Date().toISOString().split('T')[0])) {
                if (isMounted) {
                    setRecipe(cachedRecipe);
                    setIsLoading(false);
                }
                return;
            }
        }

        const recipeTextData = await getRecipeOfTheDay();
        if (!isMounted) return;

        // Set text data first for a faster perceived load
        setRecipe(recipeTextData); 
        sessionStorage.setItem('recipeOfTheDay', JSON.stringify(recipeTextData));
        
        const imageUrl = await generateRecipeImage(recipeTextData.recipeName.en, recipeTextData.description.en);
        if (isMounted && imageUrl) {
            setRecipe(prevRecipe => {
                if (prevRecipe) {
                    const updatedRecipe = { ...prevRecipe, imageUrl };
                    sessionStorage.setItem('recipeOfTheDay', JSON.stringify(updatedRecipe));
                    return updatedRecipe;
                }
                return prevRecipe;
            });
        }
      } catch (error) {
        console.error("Failed to load Recipe of the Day:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchRecipe();
    return () => { isMounted = false; };
  }, []);

  const handleViewClick = () => {
    if (recipe) {
        audioService.playSwoosh();
        onSelectRecipe(recipe);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="mt-8 w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4 text-center flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" /> {t('recipeOfTheDayTitle')}
          </h2>
          <RecipeOfTheDaySkeleton />
        </GlassCard>
      </motion.div>
    );
  }

  if (!recipe) {
    return null; // Don't render anything if fetching fails
  }

  return (
    <motion.div
      className="mt-8 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4 text-center flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" /> {t('recipeOfTheDayTitle')}
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-video bg-pink-200/50 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="w-10 h-10 text-pink-400/50" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-pink-900 text-lg">{recipe.recipeName[langKey]}</h3>
            <p className="text-pink-900/70 text-sm line-clamp-2 mt-1">{recipe.description[langKey]}</p>
            <motion.button
              onClick={handleViewClick}
              className="mt-4 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('viewTodaysRecipe')}
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default RecipeOfTheDay;