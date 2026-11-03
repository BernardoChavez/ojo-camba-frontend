# OJO CAMBA — Frontend Web GIS & Plataforma Ciudadana SCZ

Plataforma web moderna y de alto rendimiento para **OJO CAMBA**, el sistema de seguridad ciudadana, mapeo geoespacial colaborativo y prevención del delito en Santa Cruz de la Sierra, Bolivia.

Construido con **React 18**, **TypeScript**, **Vite**, **Tailwind CSS** y **Leaflet**, diseñado con arquitectura modular por funcionalidades (*Feature-Based Architecture*) y con identidad visual institucional cruceña.

---

## Características Principales

1. **Radar Cartográfico Geoespacial (Leaflet):**
   - Renderizado en tiempo real de polígonos calculados con algoritmos **DBSCAN**:
     - **Zonas Rojas:** Asaltos, delitos de alto impacto o alta densidad de reportes.
     - **Zonas Amarillas:** Zonas de precaución, baches viales, disturbios o sospechosos.
     - **Corredores Seguros (Verdes):** Vías patrulladas, iluminadas y tranquilas.
   - Selector de capas gratuitas sin API Key: Calles Estándar (OpenStreetMap), Satelital (Esri World Imagery) y Modo Oscuro táctico.
   - Control de capas inteligente con auto-colapso al hacer scroll o seleccionar una capa.

2. **Reporte Ciudadano en 3 Toques:**
   - **Geolocalización Automática:** Fija las coordenadas precisas del dispositivo mediante `navigator.geolocation` con un toque.
   - **11 Categorías Especializadas:** Asalto a mano armada, robo, calle sin iluminación, baches viales, parques descuidados, pandillas, mala señalización, sospechosos, disturbios y colisiones.
   - **Adjuntos Fotográficos:** Captura y compresión de evidencia fotográfica directa desde la cámara del celular.
   - **Filtro Anti-Spam Vecinal:** Consolida reportes en un radio de 75 metros en lugar de duplicarlos, sumando corroboraciones ciudadanas.

3. **Modo Comando (Seguridad y Patrullaje):**
   - Vista especializada para **Radio Patrulla 110** y la **Guardia Municipal**.
   - Trazado de circuitos óptimos encadenando waypoints y focos rojos para rondas preventivas.

4. **Agente Asistente "Centinela SCZ" (IA):**
   - Asistente conversacional impulsado por **Google Gemini** con conocimiento de los anillos, radiales y barrios cruceños.
   - Consultas en lenguaje natural sobre la seguridad de cualquier cuadrante y sugerencias preventivas.

5. **Resiliencia Total (Fallback Local):**
   - Si el backend pierde conexión, la aplicación entra automáticamente en modo resiliencia con datos simulados realistas de Santa Cruz (Plan 3000, Casco Viejo, Equipetrol, Cristo Redentor, Campus UAGRM) para que el mapa nunca quede vacío.

---

## Arquitectura del Proyecto

```text
rutavecinal-web/
├── index.html                      # Punto de entrada HTML con meta etiquetas
├── package.json                    # Dependencias y scripts
├── tailwind.config.js              # Configuración de diseño y colores SCZ
├── tsconfig.json                   # Tipado estricto TypeScript
├── vite.config.ts                  # Bundler y alias de rutas (@/)
└── src/
    ├── main.tsx                    # Render inicial de React
    ├── App.tsx                     # Ensamblador de proveedores globales
    ├── index.css                   # Estilos globales y personalización de Leaflet
    ├── core/                       # Núcleo compartido del sistema
    │   ├── api/
    │   │   ├── httpClient.ts       # Axios configurado con base URL y manejo de errores
    │   │   └── endpoints.ts        # Rutas de la API (/reports, /map, /assistant)
    │   ├── store/
    │   │   └── AppContext.tsx      # Estado global (modo vecino vs comando, filtros, GPS)
    │   └── utils/
    │       ├── geoAdapter.ts       # Conversor estricto GeoJSON [lng, lat] a Leaflet [lat, lng]
    │       └── fingerprint.ts      # Generador de huella anónima SHA-256 en cliente
    ├── shared/                     # Componentes y tipos globales
    │   ├── components/
    │   │   ├── TopNavbar.tsx       # Barra de navegación institucional blanco y verde clarito
    │   │   ├── SombreroSao.tsx     # Ícono vectorial cultural cruceño
    │   │   └── MainLayout.tsx      # Ensamblador de vistas, hero institucional y emergencias
    │   └── types/geojson.ts
    └── features/                   # Módulos desacoplados por funcionalidad
        ├── map-radar/              # Radar cartográfico y clustering
        │   ├── components/         # RadarMap.tsx, MapLegend.tsx
        │   ├── services/           # map.service.ts con fallback local
        │   └── types/              # zone.types.ts
        ├── incident-reports/       # Reportes ciudadanos de incidentes
        │   ├── components/         # ReportModal.tsx (modal en 3 pasos)
        │   ├── services/           # report.service.ts
        │   └── types/              # report.types.ts
        ├── patrol-command/         # Modo Comando y patrullaje preventivo
        │   ├── components/         # PatrolSidebar.tsx
        │   └── services/           # patrol.service.ts
        └── ai-assistant/           # Asistente Centinela SCZ
            ├── components/         # ChatDrawer.tsx
            └── services/           # assistant.service.ts
```

---

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x (o **pnpm** / **yarn**)
- Backend **OJO CAMBA API** corriendo en `http://localhost:8000` (opcional, la app cuenta con modo resiliencia offline).

---

## Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/BernardoChavez/ojo-camba-frontend.git
   cd ojo-camba-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible de inmediato en:
   **`http://localhost:5173/`**

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los artefactos optimizados se generarán en la carpeta `dist/`.

---

## Conversión Geoespacial Estricta

> **Nota para Desarrolladores:**
> MongoDB almacena los polígonos e índices espaciales `2dsphere` en formato estándar GeoJSON en orden **`[longitud, latitud]`**. Por el contrario, Leaflet requiere **`[latitud, longitud]`**.
> Para evitar errores de inversión de coordenadas, todas las transformaciones están centralizadas en:
> `src/core/utils/geoAdapter.ts` mediante las funciones `toLeaflet()`, `toGeoJSON()` y `polygonToLeaflet()`.

---

## Tecnologías Utilizadas

- **Vite:** Empaquetador ultra-rápido de módulos ESM.
- **React 18:** Arquitectura basada en componentes funcionales y hooks.
- **TypeScript:** Tipado estático riguroso en toda la aplicación.
- **Tailwind CSS:** Diseño responsivo con paleta cruceña (`#0d592c`, `#58b947`).
- **Leaflet & React-Leaflet:** Visualización cartográfica interactiva.
- **Lucide React:** Iconografía vectorial limpia.
- **Axios:** Cliente HTTP con interceptores y fallback offline.

---

## Contactos de Emergencia SCZ Integrados

- **110:** Radio Patrulla (Policía Nacional)
- **119:** Bomberos de la Policía
- **168:** Emergencias Médicas SIS
- **800-140348:** Fuerza Especial de Lucha Contra la Violencia (FELCV)
- **3-3398888:** Guardia Municipal de Santa Cruz de la Sierra

---

## Licencia

Desarrollado con orgullo para Santa Cruz de la Sierra, Bolivia.
Licencia MIT.
