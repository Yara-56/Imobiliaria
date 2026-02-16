"use client";

import { Box, Flex, Stack, Text, Icon } from "@chakra-ui/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
// ✅ Corrigido: LuHouse é o padrão para imóveis/home no Lucide
import { LuLayoutDashboard, LuFileText, LuUsers, LuLogOut, LuHouse } from "react-icons/lu";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
    { name: "Contratos", path: "/admin/contracts", icon: LuFileText },
    { name: "Imóveis", path: "/admin/properties", icon: LuHouse },
    { name: "Inquilinos", path: "/admin/tenants", icon: LuUsers },
  ];

  return (
    <Flex h="100vh" bg="gray.50" overflow="hidden">
      {/* Sidebar Lateral */}
      <Box 
        w="280px" 
        bg="white" 
        borderRightWidth="1px" 
        borderColor="gray.100" 
        p={6}
        display={{ base: "none", md: "block" }} // Esconde no mobile por enquanto
      >
        <Stack h="full" justify="space-between">
          <Stack gap={8}>
            <Text 
              fontSize="2xl" 
              fontWeight="black" 
              color="blue.600" 
              letterSpacing="tight"
            >
              ImobiSys
            </Text>
            
            <Stack gap={1}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Flex
                    key={item.path}
                    align="center"
                    gap={3}
                    p={3}
                    borderRadius="lg"
                    cursor="pointer"
                    transition="all 0.2s"
                    bg={isActive ? "blue.50" : "transparent"}
                    color={isActive ? "blue.600" : "gray.600"}
                    fontWeight={isActive ? "bold" : "medium"}
                    _hover={{ bg: "blue.50", color: "blue.600" }}
                    onClick={() => navigate(item.path)}
                  >
                    {/* Usando Icon do Chakra para melhor renderização */}
                    <Icon as={item.icon} boxSize={5} />
                    <Text fontSize="sm">{item.name}</Text>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>

          {/* Botão de Sair */}
          <Flex 
            align="center" 
            gap={3} 
            p={3} 
            mb={4}
            color="red.500" 
            cursor="pointer" 
            fontWeight="bold"
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{ bg: "red.50" }}
            onClick={() => {
              // Aqui futuramente você chamará sua função de logout do AuthContext
              navigate("/login");
            }}
          >
            <Icon as={LuLogOut} boxSize={5} />
            <Text fontSize="sm">Sair do Sistema</Text>
          </Flex>
        </Stack>
      </Box>

      {/* Área de Conteúdo Principal */}
      <Box 
        flex="1" 
        overflowY="auto" 
        p={{ base: 6, md: 10 }} 
        bg="gray.50"
      >
        {/* Container para as páginas do dashboard não ficarem coladas nas bordas */}
        <Box maxW="7xl" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;