import { PrismaModelName, prismaModels, PrismaModelDelegate } from "./prisma-models";

export abstract class BaseRepository<M extends PrismaModelName> {
  // ✅ O 'protected' permite que a UserRepository veja o 'this.model'
  // ✅ O PrismaModelDelegate<M> garante o autocomplete (findUnique, etc)
  protected model: PrismaModelDelegate<M>;

  constructor(modelName: M) {
    // Fazemos o cast para 'any' apenas na atribuição interna,
    // mas a definição acima mantém a tipagem forte para o resto do código.
    this.model = prismaModels[modelName] as any;
  }
}