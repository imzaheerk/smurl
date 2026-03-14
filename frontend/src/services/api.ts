import axios from 'axios';

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  // When opened on mobile (e.g. http://192.168.x.x:5173), use same host with port 5000 so login/API work
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
}

const baseURL = getApiBaseUrl();

const api = axios.create({ baseURL });

/** Base URL for building short links (no trailing slash). */
export const BASE_URL = baseURL;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;

