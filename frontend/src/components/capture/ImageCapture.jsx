import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera, FiUpload, FiSave, FiImage, FiCrop } from 'react-icons/fi';

const ImageCapture = ({ isOpen, onClose, onSave, projectId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        setSelectedImage(blob);
        closeCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Convertir imagen a base64 para guardar
      let imageData;
      if (typeof selectedImage === 'string') {
        imageData = selectedImage;
      } else {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      await onSave({
        type: 'image',
        content: imageData,
        caption: caption.trim(),
        projectId
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    closeCamera();
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  React.useEffect(() => {
    return cleanup;
  }, []);

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
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiCamera className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Capturar Imagen</h3>
                    <p className="text-pink-100 text-sm">
                      {imagePreview ? 'Ajusta tu imagen' : 'Una imagen vale mil pensamientos 📸'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    cleanup();
                    onClose();
                  }}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <FiX className="text-white" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {!imagePreview ? (
                /* Opciones de captura */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cámara */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openCamera}
                      className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FiCamera size={28} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-lg mb-1">Usar Cámara</h4>
                        <p className="text-pink-100 text-sm">
                          Toma una foto ahora mismo
                        </p>
                      </div>
                    </motion.button>

                    {/* Galería */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FiUpload size={28} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-lg mb-1">Subir desde Galería</h4>
                        <p className="text-purple-100 text-sm">
                          Elige una imagen existente
                        </p>
                      </div>
                    </motion.button>
                  </div>

                  {/* Input oculto para archivos */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Instrucciones */}
                  <div className="text-center text-gray-500 text-sm">
                    <p>💡 Captura lo que inspira tu idea</p>
                    <p className="mt-1">Puede ser una foto, un screenshot, un diagrama...</p>
                  </div>
                </div>
              ) : (
                /* Vista previa y edición */
                <div className="space-y-6">
                  {/* Vista previa de imagen */}
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-96 object-contain bg-gray-50 rounded-2xl border-2 border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                        setCaption('');
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  {/* Campo de descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe lo que ves (opcional)
                    </label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="¿Qué representa esta imagen? ¿Qué idea te inspira?"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isProcessing}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <FiSave size={18} />
                          Guardar Imagen
                        </>
                      )}
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
                </div>
              )}

              {/* Modal de cámara */}
              <AnimatePresence>
                {isCameraOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-60 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Controles de cámara */}
                      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                        <button
                          onClick={closeCamera}
                          className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <FiX size={24} />
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                        >
                          <FiCamera size={28} className="text-gray-800" />
                        </button>
                        <div className="w-16 h-16"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageCapture;
