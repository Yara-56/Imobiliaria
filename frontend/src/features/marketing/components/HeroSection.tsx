// src/features/marketing/components/HeroSection.tsx
import { Stack, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// 💡 ISSO RESOLVE O ERRO: Define que o componente aceita isAuthenticated
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
    <Button asChild size="xl" colorPalette="blue" px={10}>
      <Link to={isAuthenticated ? "/admin/dashboard" : "/login"}>
        {isAuthenticated ? "Ir para o Painel" : "Começar Agora"}
      </Link>
    </Button>
  </Stack>
);