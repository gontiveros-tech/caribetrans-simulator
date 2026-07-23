/* ==========================================================================
   CaribeTrans — Simulador Comercial
   data.js — datos sintéticos pregenerados

   Todo el contenido de la demo vive aquí y se expone en window.CT_DATA.
   No hay fetch, no hay API, no hay localStorage. La fecha de la demo está
   fijada al 22 de julio de 2026 para que todo sea coherente entre sí.

   Ningún dato real de clientes: nombres de touroperadores, hoteles y
   aerolíneas son públicos; pasajeros, conductores, cédulas, teléfonos,
   placas y referencias son inventados.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 2.1 */
  const EMPRESA = {
    nombre: 'CaribeTrans',
    subtitulo: 'Punta Cana · República Dominicana',
    version: 'v3.1.0',
    fecha_demo: '22 de julio de 2026',
    fecha_demo_corta: '22/07/2026',
    telefono_ventas: '+1 (809) 555-0100',
    email_ventas: 'ventas@caribetrans.com.do',
    usuario_demo: {
      nombre: 'Carlos Mejía',
      rol: 'Administrador',
      email: 'admin@caribetrans.com.do',
      iniciales: 'CM',
    },
  };

  /* ---------------------------------------------------------------- 2.2 */
  const TOUROPERADORES = [
    { id: 'TO-001', nombre: 'TUI Group',      contacto: 'reservas@tui-rd.com',           comision_pct: 8,  servicios_mes: 180, estado: 'activo',   pais: 'Alemania',        cliente_desde: 2019, cuota_mes: 200, puntualidad: 96.2, color: '#1a3a5c' },
    { id: 'TO-002', nombre: 'Apple Vacations', contacto: 'ops@applevacations.com',        comision_pct: 10, servicios_mes: 95,  estado: 'activo',   pais: 'Estados Unidos',  cliente_desde: 2020, cuota_mes: 120, puntualidad: 94.8, color: '#0e7490' },
    { id: 'TO-003', nombre: 'Sunwing',        contacto: 'ground@sunwing.ca',             comision_pct: 9,  servicios_mes: 72,  estado: 'activo',   pais: 'Canadá',          cliente_desde: 2021, cuota_mes: 100, puntualidad: 92.4, color: '#0891b2' },
    { id: 'TO-004', nombre: 'FTI Touristik',  contacto: 'transfers@fti.de',              comision_pct: 7,  servicios_mes: 45,  estado: 'activo',   pais: 'Alemania',        cliente_desde: 2022, cuota_mes: 80,  puntualidad: 95.6, color: '#d4a017' },
    { id: 'TO-005', nombre: 'Palladium Group', contacto: 'transport@palladiumgroup.com', comision_pct: 12, servicios_mes: 110, estado: 'activo',   pais: 'España',          cliente_desde: 2018, cuota_mes: 140, puntualidad: 97.1, color: '#e07b54' },
    { id: 'TO-006', nombre: 'Blue Diamond',   contacto: 'ground@bluediamondresorts.com', comision_pct: 11, servicios_mes: 58,  estado: 'inactivo', pais: 'Canadá',          cliente_desde: 2020, cuota_mes: 90,  puntualidad: 88.3, color: '#94a3b8' },
  ];

  /* ---------------------------------------------------------------- 2.3 */
  const HOTELES = [
    { id: 'H-01', nombre: 'Iberostar Grand Bávaro',     zona: 'Bávaro',      touroperador_id: 'TO-005', lat: 18.716, lng: -68.444 },
    { id: 'H-02', nombre: 'Barceló Bávaro Palace',      zona: 'Bávaro',      touroperador_id: 'TO-001', lat: 18.720, lng: -68.438 },
    { id: 'H-03', nombre: 'Hard Rock Hotel Punta Cana', zona: 'Macao',       touroperador_id: 'TO-002', lat: 18.735, lng: -68.425 },
    { id: 'H-04', nombre: 'Cap Cana (Hyatt Ziva)',      zona: 'Cap Cana',    touroperador_id: 'TO-001', lat: 18.680, lng: -68.405 },
    { id: 'H-05', nombre: 'Majestic Elegance',          zona: 'Bávaro',      touroperador_id: 'TO-003', lat: 18.712, lng: -68.450 },
    { id: 'H-06', nombre: 'Zoëtry Agua Punta Cana',     zona: 'Uvero Alto',  touroperador_id: 'TO-004', lat: 18.760, lng: -68.395 },
    { id: 'H-07', nombre: 'Secrets Royal Beach',        zona: 'Bávaro',      touroperador_id: 'TO-002', lat: 18.722, lng: -68.441 },
    { id: 'H-08', nombre: 'Riu Palace Punta Cana',      zona: 'Arena Gorda', touroperador_id: 'TO-001', lat: 18.728, lng: -68.432 },
    { id: 'H-09', nombre: 'Dreams Punta Cana',          zona: 'Bávaro',      touroperador_id: 'TO-005', lat: 18.718, lng: -68.446 },
    { id: 'H-10', nombre: 'Occidental Caribe',          zona: 'Bávaro',      touroperador_id: 'TO-003', lat: 18.714, lng: -68.448 },
    { id: 'H-11', nombre: 'Paradisus Palma Real',       zona: 'Bávaro',      touroperador_id: 'TO-004', lat: 18.725, lng: -68.435 },
    { id: 'H-12', nombre: 'Lopesan Costa Bávaro',       zona: 'Bávaro',      touroperador_id: 'TO-001', lat: 18.710, lng: -68.452 },
  ];

  const AEROPUERTO = {
    id: 'PUJ',
    nombre: 'Aeropuerto Internacional de Punta Cana',
    codigo: 'PUJ',
    lat: 18.567,
    lng: -68.363,
  };

  /* ---------------------------------------------------------------- 2.4
     48 vehículos: 18 minivans, 14 autobuses, 10 SUVs, 6 sedanes.
     Estado: 41 operativos, 4 en mantenimiento, 3 inactivos.
     conductor_asignado se rellena más abajo desde CONDUCTORES.          */
  function veh(id, placa, tipo, modelo, anio, capacidad_pax, estado, km, combustible_pct, prox_mantenimiento) {
    return { id, placa, tipo, modelo, anio, capacidad_pax, conductor_asignado: null, estado, km, combustible_pct, prox_mantenimiento };
  }

  const VEHICULOS = [
    // --- Minivans (18) ---
    veh('MV-01', 'I114520', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     68420,  82, '2026-08-14'),
    veh('MV-02', 'I114521', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     71350,  64, '2026-08-02'),
    veh('MV-03', 'I114522', 'minivan', 'Toyota HiAce',   2022, 15, 'operativo',     96780,  91, '2026-07-29'),
    veh('MV-04', 'I114523', 'minivan', 'Toyota HiAce',   2024, 14, 'operativo',     31240,  55, '2026-09-10'),
    veh('MV-05', 'I114524', 'minivan', 'Toyota HiAce',   2022, 15, 'operativo',    104610,  73, '2026-08-05'),
    veh('MV-06', 'I114525', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     59870,  48, '2026-08-21'),
    veh('MV-07', 'I114526', 'minivan', 'Toyota HiAce',   2021, 12, 'operativo',    128940,  67, '2026-07-27'),
    veh('MV-08', 'I114527', 'minivan', 'Toyota HiAce',   2024, 14, 'operativo',     22180,  95, '2026-10-03'),
    veh('MV-09', 'I114528', 'minivan', 'Ford Transit',   2020, 12, 'mantenimiento', 186520, 31, '2026-07-22'),
    veh('MV-10', 'I114529', 'minivan', 'Toyota HiAce',   2022, 15, 'operativo',     91460,  78, '2026-08-18'),
    veh('MV-11', 'I114530', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     64730,  60, '2026-09-01'),
    veh('MV-12', 'I114531', 'minivan', 'Toyota HiAce',   2021, 12, 'operativo',    141200,  44, '2026-07-31'),
    veh('MV-13', 'I114532', 'minivan', 'Toyota HiAce',   2024, 14, 'operativo',     18960,  88, '2026-10-15'),
    veh('MV-14', 'I114533', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     57310,  71, '2026-08-26'),
    veh('MV-15', 'I114534', 'minivan', 'Toyota HiAce',   2022, 15, 'operativo',     99850,  53, '2026-08-08'),
    veh('MV-16', 'I114535', 'minivan', 'Ford Transit',   2019, 12, 'inactivo',     214730,  12, '2026-07-15'),
    veh('MV-17', 'I114536', 'minivan', 'Toyota HiAce',   2023, 14, 'operativo',     62540,  85, '2026-09-06'),
    veh('MV-18', 'I114537', 'minivan', 'Toyota HiAce',   2024, 14, 'operativo',     26410,  76, '2026-09-28'),

    // --- Autobuses (14) ---
    veh('BUS-01', 'I220110', 'autobus', 'Mercedes-Benz Sprinter', 2022, 22, 'operativo',     118340, 69, '2026-08-11'),
    veh('BUS-02', 'I220111', 'autobus', 'Mercedes-Benz Sprinter', 2023, 22, 'operativo',      74920, 83, '2026-09-04'),
    veh('BUS-03', 'I220112', 'autobus', 'Hyundai County',         2022, 30, 'operativo',     132670, 58, '2026-07-30'),
    veh('BUS-04', 'I220113', 'autobus', 'Hyundai County',         2021, 30, 'operativo',     167490, 47, '2026-08-03'),
    veh('BUS-05', 'I220114', 'autobus', 'Mercedes-Benz Tourismo', 2023, 45, 'operativo',      88250, 90, '2026-09-19'),
    veh('BUS-06', 'I220115', 'autobus', 'Hyundai County',         2023, 28, 'operativo',      69180, 74, '2026-08-24'),
    veh('BUS-07', 'I220116', 'autobus', 'Mercedes-Benz Sprinter', 2021, 20, 'mantenimiento', 178630, 22, '2026-07-22'),
    veh('BUS-08', 'I220117', 'autobus', 'Mercedes-Benz Tourismo', 2024, 45, 'operativo',      34710, 92, '2026-10-08'),
    veh('BUS-09', 'I220118', 'autobus', 'Hyundai County',         2022, 30, 'operativo',     124580, 61, '2026-08-16'),
    veh('BUS-10', 'I220119', 'autobus', 'Mercedes-Benz Sprinter', 2023, 22, 'operativo',      71260, 79, '2026-09-12'),
    veh('BUS-11', 'I220120', 'autobus', 'Hyundai County',         2024, 28, 'operativo',      29840, 86, '2026-10-21'),
    veh('BUS-12', 'I220121', 'autobus', 'Mercedes-Benz Sprinter', 2019, 20, 'inactivo',      231470, 8,  '2026-06-30'),
    veh('BUS-13', 'I220122', 'autobus', 'Mercedes-Benz Tourismo', 2022, 45, 'operativo',     109350, 66, '2026-08-29'),
    veh('BUS-14', 'I220123', 'autobus', 'Hyundai County',         2023, 30, 'operativo',      65920, 81, '2026-09-23'),

    // --- SUVs (10) ---
    veh('SUV-01', 'A365410', 'suv', 'Toyota Land Cruiser', 2023, 7, 'operativo',      52180, 77, '2026-09-08'),
    veh('SUV-02', 'A365411', 'suv', 'Toyota Land Cruiser', 2022, 7, 'operativo',      84620, 63, '2026-08-13'),
    veh('SUV-03', 'A365412', 'suv', 'Hyundai Palisade',    2024, 7, 'operativo',      21470, 94, '2026-10-11'),
    veh('SUV-04', 'A365413', 'suv', 'Hyundai Palisade',    2021, 6, 'mantenimiento', 149830, 35, '2026-07-22'),
    veh('SUV-05', 'A365414', 'suv', 'Toyota Land Cruiser', 2023, 7, 'operativo',      48910, 88, '2026-09-15'),
    veh('SUV-06', 'A365415', 'suv', 'Hyundai Palisade',    2022, 7, 'operativo',      79340, 56, '2026-08-20'),
    veh('SUV-07', 'A365416', 'suv', 'Toyota Land Cruiser', 2024, 7, 'operativo',      17250, 91, '2026-10-27'),
    veh('SUV-08', 'A365417', 'suv', 'Hyundai Palisade',    2023, 7, 'operativo',      44680, 72, '2026-09-25'),
    veh('SUV-09', 'A365418', 'suv', 'Toyota Land Cruiser', 2022, 6, 'operativo',      92510, 49, '2026-08-07'),
    veh('SUV-10', 'A365419', 'suv', 'Hyundai Palisade',    2024, 7, 'operativo',      14320, 97, '2026-11-04'),

    // --- Sedanes (6) ---
    veh('SED-01', 'A478230', 'sedan', 'Toyota Camry',   2023, 4, 'operativo',      41260, 84, '2026-09-17'),
    veh('SED-02', 'A478231', 'sedan', 'Hyundai Sonata', 2022, 4, 'operativo',      73580, 59, '2026-08-22'),
    veh('SED-03', 'A478232', 'sedan', 'Toyota Camry',   2024, 4, 'operativo',      16940, 93, '2026-10-30'),
    veh('SED-04', 'A478233', 'sedan', 'Hyundai Sonata', 2023, 4, 'operativo',      38710, 70, '2026-09-21'),
    veh('SED-05', 'A478234', 'sedan', 'Toyota Camry',   2021, 3, 'mantenimiento', 132450, 27, '2026-07-22'),
    veh('SED-06', 'A478235', 'sedan', 'Hyundai Sonata', 2019, 3, 'inactivo',      198620, 15, '2026-06-18'),
  ];

  /* ---------------------------------------------------------------- 2.5
     60 conductores. El vehículo asignado es la fuente de verdad: el
     enlace inverso (vehiculo.conductor_asignado) se deriva más abajo.    */
  function cond(id, nombre, cedula, tipo_licencia, telefono, estado, vehiculo_asignado, turno_actual, zona, servicios_completados_hoy) {
    return { id, nombre, cedula, tipo_licencia, telefono, estado, vehiculo_asignado, turno_actual, ultima_posicion: zona, servicios_completados_hoy };
  }

  const TURNO_D = 'Diurno · 06:00-18:00';
  const TURNO_N = 'Nocturno · 18:00-06:00';
  const TURNO_L = 'Libre';

  const CONDUCTORES = [
    cond('COND-001', 'José Ramón Peralta',      '001-1024587-3', 'Categoría 3', '809-412-7745', 'activo',    'MV-01',  TURNO_D, 'Aeropuerto PUJ',        3),
    cond('COND-002', 'Manuel Antonio Reyes',    '001-1187436-1', 'Categoría 3', '809-556-2210', 'activo',    'MV-02',  TURNO_D, 'Bávaro',                2),
    cond('COND-003', 'Wilson Guzmán Núñez',     '001-1345920-7', 'Categoría 2', '809-334-8891', 'activo',    'SUV-01', TURNO_D, 'Cap Cana',              2),
    cond('COND-004', 'Ramón Alberto Díaz',      '001-1029384-5', 'Categoría 3', '829-441-6672', 'activo',    'MV-03',  TURNO_D, 'Aeropuerto PUJ',        3),
    cond('COND-005', 'Francisco Javier Mota',   '001-1456789-2', 'Categoría 4', '809-778-3345', 'activo',    'BUS-01', TURNO_D, 'La Romana',             1),
    cond('COND-006', 'Pedro Luis Encarnación',  '001-1198254-8', 'Categoría 3', '809-223-9910', 'activo',    'MV-04',  TURNO_D, 'Cap Cana',              1),
    cond('COND-007', 'Juan Carlos Batista',     '001-1367245-4', 'Categoría 4', '829-667-1120', 'activo',    'BUS-02', TURNO_D, 'Playa Bávaro',          1),
    cond('COND-008', 'Miguel Ángel Severino',   '001-1284736-9', 'Categoría 4', '809-901-4478', 'activo',    'BUS-03', TURNO_D, 'Bayahíbe',              1),
    cond('COND-009', 'Rafael Emilio Castillo',  '001-1093746-6', 'Categoría 3', '809-448-2237', 'activo',    'MV-05',  TURNO_D, 'Bávaro',                3),
    cond('COND-010', 'Luis Alberto Ferreras',   '001-1573829-0', 'Categoría 2', '829-215-7783', 'activo',    'SUV-02', TURNO_D, 'Uvero Alto',            2),
    cond('COND-011', 'Ángel María Polanco',     '001-1348271-3', 'Categoría 3', '809-663-5541', 'activo',    'MV-06',  TURNO_D, 'Anamuya',               1),
    cond('COND-012', 'Domingo Antonio Vargas',  '001-1129384-7', 'Categoría 4', '809-337-8802', 'activo',    'BUS-04', TURNO_D, 'Miches',                1),
    cond('COND-013', 'Elvin Rafael Contreras',  '001-1462738-5', 'Categoría 3', '829-772-3316', 'activo',    'MV-07',  TURNO_D, 'Cabeza de Toro',        2),
    cond('COND-014', 'Yovanny de Jesús Pérez',  '001-1275940-2', 'Categoría 2', '809-114-6690', 'activo',    'SED-01', TURNO_D, 'Aeropuerto PUJ',        4),
    cond('COND-015', 'Santiago Ureña Mercedes', '001-1038475-8', 'Categoría 3', '809-528-4471', 'activo',    'MV-08',  TURNO_D, 'Arena Gorda',           2),
    cond('COND-016', 'Freddy Alexander Rosario','001-1394827-1', 'Categoría 4', '829-306-9925', 'activo',    'BUS-05', TURNO_D, 'Santo Domingo',         1),
    cond('COND-017', 'Julio César Almánzar',    '001-1247593-6', 'Categoría 3', '809-845-1173', 'activo',    'MV-09',  TURNO_D, 'Carretera Bávaro',      2),
    cond('COND-018', 'Andrés Felipe Jiménez',   '001-1483920-4', 'Categoría 2', '809-229-7734', 'activo',    'SUV-03', TURNO_D, 'Cap Cana',              2),
    cond('COND-019', 'Héctor Bienvenido Lora',  '001-1156384-9', 'Categoría 3', '829-559-2208', 'activo',    'MV-10',  TURNO_D, 'Scape Park',            1),
    cond('COND-020', 'Cristian Manuel Aquino',  '001-1329485-2', 'Categoría 4', '809-773-6684', 'activo',    'BUS-06', TURNO_D, 'Hato Mayor',            1),
    cond('COND-021', 'Alberto Ramón Cabrera',   '001-1074839-5', 'Categoría 3', '809-462-8817', 'activo',    'MV-11',  TURNO_D, 'Bávaro',                3),
    cond('COND-022', 'Juan Almonte Villar',     '001-1518273-0', 'Categoría 3', '829-338-1145', 'ausente',   'MV-12',  TURNO_D, 'Sin reportar',          1),
    cond('COND-023', 'Ismael Antonio Guerrero', '001-1263748-7', 'Categoría 2', '809-917-5520', 'activo',    'SUV-04', TURNO_L, 'Base — Higüey',         0),
    cond('COND-024', 'Roberto Carlos Made',     '001-1408273-3', 'Categoría 4', '809-224-3391', 'descanso',  'BUS-07', TURNO_L, 'Base — Higüey',         0),
    cond('COND-025', 'Nelson Radhamés Suero',   '001-1195027-8', 'Categoría 3', '829-640-7726', 'activo',    'MV-13',  TURNO_D, 'Aeropuerto PUJ',        3),
    cond('COND-026', 'Eddy Manuel Terrero',     '001-1372849-1', 'Categoría 2', '809-355-9948', 'activo',    'SED-02', TURNO_D, 'Bávaro',                3),
    cond('COND-027', 'Víctor Manuel Ozuna',     '001-1249586-4', 'Categoría 3', '809-708-2213', 'activo',    'MV-14',  TURNO_D, 'Carretera Bávaro',      2),
    cond('COND-028', 'Starling Antonio Feliz',  '001-1436920-6', 'Categoría 4', '829-882-4470', 'activo',    'BUS-08', TURNO_D, 'Aeropuerto PUJ',        1),
    cond('COND-029', 'Radhamés Ortiz Peña',     '001-1087294-2', 'Categoría 3', '809-541-6639', 'activo',    'MV-15',  TURNO_D, 'Macao',                 2),
    cond('COND-030', 'Jean Carlos Beltré',      '001-1358492-9', 'Categoría 2', '809-236-8874', 'activo',    'SUV-05', TURNO_D, 'Cap Cana',              2),
    cond('COND-031', 'Ramón Emilio Bautista',   '001-1174829-5', 'Categoría 3', '829-449-1162', 'libre',     'MV-16',  TURNO_L, 'Base — Higüey',         0),
    cond('COND-032', 'Leonardo Antonio Pión',   '001-1462039-7', 'Categoría 4', '809-618-7745', 'activo',    'BUS-09', TURNO_D, 'Bávaro',                1),
    cond('COND-033', 'Alexis Rafael Corporán',  '001-1293847-3', 'Categoría 3', '809-772-5518', 'activo',    'MV-17',  TURNO_D, 'Aeropuerto PUJ',        3),
    cond('COND-034', 'Bienvenido Sánchez Rojas','001-1049283-8', 'Categoría 2', '829-127-3364', 'activo',    'SED-03', TURNO_D, 'Cap Cana',              2),
    cond('COND-035', 'Fausto Miguel Herrera',   '001-1385720-1', 'Categoría 3', '809-903-6620', 'activo',    'MV-18',  TURNO_D, 'Uvero Alto',            2),
    cond('COND-036', 'Ariel de la Cruz Matos',  '001-1256093-6', 'Categoría 4', '809-334-9917', 'activo',    'BUS-10', TURNO_D, 'Bávaro',                1),
    cond('COND-037', 'Genaro Antonio Valdez',   '001-1418572-4', 'Categoría 2', '829-556-2283', 'activo',    'SUV-06', TURNO_D, 'Arena Gorda',           2),
    cond('COND-038', 'Milciades Rondón Paulino','001-1163948-0', 'Categoría 4', '809-241-7736', 'activo',    'BUS-11', TURNO_D, 'Aeropuerto PUJ',        1),
    cond('COND-039', 'Robinson Alcántara Ruiz', '001-1394028-5', 'Categoría 2', '809-887-4419', 'activo',    'SED-04', TURNO_D, 'Bávaro',                3),
    cond('COND-040', 'Máximo Antonio Pichardo', '001-1207384-9', 'Categoría 2', '829-663-8850', 'activo',    'SUV-07', TURNO_D, 'Cap Cana',              2),
    cond('COND-041', 'Jhonatan Rafael Medina',  '001-1471928-2', 'Categoría 4', '809-529-3374', 'libre',     'BUS-12', TURNO_L, 'Base — Higüey',         0),
    cond('COND-042', 'Aneudy José Peguero',     '001-1138475-7', 'Categoría 2', '809-716-2245', 'activo',    'SUV-08', TURNO_D, 'Bávaro',                2),
    cond('COND-043', 'Wascar Antonio Guillén',  '001-1362849-3', 'Categoría 4', '829-330-6681', 'activo',    'BUS-13', TURNO_D, 'La Romana',             1),
    cond('COND-044', 'Yoel Emilio Santana',     '001-1284037-6', 'Categoría 2', '809-448-9973', 'activo',    'SED-05', TURNO_L, 'Base — Higüey',         0),
    cond('COND-045', 'Rafael Pimentel Ureña',   '001-1059372-4', 'Categoría 3', '809-225-1108', 'activo',    'SUV-09', TURNO_D, 'Bávaro',                2),
    cond('COND-046', 'Amaury Antonio Rivera',   '001-1427593-8', 'Categoría 4', '829-774-5536', 'activo',    'BUS-14', TURNO_D, 'Aeropuerto PUJ',        1),
    cond('COND-047', 'Carlos Julio Mañón',      '001-1193846-1', 'Categoría 2', '809-602-8842', 'activo',    'SUV-10', TURNO_D, 'Cap Cana',              2),
    cond('COND-048', 'Eusebio Ramón Tavárez',   '001-1348029-7', 'Categoría 2', '809-337-4415', 'libre',     'SED-06', TURNO_L, 'Base — Higüey',         0),

    // --- Relevo / segundo turno (sin vehículo fijo asignado) ---
    cond('COND-049', 'Jorge Luis Marte',        '001-1275384-2', 'Categoría 3', '829-119-7763', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-050', 'Alfredo Antonio Nova',    '001-1408592-5', 'Categoría 4', '809-553-2294', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-051', 'Kelvin Manuel Abreu',     '001-1162948-8', 'Categoría 3', '809-880-6617', 'activo', null, TURNO_N, 'Aeropuerto PUJ',   1),
    cond('COND-052', 'Rubén Darío Espinal',     '001-1339485-0', 'Categoría 2', '829-447-3328', 'activo', null, TURNO_N, 'Bávaro',           1),
    cond('COND-053', 'Nicolás Alberto Frías',   '001-1284759-6', 'Categoría 3', '809-226-9940', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-054', 'Osvaldo Rafael Brito',    '001-1451028-3', 'Categoría 4', '809-718-4472', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-055', 'Erick Manuel Volquez',    '001-1097482-9', 'Categoría 2', '829-635-1185', 'activo', null, TURNO_N, 'Cap Cana',         1),
    cond('COND-056', 'Dionisio Antonio Payano', '001-1372046-4', 'Categoría 3', '809-341-7726', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-057', 'Gregorio Ramón Casilla',  '001-1248593-1', 'Categoría 3', '809-559-8803', 'vacaciones', null, TURNO_L, 'No disponible', 0),
    cond('COND-058', 'Marino Antonio Zapata',   '001-1416839-7', 'Categoría 4', '829-772-6659', 'activo', null, TURNO_N, 'Base — Higüey',    0),
    cond('COND-059', 'Braulio Enrique Santos',  '001-1183947-5', 'Categoría 2', '809-224-5531', 'activo', null, TURNO_N, 'Bávaro',           1),
    cond('COND-060', 'Wilfredo José Then',      '001-1360284-2', 'Categoría 3', '809-903-1147', 'activo', null, TURNO_N, 'Base — Higüey',    0),
  ];

  // Enlace inverso conductor → vehículo
  CONDUCTORES.forEach(function (c) {
    if (!c.vehiculo_asignado) return;
    const v = VEHICULOS.find(function (x) { return x.id === c.vehiculo_asignado; });
    if (v) v.conductor_asignado = c.id;
  });

  /* ---------------------------------------------------------------- 2.6 */
  const VUELOS = [
    // Llegadas (12)
    { id: 'V-01', numero: 'AA 1582', aerolinea: 'American Airlines', tipo: 'llegada', hora_programada: '06:45', hora_estimada: '06:45', estado: 'aterrizado', origen: 'MIA', pax_total: 142, pax_transfer: 38, touroperador_id: 'TO-002' },
    { id: 'V-02', numero: 'UA 1744', aerolinea: 'United Airlines',   tipo: 'llegada', hora_programada: '07:15', hora_estimada: '07:15', estado: 'aterrizado', origen: 'EWR', pax_total: 168, pax_transfer: 24, touroperador_id: 'TO-002' },
    { id: 'V-03', numero: 'DL 483',  aerolinea: 'Delta Air Lines',   tipo: 'llegada', hora_programada: '08:30', hora_estimada: '08:25', estado: 'aterrizado', origen: 'ATL', pax_total: 156, pax_transfer: 31, touroperador_id: 'TO-002' },
    { id: 'V-04', numero: 'WS 2618', aerolinea: 'WestJet',           tipo: 'llegada', hora_programada: '09:40', hora_estimada: '09:55', estado: 'en_vuelo',   origen: 'YYZ', pax_total: 189, pax_transfer: 45, touroperador_id: 'TO-003' },
    { id: 'V-05', numero: 'X3 4412', aerolinea: 'TUIfly',            tipo: 'llegada', hora_programada: '10:20', hora_estimada: '10:20', estado: 'en_vuelo',   origen: 'FRA', pax_total: 210, pax_transfer: 62, touroperador_id: 'TO-001' },
    { id: 'V-06', numero: 'DE 2156', aerolinea: 'Condor',            tipo: 'llegada', hora_programada: '11:00', hora_estimada: '11:35', estado: 'retrasado',  origen: 'MUC', pax_total: 198, pax_transfer: 28, touroperador_id: 'TO-004' },
    { id: 'V-07', numero: 'B6 1239', aerolinea: 'JetBlue',           tipo: 'llegada', hora_programada: '12:15', hora_estimada: '12:15', estado: 'programado', origen: 'JFK', pax_total: 150, pax_transfer: 19, touroperador_id: 'TO-002' },
    { id: 'V-08', numero: 'WG 4818', aerolinea: 'Sunwing Airlines',  tipo: 'llegada', hora_programada: '13:30', hora_estimada: '13:30', estado: 'programado', origen: 'YUL', pax_total: 176, pax_transfer: 52, touroperador_id: 'TO-003' },
    { id: 'V-09', numero: 'TS 766',  aerolinea: 'Air Transat',       tipo: 'llegada', hora_programada: '14:45', hora_estimada: '14:45', estado: 'programado', origen: 'YYZ', pax_total: 195, pax_transfer: 35, touroperador_id: 'TO-003' },
    { id: 'V-10', numero: 'IB 6501', aerolinea: 'Iberia',            tipo: 'llegada', hora_programada: '15:50', hora_estimada: '15:50', estado: 'programado', origen: 'MAD', pax_total: 220, pax_transfer: 41, touroperador_id: 'TO-005' },
    { id: 'V-11', numero: 'NK 583',  aerolinea: 'Spirit Airlines',   tipo: 'llegada', hora_programada: '16:30', hora_estimada: '16:30', estado: 'cancelado',  origen: 'FLL', pax_total: 178, pax_transfer: 22, touroperador_id: 'TO-002' },
    { id: 'V-12', numero: 'LY 7901', aerolinea: 'Copa Airlines',     tipo: 'llegada', hora_programada: '17:20', hora_estimada: '17:20', estado: 'programado', origen: 'PTY', pax_total: 130, pax_transfer: 15, touroperador_id: null },

    // Salidas (8) — determinan los pickups de retorno
    { id: 'V-13', numero: 'AA 1583', aerolinea: 'American Airlines', tipo: 'salida', hora_programada: '14:00', hora_estimada: '14:00', estado: 'programado', destino: 'MIA', pax_total: 142, pax_checkout: 32 },
    { id: 'V-14', numero: 'UA 1745', aerolinea: 'United Airlines',   tipo: 'salida', hora_programada: '15:30', hora_estimada: '15:30', estado: 'programado', destino: 'EWR', pax_total: 168, pax_checkout: 28 },
    { id: 'V-15', numero: 'DL 484',  aerolinea: 'Delta Air Lines',   tipo: 'salida', hora_programada: '16:45', hora_estimada: '16:45', estado: 'programado', destino: 'ATL', pax_total: 156, pax_checkout: 18 },
    { id: 'V-16', numero: 'WS 2619', aerolinea: 'WestJet',           tipo: 'salida', hora_programada: '17:30', hora_estimada: '17:30', estado: 'programado', destino: 'YYZ', pax_total: 189, pax_checkout: 40 },
    { id: 'V-17', numero: 'X3 4413', aerolinea: 'TUIfly',            tipo: 'salida', hora_programada: '18:15', hora_estimada: '18:15', estado: 'programado', destino: 'FRA', pax_total: 210, pax_checkout: 55 },
    { id: 'V-18', numero: 'B6 1240', aerolinea: 'JetBlue',           tipo: 'salida', hora_programada: '19:00', hora_estimada: '19:00', estado: 'programado', destino: 'JFK', pax_total: 150, pax_checkout: 14 },
    { id: 'V-19', numero: 'DE 2157', aerolinea: 'Condor',            tipo: 'salida', hora_programada: '20:30', hora_estimada: '20:30', estado: 'programado', destino: 'MUC', pax_total: 198, pax_checkout: 25 },
    { id: 'V-20', numero: 'IB 6502', aerolinea: 'Iberia',            tipo: 'salida', hora_programada: '22:00', hora_estimada: '22:00', estado: 'programado', destino: 'MAD', pax_total: 220, pax_checkout: 38 },
  ];

  /* ---------------------------------------------------------------- 2.8 */
  const EXCURSIONES_RUTAS = [
    { id: 'EXC-01', nombre: 'Isla Saona — Full Day',        salida: '07:00', retorno_estimado: '17:30', punto_embarque: 'Bayahíbe',       hoteles_pickup: ['H-01', 'H-02', 'H-05', 'H-09'], horas_pickup: ['06:00', '06:15', '06:25', '06:35'], vehiculo_id: 'BUS-03', conductor_id: 'COND-008', pax: 38 },
    { id: 'EXC-02', nombre: 'Altos de Chavón & Casa de Campo', salida: '08:00', retorno_estimado: '16:00', punto_embarque: 'La Romana',   hoteles_pickup: ['H-03', 'H-07', 'H-11'],         horas_pickup: ['06:45', '07:00', '07:10'],         vehiculo_id: 'BUS-01', conductor_id: 'COND-005', pax: 26 },
    { id: 'EXC-03', nombre: 'Cenote Indigenous Eyes',       salida: '09:00', retorno_estimado: '14:30', punto_embarque: 'Scape Park',     hoteles_pickup: ['H-04', 'H-12'],                 horas_pickup: ['08:10', '08:25'],                 vehiculo_id: 'MV-04',  conductor_id: 'COND-006', pax: 12 },
    { id: 'EXC-04', nombre: 'Santo Domingo City Tour',      salida: '06:30', retorno_estimado: '19:00', punto_embarque: 'Zona Colonial',  hoteles_pickup: ['H-02', 'H-08', 'H-10'],         horas_pickup: ['05:30', '05:45', '05:55'],         vehiculo_id: 'BUS-05', conductor_id: 'COND-016', pax: 34 },
    { id: 'EXC-05', nombre: 'Zip Line Anamuya',             salida: '08:30', retorno_estimado: '13:30', punto_embarque: 'Anamuya',        hoteles_pickup: ['H-01', 'H-05'],                 horas_pickup: ['07:40', '07:55'],                 vehiculo_id: 'MV-06',  conductor_id: 'COND-011', pax: 14 },
    { id: 'EXC-06', nombre: 'Catamaran Party',              salida: '09:30', retorno_estimado: '15:00', punto_embarque: 'Playa Bávaro',   hoteles_pickup: ['H-07', 'H-09', 'H-11'],         horas_pickup: ['08:40', '08:50', '09:00'],         vehiculo_id: 'BUS-02', conductor_id: 'COND-007', pax: 28 },
    { id: 'EXC-07', nombre: 'Marinarium Snorkel',           salida: '10:00', retorno_estimado: '14:00', punto_embarque: 'Cabeza de Toro', hoteles_pickup: ['H-03', 'H-06'],                 horas_pickup: ['09:05', '09:20'],                 vehiculo_id: 'MV-07',  conductor_id: 'COND-013', pax: 13 },
    { id: 'EXC-08', nombre: 'Hoyo Azul',                    salida: '09:00', retorno_estimado: '13:00', punto_embarque: 'Scape Park',     hoteles_pickup: ['H-04', 'H-08'],                 horas_pickup: ['08:00', '08:15'],                 vehiculo_id: 'MV-10',  conductor_id: 'COND-019', pax: 12 },
    { id: 'EXC-09', nombre: 'Montaña Redonda',              salida: '07:30', retorno_estimado: '15:30', punto_embarque: 'Miches',         hoteles_pickup: ['H-06', 'H-10', 'H-12'],         horas_pickup: ['06:20', '06:35', '06:50'],         vehiculo_id: 'BUS-04', conductor_id: 'COND-012', pax: 30 },
    { id: 'EXC-10', nombre: 'Cueva Fun Fun',                salida: '07:00', retorno_estimado: '16:00', punto_embarque: 'Hato Mayor',     hoteles_pickup: ['H-05', 'H-09'],                 horas_pickup: ['06:05', '06:20'],                 vehiculo_id: 'BUS-06', conductor_id: 'COND-020', pax: 24 },
  ];

  /* ---------------------------------------------------------------- 2.7
     40 servicios del día. Orden aproximado por hora de pickup.
     15 transfer_in · 10 transfer_out · 10 excursion · 5 privado          */
  function svc(id, tipo, touroperador_id, vuelo_id, hotel_ids, hora_pickup, hora_entrega_estimada, vehiculo_id, conductor_id, pax, estado, referencia_to, notas, comision_usd, excursion_id) {
    return {
      id, tipo, touroperador_id, vuelo_id, hotel_ids, hora_pickup, hora_entrega_estimada,
      vehiculo_id, conductor_id, pax, estado, referencia_to, notas, comision_usd,
      excursion_id: excursion_id || null,
    };
  }

  const SERVICIOS = [
    /* ---- Excursiones de madrugada (pickups 05:30–06:50) ---- */
    svc('SVC-023', 'excursion', 'TO-001', null, ['H-02', 'H-08', 'H-10'], '05:30', '19:00', 'BUS-05', 'COND-016', 34, 'en_curso',   'TUI-PUJ-20260722-004', 'Santo Domingo City Tour. Retorno estimado 19:00.',            408, 'EXC-04'),
    svc('SVC-020', 'excursion', 'TO-005', null, ['H-01', 'H-02', 'H-05', 'H-09'], '06:00', '17:30', 'BUS-03', 'COND-008', 38, 'en_curso', 'PAL-PUJ-20260722-011', 'Isla Saona Full Day. Embarque Bayahíbe 07:00.',            684, 'EXC-01'),
    svc('SVC-035', 'excursion', 'TO-003', null, ['H-05', 'H-09'],         '06:05', '16:00', 'BUS-06', 'COND-020', 24, 'en_curso',   'SUN-PUJ-20260722-021', 'Cueva Fun Fun. Requiere calzado cerrado (comunicado a TO).',  324, 'EXC-10'),
    svc('SVC-034', 'excursion', 'TO-004', null, ['H-06', 'H-10', 'H-12'], '06:20', '15:30', 'BUS-04', 'COND-012', 30, 'en_curso',   'FTI-PUJ-20260722-009', 'Montaña Redonda. Salida 07:30 desde Miches.',                 315, 'EXC-09'),

    /* ---- Transfers IN de vuelos de madrugada (completados) ---- */
    svc('SVC-001', 'transfer_in',  'TO-002', 'V-01', ['H-03'], '06:30', '07:20', 'MV-01', 'COND-001', 12, 'completado', 'APV-PUJ-20260722-101', 'AA 1582 aterrizó puntual. Entrega sin novedad.',               96, null),
    svc('SVC-002', 'transfer_in',  'TO-002', 'V-01', ['H-07'], '06:40', '07:35', 'MV-13', 'COND-025', 14, 'completado', 'APV-PUJ-20260722-102', 'Segundo vehículo del mismo vuelo.',                          112, null),
    svc('SVC-021', 'excursion',    'TO-002', null,  ['H-03', 'H-07', 'H-11'], '06:45', '16:00', 'BUS-01', 'COND-005', 26, 'en_curso', 'APV-PUJ-20260722-006', 'Altos de Chavón & Casa de Campo.',                     390, 'EXC-02'),
    svc('SVC-003', 'transfer_in',  'TO-002', 'V-02', ['H-11'], '07:05', '07:55', 'MV-17', 'COND-033', 11, 'completado', 'APV-PUJ-20260722-103', 'UA 1744. Entrega confirmada por el hotel.',                   88, null),
    svc('SVC-008', 'transfer_in',  'TO-001', 'V-02', ['H-07'], '07:20', '08:15', 'MV-03', 'COND-004',  8, 'completado', 'TUI-PUJ-20260722-015', '4 pax no-show. Servicio ejecutado con 8/12 pax. Comisión recalculada.', 64, null),
    svc('SVC-027', 'excursion',    'TO-001', null,  ['H-04', 'H-08'],  '08:00', '13:00', 'MV-10', 'COND-019', 12, 'en_curso',  'TUI-PUJ-20260722-018', 'Hoyo Azul. Entrada incluida en el paquete.',              120, 'EXC-08'),
    svc('SVC-004', 'transfer_in',  'TO-002', 'V-03', ['H-03'], '08:35', '09:20', 'MV-08', 'COND-015', 13, 'completado', 'APV-PUJ-20260722-104', 'DL 483 aterrizó 5 min antes de lo previsto.',                104, null),
    svc('SVC-005', 'transfer_in',  'TO-002', 'V-03', ['H-09'], '08:45', '09:40', 'MV-11', 'COND-021', 15, 'completado', 'APV-PUJ-20260722-105', 'Grupo familiar. 2 sillas de bebé solicitadas y provistas.',  120, null),
    svc('SVC-024', 'excursion',    'TO-005', null,  ['H-01', 'H-05'],  '07:40', '13:30', 'MV-06', 'COND-011', 14, 'en_curso',  'PAL-PUJ-20260722-013', 'Zip Line Anamuya. Peso máximo comunicado al TO.',        168, 'EXC-05'),
    svc('SVC-022', 'excursion',    'TO-001', null,  ['H-04', 'H-12'],  '08:10', '14:30', 'MV-04', 'COND-006', 12, 'en_curso',  'TUI-PUJ-20260722-007', 'Cenote Indigenous Eyes vía Scape Park.',                 144, 'EXC-03'),
    svc('SVC-025', 'excursion',    'TO-005', null,  ['H-07', 'H-09', 'H-11'], '08:40', '15:00', 'BUS-02', 'COND-007', 28, 'en_curso', 'PAL-PUJ-20260722-014', 'Catamaran Party. Embarque Playa Bávaro 09:30.',     504, 'EXC-06'),

    /* ---- Transfers IN de vuelos de la mañana (en curso / pendientes) ---- */
    svc('SVC-006', 'transfer_in',  'TO-003', 'V-04', ['H-05'], '09:50', '10:45', 'MV-15', 'COND-029', 15, 'en_curso',   'SUN-PUJ-20260722-201', 'WS 2618 con 15 min de retraso. Conductor en espera en llegadas.', 120, null),
    svc('SVC-026', 'excursion',    'TO-004', null,  ['H-03', 'H-06'], '09:05', '14:00', 'MV-07', 'COND-013', 13, 'en_curso', 'FTI-PUJ-20260722-010', 'Marinarium Snorkel. Salida Cabeza de Toro 10:00.',       130, 'EXC-07'),
    svc('SVC-007', 'transfer_in',  'TO-003', 'V-04', ['H-10'], '10:00', '10:55', 'BUS-09', 'COND-032', 24, 'en_curso',   'SUN-PUJ-20260722-202', 'Grupo Sunwing. Autobús por volumen de equipaje.',            216, null),
    svc('SVC-009', 'transfer_in',  'TO-001', 'V-05', ['H-01'], '10:30', '11:15', 'BUS-08', 'COND-028', 18, 'pendiente',  'TUI-PUJ-20260722-038', 'X3 4412 (TUIfly). Grupo principal del vuelo.',              144, null),
    svc('SVC-010', 'transfer_in',  'TO-001', 'V-05', ['H-02'], '10:40', '11:25', 'MV-02', 'COND-002', 14, 'pendiente',  'TUI-PUJ-20260722-039', 'X3 4412. Segundo hotel de la distribución.',                112, null),
    svc('SVC-011', 'transfer_in',  'TO-001', 'V-05', ['H-08'], '10:50', '11:40', 'MV-18', 'COND-035', 12, 'pendiente',  'TUI-PUJ-20260722-040', 'X3 4412. Tercer hotel de la distribución.',                  96, null),

    /* ---- Transfers OUT de la mañana ---- */
    svc('SVC-017', 'transfer_out', 'TO-001', 'V-13', ['H-12'], '10:00', '10:50', 'MV-14', 'COND-017',  8, 'en_curso',   'TUI-PUJ-20260722-052', 'MV-09 sufrió fallo de transmisión en carretera Bávaro. MV-14 reasignada automáticamente.', 64, null),
    svc('SVC-014', 'transfer_out', 'TO-002', 'V-13', ['H-03'], '11:00', '11:50', 'MV-05', 'COND-009', 10, 'pendiente',  'APV-PUJ-20260722-118', 'Vuelo AA 1583 14:00. Pickup 3h antes.',                      80, null),
    svc('SVC-019', 'transfer_out', 'TO-005', 'V-13', ['H-09'], '11:00', '11:55', 'MV-12', 'COND-045', 11, 'pendiente',  'PAL-PUJ-20260722-027', 'COND-022 no reportó. COND-045 (Rafael Pimentel) asignado como reemplazo. Vehículo sin cambio.', 132, null),
    svc('SVC-012', 'transfer_in',  'TO-004', 'V-06', ['H-06'], '12:05', '13:00', 'SUV-02', 'COND-010', 6, 'pendiente',  'FTI-PUJ-20260722-071', 'DE 2156 retrasado 35 min. Pickup reprogramado de 11:30 a 12:05.', 42, null),
    svc('SVC-013', 'transfer_in',  'TO-004', 'V-06', ['H-11'], '12:15', '13:10', 'BUS-10', 'COND-036', 22, 'pendiente', 'FTI-PUJ-20260722-072', 'DE 2156 retrasado 35 min. Pickup reprogramado. Pax notificados por SMS.', 154, null),

    /* ---- Rebooking del vuelo cancelado NK 583 → B6 1239 ---- */
    svc('SVC-028', 'transfer_in',  'TO-002', 'V-07', ['H-03'], '12:45', '13:35', 'MV-01', 'COND-001', 12, 'pendiente',  'APV-PUJ-20260722-140', 'Reasignado desde NK 583 (cancelado). Ahora llega en B6 1239 12:15.', 96, null),
    svc('SVC-029', 'transfer_in',  'TO-002', 'V-07', ['H-07'], '12:55', '13:50', 'MV-13', 'COND-025', 10, 'pendiente',  'APV-PUJ-20260722-141', 'Reasignado desde NK 583 (cancelado). Horario ajustado.',       80, null),

    /* ---- Transfers OUT de la tarde ---- */
    svc('SVC-015', 'transfer_out', 'TO-001', 'V-14', ['H-02'], '12:30', '13:20', 'MV-03', 'COND-004', 13, 'pendiente',  'TUI-PUJ-20260722-055', 'Vuelo UA 1745 15:30.',                                      104, null),
    svc('SVC-016', 'transfer_out', 'TO-003', 'V-15', ['H-05'], '13:45', '14:35', 'MV-08', 'COND-015',  9, 'pendiente',  'SUN-PUJ-20260722-210', 'Vuelo DL 484 16:45.',                                        72, null),
    svc('SVC-018', 'transfer_out', 'TO-001', 'V-16', ['H-04'], '14:30', '15:25', 'SUV-03', 'COND-018', 7, 'pendiente',  'TUI-PUJ-20260722-058', 'Vuelo WS 2619 17:30. Salida desde Cap Cana.',                 56, null),
    svc('SVC-030', 'transfer_out', 'TO-005', 'V-17', ['H-01'], '15:15', '16:10', 'BUS-13', 'COND-043', 32, 'pendiente', 'PAL-PUJ-20260722-031', 'Vuelo X3 4413 18:15. Grupo grande, autobús 45 pax.',         384, null),
    svc('SVC-031', 'transfer_out', 'TO-002', 'V-18', ['H-07'], '16:00', '16:55', 'MV-11', 'COND-021', 14, 'pendiente',  'APV-PUJ-20260722-125', 'Vuelo B6 1240 19:00.',                                      112, null),
    svc('SVC-032', 'transfer_out', 'TO-004', 'V-19', ['H-06'], '17:30', '18:35', 'BUS-11', 'COND-038', 25, 'pendiente',  'FTI-PUJ-20260722-078', 'Vuelo DE 2157 20:30. Salida desde Uvero Alto (trayecto largo).', 175, null),
    svc('SVC-033', 'transfer_out', 'TO-005', 'V-20', ['H-11'], '19:00', '19:55', 'BUS-14', 'COND-046', 28, 'pendiente',  'PAL-PUJ-20260722-034', 'Vuelo IB 6502 22:00. Último servicio del turno diurno.',      336, null),

    /* ---- Transfers privados VIP (5) ---- */
    svc('SVC-036', 'privado', 'TO-005', 'V-01', ['H-04'], '06:55', '07:40', 'SED-01', 'COND-014', 2, 'completado', 'PAL-VIP-20260722-001', 'Traslado VIP. Cliente frecuente, agua y toallas frías.',        48, null),
    svc('SVC-037', 'privado', 'TO-001', 'V-03', ['H-01'], '08:50', '09:30', 'SED-04', 'COND-039', 3, 'completado', 'TUI-VIP-20260722-002', 'Traslado privado. Silla de ruedas plegable a bordo.',           36, null),
    svc('SVC-038', 'privado', 'TO-005', 'V-05', ['H-09'], '10:45', '11:30', 'SUV-05', 'COND-030', 4, 'pendiente',  'PAL-VIP-20260722-003', 'Traslado VIP desde X3 4412. Cartel de bienvenida solicitado.',  72, null),
    svc('SVC-039', 'privado', 'TO-002', 'V-09', ['H-04'], '14:55', '15:45', 'SUV-07', 'COND-040', 4, 'pendiente',  'APV-VIP-20260722-004', 'TS 766. Traslado a Cap Cana con parada en supermercado.',       56, null),
    svc('SVC-040', 'privado', 'TO-006', 'V-10', ['H-08'], '16:00', '16:50', 'SED-03', 'COND-034', 2, 'cancelado',  'BLD-VIP-20260722-005', 'Cancelado por el touroperador a las 09:12. Sin cargo.',          0, null),
  ];

  /* ---------------------------------------------------------------- 5.1
     8 correos de touroperador: 4 procesados, 2 nuevos, 2 con problema.   */
  const CORREOS = [
    {
      id: 'MAIL-01',
      touroperador_id: 'TO-001',
      de: 'reservas@tui-rd.com',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Transfer IN — Vuelo X3 4412 FRA→PUJ — 22 Jul 2026',
      preview: 'Adjuntamos listado de pax para transfer de llegada. Pax total: 62.',
      hora: '08:12',
      estado: 'nuevo',
      servicios_generados: 0,
      servicios_previstos: 5,
      cuerpo: [
        'Estimados,',
        '',
        'Adjuntamos listado de pax para transfer de llegada:',
      ],
      meta: [
        { k: 'Vuelo',                    v: 'X3 4412 (TUIfly)' },
        { k: 'Fecha',                    v: '22/07/2026' },
        { k: 'ETA',                      v: '10:20' },
        { k: 'Pax total para transfer',  v: '62' },
      ],
      distribucion: [
        { hotel_id: 'H-01', hotel: 'Iberostar Grand Bávaro', pax: 18, ref: 'TUI-PUJ-20260722-038' },
        { hotel_id: 'H-02', hotel: 'Barceló Bávaro Palace',  pax: 14, ref: 'TUI-PUJ-20260722-039' },
        { hotel_id: 'H-08', hotel: 'Riu Palace Punta Cana',  pax: 12, ref: 'TUI-PUJ-20260722-040' },
        { hotel_id: 'H-12', hotel: 'Lopesan Costa Bávaro',   pax: 10, ref: 'TUI-PUJ-20260722-041' },
        { hotel_id: 'H-11', hotel: 'Paradisus Palma Real',   pax: 8,  ref: 'TUI-PUJ-20260722-042' },
      ],
      requerimiento: 'Requieren: 3 minivans + 1 autobús',
      firma: ['Saludos,', 'Departamento de Operaciones Terrestres', 'TUI Group — República Dominicana'],
      sugerencias: [
        { hotel: 'Iberostar Grand Bávaro', pax: 18, vehiculo_id: 'BUS-08', conductor_id: 'COND-028', hora_pickup: '10:30' },
        { hotel: 'Barceló Bávaro Palace',  pax: 14, vehiculo_id: 'MV-02',  conductor_id: 'COND-002', hora_pickup: '10:40' },
        { hotel: 'Riu Palace Punta Cana',  pax: 12, vehiculo_id: 'MV-18',  conductor_id: 'COND-035', hora_pickup: '10:50' },
        { hotel: 'Lopesan Costa Bávaro',   pax: 10, vehiculo_id: 'MV-05',  conductor_id: 'COND-009', hora_pickup: '11:00' },
        { hotel: 'Paradisus Palma Real',   pax: 8,  vehiculo_id: 'SUV-06', conductor_id: 'COND-037', hora_pickup: '11:10' },
      ],
    },
    {
      id: 'MAIL-02',
      touroperador_id: 'TO-003',
      de: 'ground@sunwing.ca',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Transfer IN — WG 4818 YUL→PUJ — 52 pax — 22 Jul',
      preview: 'Vuelo chárter Sunwing. Confirmar disponibilidad de 2 autobuses.',
      hora: '08:47',
      estado: 'nuevo',
      servicios_generados: 0,
      servicios_previstos: 3,
      cuerpo: [
        'Good morning / Buenos días,',
        '',
        'Please confirm ground transport for our charter arrival:',
      ],
      meta: [
        { k: 'Vuelo',                   v: 'WG 4818 (Sunwing Airlines)' },
        { k: 'Fecha',                   v: '22/07/2026' },
        { k: 'ETA',                     v: '13:30' },
        { k: 'Pax total para transfer', v: '52' },
      ],
      distribucion: [
        { hotel_id: 'H-05', hotel: 'Majestic Elegance',  pax: 24, ref: 'SUN-PUJ-20260722-215' },
        { hotel_id: 'H-10', hotel: 'Occidental Caribe',  pax: 18, ref: 'SUN-PUJ-20260722-216' },
        { hotel_id: 'H-09', hotel: 'Dreams Punta Cana',  pax: 10, ref: 'SUN-PUJ-20260722-217' },
      ],
      requerimiento: 'Requieren: 2 autobuses + 1 minivan',
      firma: ['Best regards,', 'Ground Operations Desk', 'Sunwing Vacations — Punta Cana'],
      sugerencias: [
        { hotel: 'Majestic Elegance', pax: 24, vehiculo_id: 'BUS-09', conductor_id: 'COND-032', hora_pickup: '13:45' },
        { hotel: 'Occidental Caribe', pax: 18, vehiculo_id: 'BUS-10', conductor_id: 'COND-036', hora_pickup: '13:55' },
        { hotel: 'Dreams Punta Cana', pax: 10, vehiculo_id: 'MV-11',  conductor_id: 'COND-021', hora_pickup: '14:05' },
      ],
    },
    {
      id: 'MAIL-03',
      touroperador_id: 'TO-004',
      de: 'transfers@fti.de',
      para: 'operaciones@caribetrans.com.do',
      asunto: '⚠ URGENTE — DE 2156 retrasado 35 min — reprogramar pickups',
      preview: 'Condor informa retraso. Necesitamos ajuste de horarios de recogida.',
      hora: '09:44',
      estado: 'con_problema',
      servicios_generados: 2,
      servicios_previstos: 2,
      cuerpo: [
        'Estimados socios,',
        '',
        'Condor nos confirma retraso en el vuelo DE 2156 procedente de Múnich.',
        'Solicitamos reprogramar los pickups asociados sin cargo adicional.',
      ],
      meta: [
        { k: 'Vuelo',            v: 'DE 2156 (Condor)' },
        { k: 'ETA original',     v: '11:00' },
        { k: 'ETA revisada',     v: '11:35 (+35 min)' },
        { k: 'Pax afectados',    v: '28' },
      ],
      distribucion: [
        { hotel_id: 'H-06', hotel: 'Zoëtry Agua Punta Cana', pax: 6,  ref: 'FTI-PUJ-20260722-071' },
        { hotel_id: 'H-11', hotel: 'Paradisus Palma Real',   pax: 22, ref: 'FTI-PUJ-20260722-072' },
      ],
      requerimiento: 'Servicios ya generados — requieren reprogramación de horario',
      firma: ['Mit freundlichen Grüßen,', 'Transfer Operations', 'FTI Touristik GmbH'],
      sugerencias: [
        { hotel: 'Zoëtry Agua Punta Cana', pax: 6,  vehiculo_id: 'SUV-02', conductor_id: 'COND-010', hora_pickup: '12:05' },
        { hotel: 'Paradisus Palma Real',   pax: 22, vehiculo_id: 'BUS-10', conductor_id: 'COND-036', hora_pickup: '12:15' },
      ],
    },
    {
      id: 'MAIL-04',
      touroperador_id: 'TO-002',
      de: 'ops@applevacations.com',
      para: 'operaciones@caribetrans.com.do',
      asunto: '⚠ NK 583 CANCELLED — rebooking to B6 1239',
      preview: 'Spirit cancela FLL→PUJ. 22 pax reubicados en JetBlue 12:15.',
      hora: '07:26',
      estado: 'con_problema',
      servicios_generados: 2,
      servicios_previstos: 2,
      cuerpo: [
        'Urgent — please action immediately.',
        '',
        'Spirit Airlines has cancelled NK 583 (FLL→PUJ, ETA 16:30).',
        'All 22 transfer pax have been rebooked on B6 1239, arriving 12:15.',
      ],
      meta: [
        { k: 'Vuelo cancelado', v: 'NK 583 (Spirit Airlines)' },
        { k: 'Vuelo sustituto', v: 'B6 1239 (JetBlue) — ETA 12:15' },
        { k: 'Pax afectados',   v: '22' },
        { k: 'Prioridad',       v: 'Crítica' },
      ],
      distribucion: [
        { hotel_id: 'H-03', hotel: 'Hard Rock Hotel Punta Cana', pax: 12, ref: 'APV-PUJ-20260722-140' },
        { hotel_id: 'H-07', hotel: 'Secrets Royal Beach',        pax: 10, ref: 'APV-PUJ-20260722-141' },
      ],
      requerimiento: 'Servicios reasignados automáticamente al vuelo B6 1239',
      firma: ['Regards,', 'Destination Operations', 'Apple Vacations'],
      sugerencias: [
        { hotel: 'Hard Rock Hotel Punta Cana', pax: 12, vehiculo_id: 'MV-01',  conductor_id: 'COND-001', hora_pickup: '12:45' },
        { hotel: 'Secrets Royal Beach',        pax: 10, vehiculo_id: 'MV-13',  conductor_id: 'COND-025', hora_pickup: '12:55' },
      ],
    },
    {
      id: 'MAIL-05',
      touroperador_id: 'TO-005',
      de: 'transport@palladiumgroup.com',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Excursión Isla Saona — 38 pax — pickup 06:00',
      preview: 'Confirmación de recogida multi-hotel para Isla Saona Full Day.',
      hora: '06:02',
      estado: 'procesado',
      servicios_generados: 1,
      servicios_previstos: 1,
      cuerpo: [
        'Buenos días,',
        '',
        'Confirmamos la excursión de hoy con recogida multi-hotel:',
      ],
      meta: [
        { k: 'Excursión',       v: 'Isla Saona — Full Day' },
        { k: 'Salida',          v: '07:00 desde Bayahíbe' },
        { k: 'Retorno',         v: '17:30 (estimado)' },
        { k: 'Pax total',       v: '38' },
      ],
      distribucion: [
        { hotel_id: 'H-01', hotel: 'Iberostar Grand Bávaro', pax: 12, ref: 'PAL-PUJ-20260722-011' },
        { hotel_id: 'H-02', hotel: 'Barceló Bávaro Palace',  pax: 10, ref: 'PAL-PUJ-20260722-011' },
        { hotel_id: 'H-05', hotel: 'Majestic Elegance',      pax: 9,  ref: 'PAL-PUJ-20260722-011' },
        { hotel_id: 'H-09', hotel: 'Dreams Punta Cana',      pax: 7,  ref: 'PAL-PUJ-20260722-011' },
      ],
      requerimiento: 'Requieren: 1 autobús de 30+ pax',
      firma: ['Atentamente,', 'Departamento de Transporte', 'Palladium Hotel Group'],
      sugerencias: [
        { hotel: 'Ruta multi-hotel (4 paradas)', pax: 38, vehiculo_id: 'BUS-03', conductor_id: 'COND-008', hora_pickup: '06:00' },
      ],
    },
    {
      id: 'MAIL-06',
      touroperador_id: 'TO-002',
      de: 'ops@applevacations.com',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Transfer IN — AA 1582 MIA→PUJ — 26 pax',
      preview: 'Llegada 06:45. Distribución en 2 hoteles.',
      hora: '05:31',
      estado: 'procesado',
      servicios_generados: 2,
      servicios_previstos: 2,
      cuerpo: [
        'Good morning,',
        '',
        'Transfer manifest for this morning arrival:',
      ],
      meta: [
        { k: 'Vuelo',                   v: 'AA 1582 (American Airlines)' },
        { k: 'Fecha',                   v: '22/07/2026' },
        { k: 'ETA',                     v: '06:45' },
        { k: 'Pax total para transfer', v: '26' },
      ],
      distribucion: [
        { hotel_id: 'H-03', hotel: 'Hard Rock Hotel Punta Cana', pax: 12, ref: 'APV-PUJ-20260722-101' },
        { hotel_id: 'H-07', hotel: 'Secrets Royal Beach',        pax: 14, ref: 'APV-PUJ-20260722-102' },
      ],
      requerimiento: 'Requieren: 2 minivans',
      firma: ['Regards,', 'Destination Operations', 'Apple Vacations'],
      sugerencias: [
        { hotel: 'Hard Rock Hotel Punta Cana', pax: 12, vehiculo_id: 'MV-01',  conductor_id: 'COND-001', hora_pickup: '06:30' },
        { hotel: 'Secrets Royal Beach',        pax: 14, vehiculo_id: 'MV-13',  conductor_id: 'COND-025', hora_pickup: '06:40' },
      ],
    },
    {
      id: 'MAIL-07',
      touroperador_id: 'TO-001',
      de: 'reservas@tui-rd.com',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Transfer OUT — X3 4413 PUJ→FRA — 32 pax — pickup 15:15',
      preview: 'Retorno del grupo TUI. Recogida en Iberostar Grand Bávaro.',
      hora: '07:58',
      estado: 'procesado',
      servicios_generados: 1,
      servicios_previstos: 1,
      cuerpo: [
        'Estimados,',
        '',
        'Listado de salida para el vuelo de retorno de hoy:',
      ],
      meta: [
        { k: 'Vuelo',        v: 'X3 4413 (TUIfly)' },
        { k: 'Salida',       v: '18:15' },
        { k: 'Pickup',       v: '15:15 (3h antes)' },
        { k: 'Pax',          v: '32' },
      ],
      distribucion: [
        { hotel_id: 'H-01', hotel: 'Iberostar Grand Bávaro', pax: 32, ref: 'PAL-PUJ-20260722-031' },
      ],
      requerimiento: 'Requieren: 1 autobús de 45 pax (volumen de equipaje)',
      firma: ['Saludos,', 'Departamento de Operaciones Terrestres', 'TUI Group — República Dominicana'],
      sugerencias: [
        { hotel: 'Iberostar Grand Bávaro', pax: 32, vehiculo_id: 'BUS-13', conductor_id: 'COND-043', hora_pickup: '15:15' },
      ],
    },
    {
      id: 'MAIL-08',
      touroperador_id: 'TO-004',
      de: 'transfers@fti.de',
      para: 'operaciones@caribetrans.com.do',
      asunto: 'Excursión Montaña Redonda — 30 pax — 3 hoteles',
      preview: 'Recogida escalonada 06:20 / 06:35 / 06:50. Salida 07:30 desde Miches.',
      hora: '05:48',
      estado: 'procesado',
      servicios_generados: 1,
      servicios_previstos: 1,
      cuerpo: [
        'Guten Morgen,',
        '',
        'Bestätigung der heutigen Ausflugsabholung / Confirmación de recogida:',
      ],
      meta: [
        { k: 'Excursión', v: 'Montaña Redonda' },
        { k: 'Salida',    v: '07:30 desde Miches' },
        { k: 'Retorno',   v: '15:30 (estimado)' },
        { k: 'Pax total', v: '30' },
      ],
      distribucion: [
        { hotel_id: 'H-06', hotel: 'Zoëtry Agua Punta Cana', pax: 11, ref: 'FTI-PUJ-20260722-009' },
        { hotel_id: 'H-10', hotel: 'Occidental Caribe',      pax: 10, ref: 'FTI-PUJ-20260722-009' },
        { hotel_id: 'H-12', hotel: 'Lopesan Costa Bávaro',   pax: 9,  ref: 'FTI-PUJ-20260722-009' },
      ],
      requerimiento: 'Requieren: 1 autobús de 30 pax',
      firma: ['Mit freundlichen Grüßen,', 'Transfer Operations', 'FTI Touristik GmbH'],
      sugerencias: [
        { hotel: 'Ruta multi-hotel (3 paradas)', pax: 30, vehiculo_id: 'BUS-04', conductor_id: 'COND-012', hora_pickup: '06:20' },
      ],
    },
  ];

  /* ---------------------------------------------------------------- 2.9 */
  const ALERTAS = [
    {
      id: 'ALT-02',
      tipo: 'vehiculo_averiado',
      severidad: 'critica',
      titulo: 'MV-09 — Fallo de transmisión',
      descripcion: 'Ford Transit 2020 detenida en carretera Bávaro. 8 pax a bordo.',
      vehiculo_id: 'MV-09',
      servicios_afectados: ['SVC-017'],
      accion_automatica: 'MV-14 reasignada automáticamente. ETA rescate: 18 min. Pasajeros notificados.',
      acciones: [
        'MV-14 (Víctor Manuel Ozuna) reasignada automáticamente',
        'ETA de rescate: 18 minutos — vehículo en camino',
        'Pasajeros notificados por SMS y app del touroperador',
        'MV-09 marcada en mantenimiento y retirada de la programación',
      ],
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
      acciones: [
        'COND-045 (Rafael Pimentel) asignado como reemplazo',
        'Vehículo MV-12 sin cambio — llaves entregadas en base',
        'Incidencia registrada en el expediente de COND-022',
      ],
      timestamp: '10:38',
      estado: 'resuelta',
    },
    {
      id: 'ALT-01',
      tipo: 'vuelo_retrasado',
      severidad: 'alta',
      titulo: 'Vuelo DE 2156 retrasado 35 min',
      descripcion: 'Condor desde Múnich. 28 pax afectados. ETA: 11:35 en lugar de 11:00.',
      vuelo_id: 'V-06',
      servicios_afectados: ['SVC-012', 'SVC-013'],
      accion_automatica: 'Pickup reprogramado de 11:30 a 12:05. Conductores notificados.',
      acciones: [
        'Pickup de SVC-012 reprogramado de 11:30 a 12:05',
        'Pickup de SVC-013 reprogramado de 11:40 a 12:15',
        'Conductores COND-010 y COND-036 notificados en la app',
        'FTI Touristik informado del nuevo horario',
      ],
      timestamp: '09:47',
      estado: 'activa',
    },
    {
      id: 'ALT-04',
      tipo: 'pax_no_show',
      severidad: 'baja',
      titulo: '4 pax no-show en Secrets Royal Beach',
      descripcion: 'Ref TUI-PUJ-20260722-015. Touroperador notificado. Servicio ejecutado con 8/12 pax.',
      servicios_afectados: ['SVC-008'],
      accion_automatica: 'Comisión recalculada sobre 8 pax. Registro para facturación.',
      acciones: [
        'Comisión recalculada sobre 8 pax (de 12 previstos)',
        'Registro de no-show enviado a facturación',
        'TUI Group notificado con evidencia de espera (22 min)',
      ],
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
      acciones: [
        'Servicios SVC-028 y SVC-029 reasignados a B6 1239',
        'Horarios ajustados: pickup 12:45 (antes 17:00)',
        '2 vehículos liberados para reasignación',
      ],
      timestamp: '07:30',
      estado: 'activa',
    },
  ];

  // Panel lateral del tab de alertas: reasignaciones de recursos
  const REASIGNACIONES = [
    { alerta_id: 'ALT-02', motivo: 'averiada',   origen: 'MV-09',     destino: 'MV-14',     detalle: 'Fallo de transmisión' },
    { alerta_id: 'ALT-03', motivo: 'ausente',    origen: 'COND-022',  destino: 'COND-045',  detalle: 'Rafael Pimentel' },
    { alerta_id: 'ALT-05', motivo: 'cancelado',  origen: 'NK 583',    destino: 'B6 1239',   detalle: '22 pax rebooking' },
  ];

  /* ---------------------------------------------------------------- 2.10 */
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
    ingresos_dia_usd: 12840,
    comisiones_dia_usd: 2156,
    alertas_activas: 2,
    alertas_resueltas: 3,
    ocupacion_flota_pct: 87,
    puntualidad_pct: 94.2,
    satisfaccion_pct: 4.7,
  };

  const KPI_SEMANA = [
    { dia: 'Lun', servicios: 72, ingresos: 10920, puntualidad: 96.1, aeropuerto: 44, hotel: 18, excursion: 10 },
    { dia: 'Mar', servicios: 68, ingresos: 10340, puntualidad: 93.8, aeropuerto: 41, hotel: 16, excursion: 11 },
    { dia: 'Mié', servicios: 79, ingresos: 11580, puntualidad: 95.4, aeropuerto: 48, hotel: 20, excursion: 11 },
    { dia: 'Jue', servicios: 81, ingresos: 12100, puntualidad: 92.7, aeropuerto: 50, hotel: 19, excursion: 12 },
    { dia: 'Vie', servicios: 88, ingresos: 13200, puntualidad: 97.0, aeropuerto: 54, hotel: 21, excursion: 13 },
    { dia: 'Sáb', servicios: 95, ingresos: 14800, puntualidad: 91.5, aeropuerto: 58, hotel: 23, excursion: 14 },
    { dia: 'Dom', servicios: 84, ingresos: 12840, puntualidad: 94.2, aeropuerto: 51, hotel: 20, excursion: 13 },
  ];

  // Sparklines de las KPI cards (6 días previos + hoy)
  const SPARKLINES = {
    servicios:  [72, 68, 79, 81, 88, 95, 84],
    flota:      [38, 39, 41, 40, 42, 43, 41],
    ingresos:   [10920, 10340, 11580, 12100, 13200, 14800, 12840],
    alertas:    [4, 2, 5, 3, 6, 3, 2],
  };

  /* ------------------------------------------------- Posiciones del mapa
     Proyección estilizada lat/lng → viewBox 1000×620 del SVG.
     El aeropuerto se coloca a mano en la zona central-inferior.          */
  const MAPA = {
    ancho: 1000,
    alto: 620,
    lng_min: -68.460, lng_max: -68.385,
    lat_min: 18.670,  lat_max: 18.770,
    x_min: 110, x_max: 890,
    y_min: 80,  y_max: 460,
    puj: { x: 500, y: 545 },
  };

  function proyectar(lat, lng) {
    const tx = (lng - MAPA.lng_min) / (MAPA.lng_max - MAPA.lng_min);
    const ty = (lat - MAPA.lat_min) / (MAPA.lat_max - MAPA.lat_min);
    return {
      x: Math.round(MAPA.x_min + tx * (MAPA.x_max - MAPA.x_min)),
      y: Math.round(MAPA.y_max - ty * (MAPA.y_max - MAPA.y_min)),
    };
  }

  HOTELES.forEach(function (h) {
    const p = proyectar(h.lat, h.lng);
    h.x = p.x;
    h.y = p.y;
  });

  // Carreteras estilizadas del mapa (paths SVG)
  const CARRETERAS = [
    { d: 'M 500 545 C 480 470, 420 430, 330 400 S 200 360, 150 330', nombre: 'Autopista del Coral — ramal Bávaro' },
    { d: 'M 500 545 C 560 480, 640 440, 700 400 S 790 300, 800 200', nombre: 'Carretera Uvero Alto' },
    { d: 'M 500 545 C 560 510, 640 470, 690 425', nombre: 'Bulevar Cap Cana' },
    { d: 'M 150 330 C 260 300, 400 270, 520 240 S 720 180, 800 150', nombre: 'Carretera Bávaro–Macao' },
    { d: 'M 190 420 C 300 400, 430 370, 560 340 S 730 290, 810 260', nombre: 'Bulevar Turístico del Este' },
    { d: 'M 330 400 C 350 340, 380 280, 430 235', nombre: 'Av. Alemania' },
  ];

  /* --------------------------------------- Posición GPS de los vehículos
     Estático por diseño: refleja el estado actual de la operación.
     estado_mapa: en_ruta (navy) · standby (gold) · excursion (teal) · alerta (coral) */
  const VEHICULOS_MAPA = [
    { vehiculo_id: 'MV-01',  x: 500, y: 520, estado_mapa: 'standby',   servicio_id: 'SVC-028' },
    { vehiculo_id: 'MV-13',  x: 528, y: 528, estado_mapa: 'standby',   servicio_id: 'SVC-029' },
    { vehiculo_id: 'MV-15',  x: 452, y: 462, estado_mapa: 'en_ruta',   servicio_id: 'SVC-006' },
    { vehiculo_id: 'BUS-09', x: 400, y: 430, estado_mapa: 'en_ruta',   servicio_id: 'SVC-007' },
    { vehiculo_id: 'MV-14',  x: 268, y: 392, estado_mapa: 'en_ruta',   servicio_id: 'SVC-017' },
    { vehiculo_id: 'MV-09',  x: 232, y: 378, estado_mapa: 'alerta',    servicio_id: 'SVC-017' },
    { vehiculo_id: 'BUS-05', x: 120, y: 300, estado_mapa: 'excursion', servicio_id: 'SVC-023' },
    { vehiculo_id: 'BUS-03', x: 148, y: 452, estado_mapa: 'excursion', servicio_id: 'SVC-020' },
    { vehiculo_id: 'BUS-06', x: 232, y: 480, estado_mapa: 'excursion', servicio_id: 'SVC-035' },
    { vehiculo_id: 'BUS-04', x: 812, y: 128, estado_mapa: 'excursion', servicio_id: 'SVC-034' },
    { vehiculo_id: 'BUS-01', x: 208, y: 512, estado_mapa: 'excursion', servicio_id: 'SVC-021' },
    { vehiculo_id: 'MV-10',  x: 690, y: 398, estado_mapa: 'excursion', servicio_id: 'SVC-027' },
    { vehiculo_id: 'MV-06',  x: 372, y: 246, estado_mapa: 'excursion', servicio_id: 'SVC-024' },
    { vehiculo_id: 'MV-04',  x: 668, y: 430, estado_mapa: 'excursion', servicio_id: 'SVC-022' },
    { vehiculo_id: 'BUS-02', x: 540, y: 322, estado_mapa: 'excursion', servicio_id: 'SVC-025' },
    { vehiculo_id: 'MV-07',  x: 604, y: 452, estado_mapa: 'excursion', servicio_id: 'SVC-026' },
    { vehiculo_id: 'MV-12',  x: 372, y: 342, estado_mapa: 'standby',   servicio_id: 'SVC-019' },
    { vehiculo_id: 'MV-05',  x: 466, y: 190, estado_mapa: 'standby',   servicio_id: 'SVC-014' },
    { vehiculo_id: 'SUV-02', x: 786, y: 122, estado_mapa: 'standby',   servicio_id: 'SVC-012' },
    { vehiculo_id: 'BUS-10', x: 452, y: 268, estado_mapa: 'standby',   servicio_id: 'SVC-013' },
    { vehiculo_id: 'BUS-08', x: 476, y: 512, estado_mapa: 'standby',   servicio_id: 'SVC-009' },
    { vehiculo_id: 'MV-02',  x: 462, y: 500, estado_mapa: 'standby',   servicio_id: 'SVC-010' },
    { vehiculo_id: 'MV-18',  x: 540, y: 500, estado_mapa: 'standby',   servicio_id: 'SVC-011' },
    { vehiculo_id: 'SUV-05', x: 296, y: 358, estado_mapa: 'en_ruta',   servicio_id: 'SVC-038' },
  ];

  // Rutas activas: línea punteada desde el aeropuerto hasta el vehículo
  const RUTAS_ACTIVAS = ['MV-15', 'BUS-09', 'MV-14', 'SUV-05'];

  /* -------------------------------------------- Vista conductor (tab 4) */
  // Mezcla para el wow: excursión grande en curso, transfers con próximos
  // servicios, y el conductor de reemplazo ligado a la alerta ALT-03.
  const CONDUCTORES_DEMO = ['COND-001', 'COND-004', 'COND-008', 'COND-045'];

  /* --------------------------------------------------- Sidebar (sec. 6) */
  const NAV = [
    {
      grupo: 'Principal',
      items: [
        { id: 'dashboard',  label: 'Dashboard',          icon: 'fa-chart-pie',       activo: true },
        { id: 'operaciones', label: 'Centro Operaciones', icon: 'fa-tower-broadcast', activo: true, pulse: true },
      ],
    },
    {
      grupo: 'Módulos del Sistema',
      items: [
        { id: 'empleados',    label: 'Empleados',              icon: 'fa-users',                 badge: '127', activo: true, page: 'pages/gestion_empleados.html' },
        { id: 'nomina',       label: 'Nómina',                 icon: 'fa-money-check-dollar',                  activo: true, page: 'pages/nomina_quincenal.html' },
        { id: 'vacaciones',   label: 'Vacaciones y Ausencias', icon: 'fa-umbrella-beach',                      activo: true, page: 'pages/vacaciones_ausencias.html' },
        { id: 'flota',        label: 'Flota',                  icon: 'fa-bus',                   badge: '48',  activo: true, page: 'pages/flota.html' },
        { id: 'costos',       label: 'Costos',                 icon: 'fa-calculator',                          activo: true, page: 'pages/costos_operativos.html' },
        { id: 'contabilidad', label: 'Contabilidad',           icon: 'fa-book',                                activo: true, page: 'pages/contabilidad.html' },
        { id: 'ocr',          label: 'OCR Facturas',           icon: 'fa-file-invoice-dollar',                 activo: true, page: 'pages/OCR_facturas.html' },
        { id: 'bi',           label: 'BI / Reportes',          icon: 'fa-chart-bar',                           activo: true, page: 'pages/Business_Intelligence.html' },
        { id: 'facturacion',  label: 'Facturación',            icon: 'fa-receipt',                             activo: true, page: 'pages/facturacion.html' },
        { id: 'auditoria',    label: 'Auditoría',              icon: 'fa-shield-halved',                       activo: true, page: 'pages/Auditoria.html' },
      ],
    },
    {
      grupo: 'Estrategia',
      items: [
        { id: 'foda',         label: 'Análisis FODA',           icon: 'fa-chess',           activo: true, page: 'pages/Analisis_FODA.html' },
        { id: 'inteligencia', label: 'Inteligencia Competitiva', icon: 'fa-binoculars',      activo: true, page: 'pages/Inteligencia_Competitiva.html' },
      ],
    },
    {
      grupo: 'Comunicación',
      items: [
        { id: 'notificaciones',  label: 'Notificaciones',  icon: 'fa-bell',          activo: true, page: 'pages/Notificaciones.html' },
        { id: 'app-conductores', label: 'App Conductores', icon: 'fa-mobile-screen', activo: true, page: 'pages/App_Conductores.html' },
        { id: 'portal-clientes', label: 'Portal Clientes', icon: 'fa-globe' },
      ],
    },
    {
      grupo: 'Sistema',
      items: [
        { id: 'configuracion', label: 'Configuración', icon: 'fa-gear' },
        { id: 'logout',        label: 'Cerrar Sesión', icon: 'fa-right-from-bracket', accion: 'logout' },
      ],
    },
  ];

  /* ------------------------------------------------------- Diccionarios */
  const TIPO_SERVICIO_LABEL = {
    transfer_in:  'Transfer IN',
    transfer_out: 'Transfer OUT',
    excursion:    'Excursión',
    privado:      'Privado VIP',
  };

  const TIPO_VEHICULO_LABEL = {
    minivan: 'Minivan',
    autobus: 'Autobús',
    suv:     'SUV',
    sedan:   'Sedán',
  };

  const ESTADO_SERVICIO_LABEL = {
    completado: 'Completado',
    en_curso:   'En curso',
    pendiente:  'Pendiente',
    cancelado:  'Cancelado',
  };

  const ESTADO_VUELO_LABEL = {
    aterrizado: 'Aterrizado',
    en_vuelo:   'En vuelo',
    retrasado:  'Retrasado',
    programado: 'Programado',
    cancelado:  'Cancelado',
  };

  const SEVERIDAD_LABEL = {
    critica: 'Crítica',
    alta:    'Alta',
    media:   'Media',
    baja:    'Baja',
  };

  /* ------------------------------------------------------------ Export */
  window.CT_DATA = {
    EMPRESA,
    TOUROPERADORES,
    HOTELES,
    AEROPUERTO,
    VEHICULOS,
    CONDUCTORES,
    VUELOS,
    SERVICIOS,
    EXCURSIONES_RUTAS,
    CORREOS,
    ALERTAS,
    REASIGNACIONES,
    KPI_HOY,
    KPI_SEMANA,
    SPARKLINES,
    MAPA,
    CARRETERAS,
    VEHICULOS_MAPA,
    RUTAS_ACTIVAS,
    CONDUCTORES_DEMO,
    NAV,
    TIPO_SERVICIO_LABEL,
    TIPO_VEHICULO_LABEL,
    ESTADO_SERVICIO_LABEL,
    ESTADO_VUELO_LABEL,
    SEVERIDAD_LABEL,
  };
})();
