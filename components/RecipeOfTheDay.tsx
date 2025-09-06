import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import type { Recipe } from '../types';
import { ChefHat, Clock, Utensils } from 'lucide-react';
import { audioService } from '../services/audioService';
import { useBlobUrl } from '../hooks/useBlobUrl';

interface RecipeOfTheDayProps {
  recipe: Recipe;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeOfTheDay: React.FC<RecipeOfTheDayProps> = ({ recipe, onRecipeSelect }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const blobImageUrl = useBlobUrl(recipe.imageUrl);

  const handleSelect = () => {
    audioService.playSwoosh();
    onRecipeSelect(recipe);
  }

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* FIX: Moved interactive props to the motion component wrapper to resolve TS error. */}
      <motion.div layoutId={`recipe-${recipe.id}`} className="cursor-pointer" onClick={handleSelect} whileHover={{ y: -5 }}>
        <GlassCard className="p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-2xl font-bold text-amber-300">
            <ChefHat size={28} />
            <h2>{t('Recipe of the Day')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 flex flex-col justify-center">
                   <h3 className="text-xl font-bold text-stone-100">{recipe.title[langKey]}</h3>
                   <div className="flex items-center gap-4 text-sm text-stone-100/70">
                       <span className="flex items-center gap-1.5"><Utensils size={14}/> {recipe.cuisine[langKey]}</span>
                       <span className="flex items-center gap-1.5"><Clock size={14}/> {recipe.cookTime[langKey]}</span>
                   </div>
                   <p className="text-stone-100/80 text-sm line-clamp-4 flex-grow">{recipe.description[langKey]}</p>
                   <div className="mt-auto">
                       <div className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg mt-2 inline-block">
                          {t('viewRecipe')}
                       </div>
                   </div>
              </div>
               {blobImageUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                      <img src={blobImageUrl} alt={recipe.title[langKey]} className="w-full h-full object-cover"/>
                  </div>
              )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default RecipeOfTheDay;