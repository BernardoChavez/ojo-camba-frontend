export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
  HEALTH: '/health',
  REPORTS: {
    BASE: '/reports',
    NEARBY: '/reports/nearby',
    CONFIRM: (id: string) => `/reports/${id}/confirm`,
    BY_ID: (id: string) => `/reports/${id}`,
  },
  MAP: {
    ZONES: '/map/zones',
    PATROL_ROUTES: '/map/patrol-routes',
  },
  ASSISTANT: {
    CHAT: '/assistant/chat',
  },
} as const;
