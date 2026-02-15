// src/components/ui/provider.tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  );
}