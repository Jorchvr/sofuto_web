(function () {

  // ─── MATRIX RAIN ────────────────────────────────────────────────────────────
  const MatrixRain = {
    canvas: null,
    ctx: null,
    drops: [],
    animId: null,
    fontSize: 14,
    chars: 'ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF<>{}|\\/-=+@#$',

    init() {
      this.canvas = document.getElementById('matrix-bg');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.start();
    },

    resize() {
      this.canvas.width  = window.innerWidth;
      this.canvas.height = window.innerHeight;
      const cols = Math.floor(this.canvas.width / this.fontSize);
      this.drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -80));
    },

    accentColor() {
      const t = document.documentElement.dataset.theme || 'matrix';
      return { matrix: '#00ff41', cyber: '#00d4ff', void: '#d0d0d0' }[t] || '#00ff41';
    },

    bgOverlay() {
      const t = document.documentElement.dataset.theme || 'matrix';
      return { matrix: 'rgba(10,12,15,0.045)', cyber: 'rgba(5,7,15,0.045)', void: 'rgba(0,0,0,0.045)' }[t] || 'rgba(10,12,15,0.045)';
    },

    draw() {
      const { canvas, ctx, drops, chars, fontSize } = this;
      ctx.fillStyle = this.bgOverlay();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const color = this.accentColor();
      ctx.font = `${fontSize}px 'Space Mono', 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const isHead = Math.random() > 0.9;
        ctx.fillStyle = isHead ? '#ffffff' : color;
        ctx.globalAlpha = isHead ? 0.9 : (0.15 + Math.random() * 0.45);
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    },

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      let last = 0;
      const loop = (ts) => {
        if (ts - last > 48) { this.draw(); last = ts; }
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    },
  };

  // ─── STORE (localStorage) ────────────────────────────────────────────────────
  const Store = {
    KEY: 'museo-exhibits-v3',

    load() {
      try {
        const s = localStorage.getItem(this.KEY);
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    },

    save(arr) {
      try { localStorage.setItem(this.KEY, JSON.stringify(arr)); } catch {}
    },

    get() {
      return this.load() || (window.Data?.all?.exhibits ?? []);
    },

    add(exhibit) {
      const arr = this.get();
      exhibit.id = Date.now();
      arr.unshift(exhibit);
      this.save(arr);
      return exhibit;
    },

    update(updated) {
      const arr = this.get().map(e =>
        String(e.id) === String(updated.id) ? { ...e, ...updated } : e
      );
      this.save(arr);
    },

    remove(id) {
      const arr = this.get().filter(e => String(e.id) !== String(id));
      this.save(arr);
    },

    reset() {
      localStorage.removeItem(this.KEY);
    },
  };

  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function typeIcon(type) {
    return { image: '🖼', video: '🎬', text: '📝', project: '💻' }[type] || '📌';
  }

  function typeLabel(type) {
    return { image: 'imagen', video: 'video', text: 'texto', project: 'proyecto' }[type] || type;
  }

  function isYouTube(url) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  }

  function ytId(url) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/);
    return m ? m[1] : '';
  }

  function simpleMarkdown(text) {
    return String(text || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, s => '<ul>' + s + '</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])(.+)$/gm, '$1')
      .replace(/^<\/p><p>$/gm, '')
      .replace(/\n/g, '<br>');
  }

  // ─── MUSEUM ──────────────────────────────────────────────────────────────────
  const Museum = {
    exhibits: [],
    current: 0,
    busy: false,
    fx: 'glitch',
    emptyMode: false,

    init() {
      this.reload();
      this.renderSidebar();
      this.show(0, false);
      this.bindKeys();
      this.bindNav();
      this.bindFx();
    },

    reload() {
      this.exhibits = this.emptyMode ? [] : Store.get();
    },

    setEmptyMode(on) {
      this.emptyMode = on;
      this.reload();
      this.current = 0;
      this.renderSidebar();
      if (this.exhibits.length > 0) this.show(0, false);
      else this.showEmptyState();
      this.updateCounter();
    },

    showEmptyState() {
      const stage = document.getElementById('exhibit-stage');
      const info = document.getElementById('exhibit-info');
      if (stage) stage.dataset.empty = 'true';
      if (info) info.hidden = true;
      const media = document.getElementById('exhibit-media');
      if (media) media.innerHTML = `
        <div class="empty-exhibit">
          <div class="empty-glitch-text" aria-hidden="true">[ VACÍO ]</div>
          <p>Este museo no tiene exhibiciones todavía.</p>
          <button class="btn-add-empty" data-open-modal="add-exhibit">+ Añadir primera exhibición</button>
        </div>`;
    },

    renderSidebar() {
      const list = document.getElementById('exhibit-list');
      if (!list) return;
      if (this.exhibits.length === 0) {
        list.innerHTML = `<div class="sidebar-empty"><p>Sin exhibiciones.</p><button data-open-modal="add-exhibit" class="btn-sidebar-add">+ Añadir</button></div>`;
        return;
      }
      list.innerHTML = this.exhibits.map((ex, i) => `
        <button class="exhibit-nav-item${i === this.current ? ' active' : ''}" data-index="${i}" title="${esc(ex.title)}">
          <span class="nav-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="nav-icon">${typeIcon(ex.type)}</span>
          <span class="nav-title">${esc(ex.title)}</span>
        </button>`
      ).join('');
      list.querySelectorAll('.exhibit-nav-item').forEach(btn => {
        btn.addEventListener('click', () => this.goTo(parseInt(btn.dataset.index, 10)));
      });
    },

    renderMedia(ex) {
      const fallback = window.Data?.all?.exhibits?.find?.(e => String(e.id) === String(ex.id))?.media_url || '';
      switch (ex.type) {
        case 'image':
        case 'project':
          if (ex.media_url) {
            return `<img src="${esc(ex.media_url)}" alt="${esc(ex.title)}" class="exhibit-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="img-error" style="display:none">⚠ Imagen no disponible</div>`;
          }
          return `<div class="img-error">Sin imagen — añade una URL</div>`;
        case 'video':
          if (isYouTube(ex.media_url)) {
            const id = ytId(ex.media_url);
            if (!id) return `<div class="img-error">URL de YouTube inválida</div>`;
            return `<iframe class="exhibit-iframe" src="https://www.youtube-nocookie.com/embed/${id}?rel=0" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${esc(ex.title)}"></iframe>`;
          }
          if (ex.media_url) return `<video class="exhibit-video" src="${esc(ex.media_url)}" controls></video>`;
          return `<div class="img-error">Sin URL de video</div>`;
        case 'text':
          return `<div class="exhibit-text">${simpleMarkdown(ex.content || ex.description)}</div>`;
        default:
          return `<div class="img-error">Tipo no soportado</div>`;
      }
    },

    show(index, animate) {
      if (this.exhibits.length === 0) { this.showEmptyState(); return; }
      index = Math.max(0, Math.min(index, this.exhibits.length - 1));
      this.current = index;
      const ex = this.exhibits[index];

      const stage = document.getElementById('exhibit-stage');
      const info = document.getElementById('exhibit-info');
      if (info) info.hidden = false;
      if (stage) delete stage.dataset.empty;

      const update = () => {
        const mediaEl = document.getElementById('exhibit-media');
        if (mediaEl) mediaEl.innerHTML = this.renderMedia(ex);

        const titleEl = document.getElementById('exhibit-title');
        if (titleEl) titleEl.textContent = ex.title;

        const descEl = document.getElementById('exhibit-description');
        if (descEl) descEl.textContent = ex.description || '';

        const tagsEl = document.getElementById('exhibit-tags');
        if (tagsEl) tagsEl.innerHTML = (ex.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');

        const linkEl = document.getElementById('exhibit-link');
        if (linkEl) {
          const hasLink = ex.link && ex.link !== '#' && ex.link !== '';
          linkEl.hidden = !hasLink;
          if (hasLink) linkEl.href = ex.link;
        }

        const yearEl = document.getElementById('exhibit-year-badge');
        if (yearEl) yearEl.textContent = ex.year || '';

        const typeEl = document.getElementById('exhibit-type-badge');
        if (typeEl) typeEl.textContent = typeLabel(ex.type);

        const delBtn = document.getElementById('exhibit-delete');
        if (delBtn) delBtn.dataset.exhibitId = ex.id;
        const editBtn = document.getElementById('exhibit-edit');
        if (editBtn) editBtn.dataset.exhibitId = ex.id;

        document.querySelectorAll('.exhibit-nav-item').forEach((btn, i) => {
          btn.classList.toggle('active', i === index);
          if (i === index) btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });

        this.updateCounter();
      };

      if (!animate) { update(); return; }

      const stage2 = document.getElementById('exhibit-stage');
      if (!stage2) { update(); return; }

      stage2.dataset.fx = this.fx;
      stage2.classList.add('trans-out');

      const done = () => {
        stage2.classList.remove('trans-out');
        update();
        void stage2.offsetWidth; // force reflow
        stage2.classList.add('trans-in');
        const onEnd = () => {
          stage2.classList.remove('trans-in');
          stage2.removeEventListener('animationend', onEnd);
        };
        stage2.addEventListener('animationend', onEnd);
      };

      let triggered = false;
      stage2.addEventListener('animationend', function handler() {
        if (!triggered) { triggered = true; done(); }
        stage2.removeEventListener('animationend', handler);
      });
      setTimeout(() => { if (!triggered) { triggered = true; done(); } }, 450);
    },

    goTo(index) {
      if (this.busy || this.exhibits.length === 0) return;
      this.busy = true;
      const dir = index >= this.current ? 'next' : 'prev';
      const stage = document.getElementById('exhibit-stage');
      if (stage) stage.dataset.direction = dir;
      this.show(index, true);
      setTimeout(() => { this.busy = false; }, 700);
    },

    next() { this.goTo((this.current + 1) % Math.max(this.exhibits.length, 1)); },
    prev() { this.goTo((this.current - 1 + Math.max(this.exhibits.length, 1)) % Math.max(this.exhibits.length, 1)); },

    updateCounter() {
      const total = this.exhibits.length;
      const cur   = total > 0 ? this.current + 1 : 0;
      ['current-slide', 'current-slide-top'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(cur).padStart(2, '0');
      });
      ['total-slides', 'total-slides-top'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(total).padStart(2, '0');
      });
    },

    addExhibit(data) {
      const ex = Store.add(data);
      this.exhibits = Store.get();
      this.renderSidebar();
      this.updateCounter();
      this.goTo(0);
    },

    openEditModal(id) {
      const ex = this.exhibits.find(e => String(e.id) === String(id));
      if (!ex) return;

      document.getElementById('edit-field-id').value          = ex.id;
      document.getElementById('edit-field-title').value       = ex.title || '';
      document.getElementById('edit-field-description').value = ex.description || '';
      document.getElementById('edit-field-type').value        = ex.type || 'project';
      document.getElementById('edit-field-media-url').value   = ex.media_url || '';
      document.getElementById('edit-field-images').value      = (ex.images || []).join(', ');
      document.getElementById('edit-field-video').value       = ex.video || '';
      document.getElementById('edit-field-content').value     = ex.content || '';
      document.getElementById('edit-field-link').value        = ex.link || '';
      document.getElementById('edit-field-tags').value        = (ex.tags || []).join(', ');
      document.getElementById('edit-field-year').value        = ex.year || new Date().getFullYear();

      const isText = ex.type === 'text';
      document.getElementById('edit-field-media-group').hidden   = isText;
      document.getElementById('edit-field-content-group').hidden = !isText;

      openModal('edit-exhibit');
    },

    updateExhibit(data) {
      data.tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      data.year = parseInt(data.year, 10) || new Date().getFullYear();
      const rawImages = data.images_raw || '';
      delete data.images_raw;
      const parsed = rawImages.split(',').map(u => u.trim()).filter(Boolean);
      data.images = parsed.length ? parsed : (data.media_url ? [data.media_url] : []);
      data.video  = data.video || '';
      Store.update(data);
      this.exhibits = Store.get();
      const idx = this.exhibits.findIndex(e => String(e.id) === String(data.id));
      this.current = idx >= 0 ? idx : this.current;
      this.renderSidebar();
      this.show(this.current, false);
      window.UI?.toast('Cambios guardados', 'success');
    },

    deleteExhibit(id) {
      if (!confirm('¿Eliminar esta exhibición?')) return;
      Store.remove(id);
      this.exhibits = Store.get();
      this.current = Math.max(0, Math.min(this.current, this.exhibits.length - 1));
      this.renderSidebar();
      if (this.exhibits.length > 0) this.show(this.current, false);
      else this.showEmptyState();
      this.updateCounter();
      window.UI?.toast('Exhibición eliminada');
    },

    bindKeys() {
      document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); this.next(); }
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); this.prev(); }
      });
    },

    bindNav() {
      document.getElementById('btn-prev')?.addEventListener('click', () => this.prev());
      document.getElementById('btn-next')?.addEventListener('click', () => this.next());
      document.getElementById('exhibit-delete')?.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.exhibitId;
        if (id) this.deleteExhibit(id);
      });
      document.getElementById('exhibit-edit')?.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.exhibitId;
        if (id) this.openEditModal(id);
      });
    },

    bindFx() {
      document.querySelectorAll('[data-fx-option]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.fx = btn.dataset.fxOption;
          document.querySelectorAll('[data-fx-option]').forEach(b =>
            b.setAttribute('aria-pressed', String(b.dataset.fxOption === this.fx))
          );
          window.State?.set('fx', this.fx === 'glitch' ? null : this.fx);
        });
      });
      const urlFx = window.State?.get('fx');
      if (urlFx) {
        this.fx = urlFx;
        document.querySelectorAll('[data-fx-option]').forEach(b =>
          b.setAttribute('aria-pressed', String(b.dataset.fxOption === this.fx))
        );
      }
    },
  };

  // ─── ADD MODAL ───────────────────────────────────────────────────────────────
  const AddModal = {
    init() {
      const form = document.getElementById('form-add-exhibit');
      if (!form) return;

      const typeSelect = form.querySelector('[name="type"]');
      const mediaGroup = document.getElementById('field-media-group');
      const contentGroup = document.getElementById('field-content-group');

      typeSelect?.addEventListener('change', () => {
        const isText = typeSelect.value === 'text';
        if (mediaGroup) mediaGroup.hidden = isText;
        if (contentGroup) contentGroup.hidden = !isText;
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        if (!data.title?.trim()) {
          window.UI?.toast('El título es obligatorio', 'error');
          form.querySelector('[name="title"]')?.focus();
          return;
        }

        data.tags = data.tags
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [];
        data.year = new Date().getFullYear();
        const rawImages = data.images_raw || '';
        delete data.images_raw;
        const parsedImages = rawImages.split(',').map(u => u.trim()).filter(Boolean);
        data.images = parsedImages.length ? parsedImages : (data.media_url ? [data.media_url] : []);
        data.video  = data.video || '';

        Museum.addExhibit(data);
        form.reset();
        if (mediaGroup) mediaGroup.hidden = false;
        if (contentGroup) contentGroup.hidden = true;

        const modal = document.querySelector('[data-modal="add-exhibit"]');
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          window.State?.set('modal', null);
        }
        window.UI?.toast('¡Exhibición añadida al museo!', 'success');
      });
    },
  };

  // ─── EDIT MODAL ──────────────────────────────────────────────────────────────
  const EditModal = {
    init() {
      const form = document.getElementById('form-edit-exhibit');
      if (!form) return;

      const typeSelect = form.querySelector('[name="type"]');
      const mediaGroup = document.getElementById('edit-field-media-group');
      const contentGroup = document.getElementById('edit-field-content-group');

      typeSelect?.addEventListener('change', () => {
        const isText = typeSelect.value === 'text';
        if (mediaGroup)   mediaGroup.hidden   = isText;
        if (contentGroup) contentGroup.hidden = !isText;
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        if (!data.title?.trim()) {
          window.UI?.toast('El título es obligatorio', 'error');
          form.querySelector('[name="title"]')?.focus();
          return;
        }
        Museum.updateExhibit(data);
        const modal = document.querySelector('[data-modal="edit-exhibit"]');
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          window.State?.set('modal', null);
        }
      });
    },
  };

  // ─── MODAL SYSTEM ─────────────────────────────────────────────────────────────
  function openModal(name) {
    const m = document.querySelector(`[data-modal="${name}"]`);
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    m.querySelector('input, textarea')?.focus();
  }
  function closeModal(m) {
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    window.State?.set('modal', null);
  }

  // ─── INIT ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    MatrixRain.init();
    Museum.init();
    AddModal.init();
    EditModal.init();
    initMobileSidebar();

    // Modal triggers
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open-modal]');
      if (opener) {
        e.preventDefault();
        const name = opener.dataset.openModal;
        window.State?.set('modal', name);
        openModal(name);
        return;
      }
      const closer = e.target.closest('[data-close-modal]');
      if (closer) {
        const m = closer.closest('[data-modal]');
        closeModal(m);
        return;
      }
      const backdrop = e.target.closest('.modal-backdrop');
      if (backdrop && e.target === backdrop) closeModal(backdrop);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('[data-modal].open').forEach(closeModal);
      }
    });

    // Persona changes affect exhibit list
    document.addEventListener('persona:applied', (e) => {
      Museum.setEmptyMode(e.detail.name === 'empty');
    });

    // Hydrate URL state
    window.State?.hydrate({ modal: (v) => v && openModal(v) });

    // Expose for debugging
    window.Museum = Museum;
    window.Store = Store;
  });

  // ─── MOBILE SIDEBAR ──────────────────────────────────────────────────────────
  function initMobileSidebar() {
    const shell    = document.querySelector('.museum-shell');
    const backdrop = document.getElementById('sidebar-backdrop');
    const btnOpen  = document.getElementById('btn-menu');
    const btnClose = document.getElementById('btn-sidebar-close');

    function openSidebar() {
      shell?.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      shell?.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    }

    btnOpen?.addEventListener('click', openSidebar);
    btnClose?.addEventListener('click', closeSidebar);
    backdrop?.addEventListener('click', closeSidebar);

    // Close sidebar when user picks an exhibit (mobile UX)
    document.getElementById('exhibit-list')?.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && shell?.classList.contains('sidebar-open')) closeSidebar();
    });
  }

})();
