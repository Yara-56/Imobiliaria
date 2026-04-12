"use client"

import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Icon,
  Flex,
} from "@chakra-ui/react"

import {
  LuCpu,
  LuWorkflow,
  LuTrendingUp,
  LuFileCheck,
} from "react-icons/lu"

interface SolutionFeatureProps {
  icon: React.ElementType
  title: string
  text: string
}

export default function SolutionSection() {
  return (
    <Box
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      {/* Luz de fundo suave */}
      <Box
        position="absolute"
        top="-180px"
        left="50%"
        transform="translateX(-50%)"
        w="1100px"
        h="650px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.14), rgba(14,165,233,0.10))"
        filter="blur(150px)"
        opacity="0.35"
        zIndex={0}
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        
        {/* Cabeçalho */}
        <VStack textAlign="center" gap={4} mb={16}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
            bgClip="text"
          >
            A Solução
          </Text>

          <Text
            maxW="700px"
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.300"
            lineHeight="1.7"
          >
            O HomeFlux unifica todos os processos da sua imobiliária em uma única
            plataforma — reduzindo custos, eliminando retrabalho e acelerando suas operações.
          </Text>
        </VStack>

        {/* GRID DE FEATURES */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          gap={10}
        >
          <SolutionFeature
            icon={LuWorkflow}
            title="Fluxos Automatizados"
            text="Crie automações inteligentes para contratos, cobranças, vencimentos e comunicação com proprietários e inquilinos."
          />

          <SolutionFeature
            icon={LuCpu}
            title="Gestão Centralizada"
            text="Todos os imóveis, contratos, boletos, documentos e atendimentos em um só lugar, com alertas e histórico."
          />

          <SolutionFeature
            icon={LuFileCheck}
            title="Conformidade & Segurança"
            text="Mantenha sua operação sempre em dia com auditoria, rastreabilidade de dados e controle rigoroso de permissões."
          />

          <SolutionFeature
            icon={LuTrendingUp}
            title="Insights & Performance"
            text="Acompanhe KPIs, indicadores e métricas comerciais em tempo real para decisões mais rápidas e estratégicas."
          />
        </SimpleGrid>

        {/* BLOCO FINAL */}
        <Flex
          mt={20}
          bg="rgba(255,255,255,0.03)"
          border="1px solid rgba(255,255,255,0.06)"
          rounded="2xl"
          p={{ base: 8, md: 12 }}
          direction="column"
          align="center"
          textAlign="center"
          gap={6}
          _hover={{
            bg: "rgba(6,182,212,0.05)",
            borderColor: "rgba(6,182,212,0.4)",
            transform: "scale(1.01)",
            transition: "0.4s ease",
          }}
        >
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="900"
          >
            Uma plataforma projetada para escalar sua imobiliária
          </Text>

          <Text
            color="gray.400"
            maxW="650px"
            fontSize="lg"
          >
            Seja você uma imobiliária pequena, média ou grande — o HomeFlux melhora
            sua operação, aumenta sua eficiência e impulsiona sua receita.
          </Text>
        </Flex>
      </Container>
    </Box>
  )
}

const SolutionFeature = ({ icon, title, text }: SolutionFeatureProps) => (
  <VStack
    align="start"
    gap={4}
    p={8}
    bg="rgba(255,255,255,0.03)"
    border="1px solid rgba(255,255,255,0.06)"
    rounded="2xl"
    transition="all 0.3s ease"
    _hover={{
      bg: "rgba(6,182,212,0.05)",
      borderColor: "rgba(6,182,212,0.4)",
      transform: "translateY(-6px)",
    }}
  >
    <Icon as={icon} boxSize={10} color="cyan.300" />

    <Text fontSize="xl" fontWeight="bold">
      {title}
    </Text>

    <Text fontSize="sm" color="gray.400">
      {text}
    </Text>
  </VStack>
)