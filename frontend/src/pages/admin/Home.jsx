// src/pages/admin/Home.jsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalTenants: 0,
    totalOverdue: 0,
    totalAmountOverdue: 0,
  });

  useEffect(() => {
    setLoading(true);
    const today = new Date();

    const simulatedPayments = [
      { id: 1, tenant: "João", dueDate: "2025-09-28", amount: 1200, fine: 100, lastPayment: "2025-09-01", email: "joao@email.com", contractLink: "#" },
      { id: 2, tenant: "Maria", dueDate: "2025-10-15", amount: 1500, fine: 0, lastPayment: "2025-10-01", email: "maria@email.com", contractLink: "#" },
      { id: 3, tenant: "Carlos", dueDate: today.toISOString().split("T")[0], amount: 1000, fine: 0, lastPayment: "2025-10-01", email: "carlos@email.com", contractLink: "#" },
      { id: 4, tenant: "Ana", dueDate: "2025-10-31", amount: 1800, fine: 50, lastPayment: "2025-09-20", email: "ana@email.com", contractLink: "#" },
      { id: 5, tenant: "Beatriz", dueDate: "2025-10-25", amount: 2000, fine: 0, lastPayment: "2025-10-01", email: "beatriz@email.com", contractLink: "#" },
      { id: 6, tenant: "Fernando", dueDate: "2025-11-02", amount: 900, fine: 0, lastPayment: "2025-10-20", email: "fernando@email.com", contractLink: "#" },
      { id: 7, tenant: "Patrícia", dueDate: "2025-11-01", amount: 2200, fine: 0, lastPayment: "2025-10-30", email: "patricia@email.com", contractLink: "#" },
      { id: 8, tenant: "Lucas", dueDate: "2025-10-27", amount: 1300, fine: 0, lastPayment: today.toISOString().split("T")[0], email: "lucas@email.com", contractLink: "#" },
    ];

    const paymentsWithStatus = simulatedPayments.map(p => {
      const due = new Date(p.dueDate);
      const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));

      let status = "Em dia";
      let daysOverdue = 0;

      if (diffDays < 0) {
        status = "Atrasado";
        daysOverdue = Math.abs(diffDays);
      } else if (diffDays === 0) {
        status = "Vence hoje";
      } else if (diffDays === 1) {
        status = "Prestes a expirar";
      } else if (diffDays > 1 && p.lastPayment === today.toISOString().split("T")[0]) {
        status = "Pago recentemente";
      }

      return { ...p, status, daysOverdue };
    });

    const order = { "Atrasado": 0, "Vence hoje": 1, "Prestes a expirar": 2, "Pago recentemente": 3, "Em dia": 4 };
    paymentsWithStatus.sort((a, b) => order[a.status] - order[b.status]);

    const overdue = paymentsWithStatus.filter(p => p.status === "Atrasado");
    const totalAmountOverdue = overdue.reduce((acc, p) => acc + p.amount + p.fine, 0);

    setSummary({
      totalTenants: simulatedPayments.length,
      totalOverdue: overdue.length,
      totalAmountOverdue,
    });

    setPayments(paymentsWithStatus);
    setLoading(false);
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Carregando dashboard...</p>;

  const chartData = {
    labels: ["Atrasado", "Vence hoje", "Prestes a expirar", "Pago recentemente", "Em dia"],
    datasets: [
      {
        data: [
          payments.filter(p => p.status === "Atrasado").length,
          payments.filter(p => p.status === "Vence hoje").length,
          payments.filter(p => p.status === "Prestes a expirar").length,
          payments.filter(p => p.status === "Pago recentemente").length,
          payments.filter(p => p.status === "Em dia").length,
        ],
        backgroundColor: ["#F87171", "#F97316", "#FBBF24", "#34D399", "#3B82F6"],
      },
    ],
  };

  // Funções dos botões
  const handleSendNotice = (tenant) => alert(`Aviso enviado para ${tenant}!`);
  const handleMarkPaid = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? {...p, status: "Pago recentemente"} : p));
    alert(`Pagamento marcado como pago!`);
  };
  const handleViewContract = (link) => window.open(link, "_blank");

  return (
    <div className="p-6 space-y-8 font-sans text-gray-800">
      {/* Indicadores gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
          <span className="text-gray-500 text-sm font-medium">Total de Inquilinos</span>
          <span className="text-2xl font-bold mt-1">{summary.totalTenants}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start border-l-4 border-red-500">
          <span className="text-gray-500 text-sm font-medium">Inquilinos com Atraso</span>
          <span className="text-2xl font-bold text-red-600 mt-1">{summary.totalOverdue}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start border-l-4 border-yellow-500">
          <span className="text-gray-500 text-sm font-medium">Valor Total em Atraso</span>
          <span className="text-2xl font-bold text-yellow-600 mt-1">R$ {summary.totalAmountOverdue.toFixed(2)}</span>
        </div>
      </div>

      {/* Gráfico e cards lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gráfico */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2 text-center">Status dos Pagamentos</h3>
          <div className="w-full max-w-xs">
            <Pie data={chartData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>

        {/* Cards de pagamentos */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map(p => (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between border-l-4 ${
                p.status === "Atrasado"
                  ? "border-red-500"
                  : p.status === "Vence hoje"
                  ? "border-orange-500"
                  : p.status === "Prestes a expirar"
                  ? "border-yellow-400"
                  : p.status === "Pago recentemente"
                  ? "border-green-400"
                  : "border-blue-500"
              }`}
            >
              <div>
                <h3 className={`text-xl font-semibold ${
                  p.status === "Atrasado"
                    ? "text-red-700"
                    : p.status === "Vence hoje"
                    ? "text-orange-600"
                    : p.status === "Prestes a expirar"
                    ? "text-yellow-600"
                    : p.status === "Pago recentemente"
                    ? "text-green-700"
                    : "text-blue-700"
                }`}>
                  {p.tenant}
                </h3>
                <p className="text-gray-600 mt-1"><span className="font-semibold">Valor:</span> R$ {p.amount.toFixed(2)}</p>
                <p className="text-gray-600"><span className="font-semibold">Vencimento:</span> {p.dueDate}</p>
                {p.status === "Atrasado" && (
                  <p className="text-gray-600"><span className="font-semibold">Dias de atraso:</span> {p.daysOverdue}</p>
                )}
                <p className="text-gray-600"><span className="font-semibold">Multa:</span> R$ {p.fine.toFixed(2)}</p>
                <p className="text-gray-600"><span className="font-semibold">Último pagamento:</span> {p.lastPayment}</p>
                <p className="text-gray-600"><span className="font-semibold">Email:</span> {p.email}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendNotice(p.tenant)}
                  className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition"
                >
                  Enviar aviso
                </button>
                <button
                  onClick={() => handleMarkPaid(p.id)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  Marcar como pago
                </button>
                <button
                  onClick={() => handleViewContract(p.contractLink)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  Ver contrato
                </button>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    p.status === "Atrasado"
                      ? "text-red-800 bg-red-100"
                      : p.status === "Vence hoje"
                      ? "text-orange-800 bg-orange-100"
                      : p.status === "Prestes a expirar"
                      ? "text-yellow-800 bg-yellow-100"
                      : p.status === "Pago recentemente"
                      ? "text-green-800 bg-green-100"
                      : "text-blue-800 bg-blue-100"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
