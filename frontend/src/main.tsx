"use client";

import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Center, Heading, Button, VStack, Text } from "@chakra-ui/react";

// ✅ Importação do App principal (Maestro)
import App from "./App";

/**
 * CONFIGURAÇÃO DE FUTURE FLAGS (Padrão de Mercado para React Router)
 * Isso utiliza a tipagem definida no seu global.d.ts para silenciar avisos
 * e preparar o ImobiSys para a próxima versão do Router.
 */
window.REACT_ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

/**
 * Fallback para erros fatais (Tela de Emergência)
 * Se o App não conseguir nem montar os Providers, esta tela aparece.
 */
function GlobalErrorFallback() {
  return (
    <Center h="100vh" w="100vw" p={6} bg="#020617" color="white">
      <VStack gap={6} textAlign="center">
        <Heading size="2xl" color="red.400" fontWeight="900">
          Imobi<Text as="span" color="white">Sys</Text>
        </Heading>
        <VStack gap={2}>
          <Heading size="md">Sistema Temporariamente Indisponível</Heading>
          <Text color="gray.400">
            Houve um erro crítico na inicialização do painel.
          </Text>
        </VStack>
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={() => window.location.reload()}
          borderRadius="xl"
        >
          RECARREGAR SISTEMA
        </Button>
      </VStack>
    </Center>
  );
}

// ✅ Renderização Principal: Limpa e Robusta
const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Falha ao encontrar o elemento root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);