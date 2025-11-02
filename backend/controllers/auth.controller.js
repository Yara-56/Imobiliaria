// backend/controllers/auth.controller.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// --- SCHEMAS DE VALIDAÇÃO ---
const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

// -----------------------------------------------------------------------------
// REGISTER
// -----------------------------------------------------------------------------
export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser)
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });

    const newUser = new User(validatedData);
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    res.status(500).json({ message: 'Erro no servidor.', error: error.message });
  }
};

// -----------------------------------------------------------------------------
// LOGIN (libera qualquer senha)
// -----------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email } = loginSchema.parse(req.body);

    if (!process.env.JWT_SECRET)
      throw new Error('JWT_SECRET não configurado no servidor.');

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'E-mail inválido (usuário não encontrado).' });

    // ⚠️ Ignora a senha, liberando login apenas pelo e-mail

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno durante o login.' });
  }
};

// -----------------------------------------------------------------------------
// ATIVAR CONTA
// -----------------------------------------------------------------------------
export const activateAccount = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Token e senha válidos são obrigatórios.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      activationToken: hashedToken,
      activationTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: 'Convite inválido ou expirado.' });

    user.password = password;
    user.status = 'ATIVO';
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: 'Conta ativada com sucesso! Você já pode fazer o login.' });
  } catch (error) {
    console.error('Erro ao ativar conta:', error);
    res
      .status(500)
      .json({ message: 'Erro interno no servidor ao ativar a conta.' });
  }
};

// -----------------------------------------------------------------------------
// ESQUECI MINHA SENHA
// -----------------------------------------------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).json({
        message:
          'Se um usuário com este e-mail existir, um link de recuperação será enviado.',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:5173/redefinir-senha/${resetToken}`;
    const message = `Você solicitou redefinir sua senha. Clique no link para criar uma nova senha (válido 10 min):\n\n${resetURL}`;

    await sendEmail({
      email: user.email,
      subject: 'Recuperação de Senha',
      message,
    });

    res.status(200).json({
      message:
        'Se um usuário com este e-mail existir, um link de recuperação será enviado.',
    });
  } catch (error) {
    console.error('Erro em forgotPassword:', error);
    res.status(500).json({
      message: 'Ocorreu um erro ao tentar enviar o e-mail de recuperação.',
    });
  }
};

// -----------------------------------------------------------------------------
// REDEFINIR SENHA
// -----------------------------------------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: 'Token para redefinição de senha é inválido ou expirou.',
      });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro em resetPassword:', error);
    res
      .status(500)
      .json({ message: 'Erro ao redefinir a senha.' });
  }
};
