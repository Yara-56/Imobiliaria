import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  withCredentials: true, // Obrigatório para enviar os cookies de sessão
});

// Interceptor para injetar o Token em cada clique da sua avó no sistema
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AuraImobi:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});