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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('surcodex-auth');
    }
    return Promise.reject(error);
  }
);
