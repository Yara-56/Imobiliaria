import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Interface para definir as propriedades do Usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'corretor' | 'user';
  status: 'ativo' | 'inativo' | 'bloqueado';
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Schema com Tipagem Genérica
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'corretor', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['ativo', 'inativo', 'bloqueado'],
      default: 'ativo',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Hash Automático (Middleware Pre-save)
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// 4. Método de Comparação Tipado
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password || '');
};

// 5. 🔥 Solução Definitiva para ts(2790): Remoção Segura no toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  const { password, ...userWithoutPassword } = obj;
  return userWithoutPassword;
};

export default mongoose.model<IUser>('User', userSchema);