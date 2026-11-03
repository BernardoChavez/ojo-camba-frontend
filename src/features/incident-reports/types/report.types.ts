import { GeoJSONPoint } from '@/shared/types/geojson.ts';

export type IncidentCategory =
  | 'ASALTO_MANO_ARMADA'
  | 'ROBO'
  | 'ACCIDENTE_TRANSITO'
  | 'ZONA_PANDILLAS'
  | 'CALLE_SIN_ILUMINACION'
  | 'BACHE_VIAL'
  | 'PARQUE_DESCUIDADO'
  | 'MALA_SENALIZACION'
  | 'VENTA_DROGAS'
  | 'DISTURBIO_CALLEJERO'
  | 'SOSPECHOSO'
  | 'PUNTO_OSCURO';

export type IncidentSeverity = 'LEVE' | 'MEDIO' | 'ALTO' | 'CRITICO';

export type IncidentStatus = 'ACTIVO' | 'VERIFICADO' | 'DESCARTADO';

export interface IncidentReportCreate {
  title: string;
  description: string;
  category: IncidentCategory;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  anillo?: number;
  reporter_alias?: string;
  photo_base64?: string;
  photo_url?: string;
}

export interface IncidentReportResponse {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: GeoJSONPoint;
  latitude: number;
  longitude: number;
  neighborhood: string;
  anillo?: number;
  reporter_alias?: string;
  photo_base64?: string;
  photo_url?: string;
  confirmations_count: number;
  ai_triage?: {
    suggested_severity?: string;
    risk_score?: number;
    immediate_danger?: boolean;
    dispatch_entity?: string;
    short_summary?: string;
    preventive_tip?: string;
    triage_source?: string;
  };
  created_at: string;
  updated_at: string;
}
