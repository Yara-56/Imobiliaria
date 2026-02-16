import { Flex, Button, Text, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.100" py={4}>
      <Container maxW="6xl">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="blue.600" cursor="pointer" onClick={() => navigate("/")}>
            ImobiSys
          </Text>
          
          <Flex gap={4}>
            {isAuthenticated ? (
              <Button colorPalette="blue" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

import { Box } from "@chakra-ui/react"; // Adicionado Box ao import