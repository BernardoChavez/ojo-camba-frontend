import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';

export interface EmergencyContact {
  entity: string;
  phone: string;
  description: string;
}

export interface AssistantChatResponse {
  reply: string;
  safety_level: 'SEGURO' | 'PRECAUCION' | 'PELIGRO_ALTO' | 'INFORMATIVO';
  nearby_incidents_count: number;
  active_threats_summary: string[];
  emergency_contacts: EmergencyContact[];
  source: string;
}

export interface AssistantChatPayload {
  message: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
}

const SCZ_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { entity: 'Radio Patrulla 110 (Policía)', phone: '110', description: 'Emergencias policiales y delitos en flagrancia' },
  { entity: 'FELCC Santa Cruz', phone: '3-3522222', description: 'Robos agravados e investigaciones criminales' },
  { entity: 'Tránsito Santa Cruz', phone: '3-3333333', description: 'Accidentes viales y colisiones' },
  { entity: 'FELCV', phone: '800-140348', description: 'Violencia familiar y de género' },
  { entity: 'Bomberos de la Policía', phone: '119 / 160', description: 'Incendios y rescate' },
  { entity: 'Ambulancias SIS', phone: '168', description: 'Urgencias médicas inmediatas' },
  { entity: 'Guardia Municipal SCZ', phone: '3-3398888', description: 'Control de espacios públicos' },
];

export const assistantService = {
  async sendMessage(payload: AssistantChatPayload): Promise<AssistantChatResponse> {
    try {
      const response = await httpClient.post<AssistantChatResponse>(ENDPOINTS.ASSISTANT.CHAT, payload);
      return response.data;
    } catch {
      console.info('[AssistantService] Generando respuesta preventiva local de Centinela SCZ.');
      const msg = payload.message.toLowerCase();
      let reply = `¡Hola, pariente! Soy **Centinela SCZ**, tu guardián ciudadano de RutaVecinal en ${payload.neighborhood || 'Santa Cruz'}.\n\n`;

      if (msg.includes('mechero') || msg.includes('plan 3000')) {
        reply += `**Precaución en Plan 3000:** Tenemos reportes de arrebatos de celular en paradas y motocicletas sospechosas cerca de la rotonda El Mechero. No te descuidés con el teléfono y caminá por la Av. Paurito que está iluminada.`;
      } else if (msg.includes('villa') || msg.includes('cumavi') || msg.includes('tres pasos')) {
        reply += `**Alerta en Villa 1ro de Mayo:** Se reportan motochorros sobre la Av. Cumavi y tramos oscuros de Tres Pasos al Frente. Evitá caminar solo con objetos de valor en mano y preferí avenidas transitadas cerca de la plaza principal.`;
      } else if (msg.includes('pampa') || msg.includes('cotoca') || msg.includes('trillo')) {
        reply += `**Precaución en La Pampa de la Isla:** Cuidado en las paradas de la Av. Virgen de Cotoca y cercanías de El Trillo por arrebatos rápidos. Mantenete atento al subir o bajar del micro.`;
      } else if (msg.includes('lote') || msg.includes('palmar') || msg.includes('santos dumont')) {
        reply += `**Alerta en Los Lotes / El Palmar:** Zonas con alumbrado público deficiente pasando el 7mo anillo de la Santos Dumont. Extremá precauciones de noche y transitá acompañado.`;
      } else if (msg.includes('ramada') || msg.includes('grigota')) {
        reply += `**Alerta en La Ramada:** La Av. Grigotá tiene alta congestión y descuidos cerca del 1er y 2do anillo. Llevá tu mochila al frente.`;
      } else {
        reply += `Tu cuadrante se encuentra relativamente despejado, pero de noche mantenete sobre anillos principales y avenidas transitadas (Monseñor Rivero, San Martín o Cristo Redentor).`;
      }

      const isHighRisk =
        msg.includes('mechero') ||
        msg.includes('plan 3000') ||
        msg.includes('villa') ||
        msg.includes('pampa') ||
        msg.includes('lote') ||
        msg.includes('arma');

      return {
        reply,
        safety_level: isHighRisk ? 'PELIGRO_ALTO' : 'PRECAUCION',
        nearby_incidents_count: isHighRisk ? 5 : 1,
        active_threats_summary: isHighRisk
          ? ['Arrebatos en paradas de micro', 'Motos sin placa en calles aledañas', 'Zonas oscuras en vías secundarias']
          : ['Tránsito moderado', 'Ronda preventiva'],
        emergency_contacts: SCZ_EMERGENCY_CONTACTS,
        source: 'centinela_offline_simulation',
      };
    }
  },
};
