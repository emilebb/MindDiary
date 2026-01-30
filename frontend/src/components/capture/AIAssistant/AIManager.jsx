import React from 'react';
import TextModeAI from './TextModeAI';
import VoiceModeAI from './VoiceModeAI';
import DrawingModeAI from './DrawingModeAI';
import ImageModeAI from './ImageModeAI';

const AIManager = ({ 
  mode, 
  isActive, 
  data, 
  onSuggestion,
  onStructureSuggestion,
  onConnectionSuggestion,
  onTitleSuggestion,
  onSubideaSuggestion,
  onMindMapSuggestion,
  onKeywordsSuggestion,
  onCategorizationSuggestion,
  onInterpretation,
  onTranscriptionComplete
}) => {
  // Renderizar el componente de IA correspondiente al modo
  switch (mode) {
    case 'text':
      return (
        <TextModeAI
          content={data?.content || ''}
          isActive={isActive}
          onSuggestion={onSuggestion}
          onStructureSuggestion={onStructureSuggestion}
          onConnectionSuggestion={onConnectionSuggestion}
        />
      );
      
    case 'voice':
      return (
        <VoiceModeAI
          audioBlob={data?.audioBlob}
          transcript={data?.transcript}
          isActive={isActive}
          onTranscriptionComplete={onTranscriptionComplete}
          onTitleSuggestion={onTitleSuggestion}
          onSubideaSuggestion={onSubideaSuggestion}
          onMindMapSuggestion={onMindMapSuggestion}
        />
      );
      
    case 'drawing':
      return (
        <DrawingModeAI
          imageData={data?.imageData}
          isActive={isActive}
          onInterpretation={onInterpretation}
          onStructureSuggestion={onStructureSuggestion}
          onMindMapSuggestion={onMindMapSuggestion}
        />
      );
      
    case 'image':
      return (
        <ImageModeAI
          imageData={data?.imageData}
          caption={data?.caption}
          isActive={isActive}
          onKeywordsSuggestion={onKeywordsSuggestion}
          onCategorizationSuggestion={onCategorizationSuggestion}
          onConnectionSuggestion={onConnectionSuggestion}
        />
      );
      
    default:
      return null;
  }
};

export default AIManager;
