import { Toaster } from "sonner";
import { Suspense } from "react"; // Removido o 'lazy' daqui

// Providers com caminhos relativos
import { Provider as UIProvider } from "./core/components/ui/provider"; 
import { AuthProvider } from "./core/context/AuthContext"; 
import AppRoutes from "./core/routes/AppRoutes";

const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <Toaster richColors theme="light" position="top-right" closeButton />
        
        {/* O Suspense é necessário para as rotas que usam lazy loading */}
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;