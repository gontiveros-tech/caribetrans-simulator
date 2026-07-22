/* ==========================================================================
   CaribeTrans — Simulador Comercial
   app.js — navegación, inicialización y utilidades compartidas
   ========================================================================== */
(function () {
  'use strict';

  const D = window.CT_DATA;

  /* --------------------------------------------------------- Utilidades */
  const CT = window.CT = {};

  CT.$  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  CT.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  CT.el = function (tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
        else if (k === 'dataset') Object.keys(attrs[k]).forEach(function (d) { node.dataset[d] = attrs[k][d]; });
        else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  };

  CT.money = function (n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  };
  CT.moneyUsd = function (n) { return CT.money(n) + ' USD'; };

  CT.escape = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // Búsquedas por id
  CT.veh   = function (id) { return D.VEHICULOS.find(function (v) { return v.id === id; }); };
  CT.cond  = function (id) { return D.CONDUCTORES.find(function (c) { return c.id === id; }); };
  CT.hotel = function (id) { return D.HOTELES.find(function (h) { return h.id === id; }); };
  CT.to    = function (id) { return D.TOUROPERADORES.find(function (t) { return t.id === id; }); };
  CT.vuelo = function (id) { return D.VUELOS.find(function (v) { return v.id === id; }); };
  CT.svc   = function (id) { return D.SERVICIOS.find(function (s) { return s.id === id; }); };

  CT.vehLabel   = function (id) { const v = CT.veh(id);   return v ? v.id : id; };
  CT.condNombre = function (id) { const c = CT.cond(id);  return c ? c.nombre : id; };
  CT.hotelNombre = function (id) { const h = CT.hotel(id); return h ? h.nombre : id; };

  CT.tipoServicioLabel = function (t) { return D.TIPO_SERVICIO_LABEL[t] || t; };
  CT.estadoServicioLabel = function (e) { return D.ESTADO_SERVICIO_LABEL[e] || e; };

  // Color de badge según estado de servicio
  CT.estadoServicioBadge = function (e) {
    return { completado: 'badge-green', en_curso: 'badge-teal', pendiente: 'badge-gold', cancelado: 'badge-red' }[e] || 'badge-gray';
  };
  CT.estadoServicioDot = function (e) {
    return { completado: 'green', en_curso: 'live', pendiente: 'gold', cancelado: 'red' }[e] || '';
  };

  // Iniciales para avatares
  CT.iniciales = function (nombre) {
    const parts = String(nombre).trim().split(/\s+/);
    return ((parts[0] || '')[0] || '' ) + ((parts[1] || '')[0] || '');
  };

  /* --------------------------------------------------------- Navegación */
  const state = { section: 'dashboard', dashboardReady: false, opsReady: false };

  CT.navigate = function (id) {
    const item = findNavItem(id);
    if (item && item.accion === 'logout') { CT.logout(); return; }

    // Solo dashboard y operaciones tienen sección real; el resto → placeholder
    const isReal = id === 'dashboard' || id === 'operaciones';

    CT.$$('.nav-item').forEach(function (n) { n.classList.toggle('active', n.dataset.nav === id); });

    CT.$$('.section').forEach(function (s) { s.classList.remove('active'); });

    if (isReal) {
      const sec = document.getElementById('section-' + id);
      if (sec) { sec.classList.add('active'); sec.classList.add('fade-in'); }
      updateBreadcrumb(item ? item.label : id);
      if (id === 'dashboard' && window.CT_Dashboard) window.CT_Dashboard.render();
      if (id === 'operaciones' && window.CT_Operations) window.CT_Operations.render();
    } else {
      renderPlaceholder(item ? item.label : id);
      const sec = document.getElementById('section-placeholder');
      sec.classList.add('active', 'fade-in');
      updateBreadcrumb(item ? item.label : id);
    }
    state.section = id;
    document.querySelector('.main').scrollTop = 0;
    window.scrollTo(0, 0);
  };

  function findNavItem(id) {
    let found = null;
    D.NAV.forEach(function (g) { g.items.forEach(function (it) { if (it.id === id) found = it; }); });
    return found;
  }

  function updateBreadcrumb(label) {
    const el = CT.$('.crumb-current');
    if (el) el.textContent = label;
  }

  /* --------------------------------------------------------- Placeholder */
  function renderPlaceholder(nombre) {
    const host = document.getElementById('section-placeholder');
    host.innerHTML = '';
    host.appendChild(CT.el('div', { class: 'placeholder-wrap' }, [
      CT.el('div', { class: 'placeholder-card' }, [
        CT.el('div', { class: 'placeholder-lock' }, [CT.el('i', { class: 'fa-solid fa-lock' })]),
        CT.el('h3', { text: 'Módulo disponible en el sistema completo' }),
        CT.el('p', { html: '<span class="mod-name">' + CT.escape(nombre) + '</span> está incluido en el plan Profesional y Enterprise.' }),
        CT.el('p', { text: 'Contacte a su representante de ventas para una demostración completa.' }),
        CT.el('div', { class: 'placeholder-contact' }, [
          CT.el('div', { class: 'pc-row' }, [CT.el('i', { class: 'fa-solid fa-phone' }), document.createTextNode(D.EMPRESA.telefono_ventas)]),
          CT.el('div', { class: 'pc-row' }, [CT.el('i', { class: 'fa-solid fa-envelope' }), document.createTextNode(D.EMPRESA.email_ventas)]),
        ]),
      ]),
    ]));
  }

  /* --------------------------------------------------------- Sidebar */
  function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    D.NAV.forEach(function (grupo) {
      const g = CT.el('div', { class: 'nav-group' }, [
        CT.el('div', { class: 'nav-group-label', text: grupo.grupo }),
      ]);
      grupo.items.forEach(function (it) {
        const children = [
          CT.el('i', { class: 'fa-solid ' + it.icon }),
          CT.el('span', { text: it.label }),
        ];
        if (it.badge) children.push(CT.el('span', { class: 'nav-badge', text: it.badge }));
        else if (it.pulse) children.push(CT.el('span', { class: 'nav-pulse' }));
        else if (!it.activo && it.accion !== 'logout') children.push(CT.el('i', { class: 'nav-lock fa-solid fa-lock' }));

        const node = CT.el('div', {
          class: 'nav-item' + (it.id === 'dashboard' ? ' active' : ''),
          dataset: { nav: it.id },
          onclick: function () { CT.navigate(it.id); },
        }, children);
        g.appendChild(node);
      });
      nav.appendChild(g);
    });
  }

  /* --------------------------------------------------------- Topbar */
  function renderTopbar() {
    const u = D.EMPRESA.usuario_demo;
    CT.$('.user-avatar').textContent = u.iniciales;
    CT.$('.topbar-user .u-name').textContent = u.nombre;
    CT.$('.topbar-user .u-role').textContent = u.rol;
    CT.$('.topbar-date .date').textContent = D.EMPRESA.fecha_demo;
    startClock();
  }

  function startClock() {
    const clock = CT.$('.topbar-date .clock');
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      clock.textContent = hh + ':' + mm + ':' + ss;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* --------------------------------------------------------- Login */
  CT.login = function () {
    const app = document.getElementById('app');
    const login = document.getElementById('login');
    login.style.transition = 'opacity .35s ease';
    login.style.opacity = '0';
    setTimeout(function () {
      login.style.display = 'none';
      app.classList.add('active');
      CT.navigate('dashboard');
    }, 320);
  };

  CT.logout = function () {
    const app = document.getElementById('app');
    const login = document.getElementById('login');
    app.classList.remove('active');
    login.style.display = 'grid';
    login.style.opacity = '1';
    window.scrollTo(0, 0);
  };

  function bindLogin() {
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); CT.login(); });

    const toggle = document.getElementById('pw-toggle');
    if (toggle) toggle.addEventListener('click', function () {
      const inp = document.getElementById('login-pw');
      const icon = toggle.querySelector('i');
      if (inp.type === 'password') { inp.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
      else { inp.type = 'password'; icon.className = 'fa-solid fa-eye'; }
    });
  }

  /* --------------------------------------------------------- Init */
  function init() {
    renderSidebar();
    renderTopbar();
    bindLogin();
    // Pre-render dashboard para que esté listo tras el login
    if (window.CT_Dashboard) window.CT_Dashboard.render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
