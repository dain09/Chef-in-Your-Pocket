import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../types';
import { getRecipeOfTheDay, generateRecipeImage } from '../services/geminiService';
import GlassCard from './GlassCard';
import { Loader2, ImageOff } from 'lucide-react';
import { useBlobUrl } from '../hooks/useBlobUrl';

interface RecipeOfTheDayProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

interface CachedRecipe {
  recipe: Recipe;
  timestamp: number;
}

const RecipeOfTheDay: React.FC<RecipeOfTheDayProps> = ({ onSelectRecipe }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const blobImageUrl = useBlobUrl(recipe?.imageUrl);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      const cacheKey = 'recipeOfTheDay';
      const cachedData = localStorage.getItem(cacheKey);
      const oneDay = 24 * 60 * 60 * 1000;

      if (cachedData) {
        try {
          const { recipe: cachedRecipe, timestamp }: CachedRecipe = JSON.parse(cachedData);
          if (Date.now() - timestamp < oneDay) {
            setRecipe(cachedRecipe);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      try {
        const newRecipe = await getRecipeOfTheDay();
        setRecipe(newRecipe); // Set recipe immediately without image
        
        generateRecipeImage(newRecipe.recipeName.en, newRecipe.description.en).then(imageUrl => {
            const finalImageUrl = imageUrl ?? 'error';
            const recipeWithImage = { ...newRecipe, imageUrl: finalImageUrl };
            setRecipe(recipeWithImage);
            localStorage.setItem(cacheKey, JSON.stringify({ recipe: recipeWithImage, timestamp: Date.now() }));
        });

      } catch (error) {
        console.error("Failed to fetch Recipe of the Day:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  if (isLoading) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="w-full max-w-2xl mx-auto mt-8"
        >
            <GlassCard className="p-6 text-center text-pink-900/70">
                <Loader2 className="animate-spin mx-auto mb-2" />
                <p>{t('generating')} {t('recipeOfTheDayTitle')}</p>
            </GlassCard>
        </motion.div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-12"
    >
        <GlassCard className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-pink-900 text-center mb-4">{t('recipeOfTheDayTitle')}</h3>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden bg-white/10 flex items-center justify-center text-pink-900/30">
                    {recipe.imageUrl === 'error' ? (
                        <div className="flex flex-col items-center gap-2">
                           <ImageOff size={40} />
                           <p className="text-xs">{t('errorImage')}</p>
                        </div>
                    ) : recipe.imageUrl ? (
                        <img src={blobImageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover" />
                    ) : (
                        <Loader2 size={32} className="animate-spin" />
                    )}
                </div>
                <div className="flex-grow flex flex-col justify-center text-center md:text-left">
                    <h4 className="text-lg font-bold text-pink-900">{recipe.recipeName[langKey]}</h4>
                    <p className="text-sm text-pink-900/80 mt-1 line-clamp-3">{recipe.description[langKey]}</p>
                    <motion.button
                        onClick={() => onSelectRecipe(recipe)}
                        className="mt-3 w-full md:w-auto self-center md:self-start px-4 py-2 text-sm bg-purple-500 text-white font-semibold rounded-lg"
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