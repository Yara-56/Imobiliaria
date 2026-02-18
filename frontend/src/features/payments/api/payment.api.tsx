import { Route, Routes, Navigate } from "react-router-dom";
import PaymentPage from "../pages/PaymentPage";

/**
 * 🚀 MÓDULO DE ROTAS FINANCEIRAS - AURA IMOBI
 * * Este arquivo centraliza a navegação do financeiro. 
 * Utilizamos o padrão de "Splat Routes" para permitir que este módulo
 * seja injetado em qualquer lugar da árvore principal.
 */
const PaymentRoutes = () => {
  return (
    <Routes>
      {/* 📊 Dashboard Financeiro Principal
          Caminho: /admin/payments/
      */}
      <Route index element={<PaymentPage />} />

      {/* 💸 Rota para Detalhes ou Formulários (Futuro)
          Exemplo: /admin/payments/novo
      */}
      <Route path="novo" element={<div>Formulário de Lançamento (Em breve)</div>} />

      {/* 🛡️ Fallback de Segurança
          Redireciona qualquer rota inexistente dentro de /payments de volta para a listagem.
      */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default PaymentRoutes;