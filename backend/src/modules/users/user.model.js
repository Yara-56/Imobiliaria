import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
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
      select: false, // 🔥 nunca retorna senha por padrão
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

//
// ==========================
// HASH AUTOMÁTICO
// ==========================
//
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//
// ==========================
// COMPARAÇÃO DE SENHA
// ==========================
//
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//
// ==========================
// REMOVE CAMPOS SENSÍVEIS
// ==========================
//
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
