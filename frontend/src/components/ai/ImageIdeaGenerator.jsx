import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiUpload, FiSun, FiX, FiLoader, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ImageIdeaGenerator = ({ 
  onIdeasGenerated, 
  onClose, 
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedIdeas([]);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setGeneratedIdeas([]);
    setAnalysisResult(null);

    try {
      // Convert image to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(selectedImage);
      });

      // Call AI API to analyze image and generate ideas
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          image: base64Image,
          context: 'creative_block'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalysisResult(data.analysis);
        setGeneratedIdeas(data.ideas);
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      // Fallback: Generate basic ideas based on image type
      generateFallbackIdeas();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackIdeas = () => {
    const fallbackIdeas = [
      {
        title: "Análisis Visual",
        description: "Estudia los elementos visuales principales de tu imagen y explora cómo podrías mejorarlos o transformarlos",
        category: "análisis",
        actionItems: ["Identificar colores dominantes", "Analizar composición", "Evaluar balance visual"]
      },
      {
        title: "Inspiración por Contexto",
        description: "Piensa en el contexto donde esta imagen podría ser usada y genera ideas relacionadas",
        category: "contexto",
        actionItems: ["Definir audiencia objetivo", "Explorar casos de uso", "Considerar emociones que evoca"]
      },
      {
        title: "Técnica Alternativa",
        description: "Experimenta con diferentes técnicas o estilos para reinterpretar este concepto visual",
        category: "técnica",
        actionItems: ["Probar diferentes estilos artísticos", "Explorar nuevas herramientas", "Investigar tendencias visuales"]
      },
      {
        title: "Evolución del Concepto",
        description: "Toma este concepto como punto de partida y piensa en cómo podría evolucionar",
        category: "evolución",
        actionItems: ["Versiones simplificadas", "Expansiones del concepto", "Aplicaciones en diferentes medios"]
      }
    ];
    
    setGeneratedIdeas(fallbackIdeas);
    setAnalysisResult({
      detected_elements: ["Proyecto visual", "Elementos creativos"],
      mood: "inspirador",
      style: "único",
      suggestions: ["Explorar diferentes perspectivas", "Experimentar con variaciones"]
    });
  };

  const handleIdeaSelect = (idea) => {
    if (onIdeasGenerated) {
      onIdeasGenerated({
        selectedIdea: idea,
        allIdeas: generatedIdeas,
        analysis: analysisResult,
        imageContext: imagePreview
      });
    }
    onClose();
  };

  const handleDownloadIdeas = () => {
    const content = `
ANÁLISIS DE IMAGEN - ${new Date().toLocaleDateString()}

${analysisResult ? `
DETECCIÓN VISUAL:
${analysisResult.detected_elements?.join(', ') || 'Elementos no detectados'}

ESTILO IDENTIFICADO:
${analysisResult.style || 'Estilo no identificado'}

ESTADO EMOCIONAL:
${analysisResult.mood || 'Estado no determinado'}

SUGERENCIAS:
${analysisResult.suggestions?.join('\n- ') || 'No hay sugerencias'}
` : ''}

IDEAS GENERADAS:
${generatedIdeas.map((idea, index) => `
${index + 1}. ${idea.title}
   Categoría: ${idea.category}
   Descripción: ${idea.description}
   Acciones:
   ${idea.actionItems?.map(item => `   - ${item}`).join('\n') || '   - Sin acciones específicas'}
`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ideas-creativas-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
        className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <FiImage className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generador de Ideas por Imagen</h2>
              <p className="text-sm text-gray-400">Sube una imagen de tu proyecto y obtén ideas creativas</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <FiX size={20} />
          </Button>
        </div>

        {/* Image Upload Area */}
        {!imagePreview ? (
          <div className="mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <FiImage size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-white font-medium mb-2">Sube una imagen de tu proyecto</p>
              <p className="text-gray-400 text-sm mb-4">
                Arrastra y suelta o haz clic para seleccionar
              </p>
              <Button variant="secondary" size="sm">
                <FiUpload /> Seleccionar Imagen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded project"
                className="w-full h-64 object-cover rounded-xl"
              />
              <Button
                onClick={handleRemoveImage}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-gray-900/80 text-white hover:bg-gray-900"
              >
                <FiX size={16} />
              </Button>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Analizando Imagen...
                  </>
                ) : (
                  <>
                    <FiSun className="mr-2" />
                    Generar Ideas
                  </>
                )}
              </Button>
              <Button
                onClick={handleRemoveImage}
                variant="secondary"
              >
                <FiRefreshCw /> Cambiar Imagen
              </Button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FiSun className="text-yellow-400" />
                Análisis Visual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Elementos detectados:</span>
                  <p className="text-white">
                    {analysisResult.detected_elements?.join(', ') || 'No detectados'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Estilo identificado:</span>
                  <p className="text-white">{analysisResult.style || 'No identificado'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Estado emocional:</span>
                  <p className="text-white">{analysisResult.mood || 'No determinado'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Sugerencias IA:</span>
                  <p className="text-white">
                    {analysisResult.suggestions?.slice(0, 2).join(', ') || 'No hay sugerencias'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Generated Ideas */}
        {generatedIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Ideas Creativas Generadas</h3>
              <Button
                onClick={handleDownloadIdeas}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <FiDownload /> Descargar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedIdeas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    hover
                    className="p-4 cursor-pointer bg-gray-700/50 hover:bg-gray-700/70"
                    onClick={() => handleIdeaSelect(idea)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{idea.title}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {idea.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{idea.description}</p>
                    {idea.actionItems && idea.actionItems.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">Acciones sugeridas:</p>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {idea.actionItems.slice(0, 3).map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-1">
                              <span className="text-purple-400">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tips */}
        {!imagePreview && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">💡 Consejos para mejores resultados:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Sube imágenes claras y bien iluminadas</li>
              <li>• Incluye diferentes ángulos del mismo proyecto</li>
              <li>• Muestra tanto el producto como el contexto de uso</li>
              <li>• Las imágenes con personas o interacciones funcionan mejor</li>
            </ul>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageIdeaGenerator;
