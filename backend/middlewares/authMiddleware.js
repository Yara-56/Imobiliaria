import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Ajustado para bater com seu arquivo atual

export const protect = async (req, res, next) => {
  let token;
  
  // 1. Extração do Token (Headers ou Cookies)
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'Você não está logado! Por favor, faça login para acessar.' 
    });
  }

  try {
    // 2. Verificação do Token usando a Secret do seu .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Busca o usuário e injeta na requisição (req.user)
    // O .select('-password') é uma boa prática de segurança: não carrega a senha no objeto
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'O usuário dono deste token não existe mais.' 
      });
    }

    // 🚀 O SEGREDO DO SUCESSO: req.user agora está disponível para os Controllers!
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'Sessão inválida ou expirada. Faça login novamente.' 
    });
  }
};

// Middleware para Roles (Controle de Acesso Baseado em Função - RBAC)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Verifica se a role do usuário logado (ex: 'ADMIN') está na lista permitida
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail',
        message: 'Você não tem permissão para realizar esta ação.' 
      });
    }
    next();
  };
};