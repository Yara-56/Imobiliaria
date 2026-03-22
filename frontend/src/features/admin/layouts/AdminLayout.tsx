"use client";

import {
  Box,
  Flex,
  Text,
  Container,
  Heading,
  Center,
} from "@chakra-ui/react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LuHouse, LuLogOut } from "react-icons/lu";

import { Sidebar } from "../../../components/shared/Sidebar";
import { AdminSections } from "@/core/config/admin.sections";

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    AdminSections.flatMap((s) => s.items)
      .find((i) => location.pathname.startsWith(i.path))
      ?.name || "Painel";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Flex h="100vh" w="100vw" bg="#FAFBFC" overflow="hidden">
      {/* SIDEBAR */}
      <Sidebar
        sections={AdminSections}
        logo={{
          icon: LuHouse,
          text: "Imobi",
          accent: "Sys",
        }}
        footer={
          <Flex
            align="center"
            gap={3}
            p={3.5}
            borderRadius="12px"
            cursor="pointer"
            color="gray.500"
            _hover={{ bg: "red.50", color: "red.600" }}
            transition="all 0.2s"
            onClick={handleLogout}
          >
            <LuLogOut size={20} />
            <Text fontWeight="600" fontSize="15px">
              Sair
            </Text>
          </Flex>
        }
      />

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        {/* HEADER */}
        <Flex
          h="72px"
          bg="white"
          align="center"
          px={{ base: 6, md: 10 }}
          justify="space-between"
          borderBottom="1px solid"
          borderColor="gray.100"
          boxShadow="0 1px 3px rgba(0,0,0,0.02)"
        >
          <Heading
            size="md"
            color="slate.800"
            fontWeight="800"
            letterSpacing="-0.5px"
          >
            {currentPage}
          </Heading>

          <Flex align="center" gap={3}>
            <Box textAlign="right" display={{ base: "none", sm: "block" }}>
              <Text fontSize="14px" fontWeight="700" color="slate.800">
                Yara Oliveira
              </Text>
              <Text fontSize="12px" color="gray.500" fontWeight="500">
                Administradora
              </Text>
            </Box>

            <Center
              w="42px"
              h="42px"
              borderRadius="full"
              bg="linear-gradient(135deg, #3B82F6, #2563EB)"
              fontWeight="700"
              color="white"
              fontSize="15px"
              boxShadow="0 4px 14px rgba(59, 130, 246, 0.25)"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
            >
              YO
            </Center>
          </Flex>
        </Flex>

        {/* CONTEÚDO */}
        <Box
          flex={1}
          overflowY="auto"
          p={{ base: 4, md: 8 }}
          bg="#FAFBFC"
          css={{
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#CBD5E0",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": { background: "#A0AEC0" },
          }}
        >
          <Container maxW="7xl" p={0}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};