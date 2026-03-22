"use client"

import { Box, SimpleGrid, Icon, Text, Stack, Heading, VStack, Badge, Flex } from "@chakra-ui/react"
import { LuShieldCheck, LuZap, LuActivity, LuClock } from "react-icons/lu"

const features = [
  {
    title: "Gestão Segura",
    desc: "Contratos e documentos protegidos com criptografia de ponta.",
    icon: LuShieldCheck,
    color: "blue",
    metric: "ISO 27001",
  },
  {
    title: "Agilidade Total",
    desc: "Automatize cobranças e vistorias em poucos cliques.",
    icon: LuZap,
    color: "yellow",
    metric: "60% mais rápido",
  },
  {
    title: "Relatórios Reais",
    desc: "Visualize sua receita e vacância em dashboards intuitivos.",
    icon: LuActivity,
    color: "green",
    metric: "Tempo real",
  },
  {
    title: "Economia de Tempo",
    desc: "Reduza o trabalho manual em até 60% logo no primeiro mês.",
    icon: LuClock,
    color: "purple",
    metric: "40h/mês economizadas",
  },
]

export const FeaturesSection = () => {
  return (
    <Box py={16}>
      <VStack gap={12} mb={12}>
        <VStack gap={4} textAlign="center">
          <Badge
            bg="rgba(6, 182, 212, 0.15)"
            color="cyan.300"
            variant="outline"
            borderRadius="full"
            px={4}
            py={2}
            borderColor="cyan.400"
            fontSize="xs"
            fontWeight="bold"
          >
            RECURSOS
          </Badge>
          <Heading size="2xl" fontSize="3xl" fontWeight="bold">
            Tudo que você precisa em uma plataforma
          </Heading>
          <Text color="gray.600" maxW="2xl" fontSize="lg">
            HomeFlux oferece todas as ferramentas para automatizar e profissionalizar sua imobiliária
          </Text>
        </VStack>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

function FeatureCard({
  feature,
}: {
  feature: {
    title: string
    desc: string
    icon: React.ElementType
    color: string
    metric: string
  }
}) {
  const colorMap: any = {
    blue: { bg: "rgba(59, 130, 246, 0.1)", icon: "blue.400", border: "blue.200" },
    yellow: { bg: "rgba(251, 191, 36, 0.1)", icon: "yellow.400", border: "yellow.200" },
    green: { bg: "rgba(34, 197, 94, 0.1)", icon: "green.400", border: "green.200" },
    purple: { bg: "rgba(168, 85, 247, 0.1)", icon: "purple.400", border: "purple.200" },
  }

  const colors = colorMap[feature.color]

  return (
    <Stack
      gap={4}
      p={6}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={colors.border}
      bg="white"
      transition="all 0.3s ease"
      _hover={{
        shadow: "lg",
        borderColor: colors.icon,
        transform: "translateY(-4px)",
      }}
      h="full"
    >
      <Flex justify="space-between" align="flex-start">
        <Box color={colors.icon} bg={colors.bg} w="fit-content" p={3} borderRadius="lg">
          <Icon as={feature.icon} boxSize={6} />
        </Box>
        <Badge bg={colors.bg} color={colors.icon} fontSize="xs" fontWeight="bold" borderRadius="md">
          {feature.metric}
        </Badge>
      </Flex>

      <VStack gap={2} align="start" flex={1}>
        <Heading size="md" fontWeight="bold" color="gray.900">
          {feature.title}
        </Heading>
        <Text color="gray.600" fontSize="sm" lineHeight="1.6">
          {feature.desc}
        </Text>
      </VStack>
    </Stack>
  )
}