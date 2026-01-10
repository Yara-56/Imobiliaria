// backend/controllers/user.controller.js

import User from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Função auxiliar para gerar o Token JWT após o login
const generateToken = (id) => {
  // Use a mesma chave secreta que estará no seu middleware de verificação
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // O token será válido por 30 dias
  });
};


// -----------------------------------------------------------------------------
// --- CONTROLLER DE LOGIN ---
// -----------------------------------------------------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validar se email e senha foram enviados
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    // 2. Encontrar o usuário pelo e-mail e incluir a senha na busca
    const user = await User.findOne({ email }).select('+password');

    // 3. Verificar se o usuário existe E se a senha está correta
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
    
    // 4. VERIFICAÇÃO CRUCIAL: Checar se o status do usuário é 'ATIVO'
    if (user.status !== 'ATIVO') {
      return res.status(403).json({ message: 'Sua conta está pendente de ativação. Verifique seu e-mail.' });
    }
    
    // 5. Se tudo estiver correto, gerar o token e enviar a resposta
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


// -----------------------------------------------------------------------------
// --- CONTROLLER DE ATIVAÇÃO DE CONTA ---
// -----------------------------------------------------------------------------
export const activateAccount = async (req, res) => {
  const { token, password } = req.body;

  try {
    // 1. Criptografar o token recebido para compará-lo com o token no banco
    const hashedToken = crypto
      .createHash('sha266')
      .update(token)
      .digest('hex');

    // 2. Encontrar o usuário que possui esse token e que ainda não expirou
    const user = await User.findOne({
      activationToken: hashedToken,
      activationTokenExpires: { $gt: Date.now() }, // Verifica se a data de expiração é maior que agora
    });

    // Se não encontrou o usuário, o convite é inválido ou já expirou
    if (!user) {
      return res.status(400).json({ message: 'Convite inválido ou expirado.' });
    }

    // 3. Se encontrou, definir a senha, ativar o status e limpar os campos de ativação
    user.password = password; // O hook 'pre save' no model vai criptografar isso
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


// -----------------------------------------------------------------------------
// --- CONTROLLER PARA BUSCAR PERFIL DO USUÁRIO LOGADO ---
// -----------------------------------------------------------------------------
export const getUserProfile = async (req, res) => {
  try {
    // O middleware 'verifyToken' já encontrou o usuário e o anexou em 'req.user'
    // Apenas retornamos os dados necessários para o frontend
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