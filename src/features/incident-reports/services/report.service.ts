import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import { IncidentReportCreate, IncidentReportResponse } from '../types/report.types.ts';

const MOCK_NEARBY_REPORTS: IncidentReportResponse[] = [
  {
    id: 'mock-scz-1',
    title: 'Atraco con arma de fuego en rotonda El Mechero',
    description: 'Dos sujetos en moto tipo torpedo color azul interceptaron a transeúnte.',
    category: 'ASALTO_MANO_ARMADA',
    severity: 'CRITICO',
    status: 'VERIFICADO',
    location: { type: 'Point', coordinates: [-63.1362, -17.8284] },
    latitude: -17.8284,
    longitude: -63.1362,
    neighborhood: 'Plan 3000 - El Mechero',
    anillo: 6,
    reporter_alias: 'Vecino Vigilante Mechero',
    confirmations_count: 8,
    ai_triage: {
      suggested_severity: 'CRITICO',
      risk_score: 95,
      immediate_danger: true,
      dispatch_entity: '110 Radio Patrulla',
      short_summary: 'Asalto armado violento en rotonda principal.',
      preventive_tip: 'Evite caminar con celular expuesto por las curvas de El Mechero.',
    },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-2',
    title: 'Robo de celular en parada de micro línea 36',
    description: 'Jóvenes arrancharon teléfono a estudiante en parada oscura.',
    category: 'ROBO',
    severity: 'ALTO',
    status: 'VERIFICADO',
    location: { type: 'Point', coordinates: [-63.1378, -17.8295] },
    latitude: -17.8295,
    longitude: -63.1378,
    neighborhood: 'Plan 3000 - Barrio Los Chacos',
    anillo: 6,
    reporter_alias: 'Vecina Rosa',
    confirmations_count: 5,
    ai_triage: {
      suggested_severity: 'ALTO',
      risk_score: 75,
      immediate_danger: false,
      dispatch_entity: 'Módulo Policial del Barrio',
      short_summary: 'Arrebato de celular en parada de micro.',
      preventive_tip: 'Espere el transporte en grupos y en zonas iluminadas.',
    },
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-3',
    title: 'Colisión múltiple de micro línea 10 y taxi',
    description: 'Frenada brusca provocó choque vehicular con heridos leves y derrame de combustible.',
    category: 'ACCIDENTE_TRANSITO',
    severity: 'MEDIO',
    status: 'ACTIVO',
    location: { type: 'Point', coordinates: [-63.1895, -17.7984] },
    latitude: -17.7984,
    longitude: -63.1895,
    neighborhood: 'Mercado La Ramada',
    anillo: 2,
    reporter_alias: 'Comerciante Grigotá',
    confirmations_count: 4,
    ai_triage: {
      suggested_severity: 'MEDIO',
      risk_score: 60,
      immediate_danger: false,
      dispatch_entity: 'Tránsito Operativo Santa Cruz',
      short_summary: 'Colisión vehicular en avenida Grigotá.',
      preventive_tip: 'Tome desvíos por calles laterales para evitar congestionamiento.',
    },
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-5',
    title: 'Calle a oscuras por luminarias quemadas',
    description: 'Tres cuadras continuas sin iluminación pública; vecinos temen robos en la noche.',
    category: 'CALLE_SIN_ILUMINACION',
    severity: 'MEDIO',
    status: 'VERIFICADO',
    location: { type: 'Point', coordinates: [-63.1712, -17.8105] },
    latitude: -17.8105,
    longitude: -63.1712,
    neighborhood: 'Av. San Aurelio y 4to Anillo',
    anillo: 4,
    reporter_alias: 'Vecino San Aurelio',
    confirmations_count: 9,
    ai_triage: {
      suggested_severity: 'MEDIO',
      risk_score: 48,
      immediate_danger: false,
      dispatch_entity: 'Dirección de Alumbrado Público Municipal',
      short_summary: 'Tramo vial a oscuras con luminarias quemadas.',
      preventive_tip: 'Transite por la acera contraria iluminada o acompañado.',
    },
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-6',
    title: 'Cráter y baches profundos en la calzada',
    description: 'Pozo de gran tamaño sobre el carril derecho causó rotura de neumático a micro.',
    category: 'BACHE_VIAL',
    severity: 'MEDIO',
    status: 'ACTIVO',
    location: { type: 'Point', coordinates: [-63.1850, -17.8050] },
    latitude: -17.8050,
    longitude: -63.1850,
    neighborhood: 'Av. Santos Dumont y 3er Anillo',
    anillo: 3,
    reporter_alias: 'Conductor Alerta',
    confirmations_count: 7,
    ai_triage: {
      suggested_severity: 'MEDIO',
      risk_score: 55,
      immediate_danger: false,
      dispatch_entity: 'Secretaría Municipal de Obras Públicas',
      short_summary: 'Bache profundo con riesgo vial.',
      preventive_tip: 'Reduzca la velocidad antes de la curva para no colisionar.',
    },
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-7',
    title: 'Parque infantil abandonado con pasto crecido',
    description: 'Área verde descuidada, maleza alta y bancos rotos; se juntan sospechosos a consumir bebidas.',
    category: 'PARQUE_DESCUIDADO',
    severity: 'LEVE',
    status: 'ACTIVO',
    location: { type: 'Point', coordinates: [-63.1420, -17.8250] },
    latitude: -17.8250,
    longitude: -63.1420,
    neighborhood: 'Plan 3000 - Barrio Los Chacos',
    anillo: 6,
    reporter_alias: 'Madre de Familia',
    confirmations_count: 4,
    ai_triage: {
      suggested_severity: 'LEVE',
      risk_score: 30,
      immediate_danger: false,
      dispatch_entity: 'Dirección de Parques y Jardines / Guardia Municipal',
      short_summary: 'Parque descuidado con pastizal alto.',
      preventive_tip: 'Evite ingresar a la plaza después del anochecer.',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-8',
    title: 'Intersección peligrosa sin señal de PARE',
    description: 'Cruce ciego entre radial y avenida secundaria; micros no ceden el paso y ocurren colisiones.',
    category: 'MALA_SENALIZACION',
    severity: 'LEVE',
    status: 'ACTIVO',
    location: { type: 'Point', coordinates: [-63.1550, -17.8010] },
    latitude: -17.8010,
    longitude: -63.1550,
    neighborhood: 'Radial 10 y 5to Anillo',
    anillo: 5,
    reporter_alias: 'Vecino Conductor',
    confirmations_count: 5,
    ai_triage: {
      suggested_severity: 'LEVE',
      risk_score: 35,
      immediate_danger: false,
      dispatch_entity: 'Unidad de Tránsito / Señalética Urbana SCZ',
      short_summary: 'Falta de señalética y semáforo en intersección.',
      preventive_tip: 'Frene a cero antes de cruzar la bocacalle.',
    },
    created_at: new Date(Date.now() - 72000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-scz-9',
    title: 'Punto de reunión de pandillas juveniles',
    description: 'Grupo de jóvenes armados con bates y piedras amenazan a vecinos en la esquina de la canchita.',
    category: 'ZONA_PANDILLAS',
    severity: 'ALTO',
    status: 'VERIFICADO',
    location: { type: 'Point', coordinates: [-63.1310, -17.8350] },
    latitude: -17.8350,
    longitude: -63.1310,
    neighborhood: 'Plan 3000 - Barrio Guapurú',
    anillo: 7,
    reporter_alias: 'Junta Vecinal Guapurú',
    confirmations_count: 11,
    ai_triage: {
      suggested_severity: 'ALTO',
      risk_score: 82,
      immediate_danger: true,
      dispatch_entity: '110 Radio Patrulla / Módulo Policial EPI 3',
      short_summary: 'Presencia hostil de pandillas en canchita.',
      preventive_tip: 'No transite por la esquina en conflicto y busque vías principales.',
    },
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const reportService = {
  async getNearbyReports(
    latitude: number,
    longitude: number,
    maxDistanceMeters: number = 25000,
    category?: string
  ): Promise<IncidentReportResponse[]> {
    try {
      const response = await httpClient.get<IncidentReportResponse[]>(ENDPOINTS.REPORTS.NEARBY, {
        params: {
          latitude,
          longitude,
          max_distance_meters: maxDistanceMeters,
          ...(category ? { category } : {}),
        },
      });
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return MOCK_NEARBY_REPORTS;
    } catch {
      console.info('[ReportService] Retornando incidentes mockeados de Santa Cruz.');
      return MOCK_NEARBY_REPORTS;
    }
  },

  async createReport(payload: IncidentReportCreate): Promise<IncidentReportResponse> {
    try {
      const response = await httpClient.post<IncidentReportResponse>(ENDPOINTS.REPORTS.BASE, payload);
      return response.data;
    } catch {
      console.warn('[ReportService] Creación en modo offline mockeado.');
      const mockCreated: IncidentReportResponse = {
        id: `offline-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        severity: 'MEDIO',
        status: 'ACTIVO',
        location: { type: 'Point', coordinates: [payload.longitude, payload.latitude] },
        latitude: payload.latitude,
        longitude: payload.longitude,
        neighborhood: payload.neighborhood || 'Santa Cruz de la Sierra',
        anillo: payload.anillo,
        reporter_alias: payload.reporter_alias || 'Vecino Anónimo',
        photo_base64: payload.photo_base64,
        photo_url: payload.photo_url || payload.photo_base64,
        confirmations_count: 1,
        ai_triage: {
          suggested_severity: 'MEDIO',
          risk_score: 50,
          immediate_danger: false,
          dispatch_entity: 'Módulo Policial del Barrio',
          short_summary: 'Reporte registrado y en verificación comunitaria.',
          preventive_tip: 'Transite con precaución por el cuadrante reportado.',
          triage_source: 'centinela_offline_simulation',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_NEARBY_REPORTS.unshift(mockCreated);
      return mockCreated;
    }
  },

  async confirmReport(reportId: string): Promise<{ incident_id: string; confirmations_count: number; message: string }> {
    try {
      const response = await httpClient.patch(ENDPOINTS.REPORTS.CONFIRM(reportId));
      return response.data;
    } catch {
      const found = MOCK_NEARBY_REPORTS.find((r) => r.id === reportId);
      if (found) {
        found.confirmations_count += 1;
        found.status = 'VERIFICADO';
      }
      return {
        incident_id: reportId,
        confirmations_count: found ? found.confirmations_count : 2,
        message: 'Reporte corroborado comunitariamente (modo resiliencia).',
      };
    }
  },
};
