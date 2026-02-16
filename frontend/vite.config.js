import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define que '@' aponta para a pasta 'src'
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Otimização para garantir que dependências do Chakra UI v3 sejam processadas corretamente
  optimizeDeps: {
    include: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
  },
});