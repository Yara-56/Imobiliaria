// src/services/dashboardService.js
import axios from "axios";

// Base URL da API
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5050/api";

// --- Funções para pegar os dados do Dashboard ---

// 1️⃣ Total de imóveis
export const getPropertiesCount = async () => {
  try {
    const res = await axios.get(`${API_BASE}/properties`);
    return res.data.length; // Retorna a quantidade total
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return 0;
  }
};

// 2️⃣ Total de inquilinos
export const getTenantsCount = async () => {
  try {
    const res = await axios.get(`${API_BASE}/tenants`);
    return res.data.length;
  } catch (error) {
    console.error("Erro ao buscar inquilinos:", error);
    return 0;
  }
};

// 3️⃣ Total de contratos
export const getContractsCount = async () => {
  try {
    const res = await axios.get(`${API_BASE}/contracts`);
    return res.data.length;
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    return 0;
  }
};

// 4️⃣ Resumo de pagamentos
export const getPaymentsSummary = async () => {
  try {
    const res = await axios.get(`${API_BASE}/payments`);
    const payments = res.data;

    let paid = 0;
    let pending = 0;
    let total = 0;

    payments.forEach((p) => {
      total += p.amount || 0;
      if (p.status === "paid") paid += 1;
      if (p.status === "pending") pending += 1;
    });

    return { total, paid, pending };
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    return { total: 0, paid: 0, pending: 0 };
  }
};
