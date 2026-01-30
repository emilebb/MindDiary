# 💻 CÓDIGO & COMPONENTES - Guía de Implementación

Este documento proporciona snippets y referencias para mantener la consistencia en la implementación.

---

## Classes Tailwind Reutilizables

### Botón Primario
```jsx
className="px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
```

### Botón Secundario
```jsx
className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
```

### Card Base
```jsx
className="p-4 sm:p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow rounded-lg"
```

### Header Sticky
```jsx
className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
```

### Grid Responsivo
```jsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
```

### Métrica Card
```jsx
className="p-4 bg-white border-0 shadow-sm rounded-lg"
```

---

## Componentes Base

### Button Component (Mejorado)

```jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:bg-gray-100',
    creative: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg'
  };

  const baseClass = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClass}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

### Card Component (Mejorado)

```jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  onClick, 
  hover = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`
        bg-white 
        border-0 
        shadow-md 
        rounded-lg 
        transition-all
        ${hover ? 'cursor-pointer hover:shadow-lg hover:border-purple-400' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

---

## Patrones Comunes

### Header con Greeting

```jsx
<header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          ¿Qué vamos a crear hoy?
        </p>
      </div>
      
      {/* Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2.5 rounded-full hover:bg-gray-100 transition text-gray-600"
      >
        {showMenu ? <FiX size={20} /> : <FiMenu size={20} />}
      </motion.button>
    </div>
  </div>
</header>
```

### Proyecto Activo con Sub-acciones

```jsx
{activeProject && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="mb-8"
  >
    <Card className="p-4 sm:p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Project Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-4xl flex-shrink-0">{activeProject.emoji || '📁'}</div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeProject.name}
            </h2>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <FiEdit3 size={14} />
                {activeProject.ideaCount || 0} idea{activeProject.ideaCount !== 1 ? 's' : ''}
              </span>
              
              {activeProject.recentIdeas > 0 && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <FiTrendingUp size={14} />
                  +{activeProject.recentIdeas} esta semana
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sub-actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => navigate(`/project/${activeProject._id}`)}
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <FiEdit3 size={16} className="mr-1" />
            Ver Ideas
          </Button>
          
          <Button
            onClick={() => {
              setSelectedProject(activeProject);
              setShowMindMap(true);
            }}
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <FiGrid size={16} className="mr-1" />
            Mapa
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
)}
```

### Grid de Proyectos con Stagger

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {projects
    .filter(p => p._id !== activeProject?._id)
    .slice(0, 6)
    .map((project, index) => (
      <motion.div
        key={project._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + index * 0.05 }}
      >
        <button
          onClick={() => navigate(`/project/${project._id}`)}
          className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-2xl">{project.emoji || '📁'}</span>
            <FiChevronRight className="text-gray-400 group-hover:text-purple-600 transition" size={18} />
          </div>
          
          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
            {project.name}
          </h4>
          
          <p className="text-xs text-gray-500 mt-1">
            {project.ideaCount || 0} idea{project.ideaCount !== 1 ? 's' : ''}
          </p>
          
          {project.recentIdeas > 0 && (
            <p className="text-xs text-green-600 font-medium mt-2">
              +{project.recentIdeas} nuevas
            </p>
          )}
        </button>
      </motion.div>
    ))}
</div>
```

### Estado Vacío Hermoso

```jsx
{!loading && projects.length === 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 sm:py-20"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="text-6xl sm:text-7xl mb-6"
    >
      ✨
    </motion.div>
    
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
      Tu primer proyecto te espera
    </h2>
    
    <p className="text-base sm:text-lg text-gray-600 text-center mb-8 max-w-sm">
      Comienza capturando tus ideas más auténticas, sin filtro.
    </p>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowNewProject(true)}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700 transition"
    >
      <FiPlus size={18} />
      Crear Primer Proyecto
    </motion.button>
  </motion.div>
)}
```

### Modal Nuevo Proyecto

```jsx
<AnimatePresence>
  {showNewProject && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowNewProject(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Nuevo Proyecto</h3>
        
        <p className="text-sm text-gray-600 mb-6">
          Nómbralo según tu tema o área creativa
        </p>

        <form onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="p.ej. Diseño de App, Novela, Estrategia..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition mb-6"
            autoFocus
          />
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setShowNewProject(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={!newProjectName.trim()}
              className="flex-1"
            >
              Crear Proyecto
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### Menú Desplegable

```jsx
<AnimatePresence>
  {showMenu && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1 z-50"
    >
      <button
        onClick={() => {
          setFlowModeActive(true);
          setShowMenu(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
      >
        <FiClock size={16} /> Flow Mode
      </button>
      <button
        onClick={() => {
          setShowMetrics(!showMetrics);
          setShowMenu(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
      >
        <FiTrendingUp size={16} /> Estadísticas
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        onClick={() => setShowMenu(false)}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
      >
        <FiSettings size={16} /> Configuración
      </button>
      <button
        onClick={() => setShowMenu(false)}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
      >
        <FiHelpCircle size={16} /> Ayuda
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2 transition"
      >
        <FiLogOut size={16} /> Salir
      </button>
    </motion.div>
  )}
</AnimatePresence>
```

### Métricas (Colapsibles)

```jsx
{showMetrics && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
  >
    {/* Métrica 1 */}
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 font-medium">Proyectos Totales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiGrid className="text-blue-600" size={18} />
        </div>
      </div>
    </Card>

    {/* Métrica 2 */}
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 font-medium">Ideas Capturadas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalIdeas}</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FiEdit3 className="text-green-600" size={18} />
        </div>
      </div>
    </Card>

    {/* Métrica 3 */}
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 font-medium">Actividad Semanal</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recentIdeas}</p>
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <FiTrendingUp className="text-purple-600" size={18} />
        </div>
      </div>
    </Card>
  </motion.div>
)}
```

---

## Función Helper: getGreeting()

```jsx
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};
```

---

## Función Helper: getProjectStats()

```jsx
const getProjectStats = () => {
  return {
    totalProjects: projects.length,
    totalIdeas: projects.reduce((sum, p) => sum + (p.ideaCount || 0), 0),
    recentIdeas: projects.reduce((sum, p) => sum + (p.recentIdeas || 0), 0),
  };
};
```

---

## Customización de Tailwind (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Ya están en Tailwind, pero para documentación:
        purple: {
          600: '#9333ea',  // Primario
        },
        pink: {
          600: '#ec4899',  // Primario (gradiente)
        },
      },
      backgroundImage: {
        'gradient-creative': 'linear-gradient(to right, #9333ea, #ec4899)',
      },
      spacing: {
        'safe': '56px', // Botón primario height
      },
      maxWidth: {
        '5xl': '64rem', // Header max-width
      },
    },
  },
}
```

---

## Animaciones Reutilizables

```javascript
// Entrada estándar
const enterAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Con delay
const enterWithDelay = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, delay },
});

// Stagger children
const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Hover para cards
const cardHover = {
  whileHover: { scale: 1.02, y: -4 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', damping: 20, stiffness: 300 },
};
```

---

## Variables CSS (Alternativa a Tailwind)

Si prefieres CSS puro en ciertos lugares:

```css
:root {
  /* Colores */
  --color-primary: #9333ea;
  --color-primary-hover: #a844f6;
  --color-secondary: #ec4899;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-background: #ffffff;
  
  /* Tamaños */
  --size-button-primary: 56px;
  --size-button-secondary: 40px;
  
  /* Espaciado */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Radiuses */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

---

## Imports Necesarios en DashboardOptimized.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../utils/projectStore';
import { useAuthStore } from '../utils/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiLogOut, FiGrid, FiClock, FiEdit3, FiMenu, FiX,
  FiSettings, FiHelpCircle, FiTrendingUp, FiChevronRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import CaptureButton from '../components/capture/CaptureButton';
import AIAssistant from '../components/ai/AIAssistant';
import FlowMode from '../components/flow/FlowMode';
import MindMapContainerNew from '../components/mindmap/MindMapContainerNew';
import { useTheme } from '../contexts/ThemeContext';
```

---

## Testing - Snapshot de Componentes

Para Jest/Testing Library:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardOptimized from './DashboardOptimized';

describe('DashboardOptimized', () => {
  it('renders greeting correctly', () => {
    render(<DashboardOptimized />);
    expect(screen.getByText(/buenos días|buenas tardes|buenas noches/i)).toBeInTheDocument();
  });

  it('shows primary CTA button', () => {
    render(<DashboardOptimized />);
    expect(screen.getByText(/capturar idea/i)).toBeInTheDocument();
  });

  it('opens menu on hamburger click', () => {
    render(<DashboardOptimized />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByText(/flow mode/i)).toBeInTheDocument();
  });
});
```

---

Este documento es una referencia viva. Se debe actualizar cuando se agreguen nuevos patrones o cambios al diseño.

