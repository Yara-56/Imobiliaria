import { prisma } from "@/config/database.config";
import { PrismaClient } from "@prisma/client";

type ExtractModelKeys<T extends object> = {
  [K in keyof T]: T[K] extends { findMany: any } ? K : never;
}[keyof T];

export type PrismaModelName = ExtractModelKeys<PrismaClient>;

export const prismaModels: {
  [K in PrismaModelName]: PrismaClient[K];
} = {
  tenant: prisma.tenant,
  user: prisma.user,
  property: prisma.property,
  renter: prisma.renter,
  contract: prisma.contract,
  payment: prisma.payment,
  document: prisma.document, // ✅ OBRIGATÓRIO
};

export type PrismaModelDelegate<M extends PrismaModelName> =
  (typeof prismaModels)[M];