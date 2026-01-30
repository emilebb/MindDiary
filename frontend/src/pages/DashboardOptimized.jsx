import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAuthStore } from '../utils/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiLogOut, FiGrid, FiClock, FiEdit3, FiMenu, FiX,
  FiSettings, FiHelpCircle, FiTrendingUp, FiChevronRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import CaptureButton from '../components/capture/CaptureButton';
import AIAssistant from '../components/ai/AIAssistant';
import FlowMode from '../components/flow/FlowMode';
import MindMapContainerNew from '../components/mindmap/MindMapContainerNew';
import { useTheme } from '../contexts/ThemeContext';

/**
 * DashboardOptimized - Diseño minimalista centrado en UX
 * 
 * Principios:
 * - Una acción primaria clara
 * - Jerarquía visual explícita
 * - Reducción de carga cognitiva
 * - Guía del usuario sin obligar
 * - Contexto inmediato visible
 */
export const DashboardOptimized = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, createProject, loading } = useProjectStore();
  const { logout, user } = useAuthStore();
  const { getBackgroundClass } = useTheme();
  
  // Estados
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [flowModeActive, setFlowModeActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showMindMap, setShowMindMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  // Proyecto activo (el primero o el marcado como activo)
  const activeProject = projects.find(p => p.isActive) || projects[0];

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
    return {
      totalProjects: projects.length,
      totalIdeas: projects.reduce((sum, p) => sum + (p.ideaCount || 0), 0),
      recentIdeas: projects.reduce((sum, p) => sum + (p.recentIdeas || 0), 0),
    };
  };

  const stats = getProjectStats();

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

  const handleFlowModeExit = (sessionData) => {
    setFlowModeActive(false);
  };

  const handleMindMapSave = (mindMapData) => {
    console.log('Mind map saved:', mindMapData);
    setShowMindMap(false);
  };

  // Vista de Flow Mode
  if (flowModeActive) {
    return (
      <FlowMode
        isActive={flowModeActive}
        onExit={handleFlowModeExit}
      />
    );
  }

  // Vista de Mind Map
  if (showMindMap && selectedProject) {
    return (
      <div className="h-screen relative bg-white">
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
    <div className={`min-h-screen ${getBackgroundClass()} transition-colors duration-300`}>
      {/* ============================================
          HEADER - Bienvenida + Contexto
          ============================================ */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Top row: Greeting + Menu */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Creador'}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                ¿Qué vamos a crear hoy?
              </p>
            </div>

            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-full hover:bg-gray-100 transition text-gray-600"
            >
              {showMenu ? <FiX size={20} /> : <FiMenu size={20} />}
            </motion.button>
          </div>

          {/* Menú desplegable */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1 z-50"
              >
                <button
                  onClick={() => {
                    setFlowModeActive(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
                >
                  <FiClock size={16} /> Flow Mode
                </button>
                <button
                  onClick={() => {
                    setShowMetrics(!showMetrics);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
                >
                  <FiTrendingUp size={16} /> Estadísticas
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // navigate('/settings');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
                >
                  <FiSettings size={16} /> Configuración
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // navigate('/help');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
                >
                  <FiHelpCircle size={16} /> Ayuda
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2 transition"
                >
                  <FiLogOut size={16} /> Salir
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACCIÓN PRIMARIA: Botón Grande + Efecto */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="relative w-full sm:w-auto">
              {/* Efecto de glow (solo en desktop) */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-40" />
              
              {/* Botón */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewProject(true)}
                className="relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiPlus size={20} />
                <span>Capturar Idea</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============================================
          MAIN CONTENT - Contexto y Proyectos
          ============================================ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mostrar loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gray-300 border-t-purple-600 rounded-full"
              />
            </div>
            <p className="text-gray-500 mt-4">Cargando tus proyectos...</p>
          </div>
        )}

        {/* CASO 1: Sin proyectos - Estado vacío con ánimo */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 sm:py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl sm:text-7xl mb-6"
            >
              ✨
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
              Tu primer proyecto te espera
            </h2>
            
            <p className="text-base sm:text-lg text-gray-600 text-center mb-8 max-w-sm">
              Comienza capturando tus ideas más auténticas, sin filtro.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewProject(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700 transition"
            >
              <FiPlus size={18} />
              Crear Primer Proyecto
            </motion.button>
          </motion.div>
        )}

        {/* CASO 2: Con proyectos */}
        {!loading && projects.length > 0 && (
          <>
            {/* SECCIÓN 1: Proyecto Activo - Contexto Inmediato */}
            {activeProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <Card className="p-4 sm:p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Información del Proyecto */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-4xl flex-shrink-0">{activeProject.emoji || '📁'}</div>
                      
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {activeProject.name}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <FiEdit3 size={14} />
                            {activeProject.ideaCount || 0} idea{activeProject.ideaCount !== 1 ? 's' : ''}
                          </span>
                          
                          {activeProject.recentIdeas > 0 && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <FiTrendingUp size={14} />
                              +{activeProject.recentIdeas} esta semana
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones Secundarias */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => navigate(`/project/${activeProject._id}`)}
                        variant="secondary"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                      >
                        <FiEdit3 size={16} className="mr-1" />
                        Ver Ideas
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setSelectedProject(activeProject);
                          setShowMindMap(true);
                        }}
                        variant="secondary"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                      >
                        <FiGrid size={16} className="mr-1" />
                        Mapa
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SECCIÓN 2: Otros Proyectos - Navegación Rápida */}
            {projects.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>Otros Proyectos</span>
                  <span className="text-sm text-gray-500">({projects.length - 1})</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projects
                    .filter(p => p._id !== activeProject?._id)
                    .slice(0, 6)
                    .map((project, index) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                      >
                        <button
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-left group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-2xl">{project.emoji || '📁'}</span>
                            <FiChevronRight className="text-gray-400 group-hover:text-purple-600 transition" size={18} />
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                            {project.name}
                          </h4>
                          
                          <p className="text-xs text-gray-500 mt-1">
                            {project.ideaCount || 0} idea{project.ideaCount !== 1 ? 's' : ''}
                          </p>
                          
                          {project.recentIdeas > 0 && (
                            <p className="text-xs text-green-600 font-medium mt-2">
                              +{project.recentIdeas} nuevas
                            </p>
                          )}
                        </button>
                      </motion.div>
                    ))}
                </div>

                {/* Ver todos los proyectos */}
                {projects.length > 6 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center"
                  >
                    <button
                      onClick={() => navigate('/projects')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 transition"
                    >
                      Ver los {projects.length - 6} proyectos restantes →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SECCIÓN 3: Métricas (Colapsible) */}
            {showMetrics && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              >
                {/* Métrica 1: Total de Proyectos */}
                <Card className="p-4 bg-white border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Proyectos Totales</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiGrid className="text-blue-600" size={18} />
                    </div>
                  </div>
                </Card>

                {/* Métrica 2: Ideas Capturadas */}
                <Card className="p-4 bg-white border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Ideas Capturadas</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalIdeas}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiEdit3 className="text-green-600" size={18} />
                    </div>
                  </div>
                </Card>

                {/* Métrica 3: Actividad Semanal */}
                <Card className="p-4 bg-white border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Actividad Semanal</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recentIdeas}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="text-purple-600" size={18} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* ============================================
          COMPONENTES FLOTANTES (IA + Captura)
          ============================================ */}
      <CaptureButton onCapture={(type) => console.log('Captured:', type)} />
      
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

      {/* ============================================
          MODAL: Nuevo Proyecto
          ============================================ */}
      <AnimatePresence>
        {showNewProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewProject(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nuevo Proyecto</h3>
              
              <p className="text-sm text-gray-600 mb-6">
                Nómbralo según tu tema o área creativa
              </p>

              <form onSubmit={handleCreateProject}>
                <input
                  type="text"
                  placeholder="p.ej. Diseño de App, Novela, Estrategia..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition mb-6"
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
                  
                  <Button
                    type="submit"
                    disabled={!newProjectName.trim()}
                    className="flex-1"
                  >
                    Crear Proyecto
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardOptimized;
