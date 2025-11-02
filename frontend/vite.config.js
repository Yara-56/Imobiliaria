import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O Rollup é o bundler que o Vite usa internamente.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Adiciona o tratamento de avisos do Rollup
      onwarn(warning, warn) {
        // Ignora avisos específicos que o Vercel está tratando como erro
        // O aviso mais comum é sobre "external" ou dependências.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }

        // Se quiser ignorar TODOS os avisos do Rollup:
        // if (warning.code) {
        //   return;
        // }

        // Caso contrário, use o comportamento padrão do Rollup para avisos
        warn(warning);
      },
    },
  },
});