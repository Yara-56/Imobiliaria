"use client"

import { ElementType } from "react"
import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Icon,
  Flex,
  Button,
} from "@chakra-ui/react"

import {
  LuBookOpen,
  LuChartLine,
  LuLayers,
  LuClipboardList,
} from "react-icons/lu"

interface EducationSectionProps {
  onLeadCapture?: () => void
}

interface EducationCardProps {
  icon: ElementType
  title: string
  text: string
}

export default function EducationSection({ onLeadCapture }: EducationSectionProps) {
  return (
    <Box py={{ base: 20, md: 28 }} position="relative" overflow="hidden">
      {/* Fundo suave */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="1100px"
        h="700px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.13), rgba(14,165,233,0.08))"
        filter="blur(160px)"
        opacity="0.32"
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
            Aprenda o que realmente importa
          </Text>

          <Text
            maxW="700px"
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.300"
            lineHeight="1.7"
          >
            Conteúdos exclusivos para transformar imobiliárias em operações digitais,
            eficientes e altamente lucrativas.
          </Text>
        </VStack>

        {/* Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
          <EducationCard
            icon={LuBookOpen}
            title="Guia de Digitalização"
            text="Aprenda como modernizar processos e eliminar retrabalhos rapidamente."
          />

          <EducationCard
            icon={LuChartLine}
            title="Estratégias de Escala"
            text="Técnicas usadas pelas imobiliárias que mais crescem no Brasil."
          />

          <EducationCard
            icon={LuLayers}
            title="Modelos Operacionais"
            text="Organize equipes, tarefas e processos como empresas de alto nível."
          />

          <EducationCard
            icon={LuClipboardList}
            title="Checklist de Eficiência"
            text="Os 12 passos essenciais para transformar sua imobiliária em 30 dias."
          />
        </SimpleGrid>

        {/* CTA final */}
        <Flex justify="center" mt={16}>
          <Button
            size="lg"
            bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
            color="white"
            px={10}
            h="56px"
            rounded="xl"
            fontWeight="bold"
            fontSize="lg"
            onClick={onLeadCapture}
            _hover={{
              transform: "translateY(-3px)",
              boxShadow: "0 20px 40px rgba(6,182,212,0.35)",
              bg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            }}
            transition="all 0.3s ease"
          >
            Quero receber esses materiais
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

const EducationCard = ({ icon, title, text }: EducationCardProps) => (
  <VStack
    align="start"
    p={8}
    bg="rgba(255,255,255,0.03)"
    border="1px solid rgba(255,255,255,0.06)"
    rounded="2xl"
    gap={4}
    transition="0.3s ease"
    _hover={{
      transform: "translateY(-6px)",
      bg: "rgba(6,182,212,0.05)",
      borderColor: "rgba(6,182,212,0.4)",
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