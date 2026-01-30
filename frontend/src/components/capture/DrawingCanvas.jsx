import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiCircle, FiSquare, FiTriangle, FiEdit3, FiDelete } from 'react-icons/fi';

const DrawingCanvas = ({ isOpen, onClose, onSave, projectId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const tools = [
    { id: 'pen', icon: FiEdit3, label: 'Lápiz' },
    { id: 'eraser', icon: FiDelete, label: 'Borrador' },
    { id: 'circle', icon: FiCircle, label: 'Círculo' },
    { id: 'square', icon: FiSquare, label: 'Cuadrado' },
    { id: 'triangle', icon: FiTriangle, label: 'Triángulo' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Configurar canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Guardar estado inicial
      saveToHistory();
    }
  }, [isOpen]);

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      restoreFromHistory(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      restoreFromHistory(newStep);
    }
  };

  const restoreFromHistory = (step) => {
    if (!canvasRef.current || !history[step]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = history[step];
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing && currentTool !== 'circle' && currentTool !== 'square' && currentTool !== 'triangle') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
    }

    switch (currentTool) {
      case 'pen':
      case 'eraser':
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'square':
        ctx.strokeRect(x - 20, y - 20, 40, 40);
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x - 20, y + 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      
      await onSave({
        type: 'drawing',
        content: imageData,
        projectId
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
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
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiEdit3 className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dibujar Idea</h3>
                    <p className="text-purple-100 text-sm">
                      Tu lienzo en blanco te espera ✨
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

            {/* Toolbar */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {/* Herramientas */}
                <div className="flex items-center gap-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setCurrentTool(tool.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          currentTool === tool.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                        title={tool.label}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>

                {/* Separador */}
                <div className="w-px h-8 bg-gray-300"></div>

                {/* Colores */}
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        currentColor === color
                          ? 'border-purple-600 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Separador */}
                <div className="w-px h-8 bg-gray-300"></div>

                {/* Tamaño del pincel */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tamaño:</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600 w-8">{brushSize}</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={undo}
                    disabled={historyStep <= 0}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Deshacer
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyStep >= history.length - 1}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rehacer
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="p-6">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full h-96 bg-white border-2 border-gray-200 rounded-2xl cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiSave size={18} />
                  Guardar Dibujo
                </button>
                <button
                  onClick={() => {
                    // TODO: Integrar con mapa mental
                    console.log('Convertir en nodo de mapa mental');
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-colors"
                >
                  Mapa Mental
                </button>
              </div>
              
              <div className="text-center text-gray-500 text-sm mt-4">
                <p>🎨 Dibuja sin pensar, solo siente</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawingCanvas;
