import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * 🚀 VITE PROFESSIONAL CONFIGURATION
 * Focus: Determinism, Performance, and Chakra UI v3 optimization.
 */
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    
    // --- 🛣️ RESOLUÇÃO DE CAMINHOS (Aliases) ---
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@core": path.resolve(__dirname, "./src/core"),
      },
    },

    // --- 🛡️ SERVIDOR DE DESENVOLVIMENTO (Determinismo) ---
    server: {
      port: 5173,      // Porta fixa para evitar erros de CORS no backend
      strictPort: true, // Se a 5173 estiver ocupada, ele não pula para a 5174 (evita bugs silenciosos)
      host: true,      // Permite acesso via IP (útil para testar no celular ou tablet)
    },

    // --- 🏗️ BUILD & PERFORMANCE ---
    build: {
      sourcemap: mode !== 'production', // Gera mapas apenas em dev/staging para debug
      outDir: "dist",
      chunkSizeWarningLimit: 1000,      // Chakra UI v3 é robusto, aumentamos o limite de alerta
      rollupOptions: {
        output: {
          // Separa bibliotecas grandes em arquivos diferentes (Vendor Splitting)
          // Isso faz o site carregar muito mais rápido após a primeira visita
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          },
        },
      },
    },

    // --- ⚡ OTIMIZAÇÃO DE DEPENDÊNCIAS ---
    optimizeDeps: {
      include: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
    },
  };
});