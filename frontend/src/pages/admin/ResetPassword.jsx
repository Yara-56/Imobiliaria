// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function ResetPassword() {
  const { token } = useParams(); // token vindo da URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      
      // Redireciona para login após 3 segundos
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Erro ao redefinir senha.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Redefinir Senha</h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Crie uma nova senha para sua conta.
        </p>

        {message && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-lg mb-4">
            {message} <br />
            Você será redirecionado para o login.
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 block mb-1">
                Confirme a Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 text-base font-bold rounded-lg text-white ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Redefinindo...' : 'REDEFINIR SENHA'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
