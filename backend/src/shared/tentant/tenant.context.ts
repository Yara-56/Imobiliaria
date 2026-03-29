import { AsyncLocalStorage } from "node:async_hooks";

type TenantContextType = {
  companyId: string;
  requestId: string;
};

const tenantStorage = new AsyncLocalStorage<TenantContextType>();

export const tenantContext = {
  run(context: TenantContextType, callback: () => void) {
    tenantStorage.run(context, callback);
  },

  get(): TenantContextType {
    const store = tenantStorage.getStore();

    if (!store) {
      throw new Error("❌ TenantContext not found");
    }

    return store;
  },

  getCompanyId(): string {
    return this.get().companyId;
  },

  getRequestId(): string {
    return this.get().requestId;
  },
};