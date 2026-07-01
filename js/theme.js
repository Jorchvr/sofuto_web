(function () {
  const THEMES = ['matrix', 'cyber', 'void'];
  const STORAGE_KEY = 'proto-theme';
  const root = document.documentElement;

  function getStored() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
  function setStored(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch {} }

  function applyTheme(name) {
    if (!THEMES.includes(name)) name = THEMES[0];
    root.dataset.theme = name;
    setStored(name);
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeOption === name));
    });
    if (window.State) window.State.set('theme', name === THEMES[0] ? null : name);
  }

  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('theme');
  const stored = getStored();
  const initial =
    (fromUrl && THEMES.includes(fromUrl)) ? fromUrl :
    (stored && THEMES.includes(stored))   ? stored :
    THEMES[0];
  applyTheme(initial);

  document.querySelectorAll('[data-theme-option]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeOption));
  });

  window.Theme = { apply: applyTheme, list: THEMES };
})();
