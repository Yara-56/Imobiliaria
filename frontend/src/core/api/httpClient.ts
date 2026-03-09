import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * ====================================================
 * Variáveis de ambiente (.env)
 * ====================================================
 */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

const API_VERSION =
  import.meta.env.VITE_API_VERSION || "/api/v1";

const API_TIMEOUT =
  Number(import.meta.env.VITE_API_TIMEOUT) || 15000;

/**
 * ====================================================
 * Token
 * ====================================================
 */

const TOKEN_KEY = "imobisys_token";

/**
 * ====================================================
 * Helpers de Token
 * ====================================================
 */

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * ====================================================
 * Instância principal do Axios
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
    const token = getToken();

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
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    /**
     * Sessão expirada
     */
    if (error.response?.status === 401) {
      removeToken();

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
     * Mensagem retornada pela API
     */
    const mensagem =
      error.response.data?.message ||
      "Erro interno no servidor.";

    console.error("Erro API:", mensagem);

    return Promise.reject(new Error(mensagem));
  }
);

/**
 * ====================================================
 * Métodos auxiliares
 * Facilita uso no projeto
 * ====================================================
 */

export const http = {
  get: <T = unknown>(url: string, params?: object) =>
    api.get<T>(url, { params }).then((res) => res.data),

  post: <T = unknown>(url: string, data?: object) =>
    api.post<T>(url, data).then((res) => res.data),

  put: <T = unknown>(url: string, data?: object) =>
    api.put<T>(url, data).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: object) =>
    api.patch<T>(url, data).then((res) => res.data),

  delete: <T = unknown>(url: string) =>
    api.delete<T>(url).then((res) => res.data),
};

/**
 * ====================================================
 * Export default
 * ====================================================
 */

export default api;