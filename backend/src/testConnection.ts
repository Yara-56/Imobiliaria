import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()
  console.log("✅ Conectado ao MongoDB com sucesso!")
  await prisma.$disconnect()
}

main().catch((error) => {
  console.error("❌ Erro ao conectar:", error)
})
