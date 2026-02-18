"use client";

import { Suspense } from "react";
import { AppProvider } from "./core/providers/AppProvider"; 
import AppRoutes from "./routes/AppRoutes";
import { Center, Spinner } from "@chakra-ui/react";

/**
 * Loader elegante para transições de página
 * No Chakra UI v3, usamos 'borderWidth' no lugar de 'thickness'
 */
const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="#020617">
    <Spinner 
      color="blue.500" 
      size="xl" 
      borderWidth="4px" // ✅ Substitui o 'thickness'
      animationDuration="0.65s" // ✅ Substitui o 'speed'
      css={{ "--spinner-track-color": "rgba(255, 255, 255, 0.1)" }} // ✅ Forma moderna de definir o track (emptyColor)
    />
  </Center>
);

const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
};

export default App;