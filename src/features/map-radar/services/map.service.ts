import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import { MapZoneFeatureCollection } from '../types/zone.types.ts';
import { SCZ_OFFLINE_ZONES } from '../data/scz-zones.data.ts';

export const mapService = {
  async getZones(epsKm: number = 0.4, minSamples: number = 3): Promise<MapZoneFeatureCollection> {
    try {
      const response = await httpClient.get<MapZoneFeatureCollection>(ENDPOINTS.MAP.ZONES, {
        params: { eps_km: epsKm, min_samples: minSamples },
      });
      if (response.data && response.data.features && response.data.features.length > 0) {
        return response.data;
      }
      return SCZ_OFFLINE_ZONES;
    } catch {
      console.info('[MapService] Usando cuadrantes espaciales de Santa Cruz (Plan 3000, Villa 1ro de Mayo, Pampa, Ramada, Los Lotes).');
      return SCZ_OFFLINE_ZONES;
    }
  },
};
