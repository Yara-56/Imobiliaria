import { prisma } from "@/config/database.config";
import { PrismaClient } from "@prisma/client";

/**
 * Extrai dinamicamente apenas os delegates oficiais do PrismaClient
 * (ou seja, tudo que possui findMany).
 */
type ExtractModelKeys<T extends object> = {
  [K in keyof T]: T[K] extends { findMany: any } ? K : never;
}[keyof T];

/**
 * Todos os nomes reais dos modelos definidos no schema.prisma
 */
export type PrismaModelName = ExtractModelKeys<PrismaClient>;

/**
 * Mapa ESCALÁVEL contendo TODOS os delegates reais do Prisma.
 *
 * Resultado baseado automaticamente no schema:
 *
 *  tenant
 *  user
 *  property
 *  renter
 *  contract
 *  payment
 *  document   ← Incluído, correto e obrigatório
 *
 */
export const prismaModels: Record<
  PrismaModelName,
  PrismaClient[PrismaModelName]
> = {
  tenant: prisma.tenant,
  user: prisma.user,
  property: prisma.property,
  renter: prisma.renter,
  contract: prisma.contract,
  payment: prisma.payment,
  document: prisma.document, // ✔ OBRIGATÓRIO, pois existe no schema
};

/**
 * Delegate tipado para qualquer model do prisma
 */
export type PrismaModelDelegate<M extends PrismaModelName> =
  (typeof prismaModels)[M];