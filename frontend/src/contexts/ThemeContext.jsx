import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [customTheme, setCustomTheme] = useState(null);
  const [fontSize, setFontSize] = useState('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Temas predefinidos
  const themes = {
    dark: {
      name: 'Oscuro',
      colors: {
        background: 'from-gray-900 via-gray-800 to-black',
        surface: 'bg-gray-800',
        surfaceLight: 'bg-gray-700',
        surfaceDark: 'bg-gray-900',
        primary: 'from-indigo-500 to-purple-600',
        secondary: 'from-blue-500 to-cyan-600',
        accent: 'from-pink-500 to-purple-600',
        success: 'from-green-500 to-emerald-600',
        warning: 'from-yellow-500 to-orange-600',
        error: 'from-red-500 to-pink-600',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        border: 'border-gray-700',
        borderLight: 'border-gray-600'
      },
      shadows: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
      }
    },
    
    light: {
      name: 'Claro',
      colors: {
        background: 'from-gray-50 via-white to-gray-100',
        surface: 'bg-white',
        surfaceLight: 'bg-gray-50',
        surfaceDark: 'bg-gray-100',
        primary: 'from-indigo-600 to-purple-700',
        secondary: 'from-blue-600 to-cyan-700',
        accent: 'from-pink-600 to-purple-700',
        success: 'from-green-600 to-emerald-700',
        warning: 'from-yellow-600 to-orange-700',
        error: 'from-red-600 to-pink-700',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        border: 'border-gray-200',
        borderLight: 'border-gray-300'
      },
      shadows: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
      }
    },

    creative: {
      name: 'Creativo',
      colors: {
        background: 'from-purple-900 via-pink-800 to-indigo-900',
        surface: 'bg-purple-800/50',
        surfaceLight: 'bg-purple-700/50',
        surfaceDark: 'bg-purple-900/50',
        primary: 'from-pink-500 to-purple-600',
        secondary: 'from-yellow-500 to-orange-600',
        accent: 'from-green-500 to-teal-600',
        success: 'from-emerald-500 to-green-600',
        warning: 'from-orange-500 to-red-600',
        error: 'from-red-500 to-pink-600',
        text: 'text-white',
        textSecondary: 'text-pink-100',
        textMuted: 'text-pink-200',
        border: 'border-purple-600',
        borderLight: 'border-purple-500'
      },
      shadows: {
        sm: 'shadow-purple-500/20',
        md: 'shadow-purple-500/30',
        lg: 'shadow-purple-500/40',
        xl: 'shadow-purple-500/50'
      }
    },

    minimal: {
      name: 'Minimal',
      colors: {
        background: 'from-gray-100 to-white',
        surface: 'bg-white',
        surfaceLight: 'bg-gray-50',
        surfaceDark: 'bg-gray-100',
        primary: 'from-gray-700 to-gray-900',
        secondary: 'from-gray-600 to-gray-800',
        accent: 'from-gray-500 to-gray-700',
        success: 'from-gray-600 to-gray-800',
        warning: 'from-gray-600 to-gray-800',
        error: 'from-gray-600 to-gray-800',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        border: 'border-gray-200',
        borderLight: 'border-gray-300'
      },
      shadows: {
        sm: 'shadow-sm',
        md: 'shadow-sm',
        lg: 'shadow-md',
        xl: 'shadow-lg'
      }
    }
  };

  // Tamaños de fuente
  const fontSizes = {
    small: {
      text: 'text-sm',
      heading: 'text-lg',
      subheading: 'text-base'
    },
    medium: {
      text: 'text-base',
      heading: 'text-xl',
      subheading: 'text-lg'
    },
    large: {
      text: 'text-lg',
      heading: 'text-2xl',
      subheading: 'text-xl'
    },
    xlarge: {
      text: 'text-xl',
      heading: 'text-3xl',
      subheading: 'text-2xl'
    }
  };

  const currentTheme = customTheme || themes[theme];

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedTheme = localStorage.getItem('mind-diary-theme');
    const savedFontSize = localStorage.getItem('mind-diary-font-size');
    const savedAnimations = localStorage.getItem('mind-diary-animations');
    const savedHighContrast = localStorage.getItem('mind-diary-high-contrast');

    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
    if (savedFontSize && fontSizes[savedFontSize]) {
      setFontSize(savedFontSize);
    }
    if (savedAnimations !== null) {
      setAnimationsEnabled(savedAnimations === 'true');
    }
    if (savedHighContrast !== null) {
      setHighContrast(savedHighContrast === 'true');
    }
  }, []);

  // Guardar preferencias
  useEffect(() => {
    localStorage.setItem('mind-diary-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mind-diary-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('mind-diary-animations', animationsEnabled.toString());
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('mind-diary-high-contrast', highContrast.toString());
  }, [highContrast]);

  // Aplicar tema al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases de tema anteriores
    Object.keys(themes).forEach(themeName => {
      root.classList.remove(`theme-${themeName}`);
    });
    
    // Agregar clase del tema actual
    root.classList.add(`theme-${theme}`);
    
    // Aplicar tamaño de fuente
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
    
    // Aplicar otras preferencias
    root.classList.toggle('no-animations', !animationsEnabled);
    root.classList.toggle('high-contrast', highContrast);
    
    // Actualizar meta tags para tema móvil
    const themeColor = currentTheme.colors.primary.includes('indigo') ? '#6366F1' : 
                      currentTheme.colors.primary.includes('pink') ? '#EC4899' : '#000000';
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }, [theme, fontSize, animationsEnabled, highContrast, currentTheme]);

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
      setCustomTheme(null);
    }
  };

  const createCustomTheme = (themeData) => {
    setCustomTheme({
      name: themeData.name || 'Personalizado',
      colors: {
        ...themes.dark.colors,
        ...themeData.colors
      },
      shadows: {
        ...themes.dark.shadows,
        ...themeData.shadows
      }
    });
  };

  const resetToDefault = () => {
    setTheme('dark');
    setCustomTheme(null);
    setFontSize('medium');
    setAnimationsEnabled(true);
    setHighContrast(false);
  };

  const value = {
    // Estado actual
    theme,
    currentTheme,
    fontSize,
    animationsEnabled,
    highContrast,
    customTheme,
    
    // Temas disponibles
    themes,
    fontSizes,
    
    // Métodos
    changeTheme,
    createCustomTheme,
    resetToDefault,
    setFontSize,
    setAnimationsEnabled,
    setHighContrast,
    
    // Clases de utilidad
    getBackgroundClass: () => currentTheme.colors.background,
    getSurfaceClass: (variant = 'default') => {
      switch (variant) {
        case 'light': return currentTheme.colors.surfaceLight;
        case 'dark': return currentTheme.colors.surfaceDark;
        default: return currentTheme.colors.surface;
      }
    },
    getTextClass: (variant = 'default') => {
      switch (variant) {
        case 'secondary': return currentTheme.colors.textSecondary;
        case 'muted': return currentTheme.colors.textMuted;
        default: return currentTheme.colors.text;
      }
    },
    getBorderClass: (variant = 'default') => {
      switch (variant) {
        case 'light': return currentTheme.colors.borderLight;
        default: return currentTheme.colors.border;
      }
    },
    getShadowClass: (size = 'md') => currentTheme.shadows[size],
    getFontClass: (type = 'text') => fontSizes[fontSize][type]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
