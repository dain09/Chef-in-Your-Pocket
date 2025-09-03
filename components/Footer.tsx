import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import * as geminiService from '../services/geminiService';
import type { MultilingualString } from '../types';

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const currentYear = new Date().getFullYear();
    const [supportMessage, setSupportMessage] = useState<MultilingualString | null>(null);

    useEffect(() => {
        const fetchMessage = async () => {
            const message = await geminiService.getSupportMessage();
            if (message) {
                setSupportMessage(message);
            }
        };
        fetchMessage();
    }, []);

    return (
        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
        <motion.footer 
            className="w-full max-w-7xl mx-auto mt-auto py-6 text-center text-stone-100/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 3.0 }}
        >
            <p className="mb-4 text-base font-semibold text-stone-100/80 h-6 flex items-center justify-center">
              {supportMessage ? supportMessage[langKey] : '...'}
            </p>
            <div className="flex justify-center items-center gap-6 mb-2">
                {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                <motion.a 
                    href="https://github.com/dain09" 
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, color: '#e5b84c' }}
                    aria-label="GitHub Profile"
                >
                    <Github size={24} />
                </motion.a>
                {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                <motion.a 
                    href="https://t.me/D_ai_n" 
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, color: '#e5b84c' }}
                    aria-label="Telegram Profile"
                >
                    <Send size={24} />
                </motion.a>
            </div>
            <p className="text-sm">
                {t('footer.copyright', { year: currentYear, name: 'Abdallah ibrahim & Dain09' })}
            </p>
        </motion.footer>
    );
};

export default Footer;