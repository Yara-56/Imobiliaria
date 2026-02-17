import rateLimit from "express-rate-limit";
import { AppError } from "../errors/AppError.js";

/**
 * Configuração de Limite de Requisições
 * Protege contra ataques de força bruta e abusos de API.
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 100, // Limite de 100 requisições por IP nesta janela
  standardHeaders: true, // Retorna informações de limite nos headers 'RateLimit-*'
  legacyHeaders: false, // Desativa os headers 'X-RateLimit-*' antigos
  
  // Resposta customizada usando seu padrão de alto padrão
  handler: (req, res, next, options) => {
    next(new AppError(
      "Muitas requisições vindas deste IP. Por favor, tente novamente após 15 minutos.", 
      429
    ));
  },
});

/**
 * Limite específico para rotas sensíveis (Login / Cadastro)
 * Muito mais restrito para evitar ataques de dicionário.
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Apenas 5 tentativas de login por hora
  message: {
    status: "fail",
    message: "Muitas tentativas de login. Sua conta foi temporariamente bloqueada para segurança."
  },
  standardHeaders: true,
  legacyHeaders: false,
});