"use client"

import { Box, Container, VStack, Text, SimpleGrid, Icon, chakra } from "@chakra-ui/react"
import { 
  LuTriangle,      // ÍCONE DISPONÍVEL E FUNCIONAL
  LuFrown,
  LuClock4,
  LuDatabase
} from "react-icons/lu"

export default function ProblemSection() {
  return (
    <Box
      py={24}
      bg="transparent"
      position="relative"
      overflow="hidden"
    >
      {/* Luz suave de fundo */}
      <Box
        position="absolute"
        top="-150px"
        left="50%"
        transform="translateX(-50%)"
        w="900px"
        h="500px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.10), rgba(14,165,233,0.06))"
        filter="blur(140px)"
        opacity="0.4"
        zIndex={0}
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        
        {/* Título */}
        <VStack textAlign="center" gap={4} mb={14}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
            bgClip="text"
            letterSpacing="-1px"
          >
            O Problema
          </Text>

          <Text maxW="600px" fontSize="lg" color="gray.400">
            A gestão imobiliária tradicional é lenta, confusa e cheia de processos manuais.
            Isso consome tempo, energia e dinheiro — principalmente quando existe escala.
          </Text>
        </VStack>

        {/* Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
          
          <ProblemCard
            icon={LuClock4}
            title="Processos Lentos"
            text="Atividades repetitivas, planilhas manuais e retrabalho consomem horas que deveriam ser investidas em vendas e operações."
          />

          <ProblemCard
            icon={LuFrown}
            title="Experiência Ruim"
            text="Inquilinos frustrados, proprietários sem informações e equipes sobrecarregadas desistem rapidamente da imobiliária."
          />

          <ProblemCard
            icon={LuTriangle}
            title="Riscos e Erros"
            text="Falta de controle de contratos, vencimentos, pagamentos e documentos aumenta riscos legais e financeiros."
          />

          <ProblemCard
            icon={LuDatabase}
            title="Dados Descentralizados"
            text="Informações espalhadas em planilhas, grupos de WhatsApp e e‑mails tornam impossível ter previsibilidade."
          />

        </SimpleGrid>
      </Container>
    </Box>
  )
}

const ProblemCard = ({
  icon,
  title,
  text,
}: {
  icon: any
  title: string
  text: string
}) => (
  <VStack
    p={8}
    bg="rgba(255,255,255,0.03)"
    border="1px solid rgba(255,255,255,0.06)"
    rounded="2xl"
    gap={4}
    align="start"
    transition="all 0.3s ease"
    _hover={{
      transform: "translateY(-6px)",
      borderColor: "rgba(6,182,212,0.4)",
      bg: "rgba(6,182,212,0.05)",
    }}
  >
    <Icon as={icon} boxSize={8} color="cyan.300" />

    <Text fontSize="xl" fontWeight="bold">
      {title}
    </Text>

    <Text fontSize="sm" color="gray.400">
      {text}
    </Text>
  </VStack>
)