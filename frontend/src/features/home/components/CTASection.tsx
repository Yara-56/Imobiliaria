import { Box, Heading, Button, HStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth";

/**
 * CTASection - Chamada final para conversão.
 * Atualizado para Chakra UI v3: Substituído 'rightIcon' por composição manual.
 */
export const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDashboardRedirect = () => {
    // Redireciona para /admin se estiver logado (seguindo sua estrutura de rotas)
    if (isAuthenticated) navigate("/admin/dashboard");
    else navigate("/login");
  };

  return (
    <Box as="section" bg="blue.950" py={{ base: 20, md: 32 }} textAlign="center" color="white">
      <Heading size="2xl" mb={8} fontWeight="bold">
        Pronto para transformar sua imobiliária?
      </Heading>
      
      {/* No Chakra v3, usamos a composição para adicionar ícones */}
      <Button 
        variant="solid" 
        colorPalette="blue" // 'colorScheme' mudou para 'colorPalette' no v3
        size="xl" 
        onClick={handleDashboardRedirect}
        fontWeight="bold"
      >
        <HStack gap={2}>
          <span>Comece Gratuitamente</span>
          <ArrowRight size={20} />
        </HStack>
      </Button>
    </Box>
  );
};