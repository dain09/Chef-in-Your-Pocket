import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe, Ingredient, Substitute } from '../types';
import GlassCard from './GlassCard';
import { Star, ListPlus, ChefHat, Heart, Wand2, Youtube, Pencil, BookOpen, VenetianMask, Utensils, Share2, X, Loader2, ImageOff } from 'lucide-react';
import { audioService } from '../services/audioService';
import { useToast } from '../contexts/ToastContext';
import { getIngredientSubstitutes } from '../services/geminiService';
import { useBlobUrl } from '../hooks/useBlobUrl';


const SubstitutesModal: React.FC<{ ingredient: Ingredient; onClose: () => void; langKey: 'en' | 'ar' }> = ({ ingredient, onClose, langKey }) => {
    const { t } = useTranslation();
    const [substitutes, setSubstitutes] = useState<Substitute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();


    useEffect(() => {
        const fetchSubstitutes = async () => {
            setIsLoading(true);
            try {
                const result = await getIngredientSubstitutes(ingredient.name.en);
                setSubstitutes(result);
            } catch (error) {
                console.error(error);
                addToast(t('errorFindingSubstitutes'), 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubstitutes();
    }, [ingredient.name.en, t, addToast]);


    return (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <GlassCard
                className="w-full max-w-lg p-4 flex flex-col gap-4 relative"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            >
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-pink-900/70 hover:text-pink-900 z-10">
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold text-pink-900 text-center">{t('ingredientSubstitutesTitle', { ingredientName: ingredient.name[langKey] })}</h3>
                <div className="min-h-[10rem] flex flex-col justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-pink-900/70">
                            <Loader2 className="animate-spin" size={32} />
                            <p>{t('findingSubstitutes')}</p>
                        </div>
                    ) : substitutes.length > 0 ? (
                        <ul className="space-y-3">
                            {substitutes.map((sub, index) => (
                                <li key={index}>
                                    <strong className="text-pink-900">{sub.name[langKey]}</strong>
                                    <p className="text-sm text-pink-900/80">{sub.description[langKey]}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                       <p className="text-center text-pink-900/70">{t('noSubstitutesFound')}</p> 
                    )}
                </div>
            </GlassCard>
        </motion.div>
    );
};

const RemixModal: React.FC<{ onRemix: (prompt: string) => void; onClose: () => void }> = ({ onRemix, onClose }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onRemix(prompt);
            onClose();
        }
    };
    
    return (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <GlassCard
                className="w-full max-w-lg p-4 flex flex-col gap-4 relative"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            >
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-pink-900/70 hover:text-pink-900 z-10">
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold text-pink-900 text-center">{t('addYourTouch')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-pink-900/80 text-center">{t('remixInstruction')}</p>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full p-2 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                        placeholder={t('remixPlaceholder')}
                    />
                    <div className="flex justify-end gap-3">
                        <motion.button type="button" onClick={onClose} className="px-4 py-2 bg-black/10 text-pink-900 font-semibold rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{t('cancel')}</motion.button>
                        <motion.button type="submit" disabled={!prompt.trim()} className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{t('remixRecipe')}</motion.button>
                    </div>
                </form>
            </GlassCard>
        </motion.div>
    );
};


interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionProps> = ({ icon: Icon, title, children }) => (
  <GlassCard className="p-4 sm:p-6">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 text-cyan-400 me-3 flex-shrink-0" />
      <h3 className="text-xl sm:text-2xl font-bold text-pink-900">{title}</h3>
    </div>
    {children}
  </GlassCard>
);


interface RecipeCardProps {
  recipe: Recipe;
  onAddToFavorites: (recipe: Recipe) => void;
  onAddToShoppingList: (ingredients: Ingredient[]) => void;
  onStartHandsFree: (recipe: Recipe) => void;
  isFavorite: boolean;
  onRemix: (remixPrompt: string) => void;
  notes: string;
  onUpdateNote: (recipeId: string, note: string) => void;
}

const ActionButton: React.FC<{onClick: () => void; icon: React.ElementType; label: string; active?: boolean;}> = memo(({ onClick, icon: Icon, label, active }) => (
    <motion.button
        onClick={() => { audioService.playClick(); onClick(); }}
        className={`w-full p-3 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${active ? 'bg-pink-200/80 text-pink-800' : 'bg-white/30 text-pink-900/80 hover:bg-white/50'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <Icon size={18} /> {label}
    </motion.button>
));


const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAddToFavorites, onAddToShoppingList, onStartHandsFree, isFavorite, onRemix, notes, onUpdateNote }) => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(notes);
  const [substituteIngredient, setSubstituteIngredient] = useState<Ingredient | null>(null);
  const [isRemixModalOpen, setRemixModalOpen] = useState(false);
  const blobImageUrl = useBlobUrl(recipe.imageUrl);

  const handleNotesSave = useCallback(() => {
    onUpdateNote(recipe.id, noteContent);
    setIsNotesEditing(false);
    addToast(t('toastNotesSaved'), 'success');
  }, [noteContent, onUpdateNote, recipe.id, t, addToast]);
  
  const handleShare = useCallback(async () => {
    const shareData = {
        title: `${t('appName')}: ${recipe.recipeName[langKey]}`,
        text: recipe.description[langKey],
        url: window.location.href,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            addToast(t('toastRecipeShared'), 'success');
        } else {
            await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
            addToast(t('toastRecipeCopied'), 'info');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  }, [recipe, langKey, t, addToast]);

  const youtubeSearchUrl = useMemo(() => 
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`${recipe.recipeName.en} recipe`)}`,
    [recipe.recipeName.en]
  );
  
  return (
    <>
        <AnimatePresence>
            {substituteIngredient && <SubstitutesModal ingredient={substituteIngredient} onClose={() => setSubstituteIngredient(null)} langKey={langKey} />}
            {isRemixModalOpen && <RemixModal onRemix={onRemix} onClose={() => setRemixModalOpen(false)} />}
        </AnimatePresence>
        <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-900">{recipe.recipeName[langKey]}</h2>
                <p className="mt-2 text-base text-pink-900/80 max-w-2xl mx-auto">{recipe.description[langKey]}</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mt-4 text-pink-900/90">
                    <span><strong>{t('prepTime')}:</strong> {recipe.prepTime[langKey]}</span>
                    <span><strong>{t('cookTime')}:</strong> {recipe.cookTime[langKey]}</span>
                    <span><strong>{t('servings')}:</strong> {recipe.servings} {t('people')}</span>
                </div>
            </div>

            <GlassCard className="p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 rounded-2xl">
                <ActionButton onClick={() => onAddToFavorites(recipe)} icon={Heart} label={isFavorite ? t('inFavorites') : t('addToFavorites')} active={isFavorite} />
                <ActionButton onClick={() => { onAddToShoppingList(recipe.ingredients); addToast(t('toastAddedToShoppingList'), 'success'); }} icon={ListPlus} label={t('addToShoppingList')} />
                <ActionButton onClick={() => onStartHandsFree(recipe)} icon={ChefHat} label={t('startCooking')} />
                <ActionButton onClick={() => setRemixModalOpen(true)} icon={Wand2} label={t('addYourTouch')} />
                <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="md:col-start-auto col-span-2 lg:col-span-1">
                  <ActionButton onClick={() => {}} icon={Youtube} label={t('watchTutorial')} />
                </a>
            </GlassCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard icon={Utensils} title={t('ingredients')}>
                    <ul className="list-none list-inside columns-1 sm:columns-2 gap-x-6 text-sm text-pink-900/90">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="mb-1 flex items-center group">
                                <span>{ing.amount[langKey]} {ing.name[langKey]}</span>
                                <button onClick={() => setSubstituteIngredient(ing)} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">
                                    <Wand2 size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </SectionCard>

                <SectionCard icon={BookOpen} title={t('nutritionFacts')}>
                    <div className="grid grid-cols-2 gap-4 text-sm text-pink-900/90">
                        <div><strong>{t('calories')}:</strong> {recipe.nutrition.calories[langKey]}</div>
                        <div><strong>{t('protein')}:</strong> {recipe.nutrition.protein[langKey]}</div>
                        <div><strong>{t('carbs')}:</strong> {recipe.nutrition.carbs[langKey]}</div>
                        <div><strong>{t('fat')}:</strong> {recipe.nutrition.fat[langKey]}</div>
                    </div>
                </SectionCard>
            </div>
            
            <GlassCard className="p-4 min-h-[20rem] flex items-center justify-center">
                { recipe.imageUrl === 'error' ? (
                    <div className="flex flex-col items-center gap-2 text-pink-900/30">
                       <ImageOff size={48} />
                       <p className="mt-2 text-sm">{t('errorImage')}</p>
                    </div>
                ) : recipe.imageUrl ? (
                    <motion.img 
                        key={recipe.id}
                        src={blobImageUrl} 
                        alt={recipe.recipeName[langKey]} 
                        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                     <div className="flex flex-col items-center gap-2 text-pink-900/30">
                        <Loader2 size={40} className="animate-spin"/>
                        <p className="mt-2 text-sm">{t('generatingImage')}</p>
                     </div>
                )}
            </GlassCard>

            <SectionCard icon={ChefHat} title={t('preparationMethod')}>
                 <ol className="list-decimal list-inside space-y-3 text-pink-900/90">
                    {recipe.steps.map((step, i) => (
                        <li key={i} className="pl-2">{step[langKey]}</li>
                    ))}
                </ol>
            </SectionCard>
            
             <SectionCard icon={Pencil} title={t('myNotes')}>
                {isNotesEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={4}
                            className="w-full p-2 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50"
                            placeholder={t('notesPlaceholder')}
                        />
                        <button onClick={handleNotesSave} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg">{t('saveNotes', 'Save Notes')}</button>
                    </div>
                ) : (
                    <div onClick={() => setIsNotesEditing(true)} className="cursor-pointer min-h-[5rem]">
                        <p className={`text-pink-900/90 italic ${!noteContent ? 'text-pink-900/50' : ''}`}>
                            {noteContent || t('notesPlaceholder')}
                        </p>
                    </div>
                )}
            </SectionCard>

            <SectionCard icon={VenetianMask} title={t('funSection')}>
                <div className="space-y-6 text-pink-900/90">
                    {recipe.funStuff.proTips?.length > 0 && (
                        <div>
                            <h4 className="font-bold text-pink-900 mb-2">{t('proTips')}</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {recipe.funStuff.proTips.map((tip, i) => <li key={i}>{tip[langKey]}</li>)}
                            </ul>
                        </div>
                    )}
                    {recipe.pairings?.length > 0 && (
                        <div>
                            <h4 className="font-bold text-pink-900 mb-2">{t('pairings')}</h4>
                             <ul className="list-disc list-inside space-y-1">
                                {recipe.pairings.map((p, i) => <li key={i}><strong>{p.name[langKey]}:</strong> {p.description[langKey]}</li>)}
                            </ul>
                        </div>
                    )}
                    {recipe.funStuff.jokes?.length > 0 && (
                         <div>
                            <h4 className="font-bold text-pink-900 mb-2">{t('foodJokes')}</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {recipe.funStuff.jokes.map((joke, i) => <li key={i}>{joke[langKey]}</li>)}
                            </ul>
                        </div>
                    )}
                    {recipe.funStuff.historyFact?.[langKey] && (
                        <div>
                            <h4 className="font-bold text-pink-900 mb-2">{t('historyCorner')}</h4>
                            <p>{recipe.funStuff.historyFact[langKey]}</p>
                        </div>
                    )}
                </div>
            </SectionCard>
        </div>
    </>
  );
};

export default memo(RecipeCard);