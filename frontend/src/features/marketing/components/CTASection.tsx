"use client";

import { Stack, Heading, Text, Button, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// 💡 Definição essencial para o TS reconhecer a prop
interface CTASectionProps {
  isAuthenticated: boolean;
}

export const CTASection = ({ isAuthenticated }: CTASectionProps) => (
  <Box bg="blue.600" p={12} borderRadius="3xl" color="white" textAlign="center">
    <Stack gap={6} align="center">
      <Heading size="2xl" fontWeight="bold">
        Pronto para transformar sua gestão?
      </Heading>
      <Text fontSize="lg" opacity={0.9} maxW="xl">
        Junte-se a centenas de imobiliárias que já digitalizaram seus processos.
      </Text>
      <Button 
        asChild 
        size="xl" 
        variant="solid" 
        bg="white" 
        color="blue.600" 
        _hover={{ bg: "gray.100" }}
      >
        <Link to={isAuthenticated ? "/admin/dashboard" : "/login"}>
          {isAuthenticated ? "Ir para o Painel" : "Começar Agora"}
        </Link>
      </Button>
    </Stack>
  </Box>
);