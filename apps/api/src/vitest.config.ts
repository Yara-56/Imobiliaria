import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // ✅ O plugin deve ser declarado aqui, fora do resolve
  plugins: [tsconfigPaths()], 
  test: {
    globals: true,
    environment: "node",
  },
});