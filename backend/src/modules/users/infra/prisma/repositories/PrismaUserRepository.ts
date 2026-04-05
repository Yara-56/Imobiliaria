import { User, Prisma } from "@prisma/client";
import { BaseRepository } from "../../../../../shared/base/base.repository";
import { 
  IUserRepository, 
  PaginationQuery, 
  PaginatedResult 
} from "../../../domain/repositories/IUserRepository";

/**
 * 👤 PrismaUserRepository
 * Nível: Sênior / SaaS Ready
 * Foco: Isolamento Multi-tenant, Performance e Tipagem Estrita.
 */
export class PrismaUserRepository 
  extends BaseRepository<"user"> 
  implements IUserRepository 
{
  constructor() {
    super("user");
  }

  /**
   * ➕ CREATE
   * Usa Tipagem nativa do Prisma para garantir integridade dos dados.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.model.create({ data });
  }

  /**
   * 💾 SAVE
   * Persiste uma entidade completa (útil para Domain-Driven Design).
   */
  async save(user: User): Promise<User> {
    return await this.model.update({
      where: { id: user.id },
      data: user
    });
  }

  /**
   * 🔍 FIND BY ID
   * 🛡️ Trava de Segurança SaaS: O 'tenantId' garante que um usuário
   * de uma imobiliária não consiga ver dados de outra.
   */
  async findById(id: string, tenantId: string): Promise<User | null> {
    return await this.model.findFirst({
      where: { id, tenantId }
    });
  }

  /**
   * 📧 FIND BY EMAIL
   * Busca global, essencial para o fluxo de autenticação/login.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findUnique({
      where: { email }
    });
  }

  /**
   * 📄 FIND ALL (Paginação + Busca + Filtro Multi-tenant)
   * Resolve o erro ts(2322) usando 'as Prisma.QueryMode'.
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
          { name: { contains: query.search, mode: 'insensitive' as Prisma.QueryMode } },
          { email: { contains: query.search, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      }),
      ...(query?.status && { status: query.status as any })
    };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        take: limit,
        skip,
        orderBy: { 
          [query?.orderBy || 'createdAt']: query?.orderDirection || 'desc' 
        }
      }),
      this.model.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 📝 UPDATE
   * Garante que a atualização ocorra apenas se o usuário pertencer ao Tenant informado.
   */
  async update(id: string, tenantId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.model.update({
      where: { id, tenantId },
      data
    });
  }

  /**
   * 🗑️ DELETE
   * Segurança máxima para evitar deleção acidental de dados de terceiros.
   */
  async delete(id: string, tenantId: string): Promise<void> {
    await this.model.delete({
      where: { id, tenantId }
    });
  }

  /**
   * 📊 COUNT
   * Método de utilidade para dashboards rápidos.
   */
  async count(tenantId: string): Promise<number> {
    return await this.model.count({
      where: { tenantId }
    });
  }
}