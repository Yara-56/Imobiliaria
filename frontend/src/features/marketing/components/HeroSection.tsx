"use client";

import { Stack, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export const HeroSection = ({ isAuthenticated }: HeroSectionProps) => (
  <Stack align="center" textAlign="center" py={24} gap={6}>
    <Heading size="3xl" fontWeight="extrabold">
      Gestão imobiliária <Text as="span" color="blue.600">inteligente</Text>
    </Heading>
    <Text fontSize="xl" color="gray.600" maxW="2xl">
      O IMOBISYS centraliza sua operação para você focar no que importa: fechar negócios.
    </Text>
    <Button size="lg" bg="blue.600" color="white" px={10} borderRadius="xl">
      <Link to={isAuthenticated ? "/admin/dashboard" : "/login"} style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? "Ir para o Painel" : "Começar Agora"} 
        <Icon as={LuArrowRight} ml={2} />
      </Link>
    </Button>
  </Stack>
);