import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import { GeoJSONLineString } from '@/shared/types/geojson.ts';

export interface PatrolWaypoint {
  order: number;
  latitude: number;
  longitude: number;
  neighborhood: string;
  risk_level: string;
  notes: string;
}

export interface PatrolRouteResponse {
  route_name: string;
  target_sector: string;
  total_waypoints: number;
  risk_summary: string;
  waypoints: PatrolWaypoint[];
  geojson: {
    type: 'Feature';
    geometry: GeoJSONLineString;
    properties: {
      route_name: string;
      target_department: string;
      active_waypoints_count: number;
    };
  };
}

const MOCK_PATROL_ROUTE: PatrolRouteResponse = {
  route_name: 'Circuito Alfa Centinela SCZ (Táctico)',
  target_sector: 'Anillos y Radiales Críticos de Santa Cruz',
  total_waypoints: 3,
  risk_summary: 'Circuito preventivo enlazando focos de alta prioridad en Plan 3000, La Ramada y Casco Viejo.',
  waypoints: [
    {
      order: 1,
      latitude: -17.8284,
      longitude: -63.1364,
      neighborhood: 'Plan 3000 - El Mechero',
      risk_level: 'ZONA_ROJA',
      notes: 'Punto crítico con robos agravados en parada de micro. Requiere baliza y verificación.',
    },
    {
      order: 2,
      latitude: -17.7981,
      longitude: -63.1894,
      neighborhood: 'Mercado La Ramada - Av. Grigotá',
      risk_level: 'ZONA_ROJA',
      notes: 'Alta concentración de arrebatos y congestión de micros. Patrullaje disuasivo.',
    },
    {
      order: 3,
      latitude: -17.7800,
      longitude: -63.1755,
      neighborhood: 'Mercado Los Pozos - Suárez Arana',
      risk_level: 'ZONA_AMARILLA',
      notes: 'Sector comercial con incidencias de motochorros en horario nocturno.',
    },
  ],
  geojson: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-63.1364, -17.8284],
        [-63.1894, -17.7981],
        [-63.1755, -17.7800],
      ],
    },
    properties: {
      route_name: 'Circuito Alfa Centinela SCZ',
      target_department: 'Radio Patrulla 110 & Guardia Municipal SCZ',
      active_waypoints_count: 3,
    },
  },
};

export const patrolService = {
  async getPatrolRoutes(): Promise<PatrolRouteResponse> {
    try {
      const response = await httpClient.get<PatrolRouteResponse>(ENDPOINTS.MAP.PATROL_ROUTES);
      if (response.data && response.data.waypoints && response.data.waypoints.length > 0) {
        return response.data;
      }
      return MOCK_PATROL_ROUTE;
    } catch {
      console.info('📡 [PatrolService] Retornando ruta de patrullaje táctico mockeado.');
      return MOCK_PATROL_ROUTE;
    }
  },
};
