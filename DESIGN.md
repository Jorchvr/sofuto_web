# Design System — NEXUS MUSEO

## Themes

### matrix (default)
- surface: #0a0c0f  
- elevated: #0f1419
- accent: #00ff41 (Matrix green neon)
- muted: #1a3a1a
- ink: #b4ffcc
- ink2: #508060
- radius: 2px

### cyber
- surface: #05070f
- elevated: #0a1223
- accent: #00d4ff (cyan neon)
- muted: #0a2a40
- ink: #b4dcff
- ink2: #508090
- radius: 4px

### void
- surface: #000000
- elevated: #0a0a0a
- accent: #e8e8e8
- muted: #282828
- ink: #e0e0e0
- ink2: #787878
- radius: 0

## Typography
- Font: Space Mono (Google Fonts, weights 400 + 700)
- Scale: 11 / 13 / 14 / 16 / 20 / 24 / 32 / 48px
- All caps for labels, natural case for content

## Spacing
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px

## Motion
- Matrix rain: requestAnimationFrame throttled to ~20fps
- Exhibit transitions: 300ms for out, 350ms for in
- Glitch: hue-rotate + translateX + skewX + brightness
- Fade: opacity only
- Slide: translateX -100%/+100% with easing

## Layouts
- gallery: sidebar 280px fixed + main flex-1
- immersive: sidebar hidden, main full width

## Key patterns
- All surfaces semi-transparent (0.92–0.97 opacity) so Matrix shows through
- Borders use accent color at low opacity (0.2–0.35)
- Interactive elements get accent border/glow on hover
- Text uses ink (primary) and ink2 (secondary/metadata)
