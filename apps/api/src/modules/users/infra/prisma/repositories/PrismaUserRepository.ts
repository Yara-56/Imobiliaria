import { PrismaClient, Prisma, User } from "@prisma/client";
import { BaseRepository } from "@shared/core/BaseRepository.js";
import {
  IUserRepository,
  PaginationQuery,
  PaginatedResult,
} from "../../../domain/repositories/IUserRepository.js";

const prisma = new PrismaClient();

/**
 * 👤 PrismaUserRepository
 * Foco: Multi-tenant, Clean Architecture e Tipagem Forte
 */
export class PrismaUserRepository
  extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput>
  implements IUserRepository
{
  constructor() {
    // Passamos o modelo 'user' do Prisma para a classe base
    super(prisma.user);
  }

  /**
   * 💾 SAVE / UPDATE (Geral)
   */
  async save(user: any): Promise<User> {
    return await this.model.update({
      where: { id: user.id },
      data: user,
    });
  }

  /**
   * 📧 FIND BY EMAIL (Específico de Usuário)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findUnique({
      where: { email },
    });
  }

  /**
   * 🔍 FIND BY ID (Sobrescrevendo para garantir multi-tenant)
   */
  override async findById(id: string, tenantId: string): Promise<User | null> {
    return await this.model.findFirst({
      where: { id, tenantId },
    });
  }

  /**
   * 📄 FIND ALL (Com paginação avançada e busca)
   */
  async findAll(
    tenantId: string,
    query?: PaginationQuery
  ): Promise<PaginatedResult<User>> {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      tenantId,
      ...(query?.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
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
          [query?.orderBy || "createdAt"]: query?.orderDirection || "desc",
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
   * 📝 UPDATE (Segurança: obriga o uso do tenantId no WHERE)
   */
  override async update(
    id: string,
    tenantId: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return await this.model.update({
      where: { id, tenantId },
      data,
    });
  }

  /**
   * 🗑️ DELETE (Segurança: impede deletar de outro tenant)
   */
  override async delete(id: string, tenantId: string): Promise<void> {
    await this.model.delete({
      where: { id, tenantId },
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