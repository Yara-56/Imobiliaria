import axios from "axios";

// 🔹 Puxa a URL do .env ou usa o padrão do seu backend (porta 5050)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api/v1",
  withCredentials: true, // 🔹 Essencial para cookies HttpOnly (Refresh Token)
});

// Interceptor para injetar o Access Token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;