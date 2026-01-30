import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiTag, FiMap, FiLink, FiX, FiImage } from 'react-icons/fi';

const ImageModeAI = ({ 
  imageData, 
  caption, 
  isActive, 
  onKeywordsSuggestion,
  onCategorizationSuggestion,
  onConnectionSuggestion 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectedElements, setDetectedElements] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [inspirationLevel, setInspirationLevel] = useState(0);

  useEffect(() => {
    if (imageData && isActive) {
      analyzeImage(imageData, caption);
    }
  }, [imageData, caption, isActive]);

  const analyzeImage = async (imageData, userCaption) => {
    setIsAnalyzing(true);
    
    try {
      // Simulación de análisis de imagen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = analyzeImageContent(imageData, userCaption);
      setDetectedElements(analysis.elements);
      setKeywords(analysis.keywords);
      setInspirationLevel(analysis.inspirationLevel);
      setSuggestions(analysis.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImageContent = (imageData, userCaption) => {
    // Simulación de detección de elementos visuales
    const elements = detectImageElements();
    const keywords = extractKeywords(elements, userCaption);
    const inspirationLevel = calculateInspirationLevel(elements, keywords);
    const suggestions = generateImageSuggestions(elements, keywords, inspirationLevel);
    
    return {
      elements,
      keywords,
      inspirationLevel,
      suggestions
    };
  };

  const detectImageElements = () => {
    // Simulación de detección de elementos en la imagen
    const elements = [];
    
    // Tipos de elementos que podrían detectarse
    const possibleElements = [
      { type: 'texto', confidence: 70, description: 'Contiene texto o palabras' },
      { type: 'personas', confidence: 60, description: 'Figuras humanas o siluetas' },
      { type: 'naturaleza', confidence: 80, description: 'Elementos naturales' },
      { type: 'tecnología', confidence: 45, description: 'Dispositivos o interfaces' },
      { type: 'diagrama', confidence: 85, description: 'Estructura o esquema' },
      { type: 'color', confidence: 90, description: 'Colores vibrantes o significativos' },
      { type: 'símbolo', confidence: 65, description: 'Iconos o símbolos reconocibles' }
    ];
    
    // Simular detección basada en confianza
    possibleElements.forEach(element => {
      if (element.confidence > 50) {
        elements.push({
          ...element,
          relevance: Math.random() * 100 // Relevancia aleatoria para simulación
        });
      }
    });
    
    return elements.sort((a, b) => b.relevance - a.relevance).slice(0, 4);
  };

  const extractKeywords = (elements, userCaption) => {
    const keywords = [];
    
    // Extraer palabras clave de elementos detectados
    elements.forEach(element => {
      const elementKeywords = getElementKeywords(element.type);
      elementKeywords.forEach(keyword => {
        if (!keywords.find(k => k.word === keyword)) {
          keywords.push({
            word: keyword,
            source: 'image',
            confidence: element.confidence
          });
        }
      });
    });
    
    // Extraer palabras clave del caption del usuario
    if (userCaption) {
      const captionWords = userCaption.toLowerCase().split(/\s+/);
      captionWords.forEach(word => {
        if (word.length > 3 && !keywords.find(k => k.word === word)) {
          keywords.push({
            word: word,
            source: 'user',
            confidence: 90
          });
        }
      });
    }
    
    // Palabras clave contextuales basadas en combinaciones
    const contextualKeywords = generateContextualKeywords(elements);
    contextualKeywords.forEach(keyword => {
      if (!keywords.find(k => k.word === keyword.word)) {
        keywords.push(keyword);
      }
    });
    
    return keywords.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  };

  const getElementKeywords = (elementType) => {
    const keywordMap = {
      'texto': ['palabra', 'mensaje', 'comunicación', 'letra'],
      'personas': ['equipo', 'colaboración', 'humano', 'social'],
      'naturaleza': ['crecimiento', 'orgánico', 'natural', 'vida'],
      'tecnología': ['innovación', 'digital', 'futuro', 'herramienta'],
      'diagrama': ['estructura', 'proceso', 'sistema', 'organización'],
      'color': ['emoción', 'creatividad', 'arte', 'expresión'],
      'símbolo': ['significado', 'concepto', 'representación', 'idea']
    };
    
    return keywordMap[elementType] || [];
  };

  const generateContextualKeywords = (elements) => {
    const contextualKeywords = [];
    const elementTypes = elements.map(e => e.type);
    
    // Combinaciones de elementos que sugieren conceptos
    if (elementTypes.includes('tecnología') && elementTypes.includes('personas')) {
      contextualKeywords.push({ word: 'transformación digital', confidence: 75 });
    }
    
    if (elementTypes.includes('naturaleza') && elementTypes.includes('color')) {
      contextualKeywords.push({ word: 'inspiración natural', confidence: 80 });
    }
    
    if (elementTypes.includes('diagrama') && elementTypes.includes('texto')) {
      contextualKeywords.push({ word: 'visualización de datos', confidence: 70 });
    }
    
    if (elementTypes.includes('símbolo') && elementTypes.includes('color')) {
      contextualKeywords.push({ word: 'branding', confidence: 65 });
    }
    
    return contextualKeywords;
  };

  const calculateInspirationLevel = (elements, keywords) => {
    let score = 0;
    
    // Puntuación basada en diversidad de elementos
    score += elements.length * 10;
    
    // Puntuación basada en calidad de palabras clave
    const highConfidenceKeywords = keywords.filter(k => k.confidence > 70).length;
    score += highConfidenceKeywords * 15;
    
    // Bonus por combinaciones interesantes
    const hasMultipleTypes = new Set(elements.map(e => e.type)).size > 2;
    if (hasMultipleTypes) score += 25;
    
    return Math.min(score, 100);
  };

  const generateImageSuggestions = (elements, keywords, inspirationLevel) => {
    const suggestions = [];
    
    // Sugerir palabras clave
    if (keywords.length > 0) {
      const topKeywords = keywords.slice(0, 5).map(k => k.word).join(', ');
      suggestions.push({
        type: 'keywords',
        text: `Palabras clave sugeridas: ${topKeywords}`,
        action: 'keywords',
        data: keywords
      });
    }
    
    // Sugerir categorización
    if (elements.length > 0) {
      const categories = suggestCategories(elements);
      suggestions.push({
        type: 'categorization',
        text: `Podrías categorizar esto como: ${categories.join(' o ')}`,
        action: 'categorization',
        data: categories
      });
    }
    
    // Sugerir conexiones si hay alta inspiración
    if (inspirationLevel > 60) {
      suggestions.push({
        type: 'connection',
        text: 'Esta imagen podría inspirar ideas relacionadas con proyectos existentes',
        action: 'connection'
      });
    }
    
    // Sugerir acción basada en tipo principal
    const mainElement = elements[0];
    if (mainElement) {
      const actionSuggestion = suggestAction(mainElement.type);
      suggestions.push({
        type: 'action',
        text: actionSuggestion,
        action: 'action',
        data: mainElement
      });
    }
    
    return suggestions.slice(0, 3);
  };

  const suggestCategories = (elements) => {
    const categories = [];
    const elementTypes = elements.map(e => e.type);
    
    if (elementTypes.includes('tecnología')) categories.push('innovación');
    if (elementTypes.includes('naturaleza')) categories.push('sostenibilidad');
    if (elementTypes.includes('personas')) categories.push('social');
    if (elementTypes.includes('diagrama')) categories.push('proceso');
    if (elementTypes.includes('color')) categories.push('creatividad');
    
    return categories.length > 0 ? categories : ['general'];
  };

  const suggestAction = (elementType) => {
    const actionMap = {
      'texto': 'Podrías extraer y analizar el mensaje principal',
      'personas': 'Ideal para ideas sobre colaboración o equipos',
      'naturaleza': 'Perfecto para conceptos de crecimiento y evolución',
      'tecnología': 'Podría inspirar soluciones digitales',
      'diagrama': 'Útil para estructurar procesos o sistemas',
      'color': 'Excelente para explorar emociones y branding',
      'símbolo': 'Puedes profundizar en el significado simbólico'
    };
    
    return actionMap[elementType] || 'Explora qué te inspira esta imagen';
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.action) {
      case 'keywords':
        onKeywordsSuggestion && onKeywordsSuggestion(suggestion.data);
        break;
      case 'categorization':
        onCategorizationSuggestion && onCategorizationSuggestion(suggestion.data);
        break;
      case 'connection':
        onConnectionSuggestion && onConnectionSuggestion();
        break;
      case 'action':
        // Mostrar sugerencia de acción específica
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
                <div className="w-8 h-8 bg-pink-100 rounded-xl flex items-center justify-center">
                  <FiCamera className="text-pink-600" size={16} />
                </div>
                <span className="font-medium text-gray-900">Análisis de Imagen</span>
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
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm">Analizando imagen...</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiImage size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Detectando elementos visuales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTag size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Extrayendo palabras clave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiLink size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Buscando conexiones</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Results and suggestions */
              <div className="space-y-3">
                {/* Inspiration level */}
                <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">Nivel de inspiración</h4>
                    <span className="text-sm font-bold text-purple-600">{inspirationLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${inspirationLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detected elements */}
                {detectedElements.length > 0 && (
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <h4 className="font-medium text-pink-900 mb-2 text-sm">Elementos detectados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {detectedElements.map((element, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white text-pink-700 rounded-lg text-xs font-medium border border-pink-200"
                        >
                          {element.description}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {keywords.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <h4 className="font-medium text-purple-900 mb-2 text-sm">Palabras clave:</h4>
                    <div className="flex flex-wrap gap-1">
                      {keywords.slice(0, 6).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white text-purple-700 rounded text-xs"
                        >
                          {keyword.word}
                        </span>
                      ))}
                    </div>
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
                          <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            {suggestion.type === 'keywords' && <FiTag className="text-pink-600" size={12} />}
                            {suggestion.type === 'categorization' && <FiTag className="text-pink-600" size={12} />}
                            {suggestion.type === 'connection' && <FiLink className="text-pink-600" size={12} />}
                            {suggestion.type === 'action' && <FiImage className="text-pink-600" size={12} />}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {suggestion.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-pink-600 transition-colors">
                              {suggestion.type === 'keywords' && 'Usar estas palabras clave'}
                              {suggestion.type === 'categorization' && 'Aplicar categoría'}
                              {suggestion.type === 'connection' && 'Buscar conexiones'}
                              {suggestion.type === 'action' && 'Explorar esta acción'}
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
                Lo que ves puede inspirar grandes ideas
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModeAI;
