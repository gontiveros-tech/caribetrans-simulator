# Instrucción: Simulador Comercial CaribeTrans

## Meta

| Campo | Valor |
|-------|-------|
| Producto | Demo comercial offline para venta de sistema de transporte turístico |
| Repo | `caribetrans-simulator` (standalone, NO es módulo del sistema principal) |
| Tech | HTML + CSS + JS vanilla, Chart.js 4.x, Font Awesome 6.5, Google Fonts (Inter + Poppins) |
| Backend | Ninguno. 100% offline. Datos pregenerados en JS |
| Audiencia | El Don abre esto en laptop frente a un prospecto (operador de transporte turístico en RD) |
| Referencia visual | `caribetrans-mockup.zip` (Manus): paleta, layout, componentes |
| Modelo de ejecución | Claude Code (Opus 4.8) |
| Gobernanza | Instrucción + gates de verificación. NO es DEVA (no hay regresión, no hay auditoría adversarial) |

---

## 0. Estructura del proyecto

```
caribetrans-simulator/
├── index.html          ← documento único, toda la app
├── css/
│   └── style.css       ← estilos completos
├── js/
│   ├── data.js         ← todos los datos sintéticos pregenerados
│   ├── app.js          ← navegación, inicialización, utilidades
│   ├── dashboard.js    ← lógica del dashboard resumen
│   └── operations.js   ← centro de operaciones (las 6 piezas)
├── README.md
└── .gitignore
```

**Regla:** un solo `index.html`. No hay múltiples páginas. Navegación por secciones con `display:none/block`. Los JS se cargan como `<script>` al final del `<body>`.

---

## 1. Design System (extraído del mockup Manus)

### 1.1 Paleta de colores

```css
:root {
  --navy:       #1a3a5c;
  --navy-dark:  #122840;
  --navy-mid:   #1e4976;
  --teal:       #0e7490;
  --teal-light: #0891b2;
  --gold:       #d4a017;
  --gold-light: #f0b429;
  --coral:      #e07b54;
  --bg:         #f0f4f8;
  --bg-card:    #ffffff;
  --bg-sidebar: #1a3a5c;
  --text-main:  #1e293b;
  --text-sub:   #64748b;
  --text-light: #94a3b8;
  --border:     #e2e8f0;
  --border-md:  #cbd5e1;
  --shadow-sm:  0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
  --shadow-md:  0 4px 16px rgba(0,0,0,.10);
  --shadow-lg:  0 10px 40px rgba(0,0,0,.14);
  --radius:     12px;
  --radius-sm:  8px;
  --radius-lg:  16px;
  --transition: .22s cubic-bezier(.4,0,.2,1);
}
```

### 1.2 Tipografía

- **Headings:** Poppins 700/800
- **Body:** Inter 400/500/600/700
- **Base size:** 14px
- **KPI values:** Poppins 26px/800
- **Labels:** 11px uppercase, letter-spacing 0.5px
- **Section titles:** Poppins 22px/700

### 1.3 Componentes reutilizables

Copiar patrones exactos del mockup:

- **KPI card:** borde izquierdo 4px gradient, icono 48px en fondo tintado, sparkline canvas
- **Card genérica:** `border-radius: 12px`, `box-shadow: var(--shadow-sm)`, `border: 1px solid var(--border)`, hover `translateY(-2px)`
- **Botón primario:** gradient navy→navy-mid, `box-shadow: 0 2px 8px rgba(26,58,92,.25)`
- **Botón secundario:** fondo blanco, borde `--border-md`
- **Badge/pill:** `border-radius: 20px`, `padding: 3px 10px`, `font-size: 10px`, `font-weight: 700`
- **Status dot:** 8px, pulsante para "en vivo" (`animation: pulse-anim 1.5s infinite`)
- **Sidebar:** 260px, fondo `--navy`, logo con gradient navy→gold, nav items con `border-left: 3px solid var(--gold-light)` en activo
- **Topbar:** 64px, fondo blanco, sticky, breadcrumb + search + notificaciones + fecha

### 1.4 CDNs permitidos

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## 2. Datos sintéticos (`data.js`)

Todos los datos viven en `data.js` como constantes exportadas al scope global (`window.CT_DATA`). No hay fetch, no hay API, no hay localStorage.

### 2.1 Empresa demo

```js
const EMPRESA = {
  nombre: 'CaribeTrans',
  subtitulo: 'Punta Cana · República Dominicana',
  version: 'v3.1.0',
  fecha_demo: '22 de julio de 2026', // fecha fija para la demo
  usuario_demo: {
    nombre: 'Carlos Mejía',
    rol: 'Administrador',
    email: 'admin@caribetrans.com.do',
  },
};
```

### 2.2 Touroperadores (6 reales del mercado)

```js
const TOUROPERADORES = [
  { id: 'TO-001', nombre: 'TUI Group',         contacto: 'reservas@tui-rd.com',         comision_pct: 8,   servicios_mes: 180, estado: 'activo', pais: 'Alemania' },
  { id: 'TO-002', nombre: 'Apple Vacations',    contacto: 'ops@applevacations.com',       comision_pct: 10,  servicios_mes: 95,  estado: 'activo', pais: 'Estados Unidos' },
  { id: 'TO-003', nombre: 'Sunwing',            contacto: 'ground@sunwing.ca',            comision_pct: 9,   servicios_mes: 72,  estado: 'activo', pais: 'Canadá' },
  { id: 'TO-004', nombre: 'FTI Touristik',      contacto: 'transfers@fti.de',             comision_pct: 7,   servicios_mes: 45,  estado: 'activo', pais: 'Alemania' },
  { id: 'TO-005', nombre: 'Palladium Group',    contacto: 'transport@palladiumgroup.com',  comision_pct: 12,  servicios_mes: 110, estado: 'activo', pais: 'España' },
  { id: 'TO-006', nombre: 'Blue Diamond',       contacto: 'ground@bluediamondresorts.com', comision_pct: 11,  servicios_mes: 58,  estado: 'inactivo', pais: 'Canadá' },
];
```

### 2.3 Hoteles / puntos de recogida (12, zona Punta Cana)

```js
const HOTELES = [
  { id: 'H-01', nombre: 'Iberostar Grand Bávaro',       zona: 'Bávaro',       touroperador_id: 'TO-005', lat: 18.716, lng: -68.444 },
  { id: 'H-02', nombre: 'Barceló Bávaro Palace',        zona: 'Bávaro',       touroperador_id: 'TO-001', lat: 18.720, lng: -68.438 },
  { id: 'H-03', nombre: 'Hard Rock Hotel Punta Cana',   zona: 'Macao',        touroperador_id: 'TO-002', lat: 18.735, lng: -68.425 },
  { id: 'H-04', nombre: 'Cap Cana (Hyatt Ziva)',        zona: 'Cap Cana',     touroperador_id: 'TO-001', lat: 18.680, lng: -68.405 },
  { id: 'H-05', nombre: 'Majestic Elegance',            zona: 'Bávaro',       touroperador_id: 'TO-003', lat: 18.712, lng: -68.450 },
  { id: 'H-06', nombre: 'Zoëtry Agua Punta Cana',       zona: 'Uvero Alto',   touroperador_id: 'TO-004', lat: 18.760, lng: -68.395 },
  { id: 'H-07', nombre: 'Secrets Royal Beach',          zona: 'Bávaro',       touroperador_id: 'TO-002', lat: 18.722, lng: -68.441 },
  { id: 'H-08', nombre: 'Riu Palace Punta Cana',        zona: 'Arena Gorda',  touroperador_id: 'TO-001', lat: 18.728, lng: -68.432 },
  { id: 'H-09', nombre: 'Dreams Punta Cana',            zona: 'Bávaro',       touroperador_id: 'TO-005', lat: 18.718, lng: -68.446 },
  { id: 'H-10', nombre: 'Occidental Caribe',            zona: 'Bávaro',       touroperador_id: 'TO-003', lat: 18.714, lng: -68.448 },
  { id: 'H-11', nombre: 'Paradisus Palma Real',         zona: 'Bávaro',       touroperador_id: 'TO-004', lat: 18.725, lng: -68.435 },
  { id: 'H-12', nombre: 'Lopesan Costa Bávaro',         zona: 'Bávaro',       touroperador_id: 'TO-001', lat: 18.710, lng: -68.452 },
];
```

### 2.4 Vehículos (48 — flota realista)

Generar 48 vehículos con distribución:
- 18 minivans (Toyota HiAce 2021-2024, 12-15 pax)
- 14 autobuses (Mercedes Sprinter, Hyundai County, 20-45 pax)
- 10 SUVs (Toyota Land Cruiser, Hyundai Palisade, 6-7 pax)
- 6 sedanes (Toyota Camry, Hyundai Sonata, 3-4 pax)

Cada vehículo: `{ id, placa (formato RD: 'X000000'), tipo, modelo, año, capacidad_pax, conductor_asignado, estado ('operativo'|'mantenimiento'|'inactivo'), km, combustible_pct, prox_mantenimiento }`.

Estado: 41 operativos, 4 mantenimiento, 3 inactivos.

### 2.5 Conductores (60 — nombres dominicanos reales)

60 conductores con nombres dominicanos creíbles (no inventar apellidos absurdos). Cada uno: `{ id, nombre, cedula (formato '001-XXXXXXX-X'), tipo_licencia, telefono (formato '809-XXX-XXXX'), estado, vehiculo_asignado, turno_actual, ultima_posicion, servicios_completados_hoy }`.

### 2.6 Vuelos del día (20 vuelos — mezcla de llegadas y salidas)

```js
const VUELOS = [
  // Llegadas (12)
  { id: 'V-01', numero: 'AA 1582',    aerolinea: 'American Airlines',  tipo: 'llegada', hora_programada: '06:45', hora_estimada: '06:45', estado: 'aterrizado', origen: 'MIA', pax_total: 142, pax_transfer: 38, touroperador_id: 'TO-002' },
  { id: 'V-02', numero: 'UA 1744',    aerolinea: 'United Airlines',    tipo: 'llegada', hora_programada: '07:15', hora_estimada: '07:15', estado: 'aterrizado', origen: 'EWR', pax_total: 168, pax_transfer: 24, touroperador_id: 'TO-002' },
  { id: 'V-03', numero: 'DL 483',     aerolinea: 'Delta Air Lines',    tipo: 'llegada', hora_programada: '08:30', hora_estimada: '08:25', estado: 'aterrizado', origen: 'ATL', pax_total: 156, pax_transfer: 31, touroperador_id: 'TO-002' },
  { id: 'V-04', numero: 'WS 2618',    aerolinea: 'WestJet',            tipo: 'llegada', hora_programada: '09:40', hora_estimada: '09:55', estado: 'en_vuelo',   origen: 'YYZ', pax_total: 189, pax_transfer: 45, touroperador_id: 'TO-003' },
  { id: 'V-05', numero: 'X3 4412',    aerolinea: 'TUIfly',             tipo: 'llegada', hora_programada: '10:20', hora_estimada: '10:20', estado: 'en_vuelo',   origen: 'FRA', pax_total: 210, pax_transfer: 62, touroperador_id: 'TO-001' },
  { id: 'V-06', numero: 'DE 2156',    aerolinea: 'Condor',             tipo: 'llegada', hora_programada: '11:00', hora_estimada: '11:35', estado: 'retrasado',  origen: 'MUC', pax_total: 198, pax_transfer: 28, touroperador_id: 'TO-004' },
  { id: 'V-07', numero: 'B6 1239',    aerolinea: 'JetBlue',            tipo: 'llegada', hora_programada: '12:15', hora_estimada: '12:15', estado: 'programado', origen: 'JFK', pax_total: 150, pax_transfer: 19, touroperador_id: 'TO-002' },
  { id: 'V-08', numero: 'WG 4818',    aerolinea: 'Sunwing Airlines',   tipo: 'llegada', hora_programada: '13:30', hora_estimada: '13:30', estado: 'programado', origen: 'YUL', pax_total: 176, pax_transfer: 52, touroperador_id: 'TO-003' },
  { id: 'V-09', numero: 'TS 766',     aerolinea: 'Air Transat',        tipo: 'llegada', hora_programada: '14:45', hora_estimada: '14:45', estado: 'programado', origen: 'YYZ', pax_total: 195, pax_transfer: 35, touroperador_id: 'TO-003' },
  { id: 'V-10', numero: 'IB 6501',    aerolinea: 'Iberia',             tipo: 'llegada', hora_programada: '15:50', hora_estimada: '15:50', estado: 'programado', origen: 'MAD', pax_total: 220, pax_transfer: 41, touroperador_id: 'TO-005' },
  { id: 'V-11', numero: 'NK 583',     aerolinea: 'Spirit Airlines',    tipo: 'llegada', hora_programada: '16:30', hora_estimada: '16:30', estado: 'programado', origen: 'FLL', pax_total: 178, pax_transfer: 22, touroperador_id: 'TO-002' },
  { id: 'V-12', numero: 'LY 7901',    aerolinea: 'Copa Airlines',      tipo: 'llegada', hora_programada: '17:20', hora_estimada: '17:20', estado: 'programado', origen: 'PTY', pax_total: 130, pax_transfer: 15, touroperador_id: null },

  // Salidas (8) — para vuelos de retorno
  { id: 'V-13', numero: 'AA 1583',    aerolinea: 'American Airlines',  tipo: 'salida',  hora_programada: '14:00', hora_estimada: '14:00', estado: 'programado', destino: 'MIA', pax_total: 142, pax_checkout: 32 },
  { id: 'V-14', numero: 'UA 1745',    aerolinea: 'United Airlines',    tipo: 'salida',  hora_programada: '15:30', hora_estimada: '15:30', estado: 'programado', destino: 'EWR', pax_total: 168, pax_checkout: 28 },
  { id: 'V-15', numero: 'DL 484',     aerolinea: 'Delta Air Lines',    tipo: 'salida',  hora_programada: '16:45', hora_estimada: '16:45', estado: 'programado', destino: 'ATL', pax_total: 156, pax_checkout: 18 },
  { id: 'V-16', numero: 'WS 2619',    aerolinea: 'WestJet',            tipo: 'salida',  hora_programada: '17:30', hora_estimada: '17:30', estado: 'programado', destino: 'YYZ', pax_total: 189, pax_checkout: 40 },
  { id: 'V-17', numero: 'X3 4413',    aerolinea: 'TUIfly',             tipo: 'salida',  hora_programada: '18:15', hora_estimada: '18:15', estado: 'programado', destino: 'FRA', pax_total: 210, pax_checkout: 55 },
  { id: 'V-18', numero: 'B6 1240',    aerolinea: 'JetBlue',            tipo: 'salida',  hora_programada: '19:00', hora_estimada: '19:00', estado: 'programado', destino: 'JFK', pax_total: 150, pax_checkout: 14 },
  { id: 'V-19', numero: 'DE 2157',    aerolinea: 'Condor',             tipo: 'salida',  hora_programada: '20:30', hora_estimada: '20:30', estado: 'programado', destino: 'MUC', pax_total: 198, pax_checkout: 25 },
  { id: 'V-20', numero: 'IB 6502',    aerolinea: 'Iberia',             tipo: 'salida',  hora_programada: '22:00', hora_estimada: '22:00', estado: 'programado', destino: 'MAD', pax_total: 220, pax_checkout: 38 },
];
```

### 2.7 Servicios del día (40 — el corazón de la demo)

Generar 40 servicios que cubran los 3 tipos:

**Tipo 1: Transfer aeropuerto (25 servicios)**
- 15 transfers IN (PUJ → Hotel): vinculados a vuelos de llegada
- 10 transfers OUT (Hotel → PUJ): vinculados a vuelos de salida, pickup 3h antes

**Tipo 2: Excursiones (10 servicios)**
- Multi-hotel pickup (2-4 hoteles por excursión, hora fija de salida)
- Destinos: Isla Saona, Altos de Chavón, Cenote Indigenous Eyes, Santo Domingo City Tour, Zip Line Anamuya, Catamaran Party, Marinarium, Hoyo Azul, Montaña Redonda, Cueva Fun Fun

**Tipo 3: Transfers privados (5 servicios)**
- VIP, 1-4 pax, sedán o SUV

Cada servicio:
```js
{
  id: 'SVC-001',
  tipo: 'transfer_in' | 'transfer_out' | 'excursion' | 'privado',
  touroperador_id: string,
  vuelo_id: string | null,       // para transfers
  hotel_ids: string[],           // uno para transfer, varios para excursión
  hora_pickup: string,           // HH:MM
  hora_entrega_estimada: string,
  vehiculo_id: string,
  conductor_id: string,
  pax: number,
  estado: 'completado' | 'en_curso' | 'pendiente' | 'cancelado',
  referencia_to: string,         // código del touroperador (ej: 'TUI-PUJ-20260722-038')
  notas: string,
  comision_usd: number,
}
```

**Distribución temporal realista:**
- 05:00–08:00: transfers IN de vuelos madrugada/mañana (ya completados)
- 06:30–07:00: pickup excursiones (ya completados o en curso)
- 08:00–12:00: transfers IN de vuelos mañana (en curso o pendientes)
- 10:00–14:00: transfers OUT para vuelos de tarde (pendientes)
- 14:00–18:00: transfers OUT para vuelos de noche (pendientes)

### 2.8 Excursiones — detalle de rutas multi-hotel

```js
const EXCURSIONES_RUTAS = [
  {
    id: 'EXC-01',
    nombre: 'Isla Saona — Full Day',
    salida: '07:00',
    retorno_estimado: '17:30',
    punto_embarque: 'Bayahíbe',
    hoteles_pickup: ['H-01', 'H-02', 'H-05', 'H-09'],  // secuencia de recogida
    horas_pickup: ['06:00', '06:15', '06:25', '06:35'],   // una por hotel
    vehiculo_id: 'BUS-03',
    conductor_id: 'COND-008',
    pax: 38,
  },
  // ... 9 más
];
```

### 2.9 Alertas y contingencias activas (5 — para dramatizar la demo)

```js
const ALERTAS = [
  {
    id: 'ALT-01',
    tipo: 'vuelo_retrasado',
    severidad: 'alta',
    titulo: 'Vuelo DE 2156 retrasado 35 min',
    descripcion: 'Condor desde Múnich. 28 pax afectados. ETA: 11:35 en lugar de 11:00.',
    vuelo_id: 'V-06',
    servicios_afectados: ['SVC-012', 'SVC-013'],
    accion_automatica: 'Pickup reprogramado de 11:30 a 12:05. Conductores notificados.',
    timestamp: '09:47',
    estado: 'activa',
  },
  {
    id: 'ALT-02',
    tipo: 'vehiculo_averiado',
    severidad: 'critica',
    titulo: 'MV-09 — Fallo de transmisión',
    descripcion: 'Ford Transit 2020 detenida en carretera Bávaro. 8 pax a bordo.',
    vehiculo_id: 'MV-09',
    servicios_afectados: ['SVC-017'],
    accion_automatica: 'MV-14 reasignada automáticamente. ETA rescate: 18 min. Pasajeros notificados.',
    timestamp: '10:22',
    estado: 'en_resolucion',
  },
  {
    id: 'ALT-03',
    tipo: 'conductor_ausente',
    severidad: 'media',
    titulo: 'COND-022 no reporta',
    descripcion: 'Juan Almonte no confirmó servicio de las 11:00. Sin respuesta a 3 llamadas.',
    conductor_id: 'COND-022',
    servicios_afectados: ['SVC-019'],
    accion_automatica: 'COND-045 (Rafael Pimentel) asignado como reemplazo. Vehículo sin cambio.',
    timestamp: '10:38',
    estado: 'resuelta',
  },
  {
    id: 'ALT-04',
    tipo: 'pax_no_show',
    severidad: 'baja',
    titulo: '4 pax no-show en Secrets Royal Beach',
    descripcion: 'Ref TUI-PUJ-20260722-015. Touroperador notificado. Servicio ejecutado con 8/12 pax.',
    servicios_afectados: ['SVC-008'],
    accion_automatica: 'Comisión recalculada sobre 8 pax. Registro para facturación.',
    timestamp: '08:15',
    estado: 'cerrada',
  },
  {
    id: 'ALT-05',
    tipo: 'vuelo_cancelado',
    severidad: 'critica',
    titulo: 'Vuelo NK 583 CANCELADO',
    descripcion: 'Spirit Airlines cancela FLL→PUJ. 22 pax de transfer afectados. Rebooking a B6 1239 (12:15).',
    vuelo_id: 'V-11',
    servicios_afectados: ['SVC-028', 'SVC-029'],
    accion_automatica: 'Servicios reasignados a vuelo B6 1239. Horarios ajustados. 2 vehículos liberados para reasignación.',
    timestamp: '07:30',
    estado: 'activa',
  },
];
```

### 2.10 Resumen del día (KPIs para dashboard)

```js
const KPI_HOY = {
  servicios_hoy: 84,
  servicios_completados: 31,
  servicios_en_curso: 12,
  servicios_pendientes: 38,
  servicios_cancelados: 3,
  vehiculos_operativos: 41,
  vehiculos_total: 48,
  conductores_activos: 54,
  conductores_total: 60,
  pax_transportados: 487,
  pax_pendientes: 312,
  ingresos_dia_usd: 12_840,
  comisiones_dia_usd: 2_156,
  alertas_activas: 2,
  alertas_resueltas: 3,
  ocupacion_flota_pct: 87,
  puntualidad_pct: 94.2,
  satisfaccion_pct: 4.7, // sobre 5
};

const KPI_SEMANA = [
  { dia: 'Lun', servicios: 72, ingresos: 10_920, puntualidad: 96.1 },
  { dia: 'Mar', servicios: 68, ingresos: 10_340, puntualidad: 93.8 },
  { dia: 'Mié', servicios: 79, ingresos: 11_580, puntualidad: 95.4 },
  { dia: 'Jue', servicios: 81, ingresos: 12_100, puntualidad: 92.7 },
  { dia: 'Vie', servicios: 88, ingresos: 13_200, puntualidad: 97.0 },
  { dia: 'Sáb', servicios: 95, ingresos: 14_800, puntualidad: 91.5 },
  { dia: 'Dom', servicios: 84, ingresos: 12_840, puntualidad: 94.2 },
];
```

---

## 3. Sección: LOGIN

Replicar exactamente el login del mockup Manus:

### Layout
- Pantalla completa, fondo gradient navy oscuro (135deg, #0a1f35 → #1a3a5c → #0e4d6b → #0a2a40)
- Panel izquierdo: card blanca 440px con formulario
- Panel derecho: texto hero + estadísticas + features

### Card de login (izquierda)
- Logo: icono bus en cuadrado gradient navy→teal, `border-radius: 14px`
- "CaribeTrans" en Poppins 22px/700
- "Punta Cana · República Dominicana" en 11px
- Título: "Bienvenido de nuevo"
- Inputs: email + contraseña con iconos FA, campos pre-llenados (`admin@caribetrans.com.do` / `••••••••`)
- Checkbox "Recordarme" + link "¿Olvidaste tu contraseña?"
- Botón "Iniciar Sesión →" (gradient navy)
- Footer: versión + copyright

### Panel hero (derecha)
- Badge dorado: "SISTEMA INTEGRADO DE GESTIÓN"
- H1: "Transporte Turístico **de Clase Mundial**" (la parte gold en span)
- Párrafo descriptivo
- 3 estadísticas: "48 Vehículos activos", "127 Empleados", "1,240 Servicios/mes" (Poppins 32px/800 dorado)
- 4 features con check circle dorado

### Comportamiento
- Click en "Iniciar Sesión" → transición a dashboard (sin validación real)
- Partículas flotantes en fondo (SVG pattern sutil, no canvas pesado)

**Gate LOGIN-A:** la pantalla de login se ve idéntica al mockup Manus. Verificación visual en navegador.

---

## 4. Sección: DASHBOARD RESUMEN

### Layout
- Sidebar izquierda (ver sección 1.3)
- Topbar con breadcrumb "Dashboard", search, bell con notif-dot, cog, fecha de hoy
- Content area con padding 28px

### Contenido del dashboard

**4.1 KPI Grid (4 cards)**

| KPI | Icono | Valor | Delta | Color |
|-----|-------|-------|-------|-------|
| Servicios Hoy | fa-route | 84 | ↑ 12% vs ayer | kpi-blue |
| Flota Activa | fa-bus-alt | 41/48 | 87% ocupación | kpi-teal |
| Ingresos del Día | fa-dollar-sign | $12,840 | ↑ 8% vs promedio | kpi-gold |
| Alertas | fa-exclamation-triangle | 2 activas | 3 resueltas hoy | kpi-coral |

Cada card con sparkline canvas (6 puntos, últimos 6 días).

**4.2 Charts Row (2 columnas)**

- **Columna principal (1fr):** Bar chart — "Servicios por Día" (7 días), 3 datasets: Aeropuerto (navy), Hotel (teal), Excursión (gold). Chart.js con tooltips navy.
- **Columna lateral (340px):** Doughnut chart — "Distribución de Flota" (4 tipos: Minivans, Autobuses, SUVs, Sedanes). Cutout 68%, leyenda manual debajo del chart.

**4.3 Bottom Row (3 columnas)**

- **Columna 1 — Próximos vuelos (mini-tabla):** 5 próximos vuelos con semáforo (verde=en hora, amarillo=retraso <30min, rojo=retraso >30min). Columnas: Hora, Vuelo, Aerolínea, Origen, Pax transfer, Estado.
- **Columna 2 — Touroperadores activos (mini-tabla):** los 5 activos con servicios del mes y comisión acumulada.
- **Columna 3 — Alertas recientes:** lista de las 5 alertas con timestamp, icono por severidad, título truncado.

**Gate DASH-A:** los 4 KPIs son legibles a 3 metros de distancia (tamaño de fuente Poppins 26px). Los charts renderizan sin error en la consola. El doughnut muestra labels correctos.

---

## 5. Sección: CENTRO DE OPERACIONES

**Esta es la pieza central.** Un solo ítem en el sidebar llamado "Centro de Operaciones" con icono `fa-satellite-dish` (o `fa-tower-broadcast`), dot pulsante verde.

El centro de operaciones tiene 6 sub-vistas accesibles por tabs horizontales debajo del section-header. Los tabs:

```
[📧 Correos TO] [✈ Vuelos] [🗺 Mapa GPS] [📱 Vista Conductor] [⚠ Alertas] [🏢 Touroperadores]
```

### 5.1 Tab 1: Correos de Touroperadores (trigger de todo)

**Concepto:** la despachadora recibe correos de touroperadores con listas de pasajeros. Cada correo genera servicios. Esta vista simula la bandeja de entrada operativa.

**Layout:**
- Panel izquierdo (350px): lista de correos (inbox style)
  - Cada correo: avatar TO, nombre TO, asunto, preview 1 línea, hora, badge de servicios generados
  - Correos con estados: `nuevo` (bold, dot azul), `procesado` (normal), `con_problema` (borde coral)
- Panel derecho (1fr): detalle del correo seleccionado
  - Header: de/para/asunto/fecha
  - Cuerpo: tabla formateada con datos del servicio (vuelo, hotel, pax, tipo habitación, referencia TO)
  - Pie: botones "Generar Servicios" (primario) y "Marcar como procesado" (secundario)
  - Al hacer click en "Generar Servicios": animación de creación → muestra resumen de servicios generados con vehículo y conductor sugeridos

**Datos:** 8 correos pregenerados (4 procesados, 2 nuevos, 2 con problema).

Ejemplo de correo:
```
De: reservas@tui-rd.com
Asunto: Transfer IN — Vuelo X3 4412 FRA→PUJ — 22 Jul 2026
---
Estimados,

Adjuntamos listado de pax para transfer de llegada:

Vuelo: X3 4412 (TUIfly)
Fecha: 22/07/2026
ETA: 10:20
Pax total para transfer: 62

Distribución:
- Iberostar Grand Bávaro: 18 pax (Ref: TUI-PUJ-20260722-038)
- Barceló Bávaro Palace: 14 pax (Ref: TUI-PUJ-20260722-039)
- Riu Palace Punta Cana: 12 pax (Ref: TUI-PUJ-20260722-040)
- Lopesan Costa Bávaro: 10 pax (Ref: TUI-PUJ-20260722-041)
- Paradisus Palma Real: 8 pax (Ref: TUI-PUJ-20260722-042)

Requieren: 3 minivans + 1 autobús

Saludos,
Departamento de Operaciones Terrestres
TUI Group — República Dominicana
```

**Gate CORREO-A:** al hacer click en un correo, el panel derecho muestra el contenido completo. Al click en "Generar Servicios", aparece una animación de 2 segundos y luego un resumen con vehículos y conductores sugeridos de la data pregenerada.

### 5.2 Tab 2: Tablero de Vuelos

**Concepto:** panel estilo FIDS (Flight Information Display System) de aeropuerto. Los vuelos de llegada son la fuente de trabajo; los de salida determinan los pickups de retorno.

**Layout:**
- Tabs secundarios: "Llegadas" (12) | "Salidas" (8) | "Todos" (20)
- Tabla de vuelos con estilo FIDS (fondo oscuro navy, texto claro, fuente monoespaciada para hora/vuelo):

| Hora | Vuelo | Aerolínea | Origen/Destino | Pax Transfer | Estado | Vehículos Asignados | Acción |
|------|-------|-----------|----------------|-------------|--------|--------------------|----|

- **Estados con semáforo:**
  - 🟢 Aterrizado / En hora → fondo `rgba(22,163,74,.1)`
  - 🟡 En vuelo → fondo `rgba(14,116,144,.1)`, icono avión animado
  - 🔴 Retrasado → fondo `rgba(224,123,84,.1)`, muestra diferencia (+35 min)
  - ⚫ Cancelado → fondo rayado, texto tachado
  - ⬜ Programado → sin fondo especial

- **Columna "Vehículos Asignados":** badges con placa del vehículo (ej: `MV-07`, `BUS-03`). Click en badge → tooltip con conductor + pax + hotel destino.

- **Panel lateral resumen (240px):**
  - Total vuelos hoy: 20
  - Pax esperados: 799
  - Vehículos pre-asignados: 28 de 41
  - Próximo vuelo: WS 2618 en 23 min
  - Alertas de vuelo: 2 (1 retrasado, 1 cancelado)

**Gate VUELOS-A:** la tabla se ordena por hora. Los estados tienen semáforo correcto. El vuelo DE 2156 muestra "+35 min" en rojo. El NK 583 aparece cancelado con texto tachado.

### 5.3 Tab 3: Mapa GPS (Mapa SVG de Punta Cana)

**Concepto:** mapa estilizado SVG (no Google Maps — es offline) mostrando posición de vehículos, hoteles y aeropuerto. Idéntico al patrón del mockup Manus.

**Layout:**
- Panel principal (1fr): mapa SVG con:
  - Fondo degradado azul claro (#dbeafe → #e0f2fe → #cffafe)
  - Carreteras principales como paths curvos (trazo #c8d8e8)
  - Hoteles como rectángulos etiquetados (#b8d4e8)
  - Aeropuerto PUJ como rectángulo navy prominente con ✈
  - Vehículos como círculos de 12px con código de placa:
    - Navy = en ruta
    - Gold = esperando/standby
    - Teal = en excursión
    - Coral = alerta/problema
  - Rutas activas como líneas punteadas (stroke-dasharray) desde aeropuerto a posición del vehículo
  - Leyenda flotante inferior izquierda (semi-transparente)

- Panel lateral derecho (340px): lista de servicios del día (idéntico al dispatch panel del mockup):
  - Tabs: Todos | En curso | Pendientes | Completados
  - Cada item: hora, ruta (origen → destino), badges (placa, conductor, pax), estado con color
  - Items completados con `opacity: .65`
  - Item activo con fondo `rgba(14,116,144,.05)` y borde teal

**Interactividad:**
- Click en vehículo en mapa → resalta en la lista lateral + tooltip con info del servicio
- Click en servicio en lista → resalta vehículo en mapa (animar un pulso)
- Los vehículos en mapa NO se mueven solos (es estático). Pero al cambiar de tab o al transcurrir la demo, las posiciones reflejan el estado actual

**Gate MAPA-A:** los 12 hoteles aparecen en posiciones plausibles en el mapa. El aeropuerto PUJ está en la zona central-inferior. Al menos 8 vehículos visibles con colores correctos según estado. Click en vehículo muestra tooltip.

### 5.4 Tab 4: Vista del Conductor (simulación mobile)

**Concepto:** lo que un conductor ve en su teléfono. Frame de dispositivo móvil centrado en la pantalla.

**Layout:**
- Centro de pantalla: frame de teléfono (375×667px, border-radius 40px, sombra pronunciada, borde navy oscuro de 12px)
- Header del "app" dentro del phone:
  - Barra de estado ficticia (hora, batería, señal)
  - Logo CaribeTrans pequeño + "Mi Turno"
  - Badge turno: "Turno Diurno · 06:00-18:00"

- **Card de servicio actual** (la más prominente):
  ```
  ┌─────────────────────────────────────┐
  │ 🟢 EN CURSO                         │
  │                                     │
  │ Transfer IN — AA 1582               │
  │ PUJ → Hard Rock Hotel Punta Cana    │
  │                                     │
  │ 👥 4 pasajeros                      │
  │ 🕐 Pickup: 11:00  |  ETA: 11:35    │
  │ 📋 Ref: TUI-PUJ-20260722-015       │
  │                                     │
  │ [Confirmar Llegada]  [Reportar]     │
  └─────────────────────────────────────┘
  ```

- **Lista de próximos servicios** (2-3 items más pequeños debajo):
  - Hora, tipo, ruta resumida, pax
  - Tap → se expande como card principal (simulación)

- **Barra inferior del "app":**
  - 4 iconos: Mi Turno (activo), Historial, Reportar, Perfil

- **Selector de conductor:** dropdown arriba del phone frame para cambiar entre 3-4 conductores predefinidos. Cada uno tiene servicios diferentes.

**Gate CONDUCTOR-A:** el phone frame se ve proporcionado (no estirado). La card de servicio actual es legible. Al cambiar conductor en el dropdown, los servicios cambian.

### 5.5 Tab 5: Alertas y Contingencias

**Concepto:** panel de control de alertas con timeline y acciones automáticas. Demuestra que el sistema reacciona sin intervención humana.

**Layout:**
- Header con contadores: `2 Activas` (badge coral pulsante), `1 En resolución` (badge gold), `2 Resueltas` (badge verde)

- **Cards de alerta** (lista vertical, la más reciente arriba):
  ```
  ┌─── CRÍTICA ──────────────────────────────────────────────┐
  │ ⚠ Vuelo NK 583 CANCELADO                     07:30      │
  │ Spirit Airlines FLL→PUJ. 22 pax afectados.              │
  │                                                          │
  │ Acción automática:                                       │
  │ ✅ Servicios SVC-028, SVC-029 reasignados a B6 1239     │
  │ ✅ Horarios ajustados: pickup 12:45 (antes 17:00)       │
  │ ✅ 2 vehículos liberados para reasignación               │
  │                                                          │
  │ [Ver servicios afectados]  [Contactar TO]                │
  └──────────────────────────────────────────────────────────┘
  ```

- Cada card tiene:
  - Borde izquierdo por severidad: 4px rojo (crítica), naranja (alta), gold (media), gris (baja)
  - Icono por tipo: ✈ vuelo, 🚗 vehículo, 👤 conductor, 👥 pax
  - Timeline de acciones automáticas con checkmarks
  - Botones de acción contextual

- **Panel lateral (300px) — Resumen de reasignaciones:**
  - Visualización tipo Sankey simplificada:
    - Recurso original → ❌ → Recurso reasignado
    - "MV-09 (averiada) → MV-14 (disponible)"
    - "COND-022 (ausente) → COND-045 (Rafael Pimentel)"
    - "Vuelo NK 583 → Vuelo B6 1239"

**Gate ALERTAS-A:** las 5 alertas se renderizan con severidad visual correcta. La alerta crítica de vuelo cancelado muestra las 3 acciones automáticas con checkmarks.

### 5.6 Tab 6: Touroperadores

**Concepto:** los touroperadores como fuentes de trabajo con métricas comerciales. El Don ve quiénes pagan más y quiénes generan más volumen.

**Layout:**
- **KPI strip (6 mini-cards horizontales):**
  - Total servicios/mes: 560
  - Comisiones/mes: $14,200 USD
  - TO activos: 5
  - Promedio comisión: 9.4%
  - Mejor TO por volumen: TUI (180)
  - Mejor TO por comisión: Palladium (12%)

- **Cards de touroperador (grid 2 columnas):**
  Cada TO tiene una card tipo "profile card":
  ```
  ┌──────────────────────────────────┐
  │  🏢 TUI Group                    │
  │  Alemania · Activo desde 2019    │
  │                                  │
  │  Servicios/mes    180            │
  │  Comisión         8%             │
  │  Ingresos/mes     $4,320 USD     │
  │  Puntualidad      96.2%          │
  │  ────────────────────            │
  │  📧 reservas@tui-rd.com          │
  │  📊 [Ver historial] [Contactar]  │
  │                                  │
  │  ▓▓▓▓▓▓▓▓▓░ 180/200 cuota mes   │
  └──────────────────────────────────┘
  ```

- **Tabla comparativa debajo:** ranking por rentabilidad (ingresos menos costo operativo estimado).

**Gate TO-A:** los 6 touroperadores renderizan. TUI aparece primero por volumen. Palladium aparece con la comisión más alta (12%). Blue Diamond aparece como "Inactivo" con estilo atenuado.

---

## 6. Sidebar — Navegación completa

```
Principal
  ├── Dashboard          (fa-chart-pie)
  └── Centro Operaciones (fa-tower-broadcast)  ● pulsante

Módulos del Sistema
  ├── Empleados          (fa-users)            badge: 127
  ├── Nómina             (fa-money-check-alt)
  ├── Flota              (fa-bus-alt)          badge: 48
  ├── Costos             (fa-calculator)
  ├── Contabilidad       (fa-book)
  ├── OCR Facturas       (fa-file-invoice-dollar)
  ├── BI / Reportes      (fa-chart-bar)
  ├── Facturación        (fa-receipt)
  └── Auditoría          (fa-shield-alt)

Comunicación
  ├── Notificaciones     (fa-bell)
  ├── App Conductores    (fa-mobile-alt)
  └── Portal Clientes    (fa-globe)

Sistema
  ├── Configuración      (fa-cog)
  └── Cerrar Sesión      (fa-sign-out-alt)
```

**Regla:** solo Dashboard y Centro de Operaciones son navegables en esta versión. Los demás ítems de "Módulos del Sistema" y "Comunicación" se muestran en el sidebar pero al hacer click muestran un panel placeholder que dice:

```
┌────────────────────────────────────────────────┐
│  🔒 Módulo disponible en el sistema completo   │
│                                                │
│  [nombre del módulo] está incluido en el       │
│  plan Profesional y Enterprise.                │
│                                                │
│  Contacte a su representante de ventas para    │
│  una demostración completa.                    │
│                                                │
│  📞 +1 (809) 555-0100                          │
│  📧 ventas@caribetrans.com.do                  │
└────────────────────────────────────────────────┘
```

Esto es intencional: el prospecto ve la profundidad del sistema sin necesidad de construir cada módulo.

---

## 7. Interactividad global

### 7.1 Navegación
- Login → Dashboard (click en botón)
- Sidebar items → secciones (con breadcrumb update)
- Tabs del centro de operaciones → sub-vistas (sin cambiar sidebar active)
- Cerrar Sesión → volver a login

### 7.2 Tooltips
- Hover sobre vehículo en mapa → tooltip con info
- Hover sobre badge de vuelo → tooltip con detalles
- Hover sobre KPI → tooltip con contexto

### 7.3 Animaciones
- Transiciones entre secciones: fade 200ms
- Cards: hover translateY(-2px) con shadow
- Dot pulsante en centro de operaciones
- Progress bar en "Generar Servicios" del correo
- Status del vuelo "En vuelo": icono avión con sutil animación

### 7.4 Auto-refresh simulado
- Reloj en topbar: hora real del sistema
- NADA se actualiza automáticamente (es dato estático). La ilusión de "en vivo" la da el dot pulsante y los estados mixtos (completado + en curso + pendiente)

---

## 8. Verificación final

### Gate GLOBAL-A: Funcionalidad
1. Login → click → Dashboard aparece
2. Dashboard → 4 KPIs visibles, 2 charts renderizados, 3 paneles inferiores con datos
3. Centro Operaciones → 6 tabs navegables, cada uno muestra contenido
4. Correos → click en correo → detalle → "Generar Servicios" → animación → resumen
5. Vuelos → tabla FIDS con semáforo correcto
6. Mapa → SVG con hoteles, aeropuerto, vehículos con colores
7. Vista Conductor → phone frame con card de servicio
8. Alertas → 5 alertas con severidad visual, acciones automáticas
9. Touroperadores → 6 cards con métricas
10. Sidebar → ítems no implementados muestran placeholder

### Gate GLOBAL-B: Visual
1. Paleta navy/teal/gold/coral coherente en toda la app
2. Tipografía Inter+Poppins cargada correctamente
3. No hay scrollbar horizontal en 1920×1080
4. Sidebar colapsa visualmente en pantallas <900px

### Gate GLOBAL-C: Consola
1. Abrir `index.html` en Chrome → 0 errores JS en consola
2. Todos los Chart.js renderizan sin error
3. Sin warnings de CSP (todo CDN, sin inline eval)

### Gate GLOBAL-D: Offline
1. Cargar la página con DevTools → Network → Offline → las fuentes ya cacheadas por el navegador (aceptable). El resto funciona 100%.
2. O alternativamente: todos los datos están en `data.js`, la navegación funciona sin red excepto fuentes/iconos CDN en la primera carga.

---

## 9. Lo que NO se construye ahora

- Páginas estáticas de módulos (Empleados, Nómina, Flota detalle, Contabilidad, etc.) → Stitch en sesión posterior
- Control por voz (Web Speech API) → feature futura
- Escenario B del digital twin (engines reales) → post-producción
- Datos reales de TTE → nunca en el simulador
- Responsive móvil completo → no es prioridad (demo en laptop)
- Modo oscuro → no aplica

---

## 10. Orden de construcción sugerido

1. Estructura del proyecto + `data.js` completo
2. CSS completo (copiar design system del mockup)
3. `app.js` (navegación + utilidades)
4. Login
5. Dashboard
6. Centro Operaciones — Tab 3 (Mapa GPS — es el ancla visual)
7. Centro Operaciones — Tab 2 (Vuelos — alimenta el mapa)
8. Centro Operaciones — Tab 1 (Correos — el trigger)
9. Centro Operaciones — Tab 5 (Alertas — el dramatismo)
10. Centro Operaciones — Tab 6 (Touroperadores — el cierre comercial)
11. Centro Operaciones — Tab 4 (Vista Conductor — el wow)
12. Sidebar placeholders para módulos no implementados
13. Verificación gates GLOBAL-A/B/C/D
