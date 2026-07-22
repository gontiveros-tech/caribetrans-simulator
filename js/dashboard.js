/* ==========================================================================
   CaribeTrans — Simulador Comercial
   dashboard.js — dashboard resumen (KPIs, charts, paneles inferiores)
   ========================================================================== */
(function () {
  'use strict';

  const D = window.CT_DATA;
  const CT = window.CT;
  let rendered = false;
  const charts = {};

  const COL = {
    navy: '#1a3a5c', teal: '#0e7490', gold: '#d4a017', coral: '#e07b54',
    tealLight: '#0891b2', border: '#e2e8f0', sub: '#64748b',
  };

  function render() {
    const host = document.getElementById('section-dashboard');
    if (!rendered) { buildMarkup(host); rendered = true; }
    // (Re)dibujar charts — Chart.js necesita el canvas visible
    requestAnimationFrame(function () {
      drawSparklines();
      drawServiciosChart();
      drawFlotaChart();
    });
  }

  /* ------------------------------------------------------------- Markup */
  function buildMarkup(host) {
    host.innerHTML = ''
      + header()
      + kpiGrid()
      + chartsRow()
      + bottomRow();
  }

  function header() {
    return ''
      + '<div class="section-header">'
      +   '<div>'
      +     '<div class="section-title">Dashboard</div>'
      +     '<div class="section-sub">Resumen operativo del día · ' + D.EMPRESA.fecha_demo + '</div>'
      +   '</div>'
      +   '<span class="live-chip"><span class="status-dot live"></span> Operación en vivo</span>'
      + '</div>';
  }

  function kpiGrid() {
    const k = D.KPI_HOY;
    const cards = [
      {
        cls: 'kpi-blue', icon: 'fa-route', label: 'Servicios Hoy',
        value: k.servicios_hoy, delta: '↑ 12% vs ayer', deltaCls: 'up', spark: 'servicios',
      },
      {
        cls: 'kpi-teal', icon: 'fa-bus', label: 'Flota Activa',
        value: k.vehiculos_operativos + '/' + k.vehiculos_total,
        delta: k.ocupacion_flota_pct + '% ocupación', deltaCls: 'neutral', spark: 'flota',
      },
      {
        cls: 'kpi-gold', icon: 'fa-dollar-sign', label: 'Ingresos del Día',
        value: CT.money(k.ingresos_dia_usd), delta: '↑ 8% vs promedio', deltaCls: 'up', spark: 'ingresos',
      },
      {
        cls: 'kpi-coral', icon: 'fa-triangle-exclamation', label: 'Alertas',
        value: k.alertas_activas + ' activas', delta: k.alertas_resueltas + ' resueltas hoy', deltaCls: 'neutral', spark: 'alertas',
      },
    ];
    return '<div class="kpi-grid">' + cards.map(function (c) {
      return ''
        + '<div class="kpi-card ' + c.cls + '">'
        +   '<div class="kpi-top">'
        +     '<div class="kpi-icon"><i class="fa-solid ' + c.icon + '"></i></div>'
        +     '<canvas class="kpi-spark" data-spark="' + c.spark + '"></canvas>'
        +   '</div>'
        +   '<div class="kpi-label">' + c.label + '</div>'
        +   '<div class="kpi-value">' + c.value + '</div>'
        +   '<div class="kpi-delta ' + c.deltaCls + '">' + c.delta + '</div>'
        + '</div>';
    }).join('') + '</div>';
  }

  function chartsRow() {
    return ''
      + '<div class="dash-charts">'
      +   '<div class="card">'
      +     '<div class="card-head"><span class="card-title">Servicios por Día</span><span class="sub">Últimos 7 días</span></div>'
      +     '<div class="card-pad"><div class="chart-box"><canvas id="chart-servicios"></canvas></div></div>'
      +   '</div>'
      +   '<div class="card">'
      +     '<div class="card-head"><span class="card-title">Distribución de Flota</span></div>'
      +     '<div class="chart-box doughnut-box"><canvas id="chart-flota"></canvas></div>'
      +     '<div class="doughnut-legend" id="flota-legend"></div>'
      +   '</div>'
      + '</div>';
  }

  function bottomRow() {
    return '<div class="dash-bottom">'
      + panelVuelos()
      + panelTouroperadores()
      + panelAlertas()
      + '</div>';
  }

  function panelVuelos() {
    const proximos = D.VUELOS
      .filter(function (v) { return v.tipo === 'llegada'; })
      .slice(0, 5);
    const rows = proximos.map(function (v) {
      const light = flightLight(v);
      return '<tr>'
        + '<td class="mono num">' + v.hora_estimada + '</td>'
        + '<td class="mono">' + CT.escape(v.numero) + '</td>'
        + '<td class="truncate" style="max-width:120px">' + CT.escape(v.aerolinea) + '</td>'
        + '<td>' + CT.escape(v.origen) + '</td>'
        + '<td class="num">' + v.pax_transfer + '</td>'
        + '<td><span class="flight-light ' + light.cls + '"></span> ' + light.label + '</td>'
        + '</tr>';
    }).join('');
    return card('Próximos Vuelos', 'fa-plane-arrival',
      '<table class="mini-table"><thead><tr>'
      + '<th>Hora</th><th>Vuelo</th><th>Aerolínea</th><th>Origen</th><th>Pax</th><th>Estado</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table>');
  }

  function flightLight(v) {
    if (v.estado === 'cancelado') return { cls: 'fl-black', label: 'Cancelado' };
    if (v.estado === 'aterrizado') return { cls: 'fl-green', label: 'Aterrizado' };
    if (v.estado === 'retrasado') {
      const diff = delayMin(v);
      return { cls: diff > 30 ? 'fl-red' : 'fl-amber', label: 'Retraso +' + diff + 'm' };
    }
    if (v.estado === 'en_vuelo') return { cls: 'fl-green', label: 'En vuelo' };
    return { cls: 'fl-gray', label: 'Programado' };
  }

  function delayMin(v) {
    const a = toMin(v.hora_programada), b = toMin(v.hora_estimada);
    return b - a;
  }
  function toMin(hhmm) { const p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }

  function panelTouroperadores() {
    const activos = D.TOUROPERADORES.filter(function (t) { return t.estado === 'activo'; }).slice(0, 5);
    const rows = activos.map(function (t) {
      const ingreso = Math.round(t.servicios_mes * (t.comision_pct / 100) * 240);
      return '<tr>'
        + '<td><b>' + CT.escape(t.nombre) + '</b><br><span class="text-light" style="font-size:11px">' + CT.escape(t.pais) + '</span></td>'
        + '<td class="num">' + t.servicios_mes + '</td>'
        + '<td class="num">' + CT.money(ingreso) + '</td>'
        + '</tr>';
    }).join('');
    return card('Touroperadores Activos', 'fa-handshake',
      '<table class="mini-table"><thead><tr>'
      + '<th>Touroperador</th><th>Serv/mes</th><th>Comisión mes</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table>');
  }

  function panelAlertas() {
    const items = D.ALERTAS.slice().sort(function (a, b) { return b.timestamp.localeCompare(a.timestamp); }).slice(0, 5);
    const ico = { vuelo_retrasado: 'fa-plane', vuelo_cancelado: 'fa-plane-slash', vehiculo_averiado: 'fa-car-burst', conductor_ausente: 'fa-user-slash', pax_no_show: 'fa-user-xmark' };
    const rows = items.map(function (a) {
      return '<div class="alert-row">'
        + '<div class="alert-ico ' + a.severidad + '"><i class="fa-solid ' + (ico[a.tipo] || 'fa-bell') + '"></i></div>'
        + '<div class="alert-body">'
        +   '<div class="a-title truncate">' + CT.escape(a.titulo) + '</div>'
        +   '<div class="a-desc truncate">' + CT.escape(a.descripcion) + '</div>'
        +   '<div class="a-time"><i class="fa-regular fa-clock"></i> ' + a.timestamp + ' · ' + (D.SEVERIDAD_LABEL[a.severidad] || a.severidad) + '</div>'
        + '</div></div>';
    }).join('');
    return card('Alertas Recientes', 'fa-triangle-exclamation', '<div class="alert-list">' + rows + '</div>');
  }

  function card(title, icon, body) {
    return '<div class="card">'
      + '<div class="card-head"><span class="card-title"><i class="fa-solid ' + icon + '" style="color:var(--teal);margin-right:8px"></i>' + title + '</span></div>'
      + body + '</div>';
  }

  /* ------------------------------------------------------------ Charts */
  function drawSparklines() {
    CT.$$('canvas.kpi-spark').forEach(function (cv) {
      const key = cv.dataset.spark;
      const data = D.SPARKLINES[key] || [];
      const color = { servicios: COL.navy, flota: COL.teal, ingresos: COL.gold, alertas: COL.coral }[key] || COL.teal;
      if (charts['sp-' + key]) charts['sp-' + key].destroy();
      charts['sp-' + key] = new Chart(cv, {
        type: 'line',
        data: {
          labels: data.map(function (_, i) { return i; }),
          datasets: [{
            data: data, borderColor: color, borderWidth: 2,
            fill: true, backgroundColor: hexA(color, .12),
            tension: .4, pointRadius: 0,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: false,
        },
      });
    });
  }

  function drawServiciosChart() {
    const cv = document.getElementById('chart-servicios');
    if (!cv) return;
    if (charts.servicios) charts.servicios.destroy();
    charts.servicios = new Chart(cv, {
      type: 'bar',
      data: {
        labels: D.KPI_SEMANA.map(function (d) { return d.dia; }),
        datasets: [
          { label: 'Aeropuerto', data: D.KPI_SEMANA.map(function (d) { return d.aeropuerto; }), backgroundColor: COL.navy, borderRadius: 4 },
          { label: 'Hotel',      data: D.KPI_SEMANA.map(function (d) { return d.hotel; }),      backgroundColor: COL.teal, borderRadius: 4 },
          { label: 'Excursión',  data: D.KPI_SEMANA.map(function (d) { return d.excursion; }),  backgroundColor: COL.gold, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } },
          tooltip: tooltipNavy(),
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 12 } } },
          y: { stacked: true, grid: { color: COL.border }, ticks: { font: { size: 11 }, color: COL.sub }, beginAtZero: true },
        },
      },
    });
  }

  function drawFlotaChart() {
    const cv = document.getElementById('chart-flota');
    if (!cv) return;
    const conteo = { minivan: 0, autobus: 0, suv: 0, sedan: 0 };
    D.VEHICULOS.forEach(function (v) { conteo[v.tipo]++; });
    const segs = [
      { label: 'Minivans',  val: conteo.minivan, color: COL.navy },
      { label: 'Autobuses', val: conteo.autobus, color: COL.teal },
      { label: 'SUVs',      val: conteo.suv,     color: COL.gold },
      { label: 'Sedanes',   val: conteo.sedan,   color: COL.coral },
    ];
    if (charts.flota) charts.flota.destroy();
    charts.flota = new Chart(cv, {
      type: 'doughnut',
      data: {
        labels: segs.map(function (s) { return s.label; }),
        datasets: [{ data: segs.map(function (s) { return s.val; }), backgroundColor: segs.map(function (s) { return s.color; }), borderWidth: 0, cutout: '68%' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipNavy() },
      },
    });
    // Leyenda manual
    const legend = document.getElementById('flota-legend');
    legend.innerHTML = segs.map(function (s) {
      return '<div class="dl-item"><span class="dl-dot" style="background:' + s.color + '"></span>'
        + '<span class="dl-name">' + s.label + '</span><span class="dl-val">' + s.val + '</span></div>';
    }).join('');
  }

  function tooltipNavy() {
    return {
      backgroundColor: COL.navy, titleColor: '#fff', bodyColor: '#e2e8f0',
      padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4,
      titleFont: { family: 'Poppins', size: 13 }, bodyFont: { size: 12 },
    };
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  window.CT_Dashboard = { render: render };
})();
