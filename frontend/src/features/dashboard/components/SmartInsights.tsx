"use client";

import { 
  Box, 
  Flex, 
  Text, 
  Icon, 
  HStack, 
  VStack, 
  Badge, 
  Center,
  SimpleGrid
} from "@chakra-ui/react";
import { 
  LuTrendingUp, 
  LuCircleAlert, 
  LuSparkles,
  LuLightbulb
} from "react-icons/lu";

// Interface ajustada para receber o objeto dashboardData diretamente
interface SmartInsightsProps {
  data: {
    occupancyRate?: number;
    defaultRate?: number;
    [key: string]: any;
  } | null | undefined;
}

/**
 * SmartInsights - Versão Acessível (UX para Idosos)
 * Fundo claro, bordas nítidas e textos com alto contraste.
 */
export const SmartInsights = ({ data }: SmartInsightsProps) => {
  // Dados calculados para os cartões
  const insights = [
    {
      id: 1,
      title: "SUGESTÃO DE CRESCIMENTO",
      message: `Sua ocupação é de ${data?.occupancyRate ?? 0}%. É um ótimo momento para valorizar seus imóveis disponíveis.`,
      icon: LuTrendingUp,
      bg: "blue.50",
      iconColor: "blue.600",
      borderColor: "blue.100"
    },
    {
      id: 2,
      title: "AVISO FINANCEIRO",
      message: (data?.defaultRate ?? 0) > 5 
        ? "Atenção: A inadimplência subiu um pouco. Verifique os pagamentos pendentes."
        : "Tudo certo! Seus recebimentos estão estáveis e dentro do esperado.",
      icon: LuCircleAlert,
      bg: "orange.50",
      iconColor: "orange.600",
      borderColor: "orange.100"
    }
  ];

  return (
    <Box 
      w="full" 
      p={8} 
      borderRadius="3xl" 
      bg="white" 
      border="2px solid" 
      borderColor="blue.500" // Borda azul forte para guiar o olhar
      boxShadow="sm"
      mb={10}
    >
      {/* HEADER DO CARD - CORES FORTES E FONTES GRANDES */}
      <HStack mb={8} gap={5}>
        <Center 
          p={3} 
          bg="blue.600" 
          borderRadius="2xl" 
          color="white"
          boxShadow="lg"
        >
          <Icon as={LuSparkles} boxSize={8} />
        </Center>
        <VStack align="start" gap={0}>
          <Text fontWeight="900" fontSize="2xl" color="gray.900" letterSpacing="-0.5px">
            Dicas Inteligentes
          </Text>
          <Text fontSize="md" color="gray.500" fontWeight="600">
            Análise automática para facilitar sua gestão
          </Text>
        </VStack>
        <Badge 
          ml="auto" 
          colorPalette="blue" 
          variant="solid" 
          fontSize="md" 
          px={4} 
          py={1} 
          borderRadius="full"
        >
          Novo
        </Badge>
      </HStack>

      {/* GRID DE INSIGHTS - ACESSIBILIDADE TOTAL */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {insights.map((insight) => (
          <Box 
            key={insight.id}
            p={6}
            bg={insight.bg}
            borderRadius="2xl"
            border="2px solid"
            borderColor={insight.borderColor}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.01)" }}
          >
            <HStack align="start" gap={5}>
              <Center 
                p={3} 
                bg="white" 
                borderRadius="xl" 
                border="1px solid" 
                borderColor={insight.borderColor}
                boxShadow="sm"
              >
                <Icon as={insight.icon} boxSize={7} color={insight.iconColor} />
              </Center>
              <VStack align="start" gap={1}>
                <Text fontWeight="900" fontSize="sm" color="gray.800" letterSpacing="0.5px">
                  {insight.title}
                </Text>
                <Text fontSize="lg" color="gray.700" fontWeight="500" lineHeight="1.4">
                  {insight.message}
                </Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};