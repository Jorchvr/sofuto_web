# NEXUS MUSEO

Portfolio digital interactivo con fondo animado Matrix, transiciones cinematográficas y soporte para imágenes, videos y texto.

## Ejecutar

```bash
# Con Python (recomendado — sin caché de navegador)
cd museo-digital
python3 serve.py
# Abre http://localhost:8000

# Sin Python — abre directamente
open index.html  # macOS
start index.html # Windows
```

## Estructura de archivos

```
museo-digital/
├── index.html          ← Página principal del museo
├── 404.html            ← Página de error
├── css/
│   ├── styles.css      ← Diseño y animaciones
│   └── feedback.css    ← Overlay de feedback
├── js/
│   ├── app.js          ← Lógica principal (Matrix rain + Museum + transiciones)
│   ├── data.js         ← Datos de ejemplo (6 proyectos demo)
│   ├── theme.js        ← Cambio de tema (Matrix / Cyber / Void)
│   ├── layout.js       ← Cambio de vista (Galería / Inmersivo)
│   ├── persona.js      ← Modo (Demo / Vacío)
│   ├── state.js        ← URL state + share button
│   ├── ui.js           ← Helpers (toast, loading, skeletons)
│   └── feedback.js     ← Overlay de comentarios (💬)
├── serve.py            ← Servidor sin caché para desarrollo
├── PRODUCT.md          ← Contexto del producto
├── DESIGN.md           ← Sistema de diseño
└── DEMO.md             ← Guión de presentación
```

## Cómo añadir tus proyectos

### Opción A — Desde la UI (persiste en localStorage)
1. Abre el museo
2. Clic en **"+ Nueva"**
3. Rellena el formulario y guarda

### Opción B — Editando `js/data.js`
Modifica el array `DEMO_EXHIBITS` con tus proyectos:

```javascript
{
  id: 7,                          // número único
  title: 'Mi Proyecto',
  description: 'Descripción...',
  type: 'project',                // 'project' | 'image' | 'video' | 'text'
  media_url: 'https://...',       // URL de imagen o YouTube
  link: 'https://mi-web.com',
  tags: ['React', 'Node.js'],
  year: 2025,
}
```

## Tipos de media
- **project / image**: URL de imagen (PNG, JPG, WebP)
- **video**: URL de YouTube (`https://youtube.com/watch?v=...`) o archivo `.mp4`
- **text**: Dejar `media_url` vacío; usar campo `content` con Markdown básico

## Temas de color
| Tema | Fondo | Acento |
|------|-------|--------|
| Matrix | `#0a0c0f` | `#00ff41` verde neón |
| Cyber | `#05070f` | `#00d4ff` cyan |
| Void | `#000000` | `#e8e8e8` blanco |

## Lo que es real vs. simulado
| Real ✅ | Simulado 🎭 |
|---------|------------|
| Fondo Matrix animado | Sin backend |
| Añadir/eliminar exhibiciones | Datos en localStorage (no base de datos) |
| Todas las transiciones | — |
| Navegación con teclado | — |
| Cambio de tema y vista | — |
| Panel de feedback 💬 | — |
| URLs compartibles 🔗 | — |

## Feedback del prototipo
Haz clic en 💬 en la barra inferior para pintar comentarios sobre cualquier elemento y exportar el JSON de feedback.
