import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * ====================================================
 * Configurações vindas do .env
 * ====================================================
 */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

const API_VERSION =
  import.meta.env.VITE_API_VERSION || "/api/v1";

const API_TIMEOUT =
  Number(import.meta.env.VITE_API_TIMEOUT) || 15000;

const TOKEN_KEY = "imobisys_token";

/**
 * ====================================================
 * Instância central do Axios
 * ====================================================
 */

export const api = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ====================================================
 * Interceptor de REQUEST
 * Injeta o token automaticamente
 * ====================================================
 */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ====================================================
 * Interceptor de RESPONSE
 * Tratamento global de erros
 * ====================================================
 */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    /**
     * Sessão expirada
     */
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);

      if (window.location.pathname !== "/login") {
        window.location.replace("/login?sessao=expirada");
      }

      return Promise.reject(error);
    }

    /**
     * Servidor offline
     */
    if (!error.response) {
      console.error("Servidor indisponível");

      return Promise.reject(
        new Error("Erro de conexão com o servidor.")
      );
    }

    /**
     * Erro retornado pela API
     */
    const mensagem =
      error.response.data?.message ||
      "Erro interno no servidor.";

    return Promise.reject(new Error(mensagem));
  }
);

/**
 * ====================================================
 * Export default
 * ====================================================
 */

export default api;