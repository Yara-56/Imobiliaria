import axios from 'axios';

const api = axios.create({
  // Sincronizado com o seu API_PREFIX do backend (v1)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
});

api.interceptors.request.use((config) => {
  // Use a mesma chave que você definiu no seu formulário de Login
  const token = localStorage.getItem("imobisys_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;