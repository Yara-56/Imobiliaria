"use client"

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Imports sincronizados com a estrutura do seu projeto
import { system } from "../theme"; 
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "@/components/ui/toaster"; // ✅ Adicionado para habilitar o login

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          {/* ✅ O Toaster precisa estar aqui para capturar os eventos de login */}
          <Toaster /> 
          {children}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}