"use client";

import { Box, Flex, Text, Container } from "@chakra-ui/react.js";
import { Outlet } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import { FluidBackground } from "../components/global/FluidBackground";
import { useSystemStatus } from "../context/SystemStatusContext";
import Sidebar from "../components/shared/Sidebar";

import { AdminSections } from "../core/config/admin.sections";
import { LuHouse } from "react-icons/lu";

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
    <Flex minH="100vh" overflow="hidden">

      {/* BACKGROUND */}
      <FluidBackground />

      {/* SIDEBAR */}
      <Box
        w={{ base: "70px", md: "260px" }}
        bg="whiteAlpha.800"
        backdropFilter="blur(20px)"
        borderRight="1px solid rgba(0,0,0,0.05)"
      >
        <Sidebar
          sections={AdminSections}
          logo={{
            icon: LuHouse,
            text: "Imobi",
            accent: "Sys",
          }}
          footer={
            <Text
              fontSize="sm"
              color="red.500"
              cursor="pointer"
              p={3}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Sair
            </Text>
          }
        />
      </Box>

      {/* MAIN */}
      <Flex direction="column" flex="1">

        {/* HEADER */}
        <Flex
          px={6}
          py={4}
          justify="space-between"
          align="center"
          borderBottom="1px solid rgba(0,0,0,0.05)"
          bg="whiteAlpha.700"
          backdropFilter="blur(14px)"
        >
          <Flex align="center" gap={4}>
            <Text fontSize="lg" fontWeight="900" color="blue.600">
              Imobi
              <Text as="span" color="gray.800">
                Sys
              </Text>
            </Text>

            <Flex align="center" gap={2}>
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg={current.color}
              />
              <Text fontSize="xs">{current.label}</Text>
            </Flex>
          </Flex>

          <ColorModeButton />
        </Flex>

        {/* CONTENT */}
        <Box flex="1">
          <Container maxW="7xl" py={8}>
            {children || <Outlet />}
          </Container>
        </Box>

        {/* FOOTER */}
        <Box py={4} textAlign="center">
          <Text fontSize="xs">
            © {new Date().getFullYear()} ImobiSys Pro
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;