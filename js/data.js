(function () {
  const DEMO_EXHIBITS = [
    {
      id: 1,
      title: 'Sofuto Web',
      description: 'Panel administrativo para gestión de microfinanzas. Controla 528 clientes activos en 25 pueblos, 630 préstamos, rutas de cobranza, cortes diarios/semanales, buró de crédito y analítica financiera. Utilidad real proyectada con dashboard en tiempo real.',
      type: 'project',
      media_url: 'assets/images/sofuto-web.png',
      link: 'https://github.com/Jorchvr/sofuto_web.git',
      tags: ['Ruby on Rails', 'PostgreSQL', 'Bootstrap', 'Devise'],
      year: 2025,
    },
    {
      id: 2,
      title: 'World Nomad Web',
      description: 'Plataforma para conectar nómadas digitales de todo el mundo. Búsqueda por nombre, profesión o país, mapa interactivo con pins de usuarios, sistema de historias y modo oscuro. Diseño limpio con identidad visual de mochilero.',
      type: 'project',
      media_url: 'assets/images/world-nomad-web.png',
      link: '#',
      tags: ['Rails', 'Leaflet.js', 'PostgreSQL', 'Tailwind'],
      year: 2025,
    },
    {
      id: 3,
      title: 'Óptima Solución',
      description: 'Sitio web corporativo para empresa de ingeniería, arquitectura y telecomunicaciones. Presenta proyectos ejecutivos bajo normas ALTAN, AT&T, Axtel, Total Play y CFE. Incluye lista de proyectos con estatus (entregado/en progreso/planeado) y contador de métricas.',
      type: 'project',
      media_url: 'assets/images/optima-solucion.png',
      link: '#',
      tags: ['Next.js', 'Tailwind', 'TypeScript'],
      year: 2025,
    },
    {
      id: 4,
      title: 'BarberShop',
      description: 'Landing page premium para barbería con sistema de reservas integrado. Diseño oscuro y cinematográfico con fotografía de fondo de impacto. Incluye panel admin para gestión de citas y módulo de reservas para clientes. "No es solo un corte, es una experiencia."',
      type: 'project',
      media_url: 'assets/images/barbershop.png',
      link: '#',
      tags: ['Rails', 'Hotwire', 'PostgreSQL'],
      year: 2025,
    },
    {
      id: 5,
      title: 'Saarq Bienes Raíces',
      description: 'Plataforma inmobiliaria completa para búsqueda y listado de propiedades en México. Casas, departamentos, terrenos y locales en venta y renta. Filtros por tipo de propiedad, integración WhatsApp y chat en tiempo real. 9 propiedades destacadas al lanzamiento.',
      type: 'project',
      media_url: 'assets/images/saarq.png',
      link: '#',
      tags: ['Rails', 'Active Storage', 'PostgreSQL', 'Mapbox'],
      year: 2025,
    },
    {
      id: 6,
      title: 'Power Gym',
      description: 'Sistema de gestión integral para gimnasio. Control de membresías con QR, punto de venta (POS) para tienda interna, registro de asistencia diaria, corte de caja, historial de pagos y renovaciones. Modo día para operación en tablet en recepción.',
      type: 'project',
      media_url: 'assets/images/power-gym.png',
      link: '#',
      tags: ['Rails', 'Hotwire', 'PWA', 'PostgreSQL'],
      year: 2026,
    },
  ];

  const DATA = {
    personas: {
      'demo': {
        user: { name: 'Jorge Vargas', initials: 'JV' },
        badge: 'curador',
      },
      'empty': {
        user: { name: 'Nuevo Usuario', initials: 'NU' },
        badge: 'nuevo',
      },
    },
    exhibits: DEMO_EXHIBITS,
  };

  function getPersona(name) {
    return DATA.personas[name] || DATA.personas['demo'];
  }

  function resolve(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function apply(personaName) {
    const persona = getPersona(personaName);
    document.querySelectorAll('[data-persona-text]').forEach(el => {
      const val = resolve(persona, el.dataset.personaText);
      if (val !== undefined && val !== null) el.textContent = String(val);
    });
    document.querySelectorAll('[data-persona-show]').forEach(el => {
      const targets = el.dataset.personaShow.split(/\s+/).filter(Boolean);
      const hide = !targets.includes(personaName);
      el.classList.toggle('proto-hidden', hide);
      el.hidden = hide;
    });
    document.querySelectorAll('[data-persona-hide]').forEach(el => {
      const targets = el.dataset.personaHide.split(/\s+/).filter(Boolean);
      const hide = targets.includes(personaName);
      el.classList.toggle('proto-hidden', hide);
      el.hidden = hide;
    });
    document.dispatchEvent(new CustomEvent('persona:applied', {
      detail: { name: personaName, data: persona }
    }));
  }

  window.Data = { all: DATA, personas: DATA.personas, get: getPersona, apply };
})();
