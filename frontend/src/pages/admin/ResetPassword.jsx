// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { token } = useParams(); // Pega o ':token' da URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // O token vai na URL, a senha vai no corpo
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(data.message); // "Senha redefinida com sucesso!"

      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Criar Nova Senha</h2>

        {message && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        {!message && ( // Só mostra o formulário se a senha ainda não foi redefinida
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">NOVA SENHA</label>
              <input
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm ..."
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">CONFIRMAR SENHA</label>
              <input
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm ..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 text-base font-bold rounded-lg bg-blue-600 text-white ..."
            >
              {loading ? "Salvando..." : "SALVAR NOVA SENHA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}