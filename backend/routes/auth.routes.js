export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email e senha obrigatórios');
      error.status = 400;
      throw error;
    }

    // lógica aqui...

    res.json({ message: 'Login realizado com sucesso' });

  } catch (error) {
    next(error); // sempre usar next
  }
};
