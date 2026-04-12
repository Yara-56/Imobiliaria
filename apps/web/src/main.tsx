import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";

function GlobalErrorFallback() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "white",
        fontSize: "18px",
      }}
    >
      Sistema temporariamente indisponível.
    </div>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element não encontrado");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);