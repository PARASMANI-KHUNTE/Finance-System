import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem('user-role') || 'admin';
  config.headers['X-Role'] = role;
  return config;
});

export default api;
