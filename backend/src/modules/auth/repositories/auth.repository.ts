import User, {
  type IUser,
  type UserDocument,
} from "../../users/models/user.model.js";

/**
 * 📦 Auth Repository
 * Camada responsável SOMENTE por acesso ao banco.
 * Não contém regras de negócio.
 */

/* ======================================================
     🔍 Buscar usuário por e-mail COM senha
     (Usado no login)
  ====================================================== */

export const findByEmailWithPassword = async (
  email: string
): Promise<UserDocument | null> => {
  return User.findOne({ email }).select("+password").exec();
};

/* ======================================================
     🔍 Buscar usuário por e-mail SEM senha
     (Usado em validações)
  ====================================================== */

export const findByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return User.findOne({ email }).exec();
};

/* ======================================================
     🔍 Buscar por ID
     (Usado no refresh token / me)
  ====================================================== */

export const findById = async (id: string): Promise<UserDocument | null> => {
  return User.findById(id).exec();
};

/* ======================================================
     📌 Verifica se e-mail já existe
  ====================================================== */

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await User.countDocuments({ email }).exec();
  return count > 0;
};

/* ======================================================
     🕒 Atualiza último login
  ====================================================== */

export const updateLastLogin = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    lastLogin: new Date(),
  }).exec();
};

/* ======================================================
     ➕ Criar usuário
     (Usado no register)
  ====================================================== */

export const createUser = async (
  data: Omit<IUser, "createdAt" | "updatedAt">
): Promise<UserDocument> => {
  const user = new User(data);
  return user.save();
};
