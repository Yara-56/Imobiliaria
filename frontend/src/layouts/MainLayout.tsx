import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Heading,
  Spacer,
  HStack,
  Container,
} from "@chakra-ui/react";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { Outlet, NavLink } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/core/context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Imóveis",
      icon: Building2,
      path: "/admin/properties",
    },
    {
      label: "Usuários",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Contratos",
      icon: FileText,
      path: "/admin/contracts",
    },
  ];

  return (
    <Flex bg="gray.950" minH="100vh" color="white">
      {/* Sidebar */}
      <Box
        w="280px"
        borderRight="1px solid"
        borderColor="whiteAlpha.100"
        p={6}
        position="fixed"
        h="100vh"
      >
        <VStack align="start" h="full" gap={8}>
          <Heading size="md" color="blue.500" fontWeight="900">
            IMOBISYS
          </Heading>

          {/* Menu */}
          <VStack w="full" gap={2}>
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <HStack
                    w="full"
                    p={3}
                    borderRadius="xl"
                    bg={isActive ? "blue.600" : "transparent"}
                    color={isActive ? "white" : "gray.400"}
                    _hover={{
                      bg: "whiteAlpha.100",
                      color: "white",
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={item.icon} boxSize={5} />
                    <Text fontWeight="bold" fontSize="sm">
                      {item.label}
                    </Text>
                  </HStack>
                )}
              </NavLink>
            ))}
          </VStack>

          <Spacer />

          {/* Perfil */}
          <VStack
            w="full"
            p={4}
            bg="whiteAlpha.50"
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <Flex w="full" align="center" gap={3}>
              <Avatar
                name={user?.name}
                size="sm"
                border="2px solid"
                borderColor="blue.500"
              />

              <Box>
                <Text fontSize="xs" fontWeight="bold" lineClamp={1}>
                  {user?.name || "Usuário"}
                </Text>
                <Text fontSize="10px" color="gray.500">
                  {user?.role || "Administrador"}
                </Text>
              </Box>

              <Spacer />

              <Box as="button" onClick={logout}>
                <Icon
                  as={LogOut}
                  boxSize={4}
                  color="red.400"
                  cursor="pointer"
                  _hover={{ color: "red.300" }}
                />
              </Box>
            </Flex>
          </VStack>
        </VStack>
      </Box>

      {/* Conteúdo */}
      <Box flex={1} ml="280px" p={10}>
        <Container maxW="7xl">
          <Outlet />
        </Container>
      </Box>
    </Flex>
  );
}
