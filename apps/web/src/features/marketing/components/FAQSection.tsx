"use client"

import { useState } from "react"
import {
  Box,
  Container,
  VStack,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react.js"
import { LuChevronDown } from "react-icons/lu"

interface FAQSectionProps {
  onLeadCapture?: () => void
}

const faqs = [
  {
    q: "O HomeFlux funciona para qualquer tamanho de imobiliária?",
    a: "Sim. O sistema se adapta desde pequenas imobiliárias até grandes redes com milhares de imóveis.",
  },
  {
    q: "Posso migrar aos poucos do meu sistema atual?",
    a: "Sim. Você pode usar o HomeFlux em paralelo e migrar gradualmente, sem interromper sua operação.",
  },
  {
    q: "É difícil de usar?",
    a: "Não. O HomeFlux é simples, rápido e intuitivo. Em minutos sua operação já fica organizada.",
  },
  {
    q: "Os dados são realmente seguros?",
    a: "Sim. Utilizamos criptografia, auditoria, permissões avançadas e backups automáticos.",
  },
]

export default function FAQSection({ onLeadCapture }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Box py={{ base: 20, md: 28 }} position="relative">

      {/* Fundo suave */}
      <Box
        position="absolute"
        top="-220px"
        left="50%"
        transform="translateX(-50%)"
        w="1100px"
        h="700px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.14), rgba(14,165,233,0.10))"
        filter="blur(160px)"
        opacity="0.35"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>

        {/* Cabeçalho */}
        <VStack textAlign="center" gap={4} mb={16}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            bgGradient="linear(to-r,#06b6d4,#0ea5e9)"
            bgClip="text"
          >
            Perguntas Frequentes
          </Text>

          <Text maxW="700px" fontSize="lg" color="gray.300">
            Tire suas dúvidas antes de transformar sua operação com o HomeFlux.
          </Text>
        </VStack>

        {/* LISTA FAQ — Custom Accordion */}
        <VStack gap={4}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <Box
                key={index}
                w="100%"
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.06)"
                rounded="xl"
                overflow="hidden"
                transition="all 0.25s ease"
                _hover={{ borderColor: "cyan.300" }}
              >
                {/* Cabeçalho da pergunta */}
                <Flex
                  align="center"
                  justify="space-between"
                  p={6}
                  cursor="pointer"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {faq.q}
                  </Text>

                  <Box
                    as={LuChevronDown}
                    boxSize={5}
                    color="cyan.300"
                    transition="0.3s ease"
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                  />
                </Flex>

                {/* Resposta expandida */}
                <Box
                  px={6}
                  pb={isOpen ? 6 : 0}
                  maxHeight={isOpen ? "200px" : "0px"}
                  overflow="hidden"
                  transition="all 0.35s ease"
                  color="gray.400"
                  fontSize="sm"
                  lineHeight="1.7"
                >
                  {faq.a}
                </Box>
              </Box>
            )
          })}
        </VStack>

        {/* CTA final */}
        <VStack mt={14}>
          <Button
            size="lg"
            bg="linear-gradient(135deg,#06b6d4,#0ea5e9)"
            color="white"
            px={12}
            h="58px"
            fontWeight="bold"
            rounded="xl"
            fontSize="lg"
            onClick={onLeadCapture}
            _hover={{
              transform: "translateY(-3px)",
              boxShadow: "0 20px 40px rgba(6,182,212,0.35)",
              bg: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
            }}
            transition="all 0.3s ease"
          >
            Ainda com dúvidas? Fale com um especialista
          </Button>
        </VStack>

      </Container>
    </Box>
  )
}