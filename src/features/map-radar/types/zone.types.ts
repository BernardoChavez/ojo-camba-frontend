import { GeoJSONFeatureCollection, GeoJSONPolygon } from '@/shared/types/geojson.ts';

export type ZoneType = 'ZONA_ROJA' | 'ZONA_AMARILLA' | 'ZONA_VERDE';

export interface ZoneProperties {
  cluster_id: number;
  zone_type: ZoneType;
  color: string;
  risk_label: string;
  patrol_priority: string;
  incident_count: number;
  centroid: [number, number]; // [lng, lat]
  radius_meters: number;
  categories_breakdown?: Record<string, number>;
  neighborhoods?: string[];
}

export type ZoneFeature = {
  type: 'Feature';
  geometry: GeoJSONPolygon;
  properties: ZoneProperties;
};

export type MapZoneFeatureCollection = GeoJSONFeatureCollection<ZoneFeature>;

export interface ZoneStats {
  redCount: number;
  yellowCount: number;
  greenCount: number;
  totalIncidents: number;
}
