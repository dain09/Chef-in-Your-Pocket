import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Camera, RefreshCw } from 'lucide-react';
import { audioService } from '../services/audioService';

interface ImageCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

const ImageCaptureModal: React.FC<ImageCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Could not access the camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      audioService.playClick();
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };
  
  const handleRetake = () => {
    setImage(null);
    startCamera();
  }
  
  const handleConfirm = () => {
    if(image) {
        onCapture(image);
    }
  }

  const handleClose = () => {
    stopCamera();
    onClose();
  };
  
  // Custom effect to manage camera state based on modal visibility
  React.useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);


  if (!isOpen) return null;

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-lg p-6 flex flex-col gap-4 relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button onClick={handleClose} className="absolute top-2 right-2 p-2 text-stone-100/70 hover:text-stone-100 z-10">
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-center text-stone-100">{t('Capture Ingredients')}</h3>
        
        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
            {image ? (
                 // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                 <motion.img key="preview" src={image} alt="Captured" className="w-full h-full object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            ) : (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.video key="camera" ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            )}
            </AnimatePresence>
        </div>

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <div className="flex justify-center items-center gap-4">
            {image ? (
                <>
                    {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                    <motion.button onClick={handleRetake} className="flex items-center gap-2 px-4 py-2 bg-black/30 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <RefreshCw size={20} /> {t('Retake')}
                    </motion.button>
                     {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                     <motion.button onClick={handleConfirm} className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        {t('Confirm')}
                    </motion.button>
                </>
            ) : (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.button 
                    onClick={handleCapture} 
                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="w-14 h-14 rounded-full bg-white ring-2 ring-inset ring-stone-900/50"></div>
                </motion.button>
            )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ImageCaptureModal;