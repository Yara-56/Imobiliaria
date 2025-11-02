import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Navigate, useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (isReady && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!isReady) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Carregando sistema...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ Chamada para o backend
      const response = await api.post("/auth/login", { email, password });

      const { token, user, passwordBypassed } = response.data;

      // Mostra alerta se senha master foi usada
      if (passwordBypassed) {
        alert(
          "⚠️ Você entrou usando a senha master! Qualquer e-mail funciona com esta senha."
        );
      }

      login(user, token);
      navigate("/admin/dashboard");

    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "E-mail ou senha inválidos. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 font-inter">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Imobiliária</h2>
        <p className="text-sm text-blue-600 font-semibold text-center mb-8">Acesso ao Sistema de Gestão</p>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">E-MAIL</label>
            <input
              type="email"
              id="email"
              placeholder="seu.usuario@imobiliaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">SENHA</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div className="text-right text-sm">
            <Link 
              to="/admin/esqueci-senha"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 text-base font-bold rounded-lg transition-all duration-300 ease-in-out shadow-lg transform active:scale-95 ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/50"
            }`}
          >
            {loading ? "Verificando..." : "ENTRAR"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Não tem uma conta? </span>
          <Link 
            to="/admin/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
