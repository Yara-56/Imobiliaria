import { Box, Spinner, Center } from "@chakra-ui/react";
// ✅ Caminho relativo para evitar erro de alias @/
import { useAuth } from "../../../core/hooks/useAuth";

// Seções Estáticas - Importadas dos componentes da feature 'home'
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CTASection } from "../components/CTASection";

// Seções Condicionais ou Pesadas
import { StatsSection } from "../components/StatsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";

/**
 * HomePage - Maestro da Landing Page do ImobiSys.
 */
const HomePage = () => {
  // ✅ Renomeando 'loading' para 'isInitialLoading' na desestruturação 
  // para bater com o que seu AuthContext realmente exporta
  const { isAuthenticated, loading: isInitialLoading } = useAuth();

  return (
    <Box as="main" w="full" overflowX="hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Funcionalidades Principais */}
      <FeaturesSection />

      {/* 3. Seção Condicional: Spinner enquanto carrega ou Stats se logado */}
      {isInitialLoading ? (
        <Center py={20}>
          {/* ✅ Correção para Chakra UI v3: borderWidth em vez de thickness */}
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
        </Center>
      ) : (
        // Renderiza StatsSection apenas se o usuário estiver autenticado
        isAuthenticated && <StatsSection />
      )}

      {/* 4. Prova Social (Depoimentos) */}
      <TestimonialsSection />

      {/* 5. Seção de Conversão (Call to Action) */}
      <CTASection />
    </Box>
  );
};

export default HomePage;