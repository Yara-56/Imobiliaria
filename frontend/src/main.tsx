import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// O arquivo de estilos do Tailwind DEVE vir primeiro
import "./styles/index.css"; 

import { Provider } from "./components/ui/provider"; 
import AppRoutes from "./app/routes/AppRoutes"; // Import sem chaves
import { AuthProvider } from "./core/providers/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider> 
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);