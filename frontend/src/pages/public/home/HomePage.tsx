import React from "react";
import { 
  Box, Container, Heading, Text, Button, Stack, SimpleGrid, 
  Icon, VStack, HStack, Badge, Link
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Building2, ShieldCheck, BarChart3, ArrowRight, 
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  return (
    <Box bg="gray.950" color="white" minH="100vh" overflowX="hidden">
      
      {/* --- HERO SECTION --- */}
      <Container maxW="container.xl" pt={{ base: 20, md: 32 }} pb={20}>
        <Stack direction={{ base: "column", lg: "row" }} gap={12} align="center">
          
          <VStack align="start" gap={6} flex={1}>
            <Badge colorPalette="blue" variant="surface" px={3} py={1} borderRadius="full">
              ✨ Nova Versão 2.0 Disponível
            </Badge>
            
            <Heading as="h1" size="4xl" fontWeight="black" lineHeight="1.1">
              Gerencie sua imobiliária <br />
              <Text as="span" color="blue.500">com inteligência.</Text>
            </Heading>
            
            <Text fontSize="xl" color="gray.400" maxW="lg">
              O ImobiSys é a plataforma definitiva para corretores modernos. 
              Controle contratos, clientes e propriedades em um só lugar.
            </Text>
            
            <HStack gap={4} pt={4}>
              {/* NAVEGAÇÃO PARA LOGIN */}
              <Link asChild>
                <RouterLink to="/login">
                  <Button size="lg" colorPalette="blue" px={8} borderRadius="xl" fontWeight="bold">
                    Começar Agora <ArrowRight style={{ marginLeft: '8px' }} size={20} />
                  </Button>
                </RouterLink>
              </Link>
              
              <Button size="lg" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }}>
                Ver Demonstração
              </Button>
            </HStack>
          </VStack>

          {/* Grafismo Visual Decorativo */}
          <Box flex={1} position="relative" w="full" display={{ base: "none", md: "block" }}>
            <Box 
              position="absolute" top="-10%" left="-10%" w="120%" h="120%" 
              bgGradient="radial(blue.500/20, transparent 70%)" 
              filter="blur(60px)" zIndex={0}
            />
            <Box 
              bg="gray.900" borderWidth="1px" borderColor="whiteAlpha.200" 
              p={10} borderRadius="3xl" shadow="2xl" zIndex={1} position="relative"
            >
              <VStack align="start" gap={6}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold" color="blue.300">Painel Administrativo</Text>
                  <Badge colorPalette="green" variant="solid">Online</Badge>
                </HStack>
                <SimpleGrid columns={2} gap={4} w="full">
                  <Box p={4} bg="whiteAlpha.50" borderRadius="xl">
                    <Text fontSize="xs" color="gray.500">Imóveis Ativos</Text>
                    <Text fontSize="xl" fontWeight="bold">1.284</Text>
                  </Box>
                  <Box p={4} bg="whiteAlpha.50" borderRadius="xl">
                    <Text fontSize="xs" color="gray.500">Crescimento</Text>
                    <Text fontSize="xl" fontWeight="bold" color="green.400">+24%</Text>
                  </Box>
                </SimpleGrid>
                <Box w="full" h="1px" bg="whiteAlpha.100" />
                <HStack color="gray.400" fontSize="sm">
                  <CheckCircle2 size={16} />
                  <Text>Criptografia de ponta a ponta ativa</Text>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* --- FEATURES SECTION --- */}
      <Box bg="whiteAlpha.50" py={20} borderTopWidth="1px" borderColor="whiteAlpha.100">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
            <FeatureCard 
              icon={Building2} 
              title="Gestão de Imóveis" 
              desc="Cadastramento inteligente com tour virtual e gestão de fotos em alta definição." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Segurança Total" 
              desc="Seus dados protegidos por backups diários e permissões granulares de acesso." 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Análises Reais" 
              desc="Dashboards interativos para acompanhar cada centavo da sua operação." 
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <VStack 
      align="start" p={8} bg="gray.900" borderRadius="2xl" 
      borderWidth="1px" borderColor="whiteAlpha.100"
      transition="all 0.3s" _hover={{ transform: "translateY(-5px)", borderColor: "blue.500" }}
    >
      <Icon as={icon} boxSize={8} color="blue.400" mb={4} />
      <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
      <Text color="gray.400" lineHeight="tall">{desc}</Text>
    </VStack>
  );
}