import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAuthStore } from '../utils/authStore';
import { motion } from 'framer-motion';
import { FiPlus, FiMenu, FiLogOut } from 'react-icons/fi';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, createProject } = useProjectStore();
  const { logout, user } = useAuthStore();
  const [showNewProject, setShowNewProject] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      try {
        await createProject({ name: newProjectName });
        setNewProjectName('');
        setShowNewProject(false);
      } catch (err) {
        console.error('Failed to create project:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Mind Diary</h1>
            <p className="text-sm text-gray-400">{user?.name}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <FiLogOut /> Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Bienvenido, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-400">
            Aquí están tus proyectos creativas. Comienza a capturar tus ideas sin filtro.
          </p>
        </motion.div>

        {/* Create Project Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          {!showNewProject ? (
            <button
              onClick={() => setShowNewProject(true)}
              className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
            >
              <FiPlus size={20} />
              Nuevo Proyecto
            </button>
          ) : (
            <form onSubmit={handleCreateProject} className="bg-gray-800 p-6 rounded-lg">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/project/${project._id}`)}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{project.emoji}</div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{project.stats.ideasCount} ideas</span>
                <span>
                  {new Date(project.lastActivityDate).toLocaleDateString('es-ES')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 mb-6">
              Aún no tienes proyectos. ¡Crea uno para comenzar!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
