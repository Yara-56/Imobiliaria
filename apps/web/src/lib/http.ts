import axios from "axios";

// Corrige automaticamente a URL base
const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Remove barra final da URL, se existir
const API_URL = RAW_URL.replace(/\/$/, "");

// Instância principal do Axios
export const http = axios.create({
  baseURL: `${API_URL}/api/v1`, // <-- 100% correto
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 INTERCEPTOR DE REQUISIÇÃO
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

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