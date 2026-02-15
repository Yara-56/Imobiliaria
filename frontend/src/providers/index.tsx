import { AuthProvider } from "@/core/auth/contexts/AuthContext";
import { Provider as ChakraProvider } from "@/components/ui/provider"; // Chakra v3

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      {/* O AuthProvider deve vir dentro do Router mas fora das páginas */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  );
};