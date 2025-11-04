import axios from 'axios';
import { env } from '../../../lib/config/env';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/auth.types';

const AUTH_BASE_URL = `${env.api.baseUrl}/users`;

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${AUTH_BASE_URL}/login`,
      credentials
    );
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${AUTH_BASE_URL}/register`,
      data
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (token: string): Promise<AuthResponse> => {
    const response = await axios.get<AuthResponse>(
      `${AUTH_BASE_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
