import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { Center, Heading, Button, VStack, Text } from "@chakra-ui/react";

// 1. Estilos Globais
import "./styles/index.css";

/**
 * 🛠️ AJUSTE DE IMPORTS (Resolvendo o erro ts(2307))
 * Verifique no seu explorador: se a pasta 'ui' estiver dentro de 'components', o caminho é este:
 */
import { Provider as UIProvider } from "@/core/components/ui/provider"; 
import { AuthProvider } from "@/core/context/AuthContext"; // Singular: context
import AppRoutes from "@/core/routes/AppRoutes";

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
        <Button colorPalette="blue" onClick={() => window.location.assign("/")}>
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
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </UIProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);