import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL; // ex: "https://imobiliaria-pwh6.onrender.com/api"

const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;

  config.headers = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(config.headers || {}),
  };

  // Token JWT opcional
  let token = localStorage.getItem("token");
  try {
    const parsed = JSON.parse(token);
    if (typeof parsed === "string") token = parsed;
  } catch (_) {}

  if (token) {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    config.headers.Authorization = bearer;
    config.headers["x-access-token"] = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API ERROR]", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;
