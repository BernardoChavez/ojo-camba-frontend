export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // array of linear rings
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][]; // array of [lng, lat]
}

export interface GeoJSONFeature<G = GeoJSONPolygon | GeoJSONPoint | GeoJSONLineString, P = Record<string, unknown>> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<F = GeoJSONFeature> {
  type: 'FeatureCollection';
  features: F[];
  metadata?: Record<string, unknown>;
}
