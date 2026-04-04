import { CreateTenantData } from "@/modules/tenants/domain/repositories/tenant.repository.interface";

export const validTenantMock: CreateTenantData = {
  fullName: "Yara Silva",
  email: "yara@email.com",
  cpf: "12345678909", // CPF válido fake
  tenantId: "tenant-1",
};

export const invalidTenantMock = {
  fullName: "",
  email: "email-invalido",
  cpf: "123",
  tenantId: "",
};