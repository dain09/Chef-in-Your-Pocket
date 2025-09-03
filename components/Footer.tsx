import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer 
            className="w-full max-w-7xl mx-auto mt-auto py-6 text-center text-pink-900/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 3.0 }}
        >
            <div className="flex justify-center items-center gap-6 mb-2">
                <motion.a 
                    href="https://github.com/dain09" 
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, color: '#ec4899' }}
                    aria-label="GitHub Profile"
                >
                    <Github size={24} />
                </motion.a>
                <motion.a 
                    href="https://t.me/D_ai_n" 
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, color: '#ec4899' }}
                    aria-label="Telegram Profile"
                >
                    <Send size={24} />
                </motion.a>
            </div>
            <p className="text-sm">
                {t('footer.copyright', { year: currentYear, name: 'Dain09' })}
            </p>
        </motion.footer>
    );
};

export default Footer;
