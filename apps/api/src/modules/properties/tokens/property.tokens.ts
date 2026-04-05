/**
 * ✅ RASTRO PROFISSIONAL:
 * Definição de Tokens para Injeção de Dependência (IoC).
 * O uso de Symbols garante que as chaves de injeção sejam únicas em todo o sistema,
 * evitando colisões de nomes entre diferentes módulos do SaaS.
 */
export const PROPERTY_TOKENS = {
     // Token para o Repositório de Imóveis
     Repository: Symbol("PropertyRepository"),
   
     // Token para o Serviço de Imóveis (Opcional, se quiser injetar o Service em outros lugares)
     Service: Symbol("PropertyService"),
   
     // Caso você adicione um provedor de Storage específico para fotos de imóveis no futuro
     StorageProvider: Symbol("PropertyStorageProvider"),
   };