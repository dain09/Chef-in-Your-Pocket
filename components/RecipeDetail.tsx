import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe, MultilingualString, Ingredient } from '@/types';
import { ArrowLeft, Heart, Bookmark, ListPlus, CookingPot, Recycle, Users, Clock, Utensils, Minus, Plus, ChefHat, Info, Leaf, GlassWater, BarChart2, Star, MessageSquare } from 'lucide-react';

import GlassCard from '@/components/GlassCard';
import FlavorProfile from '@/components/FlavorProfile';
import HandsFreeCookingMode from '@/components/HandsFreeCookingMode';
import RecipeChatModal from '@/components/RecipeChatModal';
import { getYouTubeEmbedUrl } from '@/utils/youtubeParser';
import { parseIngredient } from '@/utils/ingredientParser';
import { audioService } from '@/services/audioService';
// FIX: Import generateSubstitutions to handle substitution tips.
import { getExtraRecipeInfo, generateSubstitutions } from '@/services/geminiService';
import { useToast } from '@/contexts/ToastContext';
import { useBlobUrl } from '@/hooks/useBlobUrl';

interface RecipeDetailProps {
    recipe: Recipe;
    onBack: () => void;
    isFavorite: boolean;
    onToggleFavorite: (recipe: Recipe) => void;
    onAddToShoppingList: (items: string[]) => void;
    onRemix: () => void;
    onAddToCookbook: (recipe: Recipe) => void;
}

type TipType = 'substitutions' | 'nutrition' | 'trivia' | 'drinks' | 'flavor';

const ActionButton = ({ onClick, icon: Icon, label, isActive = false, ...rest }: {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    [key: string]: any;
}) => (
    <motion.button 
        onClick={onClick} 
        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg w-20 h-20 text-center transition-colors ${isActive ? 'bg-rose-500/80 text-white' : 'bg-black/30 text-stone-100/80 hover:bg-black/40'}`}
        whileHover={{scale:1.05}} 
        whileTap={{scale:0.95}}
        {...rest}
    >
        <Icon size={24} />
        <span className="text-xs font-semibold">{label}</span>
    </motion.button>
);


const RecipeDetail: React.FC<RecipeDetailProps> = ({
    recipe,
    onBack,
    isFavorite,
    onToggleFavorite,
    onAddToShoppingList,
    onRemix,
    onAddToCookbook,
}) => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [servings, setServings] = useState(recipe.servings);
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const [activeTip, setActiveTip] = useState<TipType | null>(null);
    const [tipContent, setTipContent] = useState<MultilingualString | null>(null);
    const [isTipLoading, setIsTipLoading] = useState(false);

    const imageUrl = useBlobUrl(recipe.imageUrl);
    const youtubeUrl = useMemo(() => getYouTubeEmbedUrl(recipe.youtubeUrl), [recipe.youtubeUrl]);

    // Reset servings when recipe changes
    useEffect(() => {
        setServings(recipe.servings);
    }, [recipe]);

    const scaledIngredients = useMemo(() => {
        if (servings === recipe.servings) {
            return recipe.ingredients;
        }
        const scaleFactor = servings / recipe.servings;
        return recipe.ingredients.map(ing => {
            const parsed = parseIngredient(ing.amount.en);
            if (parsed) {
                const newAmount = parseFloat((parsed.quantity * scaleFactor).toFixed(2));
                return {
                    ...ing,
                    amount: {
                        en: `${newAmount} ${parsed.unit}`,
                        ar: `${newAmount} ${ing.amount.ar.replace(/[\d\.]+/g, '').trim()}`
                    }
                };
            }
            return ing;
        });
    }, [servings, recipe.ingredients, recipe.servings]);

    const handleServingsChange = (delta: number) => {
        audioService.playClick();
        setServings(prev => Math.max(1, prev + delta));
    };

    const handleGetExtraInfo = useCallback(async (type: TipType) => {
        audioService.playPop();
        if (activeTip === type) {
            setActiveTip(null);
            return;
        }
        
        setActiveTip(type);
        setTipContent(null);

        if (type === 'flavor') {
            return; // Flavor profile is handled separately
        }
        
        setIsTipLoading(true);
        let info: MultilingualString | null = null;
        if (type === 'substitutions') {
            info = await generateSubstitutions(recipe.ingredients);
        } else {
            // After checks, type is narrowed to 'nutrition' | 'trivia' | 'drinks', which is what getExtraRecipeInfo expects.
            info = await getExtraRecipeInfo(recipe.title.en, type);
        }
        setTipContent(info);
        setIsTipLoading(false);

    }, [activeTip, recipe.title.en, recipe.ingredients]);

    const handleAddAllToShoppingList = () => {
        const items = scaledIngredients.map(ing => `${ing.amount[langKey]} ${ing.name[langKey]}`);
        onAddToShoppingList(items);
    };

    const tipButtonClasses = (type: TipType) => 
        `flex-1 p-2 rounded-lg flex flex-col items-center gap-1 text-xs sm:text-sm transition-all duration-300
         ${activeTip === type ? 'bg-amber-400 text-black scale-105' : 'bg-black/30 hover:bg-black/40'}`;

    const tipIconProps = { size: 24, className: "mb-1" };

    return (
        <>
        <motion.div
            layoutId={`recipe-${recipe.id}`}
            className="w-full max-w-4xl mx-auto"
        >
            <GlassCard className="p-4 sm:p-6 space-y-6">
                <button onClick={onBack} className="flex items-center gap-2 text-stone-100/70 hover:text-stone-100">
                    <ArrowLeft size={20} />
                    <span>{t('Back to search')}</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left/Top Column: Title, Meta, Actions, Description */}
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 break-words">{recipe.title[langKey]}</h2>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-100/70">
                            <span className="flex items-center gap-1.5"><Utensils size={14}/> {recipe.cuisine[langKey]}</span>
                            <span className="flex items-center gap-1.5"><Star size={14}/> {recipe.diet[langKey]}</span>
                        </div>
                        
                        <p className="text-stone-100/80">{recipe.description[langKey]}</p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <ActionButton 
                                onClick={() => onToggleFavorite(recipe)}
                                icon={Heart}
                                label={isFavorite ? t('actions.unfavorite') : t('actions.favorite')}
                                isActive={isFavorite}
                                aria-label={isFavorite ? t('actions.unfavorite') : t('actions.favorite')}
                            />
                            <ActionButton 
                                onClick={() => onAddToCookbook(recipe)}
                                icon={Bookmark}
                                label={t('actions.save')}
                                aria-label={t('actions.save')}
                            />
                            <ActionButton 
                                onClick={() => setIsHandsFree(true)}
                                icon={CookingPot}
                                label={t('actions.cookMode')}
                                aria-label={t('actions.cookMode')}
                            />
                            <ActionButton 
                                onClick={() => setIsChatOpen(true)}
                                icon={MessageSquare}
                                label={t('actions.askChef')}
                                aria-label={t('actions.askChef')}
                            />
                            <ActionButton 
                                onClick={onRemix}
                                icon={Recycle}
                                label={t('actions.remix')}
                                aria-label={t('actions.remix')}
                            />
                        </div>
                    </div>
                    
                    {/* Right/Bottom Column: Image, Timings */}
                    <div className="space-y-4">
                        {imageUrl && imageUrl !== 'IMAGE_GENERATION_FAILED' && (
                             <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                                <img src={imageUrl} alt={recipe.title.en} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex justify-around items-center text-center p-2 bg-black/20 rounded-lg">
                            <div>
                                <Clock size={24} className="mx-auto mb-1 text-amber-400"/>
                                <p className="text-sm font-bold">{t('Cook Time')}</p>
                                <p className="text-xs text-stone-100/80">{recipe.cookTime[langKey]}</p>
                            </div>
                             <div>
                                <Users size={24} className="mx-auto mb-1 text-amber-400"/>
                                <p className="text-sm font-bold">{t('Servings')}</p>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <button onClick={() => handleServingsChange(-1)} className="p-1 bg-black/40 rounded-full"><Minus size={14}/></button>
                                    <span className="text-xs w-4 text-center">{servings}</span>
                                    <button onClick={() => handleServingsChange(1)} className="p-1 bg-black/40 rounded-full"><Plus size={14}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-amber-400/20 pt-6">
                    <div className="flex border-b border-amber-400/20 mb-4">
                        <button onClick={() => setActiveTab('ingredients')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'ingredients' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-stone-100/60'}`}>{t('Ingredients')}</button>
                        <button onClick={() => setActiveTab('instructions')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'instructions' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-stone-100/60'}`}>{t('Instructions')}</button>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{opacity: 0, y:10}} animate={{opacity: 1, y:0}} exit={{opacity: 0, y: -10}}>
                            {activeTab === 'ingredients' ? (
                                <div className="space-y-3">
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {scaledIngredients.map((ing, i) => (
                                            <li key={i} className="border-b border-white/10 py-1">{ing.amount[langKey]} <span className="font-semibold text-stone-100/90">{ing.name[langKey]}</span></li>
                                        ))}
                                    </ul>
                                    <button onClick={handleAddAllToShoppingList} className="mt-4 flex items-center gap-2 px-4 py-2 bg-teal-500/80 text-white font-semibold rounded-lg hover:bg-teal-500">
                                        <ListPlus size={18} /> {t('Add all to Shopping List')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <ol className="space-y-3">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/30 text-amber-300 font-bold rounded-full mt-1">{i + 1}</div>
                                            <p className="text-stone-100/90 leading-relaxed">{step.text[langKey]}</p>
                                        </li>
                                    ))}
                                    </ol>
                                    {youtubeUrl && (
                                        <div className="aspect-video bg-black/20 rounded-lg overflow-hidden mt-6">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={youtubeUrl}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                 {/* Chef's Tips */}
                <div className="border-t border-amber-400/20 pt-6 space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold"><ChefHat size={24} className="text-amber-400" />{t('chefsTips')}</h3>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleGetExtraInfo('substitutions')} className={tipButtonClasses('substitutions')}><Recycle {...tipIconProps}/> {t('Substitutions')}</button>
                        <button onClick={() => handleGetExtraInfo('nutrition')} className={tipButtonClasses('nutrition')}><Leaf {...tipIconProps}/> {t('Nutritional Info')}</button>
                        <button onClick={() => handleGetExtraInfo('trivia')} className={tipButtonClasses('trivia')}><Info {...tipIconProps}/> {t('Fun Facts')}</button>
                        <button onClick={() => handleGetExtraInfo('drinks')} className={tipButtonClasses('drinks')}><GlassWater {...tipIconProps}/> {t('Drink Pairings')}</button>
                        <button onClick={() => handleGetExtraInfo('flavor')} className={tipButtonClasses('flavor')}><BarChart2 {...tipIconProps}/> {t('Flavor Profile')}</button>
                    </div>
                    <AnimatePresence>
                    {activeTip && (
                        <motion.div initial={{opacity:0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity:0, height: 0}} className="bg-black/20 p-4 rounded-lg overflow-hidden">
                            {isTipLoading ? (
                                <p>{t('loadingTipContent')}</p>
                            ) : activeTip === 'flavor' ? (
                                <FlavorProfile data={recipe.flavorProfile} />
                            ) : (
                                <p className="text-stone-100/90">{tipContent?.[langKey]}</p>
                            )}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </motion.div>
        <AnimatePresence>
            {isHandsFree && <HandsFreeCookingMode recipe={recipe} onClose={() => setIsHandsFree(false)} />}
            {isChatOpen && <RecipeChatModal recipe={recipe} onClose={() => setIsChatOpen(false)} />}
        </AnimatePresence>
        </>
    );
};

export default RecipeDetail;