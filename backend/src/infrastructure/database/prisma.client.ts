// CAMINHO: backend/src/infrastructure/database/prisma.client.ts
import { PrismaClient } from "@prisma/client";

// Instancia o cliente para uso global na aplicação
export const prisma = new PrismaClient();