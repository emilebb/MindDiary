import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiZoomIn, FiZoomOut, FiMaximize2, FiMove } from 'react-icons/fi';

export const MindMapNode = ({ 
  node, 
  onNodeClick, 
  onNodeDrag, 
  onNodeEdit, 
  isSelected,
  isDragging 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.content);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(node.content);
  };

  const handleEditSave = () => {
    onNodeEdit(node.id, editText);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(node.content);
  };

  const nodeColors = {
    central: 'from-indigo-500 to-purple-600',
    primary: 'from-blue-500 to-cyan-600',
    secondary: 'from-green-500 to-emerald-600',
    tertiary: 'from-orange-500 to-red-600'
  };

  const nodeSize = {
    central: 'w-32 h-32',
    primary: 'w-24 h-24',
    secondary: 'w-20 h-20',
    tertiary: 'w-16 h-16'
  };

  return (
    <motion.div
      drag={!isEditing}
      dragMomentum={false}
      onDragEnd={(event, info) => {
        onNodeDrag(node.id, {
          x: node.position.x + info.offset.x,
          y: node.position.y + info.offset.y
        });
      }}
      whileHover={{ scale: isEditing ? 1 : 1.05 }}
      whileTap={{ scale: isEditing ? 1 : 0.95 }}
      animate={{
        x: node.position.x,
        y: node.position.y,
        scale: isSelected ? 1.1 : 1
      }}
      className={`
        absolute ${nodeSize[node.type] || nodeSize.tertiary}
        bg-gradient-to-br ${nodeColors[node.type] || nodeColors.tertiary}
        rounded-full shadow-lg cursor-move
        flex items-center justify-center
        ${isSelected ? 'ring-4 ring-white/50' : ''}
        ${isDragging ? 'opacity-80' : ''}
        transition-all duration-200
      `}
      onClick={() => !isEditing && onNodeClick(node)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="p-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSave}
            onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
            onKeyDown={(e) => e.key === 'Escape' && handleEditCancel()}
            className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm text-center"
            autoFocus
          />
        </div>
      ) : (
        <div className="text-white text-center p-2">
          <div className="text-xs font-medium truncate max-w-[100px]">
            {node.content}
          </div>
          
          {/* Etiquetas agrupadas */}
          {node.tags && node.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {node.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs text-white/80 backdrop-blur-sm border border-white/30"
                >
                  {tag}
                </span>
              ))}
              {node.tags.length > 3 && (
                <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs text-white/60 backdrop-blur-sm border border-white/30">
                  +{node.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Indicadores de media */}
          {node.media && (
            <div className="mt-1">
              {node.media.type === 'image' && '🖼️'}
              {node.media.type === 'audio' && '🎵'}
              {node.media.type === 'drawing' && '🎨'}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export const MindMapConnection = ({ from, to, type = 'strong' }) => {
  const connectionColors = {
    strong: 'bg-purple-500',
    weak: 'bg-gray-400',
    potential: 'bg-blue-400 opacity-50'
  };

  const connectionWidth = {
    strong: 'w-2',
    weak: 'w-1',
    potential: 'w-1'
  };

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={type === 'strong' ? '#9333EA' : type === 'weak' ? '#9CA3AF' : '#60A5FA'}
        strokeWidth={type === 'strong' ? 3 : type === 'weak' ? 2 : 1}
        strokeDasharray={type === 'potential' ? '5,5' : '0'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        opacity={type === 'potential' ? 0.5 : 1}
      />
    </svg>
  );
};

export const MindMapCanvas = ({ 
  nodes = [], 
  connections = [], 
  onNodeUpdate, 
  onConnectionCreate,
  onNodeAdd,
  className = '' 
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
  }, [selectedNode]);

  const handleNodeDrag = useCallback((nodeId, newPosition) => {
    onNodeUpdate(nodeId, { position: newPosition });
  }, [onNodeUpdate]);

  const handleNodeEdit = useCallback((nodeId, newContent) => {
    onNodeUpdate(nodeId, { content: newContent });
  }, [onNodeUpdate]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current && selectedNode) {
      // Crear nuevo nodo
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / scale;
      const y = (e.clientY - rect.top - pan.y) / scale;
      
      onNodeAdd({
        content: 'Nueva Idea',
        position: { x, y },
        type: 'tertiary',
        parent: selectedNode
      });
      
      setSelectedNode(null);
    }
  }, [selectedNode, pan, scale, onNodeAdd]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => Math.max(0.5, Math.min(2, prevScale * delta)));
  }, []);

  const handlePanStart = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const handlePanMove = useCallback((e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const zoomIn = () => setScale(prev => Math.min(2, prev * 1.2));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev / 1.2));
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden ${className}`}>
      {/* Controles del Canvas */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
        >
          <FiZoomIn size={16} />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
        >
          <FiZoomOut size={16} />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
        >
          <FiMaximize2 size={16} />
        </button>
      </div>

      {/* Canvas Principal */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        style={{
          cursor: isPanning ? 'grabbing' : selectedNode ? 'crosshair' : 'grab'
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s'
          }}
        >
          {/* Conexiones */}
          {connections.map((connection, index) => (
            <MindMapConnection
              key={index}
              from={nodes.find(n => n.id === connection.from)}
              to={nodes.find(n => n.id === connection.to)}
              type={connection.type}
            />
          ))}

          {/* Nodos */}
          {nodes.map((node) => (
            <MindMapNode
              key={node.id}
              node={node}
              onNodeClick={handleNodeClick}
              onNodeDrag={handleNodeDrag}
              onNodeEdit={handleNodeEdit}
              isSelected={selectedNode === node.id}
              isDragging={isDragging}
            />
          ))}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-4 left-4 text-gray-400 text-sm">
        <p>• Doble clic para editar • Arrastrar para mover • Shift+arrastrar para hacer pan</p>
        <p>• Click en vacío para crear nodo • Scroll para zoom</p>
      </div>
    </div>
  );
};

export default MindMapCanvas;
