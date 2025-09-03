import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { audioService } from '../services/audioService';
import GlassCard from './GlassCard';
import { useTranslation } from 'react-i18next';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, selectedValue, onValueChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (isOpen && selectRef.current) {
      const dropdownRect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const optionsMaxHeight = 240; // Corresponds to max-h-60
      const spaceAbove = dropdownRect.top;

      if (spaceBelow < optionsMaxHeight && spaceAbove > optionsMaxHeight) {
        setDirection('up');
      } else {
        setDirection('down');
      }
    }
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
    audioService.playClick();
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || t('selectPlaceholder');

  return (
    <div className="relative" ref={selectRef}>
      {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
      <motion.button
        type="button"
        className="w-full p-3 text-left bg-black/30 border border-amber-400/30 rounded-lg text-stone-100 placeholder-stone-100/50 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow flex justify-between items-center"
        onClick={() => {
            setIsOpen(!isOpen);
            audioService.playPop();
        }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{selectedLabel}</span>
        {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
          <motion.div
            className={`absolute z-50 w-full ${direction === 'down' ? 'mt-2 top-full' : 'mb-2 bottom-full'}`}
            initial={{ opacity: 0, y: direction === 'down' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === 'down' ? -10 : 10 }}
          >
            <GlassCard className="p-2 max-h-60 overflow-y-auto custom-scrollbar !bg-[#102a2a]/95 backdrop-blur-xl">
              <ul className="space-y-1">
                {options.map(option => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedValue === option.value
                          ? 'bg-black/30 text-amber-300 font-semibold'
                          : 'text-stone-100/80 hover:bg-black/20'
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span>{option.label}</span>
                      {selectedValue === option.value && <Check size={16} />}
                    </button>
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

export default CustomSelect;