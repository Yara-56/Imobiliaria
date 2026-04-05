"use client"

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Flex,
  Image
} from "@chakra-ui/react"

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Corretor Autônomo",
    content:
      "O ImobiSys mudou a forma como gerencio meus contratos. A automação de pagamentos me economiza horas toda semana.",
    avatar: "https://bit.ly/prosper-baba",
  },
  {
    name: "Ana Oliveira",
    role: "Dona de Imobiliária",
    content:
      "A visão geral do dashboard é incrível. Consigo ver a vacância e os recebíveis em tempo real sem planilhas complexas.",
    avatar: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Marcos Souza",
    role: "Investidor Imobiliário",
    content:
      "Excelente suporte e plataforma intuitiva. O controle de inquilinos e vistorias é o mais completo que já usei.",
    avatar: "https://bit.ly/code-beast",
  },
]

export default function TestimonialsSection() {
  return (
    <Box py={{ base: 20, md: 28 }} position="relative">
      
      {/* Luz ambiente */}
      <Box
        position="absolute"
        top="-200px"
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
        <Stack gap={12} align="center" textAlign="center">
          
          {/* Título */}
          <Stack gap={4}>
            <Heading
              size="2xl"
              fontWeight="900"
              bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
              bgClip="text"
            >
              Quem usa, recomenda
            </Heading>

            <Text color="gray.300" fontSize="lg" maxW="2xl">
              Centenas de profissionais já transformaram sua gestão com nossa plataforma.
            </Text>
          </Stack>

          {/* GRID DE DEPOIMENTOS */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} w="full">
            {testimonials.map((t, index) => (
              <Stack
                key={index}
                bg="rgba(255,255,255,0.03)"
                p={8}
                rounded="2xl"
                border="1px solid rgba(255,255,255,0.06)"
                boxShadow="sm"
                transition="0.3s ease"
                _hover={{
                  transform: "translateY(-6px)",
                  borderColor: "cyan.300",
                  bg: "rgba(6,182,212,0.05)",
                }}
              >
                <Text
                  fontSize="md"
                  color="gray.300"
                  fontStyle="italic"
                  lineHeight="1.7"
                >
                  "{t.content}"
                </Text>

                <Flex align="center" gap={4} mt={6}>

                  {/* AVATAR CUSTOM */}
                  <Box
                    w="48px"
                    h="48px"
                    rounded="full"
                    overflow="hidden"
                    bg="gray.700"
                    flexShrink={0}
                  >
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>

                  <Box textAlign="left">
                    <Text fontWeight="bold" fontSize="sm">
                      {t.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {t.role}
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            ))}
          </SimpleGrid>

        </Stack>
      </Container>
    </Box>
  )
}