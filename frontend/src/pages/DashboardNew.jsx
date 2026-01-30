import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAuthStore } from '../utils/authStore';
import { motion } from 'framer-motion';
import { FiPlus, FiLogOut, FiGrid, FiList, FiCpu, FiStar, FiTarget, FiClock } from 'react-icons/fi';

// Importar nuevos componentes
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import CaptureButton from '../components/capture/CaptureButton';
import AIAssistant from '../components/ai/AIAssistant';
import FlowMode from '../components/flow/FlowMode';
import MindMapContainer from '../components/mindmap/MindMapContainer';

export const DashboardNew = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, createProject, loading } = useProjectStore();
  const { logout, user } = useAuthStore();
  
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [flowModeActive, setFlowModeActive] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    // Aquí se abriría el modal de captura
    console.log('Capturing idea of type:', type);
  };

  const handleFlowModeExit = (sessionData) => {
    setFlowModeActive(false);
    console.log('Flow session ended:', sessionData);
  };

  const handleMindMapSave = (mindMapData) => {
    console.log('Mind map saved:', mindMapData);
  };

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
    
    return { totalProjects, activeProjects, totalIdeas };
  };

  const stats = getProjectStats();

  if (flowModeActive) {
    return (
      <FlowMode
        isActive={flowModeActive}
        onExit={handleFlowModeExit}
      />
    );
  }

  if (showMindMap && selectedProject) {
    return (
      <div className="h-screen">
        <MindMapContainer
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {getGreeting()}, {user?.name || 'Creador'}
              </h1>
              <p className="text-gray-400">Tu espacio creativo te espera</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setFlowModeActive(true)}
                variant="creative"
              >
                <FiTarget /> Modo Flow
              </Button>
              <Button onClick={logout} variant="ghost">
                <FiLogOut /> Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Proyectos Totales</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
                </div>
                <FiGrid className="text-blue-400" size={32} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Proyectos Activos</p>
                  <p className="text-3xl font-bold text-white">{stats.activeProjects}</p>
                </div>
                <FiStar className="text-green-400" size={32} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Ideas Capturadas</p>
                  <p className="text-3xl font-bold text-white">{stats.totalIdeas}</p>
                </div>
                <FiCpu className="text-purple-400" size={32} />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setShowNewProject(true)}
                variant="primary"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <FiPlus size={24} className="mb-2" />
                Nuevo Proyecto
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setFlowModeActive(true)}
                variant="creative"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <FiTarget size={24} className="mb-2" />
                Modo Flow
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => {
                  if (projects.length > 0) {
                    setSelectedProject(projects[0]);
                    setShowMindMap(true);
                  }
                }}
                variant="secondary"
                className="w-full h-20 flex flex-col items-center justify-center"
                disabled={projects.length === 0}
              >
                <FiGrid size={24} className="mb-2" />
                Mapa Mental
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate('/analytics')}
                variant="ghost"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <FiClock size={24} className="mb-2" />
                Estadísticas
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Tus Proyectos</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Cargando proyectos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <FiCpu size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Tu primer proyecto te espera</h3>
                <p className="text-gray-400">Comienza organizando tus ideas creativas</p>
              </div>
              <Button onClick={() => setShowNewProject(true)} variant="creative">
                <FiPlus /> Crear Primer Proyecto
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{project.emoji || '📁'}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                            <p className="text-sm text-gray-400">{project.ideaCount || 0} ideas</p>
                          </div>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color || '#6366F1' }}
                        />
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {project.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setShowMindMap(true);
                            }}
                          >
                            <FiGrid size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      {showNewProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Nuevo Proyecto</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Nombre del proyecto..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-4"
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

      {/* Floating Components */}
      <CaptureButton onCapture={handleCapture} />
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
    </div>
  );
};

export default DashboardNew;
