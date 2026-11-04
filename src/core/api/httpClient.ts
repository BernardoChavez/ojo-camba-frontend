import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './endpoints.ts';

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Structured error logger
    if (error.response) {
      console.warn(`[API Response Error] ${error.response.status} from ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      console.warn(`[API Network Error] Backend unreachable at ${error.config?.baseURL}: activating offline mock resilience.`);
    } else {
      console.error('[API Setup Error]:', error.message);
    }
    return Promise.reject(error);
  }
);
