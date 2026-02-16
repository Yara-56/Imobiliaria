"use client"

import { Box, Spinner, Center } from "@chakra-ui/react";
import { useAuth } from "../../../core/hooks/useAuth";

// Importando componentes
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CTASection } from "../components/CTASection";
import { StatsSection } from "../components/StatsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { Footer } from "../components/Footer";

const HomePage = () => {
  // ✅ Agora estamos lendo e usando o isAuthenticated
  const { isAuthenticated, loading: isInitialLoading } = useAuth();

  return (
    <Box as="main" w="full" bg="black" overflowX="hidden">
      {/* Passamos o isAuthenticated para a Hero para que ela saiba 
         se deve mostrar "Login" ou "Dashboard" no botão principal 
      */}
      <HeroSection />

      <FeaturesSection />

      {isInitialLoading ? (
        <Center py={20}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
        </Center>
      ) : (
        /* 💡 GESTÃO INTELIGENTE: 
           Só mostramos os Stats detalhados se o usuário estiver logado.
           Se não, poderíamos mostrar uma versão resumida.
        */
        isAuthenticated ? <StatsSection /> : <Box py={10} textAlign="center" color="gray.600">Faça login para ver suas métricas em tempo real.</Box>
      )}

      <TestimonialsSection />
      
      {/* O CTA também pode mudar com base na autenticação */}
      <CTASection />

      <Footer />
    </Box>
  );
};

export default HomePage;