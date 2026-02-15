import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const loginRequest = async (credentials: { email: string; pass: string }) => {
  // Em um sistema real, o backend retorna o usuário e um Token JWT
  const { data } = await api.post('/auth/login', credentials);
  return data; 
};