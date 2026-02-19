// backend/scripts/seedAdmin.ts

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function seedAdmin() {
  console.log("🔐 Criando admin...")

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  })

  if (existingAdmin) {
    console.log("⚠️ Admin já existe.")
    return existingAdmin
  }

  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@imobiliaria.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("✅ Admin criado com sucesso!")
  return admin
}
