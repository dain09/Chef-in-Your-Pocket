import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Book, Heart, Archive, BookOpen } from 'lucide-react';
import GlassCard from './GlassCard';
import { audioService } from '../services/audioService';

interface HeaderMenuProps {
  onCookbooksClick: () => void;
  onFavoritesClick: () => void;
  onPantryClick: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ onCookbooksClick, onFavoritesClick, onPantryClick }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    audioService.playClick();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action: () => void) => {
    audioService.playClick();
    action();
    setIsOpen(false);
  };

  const menuItems = [
    { label: t('header.cookbooks'), icon: Book, action: onCookbooksClick },
    { label: t('header.favorites'), icon: Heart, action: onFavoritesClick },
    { label: t('header.pantry'), icon: Archive, action: onPantryClick },
    { label: t('header.academy'), icon: BookOpen, href: '/academy.html' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={handleToggle}
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black/20 rounded-lg hover:bg-black/40 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
      >
        <LayoutGrid className="text-stone-100/80" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 w-48 z-20"
          >
            <GlassCard className="p-2 !bg-[#102a2a]/95">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        onClick={() => audioService.playClick()}
                        className="flex items-center gap-3 w-full p-2 rounded-md text-stone-100/80 hover:bg-black/20 hover:text-amber-300"
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleItemClick(item.action)}
                        className="flex items-center gap-3 w-full p-2 rounded-md text-stone-100/80 hover:bg-black/20 hover:text-amber-300"
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderMenu;
