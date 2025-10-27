import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// 1. Exporta o Context para o hook e o provider poderem usar
export const AuthContext = createContext(null);

// 2. Exporta o Provider (o componente que gerencia a autenticação)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // Estado para saber se já verificou o token
  const navigate = useNavigate();

  useEffect(() => {
    // Roda só uma vez para verificar se já existe uma sessão salva
    const checkUserSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          // Configura o token no cabeçalho do 'api' para futuras requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Falha ao carregar sessão do localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        // Marca como pronto para a aplicação poder ser exibida
        setIsReady(true);
      }
    };

    checkUserSession();
  }, []); // O array vazio [] garante que isso rode só uma vez

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/admin/login'); // Redireciona para o login do admin
  };

  const isAuthenticated = !!user; // Converte o 'user' (objeto ou null) para true/false

  // Valores que serão compartilhados com toda a aplicação
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isReady, // Compartilha o 'isReady' para o ProtectedRoute usar
  };

  return (
    // Esta parte está correta. Não tem <BrowserRouter> aqui.
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Exporta o Hook (o atalho para consumir o contexto)
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // Isso acontece se você tentar usar o useAuth fora do AuthProvider
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};