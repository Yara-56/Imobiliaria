"use client";

import { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react.js";
import { Toaster } from "react-hot-toast"; // ✅ Importe o Toaster aqui
import { AppProvider } from "./core/providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";

const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="#020617">
    <Spinner 
      size="xl" 
      color="blue.500" 
      /* ✅ 'thickness' virou 'borderWidth' no Chakra v3 */
      borderWidth="4px" 
      /* ✅ Se quiser o efeito de fundo, usamos 'borderBottomColor' ou 'opacity' */
      borderTopColor="transparent" 
    />
  </Center>
);

export default function App() {
  return (
    <AppProvider>
      {/* ✅ O Toaster deve ficar aqui, fora do Suspense para carregar imediato */}
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
}