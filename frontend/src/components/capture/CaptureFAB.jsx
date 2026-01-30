import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiMic, FiEdit3, FiCamera, FiPenTool } from 'react-icons/fi';

const CaptureFAB = ({ onCapture }) => {
  const [isOpen, setIsOpen] = useState(false);

  const captureOptions = [
    {
      id: 'text',
      icon: FiEdit3,
      label: 'Escribir idea',
      description: 'Empieza escribiendo lo que piensas...',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'voice',
      icon: FiMic,
      label: 'Hablar libremente',
      description: 'Toca el micrófono y habla libremente',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'drawing',
      icon: FiPenTool,
      label: 'Dibujar sin pensar',
      description: 'Tu lienzo en blanco te espera',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'image',
      icon: FiCamera,
      label: 'Capturar lo que ves',
      description: 'Una imagen vale mil pensamientos',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    }
  ];

  const handleOptionClick = (optionId) => {
    setIsOpen(false);
    onCapture(optionId);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                💭 ¿Cómo quieres capturar?
              </h3>
              <p className="text-gray-600">
                Una idea puede nacer de muchas formas
              </p>
            </div>

            {/* Options */}
            <div className="px-6 pb-6 space-y-3">
              {captureOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleOptionClick(option.id)}
                    className={`w-full bg-gradient-to-r ${option.color} ${option.hoverColor} text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-lg mb-1">
                        {option.label}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {option.description}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FiPlus size={16} className="rotate-45" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Cancel Button */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl p-4 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Principal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 45 : 0,
          scale: isOpen ? 1.1 : 1
        }}
        transition={{ type: 'spring', damping: 15 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center z-50 backdrop-blur-sm border border-white/20"
      >
        <FiPlus size={24} />
      </motion.button>

      {/* Partículas de fondo cuando está abierto */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 pointer-events-none z-30">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  x: '50%',
                  y: '50%',
                  opacity: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-xl"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaptureFAB;
