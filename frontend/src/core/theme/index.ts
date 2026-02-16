// src/core/theme/index.ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f9ff" },
          500: { value: "#0078ff" }, // Azul Imobisys
          600: { value: "#0062d1" },
          900: { value: "#1e3a8a" },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: "{colors.brand.500}" },
        accent: { value: "{colors.brand.600}" },
      },
    },
  },
})