import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiArrowRight, FiMessageSquare, FiX } from 'react-icons/fi';

const TextModeAI = ({ 
  content, 
  isActive, 
  onSuggestion, 
  onStructureSuggestion,
  onConnectionSuggestion 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastContentRef = useRef('');
  const idleTimerRef = useRef(null);

  // Detectar cuando el usuario se detiene de escribir
  useEffect(() => {
    if (!isActive || !content.trim()) return;

    // Si el contenido cambió, reiniciar el timer
    if (content !== lastContentRef.current) {
      lastContentRef.current = content;
      
      // Limpiar timer anterior
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // Esperar 3 segundos de inactividad para sugerir
      idleTimerRef.current = setTimeout(() => {
        analyzeContent();
      }, 3000);
    }

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [content, isActive]);

  const analyzeContent = async () => {
    setIsThinking(true);
    
    try {
      // Simulación de análisis de IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiSuggestions = generateSuggestions(content);
      setSuggestions(aiSuggestions);
      
      if (aiSuggestions.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const generateSuggestions = (text) => {
    const suggestions = [];
    const wordCount = text.trim().split(/\s+/).length;
    
    // Detectar posibles bloqueos
    if (wordCount < 5) {
      suggestions.push({
        type: 'question',
        text: '¿Qué te inspira exactamente sobre esta idea?',
        action: 'question'
      });
    } else if (text.includes('?') || text.includes('¿')) {
      suggestions.push({
        type: 'structure',
        text: 'Podríamos estructurar esto como: pregunta → posibles respuestas → siguiente paso',
        action: 'structure'
      });
    } else if (text.length > 100 && !text.includes('\n')) {
      suggestions.push({
        type: 'structure',
        text: 'Esta idea podría beneficiarse de separarse en puntos clave',
        action: 'structure'
      });
    }

    // Sugerir conexiones si hay palabras clave
    const keywords = ['proyecto', 'idea', 'plan', 'objetivo', 'meta'];
    const hasKeywords = keywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (hasKeywords && wordCount > 10) {
      suggestions.push({
        type: 'connection',
        text: 'Esta idea podría conectar con otros proyectos similares',
        action: 'connection'
      });
    }

    return suggestions.slice(0, 2); // Máximo 2 sugerencias
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.action) {
      case 'question':
        onSuggestion && onSuggestion(suggestion.text);
        break;
      case 'structure':
        onStructureSuggestion && onStructureSuggestion(suggestion.text);
        break;
      case 'connection':
        onConnectionSuggestion && onConnectionSuggestion(suggestion.text);
        break;
    }
    setShowSuggestions(false);
  };

  const dismissSuggestions = () => {
    setShowSuggestions(false);
    setSuggestions([]);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 z-40 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiSun className="text-blue-600" size={16} />
                </div>
                <span className="font-medium text-gray-900">Sugerencias</span>
              </div>
              <button
                onClick={dismissSuggestions}
                className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Loading state */}
            {isThinking ? (
              <div className="flex items-center gap-2 text-gray-500 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm">Analizando tu idea...</span>
              </div>
            ) : (
              /* Suggestions */
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {suggestion.type === 'question' && <FiMessageSquare className="text-blue-600" size={12} />}
                        {suggestion.type === 'structure' && <FiArrowRight className="text-blue-600" size={12} />}
                        {suggestion.type === 'connection' && <FiArrowRight className="text-blue-600" size={12} />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-600 transition-colors">
                          {suggestion.type === 'question' && 'Explorar esta pregunta'}
                          {suggestion.type === 'structure' && 'Ver estructura sugerida'}
                          {suggestion.type === 'connection' && 'Buscar conexiones'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Estoy aquí para ayudarte, no para interrumpir
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextModeAI;
