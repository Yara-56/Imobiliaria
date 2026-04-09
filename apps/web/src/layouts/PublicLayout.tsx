"use client";

import { Box, Flex, Text, Container, Button } from "@chakra-ui/react.js";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import { FluidBackground } from "../components/global/FluidBackground";

const PublicLayout: React.FC = () => {
  return (
    <Flex minH="100vh" direction="column" position="relative" overflow="hidden">
      
      {/* 🌊 BACKGROUND */}
      <FluidBackground />

      {/* 🔝 HEADER */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        borderBottom="1px solid rgba(0,0,0,0.05)"
        bg="whiteAlpha.700"
        backdropFilter="blur(14px)"
      >
        <Container maxW="6xl" py={4}>
          <Flex justify="space-between" align="center">

            {/* LOGO */}
            <RouterLink to="/" style={{ textDecoration: "none" }}>
              <Flex align="center" gap={3}>
                <Text
                  fontSize="xl"
                  fontWeight="900"
                  letterSpacing="tight"
                  color="blue.600"
                >
                  Imobi
                  <Text as="span" color="gray.800" _dark={{ color: "white" }}>
                    Sys
                  </Text>
                </Text>

                {/* STATUS ONLINE */}
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg="green.400"
                  boxShadow="0 0 10px rgba(34,197,94,0.7)"
                />
              </Flex>
            </RouterLink>

            {/* MENU */}
            <Flex align="center" gap={6}>
              <RouterLink to="/login">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.600"
                  transition="0.2s"
                  _hover={{
                    color: "blue.600",
                    transform: "translateY(-1px)",
                  }}
                >
                  Entrar
                </Text>
              </RouterLink>

              <RouterLink to="/register">
                <Button
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                >
                  Começar
                </Button>
              </RouterLink>

              <ColorModeButton />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* 🧠 HERO / CONTEÚDO */}
      <Box flex="1" display="flex" alignItems="center">
        <Container maxW="6xl" py={{ base: 10, md: 16 }}>
          
          {/* HERO TEXT */}
          <Flex direction="column" gap={6} maxW="600px">
            <Text
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="900"
              lineHeight="1.1"
            >
              Gerencie seus imóveis com
              <Text as="span" color="blue.600"> inteligência real</Text>
            </Text>

            <Text fontSize="lg" color="gray.500">
              Plataforma moderna para controle completo de imóveis, clientes e finanças em tempo real.
            </Text>

            {/* CTA */}
            <Flex gap={4}>
              <RouterLink to="/register">
                <Button size="lg" colorScheme="blue" borderRadius="xl">
                  Começar agora
                </Button>
              </RouterLink>

              <RouterLink to="/login">
                <Button size="lg" variant="ghost">
                  Já tenho conta
                </Button>
              </RouterLink>
            </Flex>
          </Flex>

        </Container>
      </Box>

      {/* 🔻 FOOTER */}
      <Box
        borderTop="1px solid rgba(0,0,0,0.05)"
        py={6}
        bg="whiteAlpha.600"
        backdropFilter="blur(10px)"
      >
        <Text
          textAlign="center"
          fontSize="xs"
          color="gray.500"
        >
          © {new Date().getFullYear()} ImobiSys Pro — Plataforma SaaS moderna
        </Text>
      </Box>

    </Flex>
  );
};

export default PublicLayout;