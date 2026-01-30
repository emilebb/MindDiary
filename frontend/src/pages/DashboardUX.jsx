import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAuthStore } from '../utils/authStore';
import { motion } from 'framer-motion';
import { FiPlus, FiLogOut, FiArrowRight, FiEdit3, FiGrid, FiSettings, FiHelpCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

// Importar componentes UI
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import CaptureButton from '../components/capture/CaptureButton';
import CaptureFAB from '../components/capture/CaptureFAB';
import CaptureManager from '../components/capture/CaptureManager';
import AIAssistant from '../components/ai/AIAssistant';
import FlowMode from '../components/flow/FlowMode';
import MindMapContainerNew from '../components/mindmap/MindMapContainerNew';
import { useTheme } from '../contexts/ThemeContext';

export const DashboardUX = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, createProject, loading } = useProjectStore();
  const { logout, user } = useAuthStore();
  const { getBackgroundClass } = useTheme();
  
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [flowModeActive, setFlowModeActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showMindMap, setShowMindMap] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.isActive).length;
    const totalIdeas = projects.reduce((sum, p) => sum + (p.ideaCount || 0), 0);
    const recentIdeas = projects.reduce((sum, p) => sum + (p.recentIdeas || 0), 0);
    
    return { totalProjects, activeProjects, totalIdeas, recentIdeas };
  };

  const stats = getProjectStats();
  const activeProject = projects.find(p => p.isActive) || projects[0];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      try {
        await createProject({
          name: newProjectName,
          description: '',
          color: '#6366F1',
          emoji: '🚀'
        });
        setNewProjectName('');
        setShowNewProject(false);
      } catch (err) {
        console.error('Failed to create project:', err);
      }
    }
  };

  const handleCapture = (type) => {
    // Usar el proyecto activo o el primer proyecto disponible
    const projectId = activeProject?._id || projects[0]?._id;
    if (projectId) {
      setActiveProjectId(projectId);
      console.log('Capturing idea of type:', type, 'for project:', projectId);
    } else {
      // Si no hay proyectos, mostrar modal para crear uno
      setShowNewProject(true);
    }
  };

  const handleIdeaCreated = (ideaData) => {
    console.log('New idea created:', ideaData);
    // Refrescar proyectos para mostrar nuevas ideas
    fetchProjects();
  };

  const handleFlowModeExit = (sessionData) => {
    setFlowModeActive(false);
    console.log('Flow session ended:', sessionData);
  };

  const handleMindMapSave = (mindMapData) => {
    console.log('Mind map saved:', mindMapData);
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
  if (showMindMap && selectedProject) {
    return (
      <div className="h-screen">
        <MindMapContainerNew
          projectId={selectedProject._id}
          onSave={handleMindMapSave}
        />
        <Button
          onClick={() => setShowMindMap(false)}
          className="absolute top-4 left-4 z-10"
          variant="secondary"
        >
          ← Volver
        </Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${getBackgroundClass()}`}>
      {/* Header - Bienvenida y Acción Principal */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {user?.name || 'Creador'}
              </h1>
              <p className="text-lg text-gray-600">
                ¿Qué vamos a crear hoy?
              </p>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <FiLogOut size={18} />
            </Button>
          </div>

          {/* Mensaje inspirador en lugar de botón principal */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu espacio creativo te espera
              </h2>
              <p className="text-gray-600 mb-6">
                Toca el botón flotante cuando una idea llegue
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Listo para capturar inspiración</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Proyecto Activo - Contexto Inmediato */}
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white shadow-lg border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{activeProject.emoji || '📁'}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{activeProject.name}</h2>
                    <p className="text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {activeProject.ideaCount || 0} ideas
                      </span>
                      {activeProject.recentIdeas > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <FiTrendingUp size={14} />
                          {activeProject.recentIdeas} nuevas esta semana
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => navigate(`/project/${activeProject._id}`)}
                    variant="secondary"
                    size="sm"
                  >
                    <FiEdit3 size={16} className="mr-2" />
                    Ver Ideas
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedProject(activeProject);
                      setShowMindMap(true);
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    <FiGrid size={16} className="mr-2" />
                    Mapa Mental
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Proyectos Recientes - Navegación Rápida */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyectos Recientes</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando proyectos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu primer proyecto te espera</h3>
              <p className="text-gray-600 mb-6">Comienza organizando tus ideas creativas</p>
              <Button onClick={() => setShowNewProject(true)} variant="creative">
                <FiPlus /> Crear Primer Proyecto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    hover
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="p-4 bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{project.emoji || '📁'}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.ideaCount || 0} ideas</p>
                        </div>
                      </div>
                      <FiArrowRight className="text-gray-400" />
                    </div>
                    
                    {project.recentIdeas > 0 && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <FiTrendingUp size={12} />
                        <span>{project.recentIdeas} nuevas</span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas - Información secundaria */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Proyectos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiGrid className="text-blue-600" size={20} />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ideas Capturadas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiEdit3 className="text-green-600" size={20} />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actividad Semanal</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentIdeas}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="text-purple-600" size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Nuevo Sistema de Captura */}
      <CaptureFAB onCapture={handleCapture} />
      <CaptureManager 
        projectId={activeProjectId} 
        onIdeaCreated={handleIdeaCreated}
      />
      <AIAssistant
        userContext={{
          recentIdeas: [],
          timeSinceLastIdea: Date.now() - 300000,
          repeatedPatterns: [],
          userActivity: { ideasLastHour: 2, failedConnections: 0 }
        }}
        onSuggestion={(suggestion) => console.log('AI Suggestion:', suggestion)}
        onQuestionGenerate={(type) => Promise.resolve(['Pregunta 1', 'Pregunta 2', 'Pregunta 3'])}
      />

      {/* Modal Nuevo Proyecto */}
      {showNewProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nuevo Proyecto</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Nombre del proyecto..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Crear
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardUX;
