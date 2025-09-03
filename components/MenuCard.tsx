import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Menu, Recipe } from '../types';
import GlassCard from './GlassCard';
import RecipeCard from './RecipeCard';
import { Utensils, Star, IceCream } from 'lucide-react';

interface MenuCardProps {
    menu: Menu;
    onRecipeSelect: (recipe: Recipe) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, onRecipeSelect }) => {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

    const courseVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
            },
        }),
    };

    return (
        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
        <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <GlassCard className="p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-300">{t('Menu for')} "{menu.occasion}"</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                    <motion.div custom={0} variants={courseVariants} initial="hidden" animate="visible">
                        <CourseSection icon={Star} title={t('Appetizer')} recipe={menu.appetizer} onRecipeSelect={onRecipeSelect} />
                    </motion.div>
                     {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                     <motion.div custom={1} variants={courseVariants} initial="hidden" animate="visible">
                        <CourseSection icon={Utensils} title={t('Main Course')} recipe={menu.mainCourse} onRecipeSelect={onRecipeSelect} />
                    </motion.div>
                     {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                     <motion.div custom={2} variants={courseVariants} initial="hidden" animate="visible">
                        <CourseSection icon={IceCream} title={t('Dessert')} recipe={menu.dessert} onRecipeSelect={onRecipeSelect} />
                    </motion.div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

const CourseSection: React.FC<{ icon: React.ElementType, title: string, recipe: Recipe, onRecipeSelect: (recipe: Recipe) => void }> = ({ icon: Icon, title, recipe, onRecipeSelect }) => {
    return (
        <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-stone-100">
                <Icon className="text-amber-400" />
                {title}
            </h3>
            <RecipeCard recipe={recipe} onSelect={onRecipeSelect} isCompact />
        </div>
    );
};

export default MenuCard;