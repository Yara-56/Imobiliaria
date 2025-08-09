import express from 'express';
import fs from 'fs/promises'; // Usando a versão assíncrona do 'fs'
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const caminhoUsuarios = path.resolve('usuarios.json');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });
    }

    if (!fs.existsSync(caminhoUsuarios)) {
      return res.status(404).json({ error: 'Nenhum usuário cadastrado ainda.' });
    }

    const data = await fs.readFile(caminhoUsuarios, 'utf8');
    const usuarios = JSON.parse(data);
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      }
    });

  } catch (erro) {
    console.error('❌ Erro ao realizar login:', erro);
    res.status(500).json({ error: 'Erro interno ao processar o login.' });
  }
});

export default router;
