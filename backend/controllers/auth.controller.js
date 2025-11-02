import jwt from 'jsonwebtoken';

// --- LOGIN LIBERADO PARA TESTE ---
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = {
      _id: 'teste-' + Date.now(),
      name: email.split('@')[0] || 'Usuário',
      email,
      role: 'user',
      status: 'ATIVO',
    };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'segredoTemporario',
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user,
      aviso: '⚠️ LOGIN LIBERADO (modo teste)',
    });
  } catch (err) {
    console.error('Erro no login rápido:', err);
    res.status(500).json({ error: 'Erro interno no login teste.' });
  }
};

// --- DUMMY EXPORTS PARA NÃO QUEBRAR ROTAS ---
export const register = async (req, res) => res.status(200).json({ message: 'Registro ok (modo teste)' });
export const activateAccount = async (req, res) => res.status(200).json({ message: 'Conta ativada (modo teste)' });
export const forgotPassword = async (req, res) => res.status(200).json({ message: 'Reset enviado (modo teste)' });
export const resetPassword = async (req, res) => res.status(200).json({ message: 'Senha redefinida (modo teste)' });
