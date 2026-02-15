import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";

// 1️⃣ Estilos Globais
import "./styles/index.css";

// 2️⃣ Providers
import { Provider as UIProvider } from "./components/ui/provider";
import { AuthProvider } from "./core/context/AuthContext";

// 3️⃣ Rotas
import AppRoutes from "./routes/AppRoutes";

/**
 * 🔥 Configuração do React Query
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
    },
  },
});

/**
 * 🚨 Fallback global de erro
 */
function ErrorFallback() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        color: "#ef4444",
      }}
    >
      <h2>Ops! Algo deu muito errado.</h2>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          background: "#111827",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Recarregar Sistema
      </button>
    </div>
  );
}

/**
 * 🚀 Renderização Principal
 */
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

        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
