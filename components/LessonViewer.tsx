import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { BookOpen } from 'lucide-react';
import type { AcademyLesson } from '../types';

interface LessonViewerProps {
    lesson: AcademyLesson | null;
    onClose: () => void;
}

// This is a placeholder component for a feature that is not yet fully implemented.
const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onClose }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';


  if (!lesson) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 p-4">
        <GlassCard className="w-full max-w-2xl mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold text-amber-300">{lesson.title[langKey]}</h2>
            {/* FIX: Correctly access the introduction text from the lesson content object. */}
            <p>{lesson.content.introduction[langKey]}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-teal-500 rounded-lg">{t('Close')}</button>
        </GlassCard>
    </div>
  );
};

export default LessonViewer;