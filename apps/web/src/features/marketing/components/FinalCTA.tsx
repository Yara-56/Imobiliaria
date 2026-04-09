"use client"

import {
  Box,
  Container,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react.js"

interface FinalCTAProps {
  onLeadCapture?: () => void
}

export default function FinalCTA({ onLeadCapture }: FinalCTAProps) {
  return (
    <Box
      py={{ base: 24, md: 32 }}
      position="relative"
      overflow="hidden"
    >
      {/* Luz ambiente premium */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="1200px"
        h="800px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(14,165,233,0.10))"
        filter="blur(200px)"
        opacity="0.45"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        <VStack gap={6} textAlign="center">
          
          {/* Headline principal */}
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            lineHeight="1.1"
            bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
            bgClip="text"
            maxW="800px"
          >
            Pronto para elevar sua imobiliária para o próximo nível?
          </Text>

          {/* Subheadline */}
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.300"
            maxW="650px"
            lineHeight="1.7"
          >
            O HomeFlux já está transformando a forma como mais de{" "}
            <Text as="span" color="cyan.300" fontWeight="bold">
              450 imobiliárias
            </Text>{" "}
            operam. Junte-se às empresas que trabalham com precisão,
            velocidade e eficiência de verdade.
          </Text>

          {/* CTA */}
          <Button
            size="lg"
            px={14}
            h="64px"
            fontWeight="extrabold"
            fontSize="xl"
            rounded="2xl"
            color="white"
            onClick={onLeadCapture}
            bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "0 25px 50px rgba(6,182,212,0.35)",
              bg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            }}
            transition="all 0.25s ease"
          >
            Começar Agora — Sem Compromisso
          </Button>

          {/* Texto final */}
          <Text fontSize="sm" color="gray.500">
            Leva menos de 2 minutos. Não pedimos cartão de crédito.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}