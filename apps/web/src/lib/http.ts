import axios from "axios";

// Corrige automaticamente a URL base
const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Remove barra final da URL, se existir
const API_URL = RAW_URL.replace(/\/$/, "");

// Garante que não duplique o /api/v1 se ele já vier do .env
const baseURL = API_URL.includes("/api") ? API_URL : `${API_URL}/api/v1`;

// Instância principal do Axios
export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 INTERCEPTOR DE REQUISIÇÃO
http.interceptors.request.use((config) => {
  // ✅ Busca o token oficial do sistema para garantir a autenticação
  const token = localStorage.getItem("imobisys_token") || localStorage.getItem("auth_token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 👉 INTERCEPTOR DE RESPOSTA
http.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error("❌ Servidor indisponível");
      throw new Error("Servidor indisponível");
    }

    return Promise.reject(error);
  }
);