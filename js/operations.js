/* ==========================================================================
   CaribeTrans — Simulador Comercial
   operations.js — Centro de Operaciones (6 sub-vistas)
     Tab 1: Correos TO   ·  Tab 2: Vuelos (FIDS)  ·  Tab 3: Mapa GPS
     Tab 4: Vista Conductor · Tab 5: Alertas      ·  Tab 6: Touroperadores
   ========================================================================== */
(function () {
  'use strict';

  const D = window.CT_DATA;
  const CT = window.CT;
  let built = false;
  let activeTab = 'mapa';

  const TABS = [
    { id: 'correos',        icon: 'fa-envelope',        label: 'Correos TO',      count: D.CORREOS.length },
    { id: 'vuelos',         icon: 'fa-plane',           label: 'Vuelos',          count: D.VUELOS.length },
    { id: 'mapa',           icon: 'fa-map-location-dot', label: 'Mapa GPS' },
    { id: 'conductor',      icon: 'fa-mobile-screen',   label: 'Vista Conductor' },
    { id: 'alertas',        icon: 'fa-triangle-exclamation', label: 'Alertas',    count: D.ALERTAS.length },
    { id: 'touroperadores', icon: 'fa-building',        label: 'Touroperadores',  count: D.TOUROPERADORES.length },
  ];

  const painted = {};

  function render() {
    const host = document.getElementById('section-operaciones');
    if (!built) { buildShell(host); built = true; }
    paintTab(activeTab);
  }

  /* --------------------------------------------------------------- Shell */
  function buildShell(host) {
    host.innerHTML = ''
      + '<div class="section-header">'
      +   '<div>'
      +     '<div class="section-title">Centro de Operaciones</div>'
      +     '<div class="section-sub">Coordinación en tiempo real · ' + D.EMPRESA.fecha_demo + '</div>'
      +   '</div>'
      +   '<span class="live-chip"><span class="status-dot live"></span> En vivo · ' + D.KPI_HOY.servicios_en_curso + ' servicios en curso</span>'
      + '</div>'
      + '<div class="ops-tabs" id="ops-tabs"></div>'
      + '<div id="ops-panels"></div>';

    const tabsHost = document.getElementById('ops-tabs');
    TABS.forEach(function (t) {
      const btn = CT.el('button', {
        class: 'ops-tab' + (t.id === activeTab ? ' active' : ''),
        dataset: { tab: t.id },
        onclick: function () { switchTab(t.id); },
      }, [
        CT.el('i', { class: 'fa-solid ' + t.icon }),
        CT.el('span', { text: t.label }),
        t.count != null ? CT.el('span', { class: 'tab-count', text: String(t.count) }) : null,
      ]);
      tabsHost.appendChild(btn);
    });

    const panelsHost = document.getElementById('ops-panels');
    TABS.forEach(function (t) {
      panelsHost.appendChild(CT.el('div', { class: 'ops-panel' + (t.id === activeTab ? ' active' : ''), id: 'ops-' + t.id }));
    });
  }

  function switchTab(id) {
    activeTab = id;
    CT.$$('.ops-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === id); });
    CT.$$('.ops-panel').forEach(function (p) { p.classList.toggle('active', p.id === 'ops-' + id); });
    paintTab(id);
  }

  function paintTab(id) {
    const host = document.getElementById('ops-' + id);
    if (!host) return;
    if (id === 'correos')        paintCorreos(host);
    else if (id === 'vuelos')    paintVuelos(host);
    else if (id === 'mapa')      paintMapa(host);
    else if (id === 'conductor') paintConductor(host);
    else if (id === 'alertas')   paintAlertas(host);
    else if (id === 'touroperadores') paintTouroperadores(host);
  }

  /* ======================================================================
     TAB 3 — MAPA GPS  (ancla visual, se construye primero)
     ====================================================================== */
  const mapState = { selectedVeh: null, dispatchFilter: 'todos' };

  function paintMapa(host) {
    if (painted.mapa) return;
    painted.mapa = true;
    host.innerHTML = '<div class="map-layout">'
      + '<div class="card" style="padding:0;overflow:hidden">'
      +   '<div class="map-wrap">' + mapSvg() + mapLegend() + '<div class="map-tooltip" id="map-tt"></div></div>'
      + '</div>'
      + '<div class="card dispatch" id="dispatch"></div>'
      + '</div>';
    buildDispatch();
    bindMapEvents();
  }

  function mapSvg() {
    const M = D.MAPA;
    let s = '<svg class="map-svg" viewBox="0 0 ' + M.ancho + ' ' + M.alto + '" preserveAspectRatio="xMidYMid meet">';

    // Carreteras
    D.CARRETERAS.forEach(function (r) { s += '<path class="map-road" d="' + r.d + '"><title>' + CT.escape(r.nombre) + '</title></path>'; });

    // Rutas activas (aeropuerto → vehículo)
    D.VEHICULOS_MAPA.forEach(function (vm) {
      if (D.RUTAS_ACTIVAS.indexOf(vm.vehiculo_id) === -1) return;
      s += '<line class="map-route" x1="' + M.puj.x + '" y1="' + M.puj.y + '" x2="' + vm.x + '" y2="' + vm.y + '" />';
    });

    // Hoteles
    D.HOTELES.forEach(function (h) {
      s += '<g class="map-hotel-g">'
        + '<rect class="map-hotel-rect" x="' + (h.x - 7) + '" y="' + (h.y - 7) + '" width="14" height="14" rx="4" />'
        + '<text class="map-hotel-label" x="' + (h.x + 11) + '" y="' + (h.y + 4) + '">' + CT.escape(shortHotel(h.nombre)) + '</text>'
        + '<title>' + CT.escape(h.nombre) + ' · ' + CT.escape(h.zona) + '</title>'
        + '</g>';
    });

    // Aeropuerto PUJ
    s += '<g>'
      + '<rect class="map-airport-rect" x="' + (M.puj.x - 46) + '" y="' + (M.puj.y - 20) + '" width="92" height="40" rx="8" />'
      + '<text class="map-airport-label" x="' + M.puj.x + '" y="' + (M.puj.y + 5) + '" text-anchor="middle">✈ PUJ</text>'
      + '<title>Aeropuerto Internacional de Punta Cana</title>'
      + '</g>';

    // Vehículos
    D.VEHICULOS_MAPA.forEach(function (vm) {
      const c = CT.cond(CT.veh(vm.vehiculo_id) ? CT.veh(vm.vehiculo_id).conductor_asignado : null);
      s += '<g class="map-veh" data-veh="' + vm.vehiculo_id + '" data-svc="' + (vm.servicio_id || '') + '">'
        + '<circle class="mv-' + vm.estado_mapa + '" cx="' + vm.x + '" cy="' + vm.y + '" r="12" />'
        + '<text class="map-veh-label" x="' + vm.x + '" y="' + (vm.y + 3) + '">' + CT.escape(vm.vehiculo_id.replace(/^(MV|BUS|SUV|SED)-/, '')) + '</text>'
        + '</g>';
    });

    s += '</svg>';
    return s;
  }

  function shortHotel(nombre) {
    return nombre.length > 16 ? nombre.slice(0, 15) + '…' : nombre;
  }

  function mapLegend() {
    const items = [
      { c: 'var(--navy)', t: 'En ruta' },
      { c: 'var(--gold)', t: 'Standby' },
      { c: 'var(--teal)', t: 'Excursión' },
      { c: 'var(--coral)', t: 'Alerta' },
    ];
    return '<div class="map-legend">' + items.map(function (i) {
      return '<div class="ml-item"><span class="ml-dot" style="background:' + i.c + '"></span>' + i.t + '</div>';
    }).join('') + '</div>';
  }

  function buildDispatch() {
    const host = document.getElementById('dispatch');
    const filters = [
      { id: 'todos', label: 'Todos' },
      { id: 'en_curso', label: 'En curso' },
      { id: 'pendiente', label: 'Pendientes' },
      { id: 'completado', label: 'Completados' },
    ];
    host.innerHTML = '<div class="dispatch-tabs">' + filters.map(function (f) {
      return '<button class="dispatch-tab' + (f.id === mapState.dispatchFilter ? ' active' : '') + '" data-filter="' + f.id + '">' + f.label + '</button>';
    }).join('') + '</div><div class="dispatch-list" id="dispatch-list"></div>';

    CT.$$('.dispatch-tab', host).forEach(function (b) {
      b.addEventListener('click', function () {
        mapState.dispatchFilter = b.dataset.filter;
        CT.$$('.dispatch-tab', host).forEach(function (x) { x.classList.toggle('active', x === b); });
        renderDispatchList();
      });
    });
    renderDispatchList();
  }

  function renderDispatchList() {
    const host = document.getElementById('dispatch-list');
    const vehIds = D.VEHICULOS_MAPA.map(function (vm) { return vm.servicio_id; });
    let servicios = D.SERVICIOS.filter(function (s) { return vehIds.indexOf(s.id) !== -1; });
    if (mapState.dispatchFilter !== 'todos') {
      servicios = servicios.filter(function (s) { return s.estado === mapState.dispatchFilter; });
    }
    servicios.sort(function (a, b) { return a.hora_pickup.localeCompare(b.hora_pickup); });

    host.innerHTML = servicios.map(function (s) {
      return dispatchItem(s);
    }).join('') || '<div style="padding:30px;text-align:center;color:var(--text-light)">Sin servicios en este filtro</div>';

    CT.$$('.dispatch-item', host).forEach(function (node) {
      node.addEventListener('click', function () { selectFromDispatch(node.dataset.veh, node.dataset.svc); });
    });
  }

  function dispatchItem(s) {
    const origen = s.tipo === 'transfer_out' ? CT.hotelNombre(s.hotel_ids[0]) : (s.tipo === 'transfer_in' || s.tipo === 'privado' ? 'PUJ' : shortHotel(CT.hotelNombre(s.hotel_ids[0])));
    const destino = s.tipo === 'transfer_out' ? 'PUJ' : CT.hotelNombre(s.hotel_ids[s.hotel_ids.length - 1]);
    const sel = mapState.selectedVeh === s.vehiculo_id ? ' selected' : '';
    return '<div class="dispatch-item ' + s.estado + sel + '" data-veh="' + s.vehiculo_id + '" data-svc="' + s.id + '">'
      + '<div class="di-top">'
      +   '<span class="di-time">' + s.hora_pickup + '</span>'
      +   '<span class="badge ' + CT.estadoServicioBadge(s.estado) + '">' + CT.estadoServicioLabel(s.estado) + '</span>'
      + '</div>'
      + '<div class="di-route">' + CT.escape(shortHotel(origen)) + '<span class="arrow">→</span>' + CT.escape(shortHotel(destino)) + '</div>'
      + '<div class="di-badges">'
      +   '<span class="di-plate">' + s.vehiculo_id + '</span>'
      +   '<span class="badge badge-navy"><i class="fa-solid fa-user"></i> ' + CT.escape(firstName(CT.condNombre(s.conductor_id))) + '</span>'
      +   '<span class="badge badge-gray"><i class="fa-solid fa-users"></i> ' + s.pax + '</span>'
      + '</div>'
      + '</div>';
  }

  function firstName(n) { return String(n).split(' ').slice(0, 2).join(' '); }

  function bindMapEvents() {
    const svg = CT.$('#ops-mapa .map-svg');
    const tt = document.getElementById('map-tt');
    CT.$$('.map-veh', svg).forEach(function (g) {
      g.addEventListener('mouseenter', function (e) { showVehTooltip(g, tt); });
      g.addEventListener('mousemove', function (e) { moveTooltip(e, tt); });
      g.addEventListener('mouseleave', function () { tt.classList.remove('show'); });
      g.addEventListener('click', function () { selectFromMap(g.dataset.veh, g.dataset.svc); });
    });
  }

  function showVehTooltip(g, tt) {
    const vehId = g.dataset.veh, svcId = g.dataset.svc;
    const v = CT.veh(vehId), s = CT.svc(svcId);
    const c = s ? CT.cond(s.conductor_id) : (v ? CT.cond(v.conductor_asignado) : null);
    let lines = '';
    if (v) lines += '<div class="tt-line">' + CT.escape(D.TIPO_VEHICULO_LABEL[v.tipo]) + ' · ' + CT.escape(v.modelo) + '</div>';
    if (c) lines += '<div class="tt-line"><i class="fa-solid fa-user"></i> ' + CT.escape(c.nombre) + '</div>';
    if (s) {
      const dest = s.tipo === 'transfer_out' ? 'PUJ' : CT.hotelNombre(s.hotel_ids[s.hotel_ids.length - 1]);
      lines += '<div class="tt-line"><i class="fa-solid fa-location-dot"></i> ' + CT.escape(dest) + ' · ' + s.pax + ' pax</div>';
      lines += '<div class="tt-line"><i class="fa-regular fa-clock"></i> Pickup ' + s.hora_pickup + '</div>';
    }
    tt.innerHTML = '<div class="tt-title">' + vehId + '</div>' + lines;
    tt.classList.add('show');
  }

  function moveTooltip(e, tt) {
    const wrap = CT.$('#ops-mapa .map-wrap');
    const r = wrap.getBoundingClientRect();
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
    if (x + 240 > r.width) x = r.width - 244;
    tt.style.left = x + 'px'; tt.style.top = y + 'px';
  }

  function selectFromMap(vehId, svcId) {
    mapState.selectedVeh = vehId;
    highlightVeh(vehId);
    renderDispatchList();
    const item = CT.$('.dispatch-item[data-veh="' + vehId + '"]');
    if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function selectFromDispatch(vehId, svcId) {
    mapState.selectedVeh = vehId;
    highlightVeh(vehId);
    renderDispatchList();
  }

  function highlightVeh(vehId) {
    CT.$$('#ops-mapa .map-veh').forEach(function (g) { g.classList.toggle('selected', g.dataset.veh === vehId); });
  }

  /* ======================================================================
     TAB 2 — VUELOS (FIDS)
     ====================================================================== */
  const vuelosState = { filter: 'llegadas' };

  function paintVuelos(host) {
    if (painted.vuelos) return;
    painted.vuelos = true;
    host.innerHTML = '<div class="fids-layout">'
      + '<div>'
      +   '<div class="fids-subtabs" id="fids-subtabs"></div>'
      +   '<div class="fids-board"><table class="fids-table" id="fids-table"></table></div>'
      + '</div>'
      + '<div class="card fids-side" id="fids-side"></div>'
      + '</div>';

    const sub = document.getElementById('fids-subtabs');
    const nLleg = D.VUELOS.filter(function (v) { return v.tipo === 'llegada'; }).length;
    const nSal = D.VUELOS.filter(function (v) { return v.tipo === 'salida'; }).length;
    const subtabs = [
      { id: 'llegadas', label: 'Llegadas', c: nLleg },
      { id: 'salidas', label: 'Salidas', c: nSal },
      { id: 'todos', label: 'Todos', c: D.VUELOS.length },
    ];
    sub.innerHTML = subtabs.map(function (t) {
      return '<button class="fids-subtab' + (t.id === vuelosState.filter ? ' active' : '') + '" data-f="' + t.id + '">' + t.label + '<span class="c">(' + t.c + ')</span></button>';
    }).join('');
    CT.$$('.fids-subtab', sub).forEach(function (b) {
      b.addEventListener('click', function () {
        vuelosState.filter = b.dataset.f;
        CT.$$('.fids-subtab', sub).forEach(function (x) { x.classList.toggle('active', x === b); });
        renderFidsTable();
      });
    });
    renderFidsSide();
    renderFidsTable();
  }

  function renderFidsTable() {
    const table = document.getElementById('fids-table');
    let vuelos = D.VUELOS.slice();
    if (vuelosState.filter === 'llegadas') vuelos = vuelos.filter(function (v) { return v.tipo === 'llegada'; });
    else if (vuelosState.filter === 'salidas') vuelos = vuelos.filter(function (v) { return v.tipo === 'salida'; });
    vuelos.sort(function (a, b) { return a.hora_programada.localeCompare(b.hora_programada); });

    const head = '<thead><tr>'
      + '<th>Hora</th><th>Vuelo</th><th>Aerolínea</th><th>Origen/Destino</th>'
      + '<th>Pax Transfer</th><th>Estado</th><th>Vehículos</th>'
      + '</tr></thead>';

    const body = '<tbody>' + vuelos.map(function (v) {
      return fidsRow(v);
    }).join('') + '</tbody>';
    table.innerHTML = head + body;

    // Tooltip en badges de vehículo
    CT.$$('.veh-badge', table).forEach(function (b) {
      b.title = vehBadgeTitle(b.dataset.svc);
    });
  }

  function fidsRow(v) {
    const ruta = v.tipo === 'llegada' ? v.origen : v.destino;
    const rutaIco = v.tipo === 'llegada' ? '↓ ' : '↑ ';
    const pax = v.tipo === 'llegada' ? v.pax_transfer : v.pax_checkout;
    const vehs = vehiculosDeVuelo(v.id);
    const vehHtml = vehs.length
      ? vehs.map(function (s) { return '<span class="veh-badge" data-svc="' + s.id + '">' + s.vehiculo_id + '</span>'; }).join('')
      : '<span class="fids-dash">—</span>';

    return '<tr class="fids-row-' + v.estado + '">'
      + '<td class="f-time">' + v.hora_estimada + '</td>'
      + '<td class="f-num">' + CT.escape(v.numero) + '</td>'
      + '<td class="fids-airline">' + CT.escape(v.aerolinea) + '</td>'
      + '<td class="fids-route">' + rutaIco + CT.escape(ruta) + '</td>'
      + '<td class="fids-pax">' + (pax || 0) + '</td>'
      + '<td>' + fidsStatus(v) + '</td>'
      + '<td>' + vehHtml + '</td>'
      + '</tr>';
  }

  function fidsStatus(v) {
    const label = D.ESTADO_VUELO_LABEL[v.estado] || v.estado;
    let extra = '';
    if (v.estado === 'retrasado') {
      const diff = toMin(v.hora_estimada) - toMin(v.hora_programada);
      extra = '<span class="f-delay">+' + diff + ' min</span>';
    }
    let ico = '';
    if (v.estado === 'en_vuelo') ico = '<span class="plane-anim"><i class="fa-solid fa-plane"></i></span> ';
    else if (v.estado === 'aterrizado') ico = '<i class="fa-solid fa-plane-arrival"></i> ';
    else if (v.estado === 'cancelado') ico = '<i class="fa-solid fa-ban"></i> ';
    else if (v.estado === 'retrasado') ico = '<i class="fa-solid fa-clock"></i> ';
    return '<span class="fids-status fs-' + v.estado + '">' + ico + label + '</span>' + extra;
  }

  function vehiculosDeVuelo(vueloId) {
    return D.SERVICIOS.filter(function (s) { return s.vuelo_id === vueloId && s.estado !== 'cancelado'; });
  }

  function vehBadgeTitle(svcId) {
    const s = CT.svc(svcId);
    if (!s) return '';
    const dest = s.tipo === 'transfer_out' ? 'PUJ' : CT.hotelNombre(s.hotel_ids[s.hotel_ids.length - 1]);
    return CT.condNombre(s.conductor_id) + ' · ' + s.pax + ' pax · ' + dest;
  }

  function toMin(hhmm) { const p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }

  function renderFidsSide() {
    const host = document.getElementById('fids-side');
    const paxEsperados = D.VUELOS.reduce(function (a, v) { return a + (v.tipo === 'llegada' ? v.pax_transfer : (v.pax_checkout || 0)); }, 0);
    const preasignados = new Set();
    D.SERVICIOS.forEach(function (s) { if (s.vuelo_id && s.estado !== 'cancelado') preasignados.add(s.vehiculo_id); });
    const enVuelo = D.VUELOS.filter(function (v) { return v.estado === 'en_vuelo'; });
    const prox = enVuelo.length ? enVuelo[0] : D.VUELOS.filter(function (v) { return v.estado === 'programado' && v.tipo === 'llegada'; })[0];

    const stats = [
      { l: 'Total vuelos hoy', v: D.VUELOS.length, s: '12 llegadas · 8 salidas' },
      { l: 'Pax esperados', v: paxEsperados, s: 'transfer in + out' },
      { l: 'Vehículos pre-asignados', v: preasignados.size + ' de ' + D.KPI_HOY.vehiculos_operativos, s: 'de la flota operativa' },
      { l: 'Próximo vuelo', v: prox ? prox.numero : '—', s: prox ? ('ETA ' + prox.hora_estimada + ' · ' + prox.origen) : '' },
      { l: 'Alertas de vuelo', v: '2', s: '1 retrasado · 1 cancelado' },
    ];
    host.innerHTML = '<div class="card-head"><span class="card-title">Resumen del día</span></div>'
      + stats.map(function (s) {
        return '<div class="side-stat"><div class="ss-label">' + s.l + '</div><div class="ss-value">' + s.v + '</div>' + (s.s ? '<div class="ss-sub">' + s.s + '</div>' : '') + '</div>';
      }).join('');
  }

  /* ======================================================================
     TAB 1 — CORREOS TO
     ====================================================================== */
  const correoState = { selected: null, generated: {} };

  function paintCorreos(host) {
    if (painted.correos) return;
    painted.correos = true;
    host.innerHTML = '<div class="mail-layout">'
      + '<div class="card mail-list" id="mail-list"></div>'
      + '<div class="card mail-detail" id="mail-detail"></div>'
      + '</div>';
    renderMailList();
    renderMailDetail(null);
  }

  function renderMailList() {
    const host = document.getElementById('mail-list');
    const nNuevos = D.CORREOS.filter(function (m) { return m.estado === 'nuevo'; }).length;
    let html = '<div class="mail-list-head"><span class="card-title">Bandeja operativa</span>'
      + '<span class="badge badge-navy">' + nNuevos + ' sin leer</span></div>';
    html += D.CORREOS.map(function (m) { return mailItem(m); }).join('');
    host.innerHTML = html;
    CT.$$('.mail-item', host).forEach(function (node) {
      node.addEventListener('click', function () { selectMail(node.dataset.mail); });
    });
  }

  function mailItem(m) {
    const to = CT.to(m.touroperador_id);
    const sel = correoState.selected === m.id ? ' active' : '';
    let tag = '';
    if (m.estado === 'con_problema') tag = '<span class="badge badge-coral"><i class="fa-solid fa-triangle-exclamation"></i> Problema</span>';
    else if (m.estado === 'procesado') tag = '<span class="badge badge-green"><i class="fa-solid fa-check"></i> Procesado</span>';
    else tag = '<span class="badge badge-navy">Nuevo</span>';
    const gen = correoState.generated[m.id] ? m.servicios_previstos : m.servicios_generados;
    const genTag = '<span class="badge badge-gray">' + gen + '/' + m.servicios_previstos + ' servicios</span>';

    return '<div class="mail-item ' + m.estado + sel + '" data-mail="' + m.id + '">'
      + '<div class="mail-avatar" style="background:' + to.color + '">' + CT.escape(sigla(to.nombre)) + '</div>'
      + '<div class="mail-meta">'
      +   '<div class="mail-from"><span class="to-name">' + CT.escape(to.nombre) + '</span><span class="m-time">' + m.hora + '</span></div>'
      +   '<div class="mail-subject truncate">' + CT.escape(m.asunto) + '</div>'
      +   '<div class="mail-preview truncate">' + CT.escape(m.preview) + '</div>'
      +   '<div class="mail-tags">' + tag + genTag + '</div>'
      + '</div>'
      + '</div>';
  }

  function sigla(nombre) {
    const p = nombre.split(' ');
    return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
  }

  function selectMail(id) {
    correoState.selected = id;
    CT.$$('.mail-item').forEach(function (n) { n.classList.toggle('active', n.dataset.mail === id); });
    renderMailDetail(D.CORREOS.find(function (m) { return m.id === id; }));
  }

  function renderMailDetail(m) {
    const host = document.getElementById('mail-detail');
    if (!m) {
      host.innerHTML = '<div class="mail-detail-empty"><div><i class="fa-solid fa-envelope-open"></i><div>Seleccione un correo para ver el detalle</div></div></div>';
      return;
    }
    const to = CT.to(m.touroperador_id);
    const meta = m.meta.map(function (x) { return '<div><span class="k">' + CT.escape(x.k) + '</span><div class="v">' + CT.escape(x.v) + '</div></div>'; }).join('');
    const dist = m.distribucion.map(function (d) {
      return '<tr><td><b>' + CT.escape(d.hotel) + '</b></td><td class="num">' + d.pax + ' pax</td><td class="mono text-sub">' + CT.escape(d.ref) + '</td></tr>';
    }).join('');
    const cuerpo = m.cuerpo.map(function (l) { return l ? '<p>' + CT.escape(l) + '</p>' : '<p>&nbsp;</p>'; }).join('');
    const firma = '<div class="mail-signature">' + m.firma.map(CT.escape).join('<br>') + '</div>';

    const isGen = !!correoState.generated[m.id];
    let footHtml;
    if (isGen) {
      footHtml = '<span class="badge badge-green" style="font-size:12px"><i class="fa-solid fa-circle-check"></i> ' + m.servicios_previstos + ' servicios generados</span>'
        + '<button class="btn btn-secondary btn-sm" onclick="return false">Marcar como procesado</button>';
    } else {
      footHtml = '<button class="btn btn-primary" id="btn-gen"><i class="fa-solid fa-bolt"></i> Generar Servicios</button>'
        + '<button class="btn btn-secondary" onclick="return false">Marcar como procesado</button>';
    }

    host.innerHTML = ''
      + '<div class="mail-d-head">'
      +   '<div class="mail-d-subject">' + CT.escape(m.asunto) + '</div>'
      +   '<div class="mail-d-meta">'
      +     '<div><b>De:</b> ' + CT.escape(m.de) + '</div>'
      +     '<div><b>Para:</b> ' + CT.escape(m.para) + '</div>'
      +     '<div><b>Fecha:</b> ' + D.EMPRESA.fecha_demo + ' · ' + m.hora + '</div>'
      +   '</div>'
      + '</div>'
      + '<div class="mail-d-body">'
      +   cuerpo
      +   '<div class="mail-info-grid">' + meta + '</div>'
      +   '<div class="section-label" style="margin-bottom:8px">Distribución por hotel</div>'
      +   '<table class="mail-dist-table"><thead><tr><th>Hotel</th><th>Pax</th><th>Referencia TO</th></tr></thead><tbody>' + dist + '</tbody></table>'
      +   '<div class="mail-req"><i class="fa-solid fa-truck"></i> ' + CT.escape(m.requerimiento) + '</div>'
      +   firma
      +   '<div id="gen-zone"></div>'
      + '</div>'
      + '<div class="mail-d-foot" id="mail-foot">' + footHtml + '</div>';

    if (isGen) renderGenResult(m);

    const btn = document.getElementById('btn-gen');
    if (btn) btn.addEventListener('click', function () { generateServices(m); });
  }

  function generateServices(m) {
    const foot = document.getElementById('mail-foot');
    foot.innerHTML = '<div class="gen-progress">'
      + '<div class="gen-label"><i class="fa-solid fa-gear fa-spin"></i> Generando servicios y asignando recursos…</div>'
      + '<div class="gen-bar-track"><div class="gen-bar-fill" id="gen-fill"></div></div>'
      + '</div>';
    const fill = document.getElementById('gen-fill');
    let p = 0;
    const iv = setInterval(function () {
      p += Math.random() * 9 + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(function () { finishGen(m); }, 250); }
      fill.style.width = p + '%';
    }, 90);
  }

  function finishGen(m) {
    correoState.generated[m.id] = true;
    renderMailDetail(m);
    renderMailList();
    selectHighlight(m.id);
  }

  function selectHighlight(id) {
    CT.$$('.mail-item').forEach(function (n) { n.classList.toggle('active', n.dataset.mail === id); });
  }

  function renderGenResult(m) {
    const zone = document.getElementById('gen-zone');
    if (!zone) return;
    const rows = m.sugerencias.map(function (sg, i) {
      const v = CT.veh(sg.vehiculo_id);
      return '<div class="gen-svc">'
        + '<div><div class="g-hotel">' + CT.escape(sg.hotel) + '</div>'
        + '<div class="g-detail">Pickup ' + sg.hora_pickup + ' · ' + sg.pax + ' pax · ' + CT.escape(v ? D.TIPO_VEHICULO_LABEL[v.tipo] : '') + '</div></div>'
        + '<div class="g-badges">'
        +   '<span class="di-plate">' + sg.vehiculo_id + '</span>'
        +   '<span class="badge badge-navy"><i class="fa-solid fa-user"></i> ' + CT.escape(firstName(CT.condNombre(sg.conductor_id))) + '</span>'
        + '</div>'
        + '</div>';
    }).join('');
    zone.innerHTML = '<div class="gen-result" style="padding:18px 0 0">'
      + '<div class="gen-result-head"><i class="fa-solid fa-circle-check"></i> ' + m.sugerencias.length + ' servicios generados con recursos sugeridos</div>'
      + rows + '</div>';
    zone.classList.add('fade-in');
  }

  /* ======================================================================
     TAB 5 — ALERTAS
     ====================================================================== */
  function paintAlertas(host) {
    if (painted.alertas) return;
    painted.alertas = true;

    const activas = D.ALERTAS.filter(function (a) { return a.estado === 'activa'; }).length;
    const enResol = D.ALERTAS.filter(function (a) { return a.estado === 'en_resolucion'; }).length;
    const resueltas = D.ALERTAS.filter(function (a) { return a.estado === 'resuelta' || a.estado === 'cerrada'; }).length;

    const counters = '<div class="alert-counters">'
      + '<div class="alert-counter activas"><span class="badge-pulse"></span><span class="ac-num">' + activas + '</span> Activas</div>'
      + '<div class="alert-counter resolucion"><i class="fa-solid fa-spinner"></i><span class="ac-num">' + enResol + '</span> En resolución</div>'
      + '<div class="alert-counter resueltas"><i class="fa-solid fa-check"></i><span class="ac-num">' + resueltas + '</span> Resueltas</div>'
      + '</div>';

    const ordered = D.ALERTAS.slice().sort(function (a, b) { return b.timestamp.localeCompare(a.timestamp); });
    const cards = ordered.map(function (a) { return alertCard(a); }).join('');

    host.innerHTML = counters
      + '<div class="alert-layout">'
      +   '<div>' + cards + '</div>'
      +   '<div class="card reassign-panel">'
      +     '<div class="card-head"><span class="card-title">Reasignaciones</span></div>'
      +     reassignPanel()
      +   '</div>'
      + '</div>';
  }

  function alertCard(a) {
    const ico = { vuelo_retrasado: 'fa-plane', vuelo_cancelado: 'fa-plane-slash', vehiculo_averiado: 'fa-car-burst', conductor_ausente: 'fa-user-slash', pax_no_show: 'fa-user-xmark' };
    const acciones = a.acciones.map(function (ac) {
      return '<div class="ac-action"><i class="fa-solid fa-circle-check"></i><span>' + CT.escape(ac) + '</span></div>';
    }).join('');
    const estadoBadge = {
      activa: '<span class="badge badge-coral">Activa</span>',
      en_resolucion: '<span class="badge badge-gold">En resolución</span>',
      resuelta: '<span class="badge badge-green">Resuelta</span>',
      cerrada: '<span class="badge badge-gray">Cerrada</span>',
    }[a.estado] || '';

    let botones = '';
    if (a.vuelo_id || a.tipo.indexOf('vuelo') === 0) botones = '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-list"></i> Ver servicios afectados</button><button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-phone"></i> Contactar TO</button>';
    else if (a.vehiculo_id) botones = '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-location-crosshairs"></i> Rastrear rescate</button><button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-wrench"></i> Ver mantenimiento</button>';
    else botones = '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-list"></i> Ver detalle</button>';

    return '<div class="alert-card sev-' + a.severidad + '">'
      + '<div class="ac-head">'
      +   '<div class="ac-ico sev-' + a.severidad + '"><i class="fa-solid ' + (ico[a.tipo] || 'fa-bell') + '"></i></div>'
      +   '<div class="ac-headmain">'
      +     '<div class="ac-sev sev-' + a.severidad + '" style="color:' + sevColor(a.severidad) + '">' + (D.SEVERIDAD_LABEL[a.severidad] || a.severidad) + ' · ' + estadoBadge + '</div>'
      +     '<div class="ac-title">' + CT.escape(a.titulo) + '</div>'
      +     '<div class="ac-desc">' + CT.escape(a.descripcion) + '</div>'
      +   '</div>'
      +   '<div class="ac-time">' + a.timestamp + '</div>'
      + '</div>'
      + '<div class="ac-auto-label"><i class="fa-solid fa-robot"></i> Acción automática del sistema</div>'
      + '<div class="ac-actions-list">' + acciones + '</div>'
      + '<div class="ac-foot">' + botones + '</div>'
      + '</div>';
  }

  function sevColor(s) {
    return { critica: '#dc2626', alta: '#c0552e', media: '#b9860b', baja: '#64748b' }[s] || '#64748b';
  }

  function reassignPanel() {
    return D.REASIGNACIONES.map(function (r) {
      const motivoLabel = { averiada: 'Vehículo averiado', ausente: 'Conductor ausente', cancelado: 'Vuelo cancelado' }[r.motivo] || r.motivo;
      return '<div class="rp-item">'
        + '<div class="rp-motivo"><i class="fa-solid fa-arrow-right-arrow-left"></i> ' + motivoLabel + '</div>'
        + '<div class="rp-flow">'
        +   '<div class="rp-node origen">' + CT.escape(r.origen) + '</div>'
        +   '<div class="rp-arrow"><i class="fa-solid fa-xmark" style="color:var(--coral)"></i> <i class="fa-solid fa-arrow-right"></i></div>'
        +   '<div class="rp-node destino">' + CT.escape(r.destino) + '</div>'
        + '</div>'
        + '<div class="rp-detail">' + CT.escape(r.detalle) + '</div>'
        + '</div>';
    }).join('');
  }

  /* ======================================================================
     TAB 6 — TOUROPERADORES
     ====================================================================== */
  function paintTouroperadores(host) {
    if (painted.touroperadores) return;
    painted.touroperadores = true;

    const activos = D.TOUROPERADORES.filter(function (t) { return t.estado === 'activo'; });
    const totalServ = activos.reduce(function (a, t) { return a + t.servicios_mes; }, 0);
    const totalCom = activos.reduce(function (a, t) { return a + ingresoMes(t); }, 0);
    const promCom = (activos.reduce(function (a, t) { return a + t.comision_pct; }, 0) / activos.length).toFixed(1);
    const mejorVol = activos.slice().sort(function (a, b) { return b.servicios_mes - a.servicios_mes; })[0];
    const mejorCom = activos.slice().sort(function (a, b) { return b.comision_pct - a.comision_pct; })[0];

    const strip = [
      { l: 'Total servicios/mes', v: totalServ, s: 'touroperadores activos' },
      { l: 'Comisiones/mes', v: CT.money(totalCom), s: 'USD estimado' },
      { l: 'TO activos', v: activos.length, s: 'de ' + D.TOUROPERADORES.length + ' registrados' },
      { l: 'Promedio comisión', v: promCom + '%', s: 'sobre servicios' },
      { l: 'Mejor por volumen', v: sigla(mejorVol.nombre), s: mejorVol.nombre.split(' ')[0] + ' · ' + mejorVol.servicios_mes },
      { l: 'Mejor por comisión', v: mejorCom.comision_pct + '%', s: mejorCom.nombre.split(' ')[0] },
    ];
    const stripHtml = '<div class="to-kpi-strip">' + strip.map(function (s) {
      return '<div class="to-mini"><div class="tm-label">' + s.l + '</div><div class="tm-value">' + s.v + '</div><div class="tm-sub">' + s.s + '</div></div>';
    }).join('') + '</div>';

    const ordered = D.TOUROPERADORES.slice().sort(function (a, b) {
      if (a.estado !== b.estado) return a.estado === 'activo' ? -1 : 1;
      return b.servicios_mes - a.servicios_mes;
    });
    const grid = '<div class="to-grid">' + ordered.map(function (t) { return toCard(t); }).join('') + '</div>';

    host.innerHTML = stripHtml + grid + rankTable();
  }

  function ingresoMes(t) { return Math.round(t.servicios_mes * (t.comision_pct / 100) * 240); }
  function costoOperativo(t) { return Math.round(t.servicios_mes * 14); }

  function toCard(t) {
    const inactivo = t.estado !== 'activo';
    const cuotaPct = Math.min(100, Math.round(t.servicios_mes / t.cuota_mes * 100));
    const barColor = t.estado === 'activo' ? 'linear-gradient(90deg,var(--teal),var(--teal-light))' : 'var(--border-md)';
    return '<div class="to-card' + (inactivo ? ' inactivo' : '') + '">'
      + '<div class="to-card-head">'
      +   '<div class="to-logo" style="background:' + t.color + '"><i class="fa-solid fa-building"></i></div>'
      +   '<div><div class="to-name">' + CT.escape(t.nombre) + '</div>'
      +     '<div class="to-sub">' + CT.escape(t.pais) + ' · ' + (inactivo ? '<span style="color:var(--coral);font-weight:700">Inactivo</span>' : 'Activo desde ' + t.cliente_desde) + '</div></div>'
      + '</div>'
      + '<div class="to-metrics">'
      +   toMetric('Servicios/mes', t.servicios_mes)
      +   toMetric('Comisión', t.comision_pct + '%')
      +   toMetric('Ingresos/mes', CT.moneyUsd(ingresoMes(t)))
      +   toMetric('Puntualidad', t.puntualidad + '%')
      + '</div>'
      + '<div class="to-contact"><i class="fa-solid fa-envelope"></i> ' + CT.escape(t.contacto) + '</div>'
      + '<div class="to-actions">'
      +   '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-chart-line"></i> Ver historial</button>'
      +   '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-envelope"></i> Contactar</button>'
      + '</div>'
      + '<div class="to-quota-label"><span>Cuota del mes</span><span>' + t.servicios_mes + '/' + t.cuota_mes + '</span></div>'
      + '<div class="to-quota-track"><div class="to-quota-fill" style="width:' + cuotaPct + '%;background:' + barColor + '"></div></div>'
      + '</div>';
  }

  function toMetric(k, v) {
    return '<div class="to-metric"><span class="m-k">' + k + '</span><span class="m-v">' + v + '</span></div>';
  }

  function rankTable() {
    const ranked = D.TOUROPERADORES.filter(function (t) { return t.estado === 'activo'; })
      .map(function (t) { return { t: t, rent: ingresoMes(t) - costoOperativo(t) }; })
      .sort(function (a, b) { return b.rent - a.rent; });
    const rows = ranked.map(function (r, i) {
      const posCls = i === 0 ? 'rank-pos gold' : 'rank-pos';
      return '<tr>'
        + '<td><span class="' + posCls + '">' + (i + 1) + '</span></td>'
        + '<td><b>' + CT.escape(r.t.nombre) + '</b></td>'
        + '<td>' + CT.escape(r.t.pais) + '</td>'
        + '<td class="r">' + r.t.servicios_mes + '</td>'
        + '<td class="r">' + CT.money(ingresoMes(r.t)) + '</td>'
        + '<td class="r text-sub">' + CT.money(costoOperativo(r.t)) + '</td>'
        + '<td class="r" style="color:var(--green)">' + CT.money(r.rent) + '</td>'
        + '</tr>';
    }).join('');
    return '<div class="card"><div class="card-head"><span class="card-title">Ranking por rentabilidad</span><span class="sub">Ingresos menos costo operativo estimado</span></div>'
      + '<table class="to-rank-table"><thead><tr>'
      + '<th>#</th><th>Touroperador</th><th>País</th><th class="r">Serv/mes</th><th class="r">Ingresos</th><th class="r">Costo op.</th><th class="r">Rentabilidad</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ======================================================================
     TAB 4 — VISTA CONDUCTOR
     ====================================================================== */
  const driverState = { current: D.CONDUCTORES_DEMO[0] };

  function paintConductor(host) {
    if (painted.conductor) return;
    painted.conductor = true;
    const options = D.CONDUCTORES_DEMO.map(function (id) {
      const c = CT.cond(id);
      return '<option value="' + id + '">' + CT.escape(c.nombre) + ' · ' + id + '</option>';
    }).join('');
    host.innerHTML = '<div class="driver-view">'
      + '<div class="driver-select"><label>Conductor:</label>'
      +   '<select id="driver-select">' + options + '</select></div>'
      + '<div class="phone"><div class="phone-screen" id="phone-screen"></div></div>'
      + '</div>';
    document.getElementById('driver-select').addEventListener('change', function (e) {
      driverState.current = e.target.value;
      renderPhone();
    });
    renderPhone();
  }

  function serviciosDeConductor(condId) {
    return D.SERVICIOS.filter(function (s) { return s.conductor_id === condId && s.estado !== 'cancelado'; })
      .sort(function (a, b) { return a.hora_pickup.localeCompare(b.hora_pickup); });
  }

  function renderPhone() {
    const screen = document.getElementById('phone-screen');
    const c = CT.cond(driverState.current);
    const servicios = serviciosDeConductor(c.id);
    // Servicio actual = primero en curso, si no el primero pendiente, si no el último
    let actual = servicios.filter(function (s) { return s.estado === 'en_curso'; })[0]
      || servicios.filter(function (s) { return s.estado === 'pendiente'; })[0]
      || servicios[0];
    const proximos = servicios.filter(function (s) { return s !== actual; });

    screen.innerHTML = ''
      + '<div class="phone-notch"></div>'
      + '<div class="phone-statusbar"><span>' + nowHM() + '</span>'
      +   '<span class="ps-icons"><i class="fa-solid fa-signal"></i><i class="fa-solid fa-wifi"></i><i class="fa-solid fa-battery-three-quarters"></i></span></div>'
      + '<div class="phone-appbar">'
      +   '<div class="pa-logo"><i class="fa-solid fa-bus"></i></div>'
      +   '<div><div class="pa-title">Mi Turno</div><div class="pa-sub">CaribeTrans Conductores</div></div>'
      +   '<div class="phone-turno">' + turnoCorto(c.turno_actual) + '</div>'
      + '</div>'
      + '<div class="phone-body">'
      +   '<div class="phone-driver-name">Conductor · <b>' + CT.escape(c.nombre) + '</b> · ' + c.servicios_completados_hoy + ' completados hoy</div>'
      +   (actual ? svcCurrentCard(actual) : '<div style="padding:30px;text-align:center;color:var(--text-light)">Sin servicios asignados hoy</div>')
      +   (proximos.length ? '<div class="svc-next-label">Próximos servicios (' + proximos.length + ')</div>' + proximos.map(svcNextCard).join('') : '')
      + '</div>'
      + '<div class="phone-tabbar">'
      +   phoneTab('fa-list-check', 'Mi Turno', true)
      +   phoneTab('fa-clock-rotate-left', 'Historial', false)
      +   phoneTab('fa-triangle-exclamation', 'Reportar', false)
      +   phoneTab('fa-user', 'Perfil', false)
      + '</div>';

    CT.$$('.svc-next', screen).forEach(function (node) {
      node.addEventListener('click', function () {
        const s = CT.svc(node.dataset.svc);
        expandNext(screen, s, c, servicios);
      });
    });
  }

  function expandNext(screen, svc, c, servicios) {
    const proximos = servicios.filter(function (s) { return s !== svc; });
    const body = CT.$('.phone-body', screen);
    body.innerHTML = '<div class="phone-driver-name">Conductor · <b>' + CT.escape(c.nombre) + '</b> · ' + c.servicios_completados_hoy + ' completados hoy</div>'
      + svcCurrentCard(svc)
      + (proximos.length ? '<div class="svc-next-label">Otros servicios (' + proximos.length + ')</div>' + proximos.map(svcNextCard).join('') : '');
    CT.$$('.svc-next', screen).forEach(function (node) {
      node.addEventListener('click', function () { expandNext(screen, CT.svc(node.dataset.svc), c, servicios); });
    });
  }

  function svcCurrentCard(s) {
    const origen = s.tipo === 'transfer_out' ? CT.hotelNombre(s.hotel_ids[0]) : 'PUJ (aeropuerto)';
    const destino = s.tipo === 'transfer_out' ? 'PUJ (aeropuerto)' : CT.hotelNombre(s.hotel_ids[s.hotel_ids.length - 1]);
    const vuelo = s.vuelo_id ? CT.vuelo(s.vuelo_id) : null;
    const titulo = CT.tipoServicioLabel(s.tipo) + (vuelo ? ' — ' + vuelo.numero : '');
    const dot = CT.estadoServicioDot(s.estado);
    return '<div class="svc-current">'
      + '<div class="sc-state"><span class="status-dot ' + dot + '"></span> ' + CT.estadoServicioLabel(s.estado).toUpperCase() + '</div>'
      + '<div class="sc-title">' + CT.escape(titulo) + '</div>'
      + '<div class="sc-route">' + CT.escape(origen) + ' → ' + CT.escape(destino) + '</div>'
      + '<div class="svc-info">'
      +   '<div class="si-row"><i class="fa-solid fa-users"></i> ' + s.pax + ' pasajeros</div>'
      +   '<div class="si-row"><i class="fa-regular fa-clock"></i> Pickup: <span class="mono">' + s.hora_pickup + '</span> &nbsp;|&nbsp; ETA: <span class="mono">' + s.hora_entrega_estimada + '</span></div>'
      +   '<div class="si-row"><i class="fa-solid fa-clipboard-list"></i> Ref: <span class="mono">' + CT.escape(s.referencia_to) + '</span></div>'
      +   '<div class="si-row"><i class="fa-solid fa-van-shuttle"></i> <span class="mono">' + s.vehiculo_id + '</span></div>'
      + '</div>'
      + '<div class="svc-actions">'
      +   '<button class="btn btn-teal btn-sm" onclick="return false"><i class="fa-solid fa-check"></i> Confirmar Llegada</button>'
      +   '<button class="btn btn-secondary btn-sm" onclick="return false"><i class="fa-solid fa-triangle-exclamation"></i> Reportar</button>'
      + '</div>'
      + '</div>';
  }

  function svcNextCard(s) {
    const destino = s.tipo === 'transfer_out' ? 'PUJ' : shortHotel(CT.hotelNombre(s.hotel_ids[s.hotel_ids.length - 1]));
    const origen = s.tipo === 'transfer_out' ? shortHotel(CT.hotelNombre(s.hotel_ids[0])) : 'PUJ';
    return '<div class="svc-next" data-svc="' + s.id + '">'
      + '<div class="sn-time">' + s.hora_pickup + '</div>'
      + '<div class="sn-body"><div class="sn-type">' + CT.tipoServicioLabel(s.tipo) + '</div>'
      +   '<div class="sn-route">' + CT.escape(origen) + ' → ' + CT.escape(destino) + '</div></div>'
      + '<div class="sn-pax"><i class="fa-solid fa-users"></i> ' + s.pax + '</div>'
      + '</div>';
  }

  function phoneTab(icon, label, active) {
    return '<div class="pt-item' + (active ? ' active' : '') + '"><i class="fa-solid ' + icon + '"></i>' + label + '</div>';
  }

  function turnoCorto(t) { return t.replace('Diurno · ', 'Turno Diurno<br>').replace('Nocturno · ', 'Turno Nocturno<br>').replace('Libre', 'Libre'); }
  function nowHM() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  window.CT_Operations = { render: render };
})();
