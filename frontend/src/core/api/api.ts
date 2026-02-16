import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Altere para a URL do seu backend
});

// Adiciona o token de autenticação em cada chamada automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;