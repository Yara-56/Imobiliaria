import { Box, Button, Container, Heading, Text, Stack, SimpleGrid, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiHome, FiShield, FiUsers } from "react-icons/fi";

const LandingPage = () => {
  return (
    <Box bg="gray.950" minH="100vh" color="white">
      {/* Hero Section */}
      <Container maxW="6xl" pt={24} pb={16}>
        <Stack gap={8} align="center" textAlign="center">
          <Heading size="4xl" fontWeight="black" letterSpacing="tight">
            Gestão Imobiliária <Text as="span" color="blue.500">Inteligente</Text>
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="2xl">
            O ImobiSys centraliza contratos, inquilinos e pagamentos em uma única plataforma segura e moderna.
          </Text>
          
          <Stack direction="row" gap={4}>
            {/* SOLUÇÃO: Usamos o ChakraLink com a prop 'as' para o RouterLink.
                Dessa forma, o TypeScript entende que é um Link, mas o estilo é de Button. */}
            <Button asChild size="lg" colorPalette="blue" px={8}>
              <RouterLink to="/login">
                Acessar Sistema
              </RouterLink>
            </Button>
            
            <Button variant="outline" size="lg" px={8}>
              Conhecer Planos
            </Button>
          </Stack>
        </Stack>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} mt={20}>
          <Feature icon={FiShield} title="Segurança Total" text="Dados criptografados e controle de acesso por níveis de usuário." />
          <Feature icon={FiUsers} title="Gestão de Inquilinos" text="Histórico completo, documentos e comunicações centralizadas." />
          <Feature icon={FiHome} title="Controle de Imóveis" text="Status em tempo real de toda a sua carteira imobiliária." />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// Interface para garantir que o TypeScript não reclame dos tipos da Feature
interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
}

const Feature = ({ title, text, icon }: FeatureProps) => (
  <Stack 
    align="center" 
    textAlign="center" 
    p={8} 
    bg="whiteAlpha.50" 
    rounded="2xl" 
    border="1px solid" 
    borderColor="whiteAlpha.100"
    _hover={{ borderColor: "blue.500", bg: "whiteAlpha.100", transform: "translateY(-5px)" }}
    transition="all 0.3s"
  >
    <Icon as={icon} boxSize={10} color="blue.400" mb={4} />
    <Heading size="md">{title}</Heading>
    <Text color="gray.400">{text}</Text>
  </Stack>
);

export default LandingPage;