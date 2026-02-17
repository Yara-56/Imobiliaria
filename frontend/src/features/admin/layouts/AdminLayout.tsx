"use client";

import { 
  Box, 
  Flex, 
  Stack, 
  Text, 
  Container, 
  Heading // ✅ Adicionado para resolver o erro ts(2304)
} from "@chakra-ui/react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LuLayoutDashboard, 
  LuHouse, 
  LuPenLine, 
  LuUsers, 
  LuWallet, 
  LuLogOut 
  // ✅ LuUser removido daqui para resolver o erro ts(6133)
} from "react-icons/lu";

const menuItems = [
  { name: "Dashboard", icon: LuLayoutDashboard, path: "/admin/dashboard" },
  { name: "Imóveis", icon: LuHouse, path: "/admin/properties" },
  { name: "Contratos", icon: LuPenLine, path: "/admin/contracts" },
  { name: "Clientes", icon: LuUsers, path: "/admin/tenants" },
  { name: "Financeiro", icon: LuWallet, path: "/admin/payments" },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Flex h="100vh" w="full" bg="#F9FAFB" overflow="hidden">
      {/* SIDEBAR */}
      <Box w="280px" bg="white" p={6} borderRight="1px solid" borderColor="gray.100">
        <Stack h="full" gap={10}>
          <Flex align="center" gap={2}>
            <Box bg="blue.600" w="8" h="8" borderRadius="lg" />
            <Text fontSize="2xl" fontWeight="900" color="blue.600">ImobiSys</Text>
          </Flex>
          
          <Stack gap={2} flex={1}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <Flex 
                    align="center" gap={4} p={4} borderRadius="2xl"
                    bg={isActive ? "blue.50" : "transparent"}
                    color={isActive ? "blue.600" : "gray.400"}
                    transition="all 0.2s"
                  >
                    <item.icon size={22} />
                    <Text fontWeight="bold" fontSize="sm">{item.name}</Text>
                  </Flex>
                </Link>
              );
            })}
          </Stack>

          <Flex 
            align="center" gap={4} p={4} cursor="pointer" color="gray.400" 
            _hover={{ color: "red.500" }} 
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LuLogOut size={22} />
            <Text fontWeight="bold" fontSize="sm">Sair</Text>
          </Flex>
        </Stack>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} display="flex" flexDirection="column">
        <Flex h="80px" bg="white" align="center" px={10} justify="space-between" borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.800">
            {menuItems.find(i => i.path === location.pathname)?.name || "Painel Administrativo"}
          </Heading>
        </Flex>
        <Box flex={1} overflowY="auto" p={10}>
          <Container maxW="container.xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};