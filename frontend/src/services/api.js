// src/services/api.js
import axios from "axios";

// ============================================================
// CONFIGURAÇÃO AUTOMÁTICA DA API
// ============================================================
// Em produção (Vercel), usa o backend hospedado no Render.
// Em desenvolvimento (local), usa o servidor local (5050).
// ============================================================

const isProduction = import.meta.env.MODE === "production";

// ⚙️ Ajuste aqui a URL do backend Render
const RENDER_BASE_URL = "https://imobiliaria-pwh6.onrender.com/api";
const LOCAL_BASE_URL = "http://localhost:5050/api";

// Se estiver no ambiente de produção (Vercel), usa o Render.
// Caso contrário, usa localhost.
const baseURL = isProduction ? RENDER_BASE_URL : LOCAL_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 20000, // 20s
});

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(
  (config) => {
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (!isFormData) {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(config.headers || {}),
      };
    } else {
      config.headers = {
        Accept: "application/json",
        ...(config.headers || {}),
      };
    }

    // Token JWT (opcional)
    let token = localStorage.getItem("token");
    try {
      const parsed = JSON.parse(token);
      if (typeof parsed === "string") token = parsed;
    } catch (_) {}

    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (token) {
      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = bearer;
      config.headers["x-access-token"] = token;
    }

    if (import.meta.env?.DEV) {
      console.debug("[API] →", config.method?.toUpperCase(), config.url, {
        baseURL,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (import.meta.env?.DEV) {
      console.error("[API ERROR]", {
        url: error?.config?.url,
        method: error?.config?.method,
        status,
        data,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
