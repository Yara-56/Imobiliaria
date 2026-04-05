import { prisma } from "@/config/database.config";
import { PrismaClient } from "@prisma/client";

/**
 * 🛠️ ExtractModelKeys
 * Filtra dinamicamente o PrismaClient para extrair apenas as chaves que representam 
 * modelos de banco de dados (aqueles que possuem o método findMany).
 */
type ExtractModelKeys<T> = {
  [K in keyof T]: T[K] extends { findMany: any } ? K : never;
}[keyof T];

/**
 * 🏷️ PrismaModelName
 * União de strings contendo os nomes literais dos modelos: 
 * "user" | "tenant" | "property" | "contract" | etc.
 */
export type PrismaModelName = ExtractModelKeys<PrismaClient>;

/**
 * 📦 prismaModels
 * Mapeamento centralizado dos delegados do Prisma para uso nos repositórios.
 * ✅ O 'as const' é o que garante que o TS preserve a tipagem real de cada model.
 */
export const prismaModels = {
  tenant: prisma.tenant,
  user: prisma.user,
  property: prisma.property,
  renter: prisma.renter,
  contract: prisma.contract,
  payment: prisma.payment,
  document: prisma.document,
} as const;

/**
 * 🧬 PrismaModelDelegate
 * Utilitário de tipo que captura a interface exata do modelo solicitado.
 * Ex: PrismaModelDelegate<"user"> retornará o tipo real do prisma.user
 */
export type PrismaModelDelegate<M extends PrismaModelName> =
  (typeof prismaModels)[M];