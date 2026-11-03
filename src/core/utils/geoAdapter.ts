import { LatLngTuple } from 'leaflet';

/**
 * GeoAdapter: Centralized geospatial coordinate converter between
 * MongoDB GeoJSON standard [longitude, latitude] and Leaflet GIS [latitude, longitude].
 */

/**
 * Converts GeoJSON [longitude, latitude] coordinates to Leaflet [latitude, longitude].
 */
export function toLeaflet(coordinates: [number, number]): LatLngTuple {
  const [lng, lat] = coordinates;
  return [lat, lng];
}

/**
 * Converts Leaflet [latitude, longitude] to GeoJSON [longitude, latitude].
 */
export function toGeoJSON(lat: number, lng: number): [number, number] {
  return [lng, lat];
}

/**
 * Converts an array of GeoJSON [lng, lat] coordinates to Leaflet LatLngTuples
 * useful for Polygons, Polylines and MultiPolygons.
 */
export function polygonToLeaflet(ring: [number, number][]): LatLngTuple[] {
  return ring.map((coords) => toLeaflet(coords));
}

/**
 * MultiPolygon to Leaflet nested structure
 */
export function multiPolygonToLeaflet(rings: [number, number][][]): LatLngTuple[][] {
  return rings.map((ring) => polygonToLeaflet(ring));
}

/**
 * Default Geographic Reference for Santa Cruz de la Sierra, Bolivia
 * (Plaza 24 de Septiembre / Km 0)
 */
export const SCZ_DEFAULT_CENTER: LatLngTuple = [-17.7833, -63.1821];
export const SCZ_DEFAULT_ZOOM = 13;
