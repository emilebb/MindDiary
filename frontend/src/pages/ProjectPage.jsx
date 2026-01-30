import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAIStore } from '../utils/aiStore';
import { motion } from 'framer-motion';
import { FiPlus, FiRefreshCw, FiArrowLeft, FiGrid, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Importar nuevos componentes
import { Button } from '../components/ui/Button';
import CaptureButton from '../components/capture/CaptureButton';
import AIAssistant from '../components/ai/AIAssistant';
import FlowMode from '../components/flow/FlowMode';
import MindMapContainerNew from '../components/mindmap/MindMapContainerNew';
import { useTheme } from '../contexts/ThemeContext';

export const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, ideas, getProjectById, fetchIdeas, captureIdea, updateIdea } = useProjectStore();
  const { generateQuestions, expandIdea, generateExercise } = useAIStore();
  const { getBackgroundClass } = useTheme();
  
  const [newIdeaContent, setNewIdeaContent] = React.useState('');
  const [showAIPanel, setShowAIPanel] = React.useState(false);
  const [selectedIdea, setSelectedIdea] = React.useState(null);
  const [aiSuggestions, setAISuggestions] = React.useState(null);
  
  // Nuevos estados
  const [viewMode, setViewMode] = React.useState('ideas'); // 'ideas' | 'mindmap' | 'flow'
  const [flowModeActive, setFlowModeActive] = React.useState(false);

  React.useEffect(() => {
    getProjectById(id);
    fetchIdeas(id);
  }, [id]);

  const handleCaptureIdea = async (e) => {
    e.preventDefault();
    if (newIdeaContent.trim()) {
      try {
        await captureIdea({
          projectId: id,
          content: newIdeaContent,
          type: 'text'
        });
        setNewIdeaContent('');
      } catch (err) {
        console.error('Failed to capture idea:', err);
      }
    }
  };

  const handleAIUnblock = async (idea) => {
    setSelectedIdea(idea);
    setShowAIPanel(true);
    try {
      const questions = await generateQuestions(idea.content);
      setAISuggestions(questions);
    } catch (err) {
      console.error('Failed to generate AI suggestions:', err);
    }
  };

  const handleQuestionClick = async (question) => {
    console.log('Question clicked:', question);
    console.log('Selected idea:', selectedIdea);
    
    if (!selectedIdea) {
      console.error('No selected idea');
      return;
    }
    
    try {
      console.log('Expanding idea...');
      const expansion = await expandIdea(selectedIdea.content, question);
      console.log('Expansion result:', expansion);
      
      // Crear nuevas ideas a partir de la expansión
      if (expansion.subIdeas && expansion.subIdeas.length > 0) {
        for (const [index, subIdea] of expansion.subIdeas.entries()) {
          // Generar etiquetas contextuales basadas en la pregunta y contenido
          const contextualTags = ['AI-generado'];
          
          if (question) {
            if (question.toLowerCase().includes('cómo')) {
              contextualTags.push('proceso');
            } else if (question.toLowerCase().includes('por qué')) {
              contextualTags.push('propósito');
            } else if (question.toLowerCase().includes('qué pasaría si')) {
              contextualTags.push('hipótesis');
            } else if (question.toLowerCase().includes('mejorar')) {
              contextualTags.push('mejora');
            } else if (question.toLowerCase().includes('alternativa')) {
              contextualTags.push('opción');
            }
          }
          
          // Añadir etiquetas basadas en el contenido
          if (subIdea.toLowerCase().includes('diseño')) contextualTags.push('diseño');
          if (subIdea.toLowerCase().includes('desarrollo')) contextualTags.push('desarrollo');
          if (subIdea.toLowerCase().includes('investigación')) contextualTags.push('investigación');
          if (subIdea.toLowerCase().includes('plan')) contextualTags.push('planificación');
          
          await captureIdea({
            projectId: id,
            content: subIdea,
            type: 'text',
            tags: contextualTags,
            color: '#9333EA'
          });
        }
      }
      setShowAIPanel(false);
      setAISuggestions(null);
      setSelectedIdea(null);
    } catch (err) {
      console.error('Failed to expand idea:', err);
    }
  };

  // Manejadores para nuevos modos
  const handleCapture = (type) => {
    console.log('Capturing idea of type:', type);
    // Aquí se abriría el modal de captura
  };

  const handleFlowModeExit = (sessionData) => {
    setFlowModeActive(false);
    console.log('Flow session ended:', sessionData);
  };

  const handleMindMapSave = (mindMapData) => {
    console.log('Mind map saved:', mindMapData);
  };

  const handleViewModeChange = (mode) => {
    if (mode === 'flow') {
      setFlowModeActive(true);
    } else {
      setViewMode(mode);
      setFlowModeActive(false);
    }
  };

  // Si el modo flow está activo, mostrar el componente FlowMode
  if (flowModeActive) {
    return (
      <FlowMode
        isActive={flowModeActive}
        onExit={handleFlowModeExit}
      />
    );
  }

  // Si el modo mindmap está activo, mostrar el MindMapContainer
  if (viewMode === 'mindmap') {
    // Convertir ideas a nodos iniciales
    const initialNodes = ideas.map((idea, index) => ({
      id: `idea_${idea._id}`,
      content: idea.content,
      position: {
        x: 400 + (index % 3 - 1) * 150,
        y: 300 + Math.floor(index / 3) * 100
      },
      type: index === 0 ? 'central' : index < 4 ? 'primary' : 'secondary',
      tags: idea.tags || [],
      media: idea.media || null,
      color: idea.color || '#6366F1',
      ideaId: idea._id,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt
    }));

    return (
      <div className="h-screen">
        <MindMapContainerNew
          projectId={id}
          initialNodes={initialNodes}
          onSave={handleMindMapSave}
        />
        <Button
          onClick={() => setViewMode('ideas')}
          className="absolute top-4 left-4 z-10"
          variant="secondary"
        >
          ← Volver a Ideas
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white transition"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentProject?.emoji} {currentProject?.name}
              </h1>
              <p className="text-sm text-gray-400">{ideas.length} ideas</p>
            </div>
          </div>
          
          {/* Botones de modo de visualización */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleViewModeChange('ideas')}
              variant={viewMode === 'ideas' ? 'primary' : 'ghost'}
              size="sm"
            >
              <FiList /> Ideas
            </Button>
            <Button
              onClick={() => handleViewModeChange('mindmap')}
              variant={viewMode === 'mindmap' ? 'primary' : 'ghost'}
              size="sm"
            >
              <FiGrid /> Mapa Mental
            </Button>
            <Button
              onClick={() => handleViewModeChange('flow')}
              variant={flowModeActive ? 'primary' : 'ghost'}
              size="sm"
            >
              Modo Flow
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Capture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <form onSubmit={handleCaptureIdea} className="bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Captura una idea
            </label>
            <textarea
              value={newIdeaContent}
              onChange={(e) => setNewIdeaContent(e.target.value)}
              placeholder="Escribe tu idea aquí... sin filtro, sin presión"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows="4"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
            >
              <FiPlus size={18} /> Guardar Idea
            </button>
          </form>
        </motion.div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, idx) => (
            <motion.div
              key={idea._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition group"
            >
              <div className="mb-4">
                {idea.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-white mb-4 line-clamp-3">{idea.content}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{new Date(idea.createdAt).toLocaleDateString('es-ES')}</span>
                <button
                  onClick={() => handleAIUnblock(idea)}
                  className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                >
                  <FiRefreshCw size={14} /> Expandir
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {ideas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              Sin ideas aún. ¡Comienza a capturar tus pensamientos!
            </p>
          </motion.div>
        )}
      </main>

      {/* AI Panel */}
      {showAIPanel && (
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-6 rounded-t-lg shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                ✨ Asistente Creativo
              </h3>
              <button
                onClick={() => setShowAIPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {aiSuggestions && (
              <div className="space-y-3">
                <p className="text-gray-300 mb-4">
                  Aquí están algunas preguntas para explorar tu idea:
                </p>
                {aiSuggestions.questions?.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(q)}
                    className="w-full bg-gray-700 hover:bg-purple-600 p-3 rounded text-gray-200 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-gray-600 hover:border-purple-500"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-purple-400">💡</span>
                      {q}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Componentes flotantes */}
      <CaptureButton onCapture={handleCapture} />
      <AIAssistant
        userContext={{
          recentIdeas: ideas.slice(-5),
          timeSinceLastIdea: Date.now() - 300000,
          repeatedPatterns: [],
          userActivity: { ideasLastHour: ideas.length, failedConnections: 0 }
        }}
        onSuggestion={(suggestion) => console.log('AI Suggestion:', suggestion)}
        onQuestionGenerate={(type) => Promise.resolve(['Pregunta 1', 'Pregunta 2', 'Pregunta 3'])}
      />
    </div>
  );
};

export default ProjectPage;
