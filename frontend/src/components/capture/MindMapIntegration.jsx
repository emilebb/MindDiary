import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMap, FiPlus, FiSearch, FiCheck } from 'react-icons/fi';

const MindMapIntegration = ({ 
  isOpen, 
  onClose, 
  ideaData, 
  projects, 
  onIntegrate 
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMindMap, setSelectedMindMap] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const [isCreating, setIsCreating] = useState(false);

  const handleIntegrate = async () => {
    if (!selectedProject || !selectedMindMap) return;

    setIsCreating(true);
    try {
      await onIntegrate({
        ideaData,
        projectId: selectedProject,
        mindMapId: selectedMindMap,
        position: nodePosition
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Integration failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getIdeaPreview = () => {
    switch (ideaData.type) {
      case 'text':
        return ideaData.content.substring(0, 100) + '...';
      case 'voice':
        return ideaData.content || 'Nota de voz';
      case 'drawing':
        return 'Dibujo creativo';
      case 'image':
        return ideaData.caption || 'Imagen inspiradora';
      default:
        return 'Nueva idea';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiMap className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Añadir a Mapa Mental</h3>
                    <p className="text-indigo-100 text-sm">
                      Convierte tu idea en un nodo visual
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <FiX className="text-white" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Vista previa de la idea */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                <h4 className="font-semibold text-gray-900 mb-2">Tu idea:</h4>
                <p className="text-gray-700">{getIdeaPreview()}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-indigo-600">
                    {ideaData.type}
                  </span>
                </div>
              </div>

              {/* Selección de proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seleccionar proyecto:
                </label>
                <div className="space-y-2">
                  {projects?.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => setSelectedProject(project._id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        selectedProject === project._id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{project.emoji || '📁'}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.ideaCount || 0} ideas</p>
                        </div>
                        {selectedProject === project._id && (
                          <FiCheck className="text-indigo-600 ml-auto" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mapas mentales disponibles */}
              {selectedProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mapa mental donde añadir:
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedMindMap('new')}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        selectedMindMap === 'new'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <FiPlus className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Crear nuevo mapa mental</h4>
                          <p className="text-sm text-gray-500">Empezar desde cero</p>
                        </div>
                        {selectedMindMap === 'new' && (
                          <FiCheck className="text-indigo-600 ml-auto" size={20} />
                        )}
                      </div>
                    </button>

                    {/* Simulación de mapas existentes */}
                    <button
                      onClick={() => setSelectedMindMap('main')}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        selectedMindMap === 'main'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FiMap className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Mapa principal</h4>
                          <p className="text-sm text-gray-500">Mapa mental existente</p>
                        </div>
                        {selectedMindMap === 'main' && (
                          <FiCheck className="text-indigo-600 ml-auto" size={20} />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Posición del nodo */}
              {selectedMindMap && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Posición inicial del nodo:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Posición X</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={nodePosition.x}
                        onChange={(e) => setNodePosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-600">{nodePosition.x}%</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Posición Y</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={nodePosition.y}
                        onChange={(e) => setNodePosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-600">{nodePosition.y}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleIntegrate}
                  disabled={!selectedProject || !selectedMindMap || isCreating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando nodo...
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} />
                      Añadir a Mapa Mental
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MindMapIntegration;
