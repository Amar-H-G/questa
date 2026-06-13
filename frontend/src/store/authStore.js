import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api/client';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      login: async (payload) => {
        const { data } = await apiClient.post('/auth/login', payload);
        set(data.data);
      },
      register: async (payload) => {
        const { data } = await apiClient.post('/auth/register', payload);
        set(data.data);
      },
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'surcodex-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
