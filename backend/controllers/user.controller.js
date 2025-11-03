// backend/controllers/user.controller.js

import User from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    if (user.status !== 'ATIVO') {
      return res.status(403).json({ message: 'Sua conta está pendente de ativação. Verifique seu e-mail.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ATIVAÇÃO DE CONTA
export const activateAccount = async (req, res) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      activationToken: hashedToken,
      activationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Convite inválido ou expirado.' });
    }

    user.password = password;
    user.status = 'ATIVO';
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Conta ativada com sucesso! Você já pode fazer o login.' });
  } catch (error) {
    console.error('Erro ao ativar conta:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// PERFIL DO USUÁRIO LOGADO
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// BUSCA USUÁRIO POR EMAIL
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email é obrigatório.' });

    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
