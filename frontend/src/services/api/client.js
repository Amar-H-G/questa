import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('surcodex-auth') || '{}');
  const token = auth?.state?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      const auth = JSON.parse(localStorage.getItem('surcodex-auth') || '{}');
      const refreshToken = auth?.state?.refreshToken;

      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const { data } = await apiClient.post('/auth/refresh-token', { refreshToken });
          localStorage.setItem(
            'surcodex-auth',
            JSON.stringify({
              state: data.data,
              version: auth.version ?? 0,
            })
          );
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem('surcodex-auth');
          window.dispatchEvent(new Event('surcodex:unauthorized'));
        }
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('surcodex-auth');
      window.dispatchEvent(new Event('surcodex:unauthorized'));
    }
    return Promise.reject(error);
  }
);
