import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { Center, Heading, Button, VStack, Text } from "@chakra-ui/react";

import "./styles/index.css";

// 🛠️ Ajuste nos Imports: Apontando para os arquivos específicos
import { Provider as UIProvider } from "@/components/ui/provider"; 
import { AuthProvider } from "@/context/AuthContext";
// Corrigido: Apontando para AppRoutes.tsx para o TS localizar o módulo
import AppRoutes from "@/routes/AppRoutes"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, 
    },
  },
});

function ErrorFallback() {
  return (
    <Center h="100vh" p={6} bg="gray.50">
      <VStack gap={4} textAlign="center">
        <Heading size="lg" color="red.500">Ops! Algo deu errado.</Heading>
        <Text color="gray.600">Ocorreu um erro inesperado no ImobiSys.</Text>
        <Button 
          colorPalette="blue" 
          onClick={() => window.location.href = "/"}
        >
          Recarregar Sistema
        </Button>
      </VStack>
    </Center>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </UIProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);