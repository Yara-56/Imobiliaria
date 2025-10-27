import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ReceiptView() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const response = await axios.get(`/api/receipts/${id}`);
        setReceipt(response.data);
      } catch (err) {
        setError('Erro ao carregar o recibo.');
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [id]);

  if (loading)
    return <p className="p-8 text-gray-600 text-sm">Carregando recibo...</p>;
  if (error)
    return <p className="p-8 text-red-600 text-sm">{error}</p>;
  if (!receipt)
    return <p className="p-8 text-gray-600 text-sm">Recibo não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">📄 Recibo de Pagamento</h2>

      <p><span className="font-semibold">ID do Recibo:</span> {receipt._id}</p>
      <p><span className="font-semibold">Inquilino:</span> {receipt.tenant?.name}</p>
      <p><span className="font-semibold">Contrato:</span> {receipt.contract?.title || receipt.contract}</p>
      <p><span className="font-semibold">Data do Pagamento:</span> {new Date(receipt.paymentDate).toLocaleDateString('pt-BR')}</p>
      <p><span className="font-semibold">Valor:</span> R$ {Number(receipt.amount).toFixed(2)}</p>
      <p><span className="font-semibold">Método:</span> {receipt.method || 'Não especificado'}</p>

      <hr className="my-6 border-t border-gray-200" />

      <p className="text-sm italic text-gray-600">
        Este recibo confirma o pagamento relacionado ao contrato especificado. Guarde-o como comprovante.
      </p>

      <button
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={() => alert('🔧 Em breve: funcionalidade de download do PDF!')}
      >
        📥 Baixar PDF
      </button>
    </div>
  );
}
