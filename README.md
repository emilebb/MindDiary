# 🧠 Mind Diary - Aplicación Web Completa

## Visión General

Mind Diary es una aplicación MERN (MongoDB, Express, React, Node.js) para gestión inteligente de ideas creativas con asistente de IA.

## Estructura del Proyecto

```
mind-diary-app/
├── backend/                 # Servidor Express + MongoDB
│   ├── src/
│   │   ├── server.js       # Punto de entrada
│   │   ├── models/         # Esquemas MongoDB
│   │   ├── routes/         # Definición de rutas
│   │   ├── controllers/    # Lógica de negocios
│   │   ├── middleware/     # Middleware (auth, etc)
│   │   └── utils/          # Servicios (IA, etc)
│   ├── package.json
│   └── .env.example
│
└── frontend/               # Aplicación React
    ├── src/
    │   ├── pages/         # Páginas principales
    │   ├── components/    # Componentes reutilizables
    │   ├── utils/         # Stores Zustand, API client
    │   ├── styles/        # CSS/Tailwind
    │   ├── App.jsx        # Componente raíz
    │   └── index.jsx      # Punto de entrada
    ├── public/
    ├── package.json
    └── .env.example
```

## Instalación

### Backend

```bash
cd backend
npm install

# Crear archivo .env con:
# MONGODB_URI=mongodb://localhost:27017/mind-diary
# JWT_SECRET=tu_secreto_jwt
# OPENAI_API_KEY=tu_api_key_openai
# NODE_ENV=development
# PORT=5000

npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Crear archivo .env.local con:
# REACT_APP_API_URL=http://localhost:5000/api

npm start
```

## Características Implementadas

### ✅ Autenticación
- Registro y login con JWT
- Protección de rutas
- Perfil de usuario personalizable

### ✅ Gestión de Proyectos
- Crear, leer, actualizar, eliminar proyectos
- Organización por vistas (canvas, timeline, etc)
- Estadísticas de proyecto

### ✅ Captura de Ideas
- Múltiples tipos de captura (texto, voz, imagen, dibujo)
- Etiquetado automático
- Organización en lienzo

### ✅ Asistente IA
- Generar preguntas creativas personalizadas
- Expandir ideas en sub-conceptos
- Detectar humor/emoción
- Generar ejercicios de desbloqueo creativo
- Encontrar conexiones entre ideas

### ✅ Interfaz Moderna
- Diseño minimalista y responsive
- Animaciones suave (Framer Motion)
- Tema oscuro profesional
- Tailwind CSS

## Stack Tecnológico

### Backend
- **Node.js + Express** - Servidor web
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación
- **OpenAI API** - Asistencia de IA
- **bcryptjs** - Hash de contraseñas

### Frontend
- **React 18** - UI framework
- **React Router** - Navegación
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **React Icons** - Iconografía

## API Endpoints

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Projects
- `POST /api/projects` - Crear proyecto
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Ideas
- `POST /api/ideas` - Capturar idea
- `GET /api/ideas/project/:projectId` - Listar ideas
- `PUT /api/ideas/:id` - Actualizar idea
- `DELETE /api/ideas/:id` - Eliminar idea
- `POST /api/ideas/:id/expand` - Expandir idea

### IA
- `POST /api/ai/questions` - Generar preguntas
- `POST /api/ai/expand` - Expandir idea con IA
- `POST /api/ai/mood` - Detectar emoción
- `POST /api/ai/exercise` - Generar ejercicio creativo
- `POST /api/ai/connections` - Encontrar conexiones

## Características Futuras

1. **Colaboración en Tiempo Real**
   - WebSockets para colaboración viva
   - Permisos granulares
   - Histórico de cambios

2. **Más Vistas**
   - Mapa mental visual
   - Galería interactiva
   - Timeline de evolución

3. **Integraciones**
   - Notion, Obsidian, Google Drive
   - Slack, Discord
   - Exportación a PDF/Word

4. **Análisis Profundo**
   - Dashboard de creatividad
   - Patrones de pensamiento
   - Sugerencias personalizadas

5. **Generación Asistida**
   - Variaciones de ideas con IA
   - Síntesis automática
   - Plantillas dinámicas

## Uso de OpenAI

Mind Diary integra OpenAI GPT-4 para:
- Generar preguntas creativas contextualizadas
- Expandir ideas en conceptos relacionados
- Detectar el tono/emoción de las ideas
- Generar ejercicios creativos personalizados
- Encontrar conexiones entre ideas

**Nota**: Requiere clave API válida de OpenAI.

## Variables de Entorno

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/mind-diary
JWT_SECRET=tu_secreto_super_seguro
OPENAI_API_KEY=sk-...
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Desarrollo Local

1. **Asegúrate de tener MongoDB corriendo:**
   ```bash
   # En Windows con MongoDB Community
   net start MongoDB
   
   # O usa MongoDB Atlas (cloud)
   ```

2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. Abre http://localhost:3000

## Modelos de Datos

### User
- email, password, name
- avatar, creativeStyle
- preferredOrganization, settings

### Project
- userId, name, description
- color, emoji, viewMode
- tags, isActive, stats

### Idea
- projectId, userId, content
- type (text/voice/image/drawing)
- tags, color, emoji
- aiSuggestions, position, status

### CreativeBlock
- projectId, userId, blockType
- severity, description
- interventionSuggestions, resolved

## Contribuir

1. Fork el repo
2. Crea rama: `git checkout -b feature/mifeature`
3. Commit: `git commit -m 'Agrega mifeature'`
4. Push: `git push origin feature/mifeature`
5. Pull Request

## Licencia

MIT

## Autor

Mind Diary - Diseño de Producto + Desarrollo 2026

---

**¿Preguntas?** Revisa la documentación de producto en `MIND_DIARY_PRODUCT_DESIGN.md`
