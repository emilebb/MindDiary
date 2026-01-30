import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPalette, FiSun, FiMoon, FiZap, FiMinimize, FiCheck, FiRotateCcw } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { Card } from './Card';

export const ThemeSelector = ({ className = '' }) => {
  const { 
    theme, 
    currentTheme, 
    themes, 
    fontSizes, 
    fontSize, 
    animationsEnabled, 
    highContrast,
    changeTheme, 
    setFontSize, 
    setAnimationsEnabled, 
    setHighContrast,
    resetToDefault 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');

  const themeIcons = {
    dark: <FiMoon />,
    light: <FiSun />,
    creative: <FiPalette />,
    minimal: <FiMinimize />
  };

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón del selector */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
      >
        <FiPalette size={20} />
      </motion.button>

      {/* Panel del selector */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-12 right-0 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Personalización</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'themes', label: 'Temas' },
                { id: 'typography', label: 'Texto' },
                { id: 'accessibility', label: 'Accesibilidad' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {activeTab === 'themes' && (
                <div className="space-y-3">
                  {Object.entries(themes).map(([themeName, themeData]) => (
                    <motion.button
                      key={themeName}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(themeName)}
                      className={`
                        w-full p-3 rounded-lg border-2 transition-all duration-200
                        ${theme === themeName
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {themeIcons[themeName]}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-white">
                              {themeData.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {themeName === 'dark' && 'Clásico oscuro'}
                              {themeName === 'light' && 'Limpio y brillante'}
                              {themeName === 'creative' && 'Colorido y vibrante'}
                              {themeName === 'minimal' && 'Simple y elegante'}
                            </div>
                          </div>
                        </div>
                        {theme === themeName && (
                          <FiCheck className="text-purple-400" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {activeTab === 'typography' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Tamaño de fuente
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(fontSizes).map(([sizeName, sizeData]) => (
                        <motion.button
                          key={sizeName}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFontSize(sizeName)}
                          className={`
                            p-3 rounded-lg border-2 transition-all duration-200
                            ${fontSize === sizeName
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                            }
                          `}
                        >
                          <div className="text-white">
                            <div className={`font-medium ${sizeData.text}`}>
                              {sizeName === 'small' && 'Pequeño'}
                              {sizeName === 'medium' && 'Mediano'}
                              {sizeName === 'large' && 'Grande'}
                              {sizeName === 'xlarge' && 'Extra Grande'}
                            </div>
                            <div className={`text-xs ${sizeData.textMuted} mt-1`}>
                              Ejemplo de texto
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Animaciones</div>
                      <div className="text-sm text-gray-400">
                        Reducir animaciones para mejor rendimiento
                      </div>
                    </div>
                    <button
                      onClick={() => setAnimationsEnabled(!animationsEnabled)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${animationsEnabled ? 'bg-purple-600' : 'bg-gray-600'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${animationsEnabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Alto contraste</div>
                      <div className="text-sm text-gray-400">
                        Mejorar legibilidad con mayor contraste
                      </div>
                    </div>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${highContrast ? 'bg-purple-600' : 'bg-gray-600'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${highContrast ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              <Button
                onClick={resetToDefault}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <FiRotateCcw /> Restablecer valores predeterminados
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
