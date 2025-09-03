import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { PartyPopper, ChevronRight } from 'lucide-react';
import * as geminiService from '../services/geminiService';
import type { FestivalTheme } from '../types';
import { audioService } from '../services/audioService';

interface MonthlyFestivalProps {
    onIdeaClick: (idea: string) => void;
}

const MonthlyFestival: React.FC<MonthlyFestivalProps> = ({ onIdeaClick }) => {
    const { i18n, t } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const [festival, setFestival] = useState<FestivalTheme | null>(null);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const theme = await geminiService.getMonthlyFestivalTheme();
                setFestival(theme);
            } catch (error) {
                console.error("Failed to fetch festival theme:", error);
            }
        };
        fetchTheme();
    }, []);

    const handleIdeaClick = (title: string) => {
        audioService.playClick();
        onIdeaClick(title);
    };

    if (!festival) {
        return ( // Skeleton loader
            // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
            <motion.div
                className="w-full max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <GlassCard className="p-4 sm:p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black/20 rounded-full"></div>
                        <div className="flex-grow space-y-2">
                            <div className="h-5 w-3/4 bg-black/20 rounded"></div>
                            <div className="h-4 w-full bg-black/20 rounded"></div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        );
    }

    return (
        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
        <motion.div
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <GlassCard className="p-4 sm:p-6 !bg-gradient-to-tr from-purple-500/20 to-pink-500/20 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="text-purple-300">
                        <PartyPopper size={40} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-stone-100">{festival.title[langKey]}</h3>
                        <p className="text-sm text-stone-100/80">{festival.description[langKey]}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {festival.recipeIdeas.map((idea, index) => (
                        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                        <motion.button
                            key={index}
                            className="w-full text-left p-2 bg-black/20 rounded-lg hover:bg-black/30 flex justify-between items-center"
                            onClick={() => handleIdeaClick(idea.title.en)}
                            whileHover={{ y: -2 }}
                        >
                            <div>
                                <h4 className="font-semibold text-amber-300">{idea.title[langKey]}</h4>
                                <p className="text-xs text-stone-100/70">{idea.description[langKey]}</p>
                            </div>
                            <ChevronRight className="flex-shrink-0 text-amber-300/70" />
                        </motion.button>
                    ))}
                </div>
            </GlassCard>
        </motion.div>
    );
};

export default MonthlyFestival;