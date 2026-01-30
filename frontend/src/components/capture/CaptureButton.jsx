import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMic, FiCamera, FiEdit3, FiType } from 'react-icons/fi';
import { Button } from '../ui/Button';

export const CaptureButton = ({ onCapture, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleCapture = (type) => {
    setIsOpen(false);
    onCapture(type);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Iniciar grabación aquí
        setIsRecording(true);
        handleCapture('voice');
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    } else {
      // Detener grabación
      setIsRecording(false);
    }
  };

  const captureOptions = [
    { type: 'text', icon: <FiType size={20} />, label: 'Texto', color: 'from-blue-500 to-indigo-600' },
    { type: 'voice', icon: <FiMic size={20} />, label: 'Voz', color: 'from-green-500 to-emerald-600' },
    { type: 'drawing', icon: <FiEdit3 size={20} />, label: 'Dibujo', color: 'from-purple-500 to-pink-600' },
    { type: 'image', icon: <FiCamera size={20} />, label: 'Imagen', color: 'from-orange-500 to-red-600' }
  ];

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-2 min-w-[200px]"
          >
            {captureOptions.map((option, index) => (
              <motion.button
                key={option.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCapture(option.type)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  hover:bg-gray-700 transition-all duration-200
                  ${option.type === 'voice' && isRecording ? 'bg-red-500/20' : ''}
                `}
              >
                <div className={`
                  p-2 rounded-lg bg-gradient-to-r ${option.color}
                  ${option.type === 'voice' && isRecording ? 'animate-pulse' : ''}
                `}>
                  <div className="text-white">
                    {option.icon}
                  </div>
                </div>
                <span className="text-white font-medium">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 
          rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center text-white
          transition-all duration-300
          ${isOpen ? 'rotate-45' : ''}
          ${isRecording ? 'animate-pulse from-red-500 to-red-600' : ''}
        `}
      >
        <FiPlus size={24} />
      </motion.button>
    </div>
  );
};

export default CaptureButton;
