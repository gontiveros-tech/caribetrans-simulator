# CaribeTrans — Simulador Comercial

Demo comercial **offline** del sistema integrado de gestión de transporte turístico
**CaribeTrans** (Punta Cana, República Dominicana).

Pensado para abrirse en una laptop frente a un prospecto: un operador de transporte
turístico que quiere ver cómo se ve y cómo se siente el sistema completo.

---

## Ejecutar

No hay build, no hay servidor, no hay dependencias que instalar.

```
Abrir index.html en Chrome
```

Opcionalmente, con un servidor estático:

```bash
python -m http.server 8080
# http://localhost:8080
```

En la pantalla de login los campos ya vienen pre-llenados. Click en
**Iniciar Sesión** entra al dashboard (no hay validación real ni backend).

---

## Stack

| Pieza | Detalle |
|-------|---------|
| Markup | HTML5, documento único (`index.html`) |
| Estilos | CSS vanilla con custom properties (`css/style.css`) |
| Lógica | JavaScript vanilla, sin framework, sin bundler |
| Charts | Chart.js 4.x (CDN) |
| Iconos | Font Awesome 6.5 (CDN) |
| Tipografía | Inter + Poppins (Google Fonts, CDN) |
| Backend | **Ninguno.** Todos los datos son sintéticos y viven en `js/data.js` |

Sin `fetch`, sin API, sin `localStorage`. Fuera de las tres CDN de la primera
carga (fuentes, iconos, Chart.js), la aplicación funciona 100 % offline.

---

## Estructura

```
caribetrans-simulator/
├── index.html          documento único, toda la app
├── css/
│   └── style.css       design system completo
├── js/
│   ├── data.js         datos sintéticos pregenerados (window.CT_DATA)
│   ├── app.js          navegación, inicialización, utilidades
│   ├── dashboard.js    dashboard resumen (KPIs + charts + paneles)
│   └── operations.js   centro de operaciones (las 6 sub-vistas)
├── specs/
│   └── instruccion_caribetrans_simulator.md
├── README.md
└── .gitignore
```

---

## Contenido de la demo

### Login
Pantalla completa con gradiente navy, card de acceso a la izquierda y panel hero
con estadísticas y features a la derecha.

### Dashboard
- 4 KPI cards con sparkline (Servicios Hoy, Flota Activa, Ingresos del Día, Alertas)
- Bar chart de servicios por día (7 días, 3 categorías)
- Doughnut de distribución de flota
- Próximos vuelos, touroperadores activos y alertas recientes

### Centro de Operaciones — 6 sub-vistas
| Tab | Qué muestra |
|-----|-------------|
| **Correos TO** | Bandeja de entrada operativa. Los correos de touroperadores son el trigger que genera servicios |
| **Vuelos** | Tablero FIDS de aeropuerto con semáforo de estados y vehículos pre-asignados |
| **Mapa GPS** | Mapa SVG estilizado de Punta Cana con hoteles, aeropuerto PUJ y vehículos en vivo |
| **Vista Conductor** | Simulación del teléfono del conductor, con selector entre varios conductores |
| **Alertas** | Contingencias activas con las acciones automáticas que el sistema ya ejecutó |
| **Touroperadores** | Métricas comerciales por touroperador y ranking de rentabilidad |

### Módulos del sistema
Empleados, Nómina, Flota, Costos, Contabilidad, OCR Facturas, BI, Facturación,
Auditoría, Notificaciones, App Conductores y Portal Clientes aparecen en el
sidebar y muestran un panel indicando que están disponibles en el sistema
completo. Es intencional: el prospecto ve la profundidad sin que haya que
construir cada módulo.

---

## Datos sintéticos

Todo vive en `js/data.js` bajo `window.CT_DATA`:

| Colección | Cantidad |
|-----------|----------|
| Touroperadores | 6 (5 activos) |
| Hoteles / puntos de recogida | 12 |
| Vehículos | 48 (41 operativos, 4 en mantenimiento, 3 inactivos) |
| Conductores | 60 (54 activos) |
| Vuelos del día | 20 (12 llegadas, 8 salidas) |
| Servicios del día | 40 (15 transfer IN, 10 transfer OUT, 10 excursiones, 5 privados) |
| Rutas de excursión | 10 |
| Correos de touroperador | 8 |
| Alertas y contingencias | 5 |

La fecha de la demo está fijada en **22 de julio de 2026** para que los datos
sean siempre coherentes entre sí.

> Ningún dato real de clientes existe en este repositorio. Nombres de
> touroperadores, hoteles y aerolíneas son públicos; pasajeros, conductores,
> cédulas, teléfonos, placas y referencias son sintéticos.

---

## Notas

- La demo es **estática por diseño**: nada se refresca solo. La sensación de
  "en vivo" la dan el dot pulsante y la mezcla de estados (completado + en curso
  + pendiente).
- Optimizado para pantalla de laptop (1440×900 en adelante). El responsive móvil
  completo no es una prioridad.
- No hay modo oscuro.
