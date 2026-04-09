import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { toaster } from "@/components/ui/toaster.js";

/**
 * Configurações vindas do .env
 */
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

const API_VERSION =
  import.meta.env.VITE_API_VERSION || "/api/v1";

const API_TIMEOUT =
  Number(import.meta.env.VITE_API_TIMEOUT) || 15000;

const TOKEN_KEY = "imobisys_token";

/**
 * Instância principal do Axios
 */
const api = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
  withCredentials: true,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de REQUEST
 * Injeta automaticamente o token JWT
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
 * Interceptor de RESPONSE
 * Tratamento global de erros da API
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
     * Falha de rede / servidor offline
     */
    if (!error.response) {
      toaster.create({
        title: "Falha na Rede",
        description: "Servidor indisponível ou queda de conexão.",
        type: "error",
      });

      return Promise.reject(
        new Error("Erro de conexão com o servidor.")
      );
    }

    /**
     * Erro vindo da API
     */
    const mensagem =
      error.response.data?.message ||
      "Erro interno no servidor.";

    toaster.create({
      title: "Erro",
      description: mensagem,
      type: "error",
    });

    return Promise.reject(new Error(mensagem));
  }
);

export default api;