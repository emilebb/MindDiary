import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiFileText, FiTag, FiMap, FiX, FiCheck } from 'react-icons/fi';

const VoiceModeAI = ({ 
  audioBlob, 
  transcript, 
  isActive, 
  onTranscriptionComplete,
  onTitleSuggestion,
  onSubideaSuggestion,
  onMindMapSuggestion 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectedEmotions, setDetectedEmotions] = useState([]);
  const [keyIdeas, setKeyIdeas] = useState([]);

  useEffect(() => {
    if (transcript && transcript.trim() && isActive) {
      processTranscript(transcript);
    }
  }, [transcript, isActive]);

  const processTranscript = async (text) => {
    setIsProcessing(true);
    
    try {
      // Simulación de procesamiento de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = analyzeVoiceContent(text);
      setKeyIdeas(analysis.keyIdeas);
      setDetectedEmotions(analysis.emotions);
      setSuggestions(analysis.suggestions);
      setShowSuggestions(true);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(analysis);
      }
    } catch (error) {
      console.error('Voice processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeVoiceContent = (text) => {
    const keyIdeas = extractKeyIdeas(text);
    const emotions = detectEmotions(text);
    const suggestions = generateVoiceSuggestions(text, keyIdeas, emotions);
    
    return {
      keyIdeas,
      emotions,
      suggestions
    };
  };

  const extractKeyIdeas = (text) => {
    const ideas = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Extraer ideas principales
    sentences.forEach(sentence => {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length > 20) {
        ideas.push({
          text: cleanSentence,
          importance: calculateImportance(cleanSentence)
        });
      }
    });
    
    return ideas
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3);
  };

  const calculateImportance = (sentence) => {
    // Palabras clave que aumentan importancia
    const importantWords = ['importante', 'clave', 'principal', 'idea', 'necesito', 'debería', 'podría'];
    const words = sentence.toLowerCase().split(' ');
    
    let score = words.length; // Longitud base
    importantWords.forEach(word => {
      if (words.includes(word)) score += 10;
    });
    
    // Preguntas tienen alta importancia
    if (sentence.includes('?') || sentence.includes('¿')) score += 15;
    
    return score;
  };

  const detectEmotions = (text) => {
    const emotions = [];
    const emotionKeywords = {
      'entusiasmo': ['excitado', 'genial', 'increíble', 'fantástico', 'amor'],
      'preocupación': ['preocupado', 'nervioso', 'ansioso', 'estrés', 'problema'],
      'curiosidad': ['interesado', 'curioso', 'pregunta', 'cómo', 'por qué'],
      'determinación': ['decidido', 'comprometido', 'voy a', 'debo', 'objetivo']
    };
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
      ).length;
      
      if (matches > 0) {
        emotions.push({
          emotion,
          intensity: Math.min(matches * 20, 100)
        });
      }
    });
    
    return emotions;
  };

  const generateVoiceSuggestions = (text, ideas, emotions) => {
    const suggestions = [];
    
    // Sugerir título basado en ideas clave
    if (ideas.length > 0) {
      const mainIdea = ideas[0].text;
      const title = mainIdea.length > 50 
        ? mainIdea.substring(0, 47) + '...'
        : mainIdea;
      
      suggestions.push({
        type: 'title',
        text: `Título sugerido: "${title}"`,
        action: 'title',
        data: title
      });
    }
    
    // Sugerir subideas
    if (ideas.length > 1) {
      suggestions.push({
        type: 'subideas',
        text: `Detecté ${ideas.length} ideas principales que podrías expandir`,
        action: 'subideas',
        data: ideas
      });
    }
    
    // Sugerir mapa mental si hay múltiples ideas
    if (ideas.length >= 2 || emotions.length > 0) {
      suggestions.push({
        type: 'mindmap',
        text: 'Esta conversación sería perfecta para un mapa mental',
        action: 'mindmap'
      });
    }
    
    return suggestions;
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.action) {
      case 'title':
        onTitleSuggestion && onTitleSuggestion(suggestion.data);
        break;
      case 'subideas':
        onSubideaSuggestion && onSubideaSuggestion(suggestion.data);
        break;
      case 'mindmap':
        onMindMapSuggestion && onMindMapSuggestion();
        break;
    }
    setShowSuggestions(false);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {(isProcessing || showSuggestions) && (
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
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiMic className="text-green-600" size={16} />
                </div>
                <span className="font-medium text-gray-900">Análisis de Voz</span>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Processing state */}
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm">Procesando tu voz...</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiFileText size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Transcribiendo audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTag size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Detectando ideas clave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMap size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Analizando emociones</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Results and suggestions */
              <div className="space-y-3">
                {/* Key ideas detected */}
                {keyIdeas.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-green-900 mb-2 text-sm">Ideas clave detectadas:</h4>
                    <ul className="space-y-1">
                      {keyIdeas.map((idea, index) => (
                        <li key={index} className="text-xs text-green-700 flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                          {idea.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emotions detected */}
                {detectedEmotions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detectedEmotions.map((emotion, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {emotion.emotion} ({emotion.intensity}%)
                      </span>
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
                          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            {suggestion.type === 'title' && <FiFileText className="text-green-600" size={12} />}
                            {suggestion.type === 'subideas' && <FiTag className="text-green-600" size={12} />}
                            {suggestion.type === 'mindmap' && <FiMap className="text-green-600" size={12} />}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {suggestion.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-green-600 transition-colors">
                              {suggestion.type === 'title' && 'Usar este título'}
                              {suggestion.type === 'subideas' && 'Expandir en subideas'}
                              {suggestion.type === 'mindmap' && 'Crear mapa mental'}
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
                Respetando tu voz natural y tus muletillas
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModeAI;
