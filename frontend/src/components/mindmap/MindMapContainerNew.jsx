import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSave, FiDownload, FiUpload, FiGrid, FiList, FiCpu } from 'react-icons/fi';
import MindMapCanvas from './MindMapCanvas';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import AIMindMapGenerator from '../ai/AIMindMapGenerator';
import { aiAPI } from '../../utils/api';

export const MindMapContainerNew = ({ 
  projectId, 
  initialNodes = [], 
  initialConnections = [],
  onSave,
  className = '' 
}) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'list'
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes, connections]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      await onSave({ nodes, connections });
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleNodeUpdate = useCallback((nodeId, updates) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  const handleNodeAdd = useCallback((newNodeData) => {
    const newNode = {
      id: `node_${Date.now()}`,
      ...newNodeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNodes(prevNodes => [...prevNodes, newNode]);

    // Si tiene padre, crear conexión
    if (newNodeData.parent) {
      const newConnection = {
        id: `conn_${Date.now()}`,
        from: newNodeData.parent,
        to: newNode.id,
        type: 'strong'
      };
      setConnections(prev => [...prev, newConnection]);
    }
  }, []);

  const handleConnectionCreate = useCallback((fromNode, toNode) => {
    const existingConnection = connections.find(
      conn => (conn.from === fromNode && conn.to === toNode) ||
              (conn.from === toNode && conn.to === fromNode)
    );

    if (!existingConnection) {
      const newConnection = {
        id: `conn_${Date.now()}`,
        from: fromNode,
        to: toNode,
        type: 'potential'
      };
      setConnections(prev => [...prev, newConnection]);
    }
  }, [connections]);

  const handleExport = () => {
    const data = {
      nodes,
      connections,
      projectId,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap_${projectId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setNodes(data.nodes || []);
          setConnections(data.connections || []);
        } catch (err) {
          console.error('Failed to import mind map:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const addCentralNode = () => {
    const centralNode = {
      id: `central_${Date.now()}`,
      content: 'Idea Central',
      position: { x: 400, y: 300 },
      type: 'central',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNodes([centralNode]);
    setConnections([]);
  };

  const handleAIGenerate = async (params) => {
    try {
      console.log('Generating AI mind map with params:', params);
      const response = await aiAPI.generateMindMap(params);
      const mindMapData = response.data;
      
      // Convertir la respuesta de IA al formato de nodos
      const allNodes = [mindMapData.centralNode, ...mindMapData.nodes];
      setNodes(allNodes);
      setConnections(mindMapData.connections);
      
      // Guardar automáticamente
      await onSave({ nodes: allNodes, connections: mindMapData.connections });
      
      return mindMapData;
    } catch (error) {
      console.error('Failed to generate AI mind map:', error);
      throw error;
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {nodes.map((node) => (
        <Card key={node.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{node.content}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className={`px-2 py-1 rounded ${
                  node.type === 'central' ? 'bg-purple-500/20 text-purple-300' :
                  node.type === 'primary' ? 'bg-blue-500/20 text-blue-300' :
                  node.type === 'secondary' ? 'bg-green-500/20 text-green-300' :
                  'bg-orange-500/20 text-orange-300'
                }`}>
                  {node.type}
                </span>
                {node.tags && node.tags.length > 0 && (
                  <div className="flex gap-1">
                    {node.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setViewMode('canvas');
                setTimeout(() => {
                  // Scroll to node position
                  const element = document.getElementById(`node-${node.id}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
            >
              <FiGrid />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={`h-screen flex flex-col bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Mapa Mental Creativo</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'canvas' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('canvas')}
              >
                <FiGrid /> Canvas
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FiList /> Lista
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAIGenerator(true)}
              variant="creative"
              size="sm"
            >
              <FiCpu /> Generar con IA
            </Button>
            <Button onClick={addCentralNode} variant="secondary" size="sm">
              <FiPlus /> Nodo Central
            </Button>
            <Button onClick={handleExport} variant="secondary" size="sm">
              <FiDownload /> Exportar
            </Button>
            <Button onClick={handleImport} variant="secondary" size="sm">
              <FiUpload /> Importar
            </Button>
            {isAutoSaving && (
              <span className="text-xs text-gray-400">Auto-guardando...</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'canvas' ? (
          <MindMapCanvas
            nodes={nodes}
            connections={connections}
            onNodeClick={(node) => console.log('Node clicked:', node)}
            onNodeDrag={handleNodeUpdate}
            onNodeEdit={handleNodeUpdate}
            onNodeAdd={handleNodeAdd}
            onConnectionCreate={handleConnectionCreate}
          />
        ) : (
          <div className="p-6 overflow-y-auto h-full">
            {nodes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No hay nodos en el mapa mental</p>
                <Button onClick={addCentralNode} variant="creative">
                  <FiPlus /> Crear Primera Idea
                </Button>
              </div>
            ) : (
              renderListView()
            )}
          </div>
        )}
      </div>

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <AIMindMapGenerator
          onGenerateMindMap={handleAIGenerate}
          onClose={() => setShowAIGenerator(false)}
        />
      )}

      {/* Estado de Auto-guardado */}
      {isAutoSaving && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm"
        >
          Auto-guardando...
        </motion.div>
      )}
    </div>
  );
};

export default MindMapContainerNew;
