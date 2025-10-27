// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Certifique-se que este é seu arquivo de config do axios

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      setMessage(data.message); // "Se um usuário..."
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-14 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Recuperar Senha</h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Digite seu e-mail para receber o link de redefinição.
        </p>

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

        {!message && ( // Só mostra o formulário se a mensagem de sucesso não foi enviada
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                id="email"
                placeholder="seu.usuario@imobiliaria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Enviando..." : "ENVIAR LINK"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}