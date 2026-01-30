# Setup Guide - Mind Diary

## Requisitos Previos

- Node.js v18+
- npm o yarn
- MongoDB local o cuenta MongoDB Atlas
- Clave OpenAI API (para IA)

## Paso 1: Configurar MongoDB

### Opción A: MongoDB Local
```bash
# Windows
1. Descarga MongoDB Community: https://www.mongodb.com/try/download/community
2. Instala y selecciona "Install as a Service"
3. Inicia el servicio: net start MongoDB
```

### Opción B: MongoDB Atlas (Cloud)
```bash
1. Crea cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Obtén connection string: mongodb+srv://user:pass@cluster.mongodb.net/mind-diary
```

## Paso 2: Configurar Variables de Entorno

### Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tus valores:
```

**Obtener OpenAI API Key:**
1. Ve a https://platform.openai.com
2. Crea una cuenta (o login)
3. Ve a API Keys → Create new secret key
4. Copia la key y pégala en .env

### Frontend
```bash
cd frontend
cp .env.example .env.local
```

## Paso 3: Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Paso 4: Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Escucha en http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Se abre en http://localhost:3000
```

## Verificación

- ✅ Backend: http://localhost:5000/api/health
- ✅ Frontend: http://localhost:3000
- ✅ Puedes registrarte y crear proyectos

## Troubleshooting

### "Cannot connect to MongoDB"
- Verifica que MongoDB está corriendo: `mongosh` (para Atlas)
- Revisa MONGODB_URI en .env

### "OpenAI API error"
- Verifica que tu API key es correcta
- Revisa que tienes créditos en tu cuenta OpenAI

### "CORS error"
- Asegúrate que FRONTEND_URL en backend .env es correcto
- Verifica que REACT_APP_API_URL en frontend .env.local es correcto

### "npm install falla"
- Limpia cache: `npm cache clean --force`
- Elimina node_modules: `rm -rf node_modules`
- Vuelve a intentar

## Estructura de Carpetas Rápida

```
backend/
  ├── server.js          ← Punto de entrada
  ├── models/            ← Esquemas de BD
  ├── controllers/       ← Lógica
  ├── routes/            ← Rutas API
  └── utils/aiService.js ← Integración OpenAI

frontend/
  ├── App.jsx            ← App principal
  ├── pages/             ← Login, Dashboard, Proyecto
  ├── utils/             ← Zustand stores, API client
  └── styles/            ← Tailwind CSS
```

## Próximos Pasos

1. ✅ Registra un usuario
2. ✅ Crea un proyecto
3. ✅ Captura una idea
4. ✅ Prueba "Expandir" (IA)
5. ✅ Explora todas las características

## Desarrollo

- Usa `npm run dev` en backend para hot-reload
- React ya tiene fast refresh incluido
- Revisa consola del navegador para errores frontend
- Revisa terminal backend para errores servidor

## Deployment

### Backend (Vercel/Railway)
```bash
# Crea railway.json o vercel.json
# Conecta tu repo
# Configura variables de entorno
# Deploy automático
```

### Frontend (Vercel/Netlify)
```bash
# Vercel: npm run build && vercel
# Netlify: npm run build && netlify deploy
```

---

**¿Necesitas ayuda?** Revisa README.md en la raíz del proyecto
