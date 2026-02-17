"use client"

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Caminhos relativos para garantir que o TS encontre os arquivos
import { system } from "../theme"; 
import { AuthProvider } from "../context/AuthContext";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}