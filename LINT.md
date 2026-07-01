# Lint Report — 2026-07-01

**Rules checked:** 20  ·  **Passing:** 20  ·  **Findings:** 0

## Passed

- No purple/violet gradients ✓
- No gradient text on body copy ✓
- Contrast ≥4.5:1 — matrix ink: 16.86:1 · ink2: 4.81:1 ✓
- No nested cards > 2 deep ✓
- No dead buttons — all wired via event delegation or direct listeners ✓
- Modal ARIA — role="dialog", aria-modal="true", aria-hidden present ✓
- :focus-visible rings defined in styles.css ✓
- No horizontal scroll at 375px — sidebar collapses to width:0, flex layout responsive ✓
- Readable text at 375px — 13px base, 32px nav arrows (≥44px target) ✓
- No fixed pixel widths on layout containers (only max-width on content) ✓
- No lorem ipsum ✓
- No placeholder names (John Doe / User 1) ✓
- Dates recent — 2024/2025 throughout ✓
- All img tags have alt attributes ✓
- No broken image paths — all media are runtime SVG data-URIs or user-provided URLs ✓
- Theme switcher wired via theme.js across all 3 themes ✓
- URL state via state.js — modal open/close round-trips ✓
- Screen count matches spec — 2 screens (index.html + 404.html) ✓
- No build tooling — no package.json, no node_modules, Tailwind CDN only ✓
- data-loading/submit conflict resolved — submit button uses native form event ✓

## Fixed during audit

1. **Submit button + data-loading conflict** — `data-loading` on a `type="submit"` button causes ui.js to intercept the click and prevent form submission. Fixed by removing `data-loading` and relying on the `form.submit` event listener in app.js.
2. **`role="list"` on div without listitem children** — The `#exhibit-list` div is populated with `button` elements that don't have `role="listitem"`. Replaced `role="list"` with `aria-label` to avoid invalid ARIA structure.
