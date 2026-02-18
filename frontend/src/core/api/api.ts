import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toaster } from "@/components/ui/toaster";

/**
 * AURA V3 - NÚCLEO DE CONECTIVIDADE PRO
 * Implementação limpa, tipada e sem variáveis mortas.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de REQUISIÇÃO
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("imobisys_token");
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de RESPOSTA
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    // A. Tratamento de 401 (Não Autorizado / Sessão Expirada)
    if (error.response?.status === 401) {
      localStorage.removeItem("imobisys_token");
      
      if (window.location.pathname !== '/login') {
        window.location.replace('/login?sessao=expirada');
      }
      return Promise.reject(error);
    }

    // B. Tratamento de Erros de Conexão ou Timeout
    if (!error.response) {
      toaster.create({
        title: "Falha na Rede",
        description: "Servidor indisponível ou queda de conexão.",
        type: "error",
      });
      return Promise.reject(new Error("Erro de conexão com o servidor."));
    }

    // C. Tratamento de Mensagens do Backend (Seu AppError do Express)
    const mensagemParaUsuario = error.response?.data?.message || "Erro interno no servidor.";
    
    // Retornamos um erro limpo para o TanStack Query capturar
    return Promise.reject(new Error(mensagemParaUsuario));
  }
);

export default api;