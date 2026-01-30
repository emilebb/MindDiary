import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMic, FiCamera, FiEdit3, FiSave, FiTrash2 } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';

export const CaptureModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onSave,
  projectId 
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (type === 'drawing' && isOpen) {
      initializeCanvas();
    }
  }, [type, isOpen]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#9333EA';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Generar etiquetas sugeridas basadas en el contenido
  const getSuggestedTags = () => {
    if (!content) return [];
    
    const suggestions = [];
    const contentLower = content.toLowerCase();
    
    // Etiquetas contextuales basadas en palabras clave
    const keywordTags = {
      'idea': ['concepto', 'innovación'],
      'proyecto': ['planificación', 'desarrollo'],
      'diseño': ['creatividad', 'visual'],
      'desarrollo': ['implementación', 'técnico'],
      'investigación': ['análisis', 'datos'],
      'plan': ['estrategia', 'organización'],
      'mejora': ['optimización', 'refinamiento'],
      'problema': ['solución', 'desafío'],
      'solución': ['respuesta', 'resultado'],
      'cliente': ['usuario', 'experiencia'],
      'mercado': ['negocio', 'oportunidad'],
      'tecnología': ['innovación', 'digital'],
      'equipo': ['colaboración', 'sinergia'],
      'meta': ['objetivo', 'propósito'],
      'proceso': ['flujo', 'sistema']
    };
    
    // Buscar coincidencias y añadir sugerencias
    Object.entries(keywordTags).forEach(([keyword, suggestedTags]) => {
      if (contentLower.includes(keyword)) {
        suggestions.push(...suggestedTags.filter(tag => !tags.includes(tag)));
      }
    });
    
    // Etiquetas basadas en el tipo de captura
    if (type === 'voice') suggestions.push('audio', 'voz');
    if (type === 'drawing') suggestions.push('visual', 'dibujo');
    if (type === 'image') suggestions.push('imagen', 'visual');
    
    // Limitar a 5 sugerencias únicas
    return [...new Set(suggestions)].slice(0, 5);
  };

  const addSuggestedTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSave = () => {
    const ideaData = {
      title,
      content,
      type,
      tags,
      projectId,
      media: null
    };

    if (type === 'drawing' && canvasRef.current) {
      ideaData.media = {
        type: 'image',
        data: canvasRef.current.toDataURL()
      };
    } else if (type === 'image' && imagePreview) {
      ideaData.media = {
        type: 'image',
        data: imagePreview
      };
    } else if (type === 'voice' && audioURL) {
      ideaData.media = {
        type: 'audio',
        data: audioURL
      };
    }

    onSave(ideaData);
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setTitle('');
    setTags([]);
    setCurrentTag('');
    setImagePreview(null);
    setAudioURL(null);
    setIsRecording(false);
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <TextArea
            placeholder="Escribe tu idea aquí..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
        );

      case 'voice':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              {audioURL ? (
                <audio controls className="w-full">
                  <source src={audioURL} type="audio/webm" />
                </audio>
              ) : (
                <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                  <FiMic size={32} className={isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
                </div>
              )}
            </div>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'warning' : 'creative'}
              className="w-full"
            >
              {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
            </Button>
          </div>
        );

      case 'drawing':
        return (
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full border border-gray-600 rounded-xl cursor-crosshair bg-gray-800"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="flex gap-2">
              <Button onClick={() => initializeCanvas()} variant="secondary" size="sm">
                <FiTrash2 /> Limpiar
              </Button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-xl"
                />
                <Button
                  onClick={() => setImagePreview(null)}
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <FiX />
                </Button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
              >
                <FiCamera size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">Haz clic para subir una imagen</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        );

      default:
        return null;
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
            className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {type === 'text' && '✍️ Capturar Idea'}
                  {type === 'voice' && '🎤 Nota de Voz'}
                  {type === 'drawing' && '🎨 Dibujo Rápido'}
                  {type === 'image' && '📷 Imagen'}
                </h2>
                <Button onClick={handleClose} variant="ghost" size="sm">
                  <FiX size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Título (opcional)"
                placeholder="Dale un nombre a tu idea..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {renderContent()}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Etiquetas</label>
                
                {/* Etiquetas actuales */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                
                {/* Etiquetas sugeridas */}
                {getSuggestedTags().length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                      {getSuggestedTags().map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => addSuggestedTag(tag)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-xs transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Input
                  placeholder="Añadir etiqueta (presiona Enter)..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={addTag}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleClose} variant="secondary" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  <FiSave /> Guardar Idea
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaptureModal;
