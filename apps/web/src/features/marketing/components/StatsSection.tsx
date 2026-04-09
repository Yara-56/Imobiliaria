"use client"

import { Box, Container, SimpleGrid, Stack, Text, Heading } from "@chakra-ui/react.js"

const stats = [
  { label: "Imóveis Gerenciados", value: "10k+" },
  { label: "Transações em 2025", value: "R$ 500M" },
  { label: "Imobiliárias Ativas", value: "450+" },
  { label: "Tempo Economizado", value: "30h/mês" },
]

export default function StatsSection() {
  return (
    <Box py={{ base: 20, md: 28 }} position="relative" overflow="hidden">
      
      {/* Luz ambiente premium */}
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
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        <Box
          bg="rgba(255,255,255,0.03)"
          border="1px solid rgba(255,255,255,0.08)"
          rounded="3xl"
          p={{ base: 10, md: 14 }}
          backdropFilter="blur(10px)"
          transition="0.3s ease"
          _hover={{ borderColor: "cyan.300" }}
        >
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={10}>
            {stats.map((stat) => (
              <Stack key={stat.label} align="center" textAlign="center">
                
                <Heading
                  size="2xl"
                  fontWeight="900"
                  bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
                  bgClip="text"
                >
                  {stat.value}
                </Heading>

                <Text
                  fontSize="sm"
                  opacity={0.8}
                  fontWeight="medium"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  {stat.label}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
}