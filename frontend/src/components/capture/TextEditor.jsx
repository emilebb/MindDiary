import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiClock, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi';
import MindMapIntegration from './MindMapIntegration';

const TextEditor = ({ isOpen, onClose, onSave, projectId }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showMindMapIntegration, setShowMindMapIntegration] = useState(false);
  const textareaRef = useRef(null);

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!isOpen || !content.trim()) return;

    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [content, isOpen]);

  // Auto-guardado al salir
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (content.trim()) {
        handleAutoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [content]);

  // Focus al abrir
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleAutoSave = async () => {
    if (!content.trim() || isAutoSaving) return;

    setIsAutoSaving(true);
    try {
      await onSave({
        type: 'text',
        content: content.trim(),
        projectId,
        autoSave: true
      });
      setLastSaved(new Date());
      showSaveAnimation();
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        type: 'text',
        content: content.trim(),
        projectId,
        autoSave: false
      });
      setLastSaved(new Date());
      showSaveAnimation();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const showSaveAnimation = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + S para guardar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }
    // Escape para cerrar
    if (e.key === 'Escape') {
      if (content.trim()) {
        handleAutoSave();
      }
      onClose();
    }
  };

  const getPlaceholder = () => {
    const placeholders = [
      "Empieza escribiendo lo que piensas...",
      "No te preocupes por la perfección...",
      "¿Qué idea te está visitando ahora?",
      "Suelta tu mente en este espacio...",
      "Una pequeña semilla puede convertirse en un bosque..."
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const handleMindMapIntegration = () => {
    if (!content.trim()) return;
    setShowMindMapIntegration(true);
  };

  const handleMindMapIntegrate = async (integrationData) => {
    try {
      await onSave({
        ...integrationData.ideaData,
        projectId: integrationData.projectId,
        mindMapId: integrationData.mindMapId,
        position: integrationData.position,
        addToMindMap: true
      });
      setShowMindMapIntegration(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Mind map integration failed:', error);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    
    if (diff < 60) return 'ahora';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    return `hace ${Math.floor(diff / 3600)} h`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiZap className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Escribir Idea</h3>
                    <p className="text-blue-100 text-sm">
                      {lastSaved ? `Guardado ${formatLastSaved()}` : 'Empieza a escribir...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (content.trim()) handleAutoSave();
                    onClose();
                  }}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <FiX className="text-white" size={20} />
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="p-6">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none text-lg leading-relaxed"
                style={{
                  minHeight: '300px',
                  maxHeight: '400px'
                }}
              />

              {/* Indicadores */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {charCount} caracteres
                  </span>
                  {isAutoSaving && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FiClock size={14} className="animate-spin" />
                      <span className="text-sm">Guardando...</span>
                    </div>
                  )}
                </div>

                {/* Indicador de guardado */}
                <AnimatePresence>
                  {showSaveIndicator && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <FiCheck size={16} />
                      <span className="text-sm font-medium">Guardado</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Acciones Rápidas */}
              {content.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200"
                >
                  <p className="text-sm text-blue-800 mb-3">
                    💡 ¿Qué quieres hacer con esta idea?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleManualSave}
                      disabled={isSaving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <FiClock size={16} className="animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <FiSave size={16} />
                          Guardar Idea
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleMindMapIntegration}
                      className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <FiArrowRight size={16} />
                      Mapa Mental
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer con atajos */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>Ctrl+S para guardar</span>
                <span>•</span>
                <span>Escape para salir</span>
                <span>•</span>
                <span>Auto-guardado cada 30s</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mind Map Integration */}
      <MindMapIntegration
        isOpen={showMindMapIntegration}
        onClose={() => setShowMindMapIntegration(false)}
        ideaData={{ type: 'text', content: content.trim() }}
        projects={[]} // Pasar proyectos reales desde props
        onIntegrate={handleMindMapIntegrate}
      />
    </AnimatePresence>
  );
};

export default TextEditor;
