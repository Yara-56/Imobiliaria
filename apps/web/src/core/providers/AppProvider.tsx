"use client";

import { ReactNode, useMemo } from "react";
import { ChakraProvider } from "@chakra-ui/react.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query.js";

import { system } from "../theme";
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "@/components/ui/toaster.js";

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