"use client"

import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

/**
 * ✅ SOLUÇÃO DO ERRO DE IMPORTAÇÃO:
 * De acordo com o seu comando 'find', o arquivo está em: src/core/components/ui/color-mode.tsx
 * Como este Layout está em: src/core/layouts/MainLayout.tsx
 * Subimos um nível (../) para sair de 'layouts' e entrar em 'components'.
 */
// ✅ Caminho relativo direto: sobe uma pasta (sai de layouts) e entra em components
import { ColorModeButton } from "../components/ui/color-mode";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box 
      minH="100vh" 
      position="relative"
      bg="bg.canvas"
      // Efeito de grid pontilhado no fundo
      backgroundImage="radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)"
      backgroundSize="40px 40px"
      _dark={{
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
      }}
    >
      {/* Header Minimalista fixo no topo */}
      <Flex 
        position="absolute" 
        top={0} 
        w="full" 
        p={6} 
        justify="space-between" 
        align="center"
        zIndex="overlay"
      >
        <Text 
          fontSize="xl" 
          fontWeight="black" 
          letterSpacing="tighter"
          color="blue.600"
        >
          Imobi<Text as="span" color="gray.800" _dark={{ color: "white" }}>Sys</Text>
        </Text>

        <ColorModeButton />
      </Flex>

      {/* Container Central - Renderiza o conteúdo da página atual */}
      <Container 
        maxW="6xl" 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Box w="full" py={24}>
          {/* Se houver children direto, usa elas; caso contrário, usa o Outlet das rotas */}
          {children || <Outlet />}
        </Box>
      </Container>

      {/* Footer Fixo na Base */}
      <Box 
        position="absolute" 
        bottom={4} 
        w="full" 
        textAlign="center"
      >
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          © 2026 ImobiSys Pro • Gestão de Ativos Imobiliários
        </Text>
      </Box>
    </Box>
  );
};

export default MainLayout;