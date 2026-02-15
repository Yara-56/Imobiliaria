import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../validators/authValidator.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

export const login = async (req, res) => {
  try {
    // 1. Validação com Zod
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // 2. Busca o usuário e força a seleção da senha (que está como select: false no model)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    if (user.status !== 'ATIVO') {
      return res.status(403).json({ message: 'Sua conta ainda não foi ativada' });
    }

    // 3. Gera o Token
    const token = signToken(user._id);

    // 4. Envia via Cookie Seguro (Padrão de Mercado)
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });

    // 5. Resposta limpa
    user.password = undefined; // Remove a senha do retorno por segurança
    res.status(200).json({
      status: 'success',
      token, // Mantemos o token no JSON caso você prefira salvar no LocalStorage do React
      data: { user }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};