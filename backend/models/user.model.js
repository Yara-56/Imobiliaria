import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "ADMIN" },
  status: { type: String, default: "INATIVO" },
  activationToken: String,
  activationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// --- Hash da senha antes de salvar ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- Comparar senha para login ---
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// --- Criar token de redefinição de senha ---
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

export default mongoose.model("User", userSchema);
