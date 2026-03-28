import { Property } from '../../domain/entities/property.entity.js';
import { PropertyStatus } from '@prisma/client';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type CreatePropertyData = {
  title: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode?: string | null;
  rentValue: number;
  status?: PropertyStatus;
  tenantId: string;
  userId?: string | null;
};

export type UpdatePropertyData = Partial<CreatePropertyData>;

export interface IPropertyRepository {
  create(data: CreatePropertyData): Promise<Property>;
  update(id: string, tenantId: string, data: UpdatePropertyData): Promise<Property>;
  findAll(tenantId: string, query?: PaginationQuery): Promise<Property[]>;
  findById(id: string, tenantId: string): Promise<Property | null>;
  delete(id: string, tenantId: string): Promise<void>;
  count(tenantId: string): Promise<number>;
}

export const PROPERTY_REPOSITORY_TOKEN = Symbol('IPropertyRepository');