import bcryptjs from 'bcryptjs'; // Use bcryptjs se não precisar de bcrypt com compilação nativa
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Função para registrar novo usuário
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já registrado.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

// Função para login de usuário
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no login.' });
  }
};
