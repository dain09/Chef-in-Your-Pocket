import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { MealPlan, Recipe } from '../types';
import GlassCard from './GlassCard';
import { audioService } from '../services/audioService';
import { ListPlus, ImageOff, ChevronDown } from 'lucide-react';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onGenerateShoppingList: (plan: MealPlan) => void;
}

const RecipeDetailView: React.FC<{ recipe: Recipe, langKey: 'en' | 'ar' }> = ({ recipe, langKey }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 pt-4">
      {/* Left side: details */}
      <div className="space-y-4">
         <div className="flex justify-around text-center text-xs sm:text-sm text-pink-900/90">
          <div>
            <div className="font-bold">{t('prepTime')}</div>
            <div>{recipe.prepTime[langKey]}</div>
          </div>
          <div>
            <div className="font-bold">{t('cookTime')}</div>
            <div>{recipe.cookTime[langKey]}</div>
          </div>
          <div>
            <div className="font-bold">{t('servings')}</div>
            <div>{recipe.servings}</div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-pink-900 mb-2">{t('ingredients')}</h4>
          <ul className="list-none list-inside columns-1 sm:columns-2 gap-x-6 text-sm text-pink-900/90 space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing.amount[langKey]} {ing.name[langKey]}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Right side: Steps */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-bold text-pink-900 mb-2">{t('preparationMethod')}</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-pink-900/90">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step[langKey]}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, onGenerateShoppingList }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);

  const toggleDay = (index: number) => {
    audioService.playPop();
    setOpenDayIndex(openDayIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto space-y-6"
    >
        <GlassCard className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-pink-900 text-center sm:text-left">{mealPlan.title[langKey]}</h1>
                <motion.button
                  onClick={() => onGenerateShoppingList(mealPlan)}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-500/80 text-white text-base font-semibold hover:bg-pink-500 transition-colors w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <ListPlus className="w-5 h-5" /> {t('generateShoppingList')}
                </motion.button>
            </div>
            
            <div className="space-y-2">
                {mealPlan.plan.map((meal, index) => (
                    <div key={index} className="bg-white/20 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleDay(index)}
                            className="w-full p-4 text-left flex justify-between items-center"
                        >
                            <div className="font-bold text-pink-800 text-lg">
                                <span>{meal.day[langKey]}: </span>
                                <span className="font-semibold text-pink-900">{meal.recipe.recipeName[langKey]}</span>
                            </div>
                            <motion.div
                                animate={{ rotate: openDayIndex === index ? 180 : 0 }}
                            >
                                <ChevronDown className="w-6 h-6 text-pink-800" />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                        {openDayIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="px-4 pb-4"
                            >
                                <div className="border-t border-white/30">
                                    <RecipeDetailView recipe={meal.recipe} langKey={langKey} />
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </GlassCard>
    </motion.div>
  );
};

export default MealPlanCard;
