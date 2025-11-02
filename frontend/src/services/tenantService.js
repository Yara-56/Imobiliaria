// src/services/tenantService.js

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/tenants`
  : "http://localhost:5050/api/tenants";

// ✅ Listar todos os inquilinos (com opcional query de busca)
export async function listTenants(query = "") {
  try {
    const url = query ? `${API_BASE}?q=${encodeURIComponent(query)}` : API_BASE;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Erro ao buscar inquilinos");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ✅ Obter detalhes de um inquilino
export async function getTenant(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Erro ao buscar inquilino");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ✅ Criar novo inquilino
export async function createTenant(data) {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      body: data, // FormData para arquivos
    });
    if (!res.ok) throw new Error("Erro ao criar inquilino");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ✅ Atualizar inquilino
export async function updateTenant(id, data) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      body: data, // FormData para arquivos
    });
    if (!res.ok) throw new Error("Erro ao atualizar inquilino");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ✅ Deletar inquilino
export async function deleteTenant(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Erro ao deletar inquilino");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
