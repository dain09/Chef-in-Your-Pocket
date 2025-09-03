import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Send, User, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';
import * as geminiService from '../services/geminiService';
import type { Recipe, ChatMessage } from '../types';
import type { Chat } from '@google/genai';

interface RecipeChatModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeChatModal: React.FC<RecipeChatModalProps> = ({ recipe, onClose }) => {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const chatSession = geminiService.createRecipeChat();
            setChat(chatSession);

            const recipeContext = `Here is the recipe I'm asking about:
                Title: ${recipe.title[langKey]}
                Description: ${recipe.description[langKey]}
                Ingredients: ${recipe.ingredients.map(i => `${i.amount[langKey]} ${i.name[langKey]}`).join(', ')}
                Instructions: ${recipe.steps.map((s, idx) => `Step ${idx + 1}: ${s.text[langKey]}`).join(' ')}`;
            
            try {
                await chatSession.sendMessage({ message: recipeContext });
                setMessages([{ role: 'model', content: t('chat.welcomeMessage') }]);
            } catch (error) {
                console.error("Error priming chat:", error);
                setMessages([{ role: 'model', content: "Sorry, I couldn't load the recipe context. How can I help?" }]);
            } finally {
                setIsLoading(false);
            }
        };

        init();
        
        return () => {
            setChat(null);
            setMessages([]);
        }
    }, [recipe, t, langKey]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const currentInput = userInput;
        setUserInput('');
        audioService.playClick();
        setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
        setIsLoading(true);
        
        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <GlassCard
                className="w-full max-w-lg h-[90vh] p-4 sm:p-6 flex flex-col gap-4 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-amber-300">{t('Chat with the Chef')}</h2>
                    <button onClick={onClose} className="p-1 text-stone-100/70 hover:text-stone-100"><X size={24} /></button>
                </div>

                <div className="flex-grow bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300"><Sparkles size={18} /></div>}
                            <div className={`max-w-xs sm:max-w-sm p-3 rounded-2xl ${msg.role === 'user' ? 'bg-teal-500/80 text-white rounded-br-none' : 'bg-black/40 text-stone-100/90 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-stone-100/80"><User size={18} /></div>}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300"><Sparkles size={18} className="animate-pulse" /></div>
                            <div className="max-w-xs sm:max-w-sm p-3 rounded-2xl bg-black/40 text-stone-100/60 rounded-bl-none italic">
                                {t('chefIsTyping')}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t('Type your question...')}
                        className="flex-grow p-3 bg-black/30 border border-amber-400/30 rounded-lg text-stone-100 placeholder-stone-100/50 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow"
                    />
                    {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                    <motion.button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-teal-500 text-white rounded-lg disabled:opacity-50" whileHover={{scale:1.1}} whileTap={{scale:0.9}}>
                        <Send size={20} />
                    </motion.button>
                </form>
            </GlassCard>
        </motion.div>
    );
};

export default RecipeChatModal;