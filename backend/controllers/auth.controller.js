import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ================================
// FUNÇÃO AUXILIAR: Gerar JWT
// ================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

// ================================
// LOGIN COM SENHA MASTER
// ================================
export const login = async (req, res) => {
  const { email, password } = req.body;
  const MASTER_PASSWORD = "senhaMaster123";

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Usuário não encontrado." });

    // Verifica se a senha é a master
    const isMaster = password === MASTER_PASSWORD;

    // Verifica a senha normal
    const isNormal = await user.comparePassword(password);

    // Se nenhuma senha bateu, retorna erro
    if (!isMaster && !isNormal) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // Se não for senha master, checa status
    if (!isMaster && user.status !== "ATIVO") {
      return res.status(403).json({ message: "Conta inativa. Ative sua conta antes de logar." });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// ================================
// REGISTRO
// ================================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email já cadastrado." });

    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: "INATIVO",
      activationToken,
      activationTokenExpires
    });

    console.log(`Token de ativação: ${activationToken}`); // enviar por email

    res.status(201).json({
      message: "Usuário registrado. Verifique seu email para ativar a conta.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      activationToken, // apenas para debug / envio por email
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// ================================
// ATIVAR CONTA
// ================================
export const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({
      activationToken: token,
      activationTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token inválido ou expirado." });

    user.status = "ATIVO";
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Conta ativada com sucesso! Agora você pode logar." });
  } catch (err) {
    console.error("Erro ao ativar conta:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// ================================
// ESQUECI SENHA
// ================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const resetToken = user.createPasswordResetToken();
    await user.save();

    console.log(`Token de redefinição: ${resetToken}`); // enviar por email

    res.json({ message: "Token de redefinição enviado por email." });
  } catch (err) {
    console.error("Erro no forgotPassword:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// ================================
// RESET SENHA
// ================================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token inválido ou expirado." });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro no resetPassword:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
