"use client"

import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react.js"

import { LuQuote, LuArrowRight } from "react-icons/lu"

interface CaseStudiesSectionProps {
  onLeadCapture?: () => void
}

interface CaseCardProps {
  company: string
  result: string
  description: string
  author: string
}

export default function CaseStudiesSection({ onLeadCapture }: CaseStudiesSectionProps) {
  return (
    <Box py={{ base: 20, md: 28 }} position="relative" overflow="hidden">
      
      {/* Fundo premium */}
      <Box
        position="absolute"
        top="-220px"
        left="50%"
        transform="translateX(-50%)"
        w="1200px"
        h="700px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.14), rgba(14,165,233,0.10))"
        filter="blur(170px)"
        opacity="0.28"
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
            Histórias de Sucesso
          </Text>

          <Text
            maxW="700px"
            fontSize="lg"
            color="gray.300"
            lineHeight="1.7"
          >
            Imobiliárias que transformaram suas operações com o HomeFlux.
          </Text>
        </VStack>

        {/* GRID DE CASES */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10}>
          <CaseCard
            company="BlueKey Imobiliária"
            result="+47% em contratos fechados"
            description="Com automações e centralização de dados, a BlueKey conseguiu acelerar seu ciclo de vendas e eliminar erros operacionais."
            author="Marcos S., Diretor Comercial"
          />

          <CaseCard
            company="Morada SP"
            result="–32h de retrabalho por semana"
            description="O time eliminou processos manuais e passou a controlar contratos e documentos com precisão e alertas automáticos."
            author="Jéssica Almeida, COO"
          />

          <CaseCard
            company="PrimeVille"
            result="Crescimento de 3.1x em atendimento"
            description="Com fluxo de atendimento organizado e previsível, a PrimeVille aumentou expressivamente a conversão de leads."
            author="Carlos F., Head de Operações"
          />
        </SimpleGrid>

        {/* CTA Final */}
        <Flex justify="center" mt={16}>
          <Button
            size="lg"
            bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
            color="white"
            px={10}
            h="58px"
            borderRadius="xl"
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
            Quero resultados como esses
            <Icon as={LuArrowRight} ml={2} />
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

const CaseCard = ({ company, result, description, author }: CaseCardProps) => (
  <Flex
    direction="column"
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
    <Icon as={LuQuote} color="cyan.300" boxSize={8} opacity={0.7} />

    <Text fontSize="lg" fontWeight="bold" color="cyan.300">
      {company}
    </Text>

    <Text fontSize="xl" fontWeight="900">
      {result}
    </Text>

    <Text fontSize="sm" color="gray.400">
      {description}
    </Text>

    <Text fontSize="xs" color="gray.500" mt={4}>
      — {author}
    </Text>
  </Flex>
)