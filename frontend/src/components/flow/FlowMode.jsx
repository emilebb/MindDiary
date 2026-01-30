import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinimize, FiType, FiMic, FiEdit3, FiCamera, FiClock, FiTarget, FiMaximize2 } from 'react-icons/fi';
import { Button } from '../ui/Button';
import CaptureModal from '../capture/CaptureModal';

export const FlowMode = ({ 
  isActive, 
  onExit, 
  autoSaveInterval = 60000, // 1 minuto
  className = '' 
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [captureType, setCaptureType] = useState('text');
  const [flowState, setFlowState] = useState('entering'); // 'entering', 'flowing', 'deep'
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [ideas, setIdeas] = useState([]);
  
  const textAreaRef = useRef(null);
  const timerRef = useRef(null);

  // Timer de sesión
  useEffect(() => {
    if (isActive && !isMinimized) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isActive, isMinimized]);

  // Auto-guardado
  useEffect(() => {
    if (isActive) {
      const autoSaveTimer = setInterval(() => {
        handleAutoSave();
      }, autoSaveInterval);

      return () => clearInterval(autoSaveTimer);
    }
  }, [isActive, autoSaveInterval, ideas]);

  // Detección de estado de flow
  useEffect(() => {
    const timeSinceActivity = Date.now() - lastActivity;
    
    if (timeSinceActivity > 300000) { // 5 minutos inactivo
      setFlowState('entering');
    } else if (timeSinceActivity < 60000 && wordCount > 100) { // Muy activo
      setFlowState('deep');
    } else if (timeSinceActivity < 120000) { // Actividad moderada
      setFlowState('flowing');
    }
  }, [lastActivity, wordCount]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isActive || isMinimized) return;
      
      // Ctrl/Cmd + N: Nueva idea
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewIdea();
      }
      
      // Ctrl/Cmd + S: Guardar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleAutoSave();
      }
      
      // Escape: Salir del modo flujo
      if (e.key === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, isMinimized]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    setLastActivity(Date.now());
  };

  const handleNewIdea = () => {
    if (textAreaRef.current) {
      const currentText = textAreaRef.current.value;
      if (currentText.trim()) {
        const newIdea = {
          id: Date.now(),
          content: currentText.trim(),
          timestamp: new Date().toISOString(),
          wordCount: currentText.split(/\s+/).filter(word => word.length > 0).length
        };
        setIdeas(prev => [...prev, newIdea]);
        textAreaRef.current.value = '';
        setWordCount(0);
      }
    }
  };

  const handleAutoSave = useCallback(async () => {
    const sessionData = {
      ideas,
      sessionTime,
      flowState,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Guardar en localStorage como fallback
      localStorage.setItem('flowSession', JSON.stringify(sessionData));
      
      // Aquí iría la llamada a la API
      console.log('Auto-saving flow session:', sessionData);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [ideas, sessionTime, flowState]);

  const handleExit = () => {
    handleAutoSave();
    onExit({
      ideas,
      sessionTime,
      flowState
    });
  };

  const handleCapture = (type) => {
    setCaptureType(type);
    setShowCaptureModal(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getFlowStateColor = () => {
    switch (flowState) {
      case 'entering': return 'from-blue-500 to-cyan-600';
      case 'flowing': return 'from-green-500 to-emerald-600';
      case 'deep': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getFlowStateMessage = () => {
    switch (flowState) {
      case 'entering': return 'Entrando en estado de flow...';
      case 'flowing': return '¡Estás en flow!';
      case 'deep': return 'Flow profundo alcanzado';
      default: return 'Concéntrate';
    }
  };

  if (!isActive) return null;

  return (
    <>
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Header Minimalista */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex items-center justify-between p-4 border-b border-gray-800"
            >
              <div className="flex items-center gap-6">
                {/* Indicador de Flow State */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getFlowStateColor()} animate-pulse`} />
                  <span className="text-gray-300 text-sm">{getFlowStateMessage()}</span>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{formatTime(sessionTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiTarget size={14} />
                    <span>{wordCount} palabras</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{ideas.length} ideas</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMinimized(true)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <FiMinimize size={16} />
                </Button>
                <Button
                  onClick={handleExit}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={16} />
                </Button>
              </div>
            </motion.div>

            {/* Área de Escritura */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl">
                <textarea
                  ref={textAreaRef}
                  onChange={handleTextChange}
                  placeholder="Escribe libremente... sin juicios, sin límites..."
                  className="w-full h-96 bg-transparent text-white text-xl leading-relaxed resize-none outline-none placeholder-gray-600"
                  autoFocus
                />

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleCapture('text')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <FiType size={16} />
                    </Button>
                    <Button
                      onClick={() => handleCapture('voice')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <FiMic size={16} />
                    </Button>
                    <Button
                      onClick={() => handleCapture('drawing')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <FiEdit3 size={16} />
                    </Button>
                    <Button
                      onClick={() => handleCapture('image')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <FiCamera size={16} />
                    </Button>
                  </div>

                  <Button
                    onClick={handleNewIdea}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    Nueva Idea (Ctrl+N)
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer con hints */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center justify-center text-xs text-gray-600">
                <span>Ctrl+N: Nueva idea | Ctrl+S: Guardar | Escape: Salir</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getFlowStateColor()} animate-pulse`} />
                <div className="text-sm">
                  <div className="text-white font-medium">Modo Flow Activo</div>
                  <div className="text-gray-400 text-xs">{formatTime(sessionTime)} • {ideas.length} ideas</div>
                </div>
                <Button
                  onClick={() => setIsMinimized(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <FiMaximize2 size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Modal */}
      <CaptureModal
        isOpen={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        type={captureType}
        onSave={(ideaData) => {
          const newIdea = {
            ...ideaData,
            id: Date.now(),
            timestamp: new Date().toISOString()
          };
          setIdeas(prev => [...prev, newIdea]);
          setShowCaptureModal(false);
        }}
      />
    </>
  );
};

export default FlowMode;
