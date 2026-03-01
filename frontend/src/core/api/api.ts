import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toaster } from "@/components/ui/toaster";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("imobisys_token");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login?sessao=expirada");
      }

      return Promise.reject(error);
    }

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

    const mensagem =
      error.response.data?.message ||
      "Erro interno no servidor.";

    return Promise.reject(new Error(mensagem));
  }
);

export default api;