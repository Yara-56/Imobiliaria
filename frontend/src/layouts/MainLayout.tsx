"use client";

import { Box, Flex, Text, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import { FluidBackground } from "../components/global/FluidBackground";
import { useSystemStatus } from "../context/SystemStatusContext";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { status } = useSystemStatus();

  const statusMap = {
    online: { color: "green.400", label: "Online" },
    syncing: { color: "blue.400", label: "Sincronizando" },
    warning: { color: "orange.400", label: "Atrasos detectados" },
    offline: { color: "red.400", label: "Instável" },
  };

  const current = statusMap[status];

  return (
    <Box
      minH="100vh"
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* 🌊 FUNDO FLUIDO */}
      <FluidBackground />

      {/* 🔝 HEADER */}
      <Flex
        w="full"
        px={6}
        py={4}
        justify="space-between"
        align="center"
        borderBottom="1px solid rgba(0,0,0,0.05)"
        bg="whiteAlpha.700"
        backdropFilter="blur(14px)"
        position="sticky"
        top={0}
        zIndex="docked"
      >
        {/* LOGO + STATUS */}
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

          {/* STATUS AO VIVO */}
          <Flex align="center" gap={2}>
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg={current.color}
              boxShadow={`0 0 8px ${current.color}`}
            />
            <Text fontSize="xs" color="gray.500">
              {current.label}
            </Text>
          </Flex>
        </Flex>

        {/* AÇÕES */}
        <Flex align="center" gap={4}>
          <ColorModeButton />
        </Flex>
      </Flex>

      {/* 📦 CONTEÚDO */}
      <Box flex="1" position="relative">
        <Container maxW="7xl" py={{ base: 6, md: 8 }}>
          {children || <Outlet />}
        </Container>
      </Box>

      {/* 🔻 FOOTER */}
      <Box
        py={5}
        textAlign="center"
        borderTop="1px solid rgba(0,0,0,0.05)"
        bg="whiteAlpha.600"
        backdropFilter="blur(10px)"
      >
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          © {new Date().getFullYear()} ImobiSys Pro • Sistema em tempo real
        </Text>
      </Box>
    </Box>
  );
};

export default MainLayout;