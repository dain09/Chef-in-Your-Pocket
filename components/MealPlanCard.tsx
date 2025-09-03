import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { MealPlan, Recipe } from '../types';
import GlassCard from './GlassCard';
import RecipeCard from './RecipeCard';

interface MealPlanCardProps {
    mealPlan: MealPlan;
    onRecipeSelect: (recipe: Recipe) => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, onRecipeSelect }) => {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    
    return (
        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
        <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <GlassCard className="p-6 space-y-6">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-300">{t('Your Weekly Plan')}</h2>
                    <p className="text-stone-100/80">{mealPlan.goals}</p>
                </div>
                 <div className="space-y-4">
                    {mealPlan.days.map((day, index) => (
                        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
                        >
                            <h3 className="font-bold text-xl text-amber-300 mb-2">{day.day[langKey]}</h3>
                            <RecipeCard recipe={day.recipe} onSelect={onRecipeSelect} isCompact/>
                        </motion.div>
                    ))}
                 </div>
            </GlassCard>
        </motion.div>
    );
};

export default MealPlanCard;