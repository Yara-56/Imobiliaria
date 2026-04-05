/// <reference types="node" />
import { defineConfig } from '@prisma/config';

/**
 * 🔗 Configuração do Prisma 7
 * A linha 1 acima força o reconhecimento do 'process' global do Node.js
 */
export default defineConfig({
  engine: 'classic', 
  datasource: {
    url: process.env.DATABASE_URL || "", 
  },
});