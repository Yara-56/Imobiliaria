import React from "react";
import { Box, Flex, VStack, Icon, Text, Heading, Spacer, HStack, Container } from "@chakra-ui/react";
import { LayoutDashboard, Building, Users, FileText, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/contexts/AuthContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <Flex bg="gray.950" minH="100vh" color="white">
      {/* Sidebar Fixa */}
      <Box w="280px" borderRight="1px solid" borderColor="whiteAlpha.100" p={6} position="fixed" h="100vh">
        <VStack align="start" h="full" gap={8}>
          <Heading size="md" color="blue.500" fontWeight="900">IMOBISYS</Heading>
          
          <VStack w="full" gap={2}>
            <HStack w="full" p={3} borderRadius="xl" bg="blue.600/10" color="blue.400">
              <Icon asChild><LayoutDashboard size={20} /></Icon>
              <Text fontWeight="bold" fontSize="sm">Dashboard</Text>
            </HStack>
            {/* Outros itens seguem o mesmo padrão */}
          </VStack>

          <Spacer />

          {/* Card de Perfil Sincronizado */}
          <VStack w="full" p={4} bg="whiteAlpha.50" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
            <Flex w="full" align="center" gap={3}>
              <Avatar name={user?.name} size="sm" border="2px solid" borderColor="blue.500" />
              <Box>
                <Text fontSize="xs" fontWeight="bold">{user?.name}</Text>
                <Text fontSize="10px" color="gray.500">{user?.role}</Text>
              </Box>
              <Spacer />
              <Icon asChild color="red.400" cursor="pointer" onClick={logout} _hover={{ color: "red.300" }}>
                <LogOut size={16} />
              </Icon>
            </Flex>
          </VStack>
        </VStack>
      </Box>

      <Box flex={1} ml="280px" p={10}>
        <Container maxW="7xl">{children}</Container>
      </Box>
    </Flex>
  );
}