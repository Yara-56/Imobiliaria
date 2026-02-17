"use client";

import { Stack, Heading, Text, Button, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export const CTASection = ({ isAuthenticated }: CTASectionProps) => (
  <Box bg="blue.600" p={12} borderRadius="3xl" color="white" textAlign="center" my={10}>
    <Stack gap={6} align="center">
      <Heading size="2xl" fontWeight="bold">Pronto para transformar sua gestão?</Heading>
      <Text fontSize="lg" opacity={0.9} maxW="xl">
        Junte-se a centenas de imobiliárias que já digitalizaram seus processos.
      </Text>
      <Button size="lg" bg="white" color="blue.600" borderRadius="xl" fontWeight="bold" _hover={{ bg: "gray.100" }}>
        <Link to={isAuthenticated ? "/admin/dashboard" : "/login"}>
          {isAuthenticated ? "Ir para o Painel" : "Começar Agora"}
        </Link>
      </Button>
    </Stack>
  </Box>
);