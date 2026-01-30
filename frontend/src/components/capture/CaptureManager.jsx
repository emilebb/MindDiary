import React, { useState } from 'react';
import TextEditor from './TextEditor';
import VoiceCapture from './VoiceCapture';
import DrawingCanvas from './DrawingCanvas';
import ImageCapture from './ImageCapture';
import AIManager from './AIAssistant/AIManager';

const CaptureManager = ({ projectId, onIdeaCreated }) => {
  const [activeEditor, setActiveEditor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiData, setAiData] = useState(null);

  const handleCapture = (type) => {
    setActiveEditor(type);
    setAiData(null); // Resetear datos de IA al cambiar de modo
  };

  // Handlers para sugerencias de IA
  const handleAISuggestion = (suggestion) => {
    console.log('AI Suggestion:', suggestion);
    // Implementar lógica para aplicar sugerencias
  };

  const handleStructureSuggestion = (structure) => {
    console.log('Structure suggestion:', structure);
    // Implementar lógica para aplicar estructura
  };

  const handleConnectionSuggestion = (connection) => {
    console.log('Connection suggestion:', connection);
    // Implementar lógica para buscar conexiones
  };

  const handleTitleSuggestion = (title) => {
    console.log('Title suggestion:', title);
    // Implementar lógica para aplicar título
  };

  const handleSubideaSuggestion = (subideas) => {
    console.log('Subidea suggestion:', subideas);
    // Implementar lógica para expandir en subideas
  };

  const handleMindMapSuggestion = () => {
    console.log('Mind map suggestion');
    // Implementar lógica para convertir en mapa mental
  };

  const handleKeywordsSuggestion = (keywords) => {
    console.log('Keywords suggestion:', keywords);
    // Implementar lógica para aplicar palabras clave
  };

  const handleCategorizationSuggestion = (categories) => {
    console.log('Categorization suggestion:', categories);
    // Implementar lógica para categorizar
  };

  const handleInterpretation = (interpretation) => {
    console.log('Drawing interpretation:', interpretation);
    // Implementar lógica para interpretación de dibujo
  };

  const handleTranscriptionComplete = (transcription) => {
    console.log('Voice transcription:', transcription);
    // Actualizar datos de IA con transcripción
    setAiData(prev => ({ ...prev, transcript: transcription.content }));
  };

  const handleSave = async (ideaData) => {
    setIsSaving(true);
    try {
      // Aquí iría la llamada real a la API
      console.log('Saving idea:', ideaData);
      
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notificar que se creó una idea
      if (onIdeaCreated) {
        onIdeaCreated(ideaData);
      }
      
      // Cerrar editor
      setActiveEditor(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error saving idea:', error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setActiveEditor(null);
  };

  return (
    <>
      {/* Editor de Texto */}
      <TextEditor
        isOpen={activeEditor === 'text'}
        onClose={handleClose}
        onSave={handleSave}
        projectId={projectId}
      />

      {/* Captura de Voz */}
      <VoiceCapture
        isOpen={activeEditor === 'voice'}
        onClose={handleClose}
        onSave={handleSave}
        projectId={projectId}
      />

      {/* Lienzo de Dibujo */}
      <DrawingCanvas
        isOpen={activeEditor === 'drawing'}
        onClose={handleClose}
        onSave={handleSave}
        projectId={projectId}
      />

      {/* Captura de Imagen */}
      <ImageCapture
        isOpen={activeEditor === 'image'}
        onClose={handleClose}
        onSave={handleSave}
        projectId={projectId}
      />

      {/* IA Assistant para el modo activo */}
      <AIManager
        mode={activeEditor}
        isActive={!!activeEditor}
        data={aiData}
        onSuggestion={handleAISuggestion}
        onStructureSuggestion={handleStructureSuggestion}
        onConnectionSuggestion={handleConnectionSuggestion}
        onTitleSuggestion={handleTitleSuggestion}
        onSubideaSuggestion={handleSubideaSuggestion}
        onMindMapSuggestion={handleMindMapSuggestion}
        onKeywordsSuggestion={handleKeywordsSuggestion}
        onCategorizationSuggestion={handleCategorizationSuggestion}
        onInterpretation={handleInterpretation}
        onTranscriptionComplete={handleTranscriptionComplete}
      />
    </>
  );
};

export default CaptureManager;
