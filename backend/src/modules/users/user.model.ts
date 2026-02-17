import mongoose, { Schema, type Document, type Model } from "mongoose";
import bcrypt from "bcryptjs";

// Importamos o tipo UserRole para manter a consistência com os middlewares
import { type UserRole } from "../../shared/middlewares/auth.middleware.ts";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  tenantId: string;
  status: "ativo" | "inativo" | "bloqueado";
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "corretor", "cliente"], default: "cliente" },
    tenantId: { type: String, required: true, index: true },
    status: { type: String, enum: ["ativo", "inativo", "bloqueado"], default: "ativo" },
    lastLogin: { type: Date }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        // ✅ Técnica de desestruturação para remover dados sensíveis sem usar 'delete'
        const { password, __v, ...safeUser } = ret;
        return safeUser;
      }
    }
  }
);

// Middleware do Mongoose para Hashear a senha antes de salvar
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

// Método para validar senha no login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password || "");
};

const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);
export default User;