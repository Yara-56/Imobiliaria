import axios from 'axios';

/**
 * Configuração de API - ImobiSys
 * 🛡️ Foco em Cybersecurity e UX
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true, // Necessário para cookies e sessões seguras
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de REQUISIÇÃO: Envia o Token Real
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imobisys_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Interceptor de RESPOSTA: O "Pulo do Gato" Profissional
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401 (Unauthorized), limpamos o lixo e deslogamos
    if (error.response?.status === 401) {
      console.warn("🛡️ Sessão expirada ou token inválido. Redirecionando...");
      localStorage.removeItem("imobisys_token");
      
      // Só redireciona se não estivermos já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Tratamento de mensagens de erro vindas do seu AppError.ts
    const message = error.response?.data?.message || "Erro inesperado no servidor.";
    return Promise.reject(new Error(message));
  }
);

export default api;