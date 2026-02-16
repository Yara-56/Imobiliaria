// src/features/marketing/components/Footer.tsx
import { 
    Box, 
    Container, 
    SimpleGrid, 
    Stack, 
    Text, 
    Icon, 
    Flex, 
    Separator, 
    Link as ChakraLink 
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { 
    FaInstagram, 
    FaLinkedin, 
    FaTwitter, 
    FaFacebook 
  } from "react-icons/fa";
  
  export const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <Box bg="white" color="gray.700" borderTop="1px solid" borderColor="gray.100" pt={16} pb={8}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={12} mb={12}>
            
            {/* Coluna 1: Branding e Redes Sociais */}
            <Stack gap={6}>
              <Heading size="md" fontWeight="bold" color="blue.600" letterSpacing="tight">
                IMOBISYS
              </Heading>
              <Text fontSize="sm" color="gray.500" lineHeight="tall">
                A plataforma de gestão imobiliária mais completa do mercado. 
                Transformando a forma como você faz negócios.
              </Text>
              <Flex gap={4}>
                <SocialIcon icon={FaInstagram} href="#" />
                <SocialIcon icon={FaLinkedin} href="#" />
                <SocialIcon icon={FaTwitter} href="#" />
                <SocialIcon icon={FaFacebook} href="#" />
              </Flex>
            </Stack>
  
            {/* Coluna 2: Produto */}
            <Stack gap={4}>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
                Produto
              </Text>
              <FooterLink to="/features">Funcionalidades</FooterLink>
              <FooterLink to="/pricing">Preços</FooterLink>
              <FooterLink to="/demo">Agendar Demo</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </Stack>
  
            {/* Coluna 3: Empresa */}
            <Stack gap={4}>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
                Empresa
              </Text>
              <FooterLink to="/about">Sobre nós</FooterLink>
              <FooterLink to="/careers">Carreiras</FooterLink>
              <FooterLink to="/contact">Contato</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </Stack>
  
            {/* Coluna 4: Suporte e Legal */}
            <Stack gap={4}>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
                Legal
              </Text>
              <FooterLink to="/privacy">Privacidade</FooterLink>
              <FooterLink to="/terms">Termos de Uso</FooterLink>
              <FooterLink to="/security">Segurança</FooterLink>
              <FooterLink to="/cookies">Cookies</FooterLink>
            </Stack>
          </SimpleGrid>
  
          <Separator borderColor="gray.100" mb={8} />
  
          {/* Rodapé Final */}
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center" 
            gap={4}
          >
            <Text fontSize="xs" color="gray.400">
              © {currentYear} ImobiSys Gestão Imobiliária LTDA. Todos os direitos reservados.
            </Text>
            <Text fontSize="xs" color="gray.400">
              CNPJ: 00.000.000/0000-00 | Feito com ❤️ no Brasil
            </Text>
          </Flex>
        </Container>
      </Box>
    );
  };
  
  // Sub-componentes auxiliares para manter o código limpo
  const SocialIcon = ({ icon, href }: { icon: any; href: string }) => (
    <ChakraLink 
      href={href} 
      color="gray.400" 
      _hover={{ color: "blue.500", transform: "translateY(-2px)" }} 
      transition="all 0.2s"
    >
      <Icon as={icon} boxSize={5} />
    </ChakraLink>
  );
  
  const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <ChakraLink 
      asChild 
      fontSize="sm" 
      color="gray.500" 
      _hover={{ color: "blue.600", textDecoration: "none" }}
    >
      <Link to={to}>{children}</Link>
    </ChakraLink>
  );
  
  // Adicionando um Heading simples para evitar erro de import
  const Heading = ({ children, ...props }: any) => (
    <Text fontWeight="bold" fontSize="xl" {...props}>
      {children}
    </Text>
  );