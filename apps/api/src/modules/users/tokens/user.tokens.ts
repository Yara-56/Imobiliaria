/**
 * 🔑 USER MODULE TOKENS
 * * Por que usar Symbol.for? 
 * 1. Evita colisões de nomes em aplicações grandes.
 * 2. Garante que o Token seja único e imutável.
 * 3. Facilita o desacoplamento: o UseCase pede um 'UserRepository' 
 * e não se importa se ele é Prisma, TypeORM ou em Memória.
 */

export const USER_TOKENS = {
     // Repositórios (Persistência de Dados)
     Repository: Symbol.for("UserRepository"),
   
     // Serviços de Domínio (Lógicas complexas de usuário)
     Service: Symbol.for("UserService"),
   
     // Provedores de Segurança (JWT, Hashing, etc)
     HashProvider: Symbol.for("HashProvider"),
     TokenProvider: Symbol.for("TokenProvider"),
   
     // Casos de Uso (Se você preferir injetar UseCases em Controllers)
     CreateUserUseCase: Symbol.for("CreateUserUseCase"),
     AuthenticateUserUseCase: Symbol.for("AuthenticateUserUseCase"),
   } as const; 
   // O 'as const' garante que as propriedades sejam apenas leitura (readonly)