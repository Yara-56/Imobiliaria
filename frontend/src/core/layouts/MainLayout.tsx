"use client"

import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ColorModeButton } from "../../core/components/ui/ColorMode"; // Ajuste o caminho se necessário

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box 
      minH="100vh" 
      position="relative"
      // Gradiente "Mesh" moderno que valoriza o modo Dark e Light
      bgGradient="to-br"
      gradientFrom="gray.50"
      gradientTo="blue.50"
      _dark={{
        gradientFrom: "gray.950",
        gradientTo: "blue.950",
      }}
      transition="background 0.4s ease"
    >
      {/* Header Minimalista de Suporte */}
      <Flex 
        position="absolute" 
        top={0} 
        w="full" 
        p={6} 
        justify="space-between" 
        align="center"
        zIndex={10}
      >
        <Text 
          fontSize="xl" 
          fontWeight="black" 
          letterSpacing="tighter"
          color="blue.600"
        >
          Imobi<Text as="span" color="gray.800" _dark={{ color: "white" }}>Sys</Text>
        </Text>

        {/* Botão de Tema integrado para facilitar o teste da Yara */}
        <ColorModeButton shadow="md" bg="white" _dark={{ bg: "gray.800" }} />
      </Flex>

      {/* Conteúdo Centralizado */}
      <Container 
        maxW="container.xl" 
        h="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        {/* Animação suave de entrada para o conteúdo */}
        <Box 
          w="full" 
          display="flex" 
          justifyContent="center"
          animation="fade-in 0.8s ease-out"
        >
          {children || <Outlet />}
        </Box>
      </Container>

      {/* Footer Minimalista */}
      <Box 
        position="absolute" 
        bottom={4} 
        w="full" 
        textAlign="center"
      >
        <Text fontSize="xs" color="gray.400" fontWeight="medium">
          © 2026 ImobiSys Pro • Gestão de Ativos Imobiliários
        </Text>
      </Box>
    </Box>
  );
};

export default MainLayout;