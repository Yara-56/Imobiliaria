// CAMINHO: backend/src/modules/users/modules/user.model.ts
import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

/** * ✅ CORREÇÃO DE PAPÉIS: 
 * Sincronizado com o seu auth.controller (minúsculo)
 */
export type UserRole = "admin" | "corretor" | "cliente";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  tenantId: string; // ✅ MUDANÇA: De companyId para tenantId
  status: "ativo" | "inativo" | "bloqueado";
}

interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, UserMethods>;

const userSchema = new Schema<IUser, Model<IUser, {}, UserMethods>, UserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      required: true,
      select: false // Cybersecurity: Não traz a senha em buscas comuns
    },
    role: {
      type: String,
      enum: ["admin", "corretor", "cliente"],
      default: "cliente"
    },
    /**
     * ✅ CORREÇÃO DO ERRO 'REQUIRED': 
     * O campo agora é tenantId para bater com o seu tests.http
     */
    tenantId: {
      type: String,
      required: [true, "O tenantId é obrigatório para o isolamento de dados"]
    },
    status: {
      type: String,
      enum: ["ativo", "inativo", "bloqueado"],
      default: "ativo"
    }
  },
  { timestamps: true }
)

// Hash automático antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

/**
 * ✅ SOLUÇÃO OverwriteModelError: 
 * Impede que o Nodemon crashe ao tentar recompilar o modelo
 */
export const User = mongoose.models.User || mongoose.model<IUser, Model<IUser, {}, UserMethods>>("User", userSchema);

export default User;