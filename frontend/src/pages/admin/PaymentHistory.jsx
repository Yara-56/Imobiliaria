import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/AdminLayout";
// 🚨 CORREÇÃO DE CAMINHO: Incluindo "admin" para resolver o erro
import Topbar from "../../components/admin/Topbar"; 
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        // Assumindo que esta rota é acessível e autenticada via interceptor do axios
        const response = await axios.get("/api/payments");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    }
    loadPayments();
  }, []);

  const filtered = payments.filter((p) =>
    // Filtra pelo nome do inquilino, se o inquilino existir
    p.tenant?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Topbar
        icon={faFileInvoiceDollar}
        title="Histórico de Pagamentos"
        subtitle="Todos os pagamentos recebidos"
      />

      <div className="p-6">
        <input
          className="w-full max-w-sm px-4 py-2 mb-6 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Buscar por inquilino"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Inquilino
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">Valor</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Método
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">Data</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Recibo
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {p.tenant?.name || "---"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      R$ {Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{p.method}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(p.paymentDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {/* O status padrão é "Pago" se não for fornecido */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                            {p.status || "Pago"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/receipt/${p._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Visualizar Recibo
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Nenhum pagamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
