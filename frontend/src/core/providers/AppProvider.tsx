"use client";

import { ReactNode, useMemo } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// ✅ Importações seguindo a sua estrutura de pastas
import { system } from "../theme"; 
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export function AppProvider({ children }: { children: ReactNode }) {
  // ✅ useMemo evita que o QueryClient seja recriado em re-renders desnecessários
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache padrão
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          {/* ✅ O BrowserRouter deve envolver o Toaster e os Children 
              para permitir navegação programática via Contexto */}
          <BrowserRouter>
            <Toaster /> 
            {children}
          </BrowserRouter>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}