import React, { useState } from "react";
import api from "../../services/api";

export default function ActivateUser() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await api.post("/auth/activate", { email });
      setStatus({ success: true, message: response.data.message });
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.message || "Erro ao ativar usuário.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Ativar Usuário</h2>

      <input
        type="email"
        placeholder="Digite o e-mail do usuário"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        disabled={loading}
      />

      <button
        onClick={handleActivate}
        disabled={loading || !email}
        className={`w-full py-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Ativando..." : "Ativar"}
      </button>

      {status && (
        <p className={`mt-4 ${status.success ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
