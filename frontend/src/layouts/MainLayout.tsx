"use client"

import { Box, Flex, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box 
      minH="100vh" 
      bg="bg.canvas" // O v3 usa esse token para o fundo padrão
      backgroundImage="radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)"
      backgroundSize="32px 32px"
      display="flex"
      flexDirection="column"
    >
      {/* HEADER: Agora fixo mas sem flutuar por cima do conteúdo */}
      <Flex 
        w="full" 
        p={6} 
        justify="space-between" 
        align="center"
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="white/80"
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex="docked"
      >
        <Text fontSize="xl" fontWeight="black" letterSpacing="tighter" color="blue.600">
          Imobi<Text as="span" color="gray.800" _dark={{ color: "white" }}>Sys</Text>
        </Text>

        <ColorModeButton />
      </Flex>

      {/* ÁREA DE CONTEÚDO: Removi o Flex Center para não duplicar alinhamento */}
      <Box flex="1" w="full">
          {children || <Outlet />}
      </Box>

      {/* FOOTER: Simples e discreto */}
      <Box py={6} textAlign="center" borderTop="1px solid" borderColor="gray.50">
        <Text fontSize="xs" color="gray.400" fontWeight="medium">
          © 2026 ImobiSys Pro • Gestão de Ativos Imobiliários
        </Text>
      </Box>
    </Box>
  );
};

export default MainLayout;