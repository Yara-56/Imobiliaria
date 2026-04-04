import { describe, it, expect } from "vitest";
import { Tenant } from "@/modules/tenants/domain/entities/tenant.entity";

describe("Tenant Entity", () => {

  it("should create tenant with valid data", () => {
    const tenant = new Tenant({
      fullName: "Yara Silva",
      email: "yara@email.com",
      cpf: "12345678909",
      tenantId: "tenant-1",
    });

    expect(tenant.fullName).toBe("Yara Silva");
  });

  it("should throw error for invalid name", () => {
    expect(() => {
      new Tenant({
        fullName: "Ya",
        tenantId: "tenant-1",
      });
    }).toThrow("Nome completo deve ter no mínimo 3 caracteres");
  });

  it("should throw error for invalid email", () => {
    expect(() => {
      new Tenant({
        fullName: "Yara Silva",
        email: "email-invalido",
        tenantId: "tenant-1",
      });
    }).toThrow("Email inválido");
  });

  it("should throw error for invalid CPF", () => {
    expect(() => {
      new Tenant({
        fullName: "Yara Silva",
        cpf: "123",
        tenantId: "tenant-1",
      });
    }).toThrow("CPF deve conter 11 dígitos");
  });

});