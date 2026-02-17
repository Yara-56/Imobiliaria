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
  LuCirclePlay 
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
      bg="#020617" 
      minH="100vh" 
      color="white" 
      position="relative"
      overflow="hidden"
    >
      {/* 🌌 Efeito de Luz no Fundo */}
      <Box 
        position="absolute" top="-150px" left="50%" transform="translateX(-50%)"
        w="600px" h="400px" bg="blue.900" opacity="0.2" filter="blur(100px)" borderRadius="full" zIndex={0}
      />

      <Container maxW="container.lg" pt={28} pb={20} position="relative" zIndex={1}>
        <Flex direction="column" align="center" textAlign="center">
          <Badge 
            bg="whiteAlpha.200" color="blue.300" variant="outline" mb={8} 
            borderRadius="full" px={4} py={1} borderColor="blue.500"
          >
            <Flex align="center" gap={2}>
              <Icon as={LuCircleCheck} boxSize={3} />
              <Text fontWeight="bold" letterSpacing="widest" fontSize="xs">IMOBISYS PRO 2026</Text>
            </Flex>
          </Badge>
          
          <Heading size="4xl" fontWeight="900" mb={6} lineHeight="1.1" fontSize={{ base: "4xl", md: "6xl" }}>
            Sua imobiliária em <br />
            <Text 
              as="span" 
              bgGradient="linear(to-r, blue.400, cyan.300)" 
              bgClip="text"
            >
              outro nível operacional
            </Text>
          </Heading>

          <Text fontSize="xl" color="gray.400" maxW="2xl" mb={12}>
            Centralize contratos, vistorias e cobranças em uma única interface 
            <Text as="span" color="white" fontWeight="bold"> intuitiva e veloz.</Text>
          </Text>

          <Stack direction={{ base: "column", md: "row" }} gap={6}>
            <Button 
              size="lg" 
              bg="blue.600"
              color="white"
              px={10} 
              borderRadius="xl" 
              h="60px"
              fontWeight="bold" 
              onClick={() => navigate("/login")}
              _hover={{ bg: "blue.500", transform: "translateY(-2px)", shadow: "dark-lg" }}
            >
              Acessar Painel 
              <Icon as={LuArrowRight} ml={2} />
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost" 
              color="whiteAlpha.800"
              h="60px"
              _hover={{ color: "blue.300", bg: "whiteAlpha.50" }}
            >
              <Icon as={LuCirclePlay} mr={2} boxSize={6} />
              Ver Demonstração
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
      transition="all 0.3s"
      _hover={{ transform: "translateY(-8px)", bg: "whiteAlpha.100", borderColor: "blue.500" }}
    >
      <Center w={12} h={12} bg="blue.500" color="white" borderRadius="xl" mb={6}>
        <Icon as={IconComponent} boxSize={6} />
      </Center>
      <Text fontWeight="bold" fontSize="lg" mb={2}>{title}</Text>
      <Text color="gray.400" fontSize="sm" lineHeight="tall">{desc}</Text>
    </Box>
  );
}