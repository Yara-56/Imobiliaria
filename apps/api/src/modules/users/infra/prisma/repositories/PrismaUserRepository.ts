import { PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../../../../shared/base/base.repository";
import {
  IUserRepository,
  PaginationQuery,
  PaginatedResult,
} from "../../../domain/repositories/IUserRepository";

const prisma = new PrismaClient();

/**
 * 👤 PrismaUserRepository
 * Foco: Multi-tenant, performance e tipagem forte
 */
export class PrismaUserRepository
  extends BaseRepository<any>
  implements IUserRepository
{
  protected model = prisma.user;

  constructor() {
    super("user");
  }

  /**
   * ➕ CREATE
   */
  async create(data: Prisma.UserCreateInput) {
    return await this.model.create({ data });
  }

  /**
   * 💾 SAVE
   */
  async save(user: any) {
    return await this.model.update({
      where: { id: user.id },
      data: user,
    });
  }

  /**
   * 🔍 FIND BY ID (multi-tenant seguro)
   */
  async findById(id: string, tenantId: string) {
    return await this.model.findFirst({
      where: { id, tenantId },
    });
  }

  /**
   * 📧 FIND BY EMAIL
   */
  async findByEmail(email: string) {
    return await this.model.findUnique({
      where: { email },
    });
  }

  /**
   * 📄 FIND ALL (paginação + busca)
   */
  async findAll(
    tenantId: string,
    query?: PaginationQuery
  ): Promise<PaginatedResult<any>> {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      tenantId,
      ...(query?.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
      ...(query?.status && { status: query.status as any }),
    };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          [query?.orderBy || "createdAt"]:
            query?.orderDirection || "desc",
        } as Prisma.UserOrderByWithRelationInput,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 📝 UPDATE (seguro por tenant)
   */
  async update(
    id: string,
    tenantId: string,
    data: Prisma.UserUpdateInput
  ) {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * 🗑️ DELETE
   */
  async delete(id: string, tenantId: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }

  /**
   * 📊 COUNT
   */
  async count(tenantId: string): Promise<number> {
    return await this.model.count({
      where: { tenantId },
    });
  }
}