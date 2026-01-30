import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCheck, FiSun, FiCpu, FiHeart, FiTarget, FiZap, FiEdit3, FiImage, FiMic } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const OnboardingFlowFixed = ({ onComplete, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    creativeStyle: '',
    primaryGoal: '',
    experience: '',
    name: ''
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Tu espacio para pensar en voz alta',
      subtitle: 'Mind Diary es tu aliada silenciosa en el viaje creativo',
      content: <WelcomeStep />,
      animation: 'fade'
    },
    {
      id: 'goal',
      title: '¿Qué te trae por aquí hoy?',
      subtitle: 'Cuéntame qué quieres crear o explorar',
      content: <GoalStep preferences={userPreferences} setPreferences={setUserPreferences} />,
      animation: 'slide'
    },
    {
      id: 'style',
      title: '¿Cómo eres creativamente?',
      subtitle: 'Conozcamos tu estilo para personalizar tu experiencia',
      content: <StyleStep preferences={userPreferences} setPreferences={setUserPreferences} />,
      animation: 'slide'
    },
    {
      id: 'first-action',
      title: '¡Comencemos a crear!',
      subtitle: 'Elige tu primera acción',
      content: <FirstActionStep onComplete={onComplete} preferences={userPreferences} />,
      animation: 'scale'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    onComplete(userPreferences);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index <= currentStep 
                    ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'w-2 bg-gray-700'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentStepData.title}
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              {currentStepData.subtitle}
            </p>
            
            {currentStepData.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <Button
            onClick={handlePrevious}
            variant="ghost"
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <FiArrowLeft /> Anterior
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            {currentStep + 1} de {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button onClick={handleComplete} variant="creative">
              <FiCheck /> Comenzar
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Siguiente <FiArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes del onboarding
const WelcomeStep = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
  >
    {[
      {
        icon: <FiCpu className="text-indigo-400" size={32} />,
        title: 'Orden Mental',
        description: 'Organiza tus ideas sin perder su esencia creativa'
      },
      {
        icon: <FiSun className="text-indigo-400" size={32} />,
        title: 'Libertad Creativa',
        description: 'Explora sin límites, transforma el caos en claridad'
      },
      {
        icon: <FiHeart className="text-pink-400" size={32} />,
        title: 'Acompañamiento Inteligente',
        description: 'IA que entiende tu proceso y te guía con empatía'
      }
    ].map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="text-center p-6"
      >
        <div className="mb-4">{feature.icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-300 text-sm">{feature.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

const GoalStep = ({ preferences, setPreferences }) => {
  const goals = [
    {
      id: 'personal',
      title: 'Proyectos Personales',
      description: 'Organiza tus ideas, metas y planes personales',
      icon: <FiTarget />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'professional',
      title: 'Trabajo Profesional',
      description: 'Gestiona proyectos laborales y carrera creativa',
      icon: <FiZap />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'academic',
      title: 'Estudios e Investigación',
      description: 'Organiza notas de clase, investigaciones y aprendizaje',
      icon: <FiEdit3 />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'creative',
      title: 'Proyectos Creativos',
      description: 'Arte, diseño, escritura y expresión artística',
      icon: <FiHeart />,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreferences({ ...preferences, primaryGoal: goal.id })}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-left
              ${preferences.primaryGoal === goal.id
                ? 'border-indigo-500 bg-gradient-to-br ' + goal.color + ' text-white'
                : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
              }
            `}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                preferences.primaryGoal === goal.id ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                <div className={`text-xl ${preferences.primaryGoal === goal.id ? 'text-white' : 'text-gray-300'}`}>
                  {goal.icon}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{goal.title}</h3>
                <p className="text-sm opacity-80">{goal.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const StyleStep = ({ preferences, setPreferences }) => {
  const styles = [
    {
      id: 'structured',
      title: 'Organizado y Metódico',
      description: 'Prefieres estructura clara, categorías y planes definidos',
      icon: <FiTarget />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'explorer',
      title: 'Explorador y Divergente',
      description: 'Te gusta experimentar, conectar ideas inesperadas',
      icon: <FiZap />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'visual',
      title: 'Visual y Artístico',
      description: 'Piensas en imágenes, colores y formas visuales',
      icon: <FiImage />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'verbal',
      title: 'Verbal y Conceptual',
      description: 'Expresas mejor con palabras, escritura y conceptos',
      icon: <FiEdit3 />,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreferences({ ...preferences, creativeStyle: style.id })}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-left
              ${preferences.creativeStyle === style.id
                ? 'border-indigo-500 bg-gradient-to-br ' + style.color + ' text-white'
                : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
              }
            `}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                preferences.creativeStyle === style.id ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                <div className={`text-xl ${preferences.creativeStyle === style.id ? 'text-white' : 'text-gray-300'}`}>
                  {style.icon}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{style.title}</h3>
                <p className="text-sm opacity-80">{style.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const FirstActionStep = ({ onComplete, preferences }) => {
  const actions = [
    {
      id: 'capture',
      title: 'Capturar una idea',
      description: 'Empieza con una idea rápida usando texto, voz o imagen',
      icon: <FiEdit3 />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'mindmap',
      title: 'Crear un mapa mental',
      description: 'Organiza visualmente tus pensamientos y conexiones',
      icon: <FiCpu />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'explore',
      title: 'Explorar el espacio',
      description: 'Conoce todas las herramientas disponibles',
      icon: <FiSun />,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const handleAction = (actionId) => {
    // Guardar preferencias y completar onboarding
    onComplete({
      ...preferences,
      firstAction: actionId,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">¡Listo para empezar!</h3>
        <p className="text-gray-300">Elige tu primera acción en Mind Diary</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction(action.id)}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-center
              border-gray-600 hover:border-indigo-500 bg-gray-700/50 hover:bg-gradient-to-br ${action.color} text-white hover:shadow-2xl
            `}
          >
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-xl flex items-center justify-center">
                <div className="text-2xl">{action.icon}</div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingFlowFixed;
