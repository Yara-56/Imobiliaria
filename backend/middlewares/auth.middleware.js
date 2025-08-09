import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Middleware para verificar o token JWT
export const proteger = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtendo o token no header

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Passando o usuário decodificado para a requisição
    next(); // Continuando o fluxo para a próxima função/método
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
