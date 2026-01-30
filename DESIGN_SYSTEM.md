# 🎨 DESIGN SYSTEM - Mind Diary Dashboard

## Filosofía de Diseño

**Mind Diary** es una aplicación que combina:
- **Orden** (estructura clara, jerarquía visual)
- **Libertad Creativa** (sin restricciones en ideas)
- **Calma** (interfaz minimalista, pocas decisiones)

---

## 📐 Arquitectura de Jerarquía Visual

### Niveles de Prioridad

```
┌─────────────────────────────────────────────────────┐
│ NIVEL 1: ACCIÓN PRIMARIA (Una por pantalla)         │
│ Ejemplo: "✨ Capturar Idea"                         │
│ → Gradiente Purple→Pink, tamaño 56px+, sombra      │
│ → Usuario debe verlo en 0.5 segundos               │
│ → Responde: "¿Qué hago primero?"                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NIVEL 2: CONTEXTO SECUNDARIO                         │
│ Ejemplo: Proyecto Activo + sub-botones             │
│ → Blanco con sombra suave, border gris             │
│ → Responde: "¿Dónde están mis ideas?"              │
│ → 2-3 sub-acciones máximo                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NIVEL 3: NAVEGACIÓN/EXPLORACIÓN                     │
│ Ejemplo: Grid de proyectos                          │
│ → Blanco con hover effect (sombra + border morado) │
│ → Responde: "¿Qué otros proyectos tengo?"          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NIVEL 4: INFORMACIÓN/CONTEXTO                       │
│ Ejemplo: Métricas                                  │
│ → Silencioso (gris, pequeño)                       │
│ → Colapsible (no ocupa espacio por defecto)        │
│ → Solo informativo                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NIVEL 5: ACCIONES AVANZADAS (Ocultas)              │
│ Ejemplo: Settings, Flow Mode, Help                 │
│ → En menú desplegable (⋮)                          │
│ → Segundo click necesario                          │
│ → No compite con acciones principales              │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Decisiones Clave de UX

### 1. Una Acción Primaria Por Pantalla

**Regla:** El usuario debe entender qué hacer en 3 segundos sin leer.

✅ **Correcto:**
- Dashboard → "✨ Capturar Idea" (botón grande, centro)
- Proyecto → "✍️ Nueva Idea" o "Guardar" (según contexto)

❌ **Incorrecto:**
- 5 botones de igual tamaño/color
- Acciones compitiendo en el mismo nivel
- Sin énfasis visual claro

### 2. Jerarquía de Color

```
COLOR PRIMARIO:      Purple → Pink gradient
                     Uso: Acción principal, CTA importante
                     RGB: Purple (168, 85, 247) → Pink (236, 72, 153)
                     Efecto: Confianza, creatividad, energía

COLOR NEUTRO ACTIVO: Blanco/Gris 900
                     Uso: Texto, contenido, estructura
                     Contraste: AA (accesible)

COLOR SECUNDARIO:    Gris 600
                     Uso: Subtítulos, timestamps, labels
                     Contraste: AA mínimo

COLOR INFORMATIVO:   Gris 100-200
                     Uso: Backgrounds, borders, separadores
                     Propósito: No distrae, proporciona estructura

COLORES SATÉLITE:    Azul (info), Verde (éxito), Rojo (alerta)
                     Uso: Métricas, badges, estados especiales
                     Tamaño: Pequeño (no compite)
```

### 3. Espaciado y Proporción

```
Botón Primario:        56px (mobile) | 64px (desktop)
Sub-botón:             40px
Card/Container:        padding 16-24px
Sección Gap:           spacing 32-48px
Métrica/Texto Small:   12-14px
Título Primario:       28-32px
Subtítulo:             16-18px
```

### 4. Eliminación de Decisiones

**Antes:**
- CaptureButton (flotante, confunde)
- AIAssistant (flotante, distrae)
- Plus en header + Plus en footer = ¿cuál uso?
- Flow Mode, Settings, Help dispersos

**Después:**
- Una entrada a "Capturar Idea" (botón primario)
- IA integrada como asistente (no como botón inicial)
- Acciones avanzadas en menú (⋮)
- Flow Mode como "sesión inmersiva" (acceso en menú)

---

## 📱 Layout Responsivo

### Mobile (< 640px)
```
Header:     Full width, sticky
Logo:       Solo nombre
Greeting:   1 línea
Button CTA: Full width (stretch)
Projects:   Grid 1 columna
Metrics:    Stack vertical
Menu:       Bottom/Top right (no sidebar)
```

### Tablet (640px - 1024px)
```
Header:     Max-width 5xl
Button CTA: Centrado, ancho controlado
Projects:   Grid 2 columnas
Metrics:    Stack 2-3 columnas
```

### Desktop (> 1024px)
```
Header:     Max-width 5xl
Button CTA: Centrado con glow effect
Projects:   Grid 3 columnas
Metrics:    Stack 3 columnas (siempre visible si activo)
Sidebar:    Opcional (roadmap futuro)
```

---

## 🗣️ Microcopy Guidelines

### Tono de Voz
- **Amigable:** No formal, no robótico
- **Orientador:** Ayuda sin obligar
- **Breve:** 1-2 frases máximo
- **Tranquilizador:** Evita "error", usa "vamos a..."

### Ejemplos por Sección

#### Bienvenida
```
Buenos días, {nombre}
¿Qué vamos a crear hoy?

→ Orientador, personal, optimista
```

#### Estado Vacío
```
✨ Tu primer proyecto te espera
Comienza capturando tus ideas más auténticas, sin filtro.
[Crear Primer Proyecto]

→ Ánimo, invitación, no es obligatorio
```

#### Proyecto Activo
```
📁 Nombre del Proyecto • 24 ideas
Última actividad: hace 2 horas

→ Contexto inmediato, reconfortante
```

#### Acción Primaria
```
✨ Capturar Idea

→ Emoji significativo, verbo claro
```

#### Menú Desplegable
```
Flow Mode      (texto + icono)
Estadísticas   (no "ver datos")
Configuración  (no "settings")
Ayuda          (no "soporte")
Salir          (nunca "logout")

→ Legible, accionable, español naturalmente
```

---

## 🎬 Transiciones y Movimiento

### Principios
- **Propósito:** Guiar la vista, no entretener
- **Duración:** 200-400ms (rápidas)
- **Easing:** spring o easeInOut (natural)

### Momentos clave

```javascript
// Entrada de elemento (cuando aparece)
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}

// Hover en botón (interactividad)
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Modal (aparición)
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}

// Menú desplegable
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
```

---

## ✅ Checklist de Implementación

### Header
- [ ] Greeting con nombre del usuario
- [ ] Pregunta orientadora ("¿Qué vamos a crear?")
- [ ] Botón primario centrado (✨ Capturar Idea)
- [ ] Menú hamburguesa accesible
- [ ] Logo visible pero no dominante

### Contenido Principal
- [ ] Proyecto activo destacado (si existe)
- [ ] 2-3 sub-acciones del proyecto (Ver Ideas, Mapa)
- [ ] Grid de otros proyectos (máx 6 iniciales)
- [ ] Opción "Ver todos los proyectos"
- [ ] Métricas colapsibles (no por defecto visible)

### Estados Vacíos
- [ ] Emoji animado (✨)
- [ ] Mensaje alentador (no "sin datos")
- [ ] CTA clara (Crear Primer Proyecto)
- [ ] Evitar sensación de fracaso

### Menú
- [ ] Flow Mode (sesión inmersiva)
- [ ] Estadísticas (mostrar/ocultar)
- [ ] Configuración
- [ ] Ayuda
- [ ] Separador visual
- [ ] Salir (rojo suave, al final)

### Accesibilidad
- [ ] Contraste WCAG AA mínimo
- [ ] Focus visible en botones
- [ ] Textos descriptivos en íconos
- [ ] Orden lógico de tabulación
- [ ] Responsive sin perder jerarquía

---

## 🚀 Estados Especiales

### Proyecto Activo
```css
border: subtle shadow
background: white
icon: emoji visible
info: ideas + actividad reciente
```

### Proyecto Inactivo
```css
border: light border
background: white
icon: emoji visible
info: solo contador
hover: border purple + shadow
```

### Métrica
```css
background: color-100 (light tint)
icon: color-600
value: bold, large
label: small gray
```

### Botón Primario
```css
background: gradient purple→pink
color: white
size: xl
shadow: lg
hover: scale 1.02 + shadow xl
disabled: opacity 0.5
```

### Botón Secundario
```css
background: gray-100
color: gray-700
size: sm/md
hover: gray-200
```

---

## 📊 Métricas de Éxito

Un dashboard minimalista debe lograr:

1. **Comprensión en 3 segundos** ✓
   - Usuario ve: Bienvenida + Botón primario + Contexto

2. **Una decisión clara** ✓
   - Siguiente paso obvio: Capturar idea O ver proyecto activo

3. **Sin overload cognitivo** ✓
   - Máx 6 proyectos iniciales
   - Máx 3 sub-acciones por sección
   - Menú oculta opciones avanzadas

4. **Sensación de control** ✓
   - Usuario sabe dónde guardan sus ideas
   - Proyecto activo siempre visible
   - Métrica opcional (no invasiva)

5. **Inspiración sin presión** ✓
   - Ánimo en estado vacío
   - No dice "crea algo" sino "¿qué vamos a crear?"
   - Flow Mode como opción, no obligación

---

## 🔄 Iteración Futura

Cuando el usuario sea más avanzado:

1. **Búsqueda global** → Buscar por proyecto/idea
2. **Filtros dinámicos** → Por emoji, fecha, actividad
3. **Sidebar** → Navegación lateral (modo desktop)
4. **Vistas** → Grid, lista, timeline
5. **Shortcuts** → Teclado para power users
6. **Templates** → Proyectos precargados

---

## 📚 Referencias de Diseño

Este sistema fue inspirado en principios de:
- **Laws of UX** (Jon Yablonski)
- **Don Norman's Design of Everyday Things**
- **Basecamp's Calm Technology**
- **Dribbble's Minimalist Dashboards** (2023-2025)

Adaptado específicamente para apps creativas con enfoque en:
- Reducción de fricción en captura de ideas
- Inspiración sin presión
- Claridad visual sin pérdida de creatividad
