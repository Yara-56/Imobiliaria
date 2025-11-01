// src/services/api.js
import axios from "axios";

// Se VITE_API_URL não vier, usa fallback local
// Esperado: "http://localhost:5050/api"
const DEFAULT_BASE_URL = "http://localhost:5050";
const rawBase = import.meta.env?.VITE_API_URL?.trim();
const baseURL = rawBase && rawBase.length ? rawBase : DEFAULT_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 20000, // 20s para evitar travas silenciosas
  // withCredentials: true, // habilite se o backend usar cookie de sessão/JWT
});

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(
  (config) => {
    // Não force Content-Type quando for FormData — o axios seta o boundary sozinho
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (!isFormData) {
      // Para JSON comum, garanta Accept e (opcionalmente) Content-Type
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(config.headers || {}),
      };
    } else {
      // Para multipart, garanta apenas Accept
      config.headers = {
        Accept: "application/json",
        ...(config.headers || {}),
      };
    }

    // Token (opcional) — mantém compatível com o back quando o login voltar
    let token = localStorage.getItem("token");
    try {
      const parsed = JSON.parse(token);
      if (typeof parsed === "string") token = parsed;
    } catch (_) { /* ignore */ }

    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (token) {
      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = bearer;
      config.headers["x-access-token"] = token;
    }

    // Log útil em dev
    if (import.meta.env?.DEV) {
      // console.debug("[API] →", config.method?.toUpperCase(), config.url, { isFormData, baseURL });
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
      // Se o back mandar detalhes de validação do Mongoose, mostra:
      if (data?.message || data?.error || data?.fields) {
        console.error("[API ERROR DETAILS]", {
          message: data?.message,
          error: data?.error,
          fields: data?.fields, // <- aqui aparecem os campos inválidos (quando 400)
        });
      }
    }

    // Exemplo de logout automático quando voltar o auth:
    // if (status === 401) {
    //   localStorage.clear();
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default api;
