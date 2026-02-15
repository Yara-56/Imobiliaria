// src/app/App.tsx
import React, { FC } from "react";
// Corrigido: Importando sem chaves (default import) e sem a extensão .js
import AppRoutes from "./routes/AppRoutes";

/**
 * Componente principal da aplicação.
 * Aqui você pode adicionar Providers globais que não dependam do Router,
 * ou layouts que devam aparecer em todas as páginas.
 */
const App: FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* O AppRoutes contém toda a lógica de navegação. 
          Certifique-se de que o BrowserRouter esteja no main.tsx 
          envolvendo este componente App.
      */}
      <AppRoutes />
    </div>
  );
};

export default App;