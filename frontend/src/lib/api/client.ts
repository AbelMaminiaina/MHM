import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Le token sera ajouté par Auth0
    // Si vous utilisez un système custom, ajoutez-le ici
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Gestion centralisée des erreurs
    if (error.response?.status === 401) {
      // Rediriger vers login si non authentifié
      console.error('Non authentifié');
    } else if (error.response?.status === 403) {
      console.error('Accès refusé');
    } else if (error.response?.status === 500) {
      console.error('Erreur serveur');
    }

    return Promise.reject(error);
  }
);

// Helper type-safe pour les requêtes
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),
};
