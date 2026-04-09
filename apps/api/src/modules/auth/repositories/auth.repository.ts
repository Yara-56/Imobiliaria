// src/modules/auth/auth.repository.ts
import { prisma } from "@config/database.config.js";
import { Prisma } from "@prisma/client.js";

/**
 * 🔍 Buscar usuário por email com senha (login)
 */
export const findByEmailWithPassword = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      tenantId: true,
      isActive: true,
    },
  });
};

/**
 * 🔍 Buscar usuário por email (sem senha)
 */
export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * 🔍 Buscar usuário por ID
 */
export const findById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

/**
 * 📌 Verifica se email já existe
 */
export const existsByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return !!user;
};

/**
 * 🕒 Atualiza último login
 */
export const updateLastLogin = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() },
  });
};

/**
 * ➕ Criar usuário
 */
export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};