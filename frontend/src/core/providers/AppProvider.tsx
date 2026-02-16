// src/core/providers/AppProvider.tsx
import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { system } from "@/core/theme";
import { AuthProvider } from "@/core/context/AuthContext";

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