(function () {
  const PERSONAS = ['demo', 'empty'];
  const STORAGE_KEY = 'proto-persona';
  const root = document.documentElement;

  function getStored() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
  function setStored(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch {} }

  function applyPersona(name) {
    if (!PERSONAS.includes(name)) name = PERSONAS[0];
    root.dataset.persona = name;
    setStored(name);
    document.querySelectorAll('[data-persona-option]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.personaOption === name));
    });
    if (window.Data && window.Data.apply) window.Data.apply(name);
    if (window.State) window.State.set('persona', name === PERSONAS[0] ? null : name);
  }

  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('persona');
  const stored  = getStored();
  const initial =
    (fromUrl && PERSONAS.includes(fromUrl)) ? fromUrl :
    (stored  && PERSONAS.includes(stored))  ? stored :
    PERSONAS[0];
  applyPersona(initial);

  document.querySelectorAll('[data-persona-option]').forEach(btn => {
    btn.addEventListener('click', () => applyPersona(btn.dataset.personaOption));
  });

  window.Persona = { apply: applyPersona, list: PERSONAS };
})();
