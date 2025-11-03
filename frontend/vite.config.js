import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 🔹 garante que todas as rotas usem a raiz do domínio
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignora avisos específicos que o Vercel trata como erro
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
});
