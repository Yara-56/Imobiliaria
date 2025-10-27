import React, { useState } from "react";
import api from "../../services/api"; // Usa o mesmo 'api' do seu login
import { useNavigate, Link } from "react-router-dom"; // Importa o Link

export default function Register() {
  const navigate = useNavigate();

  // Estados para cada campo do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Campo extra

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Validação simples no front-end
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      // 2. Chama a rota de REGISTRO da sua API
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // 3. Se deu certo, avisa e manda para o Login
      alert("Conta criada com sucesso! Você já pode fazer o login.");
      navigate("/"); // Redireciona para a página de Login (sua rota "/")

    } catch (err) {
      // Pega a mensagem de erro do backend (ex: "Email já existe")
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // O JSX é uma cópia do seu Login.jsx, mas adaptado para o registro
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 font-inter">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Criar Conta</h2>
        <p className="text-sm text-blue-600 font-semibold text-center mb-8">Acesso ao Sistema de Gestão</p>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CAMPO NOME */}
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 block mb-1">
              NOME COMPLETO
            </label>
            <input
              type="text"
              id="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          {/* CAMPO E-MAIL */}
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

          {/* CAMPO SENHA */}
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">
              SENHA
            </label>
            <input
              type="password"
              id="password"
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          {/* CAMPO CONFIRMAR SENHA */}
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 block mb-1">
              CONFIRME A SENHA
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Criando..." : "REGISTRAR"}
          </button>
        </form>

        {/* Link para voltar ao Login */}
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Já tem uma conta? </span>
          <Link 
            to="/" // Link para a página de Login (rota "/")
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Faça o login
          </Link>
        </div>

      </div>
    </div>
  );
}