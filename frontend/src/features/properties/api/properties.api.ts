import type { PropertyUI } from "../types/property";

// ✅ MOCK inicial (você pode ajustar à vontade)
const mockProperties: PropertyUI[] = [
  {
    id: "p1",
    title: "Casa - Centro",
    addressText: "Rua A, 70 - Centro, Ipatinga/MG",
    cep: "35160-133",
    price: 2500,
    status: "Disponível",
    type: "Casa",
    createdAt: "2026-02-20",
  },
  {
    id: "p2",
    title: "Apartamento - Cariru",
    addressText: "Av. B, 120 - Cariru, Ipatinga/MG",
    cep: "35160-000",
    price: 1800,
    status: "Alugado",
    type: "Apartamento",
    createdAt: "2026-02-18",
  },
];

// simula “banco” em memória (pra create/edit/delete funcionarem na UI)
let db = [...mockProperties];

export const propertiesApi = {
  list: async (_params?: any, _signal?: AbortSignal): Promise<PropertyUI[]> => {
    // simula delay
    await new Promise((r) => setTimeout(r, 250));
    return [...db];
  },

  getById: async (id: string): Promise<PropertyUI | null> => {
    await new Promise((r) => setTimeout(r, 150));
    return db.find((p) => p.id === id) ?? null;
  },

  create: async (payload: Partial<PropertyUI>, _files: File[] = []): Promise<PropertyUI> => {
    await new Promise((r) => setTimeout(r, 250));

    const newItem: PropertyUI = {
      id: crypto.randomUUID(),
      title: payload.title ?? "Novo Imóvel",
      addressText: payload.addressText ?? "",
      cep: payload.cep,
      price: Number(payload.price ?? 0),
      status: payload.status ?? "Disponível",
      type: payload.type ?? "Casa",
      description: payload.description,
      documents: payload.documents ?? [],
      createdAt: new Date().toISOString(),
    };

    db = [newItem, ...db];
    return newItem;
  },

  update: async (id: string, payload: Partial<PropertyUI>, _files: File[] = []): Promise<PropertyUI> => {
    await new Promise((r) => setTimeout(r, 250));

    const idx = db.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Imóvel não encontrado");

    const updated: PropertyUI = {
      ...db[idx],
      ...payload,
      price: payload.price !== undefined ? Number(payload.price) : db[idx].price,
    };

    db[idx] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    db = db.filter((p) => p.id !== id);
  },
};