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

import Sidebar from "../../../components/shared/Sidebar"; // ✅ corrigido
import { AdminSections } from "../../../core/config/admin.sections";

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

      {/* CONTEÚDO */}
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
        >
          <Heading size="md" fontWeight="800">
            {currentPage}
          </Heading>

          <Flex align="center" gap={3}>
            <Box textAlign="right">
              <Text fontSize="14px" fontWeight="700">
                Yara Oliveira
              </Text>
              <Text fontSize="12px" color="gray.500">
                Administradora
              </Text>
            </Box>

            <Center
              w="42px"
              h="42px"
              borderRadius="full"
              bg="blue.500"
              color="white"
              fontWeight="700"
            >
              YO
            </Center>
          </Flex>
        </Flex>

        {/* PAGE */}
        <Box flex={1} overflowY="auto" p={8}>
          <Container maxW="7xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};