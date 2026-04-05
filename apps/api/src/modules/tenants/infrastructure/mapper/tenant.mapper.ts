import { Tenant } from "../../domain/entities/tenant.entity.js";

export class TenantMapper {
  static toDomain(prismaTenant: any): Tenant {
    return new Tenant({
      id: prismaTenant.id,
      fullName: prismaTenant.fullName,
      email: prismaTenant.email,
      phone: prismaTenant.phone,
      cpf: prismaTenant.cpf,
      documentUrl: prismaTenant.documentUrl,
      notes: prismaTenant.notes,
      propertyId: prismaTenant.propertyId,
      tenantId: prismaTenant.tenantId,
      createdAt: prismaTenant.createdAt,
      updatedAt: prismaTenant.updatedAt,
    });
  }
}