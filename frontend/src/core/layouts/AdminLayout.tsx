"use client"

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
// ✅ Corrigido: LuHome alterado para LuHouse
import { LuLayoutDashboard, LuFileText, LuUsers, LuLogOut, LuHouse } from "react-icons/lu";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
    { name: "Contratos", path: "/admin/contracts", icon: LuFileText },
    { name: "Imóveis", path: "/admin/properties", icon: LuHouse }, // ✅ Atualizado aqui
    { name: "Inquilinos", path: "/admin/tenants", icon: LuUsers },
  ];

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar Lateral */}
      <Box w="280px" bg="white" borderRight="1px solid" borderColor="gray.100" p={6}>
        <Stack h="full" justify="space-between">
          <Stack gap={8}>
            <Text fontSize="2xl" fontWeight="black" color="blue.600">ImobiSys</Text>
            
            <Stack gap={2}>
              {menuItems.map((item) => (
                <Flex
                  key={item.path}
                  align="center"
                  gap={3}
                  p={3}
                  borderRadius="xl"
                  cursor="pointer"
                  bg={location.pathname === item.path ? "blue.50" : "transparent"}
                  color={location.pathname === item.path ? "blue.600" : "gray.500"}
                  fontWeight={location.pathname === item.path ? "bold" : "medium"}
                  _hover={{ bg: "gray.50", color: "blue.600" }}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={20} />
                  <Text>{item.name}</Text>
                </Flex>
              ))}
            </Stack>
          </Stack>

          {/* Botão de Sair */}
          <Flex 
            align="center" 
            gap={3} 
            p={3} 
            color="red.500" 
            cursor="pointer" 
            fontWeight="bold"
            transition="all 0.2s"
            _hover={{ bg: "red.50", borderRadius: "xl" }}
            onClick={() => navigate("/login")}
          >
            <LuLogOut size={20} />
            Sair do Sistema
          </Flex>
        </Stack>
      </Box>

      {/* Conteúdo Principal */}
      <Box flex="1" overflowY="auto" p={10}>
        <Outlet />
      </Box>
    </Flex>
  );
};

// ✅ IMPORTANTE: Exportação padrão para o React.lazy do seu AppRoutes funcionar
export default AdminLayout;