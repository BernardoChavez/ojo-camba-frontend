import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import { MapZoneFeatureCollection } from '../types/zone.types.ts';

// Offline Realistic Mock GeoJSON for Santa Cruz de la Sierra
const MOCK_SCZ_ZONES: MapZoneFeatureCollection = {
  type: 'FeatureCollection',
  metadata: {
    total_incidents_analyzed: 19,
    clusters_found: 3,
    city: 'Santa Cruz de la Sierra, Bolivia (Modo Resiliencia)',
    timestamp: new Date().toISOString(),
  },
  features: [
    // 1. ZONA ROJA - Plan 3000 (El Mechero)
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.1385, -17.8265],
            [-63.1345, -17.8265],
            [-63.1345, -17.8305],
            [-63.1385, -17.8305],
            [-63.1385, -17.8265],
          ],
        ],
      },
      properties: {
        cluster_id: 1,
        zone_type: 'ZONA_ROJA',
        color: '#E53935',
        risk_label: 'Peligro Crítico - Alta Incidencia Delictiva',
        patrol_priority: 'URGENTE',
        incident_count: 5,
        centroid: [-63.1365, -17.8285],
        radius_meters: 320,
        categories_breakdown: {
          ASALTO_MANO_ARMADA: 2,
          ROBO: 2,
          DISTURBIO_CALLEJERO: 1,
        },
        neighborhoods: ['Plan 3000 - Rotonda El Mechero', 'Barrio Los Chacos'],
      },
    },
    // 2. ZONA ROJA - Mercado La Ramada (Av. Grigotá)
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.1915, -17.7960],
            [-63.1870, -17.7960],
            [-63.1870, -17.8005],
            [-63.1915, -17.8005],
            [-63.1915, -17.7960],
          ],
        ],
      },
      properties: {
        cluster_id: 2,
        zone_type: 'ZONA_ROJA',
        color: '#E53935',
        risk_label: 'Peligro Crítico - Atracos y Arrebatos',
        patrol_priority: 'URGENTE',
        incident_count: 4,
        centroid: [-63.1892, -17.7982],
        radius_meters: 280,
        categories_breakdown: {
          ROBO: 2,
          ACCIDENTE_TRANSITO: 1,
          ASALTO_MANO_ARMADA: 1,
        },
        neighborhoods: ['Mercado La Ramada', 'Av. Grigotá y 1er Anillo'],
      },
    },
    // 3. ZONA AMARILLA - Los Pozos / Suárez Arana
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.1780, -17.7780],
            [-63.1730, -17.7780],
            [-63.1730, -17.7820],
            [-63.1780, -17.7820],
            [-63.1780, -17.7780],
          ],
        ],
      },
      properties: {
        cluster_id: 3,
        zone_type: 'ZONA_AMARILLA',
        color: '#FDD835',
        risk_label: 'Precaución Moderada - Siniestros Viales y Hurtos',
        patrol_priority: 'MODERADA',
        incident_count: 3,
        centroid: [-63.1755, -17.7800],
        radius_meters: 250,
        categories_breakdown: {
          ACCIDENTE_TRANSITO: 2,
          SOSPECHOSO: 1,
        },
        neighborhoods: ['Mercado Los Pozos', 'Av. Brasil / Suárez Arana'],
      },
    },
    // 4. ZONA VERDE - Corredor Seguro Equipetrol Norte
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.1990, -17.7590],
            [-63.1950, -17.7590],
            [-63.1950, -17.7630],
            [-63.1990, -17.7630],
            [-63.1990, -17.7590],
          ],
        ],
      },
      properties: {
        cluster_id: 901,
        zone_type: 'ZONA_VERDE',
        color: '#43A047',
        risk_label: 'Corredor Seguro - Vigilado e Iluminado',
        patrol_priority: 'PREVENTIVA',
        incident_count: 0,
        centroid: [-63.1970, -17.7610],
        radius_meters: 220,
        neighborhoods: ['Equipetrol Norte', 'Av. San Martín'],
      },
    },
    // 5. ZONA VERDE - Campus Universitario UAGRM
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.1950, -17.7740],
            [-63.1910, -17.7740],
            [-63.1910, -17.7780],
            [-63.1950, -17.7780],
            [-63.1950, -17.7740],
          ],
        ],
      },
      properties: {
        cluster_id: 902,
        zone_type: 'ZONA_VERDE',
        color: '#43A047',
        risk_label: 'Corredor Seguro - Sendero Universitario Iluminado',
        patrol_priority: 'PREVENTIVA',
        incident_count: 0,
        centroid: [-63.1930, -17.7760],
        radius_meters: 220,
        neighborhoods: ['Campus Universitario UAGRM', 'Av. Busch y 2do Anillo'],
      },
    },
  ],
};

export const mapService = {
  async getZones(epsKm: number = 0.4, minSamples: number = 3): Promise<MapZoneFeatureCollection> {
    try {
      const response = await httpClient.get<MapZoneFeatureCollection>(ENDPOINTS.MAP.ZONES, {
        params: { eps_km: epsKm, min_samples: minSamples },
      });
      if (response.data && response.data.features && response.data.features.length > 0) {
        return response.data;
      }
      return MOCK_SCZ_ZONES;
    } catch {
      console.info('[MapService] Usando datos espaciales mockeados de Santa Cruz para mantener mapa vivo.');
      return MOCK_SCZ_ZONES;
    }
  },
};
