import axios from "axios";

// A variável de ambiente VITE_API_URL deve ser configurada no Vercel
// para a URL da sua API (ex: "https://minha-api.vercel.app/api")
const baseURL = import.meta.env.VITE_API_URL; 

const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  
  const isFormData = config.data instanceof FormData;

  // 1. Definição dos cabeçalhos base
  const newHeaders = {
    // Sempre queremos receber JSON
    Accept: "application/json",
    // Se não for FormData, use Content-Type: application/json.
    // Se for FormData, o navegador define 'multipart/form-data'
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
  
  // 2. Mescla os novos cabeçalhos com os existentes
  config.headers = {
    ...(config.headers || {}), // Mantém cabeçalhos customizados passados na chamada
    ...newHeaders,
  };

  // 3. Adiciona o token de autorização
  let token = localStorage.getItem("token");
  try {
    // Tenta fazer o parse caso o token tenha sido armazenado com aspas
    const parsed = JSON.parse(token);
    if (typeof parsed === "string") token = parsed;
  } catch (_) {
    // Se falhar, assume que o 'token' é a string pura
  }

  if (token) {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    // 🔑 CORREÇÃO: Usa apenas o cabeçalho padrão 'Authorization'
    config.headers.Authorization = bearer;
    // 🗑️ Removido: config.headers["x-access-token"] = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // O console.error está correto para debug
    console.error("[API ERROR]", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;