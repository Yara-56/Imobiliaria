"use client"

import { Stack, Heading, Text, Button, Box, Icon, Flex, VStack, HStack, Badge } from "@chakra-ui/react.js"
import { useNavigate } from "react-router-dom"
import { LuArrowRight, LuTrendingUp, LuUsers, LuActivity, LuClock } from "react-icons/lu"
import { useState, useEffect } from "react"

interface CTASectionProps {
  isAuthenticated?: boolean
  onLeadCapture?: () => void
}

export const CTASection = ({ isAuthenticated = false, onLeadCapture }: CTASectionProps) => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({ users: 0, satisfaction: 0, timesSaved: 0, roi: 0 })

  // Animação de contadores
  useEffect(() => {
    const intervals = [
      setInterval(() => setMetrics(m => ({ ...m, users: Math.min(m.users + 15, 2847) })), 50),
      setInterval(() => setMetrics(m => ({ ...m, satisfaction: Math.min(m.satisfaction + 1.2, 98) })), 80),
      setInterval(() => setMetrics(m => ({ ...m, timesSaved: Math.min(m.timesSaved + 8, 1240) })), 60),
      setInterval(() => setMetrics(m => ({ ...m, roi: Math.min(m.roi + 2.5, 340) })), 70),
    ]
    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <Box
      bg="linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.08))"
      border="2px solid"
      borderColor="rgba(6, 182, 212, 0.3)"
      p={12}
      borderRadius="3xl"
      color="white"
      textAlign="center"
      my={10}
    >
      <VStack gap={8}>
        {/* Métricas em Tempo Real */}
        <VStack gap={4} w="full">
          <Badge
            bg="rgba(6, 182, 212, 0.2)"
            color="cyan.300"
            variant="outline"
            borderRadius="full"
            px={4}
            py={2}
            borderColor="cyan.400"
            fontSize="xs"
            fontWeight="bold"
          >
            MÉTRICAS EM TEMPO REAL
          </Badge>

          <Flex gap={6} justify="center" flexWrap="wrap" w="full">
            <MetricCard
              icon={LuUsers}
              value={Math.floor(metrics.users)}
              label="Imobiliárias Ativas"
              suffix="+"
            />
            <MetricCard
              icon={LuActivity}
              value={metrics.satisfaction.toFixed(0)}
              label="Taxa de Satisfação"
              suffix="%"
            />
            <MetricCard
              icon={LuClock}
              value={Math.floor(metrics.timesSaved)}
              label="Horas Economizadas"
              suffix="h"
            />
            <MetricCard
              icon={LuTrendingUp}
              value={Math.floor(metrics.roi)}
              label="ROI Médio"
              suffix="%"
            />
          </Flex>
        </VStack>

        {/* CTA Principal */}
        <Stack gap={6} align="center" w="full" pt={4}>
          <Heading size="2xl" fontWeight="bold" fontSize={{ base: "2xl", md: "3xl" }}>
            Pronto para transformar sua gestão?
          </Heading>

          <Text fontSize="lg" opacity={0.9} maxW="2xl" color="gray.300">
            Junte-se a centenas de imobiliárias que já digitalizaram seus processos e aumentaram lucros em até 340%.
          </Text>

          <Flex gap={4} flexWrap="wrap" justify="center" pt={4}>
            <Button
              size="lg"
              bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
              color="white"
              px={10}
              h="56px"
              borderRadius="xl"
              fontWeight="bold"
              onClick={() => navigate(isAuthenticated ? "/admin/dashboard" : "/login")}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
              }}
              transition="all 0.3s ease"
            >
              {isAuthenticated ? "Ir para o Painel" : "Começar Agora"}
              <Icon as={LuArrowRight} ml={2} />
            </Button>

            <Button
              size="lg"
              variant="outline"
              color="cyan.300"
              borderColor="cyan.400"
              h="56px"
              borderRadius="xl"
              fontWeight="bold"
              onClick={onLeadCapture}
              _hover={{
                bg: "rgba(6, 182, 212, 0.1)",
                borderColor: "cyan.300",
              }}
              transition="all 0.3s ease"
            >
              Agendar Consultoria
            </Button>
          </Flex>

          <Text fontSize="sm" color="gray.400" pt={2}>
            ✓ Sem cartão de crédito | ✓ 14 dias grátis | ✓ Suporte 24/7
          </Text>
        </Stack>
      </VStack>
    </Box>
  )
}

// Componente de Métrica Individual
function MetricCard({
  icon: IconComponent,
  value,
  label,
  suffix,
}: {
  icon: React.ElementType
  value: number | string
  label: string
  suffix: string
}) {
  return (
    <VStack
      gap={2}
      p={6}
      bg="rgba(6, 182, 212, 0.1)"
      border="1px solid"
      borderColor="rgba(6, 182, 212, 0.2)"
      borderRadius="xl"
      minW="140px"
      transition="all 0.3s ease"
      _hover={{
        bg: "rgba(6, 182, 212, 0.15)",
        borderColor: "rgba(6, 182, 212, 0.4)",
        transform: "translateY(-4px)",
      }}
    >
      <Icon as={IconComponent} boxSize={6} color="cyan.300" />
      <HStack gap={0}>
        <Text fontSize="2xl" fontWeight="bold" color="cyan.300">
          {value}
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="cyan.300">
          {suffix}
        </Text>
      </HStack>
      <Text fontSize="xs" color="gray.400" textAlign="center">
        {label}
      </Text>
    </VStack>
  )
}