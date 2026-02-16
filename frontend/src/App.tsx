"use client"

import { Suspense } from "react";
import { Provider as UIProvider } from "./core/components/ui/provider"; 
import { AuthProvider } from "./core/context/AuthContext"; 
import AppRoutes from "./core/routes/AppRoutes";
// ✅ Importando o Toaster que nós customizamos (Chakra v3)
import { Toaster } from "./core/components/ui/toaster"; 

const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        {/* Renderiza o componente visual das notificações */}
        <Toaster /> 
        
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;