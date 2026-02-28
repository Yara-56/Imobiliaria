declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;      // ✅ era _id
        role: string;
        tenantId: string;
      };
    }
  }
}

export {};