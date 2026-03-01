"use client";

import { Box, Flex, Text, Container } from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import { HStack } from "../components/ui/Stack"; // Seu componente de Stack

const PublicLayout: React.FC = () => {
  return (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
      {/* HEADER MINIMALISTA */}
      <Box 
        as="header" 
        borderBottom="1px solid" 
        borderColor="gray.100" 
        bg="white/70" 
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex="docked"
      >
        <Container maxW="6xl" py={4}>
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="black" letterSpacing="tighter" color="blue.600">
                Imobi<Text as="span" color="gray.800">Sys</Text>
              </Text>
            </RouterLink>

            {/* Menu */}
            <HStack gap={6}>
              <RouterLink to="/login">
                <Text fontSize="sm" fontWeight="bold" color="gray.600" _hover={{ color: "blue.600" }}>
                  Entrar
                </Text>
              </RouterLink>
              
              <ColorModeButton />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* CONTEÚDO DINÂMICO */}
      <Box as="main" flex="1">
        {/* Removido o 'items-center' para evitar duplicação de layout nas subpáginas */}
        <Outlet />
      </Box>

      {/* FOOTER */}
      <Box as="footer" borderTop="1px solid" borderColor="gray.50" py={6} bg="white">
        <Text textAlign="center" fontSize="xs" color="gray.400" fontWeight="medium">
          © {new Date().getFullYear()} ImobiSys Pro — Gestão de Ativos Imobiliários
        </Text>
      </Box>
    </Box>
  );
};

export default PublicLayout;