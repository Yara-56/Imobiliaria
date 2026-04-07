import { AsyncLocalStorage } from "node:async_hooks";

interface TenantContextData {
  requestId: string;
  tenantId?: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<TenantContextData>();

// ✅ Exportação Nomeada Única
export const tenantContext = {
  run(data: TenantContextData, callback: () => void) {
    return storage.run(data, callback);
  },

  getTenantId(): string | undefined {
    return storage.getStore()?.tenantId;
  },

  getCompanyId(): string | undefined {
    return storage.getStore()?.tenantId;
  },

  getRequestId(): string | undefined {
    return storage.getStore()?.requestId;
  }
};