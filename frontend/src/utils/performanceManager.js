// Performance Manager para Mind Diary
import React from 'react';

class PerformanceManager {
  constructor() {
    this.isLowPowerMode = false;
    this.isBackgroundMode = false;
    this.memoryUsage = 0;
    this.lastCleanup = Date.now();
    this.observers = [];
    
    this.init();
  }

  init() {
    // Detectar capacidades del dispositivo
    this.detectDeviceCapabilities();
    
    // Configurar observers de rendimiento
    this.setupPerformanceObservers();
    
    // Iniciar monitoreo
    this.startMonitoring();
    
    // Configurar listeners de visibilidad
    this.setupVisibilityListeners();
  }

  detectDeviceCapabilities() {
    // Detectar batería
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.isLowPowerMode = battery.level < 0.2;
        battery.addEventListener('levelchange', () => {
          this.isLowPowerMode = battery.level < 0.2;
          this.notifyModeChange();
        });
      });
    }

    // Detectar memoria (si está disponible)
    if ('memory' in performance) {
      this.memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
    }

    // Detectar conexión
    if ('connection' in navigator) {
      this.connectionType = navigator.connection.effectiveType;
    }
  }

  setupPerformanceObservers() {
    // Observer de rendimiento
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });
      
      perfObserver.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }

    // Observer de intersección para lazy loading
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.handleElementVisible(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  setupVisibilityListeners() {
    document.addEventListener('visibilitychange', () => {
      this.isBackgroundMode = document.hidden;
      this.notifyModeChange();
    });

    // Detectar cuando la pestaña no está en foco
    window.addEventListener('blur', () => {
      this.isBackgroundMode = true;
      this.notifyModeChange();
    });

    window.addEventListener('focus', () => {
      this.isBackgroundMode = false;
      this.notifyModeChange();
    });
  }

  startMonitoring() {
    // Monitorear uso de memoria cada 30 segundos
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);

    // Limpiar caché cada 5 minutos
    setInterval(() => {
      this.performCleanup();
    }, 300000);
  }

  checkMemoryUsage() {
    if ('memory' in performance) {
      const usage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      this.memoryUsage = usage;

      if (usage > 0.8) {
        console.warn('High memory usage detected:', usage);
        this.performAggressiveCleanup();
      }
    }
  }

  performCleanup() {
    const now = Date.now();
    if (now - this.lastCleanup < 60000) return; // No limpiar más de una vez por minuto

    console.log('Performing routine cleanup...');
    
    // Limpiar localStorage antiguo
    this.cleanupLocalStorage();
    
    // Limpiar caché de imágenes
    this.cleanupImageCache();
    
    // Notificar a los componentes para que limpien
    this.notifyCleanup();
    
    this.lastCleanup = now;
  }

  performAggressiveCleanup() {
    console.log('Performing aggressive cleanup...');
    
    // Limpiar todo el localStorage excepto datos críticos
    this.aggressiveLocalStorageCleanup();
    
    // Forzar garbage collection si está disponible
    if (window.gc) {
      window.gc();
    }
    
    this.notifyAggressiveCleanup();
  }

  cleanupLocalStorage() {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

    keys.forEach(key => {
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        try {
          const item = localStorage.getItem(key);
          const data = JSON.parse(item);
          
          if (data.timestamp && (now - data.timestamp > maxAge)) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Si no se puede parsear, remover
          localStorage.removeItem(key);
        }
      }
    });
  }

  aggressiveLocalStorageCleanup() {
    const keys = Object.keys(localStorage);
    const criticalKeys = ['token', 'userPreferences', 'onboardingCompleted'];
    
    keys.forEach(key => {
      if (!criticalKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  cleanupImageCache() {
    // Limpiar URLs de objetos creados para imágenes
    if (this.objectUrls) {
      this.objectUrls.forEach(url => URL.revokeObjectURL(url));
      this.objectUrls = [];
    }
  }

  handlePerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'measure':
        if (entry.duration > 100) {
          console.warn('Slow operation detected:', entry.name, entry.duration + 'ms');
        }
        break;
        
      case 'paint':
        if (entry.name === 'first-contentful-paint' && entry.startTime > 3000) {
          console.warn('Slow first paint:', entry.startTime + 'ms');
        }
        break;
    }
  }

  handleElementVisible(element) {
    // Notificar al elemento que es visible para lazy loading
    if (element.dataset.lazyLoad) {
      element.dispatchEvent(new CustomEvent('lazyLoad'));
    }
  }

  // Métodos públicos
  shouldReduceMotion() {
    return this.isLowPowerMode || this.isBackgroundMode;
  }

  shouldReduceQuality() {
    return this.isLowPowerMode || this.connectionType === 'slow-2g' || this.connectionType === '2g';
  }

  shouldDisableAnimations() {
    return this.isLowPowerMode || this.isBackgroundMode;
  }

  getOptimalDebounceDelay() {
    if (this.isLowPowerMode) return 300;
    if (this.isBackgroundMode) return 500;
    return 150;
  }

  registerForVisibilityUpdates(element) {
    this.intersectionObserver.observe(element);
  }

  unregisterForVisibilityUpdates(element) {
    this.intersectionObserver.unobserve(element);
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  unsubscribe(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  notifyModeChange() {
    this.observers.forEach(callback => {
      callback({
        type: 'modeChange',
        isLowPowerMode: this.isLowPowerMode,
        isBackgroundMode: this.isBackgroundMode,
        memoryUsage: this.memoryUsage
      });
    });
  }

  notifyCleanup() {
    this.observers.forEach(callback => {
      callback({
        type: 'cleanup',
        aggressive: false
      });
    });
  }

  notifyAggressiveCleanup() {
    this.observers.forEach(callback => {
      callback({
        type: 'cleanup',
        aggressive: true
      });
    });
  }

  // Utilidades para componentes
  createOptimizedDebounce(func, delay) {
    const optimalDelay = delay || this.getOptimalDebounceDelay();
    let timeoutId;
    
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), optimalDelay);
    };
  }

  createOptimizedThrottle(func, limit) {
    const optimalLimit = limit || (this.isLowPowerMode ? 200 : 100);
    let inThrottle;
    
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, optimalLimit);
      }
    };
  }

  // Métricas
  getMetrics() {
    return {
      isLowPowerMode: this.isLowPowerMode,
      isBackgroundMode: this.isBackgroundMode,
      memoryUsage: this.memoryUsage,
      connectionType: this.connectionType,
      lastCleanup: this.lastCleanup
    };
  }
}

// Instancia singleton
export const performanceManager = new PerformanceManager();

// Hook de React para usar el performance manager
export const usePerformanceManager = () => {
  const [metrics, setMetrics] = React.useState(performanceManager.getMetrics());

  React.useEffect(() => {
    const updateMetrics = () => setMetrics(performanceManager.getMetrics());
    
    performanceManager.subscribe(updateMetrics);
    
    return () => {
      performanceManager.unsubscribe(updateMetrics);
    };
  }, []);

  return {
    metrics,
    shouldReduceMotion: performanceManager.shouldReduceMotion(),
    shouldReduceQuality: performanceManager.shouldReduceQuality(),
    shouldDisableAnimations: performanceManager.shouldDisableAnimations(),
    createDebounce: performanceManager.createOptimizedDebounce.bind(performanceManager),
    createThrottle: performanceManager.createOptimizedThrottle.bind(performanceManager),
    registerForVisibility: performanceManager.registerForVisibilityUpdates.bind(performanceManager),
    unregisterForVisibility: performanceManager.unregisterForVisibilityUpdates.bind(performanceManager)
  };
};

export default performanceManager;
