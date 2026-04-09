"use client"

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  Flex,
  Link as ChakraLink,
  VStack,
  HStack,
  Badge,
  chakra,
} from "@chakra-ui/react.js"

import { Link as RouterLink } from "react-router-dom"

import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa"

import { LuMail, LuPhone, LuMapPin, LuArrowRight } from "react-icons/lu"

const Divider = chakra("hr") // FIX: compatível com todas as versões

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      bg="linear-gradient(150deg, #0a0e27, #0f1535)"
      color="white"
      borderTop="1px solid rgba(6,182,212,0.2)"
      pt={20}
      pb={10}
    >
      <Container maxW="7xl">

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 5 }}
          gap={12}
          mb={16}
        >

          {/* BRANDING */}
          <Stack gap={6}>
            <VStack align="start" gap={2}>
              <Text
                fontSize="3xl"
                fontWeight="900"
                bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
                bgClip="text"
              >
                ImobiSys
              </Text>

              <Badge
                bg="rgba(6,182,212,0.25)"
                color="cyan.300"
                fontSize="xs"
                fontWeight="bold"
                px={2}
                py={1}
                rounded="md"
              >
                Plataforma Premium
              </Badge>
            </VStack>

            <Text fontSize="sm" color="gray.400" maxW="300px">
              A solução completa para gestão imobiliária — moderna, inteligente e escalável.
            </Text>

            <HStack gap={4}>
              <SocialIcon icon={FaInstagram} href="https://instagram.com" />
              <SocialIcon icon={FaLinkedin} href="https://linkedin.com" />
              <SocialIcon icon={FaTwitter} href="https://twitter.com" />
              <SocialIcon icon={FaFacebook} href="https://facebook.com" />
              <SocialIcon icon={FaYoutube} href="https://youtube.com" />
            </HStack>
          </Stack>

          <FooterSection title="Produto">
            <FooterItem to="/features">Funcionalidades</FooterItem>
            <FooterItem to="/pricing">Planos e Preços</FooterItem>
            <FooterItem to="/demo">Agendar Demonstração</FooterItem>
            <FooterItem to="/docs">Documentação</FooterItem>
            <FooterItem to="/roadmap">Roadmap</FooterItem>
          </FooterSection>

          <FooterSection title="Empresa">
            <FooterItem to="/about">Sobre Nós</FooterItem>
            <FooterItem to="/contact">Contato</FooterItem>
            <FooterItem to="/blog">Blog</FooterItem>
            <FooterItem to="/careers">Carreiras</FooterItem>
            <FooterItem to="/partners">Parcerias</FooterItem>
          </FooterSection>

          <FooterSection title="Legal">
            <FooterItem to="/privacy">Política de Privacidade</FooterItem>
            <FooterItem to="/terms">Termos de Uso</FooterItem>
            <FooterItem to="/security">Segurança</FooterItem>
            <FooterItem to="/lgpd">LGPD</FooterItem>
            <FooterItem to="/cookies">Cookies</FooterItem>
          </FooterSection>

          <FooterSection title="Contato">
            <ContactItem icon={LuMail} text="contato@imobisys.com" href="mailto:contato@imobisys.com" />
            <ContactItem icon={LuPhone} text="(11) 3000-0000" href="tel:+551130000000" />
            <ContactItem icon={LuMapPin} text="São Paulo, Brasil" href="#" />
          </FooterSection>

        </SimpleGrid>

        <Divider borderColor="rgba(6,182,212,0.25)" mb={8} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <VStack align={{ base: "center", md: "start" }} gap={1}>
            <Text fontSize="xs" color="gray.500">
              © {currentYear} ImobiSys. Todos os direitos reservados.
            </Text>
            <Text fontSize="xs" color="gray.500">
              Excelência em tecnologia imobiliária.
            </Text>
          </VStack>

          <HStack gap={4} fontSize="xs" color="cyan.300">
            <Badge bg="rgba(6,182,212,0.15)" px={2} py={1}>✓ ISO 27001</Badge>
            <Badge bg="rgba(6,182,212,0.15)" px={2} py={1}>✓ LGPD</Badge>
            <Badge bg="rgba(6,182,212,0.15)" px={2} py={1}>✓ Suporte 24/7</Badge>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}


/* --- COMPONENTES INTERNOS --- */

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack gap={4}>
    <Text
      fontSize="sm"
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="wide"
      color="cyan.300"
    >
      {title}
    </Text>
    {children}
  </Stack>
)

/* FIX: ChakraLink + RouterLink + Tipagem + Hover */
const FooterItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <ChakraLink
    as={RouterLink}
    to={to}
    {...({} as any)}           // FIX TIPAGEM
    role="group"               // FIX _groupHover
    fontSize="sm"
    color="gray.400"
    display="flex"
    alignItems="center"
    gap={2}
    _hover={{ color: "cyan.300", transform: "translateX(4px)" }}
    transition="all 0.3s ease"
  >
    {children}
    <Icon
      as={LuArrowRight}
      opacity={0}
      _groupHover={{ opacity: 1 }}
      transition="all 0.3s ease"
    />
  </ChakraLink>
)

const SocialIcon = ({ icon, href }: { icon: any; href: string }) => (
  <ChakraLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    color="gray.500"
    _hover={{ color: "cyan.300", transform: "translateY(-4px)" }}
    transition="all 0.3s ease"
  >
    <Icon as={icon} boxSize={5} />
  </ChakraLink>
)

const ContactItem = ({ icon, text, href }: { icon: any; text: string; href: string }) => (
  <ChakraLink
    href={href}
    display="flex"
    alignItems="center"
    gap={2}
    fontSize="sm"
    color="gray.400"
    _hover={{ color: "cyan.300", transform: "translateX(4px)" }}
    transition="all 0.3s ease"
  >
    <Icon as={icon} boxSize={4} />
    <Text>{text}</Text>
  </ChakraLink>
)