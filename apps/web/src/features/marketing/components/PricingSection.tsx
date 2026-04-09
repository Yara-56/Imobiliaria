"use client"

import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Flex,
  Button,
} from "@chakra-ui/react.js"

interface PricingSectionProps {
  onLeadCapture?: () => void
}

export default function PricingSection({ onLeadCapture }: PricingSectionProps) {
  return (
    <Box py={{ base: 24, md: 32 }} position="relative" overflow="hidden">
      
      {/* Luz ambiente */}
      <Box
        position="absolute"
        top="-220px"
        left="50%"
        transform="translateX(-50%)"
        w="1200px"
        h="800px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(14,165,233,0.10))"
        filter="blur(200px)"
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
            Escolha o plano ideal para sua imobiliária
          </Text>

          <Text maxW="750px" fontSize="lg" color="gray.300">
            Preços simples. Transforma sua operação. Aumenta sua eficiência.
            Cresce junto com você.
          </Text>
        </VStack>

        {/* PLANOS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          
          {/* Plano Starter */}
          <PriceCard
            title="Starter"
            price="R$ 49/mês"
            description="Perfeito para pequenas imobiliárias que querem iniciar na gestão moderna."
            features={[
              "Até 50 imóveis",
              "Gestão de contratos",
              "Gestão de documentos",
              "Atendimento centralizado",
              "Exportação básica"
            ]}
            buttonLabel="Começar Agora"
            highlight={false}
            onLeadCapture={onLeadCapture}
          />

          {/* Plano Pro (destacado) */}
          <PriceCard
            title="Pro"
            price="R$ 129/mês"
            description="A escolha das imobiliárias que querem escala, automação e inteligência."
            features={[
              "Imóveis ilimitados",
              "Fluxos automatizados",
              "Dashboard avançado",
              "Gestão financeira",
              "Controle multi-equipe",
              "Prioridade no suporte"
            ]}
            highlight={true}
            buttonLabel="Quero este plano"
            onLeadCapture={onLeadCapture}
          />

          {/* Plano Enterprise */}
          <PriceCard
            title="Enterprise"
            price="Sob consulta"
            description="Para grandes operações que precisam de integrações, customizações e SLA."
            features={[
              "Suporte dedicado",
              "Integrações sob medida",
              "Recursos avançados",
              "Consultoria operacional",
              "Acesso premium ao roadmap"
            ]}
            highlight={false}
            buttonLabel="Falar com consultor"
            onLeadCapture={onLeadCapture}
          />

        </SimpleGrid>

      </Container>
    </Box>
  )
}


interface PriceCardProps {
  title: string
  price: string
  description: string
  features: string[]
  highlight: boolean
  buttonLabel: string
  onLeadCapture?: () => void
}

const PriceCard = ({
  title,
  price,
  description,
  features,
  highlight,
  buttonLabel,
  onLeadCapture
}: PriceCardProps) => (
  <Flex
    direction="column"
    p={10}
    rounded="2xl"
    border="1px solid rgba(255,255,255,0.06)"
    bg={highlight ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)"}
    transform={highlight ? "scale(1.06)" : "scale(1)"}
    transition="0.3s ease"
    _hover={{
      transform: highlight ? "scale(1.07)" : "translateY(-6px)",
      borderColor: "cyan.300",
      bg: highlight ? "rgba(6,182,212,0.10)" : "rgba(6,182,212,0.05)",
    }}
    gap={6}
  >

    {/* Título */}
    <Text fontSize="2xl" fontWeight="bold">
      {title}
    </Text>

    {/* Preço */}
    <Text
      fontSize="4xl"
      fontWeight="900"
      bgGradient="linear(to-r,#06b6d4,#0ea5e9)"
      bgClip="text"
    >
      {price}
    </Text>

    {/* Descrição */}
    <Text fontSize="sm" color="gray.300" lineHeight="1.6">
      {description}
    </Text>

    {/* Lista de features */}
    <VStack align="start" gap={3} mt={4}>
      {features.map((item, idx) => (
        <Text key={idx} fontSize="sm" color="gray.200">
          • {item}
        </Text>
      ))}
    </VStack>

    {/* CTA */}
    <Button
      size="lg"
      mt={6}
      bg="linear-gradient(135deg,#06b6d4,#0ea5e9)"
      color="white"
      h="56px"
      rounded="xl"
      fontWeight="bold"
      fontSize="lg"
      onClick={onLeadCapture}
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "0 18px 30px rgba(6,182,212,0.35)",
        bg: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
      }}
      transition="all 0.25s ease"
    >
      {buttonLabel}
    </Button>

  </Flex>
)