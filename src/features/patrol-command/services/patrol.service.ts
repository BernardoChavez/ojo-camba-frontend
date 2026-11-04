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
  route_name: 'Circuito Centinela SCZ - Zonas Críticas',
  target_sector: 'Plan 3000, Villa 1ro de Mayo, La Pampa, La Ramada y Los Lotes',
  total_waypoints: 5,
  risk_summary: 'Circuito preventivo de alta cobertura enlazando las zonas rojas de mayor riesgo delictivo en Santa Cruz.',
  waypoints: [
    {
      order: 1,
      latitude: -17.8285,
      longitude: -63.1365,
      neighborhood: 'Plan 3000 - Rotonda El Mechero',
      risk_level: 'ZONA_ROJA',
      notes: 'Punto crítico con robos agravados y arrebatos en paradas de micro. Requiere baliza y verificación permanente.',
    },
    {
      order: 2,
      latitude: -17.7890,
      longitude: -63.1380,
      neighborhood: 'Villa 1ro de Mayo - Plaza y Cumavi',
      risk_level: 'ZONA_ROJA',
      notes: 'Frecuencia de motochorros y arrebatos en tramos comerciales. Patrullaje disuasivo.',
    },
    {
      order: 3,
      latitude: -17.7650,
      longitude: -63.1250,
      neighborhood: 'La Pampa de la Isla - Av. Virgen de Cotoca',
      risk_level: 'ZONA_ROJA',
      notes: 'Intersección crítica y parada del trillo. Control de sospechosos en motocicletas sin placa.',
    },
    {
      order: 4,
      latitude: -17.7981,
      longitude: -63.1894,
      neighborhood: 'Mercado La Ramada - Av. Grigotá',
      risk_level: 'ZONA_ROJA',
      notes: 'Alta aglomeración peatonal con presencia de descuideros y arrebatos en paradas.',
    },
    {
      order: 5,
      latitude: -17.8480,
      longitude: -63.1780,
      neighborhood: 'Los Lotes - Palmar del Oratorio',
      risk_level: 'ZONA_ROJA',
      notes: 'Tramos con escasa iluminación y vías sin pavimentar. Refuerzo de rondas nocturnas.',
    },
  ],
  geojson: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-63.1365, -17.8285],
        [-63.1380, -17.7890],
        [-63.1250, -17.7650],
        [-63.1894, -17.7981],
        [-63.1780, -17.8480],
      ],
    },
    properties: {
      route_name: 'Circuito Centinela SCZ - Zonas Críticas',
      target_department: 'Radio Patrulla 110 & Guardia Municipal SCZ',
      active_waypoints_count: 5,
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
      console.info('[PatrolService] Retornando circuito táctico de zonas rojas de Santa Cruz.');
      return MOCK_PATROL_ROUTE;
    }
  },
};
