import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error('Não autorizado');
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
