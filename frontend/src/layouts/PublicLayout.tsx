"use client";

import { Box, Flex, Text, Container } from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import { HStack } from "../components/ui/Stack";
import { FluidBackground } from "../components/global/FluidBackground";

const PublicLayout: React.FC = () => {
  return (
    <Box
      minH="100vh"
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* 🌊 FUNDO FLUIDO GLOBAL */}
      <FluidBackground />

      {/* 🔝 HEADER */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex="docked"
        borderBottom="1px solid rgba(0,0,0,0.05)"
        bg="whiteAlpha.700"
        backdropFilter="blur(14px)"
      >
        <Container maxW="6xl" py={4}>
          <Flex justify="space-between" align="center">
            
            {/* LOGO */}
            <RouterLink to="/" style={{ textDecoration: "none" }}>
              <Flex align="center" gap={2}>
                <Text
                  fontSize="xl"
                  fontWeight="900"
                  letterSpacing="tight"
                  color="blue.600"
                >
                  Imobi
                  <Text as="span" color="gray.800">
                    Sys
                  </Text>
                </Text>

                {/* indicador online */}
                <Box
                  w="6px"
                  h="6px"
                  bg="green.400"
                  borderRadius="full"
                  boxShadow="0 0 8px rgba(34,197,94,0.6)"
                />
              </Flex>
            </RouterLink>

            {/* MENU */}
            <HStack gap={6}>
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

              <ColorModeButton />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 📦 CONTEÚDO */}
      <Box as="main" flex="1" position="relative">
        <Container maxW="6xl" py={{ base: 6, md: 10 }}>
          <Outlet />
        </Container>
      </Box>

      {/* 🔻 FOOTER */}
      <Box
        as="footer"
        borderTop="1px solid rgba(0,0,0,0.05)"
        py={6}
        bg="whiteAlpha.600"
        backdropFilter="blur(10px)"
      >
        <Text
          textAlign="center"
          fontSize="xs"
          color="gray.500"
          fontWeight="medium"
        >
          © {new Date().getFullYear()} ImobiSys Pro — Sistema inteligente em tempo real
        </Text>
      </Box>
    </Box>
  );
};

export default PublicLayout;