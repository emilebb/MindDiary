import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiZap, FiGrid, FiTarget, FiX, FiLoader } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const AIMindMapGenerator = ({ 
  onGenerateMindMap, 
  onClose, 
  className = '' 
}) => {
  const [centralIdea, setCentralIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState('balanced'); // 'creative', 'structured', 'balanced'
  const [depth, setDepth] = useState(3); // 2-4 niveles de profundidad

  const generationModes = {
    creative: {
      name: 'Creativo',
      icon: <FiZap />,
      description: 'Explora conexiones inesperadas y ideas divergentes',
      color: 'from-purple-500 to-pink-600'
    },
    structured: {
      name: 'Estructurado',
      icon: <FiTarget />,
      description: 'Organización lógica con categorías claras',
      color: 'from-blue-500 to-cyan-600'
    },
    balanced: {
      name: 'Balanceado',
      icon: <FiGrid />,
      description: 'Mezcla de creatividad y estructura',
      color: 'from-green-500 to-emerald-600'
    }
  };

  const handleGenerate = async () => {
    if (!centralIdea.trim()) return;

    setIsGenerating(true);
    
    try {
      const mindMapData = await onGenerateMindMap({
        centralIdea: centralIdea.trim(),
        mode: generationMode,
        depth: depth
      });
      
      // Si se generó exitosamente, cerrar el modal
      if (mindMapData) {
        onClose();
      }
    } catch (error) {
      console.error('Error generating mind map:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
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
        className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <FiCpu className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generador de Mapa Mental IA</h2>
              <p className="text-sm text-gray-400">Transforma tu idea en un mapa mental completo</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <FiX size={20} />
          </Button>
        </div>

        {/* Input Principal */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Idea Central
          </label>
          <textarea
            value={centralIdea}
            onChange={(e) => setCentralIdea(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe tu idea principal. Ej: 'Aplicación para organizar tareas creativas'..."
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
            rows={3}
          />
        </div>

        {/* Modos de Generación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Modo de Generación
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(generationModes).map(([mode, config]) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGenerationMode(mode)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${generationMode === mode
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center`}>
                    <div className="text-white text-sm">
                      {config.icon}
                    </div>
                  </div>
                  <span className="font-medium text-white">{config.name}</span>
                </div>
                <p className="text-xs text-gray-400">{config.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Profundidad */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Profundidad del Mapa: {depth} niveles
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="4"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex gap-2">
              {[2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => setDepth(level)}
                  className={`
                    px-3 py-1 rounded-lg text-sm transition-colors
                    ${depth === level
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {depth === 2 && 'Simple: Idea principal + ramas directas'}
            {depth === 3 && 'Balanceado: Idea + categorías + subcategorías'}
            {depth === 4 && 'Detallado: Hasta 4 niveles de profundidad'}
          </p>
        </div>

        {/* Ejemplos */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Ejemplos de ideas:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Negocio de café sostenible',
              'App de meditación guiada',
              'Sistema de aprendizaje gamificado',
              'Plataforma de arte colaborativo'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setCentralIdea(example)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-xs transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerate}
            className="flex-1"
            disabled={!centralIdea.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Generando Mapa Mental...
              </>
            ) : (
              <>
                <FiGrid className="mr-2" />
                Generar Mapa Mental
              </>
            )}
          </Button>
        </div>

        {/* Información Adicional */}
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            💡 La IA analizará tu idea y creará un mapa mental con nodos interconectados, 
            etiquetas contextuales y una estructura lógica basada en el modo seleccionado.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIMindMapGenerator;
