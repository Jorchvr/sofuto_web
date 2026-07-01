# NEXUS MUSEO — Demo Script

## Setup rápido
```
cd museo-digital
python3 serve.py
# Abre http://localhost:8000
```
O simplemente abre `index.html` directamente en el navegador.

---

## Click-through de presentación

### Pantalla 1 — Vista Galería (estado demo)
- Verás el fondo animado Matrix con caracteres cayendo
- Panel izquierdo: lista de 6 exhibiciones de ejemplo
- Panel derecho: Sofuto Web (tu proyecto Rails) activo
- **Clic en "← Anterior" / "→ Siguiente"** o usa las teclas ← → para navegar
- Observa la transición **Glitch** entre proyectos

### Pantalla 2 — Cambiar transición
- En la barra inferior, sección **TRANSICIÓN**, haz clic en "Fade"
- Navega entre proyectos → transición suave
- Prueba "Slide" → los paneles se deslizan horizontalmente

### Pantalla 3 — Modo Inmersivo
- En la barra inferior, sección **VISTA**, haz clic en "Inmersivo"
- El panel lateral desaparece, el contenido ocupa toda la pantalla
- Perfecto para presentaciones en pantalla completa

### Pantalla 4 — Añadir nueva exhibición
- Clic en el botón **"+ Nueva"** (panel lateral, arriba)
- Rellena: Título, Descripción, Tipo de media, URL opcional, Tags
- Clic en **"+ Añadir al Museo"**
- La nueva exhibición aparece al inicio de la lista

### Pantalla 5 — Temas de color
- En la barra inferior, sección **TEMA**:
  - **Matrix** → verde neón (default)
  - **Cyber** → azul cyan
  - **Void** → blanco sobre negro puro

### Pantalla 6 — Estado vacío
- En la barra inferior, sección **MODO**, haz clic en "Vacío"
- Verás el estado de museo sin exhibiciones
- Muestra el CTA para añadir la primera

---

## Tipos de media soportados
| Tipo | Qué poner en "URL" |
|---|---|
| Proyecto / Screenshot | URL de imagen PNG/JPG |
| Imagen | URL de imagen |
| Video | URL de YouTube o archivo .mp4 |
| Texto | Dejar URL vacía — escribir en "Contenido" |

## Navegación por teclado
- `←` / `→` — exhibit anterior / siguiente
- `↑` / `↓` — igual que ← / →
- `ESC` — cerrar modal
- `Shift+?` — historial de navegación
