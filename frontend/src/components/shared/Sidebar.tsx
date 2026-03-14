import { Box, Flex, Stack, Text, Icon, Center } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";
import { useState } from "react";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface SidebarProps {
  menuItems: MenuItem[];
  logo?: {
    icon: React.ElementType;
    text: string;
    accent?: string;
  };
  footer?: React.ReactNode;
  onLogout?: () => void;
}

export const Sidebar = ({ menuItems, logo, footer }: SidebarProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const SidebarContent = () => (
    <Stack h="full" gap={isOpen ? 8 : 6} position="relative">
      {/* Logo */}
      <Flex 
        align="center" 
        gap={3} 
        px={isOpen ? 4 : 0} 
        justify={isOpen ? "flex-start" : "center"}
        transition="all 0.3s"
      >
        {logo && (
          <>
            <Center 
              bg="blue.600" 
              w="44px" 
              h="44px" 
              borderRadius="14px"
              flexShrink={0}
              boxShadow="0 4px 14px rgba(59, 130, 246, 0.25)"
            >
              <Icon as={logo.icon} color="white" boxSize={5} />
            </Center>
            
            <Box
              overflow="hidden"
              maxW={isOpen ? "200px" : "0"}
              opacity={isOpen ? 1 : 0}
              transition="all 0.3s"
            >
              <Text 
                fontSize="22px" 
                fontWeight="800" 
                color="slate.900" 
                letterSpacing="-0.5px"
                whiteSpace="nowrap"
              >
                {logo.text.split(logo.accent || "")[0]}
                {logo.accent && (
                  <Text as="span" color="blue.600">
                    {logo.accent}
                  </Text>
                )}
              </Text>
            </Box>
          </>
        )}
      </Flex>

      {/* Toggle Button Desktop */}
      <Center
        as="button"
        position="absolute"
        top="12px"
        right="-12px"
        w="24px"
        h="24px"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="full"
        boxShadow="sm"
        zIndex={10}
        display={{ base: "none", md: "flex" }}
        onClick={toggleSidebar}
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        transition="all 0.2s"
      >
        <Icon as={isOpen ? LuX : LuMenu} boxSize={3.5} color="gray.600" />
      </Center>

      {/* Menu Items */}
      <Stack gap={1} flex={1} px={isOpen ? 3 : 2}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{ textDecoration: "none" }}
              onClick={() => setIsMobileOpen(false)}
            >
              <Flex
                align="center"
                gap={4}
                p={isOpen ? 3.5 : 3}
                borderRadius="12px"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? "blue.600" : "slate.600"}
                position="relative"
                justify={isOpen ? "flex-start" : "center"}
                _hover={{
                  bg: isActive ? "blue.100" : "gray.50",
                  color: isActive ? "blue.700" : "blue.600",
                  transform: "translateX(2px)",
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                cursor="pointer"
                _before={
                  isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "4px",
                        height: "60%",
                        bg: "blue.600",
                        borderRadius: "0 4px 4px 0",
                      }
                    : undefined
                }
              >
                <Icon as={item.icon} boxSize={5} flexShrink={0} />

                <Box
                  overflow="hidden"
                  maxW={isOpen ? "200px" : "0"}
                  opacity={isOpen ? 1 : 0}
                  transition="all 0.3s"
                >
                  <Flex align="center" gap={2} whiteSpace="nowrap">
                    <Text fontWeight={isActive ? "700" : "600"} fontSize="15px">
                      {item.name}
                    </Text>
                    {item.badge && item.badge > 0 && (
                      <Center
                        bg={isActive ? "blue.600" : "gray.400"}
                        color="white"
                        fontSize="11px"
                        fontWeight="700"
                        minW="20px"
                        h="20px"
                        borderRadius="full"
                        px={1.5}
                      >
                        {item.badge}
                      </Center>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Link>
          );
        })}
      </Stack>

      {/* Footer */}
      {footer && (
        <Box px={isOpen ? 3 : 2} pb={4}>
          {footer}
        </Box>
      )}
    </Stack>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Center
        as="button"
        position="fixed"
        top={4}
        left={4}
        w="48px"
        h="48px"
        zIndex={20}
        display={{ base: "flex", md: "none" }}
        onClick={toggleMobileSidebar}
        bg="white"
        boxShadow="md"
        borderRadius="full"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        transition="all 0.2s"
      >
        <Icon as={LuMenu} boxSize={6} color="gray.700" />
      </Center>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={30}
          display={{ base: "block", md: "none" }}
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <Box
        w={isOpen ? "280px" : "80px"}
        bg="white"
        p={isOpen ? 5 : 3}
        borderRight="1px solid"
        borderColor="gray.100"
        transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        display={{ base: "none", md: "block" }}
        position="relative"
        overflow="hidden"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Sidebar */}
      <Box
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        w="280px"
        bg="white"
        p={5}
        borderRight="1px solid"
        borderColor="gray.100"
        transform={isMobileOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={40}
        display={{ base: "block", md: "none" }}
        boxShadow="xl"
      >
        {/* Close Button Mobile */}
        <Center
          as="button"
          position="absolute"
          top={4}
          right={4}
          w="32px"
          h="32px"
          onClick={toggleMobileSidebar}
          cursor="pointer"
          _hover={{ bg: "gray.100" }}
          borderRadius="md"
          transition="all 0.2s"
        >
          <Icon as={LuX} boxSize={5} color="gray.600" />
        </Center>
        <SidebarContent />
      </Box>
    </>
  );
};
