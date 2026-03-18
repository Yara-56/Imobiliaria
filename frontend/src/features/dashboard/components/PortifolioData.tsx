"use client";

import React from "react";
import { Box, HStack, VStack, Text, Icon, Progress } from "@chakra-ui/react";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuDollarSign,
  LuAlertTriangle,
  LuCheckCircle,
} from "react-icons/lu";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════
// MOCK DATA (substitua pelos dados reais do seu hook)
// ═══════════════════════════════════════════════════════════════════════

const portfolioData = {
  totalValue: 1250000,
  monthlyRevenue: 45000,
  occupancyRate: 85,
  healthScore: 78, // 0-100
  metrics: [
    {
      label: "Ocupação",
      value: 85,
      target: 90,
      status: "good" as const,
      trend: 5,
    },
    {
      label: "Inadimplência",
      value: 8,
      target: 5,
      status: "warning" as const,
      trend: -2,
    },
    {
      label: "ROI Médio",
      value: 6.5,
      target: 7,
      status: "good" as const,
      trend: 0.5,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function PortfolioHealth() {
  const { totalValue, monthlyRevenue, occupancyRate, healthScore, metrics } = portfolioData;

  // Determina cor do health score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "green.500", label: "Excelente" };
    if (score >= 60) return { bg: "blue.500", label: "Bom" };
    if (score >= 40) return { bg: "orange.500", label: "Regular" };
    return { bg: "red.500", label: "Atenção" };
  };

  const scoreColor = getScoreColor(healthScore);

  const fmt = {
    currency: (v: number) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v),
    compact: (v: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: "compact",
      }).format(v),
    pct: (v: number) => `${v.toFixed(1)}%`,
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={6}
      border="1px solid"
      borderColor="gray.100"
      w="full"
      h="full"
    >
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <VStack align="start" gap={0}>
          <Text fontSize="11px" fontWeight="800" color="gray.400" letterSpacing="0.08em" textTransform="uppercase">
            Saúde do Portfólio
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="gray.900" letterSpacing="-0.5px">
            {healthScore}
            <Text as="span" fontSize="sm" color="gray.400" fontWeight="600" ml={1}>
              / 100
            </Text>
          </Text>
        </VStack>

        {/* Badge de status */}
        <Box
          px={3}
          py={1.5}
          borderRadius="full"
          bg={`${scoreColor.bg.replace("500", "50")}`}
          border="1px solid"
          borderColor={`${scoreColor.bg.replace("500", "200")}`}
        >
          <Text fontSize="11px" fontWeight="800" color={scoreColor.bg} letterSpacing="0.05em">
            {scoreColor.label}
          </Text>
        </Box>
      </HStack>

      {/* Progress Bar */}
      <Box mb={6}>
        <Progress.Root value={healthScore} size="lg" borderRadius="full" colorPalette="green">
          <Progress.Track bg="gray.100">
            <Progress.Range bg={scoreColor.bg} />
          </Progress.Track>
        </Progress.Root>
      </Box>

      {/* Métricas principais */}
      <VStack gap={4} align="stretch" mb={5}>
        <HStack justify="space-between">
          <VStack align="start" gap={0}>
            <Text fontSize="10px" color="gray.400" fontWeight="700" textTransform="uppercase">
              Valor Total
            </Text>
            <Text fontSize="lg" fontWeight="800" color="gray.900">
              {fmt.compact(totalValue)}
            </Text>
          </VStack>
          <Icon as={LuDollarSign} boxSize={5} color="green.500" />
        </HStack>

        <HStack justify="space-between">
          <VStack align="start" gap={0}>
            <Text fontSize="10px" color="gray.400" fontWeight="700" textTransform="uppercase">
              Receita Mensal
            </Text>
            <Text fontSize="lg" fontWeight="800" color="gray.900">
              {fmt.currency(monthlyRevenue)}
            </Text>
          </VStack>
          <Icon as={LuTrendingUp} boxSize={5} color="blue.500" />
        </HStack>
      </VStack>

      {/* Divisor */}
      <Box h="1px" bg="gray.100" my={5} />

      {/* Métricas detalhadas */}
      <VStack gap={4} align="stretch">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
          >
            <Box>
              <HStack justify="space-between" mb={2}>
                <HStack gap={2}>
                  <Icon
                    as={metric.status === "good" ? LuCheckCircle : LuAlertTriangle}
                    boxSize={4}
                    color={metric.status === "good" ? "green.500" : "orange.500"}
                  />
                  <Text fontSize="xs" fontWeight="700" color="gray.600">
                    {metric.label}
                  </Text>
                </HStack>

                <HStack gap={2}>
                  <Text fontSize="xs" fontWeight="800" color="gray.800">
                    {metric.label === "ROI Médio" ? `${metric.value}%` : fmt.pct(metric.value)}
                  </Text>
                  <Icon
                    as={metric.trend >= 0 ? LuTrendingUp : LuTrendingDown}
                    boxSize={3}
                    color={metric.trend >= 0 ? "green.500" : "red.500"}
                  />
                </HStack>
              </HStack>

              {/* Barra de progresso da métrica */}
              <Box h="4px" bg="gray.100" borderRadius="full" overflow="hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: idx * 0.15 }}
                  style={{
                    height: "100%",
                    background:
                      metric.status === "good"
                        ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                    borderRadius: "inherit",
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        ))}
      </VStack>

      {/* Footer com dica */}
      <Box mt={5} p={3} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.100">
        <Text fontSize="11px" color="blue.700" fontWeight="600" lineHeight="1.5">
          💡 Dica: Reduza a inadimplência para melhorar o score geral
        </Text>
      </Box>
    </Box>
  );
}
