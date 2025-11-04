import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../../../utils/tokenStorage';
import type { AuthState, LoginCredentials, RegisterData } from '../types/auth.types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          if (response.success && response.data) {
            const { token, ...user } = response.data;

            // Store token
            tokenStorage.setToken(token);

            // Update state
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);

          if (response.success && response.data) {
            const { token, ...user } = response.data;

            // Store token
            tokenStorage.setToken(token);

            // Update state
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        tokenStorage.clearAll();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user, token) => {
        tokenStorage.setToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
