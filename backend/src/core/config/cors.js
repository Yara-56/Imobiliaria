// config/cors.js (ou apenas cors.js)
const cors = require('cors');

// Lista de domínios permitidos (Whitelist)
const allowedOrigins = [
  'http://localhost:3000', // Seu frontend local (React, Vue, etc)
  'http://localhost:5173', // Vite local (comum hoje em dia)
  'https://sua-empresa-producao.com' // Seu domínio real
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem 'origin' (como Postman, Insomnia ou apps mobile)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS deste site não permite acesso a partir desta origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Habilita cookies/sessões entre domínios (importante se usar auth)
};

module.exports = cors(corsOptions);