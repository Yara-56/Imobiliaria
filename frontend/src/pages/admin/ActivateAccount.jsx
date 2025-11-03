import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function ActivateAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  // Se vier do register, já preenche o email
  const [email, setEmail] = useState(location.state?.email || "");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !token) {
      setError("Preencha o email e o token de ativação.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/activate", { token, email });

      setSuccess("Conta ativada com sucesso! Você já pode fazer login.");
      setTimeout(() => navigate("/admin/login"), 2000); // redireciona após 2s

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao ativar conta. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 font-inter">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Ativar Conta</h2>
        <p className="text-sm text-blue-600 font-semibold text-center mb-8">
          Insira seu email e token de ativação
        </p>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">
              E-MAIL
            </label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="token" className="text-sm font-semibold text-gray-700 block mb-1">
              TOKEN DE ATIVAÇÃO
            </label>
            <input
              type="text"
              id="token"
              placeholder="Digite o token recebido por email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
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
            {loading ? "Ativando..." : "ATIVAR CONTA"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Já ativou sua conta? </span>
          <Link 
            to="/admin/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Faça o login
          </Link>
        </div>
      </div>
    </div>
  );
}
