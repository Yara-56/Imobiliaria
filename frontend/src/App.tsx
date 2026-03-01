"use client";

import { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { AppProvider } from "./core/providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";

const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="#020617">
    <Spinner size="xl" borderWidth="4px" />
  </Center>
);

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
}