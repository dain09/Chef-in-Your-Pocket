import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Heart, BookOpen } from 'lucide-react';

// This is a placeholder component for a feature that is not yet fully implemented.
// It can be safely deleted if this feature is not planned for the near future.
const BottomNav: React.FC = () => {
    const { t } = useTranslation();
    
    const navItems = [
        { icon: Home, label: t('Home') },
        { icon: Heart, label: t('Favorites') },
        { icon: BookOpen, label: t('Academy') },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-amber-300/10">
            <div className="flex justify-around items-center max-w-md mx-auto h-16">
                {navItems.map((item, index) => (
                    <button key={index} className="flex flex-col items-center gap-1 text-stone-100/70 hover:text-amber-300">
                        <item.icon />
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;