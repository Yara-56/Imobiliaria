// src/theme/index.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f9ff" },
          500: { value: "#0078ff" }, // Azul AuraImobi
          600: { value: "#0062d1" },
          900: { value: "#1e3a8a" },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: "{colors.brand.500}" },
        accent: { value: "{colors.brand.600}" },
        bg: { value: { _light: "{colors.brand.50}", _dark: "#1A202C" } } // Bom para UX da vovó
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)