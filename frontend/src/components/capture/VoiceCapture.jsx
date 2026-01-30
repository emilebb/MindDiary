import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMic, FiMicOff, FiPause, FiPlay, FiSave, FiCheck } from 'react-icons/fi';

const VoiceCapture = ({ isOpen, onClose, onSave, projectId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Detener todas las pistas de audio
        stream.getTracks().forEach(track => track.stop());
        
        // Iniciar transcripción automática
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const transcribeAudio = async (blob) => {
    setIsTranscribing(true);
    try {
      // Simulación de transcripción (en producción, usar API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Transcripción simulada
      const mockTranscript = "Esta es una transcripción de ejemplo del audio grabado. En producción, aquí iría la transcripción real del servicio de IA.";
      setTranscript(mockTranscript);
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscript('No se pudo transcribir el audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSave = async () => {
    if (!audioBlob && !transcript) return;

    try {
      await onSave({
        type: 'voice',
        content: transcript || '',
        audioBlob,
        projectId,
        duration: recordingTime
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
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
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiMic className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Capturar Voz</h3>
                    <p className="text-green-100 text-sm">
                      {isRecording ? `Grabando ${formatTime(recordingTime)}` : 'Toca el micrófono para empezar'}
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
              {/* Visualización de grabación */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={isRecording && !isPaused ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    isRecording 
                      ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                      : 'bg-gray-200'
                  }`}
                >
                  {isRecording ? (
                    <FiMicOff className="text-white" size={32} />
                  ) : (
                    <FiMic className="text-gray-400" size={32} />
                  )}
                </motion.div>
              </div>

              {/* Controles de grabación */}
              <div className="flex justify-center gap-4 mb-8">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-medium transition-colors flex items-center gap-3 shadow-lg"
                  >
                    <FiMic size={20} />
                    Empezar a Grabar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded-2xl font-medium transition-colors flex items-center gap-2"
                    >
                      {isPaused ? <FiPlay size={20} /> : <FiPause size={20} />}
                      {isPaused ? 'Reanudar' : 'Pausar'}
                    </button>
                    <button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-medium transition-colors flex items-center gap-2"
                    >
                      <FiMicOff size={20} />
                      Detener
                    </button>
                  </>
                )}
              </div>

              {/* Reproductor de audio */}
              {audioURL && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Audio grabado:</h4>
                  <audio 
                    controls 
                    className="w-full"
                    src={audioURL}
                  />
                </div>
              )}

              {/* Transcripción */}
              {(isTranscribing || transcript) && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {isTranscribing ? 'Transcribiendo...' : 'Transcripción:'}
                  </h4>
                  {isTranscribing ? (
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm">Procesando audio...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <p className="text-gray-900 leading-relaxed">{transcript}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              {(audioURL || transcript) && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiSave size={18} />
                    Guardar Idea
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
              )}

              {/* Instrucciones */}
              {!isRecording && !audioURL && (
                <div className="text-center text-gray-500 text-sm">
                  <p>🎧 Te escucho sin juzgar</p>
                  <p className="mt-1">Habla libremente, no te preocupes por la perfección</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCapture;
