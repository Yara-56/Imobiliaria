import { Tenant } from "../../domain/entities/tenant.entity.js";

export class TenantMapper {
  static toDomain(prismaTenant: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    cpf: string | null;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Tenant {
    return Tenant.restore({
      id: prismaTenant.id,
      fullName: prismaTenant.fullName,
      email: prismaTenant.email,
      phone: prismaTenant.phone,
      cpf: prismaTenant.cpf,
      notes: null,
      tenantId: prismaTenant.tenantId,
      userId: "",
      createdAt: prismaTenant.createdAt,
      updatedAt: prismaTenant.updatedAt,
    });
  }
}
