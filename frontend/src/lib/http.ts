// src/lib/http.ts
import axios from "axios";

export const http = axios.create({
  // Se estiver usando Vite, ele lerá do .env. Se não, usa o fallback
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * Adiciona o token de autenticação em todas as chamadas automaticamente.
 */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * INTERCEPTOR DE RESPOSTA
 * Centraliza o tratamento de erros globais (Ex: 401 para deslogar)
 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Lógica de logout ou refresh token aqui
      console.error("Sessão expirada");
    }
    return Promise.reject(error);
  }
);