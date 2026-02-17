"use client"

import { Suspense } from "react";
import { AppProvider } from "./core/providers/AppProvider";
import AppRoutes from "./core/routes/AppRoutes";
import { Toaster } from "./core/components/ui/toaster"; 

const App = () => {
  return (
    <AppProvider>
      {/* O Toaster deve ficar dentro do Provider para usar o tema */}
      <Toaster /> 
      
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
};

export default App;