import axios from "axios";

/**
 * ✅ Padrão de Mercado: Cliente de API centralizado.
 * Como o alias '@' está configurado no Vite e no TS, 
 * você pode importar isso em qualquer lugar como '@/core/api/client'.
 */
export const api = axios.create({
  // URL do seu backend Node/Express que gerencia o MongoDB
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token da Yara automaticamente em todas as chamadas ao banco
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imobisys_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});