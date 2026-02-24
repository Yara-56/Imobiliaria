"use client";

import { ReactNode, useMemo } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { system } from "../theme";
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}