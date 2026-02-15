import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "@/components/ui/provider"; 
import { AuthProvider } from "@/core/contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <Provider>
        <AuthProvider>
          {/* Toaster posicionado para ser visível sobre o tema dark */}
          <Toaster richColors theme="dark" position="top-right" closeButton />
          <AppRoutes />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
};

export default App;