import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'O nome é obrigatório'] },
  email: { type: String, required: [true, 'O e-mail é obrigatório'], unique: true },
  password: { type: String, required: [true, 'A senha é obrigatória'], select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['ATIVO', 'INATIVO'], default: 'INATIVO' },

  // tokens para ativação e redefinição
  activationToken: String,
  activationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true
});

// --- HASH DE SENHA ANTES DE SALVAR ---
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- MÉTODO PARA COMPARAR SENHA ---
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- MÉTODO PARA CRIAR TOKEN DE REDEFINIÇÃO ---
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
