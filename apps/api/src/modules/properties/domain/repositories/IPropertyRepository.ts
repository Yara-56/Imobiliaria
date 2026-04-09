import { Property } from '../entities/property.entity.js';
import { PropertyStatus } from "@prisma/client";

export interface PropertyFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
}

export interface CreatePropertyData {
  title: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode?: string | null;
  rentValue: number;
  status?: PropertyStatus;
  documentUrl?: string | null; // ✅ Escritura / PDF
  tenantId: string;
  userId?: string | null;
}

export type UpdatePropertyData = Partial<Omit<CreatePropertyData, 'tenantId'>>;

export interface IPropertyRepository {
  create(data: CreatePropertyData): Promise<Property>;
  update(id: string, tenantId: string, data: UpdatePropertyData): Promise<Property>;
  findAll(tenantId: string, query?: any): Promise<Property[]>;
  findById(id: string, tenantId: string): Promise<Property | null>;
  delete(id: string, tenantId: string): Promise<void>;
  count(tenantId: string): Promise<number>;
}