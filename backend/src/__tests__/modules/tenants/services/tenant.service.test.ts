import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { TenantService } from "@/modules/tenants/services/tenant.service";
import { ITenantRepository } from "@/modules/tenants/domain/repositories/tenant.repository.interface";
import { Tenant } from "@/modules/tenants/domain/entities/tenant.entity";
import { validTenantMock } from "../mocks/tenant.mock";
import { AppError } from "@/shared/errors/AppError";

describe("TenantService", () => {
  let service: TenantService;
  let repo: Mocked<ITenantRepository>;

  beforeEach(() => {
    // Criamos o mock do repositório com tipagem garantida pelo Vitest
    repo = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByCPF: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    } as unknown as Mocked<ITenantRepository>;

    service = new TenantService(repo);
  });

  // ============================================
  // CREATE
  // ============================================

  describe("create", () => {
    it("should create tenant successfully when data is valid", async () => {
      const tenantEntity = new Tenant(validTenantMock);

      repo.findByCPF.mockResolvedValue(null);
      repo.findByEmail.mockResolvedValue(null);
      repo.create.mockResolvedValue(tenantEntity);

      const result = await service.create(validTenantMock);

      expect(result).toBeInstanceOf(Tenant);
      expect(repo.create).toHaveBeenCalledWith(expect.any(Tenant));
    });

    it("should throw error when fullName is empty", async () => {
      await expect(
        service.create({ ...validTenantMock, fullName: "" })
      ).rejects.toThrow(AppError);
    });

    it("should throw error when tenantId is missing", async () => {
      await expect(
        service.create({ ...validTenantMock, tenantId: "" })
      ).rejects.toThrow(AppError);
    });

    it("should throw error when CPF already exists", async () => {
      repo.findByCPF.mockResolvedValue(new Tenant(validTenantMock));

      await expect(service.create(validTenantMock)).rejects.toThrow(
        "CPF já cadastrado"
      );
    });

    it("should throw error when email already exists", async () => {
      repo.findByCPF.mockResolvedValue(null);
      repo.findByEmail.mockResolvedValue(new Tenant(validTenantMock));

      await expect(service.create(validTenantMock)).rejects.toThrow(
        "Email já cadastrado"
      );
    });

    it("should throw internal error when repository fails", async () => {
      repo.findByCPF.mockResolvedValue(null);
      repo.findByEmail.mockResolvedValue(null);
      repo.create.mockRejectedValue(new Error("DB error"));

      await expect(service.create(validTenantMock)).rejects.toThrow(
        "Erro ao criar inquilino"
      );
    });
  });

  // ============================================
  // UPDATE
  // ============================================

  describe("update", () => {
    it("should update tenant when it exists", async () => {
      const tenant = new Tenant(validTenantMock);

      repo.findById.mockResolvedValue(tenant);
      repo.update.mockResolvedValue(tenant);

      const result = await service.update("1", "tenant-1", {
        fullName: "Novo Nome",
      });

      expect(result).toBeInstanceOf(Tenant);
      expect(repo.update).toHaveBeenCalled();
    });

    it("should throw error when tenant does not exist", async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        service.update("1", "tenant-1", { fullName: "Novo Nome" })
      ).rejects.toThrow("Inquilino não encontrado");
    });
  });

  // ============================================
  // DELETE
  // ============================================

  describe("delete", () => {
    it("should delete tenant when it exists", async () => {
      const tenant = new Tenant(validTenantMock);

      repo.findById.mockResolvedValue(tenant);
      repo.delete.mockResolvedValue(undefined);

      await service.delete("1", "tenant-1");

      expect(repo.delete).toHaveBeenCalled();
    });

    it("should throw error when tenant does not exist", async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.delete("1", "tenant-1")).rejects.toThrow(
        "Inquilino não encontrado"
      );
    });
  });
});