# 🧠 LÓGICA Y FLUJOS DE USUARIO - Dashboard Optimizado

## Árbol de Decisiones

```
┌─────────────────────────────────────────────────────────┐
│  USUARIO ABRE LA APP                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ¿Tiene proyectos?    ¿Tiene proyectos?
        SI                   NO
        │                    │
        ├─────────┬──────────┤
        │         │          │
        ▼         ▼          ▼
    [Bienvenida con Greeting + CTA]
    
        │
        ├─ Ve: "Buenos días, Juan"
        ├─ Ve: "¿Qué vamos a crear hoy?"
        ├─ Ve: Botón Grande "✨ Capturar Idea"
        │
        ├─────────┬────────────────────┬──────────┐
        │         │                    │          │
        ▼         ▼                    ▼          ▼
     CON PROYECTOS            SIN PROYECTOS
         │                          │
         ├─ Proyecto Activo         ├─ Emoji animado (✨)
         │  (destacado)             │
         │  • Nombre + emoji        ├─ "Tu primer proyecto"
         │  • Ideas count           │  "te espera"
         │  • [Ver Ideas]           │
         │  • [Mapa Mental]         ├─ [Crear Primer Proyecto]
         │                          │
         ├─ Otros Proyectos         └─ O clickear botón primario
         │  (grid 3 col)            │
         │                          └──> Nueva modal proyecto
         ├─ Menú ⋮                      │
         │  • Flow Mode                 ├─ Input nombre
         │  • Estadísticas              │
         │  • Configuración             ├─ [Cancelar] [Crear]
         │  • Ayuda                     │
         │  • Salir                     └─> Vuelve a dashboard
         │                                  (ahora con proyecto)
         │
         └──────────────┬──────────────┬─────────────┐
                        │              │             │
                        ▼              ▼             ▼
                    CAPTURAR         VER IDEAS    VER MAPA
                      IDEA          (ProjectPage) (MindMap)
                      │
                    Modal
                    Captura
                    (imagen,
                     texto,
                     voz)
```

---

## Flujos Específicos de Usuario

### FLUJO 1: Usuario Nuevo Óptimo

```
1. APP LOAD
   └─ Estado: Sin proyectos
      UI: Greeting + Botón primario
      Estado vacío: Emoji + CTA

2. USUARIO VE:
   ├─ "Buenos días, Juan"
   ├─ "¿Qué vamos a crear hoy?"
   ├─ Emoji ✨ animado
   ├─ "Tu primer proyecto te espera"
   └─ Botón: "Crear Primer Proyecto"

3. CLICK OPCIONES:
   a) [✨ Capturar Idea]
      └─ Modal captura
         └─ No hay proyecto activo
            └─ Modal dice: "Crea un proyecto primero"
            
   b) [Crear Primer Proyecto]
      └─ Modal nuevo proyecto
         └─ Input: nombre
         └─ [Crear]
         └─ Dashboard refrescado
         └─ Ahora muestra: Proyecto activo + botón primario

4. CON PROYECTO CREADO:
   ├─ Ve su proyecto destacado
   ├─ Contador: "0 ideas"
   ├─ Sub-botones: "Ver Ideas", "Mapa"
   └─ Botón primario: "✨ Capturar Idea"

5. CAPTURA IDEA:
   ├─ Click en "✨ Capturar Idea"
   ├─ Modal CaptureButton abre
   ├─ Elige formato: Texto/Imagen/Voz
   ├─ Guarda en proyecto activo
   └─ Dashboard refrescado: "1 idea"
```

**Tiempo total:** 2-3 minutos (crear proyecto + capturar idea)

---

### FLUJO 2: Usuario Habitual

```
1. APP LOAD
   ├─ Estado: 7 proyectos existentes
   ├─ Proyecto activo: "Diseño de App"
   └─ Otros: Logo Design, Blog, Video, etc.

2. VE EN HEADER:
   ├─ "Buenas tardes, María"
   ├─ "¿Qué vamos a crear hoy?"
   ├─ [✨ Capturar Idea] ← Grande, destacado

3. PROYECTO ACTIVO (visible):
   ├─ 📱 Diseño de App
   ├─ 24 ideas
   ├─ +3 esta semana
   ├─ [Ver Ideas] [Mapa Mental]

4. DECIDE:
   
   OPCIÓN A: Capturar idea en proyecto activo
   ├─ Click [✨ Capturar Idea]
   ├─ Modal abre
   ├─ Captura en "Diseño de App"
   └─ Vuelve a dashboard
   
   OPCIÓN B: Ver proyecto activo
   ├─ Click [Ver Ideas]
   ├─ Va a ProjectPage
   ├─ Ve 24 ideas en lista
   ├─ Puede editar, marcar, etc.
   └─ Vuelve
   
   OPCIÓN C: Ver mapa mental
   ├─ Click [Mapa Mental]
   ├─ Entra a MindMapContainer
   ├─ Ve estructura visual
   └─ Vuelve
   
   OPCIÓN D: Cambiar proyecto
   ├─ Scroll down
   ├─ Ve "Otros Proyectos" (5 más)
   ├─ Click en uno (ej: Logo Design)
   ├─ Va a ese proyecto
   └─ Vuelve a dashboard con nuevo "activo"
   
   OPCIÓN E: Flow Mode
   ├─ Menú ⋮
   ├─ Click "Flow Mode"
   ├─ Entra sesión inmersiva
   ├─ Sin distracciones
   └─ Vuelve

5. CADA ACCIÓN:
   └─ Dashboard siempre en mismo estado
      (no cambia por sorpresa)
      (usuario sabe dónde volver)
```

**Tiempo típico:** 30 segundos para capturar idea

---

### FLUJO 3: Usuario que Revisa Estadísticas

```
1. APP LOAD
   └─ Estado normal

2. NECESITA: Ver métricas (actividad semanal, total ideas, etc.)

3. ACCIÓN:
   ├─ Click menú ⋮ (esquina arriba)
   └─ Ve opciones:
      • Flow Mode
      • Estadísticas ← Click aquí
      • Configuración
      • Ayuda
      • Salir

4. DESPUÉS DE CLICK:
   └─ Grid de 3 métricas aparece (con animación)
      ├─ Proyectos Totales: 7
      ├─ Ideas Capturadas: 84
      └─ Actividad Semanal: 12

5. PARA OCULTAR:
   ├─ Click menú ⋮ de nuevo
   ├─ Click "Estadísticas"
   └─ Grid desaparece (con animación)
```

**Beneficio:** Metrics no ocupan espacio por defecto, pero accesibles.

---

### FLUJO 4: Usuario Flow Mode

```
1. NECESITA: Sesión enfocada sin distracciones

2. ACCESO:
   ├─ Menú ⋮
   ├─ Click "Flow Mode"
   └─ Entra componente <FlowMode />

3. EN FLOW MODE:
   ├─ Pantalla limpia
   ├─ Solo captura de ideas
   ├─ Sin UI de dashboard
   ├─ Timer opcional
   └─ Contador de ideas capturadas

4. AL SALIR:
   ├─ Click "Salir Flow Mode"
   ├─ Vuelve a dashboard
   └─ Sigue igual que antes
      (dashboard no cambió)
```

**Nota:** Flow Mode es especializado, no interfiere con dashboard normal.

---

### FLUJO 5: Usuario que Cambia de Proyecto

```
1. DASHBOARD ABIERTO:
   ├─ Proyecto activo: "Diseño de App"
   ├─ Otros proyectos en grid

2. QUIERE CAMBIAR A "Logo Design":
   ├─ Scroll down (si es necesario)
   ├─ Ve grid de "Otros Proyectos"
   ├─ Click en "Logo Design"
   └─ Va a ProjectPage de ese proyecto

3. ALTERNATIVA - Mediante cards:
   ├─ En grid de "Otros Proyectos"
   ├─ Cada card muestra:
      • Emoji + Nombre
      • Contador de ideas
      • Últimas ideas (si hay)
   ├─ Hover effect (sombra + color)
   └─ Click → va al proyecto

4. DESPUÉS DE CAMBIO:
   └─ Usuario en ProjectPage de nuevo proyecto
      (Puede volver al dashboard
       para actualizar proyecto activo)
```

---

## Estados del Dashboard

### ESTADO 1: Inicial (Sin Proyectos)

```
VISIBLE:
├─ Header + Greeting
├─ Botón primario: "✨ Capturar Idea"
├─ Emoji ✨ animado
├─ Mensaje: "Tu primer proyecto te espera"
├─ CTA: "Crear Primer Proyecto"
└─ Menú ⋮ (con opciones básicas)

OCULTO:
├─ Proyecto activo (no existe)
├─ Grid de proyectos (vacío)
├─ Métricas (no aplicable)
├─ "Ver todos los proyectos"
└─ Sub-acciones de proyecto

COMPORTAMIENTO:
├─ Click [✨ Capturar Idea] → Modal dice "crea proyecto primero"
├─ Click [Crear Primer Proyecto] → Modal nuevo proyecto
└─ Al crear proyecto → Dashboard refrescado
```

### ESTADO 2: Con Proyecto Activo

```
VISIBLE:
├─ Header + Greeting
├─ Botón primario: "✨ Capturar Idea"
├─ Proyecto activo (destacado):
│  ├─ Emoji + nombre
│  ├─ Contador ideas
│  ├─ Actividad reciente
│  └─ [Ver Ideas] [Mapa]
├─ Grid "Otros Proyectos" (si hay más)
├─ Menú ⋮
└─ Botones flotantes (AI + Capture)

OCULTO:
├─ Emoji estado vacío
├─ Mensaje "primer proyecto"
├─ Métricas (a menos que usuario active)

COMPORTAMIENTO:
├─ Click [✨ Capturar Idea] → Captura en proyecto activo
├─ Click [Ver Ideas] → ProjectPage del activo
├─ Click proyecto en grid → Va a ese proyecto (actualiza "activo")
├─ Click menú → Estadísticas, Flow Mode, etc.
└─ Refrescado después de cada acción
```

### ESTADO 3: Múltiples Proyectos (Scroll)

```
SI PROYECTOS > 6:
├─ Grid muestra 6 primeros
├─ Al final: "[Ver X proyectos restantes →]"
├─ Click en "Ver..." → Página de todos (future feature)

SI PROYECTOS ≤ 6:
└─ Todos visibles en grid
```

### ESTADO 4: Metrics Visible

```
CUANDO:
└─ Usuario hace click en menú ⋮ → "Estadísticas"

VISIBLE:
├─ Grid 3 columnas (mobile: 1, tablet: 2, desktop: 3)
├─ Card 1: Proyectos Totales (azul)
├─ Card 2: Ideas Capturadas (verde)
├─ Card 3: Actividad Semanal (morado)

OCULTO:
└─ Con click en "Estadísticas" de nuevo

ANIMACIÓN:
└─ Enter: fade-in + slide-down (150ms)
└─ Exit: fade-out + slide-up (100ms)
```

---

## Estado de Proyecto Activo

### ¿Cómo se define?

```javascript
// Prioridad:
1. Campo "isActive" en proyecto (si está marcado)
2. Si no hay "isActive", toma el primero del array
3. Si no hay proyectos, es null (muestra estado vacío)

activeProject = projects.find(p => p.isActive) || projects[0] || null;
```

### ¿Cómo se actualiza?

```javascript
// Cuando usuario:
1. Crea nuevo proyecto → Automáticamente activo
2. Navega a otro proyecto → Puede que se actualice (API decision)
3. En ProjectPage → Marca como activo ese
4. Vuelve al dashboard → Muestra el activo actualizado
```

---

## Interacciones por Dispositivo

### MOBILE (390px)

```
TAP/TOUCH:
├─ Botón primario: 56px alto (fácil de tocar)
├─ Cards: Hover visible en tap (scale + shadow)
├─ Menú: Aparece al lado (no cubre contenido)
├─ Modal: Full-width con padding

SCROLL:
├─ Header: Sticky (no desaparece)
├─ Botón primario: En header (accesible siempre)
├─ Proyecto activo: Bajo header
├─ Otros proyectos: 1 columna
├─ Métricas: Stack vertical

ORIENTACIÓN:
├─ Portrait: Normal (descrito arriba)
├─ Landscape: Ajusta altura, grid 2 col
```

### TABLET (768px)

```
TAP/TOUCH:
├─ Todo similar a mobile
├─ Cards más anchas

LAYOUT:
├─ Header: Centrado, max-width respetado
├─ Grid: 2 columnas
├─ Métricas: 2-3 columnas

ESPACIADO:
├─ Padding aumentado
├─ Gaps mayores
├─ Mejor proporcional
```

### DESKTOP (1440px)

```
HOVER EFFECTS:
├─ Cards: Scale 1.02 + shadow
├─ Botones: Scale 1.02 + shadow
├─ Menú items: bg-gray-50

VISUAL:
├─ Header: Max-width 5xl (64rem)
├─ Botón primario: Con glow effect (semi-transparent blur)
├─ Grid: 3 columnas
├─ Métricas: 3 columnas horizontal

KEYBOARD:
├─ Tab: Orden lógico (header → botón → proyecto → grid → menu)
├─ Enter: Activa botones
├─ Escape: Cierra modals/menus
```

---

## Eventos Clave y Refrescos

### Cuando se refresca el Dashboard

```javascript
EVENTO                          RESULTADO
─────────────────────────────────────────────────
1. Usuario crea proyecto        ✓ Aparece en lista
                                ✓ Se vuelve activo
                                ✓ Contador a 0

2. Usuario captura idea         ✓ Contador aumenta
                                ✓ "actividad reciente" actualiza
                                ✓ Métricas se actualizan

3. Usuario vuelve de ProjectPage ✓ Contadores refrescados
                                ✓ Información actualizada

4. Usuario abre menú            ✓ Nada se refresca
   (solo interfaz)

5. Usuario entra/sale Flow Mode ✓ Vuelta a dashboard normal
                                ✓ Datos refrescados si hay cambios
```

---

## Validaciones y Estados de Error

### Modal Nuevo Proyecto

```javascript
VALIDACIÓN:
├─ Campo vacío → Botón "Crear" deshabilitado (disabled)
├─ 1+ caracteres → Botón habilitado
└─ Click → Valida en servidor

ESTADOS:
├─ Input vacío: Placeholder visible
├─ Input lleno: Botón activo
├─ Enviando: Loading state (opcional spinner)
├─ Error: Toast notificación
└─ Éxito: Modal cierra, dashboard refrescado
```

### Captura de Idea

```javascript
VALIDACIÓN:
├─ Idea vacía → Toast: "Añade contenido"
├─ Proyecto sin especificar → Toast: "Elige proyecto"
└─ Enviando → Loading, deshabilita botones

ESTADOS:
├─ Llenando: Normal
├─ Validando: Botón disabled + spinner
├─ Éxito: Toast + Modal cierra + Dashboard actualiza
└─ Error: Toast explicativo, permite reintentar
```

---

## Animaciones por Sección

```
HEADER:
├─ Enter: opacity 0→1, y: -20→0 (200ms)
├─ Sticky: Slide down on scroll-down, stay on scroll-up
└─ Greeting: fade-in (200ms)

BOTÓN PRIMARIO:
├─ Enter: opacity 0→1, y: -10→0 (200ms, delay 100ms)
├─ Hover: scale 1.0→1.02 (100ms spring)
├─ Tap: scale 1.02→0.98 (100ms)
└─ Disabled: opacity 0.5

PROYECTO ACTIVO:
├─ Enter: opacity 0→1, y: 20→0 (200ms, delay 100ms)
├─ Hover: shadow increase
└─ Exit: fade-out

OTROS PROYECTOS (STAGGERED):
├─ Enter: opacity 0→1, y: 20→0 (200ms, delay: 150ms + i*50ms)
├─ Hover: scale 1.0→1.02, y: 0→-4
└─ Exit: fade-out

MÉTRICAS:
├─ Enter: opacity 0→1, y: 10→0 (150ms)
├─ Exit: opacity 1→0, y: 0→-10 (100ms)
└─ Cards: Fade-in (150ms)

MODAL:
├─ Enter: opacity 0→1, scale 0.9→1 (200ms)
├─ Exit: opacity 1→0, scale 1→0.9 (150ms)
└─ Overlay: Fade-in/out (150ms)

MENÚ:
├─ Enter: opacity 0→1, y: -10→0 (100ms)
├─ Exit: opacity 1→0, y: 0→-10 (100ms)
└─ Items: Fade-in individual (no stagger)
```

---

## Casos Edge

### ¿Qué pasa si...?

```
USUARIO CREA PROYECTO MIENTRAS ESTÁ EN DASHBOARD
→ Modal → Crea → Dashboard refrescado
→ Nuevo proyecto aparece en grid
→ Se vuelve activo (reemplaza el anterior)

USUARIO ELIMINA PROYECTO (future feature)
→ Si era activo → Primer proyecto en lista se vuelve activo
→ Si no → Solo desaparece de grid
→ Dashboard refrescado

USUARIO EN PROYECTO ACTIVO, ALGUIEN ELIMINA ESE PROYECTO
→ Dashboard intenta refrescar
→ Detecta que no existe
→ Vuelve al primero disponible
→ Muestra aviso (toast): "Proyecto actualizado"

USUARIO SIN CONEXIÓN
→ Dashboard muestra cached data (service worker)
→ Acciones no guardadas hasta reconectar
→ Toast: "Conectando..." luego "Sincronizado"

USUARIO CON MUCHOS PROYECTOS (100+)
→ Muestra 6 primeros
→ Link: "Ver 94 proyectos restantes"
→ Future: Búsqueda y filtros
```

---

## Resumen de Decisiones UX

```
DECISIÓN                        RAZON
────────────────────────────────────────────────────
1 botón primario               Reduce decisiones
Proyecto activo destacado      Responde "¿dónde?"
Métricas colapsibles          Reduce ruido visual
Menú para opciones avanzadas   Limpia header
Estado vacío inspirador        Anima al usuario
Grid responsive                Accesible en todos lados
Sticky header                  Botón siempre accesible
Sub-acciones en proyecto       Contexto inmediato
Animaciones suaves            Retroalimentación
Focus visible                 Accesibilidad keyboard
```

---

Este documento evoluciona con el producto. Actualizar cuando cambien flujos.

