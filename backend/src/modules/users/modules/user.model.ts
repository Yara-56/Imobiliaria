// CAMINHO: backend/src/modules/users/modules/user.model.ts
import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "corretor" | "cliente";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  tenantId: string; // ✅ Padrão ImobiSys
  status: "ativo" | "inativo" | "bloqueado";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, UserMethods>;

const userSchema = new Schema<IUser, Model<IUser, {}, UserMethods>, UserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "corretor", "cliente"], default: "cliente" },
    tenantId: { type: String, required: true, index: true }, // ✅ Sem rastro de companyId
    status: { type: String, enum: ["ativo", "inativo", "bloqueado"], default: "ativo", index: true },
    lastLogin: Date,
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        const { password, __v, ...safeUser } = ret;
        return safeUser;
      },
    },
  }
);

// Hash automático da senha
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

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Limpeza de cache para evitar o erro de 'companyId' do banco antigo
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser, Model<IUser, {}, UserMethods>>("User", userSchema);
export default User;