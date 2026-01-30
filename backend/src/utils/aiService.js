const OpenAI = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

const generateCreativeQuestions = async (topic, context = '') => {
  if (!openai) {
    return ['What does this mean to you?', 'How would you explain this to someone else?', 'What excites you most about this?'];
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative coach for Mind Diary. Generate 4-5 open-ended, empathetic questions that help unlock creative blocks without being judgmental. Questions should be brief (1 sentence) and thought-provoking. Return as a JSON array of strings.'
        },
        {
          role: 'user',
          content: `Topic: "${topic}"\nContext: ${context || 'No additional context'}\n\nGenerate creative questions in JSON array format.`
        }
      ],
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    const questions = JSON.parse(content);
    return questions;
  } catch (err) {
    console.error('Error generating questions:', err);
    return ['What does this mean to you?', 'How would you explain this to someone else?', 'What excites you most about this?'];
  }
};

const expandIdeaAI = async (ideaContent, question = '') => {
  if (!openai) {
    return {
      title: ideaContent,
      subIdeas: ['Research', 'Plan', 'Design', 'Implement', 'Evaluate']
    };
  }
  
  try {
    const prompt = question 
      ? `Based on this question: "${question}", expand the idea: "${ideaContent}"`
      : `Expand this idea: "${ideaContent}"`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative brainstorming assistant. Expand the given idea into 5-7 sub-ideas or related concepts. Be creative but practical. Return as a JSON object with "title" and "subIdeas" array.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nExpand this idea into logical sub-concepts as JSON.`
        }
      ],
      temperature: 0.9
    });

    const content = response.choices[0].message.content;
    const expansion = JSON.parse(content);
    return expansion;
  } catch (err) {
    console.error('Error expanding idea:', err);
    return {
      title: ideaContent,
      subIdeas: ['Research', 'Plan', 'Design', 'Implement', 'Evaluate']
    };
  }
};

const detectCreativeMood = async (ideaContent) => {
  if (!openai) {
    return 'neutral';
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the tone and emotion of the text. Return a single-word mood (excited, curious, uncertain, energetic, contemplative, frustrated, etc.) in lowercase.'
        },
        {
          role: 'user',
          content: ideaContent
        }
      ],
      temperature: 0.5
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    return 'neutral';
  }
};

const findIdeaConnections = async (mainIdea, otherIdeas) => {
  if (!openai) {
    return [];
  }
  
  try {
    const ideaSummaries = otherIdeas.map(idea => `"${idea.content}"`).join(', ');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Find creative connections between ideas. Return as JSON array of connection objects with "ideaIndex" (0-based) and "connection" (brief explanation).'
        },
        {
          role: 'user',
          content: `Main idea: "${mainIdea}"\n\nOther ideas: ${ideaSummaries}\n\nFind interesting connections as JSON array.`
        }
      ],
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    const connections = JSON.parse(content);
    return connections;
  } catch (err) {
    return [];
  }
};

const generateCreativeExercise = async (blockType) => {
  if (!openai) {
    return 'Try writing or drawing freely for 5 minutes without editing yourself.';
  }
  
  try {
    const exercisePrompts = {
      inactivity: 'Generate a 5-minute creative warm-up exercise to break inactivity.',
      repetition: 'Generate an exercise to explore different angles of the same topic.',
      stagnation: 'Generate a lateral thinking exercise to unstick creative thinking.',
      'decision-paralysis': 'Generate a quick exercise to help make creative decisions.'
    };

    const prompt = exercisePrompts[blockType] || 'Generate a creative exercise.';

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative coach. Generate a brief, actionable creative exercise (2-3 sentences max). Be encouraging and specific.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9
    });

    return response.choices[0].message.content;
  } catch (err) {
    return 'Try writing or drawing freely for 5 minutes without editing yourself.';
  }
};

const generateMindMap = async (centralIdea, mode = 'balanced', depth = 3) => {
  if (!openai) {
    // Fallback: Generate basic mind map structure without AI
    return generateFallbackMindMap(centralIdea, mode, depth);
  }
  
  try {
    const modePrompts = {
      creative: `Generate a creative and divergent mind map for: "${centralIdea}". 
        Think outside the box, include unexpected connections, metaphors, and innovative perspectives.
        Create ${depth} levels of depth with rich, interconnected ideas.`,
      
      structured: `Generate a structured and logical mind map for: "${centralIdea}". 
        Organize into clear categories, subcategories, and practical action items.
        Create ${depth} levels of depth with systematic, hierarchical organization.`,
      
      balanced: `Generate a balanced mind map for: "${centralIdea}". 
        Mix creative exploration with practical organization.
        Create ${depth} levels of depth with both innovative ideas and structured categories.`
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert mind mapping specialist. Generate a comprehensive mind map structure in JSON format.
          
          Return ONLY a JSON object with this exact structure:
          {
            "centralNode": {
              "id": "central",
              "content": "Main idea",
              "type": "central",
              "tags": ["central"],
              "position": { "x": 400, "y": 300 }
            },
            "nodes": [
              {
                "id": "unique_id",
                "content": "Node content",
                "type": "primary|secondary|tertiary",
                "tags": ["tag1", "tag2"],
                "parent": "parent_id",
                "position": { "x": number, "y": number }
              }
            ],
            "connections": [
              {
                "id": "conn_id",
                "from": "from_node_id",
                "to": "to_node_id",
                "type": "strong|potential"
              }
            ]
          }
          
          Guidelines:
          - Generate 8-15 nodes total depending on depth
          - Use meaningful tags for each node
          - Position nodes in a circular/spatial layout around center
          - Create logical parent-child relationships
          - Add both strong and potential connections
          - Be creative but practical`
        },
        {
          role: 'user',
          content: modePrompts[mode] || modePrompts.balanced
        }
      ],
      temperature: mode === 'creative' ? 0.9 : mode === 'structured' ? 0.3 : 0.6,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      const mindMapData = JSON.parse(content);
      return validateAndEnhanceMindMap(mindMapData, centralIdea, mode);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return generateFallbackMindMap(centralIdea, mode, depth);
    }
  } catch (err) {
    console.error('Mind map generation error:', err);
    return generateFallbackMindMap(centralIdea, mode, depth);
  }
};

const generateFallbackMindMap = (centralIdea, mode, depth) => {
  // Generate basic mind map structure without AI
  const centralNode = {
    id: 'central',
    content: centralIdea,
    type: 'central',
    tags: ['central', 'principal'],
    position: { x: 400, y: 300 }
  };

  const nodes = [];
  const connections = [];
  
  // Generate basic branches based on mode
  const branchCategories = mode === 'creative' 
    ? ['Exploración', 'Innovación', 'Conexiones', 'Posibilidades']
    : mode === 'structured'
    ? ['Objetivos', 'Recursos', 'Proceso', 'Resultados']
    : ['Conceptos', 'Acciones', 'Recursos', 'Ideas'];

  branchCategories.forEach((category, index) => {
    const angle = (index * 2 * Math.PI) / branchCategories.length;
    const radius = 150;
    
    const categoryNode = {
      id: `category_${index}`,
      content: category,
      type: 'primary',
      tags: [category.toLowerCase(), 'categoría'],
      parent: 'central',
      position: {
        x: 400 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle)
      }
    };
    
    nodes.push(categoryNode);
    connections.push({
      id: `conn_central_${categoryNode.id}`,
      from: 'central',
      to: categoryNode.id,
      type: 'strong'
    });

    // Add sub-nodes if depth > 2
    if (depth >= 3) {
      const subCategories = getSubCategories(category, mode);
      subCategories.forEach((subCat, subIndex) => {
        const subAngle = angle + (subIndex - 1) * 0.3;
        const subRadius = 250;
        
        const subNode = {
          id: `sub_${categoryNode.id}_${subIndex}`,
          content: subCat,
          type: 'secondary',
          tags: [subCat.toLowerCase(), 'subcategoría'],
          parent: categoryNode.id,
          position: {
            x: 400 + subRadius * Math.cos(subAngle),
            y: 300 + subRadius * Math.sin(subAngle)
          }
        };
        
        nodes.push(subNode);
        connections.push({
          id: `conn_${categoryNode.id}_${subNode.id}`,
          from: categoryNode.id,
          to: subNode.id,
          type: 'strong'
        });
      });
    }
  });

  return {
    centralNode,
    nodes,
    connections
  };
};

const getSubCategories = (category, mode) => {
  const subCategories = {
    'Exploración': ['Investigación', 'Descubrimiento', 'Análisis'],
    'Innovación': ['Creatividad', 'Tecnología', 'Soluciones'],
    'Conexiones': ['Redes', 'Sinergias', 'Colaboración'],
    'Posibilidades': ['Oportunidades', 'Potencial', 'Futuro'],
    'Objetivos': ['Metas', 'KPIs', 'Resultados'],
    'Recursos': ['Humanos', 'Técnicos', 'Financieros'],
    'Proceso': ['Planificación', 'Ejecución', 'Evaluación'],
    'Resultados': ['Impacto', 'Beneficios', 'Medición'],
    'Conceptos': ['Definición', 'Teoría', 'Principios'],
    'Acciones': ['Pasos', 'Tareas', 'Actividades'],
    'Recursos': ['Herramientas', 'Materiales', 'Apoyo'],
    'Ideas': ['Brainstorming', 'Conceptos', 'Propuestas']
  };
  
  return subCategories[category] || ['Aspecto 1', 'Aspecto 2', 'Aspecto 3'];
};

const validateAndEnhanceMindMap = (mindMapData, centralIdea, mode) => {
  // Ensure required structure
  if (!mindMapData.centralNode) {
    mindMapData.centralNode = {
      id: 'central',
      content: centralIdea,
      type: 'central',
      tags: ['central'],
      position: { x: 400, y: 300 }
    };
  }
  
  if (!mindMapData.nodes) mindMapData.nodes = [];
  if (!mindMapData.connections) mindMapData.connections = [];
  
  // Add mode-specific tags
  mindMapData.nodes.forEach(node => {
    if (!node.tags) node.tags = [];
    node.tags.push(mode);
  });
  
  return mindMapData;
};

const analyzeImageForIdeas = async (imageBase64, context = 'creative_block') => {
  if (!openai) {
    // Fallback: Generate ideas without actual image analysis
    return generateFallbackImageAnalysis(context);
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview', // Use vision model if available
      messages: [
        {
          role: 'system',
          content: `You are a creative consultant and design expert. Analyze the uploaded image and generate creative ideas to help overcome creative blocks.

          Based on the image, provide:
          1. Visual analysis: What elements, colors, styles, and concepts do you see?
          2. Emotional impact: What mood or feeling does this project evoke?
          3. Creative opportunities: What are the untapped potentials?
          4. Specific actionable ideas: 4-6 concrete suggestions for improvement or evolution

          Return your response in this exact JSON format:
          {
            "analysis": {
              "detected_elements": ["element1", "element2"],
              "mood": "emotional_state",
              "style": "artistic_style",
              "suggestions": ["suggestion1", "suggestion2"]
            },
            "ideas": [
              {
                "title": "Idea Title",
                "description": "Detailed description",
                "category": "analysis|context|technique|evolution",
                "actionItems": ["action1", "action2", "action3"]
              }
            ]
          }`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and provide creative ideas to help overcome a creative block. The context is: ${context}. Focus on generating actionable, innovative suggestions.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      const analysisData = JSON.parse(content);
      return validateImageAnalysis(analysisData);
    } catch (parseError) {
      console.error('Failed to parse AI image analysis:', parseError);
      return generateFallbackImageAnalysis(context);
    }
  } catch (err) {
    console.error('Image analysis error:', err);
    return generateFallbackImageAnalysis(context);
  }
};

const generateFallbackImageAnalysis = (context) => {
  // Generate analysis without actual image processing
  const fallbackAnalysis = {
    analysis: {
      detected_elements: ["Proyecto visual", "Elementos creativos", "Componentes de diseño"],
      mood: "inspirador",
      style: "único y personal",
      suggestions: [
        "Explorar diferentes perspectivas del proyecto",
        "Experimentar con variaciones de color y forma",
        "Considerar el contexto de uso real",
        "Investigar tendencias actuales en el área"
      ]
    },
    ideas: [
      {
        title: "Análisis Visual Profundo",
        description: "Descompón los elementos visuales de tu proyecto y explora cómo cada uno contribuye al mensaje general",
        category: "análisis",
        actionItems: [
          "Identificar los 3 elementos visuales más importantes",
          "Analizar la paleta de colores y su impacto emocional",
          "Evaluar el balance y composición actual",
          "Considerar cómo cambiaría la percepción con modificaciones"
        ]
      },
      {
        title: "Recontextualización Creativa",
        description: "Imagina tu proyecto en un contexto completamente diferente y genera ideas a partir de esa nueva perspectiva",
        category: "contexto",
        actionItems: [
          "Aplicar tu concepto a una industria diferente",
          "Imaginar el uso en una cultura o época distinta",
          "Considerar cómo lo usarían diferentes grupos demográficos",
          "Explorar aplicaciones opuestas al uso original"
        ]
      },
      {
        title: "Híbrido de Estilos",
        description: "Combina tu estilo actual con otras disciplinas artísticas o de diseño para crear algo completamente nuevo",
        category: "técnica",
        actionItems: [
          "Investigar 3 estilos artísticos diferentes",
          "Crear versiones híbridas con tu proyecto",
          "Experimentar con técnicas de medios mixtos",
          "Documentar qué combinaciones funcionan mejor"
        ]
      },
      {
        title: "Evolución Escalable",
        description: "Piensa en cómo tu proyecto podría evolucionar desde su estado actual hasta versiones más complejas o simplificadas",
        category: "evolución",
        actionItems: [
          "Crear una versión minimalista del concepto",
          "Diseñar una versión expandida y elaborada",
          "Desarrollar una línea evolutiva con 5 etapas",
          "Identificar cuál versión es más efectiva para cada audiencia"
        ]
      },
      {
        title: "Interacción Humana",
        description: "Centra tu análisis en cómo las personas interactúan o podrían interactuar con tu proyecto",
        category: "contexto",
        actionItems: [
          "Mapear el journey del usuario actual",
          "Identificar puntos de fricción o mejora",
          "Diseñar 3 formas diferentes de interacción",
          "Crear prototipos de las mejores ideas"
        ]
      },
      {
        title: "Narrativa Visual",
        description: "Convierte tu proyecto en una historia visual que cuente un mensaje más profundo",
        category: "técnica",
        actionItems: [
          "Definir el mensaje principal que quieres comunicar",
          "Crear una secuencia visual de 3 imágenes",
          "Experimentar con metáforas visuales",
          "Testar la historia con diferentes audiencias"
        ]
      }
    ]
  };

  // Adjust based on context
  if (context === 'creative_block') {
    fallbackAnalysis.analysis.suggestions.push("Toma un descanso y vuelve con mente fresca");
    fallbackAnalysis.analysis.suggestions.push("Colabora con alguien para obtener perspectivas nuevas");
  }

  return fallbackAnalysis;
};

const validateImageAnalysis = (analysisData) => {
  // Ensure required structure
  if (!analysisData.analysis) {
    analysisData.analysis = {
      detected_elements: [],
      mood: "no determinado",
      style: "no identificado",
      suggestions: []
    };
  }
  
  if (!analysisData.ideas || !Array.isArray(analysisData.ideas)) {
    analysisData.ideas = [];
  }
  
  // Ensure each idea has required fields
  analysisData.ideas = analysisData.ideas.map(idea => ({
    title: idea.title || "Idea sin título",
    description: idea.description || "Sin descripción",
    category: idea.category || "general",
    actionItems: Array.isArray(idea.actionItems) ? idea.actionItems : []
  }));
  
  return analysisData;
};

module.exports = {
  generateCreativeQuestions,
  expandIdeaAI,
  detectCreativeMood,
  findIdeaConnections,
  generateCreativeExercise,
  generateMindMap,
  analyzeImageForIdeas
};
