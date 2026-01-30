import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMessageCircle, FiX, FiStar, FiCpu, FiHeart, FiImage } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import ImageIdeaGenerator from './ImageIdeaGenerator';

export const AIAssistant = ({ 
  userContext, 
  onSuggestion, 
  onQuestionGenerate,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('idle'); // 'idle', 'observing', 'suggesting', 'chat'
  const [suggestions, setSuggestions] = useState([]);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [blockageDetected, setBlockageDetected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Detección de bloqueos creativos
  useEffect(() => {
    detectCreativeBlock();
  }, [userContext]);

  const handleImageIdeasGenerated = (result) => {
    setShowImageGenerator(false);
    
    // Convertir las ideas generadas a formato de sugerencias
    const imageSuggestions = result.allIdeas.map(idea => ({
      type: 'image_generated',
      text: idea.title,
      description: idea.description,
      icon: <FiImage className="text-blue-400" />,
      action: 'create_idea',
      metadata: {
        category: idea.category,
        actionItems: idea.actionItems,
        analysis: result.analysis
      }
    }));
    
    setSuggestions(imageSuggestions);
    setMode('suggesting');
    
    // Notificar al componente padre
    if (onSuggestion) {
      onSuggestion({
        type: 'image_ideas',
        ideas: result.allIdeas,
        analysis: result.analysis
      });
    }
  };

  const detectCreativeBlock = useCallback(() => {
    const { 
      recentIdeas, 
      timeSinceLastIdea, 
      repeatedPatterns, 
      userActivity 
    } = userContext || {};

    let blockageScore = 0;
    let blockageReasons = [];

    // Pausa larga (> 10 minutos)
    if (timeSinceLastIdea > 600000) {
      blockageScore += 30;
      blockageReasons.push('long_pause');
    }

    // Patrones repetitivos
    if (repeatedPatterns?.length > 3) {
      blockageScore += 25;
      blockageReasons.push('repetition');
    }

    // Baja actividad (< 2 ideas en última hora)
    if (userActivity?.ideasLastHour < 2) {
      blockageScore += 20;
      blockageReasons.push('low_activity');
    }

    // Intentos fallidos de conexión
    if (userActivity?.failedConnections > 2) {
      blockageScore += 15;
      blockageReasons.push('connection_frustration');
    }

    const isBlocked = blockageScore > 40;
    setBlockageDetected(isBlocked);

    if (isBlocked) {
      generateContextualSuggestions(blockageReasons);
    }
  }, [userContext]);

  const generateContextualSuggestions = useCallback(async (reasons) => {
    const contextualSuggestions = [];
    
    // Calcular blockageScore para usar en las sugerencias
    const { blockageScore = 0 } = detectCreativeBlock();

    if (reasons.includes('long_pause')) {
      contextualSuggestions.push({
        type: 'gentle',
        text: "A veces las mejores ideas vienen cuando descansamos un momento. ¿Quieres que te haga una pregunta suave?",
        icon: <FiHeart className="text-pink-400" />,
        action: 'gentle_question'
      });
    }

    if (reasons.includes('repetition')) {
      contextualSuggestions.push({
        type: 'creative',
        text: "He notado que exploras temas similares. ¿Qué tal si miramos esto desde otra perspectiva completamente diferente?",
        icon: <FiStar className="text-yellow-400" />,
        action: 'perspective_shift'
      });
    }

    if (reasons.includes('low_activity')) {
      contextualSuggestions.push({
        type: 'inspiring',
        text: "¿Qué pasaría si tuvieras superpoderes creativos por 5 minutos? ¿Qué crearías?",
        icon: <FiSun className="text-blue-400" />,
        action: 'creative_prompt'
      });
    }

    if (reasons.includes('connection_frustration')) {
      contextualSuggestions.push({
        type: 'connecting',
        text: "Esta idea me recuerda a algo que exploraste la semana pasada. ¿Quieres que te muestre la conexión?",
        icon: <FiCpu className="text-purple-400" />,
        action: 'show_connections'
      });
    }

    // Añadir opción de subir imagen para bloqueos severos
    if (blockageScore >= 3) {
      contextualSuggestions.push({
        type: 'image_analysis',
        text: "¿Tienes una imagen de tu proyecto? Puedo analizarla y generar ideas creativas nuevas para ti.",
        icon: <FiImage className="text-blue-400" />,
        action: 'upload_image'
      });
    }

    setSuggestions(contextualSuggestions);
    setMode('suggesting');
  }, [userContext, detectCreativeBlock]);

  const handleSuggestionClick = async (suggestion) => {
    switch (suggestion.action) {
      case 'gentle_question':
        const questions = await onQuestionGenerate('gentle');
        setChatMessages([
          { type: 'ai', content: suggestion.text },
          { type: 'ai', content: "Aquí tienes algunas preguntas suaves:" },
          ...questions.map(q => ({ type: 'question', content: q }))
        ]);
        setMode('chat');
        break;

      case 'upload_image':
        setShowImageGenerator(true);
        break;

      case 'create_idea':
        // Crear idea a partir de la sugerencia de imagen
        if (onSuggestion) {
          onSuggestion({
            type: 'create_from_image',
            idea: suggestion.text,
            metadata: suggestion.metadata
          });
        }
        break;

      case 'perspective_shift':
        setChatMessages([
          { type: 'ai', content: suggestion.text },
          { type: 'ai', content: "¿Qué te parece esta sugerencia?" }
        ]);
        setMode('chat');
        break;

      case 'creative_prompt':
        setChatMessages([
          { type: 'ai', content: suggestion.text }
        ]);
        setMode('chat');
        break;

        
      case 'show_connections':
        onSuggestion({ type: 'connections', data: suggestion });
        break;
        
      default:
        onSuggestion(suggestion);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }, 1000);
  };

  const generateAIResponse = (userMessage) => {
    const responses = [
      "Esa es una perspectiva interesante. ¿Qué más te inspira sobre eso?",
      "Me gusta cómo piensas. ¿Has considerado explorar esto desde otro ángulo?",
      "Tu creatividad florece. ¿Qué pasarías si quitaras todos los límites?",
      "Siento tu entusiasmo. ¿Cómo podríamos hacer esto aún más interesante?",
      "Esa idea tiene potencial. ¿Qué emociones te despierta?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getAssistantMood = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return { emoji: '🌅', message: 'Buenos días. ¿Qué quieres explorar hoy?', color: 'from-yellow-400 to-orange-500' };
    } else if (hour >= 12 && hour < 18) {
      return { emoji: '☀️', message: 'Buenas tardes. Sigue fluyendo con tu creatividad.', color: 'from-blue-400 to-indigo-500' };
    } else if (hour >= 18 && hour < 22) {
      return { emoji: '🌆', message: 'Buenas tardes. La tarde es perfecta para crear.', color: 'from-purple-400 to-pink-500' };
    } else {
      return { emoji: '🌙', message: 'Buenas noches. Las mejores ideas a veces llegan en la quietud.', color: 'from-indigo-400 to-purple-600' };
    }
  };

  const mood = getAssistantMood();

  return (
    <div className={`fixed bottom-8 left-8 z-40 ${className}`}>
      {/* Botón Flotante del Asistente */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center text-white
          transition-all duration-300 relative
          ${blockageDetected 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse' 
            : `bg-gradient-to-r ${mood.color}`
          }
        `}
      >
        <FiMessageCircle size={24} />
        {blockageDetected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
        )}
      </motion.button>

      {/* Panel del Asistente */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 left-0 w-80 max-h-[500px] overflow-hidden"
          >
            <Card className="bg-gray-800 border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mood.emoji}</span>
                    <h3 className="text-lg font-semibold text-white">Asistente Creativo</h3>
                  </div>
                  <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
                    <FiX size={16} />
                  </Button>
                </div>
                <p className="text-sm text-gray-300">{mood.message}</p>
              </div>

              {/* Contenido */}
              <div className="p-4 max-h-[350px] overflow-y-auto">
                {mode === 'suggesting' && suggestions.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 mb-3">
                      {blockageDetected ? 'He notado que podrías estar bloqueado. Aquí algunas ideas:' : 'Algunas sugerencias:'}
                    </p>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{suggestion.icon}</div>
                          <div>
                            <p className="text-white text-sm">{suggestion.text}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {mode === 'chat' && (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`
                              max-w-[80%] p-3 rounded-lg text-sm
                              ${message.type === 'user' 
                                ? 'bg-purple-600 text-white' 
                                : message.type === 'question'
                                ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                                : 'bg-gray-700 text-gray-200'
                              }
                            `}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        Enviar
                      </Button>
                    </div>
                  </div>
                )}

                {mode === 'idle' && (
                  <div className="text-center py-8">
                    <FiCpu size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 text-sm mb-4">
                      Estoy aquí para ayudarte en tu proceso creativo
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => setMode('chat')} 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                      >
                        <FiMessageCircle /> Chatear
                      </Button>
                      <Button 
                        onClick={() => onQuestionGenerate('general')} 
                        variant="creative" 
                        size="sm" 
                        className="w-full"
                      >
                        <FiSun /> Generar Preguntas
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    
    {/* Image Generator Modal */}
    {showImageGenerator && (
      <ImageIdeaGenerator
        onIdeasGenerated={handleImageIdeasGenerated}
        onClose={() => setShowImageGenerator(false)}
      />
    )}
  </div>
);
};

export default AIAssistant;
