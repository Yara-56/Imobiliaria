// backend/controllers/admin.controller.js

import { inviteUserService } from '../services/admin.service.js';
import { ZodError } from 'zod';

export const inviteUser = async (req, res) => {
  try {
    await inviteUserService(req.body);

    return res.status(201).json({
      message: 'Convite enviado com sucesso!',
    });

  } catch (error) {

    // Erro de validação
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.flatten().fieldErrors,
      });
    }

    // Erros de regra de negócio
    if (error.name === 'DisposableEmailError') {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.name === 'UserAlreadyExistsError') {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error('[ADMIN_INVITE_USER_ERROR]', error);

    return res.status(500).json({
      message: 'Erro interno no servidor.',
    });
  }
};
