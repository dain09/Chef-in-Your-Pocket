import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';
import GlassCard from './GlassCard';
import type { Toast as ToastType } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="text-green-400" />,
  error: <XCircle className="text-red-400" />,
  info: <Info className="text-blue-400" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onRemove]);

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <GlassCard className="p-3 flex items-center gap-4 w-full max-w-sm !bg-[#102a2a]/95">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="flex-grow text-stone-100/90 text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="p-1 text-stone-100/50 hover:text-stone-100"
        >
          <X size={16} />
        </button>
      </GlassCard>
    </motion.div>
  );
};

export default Toast;