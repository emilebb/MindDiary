import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiMessageSquare, FiMap, FiTag, FiX, FiEye } from 'react-icons/fi';

const DrawingModeAI = ({ 
  imageData, 
  isActive, 
  onInterpretation,
  onStructureSuggestion,
  onMindMapSuggestion 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interpretations, setInterpretations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectedElements, setDetectedElements] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (imageData && isActive) {
      analyzeDrawing(imageData);
    }
  }, [imageData, isActive]);

  const analyzeDrawing = async (imageData) => {
    setIsAnalyzing(true);
    
    try {
      // Simulación de análisis de dibujo
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const analysis = analyzeDrawingContent(imageData);
      setDetectedElements(analysis.elements);
      setInterpretations(analysis.interpretations);
      setSuggestions(analysis.suggestions);
      setShowSuggestions(true);
      
      if (onInterpretation) {
        onInterpretation(analysis);
      }
    } catch (error) {
      console.error('Drawing analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeDrawingContent = (imageData) => {
    // Simulación de detección de elementos visuales
    const elements = detectVisualElements();
    const interpretations = generateInterpretations(elements);
    const suggestions = generateDrawingSuggestions(elements, interpretations);
    
    return {
      elements,
      interpretations,
      suggestions
    };
  };

  const detectVisualElements = () => {
    // Simulación de detección de patrones y formas
    const elements = [];
    
    // Detectar tipos de trazos (simulado)
    const strokeTypes = [
      { type: 'curvas', confidence: 75, description: 'Líneas suaves y orgánicas' },
      { type: 'ángulos', confidence: 60, description: 'Formas geométricas definidas' },
      { type: 'puntos', confidence: 45, description: 'Énfasis en detalles específicos' }
    ];
    
    // Detectar patrones (simulado)
    const patterns = [
      { type: 'flujo', confidence: 80, description: 'Movimiento o dirección' },
      { type: 'conexión', confidence: 65, description: 'Elementos relacionados entre sí' },
      { type: 'jerarquía', confidence: 50, description: 'Estructura de niveles o importancia' }
    ];
    
    // Combinar elementos con alta confianza
    strokeTypes.forEach(stroke => {
      if (stroke.confidence > 50) {
        elements.push({
          category: 'trazo',
          ...stroke
        });
      }
    });
    
    patterns.forEach(pattern => {
      if (pattern.confidence > 50) {
        elements.push({
          category: 'patrón',
          ...pattern
        });
      }
    });
    
    return elements;
  };

  const generateInterpretations = (elements) => {
    const interpretations = [];
    
    // Interpretaciones basadas en elementos detectados
    const hasFlow = elements.some(e => e.type === 'flujo');
    const hasConnections = elements.some(e => e.type === 'conexión');
    const hasCurves = elements.some(e => e.type === 'curvas');
    const hasAngles = elements.some(e => e.type === 'ángulos');
    
    if (hasFlow && hasConnections) {
      interpretations.push({
        type: 'proceso',
        text: 'Parece representar un proceso o flujo de trabajo',
        confidence: 75,
        questions: ['¿Este es un proceso secuencial?', '¿Hay pasos que se pueden optimizar?']
      });
    }
    
    if (hasCurves && !hasAngles) {
      interpretations.push({
        type: 'emoción',
        text: 'Las formas suaves sugieren una idea emocional o abstracta',
        confidence: 65,
        questions: ['¿Qué emoción representa este dibujo?', '¿Es un concepto o un sentimiento?']
      });
    }
    
    if (hasAngles && hasConnections) {
      interpretations.push({
        type: 'estructura',
        text: 'Las formas geométricas conectadas sugieren un sistema o estructura',
        confidence: 70,
        questions: ['¿Es un sistema organizado?', '¿Cómo se relacionan estos elementos?']
      });
    }
    
    // Interpretación general si no hay elementos claros
    if (interpretations.length === 0) {
      interpretations.push({
        type: 'exploratorio',
        text: 'Este dibujo parece exploratorio, como un brainstorming visual',
        confidence: 60,
        questions: ['¿Qué idea estabas explorando?', '¿Hay un tema central?']
      });
    }
    
    return interpretations;
  };

  const generateDrawingSuggestions = (elements, interpretations) => {
    const suggestions = [];
    
    // Sugerir estructura basada en interpretaciones
    if (interpretations.length > 0) {
      const mainInterpretation = interpretations[0];
      
      suggestions.push({
        type: 'interpretation',
        text: `Interpretación: ${mainInterpretation.text}`,
        action: 'interpretation',
        data: mainInterpretation
      });
      
      // Preguntas para profundizar
      if (mainInterpretation.questions && mainInterpretation.questions.length > 0) {
        suggestions.push({
          type: 'question',
          text: mainInterpretation.questions[0],
          action: 'question',
          data: mainInterpretation.questions[0]
        });
      }
    }
    
    // Sugerir conversión a mapa mental
    const hasConnections = elements.some(e => e.type === 'conexión' || e.type === 'flujo');
    if (hasConnections) {
      suggestions.push({
        type: 'mindmap',
        text: 'Este dibujo sería perfecto como un mapa mental interactivo',
        action: 'mindmap'
      });
    }
    
    // Sugerir etiquetas
    suggestions.push({
      type: 'tags',
      text: 'Podemos añadir etiquetas para describir cada elemento',
      action: 'tags'
    });
    
    return suggestions.slice(0, 3); // Máximo 3 sugerencias
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.action) {
      case 'interpretation':
        onInterpretation && onInterpretation(suggestion.data);
        break;
      case 'question':
        // Mostrar pregunta para que el usuario responda
        break;
      case 'mindmap':
        onMindMapSuggestion && onMindMapSuggestion();
        break;
      case 'tags':
        onStructureSuggestion && onStructureSuggestion('Añadir etiquetas descriptivas');
        break;
    }
    setShowSuggestions(false);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {(isAnalyzing || showSuggestions) && (
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
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiEdit3 className="text-purple-600" size={16} />
                </div>
                <span className="font-medium text-gray-900">Análisis Visual</span>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Analyzing state */}
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm">Analizando tu dibujo...</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiEye size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Detectando formas y patrones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Interpretando el significado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMap size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Buscando estructuras</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Results and suggestions */
              <div className="space-y-3">
                {/* Detected elements */}
                {detectedElements.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <h4 className="font-medium text-purple-900 mb-2 text-sm">Elementos detectados:</h4>
                    <div className="space-y-1">
                      {detectedElements.map((element, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-xs text-purple-700">
                            {element.description}
                          </span>
                          <span className="text-xs text-purple-500">
                            {element.confidence}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interpretations */}
                {interpretations.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">Posibles interpretaciones:</h4>
                    {interpretations.map((interpretation, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <p className="text-xs text-blue-700 mb-1">
                          {interpretation.text}
                        </p>
                        <p className="text-xs text-blue-500">
                          Confianza: {interpretation.confidence}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Sugerencias:</p>
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
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            {suggestion.type === 'interpretation' && <FiMessageSquare className="text-purple-600" size={12} />}
                            {suggestion.type === 'question' && <FiMessageSquare className="text-purple-600" size={12} />}
                            {suggestion.type === 'mindmap' && <FiMap className="text-purple-600" size={12} />}
                            {suggestion.type === 'tags' && <FiTag className="text-purple-600" size={12} />}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {suggestion.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-purple-600 transition-colors">
                              {suggestion.type === 'interpretation' && 'Explorar esta interpretación'}
                              {suggestion.type === 'question' && 'Reflexionar sobre esto'}
                              {suggestion.type === 'mindmap' && 'Convertir en mapa mental'}
                              {suggestion.type === 'tags' && 'Añadir etiquetas'}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Tu dibujo es único, estas son solo interpretaciones posibles
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawingModeAI;
