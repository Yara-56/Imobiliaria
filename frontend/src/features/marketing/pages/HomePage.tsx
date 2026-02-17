"use client"

import { 
  Box, Container, Heading, Text, Button, SimpleGrid, 
  Icon, Flex, Stack, Badge, Center
} from "@chakra-ui/react";
import { 
  LuShieldCheck, 
  LuZap, 
  LuTrendingUp, 
  LuClock, 
  LuArrowRight, 
  LuCircleCheck,
  LuCirclePlay // ✅ Nome corrigido para evitar o erro ts(2724)
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box 
      bg="#020617" // Um azul quase preto, mas com profundidade
      minH="100vh" 
      color="white" 
      position="relative"
      overflow="hidden"
    >
      {/* 🌌 Efeito de Luz no Fundo (para não ficar "só preto") */}
      <Box 
        position="absolute" top="-150px" left="50%" transform="translateX(-50%)"
        w="600px" h="400px" bg="blue.600/20" filter="blur(100px)" borderRadius="full" zIndex={0}
      />

      <Container maxW="container.lg" pt={28} pb={20} position="relative" zIndex={1}>
        <Flex direction="column" align="center" textAlign="center">
          <Badge 
            bg="blue.500/10" color="blue.300" variant="outline" mb={8} 
            borderRadius="full" px={4} py={1} borderColor="blue.500/30"
          >
            <Flex align="center" gap={2}>
              <LuCircleCheck size={14} />
              <Text fontWeight="bold" letterSpacing="widest" fontSize="xs">IMOBISYS PRO 2026</Text>
            </Flex>
          </Badge>
          
          <Heading size="4xl" fontWeight="900" mb={6} lineHeight="1.1" fontSize={{ base: "4xl", md: "6xl" }}>
            Sua imobiliária em <br />
            <Text 
              as="span" 
              bgGradient="to-r" gradientFrom="blue.400" gradientTo="cyan.300" 
              bgClip="text"
            >
              outro nível operacional
            </Text>
          </Heading>

          <Text fontSize="xl" color="slate.400" maxW="2xl" mb={12}>
            Centralize contratos, vistorias e cobranças em uma única interface 
            <Text as="span" color="white" fontWeight="bold"> intuitiva e veloz.</Text>
          </Text>

          <Stack direction={{ base: "column", md: "row" }} gap={6}>
            <Button 
              size="xl" colorPalette="blue" px={10} borderRadius="xl" gap={2} h="60px"
              fontWeight="bold" onClick={() => navigate("/login")}
              _hover={{ transform: "translateY(-2px)", shadow: "0 0 20px rgba(49, 130, 206, 0.4)" }}
            >
              Acessar Painel <LuArrowRight />
            </Button>
            
            <Button 
              size="xl" variant="ghost" color="whiteAlpha.800" gap={2} 
              _hover={{ color: "blue.300", bg: "whiteAlpha.50" }}
            >
              <LuCirclePlay size={24} /> Ver Demonstração
            </Button>
          </Stack>
        </Flex>

        {/* 🛠️ Grid de Features */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mt={24}>
          <FeatureCard 
            icon={LuShieldCheck} 
            title="Contratos" 
            desc="Segurança jurídica total com assinatura digital integrada." 
          />
          <FeatureCard 
            icon={LuZap} 
            title="Agilidade" 
            desc="Processos que levavam dias agora resolvidos em minutos." 
          />
          <FeatureCard 
            icon={LuTrendingUp} 
            title="Métricas" 
            desc="Dashboard completo com ROI e taxa de vacância real." 
          />
          <FeatureCard 
            icon={LuClock} 
            title="Automação" 
            desc="Régua de cobrança automática via WhatsApp e E-mail." 
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function FeatureCard({ icon: IconComponent, title, desc }: FeatureCardProps) {
  return (
    <Box 
      bg="whiteAlpha.50" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100" 
      backdropFilter="blur(10px)" transition="all 0.3s"
      _hover={{ transform: "translateY(-8px)", bg: "whiteAlpha.100", borderColor: "blue.500/50" }}
    >
      <Center w={12} h={12} bg="blue.500/20" color="blue.400" borderRadius="xl" mb={6}>
        <Icon as={IconComponent} boxSize={6} />
      </Center>
      <Text fontWeight="bold" fontSize="lg" mb={2}>{title}</Text>
      <Text color="slate.400" fontSize="sm" lineHeight="tall">{desc}</Text>
    </Box>
  );
}