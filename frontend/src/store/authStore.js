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
      logout: async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        set({ user: null, accessToken: null, refreshToken: null });
        if (refreshToken) {
          try {
            await apiClient.post('/auth/logout', { refreshToken });
          } catch {
            // Local logout should still succeed if the token was already invalid.
          }
        }
      },
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

window.addEventListener('surcodex:unauthorized', () => {
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
});
