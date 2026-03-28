import { AsyncLocalStorage } from "node:async_hooks";

type RequestStore = {
  userId: string;
  tenantId: string;
  role: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestStore>();

export const RequestContext = {
  run: (data: RequestStore, callback: () => void) => {
    asyncLocalStorage.run(data, callback);
  },

  get: (): RequestStore => {
    const store = asyncLocalStorage.getStore();

    if (!store) {
      throw new Error("RequestContext não inicializado.");
    }

    return store;
  },
};