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
} from "@chakra-ui/react.js";
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
 * SmartInsights - Versão Compacta e Proporcional
 */
export const SmartInsights = ({ data }: SmartInsightsProps) => {
  // Dados calculados para os cartões
  const insights = [
    {
      id: 1,
      title: "Sugestão de Crescimento",
      message: `Sua ocupação é de ${data?.occupancyRate ?? 0}%. É um ótimo momento para valorizar seus imóveis disponíveis.`,
      icon: LuTrendingUp,
      bg: "blue.50",
      iconColor: "blue.600",
      borderColor: "blue.100"
    },
    {
      id: 2,
      title: "Aviso Financeiro",
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
      p={5} 
      borderRadius="2xl" 
      bg="white" 
      border="1px solid" 
      borderColor="blue.200"
      boxShadow="sm"
      mb={8}
    >
      {/* HEADER DO CARD */}
      <HStack mb={5} gap={3}>
        <Center 
          p={2} 
          bg="blue.600" 
          borderRadius="xl" 
          color="white"
          boxShadow="sm"
        >
          <Icon as={LuSparkles} boxSize={5} />
        </Center>
        <VStack align="start" gap={0}>
          <Text fontWeight="700" fontSize="lg" color="gray.900">
            Dicas Inteligentes
          </Text>
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            Análise automática para facilitar sua gestão
          </Text>
        </VStack>
        <Badge 
          ml="auto" 
          colorPalette="blue" 
          variant="solid" 
          fontSize="xs" 
          px={3} 
          py={1} 
          borderRadius="full"
        >
          Novo
        </Badge>
      </HStack>

      {/* GRID DE INSIGHTS */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {insights.map((insight) => (
          <Box 
            key={insight.id}
            p={4}
            bg={insight.bg}
            borderRadius="xl"
            border="1px solid"
            borderColor={insight.borderColor}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.01)" }}
          >
            <HStack align="start" gap={3}>
              <Center 
                p={2} 
                bg="white" 
                borderRadius="lg" 
                border="1px solid" 
                borderColor={insight.borderColor}
                boxShadow="sm"
                flexShrink={0}
              >
                <Icon as={insight.icon} boxSize={5} color={insight.iconColor} />
              </Center>
              <VStack align="start" gap={0.5}>
                <Text fontWeight="700" fontSize="xs" color="gray.800" letterSpacing="wide" textTransform="uppercase">
                  {insight.title}
                </Text>
                <Text fontSize="sm" color="gray.700" fontWeight="500" lineHeight="1.5">
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