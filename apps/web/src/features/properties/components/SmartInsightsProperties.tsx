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
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react.js";

import {
  LuTrendingUp,
  LuSparkles,
  LuLightbulb,
  LuBuilding2,
  LuWrench,
  LuCalendarClock,
} from "react-icons/lu";

import { motion } from "framer-motion";
import { usePropertyInsights } from "../hooks/usePropertyInsights";

// Motion
const MotionBox = motion(Box);
const MotionCenter = motion(Center);
const MotionHStack = motion(HStack);

export const SmartInsightsProperties = () => {
  const { insights: data, isLoading } = usePropertyInsights();

  if (isLoading)
    return (
      <Center py={10}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );

  const occupancyRate = data?.occupancyRate ?? 0;
  const available = data?.available ?? 0;
  const maintenance = data?.maintenance ?? 0;
  const totalRentValue = data?.totalRentValue ?? 0;
  const lowDemandProperties = data?.lowDemandProperties ?? 0;
  const soonExpiringContracts = data?.soonExpiringContracts ?? 0;

  // 🧠 Inteligência contextual real
  const insights = [
    {
      id: 1,
      title: "Ocupação Atual do Portfólio",
      message:
        occupancyRate >= 85
          ? `Sua taxa de ocupação é ${occupancyRate}%. Excelente — seu portfólio está sendo muito bem aproveitado.`
          : `Taxa de ocupação de ${occupancyRate}%. Considere campanhas para reduzir imóveis vagos.`,
      icon: LuTrendingUp,
      bg: "blue.50",
      iconColor: "blue.600",
      borderColor: "blue.200",
    },

    {
      id: 2,
      title: "Imóveis com Baixa Rotatividade",
      message:
        lowDemandProperties > 0
          ? `${lowDemandProperties} imóveis estão há muito tempo sem alugar. Revise fotos, preço e visibilidade.`
          : "Nenhum imóvel com baixa demanda — excelente desempenho!",
      icon: LuBuilding2,
      bg: "green.50",
      iconColor: "green.600",
      borderColor: "green.200",
    },

    {
      id: 3,
      title: "Manutenções Pendentes",
      message:
        maintenance > 0
          ? `${maintenance} imóveis estão em manutenção. Reparos rápidos reduzem vacância.`
          : "Nenhuma manutenção pendente — operação saudável.",
      icon: LuWrench,
      bg: "orange.50",
      iconColor: "orange.600",
      borderColor: "orange.200",
    },

    {
      id: 4,
      title: "Contratos Próximos ao Vencimento",
      message:
        soonExpiringContracts > 0
          ? `${soonExpiringContracts} contratos vencem nos próximos 60 dias. Antecipe negociações.`
          : "Nenhum contrato prestes a vencer.",
      icon: LuCalendarClock,
      bg: "purple.50",
      iconColor: "purple.600",
      borderColor: "purple.200",
    },

    {
      id: 5,
      title: "Performance Financeira",
      message:
        totalRentValue > 0
          ? `Sua carteira gera R$ ${totalRentValue} mensais. Avalie reajustes e renovações estratégicas.`
          : "Nenhuma receita ativa registrada.",
      icon: LuLightbulb,
      bg: "yellow.50",
      iconColor: "yellow.700",
      borderColor: "yellow.300",
    },
  ];

  return (
    <MotionBox
      w="full"
      p={6}
      borderRadius="2xl"
      bg="white"
      border="1px solid"
      borderColor="blue.200"
      boxShadow="md"
      mb={10}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* HEADER */}
      <MotionHStack
        mb={6}
        gap={3}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <MotionCenter
          p={2}
          bg="blue.600"
          borderRadius="xl"
          color="white"
          whileHover={{ scale: 1.1 }}
        >
          <Icon as={LuSparkles} boxSize={5} />
        </MotionCenter>

        <VStack align="start" gap={0}>
          <Text fontWeight="800" fontSize="lg" color="gray.900">
            Smart Insights
          </Text>
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            Análise automática e integrada ao backend
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
          IA Operacional
        </Badge>
      </MotionHStack>

      {/* INSIGHTS GRID */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        {insights.map((ins, i) => (
          <MotionBox
            key={ins.id}
            p={5}
            bg={ins.bg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={ins.borderColor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.1 }}
            whileHover={{
              scale: 1.015,
              translateY: -3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <HStack align="start" gap={4}>
              <Center
                p={2}
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor={ins.borderColor}
                shadow="sm"
              >
                <Icon as={ins.icon} boxSize={5} color={ins.iconColor} />
              </Center>

              <VStack align="start" gap={1}>
                <Text
                  fontWeight="800"
                  fontSize="xs"
                  color="gray.800"
                  textTransform="uppercase"
                >
                  {ins.title}
                </Text>

                <Text fontSize="sm" color="gray.700" fontWeight="500">
                  {ins.message}
                </Text>
              </VStack>
            </HStack>
          </MotionBox>
        ))}
      </SimpleGrid>
    </MotionBox>
  );
};