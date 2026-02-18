"use client";

import { Box, Flex, Stack, Text, Container, Heading, Icon, Center } from "@chakra-ui/react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LuLayoutDashboard, LuHouse, LuPenLine, LuUsers, LuWallet, LuLogOut 
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

  // ✅ Melhorei a lógica para encontrar a página atual mesmo em sub-rotas
  const currentPage = menuItems.find(i => 
    location.pathname.startsWith(i.path)
  )?.name || "Painel";

  return (
    <Flex h="100vh" w="100vw" bg="#F8FAFC" overflow="hidden">
      {/* SIDEBAR */}
      <Box w="280px" bg="white" p={6} borderRight="1px solid" borderColor="gray.100" display={{ base: "none", md: "block" }}>
        <Stack h="full" gap={10}>
          <Flex align="center" gap={3} px={2}>
            <Center bg="blue.600" w="10" h="10" borderRadius="xl">
               <LuHouse color="white" size={20} />
            </Center>
            <Text fontSize="xl" fontWeight="900" color="slate.900" letterSpacing="-1px">
              Imobi<Text as="span" color="blue.600">Sys</Text>
            </Text>
          </Flex>
          
          <Stack gap={1} flex={1}>
            {menuItems.map((item) => {
              // ✅ LOGICA CORRIGIDA: Se a URL começa com o path do item, ele continua ativo
              // Isso evita que o menu "apague" quando você entra em /new ou /edit
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <Flex 
                    align="center" gap={4} p={3.5} borderRadius="xl"
                    bg={isActive ? "blue.50" : "transparent"}
                    color={isActive ? "blue.600" : "slate.500"}
                    _hover={{ bg: "gray.50", color: "blue.600" }}
                    transition="0.2s"
                    cursor="pointer"
                  >
                    <Icon as={item.icon} boxSize={5} />
                    <Text fontWeight={isActive ? "bold" : "semibold"} fontSize="sm">{item.name}</Text>
                  </Flex>
                </Link>
              );
            })}
          </Stack>

          <Flex 
            align="center" gap={4} p={4} borderRadius="xl" cursor="pointer" color="gray.400" 
            _hover={{ bg: "red.50", color: "red.500" }} 
            onClick={() => { localStorage.clear(); navigate("/login"); }}
          >
            <LuLogOut size={20} />
            <Text fontWeight="bold" fontSize="sm">Sair da conta</Text>
          </Flex>
        </Stack>
      </Box>

      {/* CONTEÚDO */}
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Flex h="70px" bg="white" align="center" px={10} justify="space-between" borderBottom="1px solid" borderColor="gray.100">
          <Heading size="sm" color="slate.700" fontWeight="800">
             {/* ✅ Agora mostra "Clientes" mesmo dentro de /tenants/new */}
            {currentPage}
          </Heading>
          
          <Flex align="center" gap={3}>
            <Box textAlign="right">
                <Text fontSize="xs" fontWeight="bold">Yara Oliveira</Text>
                <Text fontSize="10px" color="gray.500">Administradora</Text>
            </Box>
            <Center w="10" h="10" borderRadius="full" bg="blue.50" fontWeight="bold" color="blue.600">YO</Center>
          </Flex>
        </Flex>

        {/* ✅ O Outlet renderiza as sub-rotas aqui dentro */}
        <Box flex={1} overflowY="auto" p={{ base: 6, md: 10 }}>
          <Container maxW="7xl" p={0}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};