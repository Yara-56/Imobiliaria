"use client"

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { system } from "../theme"; 
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "@/components/ui/toaster"; // ✅ Onde suas notificações moram

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <Toaster /> {/* ✅ Sem isso, o erro de login fica "invisível" */}
          {children}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}