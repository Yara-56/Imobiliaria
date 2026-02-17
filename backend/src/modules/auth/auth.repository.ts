import User, { type IUser } from "../users/user.model.ts";

/**
 * 📦 Camada de Persistência - AuraImobi
 * Responsável estritamente por operações de banco de dados.
 */

/**
 * Busca um usuário por e-mail e inclui a senha para validação
 */
export const findByEmailWithPassword = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).select("+password");
};

/**
 * Busca um usuário por ID (Usado no Refresh Token / Me)
 */
export const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

/**
 * Atualiza o último login do usuário
 */
export const updateLastLogin = async (id: string): Promise<void> => {
  await User.findByIdAndUpdate(id, { lastLogin: new Date() });
};

/**
 * Verifica se um e-mail já existe (Usado em registros)
 */
export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await User.countDocuments({ email });
  return count > 0;
};