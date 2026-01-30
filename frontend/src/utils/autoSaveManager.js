// Auto-Save Manager para Mind Diary
import React from 'react';

class AutoSaveManager {
  constructor() {
    this.saveQueue = new Map();
    this.isOnline = navigator.onLine;
    this.saveInterval = 30000; // 30 segundos
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 segundos
    
    this.init();
  }

  init() {
    // Configurar listeners de conectividad
    this.setupConnectivityListeners();
    
    // Iniciar auto-save periódico
    this.startPeriodicSave();
    
    // Configurar save antes de cerrar
    this.setupBeforeUnload();
    
    // Recuperar datos no guardados al iniciar
    this.recoverUnsavedData();
  }

  setupConnectivityListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Offline mode activated');
    });
  }

  startPeriodicSave() {
    setInterval(() => {
      this.processQueue();
    }, this.saveInterval);
  }

  setupBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
      if (this.saveQueue.size > 0) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
      }
    });

    // También guardar cuando la página se oculta
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.processQueue();
      }
    });
  }

  // Agregar item a la cola de guardado
  queueSave(key, data, options = {}) {
    const saveItem = {
      key,
      data,
      timestamp: Date.now(),
      retries: 0,
      priority: options.priority || 'normal', // 'high', 'normal', 'low'
      endpoint: options.endpoint,
      method: options.method || 'POST'
    };

    this.saveQueue.set(key, saveItem);

    // Guardar inmediatamente en localStorage como backup
    this.saveToLocalStorage(key, saveItem);

    // Si es alta prioridad, intentar guardar ahora
    if (options.priority === 'high') {
      this.processQueue();
    }

    return new Promise((resolve, reject) => {
      saveItem.resolve = resolve;
      saveItem.reject = reject;
    });
  }

  // Procesar la cola de guardado
  async processQueue() {
    if (!this.isOnline) {
      console.log('Offline: Skipping save queue processing');
      return;
    }

    const items = Array.from(this.saveQueue.values());
    
    // Ordenar por prioridad
    items.sort((a, b) => {
      const priorities = { high: 3, normal: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    for (const item of items) {
      try {
        await this.saveItem(item);
        this.saveQueue.delete(item.key);
      } catch (error) {
        console.error(`Failed to save ${item.key}:`, error);
        item.retries++;
        
        if (item.retries >= this.maxRetries) {
          console.error(`Max retries reached for ${item.key}`);
          if (item.reject) {
            item.reject(error);
          }
          this.saveQueue.delete(item.key);
        } else {
          // Reintentar después de un delay
          setTimeout(() => {
            this.saveQueue.set(item.key, item);
          }, this.retryDelay * item.retries);
        }
      }
    }
  }

  // Guardar item individual
  async saveItem(item) {
    console.log(`Saving ${item.key}...`);
    
    if (item.endpoint) {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(item.data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Eliminar del localStorage si se guardó exitosamente
      this.removeFromLocalStorage(item.key);
      
      if (item.resolve) {
        item.resolve(result);
      }
      
      return result;
    } else {
      // Guardar solo en localStorage
      this.saveToLocalStorage(item.key, item);
      
      if (item.resolve) {
        item.resolve(item.data);
      }
      
      return item.data;
    }
  }

  // Guardar en localStorage
  saveToLocalStorage(key, item) {
    try {
      const storageKey = `autosave_${key}`;
      const storageData = {
        ...item,
        savedAt: Date.now()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(storageData));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }

  // Remover de localStorage
  removeFromLocalStorage(key) {
    try {
      const storageKey = `autosave_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  // Recuperar datos no guardados
  recoverUnsavedData() {
    const keys = Object.keys(localStorage);
    const unsavedData = {};

    keys.forEach(key => {
      if (key.startsWith('autosave_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const originalKey = key.replace('autosave_', '');
          unsavedData[originalKey] = data;
          
          // Re-agregar a la cola para procesar
          this.saveQueue.set(originalKey, data);
        } catch (error) {
          console.error(`Failed to recover ${key}:`, error);
          localStorage.removeItem(key);
        }
      }
    });

    if (Object.keys(unsavedData).length > 0) {
      console.log('Recovered unsaved data:', Object.keys(unsavedData));
      
      // Notificar a la aplicación sobre los datos recuperados
      window.dispatchEvent(new CustomEvent('unsavedDataRecovered', {
        detail: unsavedData
      }));
    }

    return unsavedData;
  }

  // Forzar guardado de todo
  async forceSaveAll() {
    console.log('Force saving all queued items...');
    await this.processQueue();
  }

  // Limpiar cola
  clearQueue() {
    this.saveQueue.clear();
  }

  // Obtener estado de la cola
  getQueueStatus() {
    return {
      size: this.saveQueue.size,
      isOnline: this.isOnline,
      items: Array.from(this.saveQueue.keys())
    };
  }

  // Métodos de conveniencia para diferentes tipos de datos
  saveProject(projectId, projectData) {
    return this.queueSave(`project_${projectId}`, projectData, {
      endpoint: `/api/projects/${projectId}`,
      method: 'PUT',
      priority: 'high'
    });
  }

  saveIdea(ideaId, ideaData) {
    return this.queueSave(`idea_${ideaId}`, ideaData, {
      endpoint: `/api/ideas/${ideaId}`,
      method: 'PUT',
      priority: 'normal'
    });
  }

  saveMindMap(projectId, mindMapData) {
    return this.queueSave(`mindmap_${projectId}`, mindMapData, {
      endpoint: `/api/projects/${projectId}/mindmap`,
      method: 'PUT',
      priority: 'high'
    });
  }

  saveUserPreferences(preferences) {
    return this.queueSave('user_preferences', preferences, {
      endpoint: '/api/user/preferences',
      method: 'PUT',
      priority: 'low'
    });
  }

  saveFlowSession(sessionData) {
    return this.queueSave(`flow_session_${sessionData.userId}`, sessionData, {
      // Solo guardar en localStorage para sesiones de flow
      priority: 'normal'
    });
  }
}

// Instancia singleton
export const autoSaveManager = new AutoSaveManager();

// Hook de React para usar el auto-save manager
export const useAutoSave = () => {
  const [queueStatus, setQueueStatus] = React.useState(autoSaveManager.getQueueStatus());

  React.useEffect(() => {
    const updateStatus = () => setQueueStatus(autoSaveManager.getQueueStatus());
    
    const interval = setInterval(updateStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    queueStatus,
    saveProject: autoSaveManager.saveProject.bind(autoSaveManager),
    saveIdea: autoSaveManager.saveIdea.bind(autoSaveManager),
    saveMindMap: autoSaveManager.saveMindMap.bind(autoSaveManager),
    saveUserPreferences: autoSaveManager.saveUserPreferences.bind(autoSaveManager),
    saveFlowSession: autoSaveManager.saveFlowSession.bind(autoSaveManager),
    forceSaveAll: autoSaveManager.forceSaveAll.bind(autoSaveManager),
    clearQueue: autoSaveManager.clearQueue.bind(autoSaveManager)
  };
};

export default autoSaveManager;
