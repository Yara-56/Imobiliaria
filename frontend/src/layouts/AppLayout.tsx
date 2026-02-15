import React from "react";
import { Box, Flex, VStack, Icon, Text, Heading, Spacer, HStack, Container } from "@chakra-ui/react";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Building, LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/core/contexts/AuthContext";

interface NavItemProps { icon: LucideIcon; label: string; active?: boolean; }

const NavItem = ({ icon: IconComponent, label, active = false }: NavItemProps) => (
  <HStack w="full" p={3} borderRadius="xl" cursor="pointer"
    bg={active ? "blue.600/15" : "transparent"} color={active ? "blue.400" : "gray.400"}
    _hover={{ bg: "whiteAlpha.100", color: "white" }} transition="all 0.3s">
    <Icon asChild><IconComponent size={20} /></Icon>
    <Text fontWeight="semibold" fontSize="sm">{label}</Text>
  </HStack>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth(); // Sincronia com o Contexto

  return (
    <Flex bg="gray.950" minH="100vh" color="white">
      <Box w="280px" borderRight="1px solid" borderColor="whiteAlpha.100" p={6} position="fixed" h="100vh" zIndex={10} bg="rgba(10, 10, 10, 0.4)" backdropFilter="blur(20px)">
        <VStack align="start" h="full" gap={8}>
          <Heading size="md" letterSpacing="tighter" color="blue.500" fontWeight="900">
            IMOBI<Text as="span" color="white">SYS</Text>
          </Heading>
          
          <VStack w="full" gap={2} flex={1}>
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Building} label="Imóveis" />
            <NavItem icon={Users} label="Inquilinos" />
            <NavItem icon={FileText} label="Contratos" />
          </VStack>

          <Spacer />

          <VStack w="full" p={4} bg="whiteAlpha.50" borderRadius="2xl" gap={3} border="1px solid" borderColor="whiteAlpha.100">
            <Flex w="full" align="center" gap={3}>
              <Avatar name={user?.name || "Yara"} size="sm" border="2px solid" borderColor="blue.500" />
              <Box>
                <Text fontSize="xs" fontWeight="bold">{user?.name || "Yara"}</Text>
                <Text fontSize="10px" color="gray.500">{user?.role || "Eng. de Software"}</Text>
              </Box>
              <Spacer />
              <Icon asChild color="red.400" cursor="pointer" onClick={logout} _hover={{ color: "red.300", transform: "translateX(2px)" }}>
                <LogOut size={16} />
              </Icon>
            </Flex>
          </VStack>
        </VStack>
      </Box>

      <Box flex={1} ml="280px" position="relative">
        <Box position="absolute" top="-15%" right="-10%" w="800px" h="800px" bgGradient="radial(blue.600/5, transparent 75%)" filter="blur(140px)" zIndex={0} pointerEvents="none" />
        <Container maxW="7xl" py={12} position="relative" zIndex={1}>
          {children}
        </Container>
      </Box>
    </Flex>
  );
}