import { Box, VStack, Text, Button , Flex, Separator } from "@chakra-ui/react";
import { LayoutDashboard, FileText, Users, LogOut, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Contratos", icon: FileText, path: "/admin/contratos" },
  { name: "Propriedades", icon: Home, path: "/admin/propriedades" },
  { name: "Usuários", icon: Users, path: "/admin/usuarios" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <Box 
      as="nav" 
      w="260px" 
      bg="white" 
      h="100vh" 
      borderRight="1px solid" 
      borderColor="gray.200" 
      p={5}
      position="sticky"
      top="0"
    >
      <VStack align="stretch" gap={8} h="full">
        <Text fontSize="2xl" fontWeight="black" color="blue.600" textAlign="center">
          ImobiSys
        </Text>

        <VStack align="stretch" gap={2} flex={1}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "solid" : "ghost"}
              colorPalette={location.pathname === item.path ? "blue" : "gray"}
              justifyContent="flex-start"
              onClick={() => navigate(item.path)}
              gap={3}
            >
              <item.icon size={20} />
              {item.name}
            </Button>
          ))}
        </VStack>

        <Box>
          <Separator mb={4} />
          <Flex align="center" gap={3} mb={4} px={2}>
            <Box bg="blue.100" p={2} borderRadius="full">
              <Users size={18} color="blue" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontWeight="bold" fontSize="sm" lineClamp={1}>{user?.name || "Usuário"}</Text>
              <Text fontSize="xs" color="gray.500">{user?.role}</Text>
            </VStack>
          </Flex>
          <Button 
            variant="outline" 
            w="full" 
            colorPalette="red" 
            onClick={logout}
            gap={2}
          >
            <LogOut size={18} /> Sair
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};