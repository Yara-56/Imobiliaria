import { 
    PrismaClient, 
    ContractStatus, 
    PaymentMethod, 
    PaymentStatus, 
    PropertyStatus, 
    RenterStatus 
  } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
  async function main() {
    console.log("🌱 Iniciando o Seed do Banco de Dados...");
  
    // 1. LIMPEZA (Opcional: remove dados antigos para não duplicar se rodar de novo)
    // await prisma.payment.deleteMany();
    // await prisma.contract.deleteMany();
    // await prisma.property.deleteMany();
    // await prisma.renter.deleteMany();
    // await prisma.user.deleteMany();
    // await prisma.tenant.deleteMany();
  
    // 2. CRIAR TENANT (Imobiliária)
    const tenant = await prisma.tenant.upsert({
      where: { cnpj: "12.345.678/0001-00" },
      update: {},
      create: {
        name: "Imobiliária Yara Digital",
        cnpj: "12.345.678/0001-00",
        phone: "11988887777",
        email: "contato@yaradigital.com",
      },
    });
  
    // 3. CRIAR USUÁRIO ADMIN
    const admin = await prisma.user.upsert({
      where: { email: "admin@yaradigital.com" },
      update: {},
      create: {
        name: "Yara Admin",
        email: "admin@yaradigital.com",
        password: "hash_da_senha_aqui", // Em prod, use bcrypt
        role: "ADMIN",
        tenantId: tenant.id,
      },
    });
  
    // 4. CRIAR IMÓVEL
    const property = await prisma.property.create({
      data: {
        title: "Cobertura Duplex - Jardins",
        description: "Vista 360 graus, 3 suítes, mobiliado.",
        address: "Alameda Santos, 1500",
        city: "São Paulo",
        state: "SP",
        price: 12000.0,
        status: PropertyStatus.ALUGADO,
        tenantId: tenant.id,
      },
    });
  
    // 5. CRIAR LOCATÁRIO (Renter)
    const renter = await prisma.renter.create({
      data: {
        name: "Carlos Eduardo Silva",
        email: "carlos.silva@email.com",
        phone: "11912345678",
        cpf: "111.222.333-44",
        status: RenterStatus.ATIVO,
        tenantId: tenant.id,
      },
    });
  
    // 6. CRIAR CONTRATO (A "Fonte da Verdade")
    const contract = await prisma.contract.create({
      data: {
        contractNumber: "CTR-2026-0001",
        rentAmount: 12000.0,
        dueDay: 5,
        startDate: new Date("2026-03-01"),
        endDate: new Date("2027-03-01"),
        paymentMethod: PaymentMethod.BOLETO,
        status: ContractStatus.ACTIVE,
        tenantId: tenant.id,
        propertyId: property.id,
        renterId: renter.id,
        userId: admin.id,
      },
    });
  
    // 7. CRIAR PAGAMENTO (Referente ao primeiro mês)
    await prisma.payment.create({
      data: {
        amount: 12000.0,
        referenceMonth: "03/2026",
        dueDate: new Date("2026-03-05"),
        method: PaymentMethod.BOLETO,
        status: PaymentStatus.PENDENTE,
        contractId: contract.id,
        tenantId: tenant.id,
        userId: admin.id,
      },
    });
  
    console.log("-----------------------------------------");
    console.log("✅ SEED EXECUTADO COM SUCESSO!");
    console.log(`🏠 Tenant: ${tenant.name}`);
    console.log(`👤 Admin: ${admin.name}`);
    console.log(`📄 Contrato: ${contract.contractNumber}`);
    console.log("-----------------------------------------");
  }
  
  main()
    .catch((e) => {
      console.error("❌ Erro ao executar o seed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

