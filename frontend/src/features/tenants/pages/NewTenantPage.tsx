"use client";

import { 
  Box, Container, Button, Heading, Text, VStack, 
  HStack, Center
} from "@chakra-ui/react";
import { LuArrowLeft, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/forms/TenantForm";
import type { CreateTenantDTO } from "../types/tenant.types";

export default function NewTenantPage() {
  const navigate = useNavigate();
  const { actions, status } = useTenants();

  const handleCreateTenant = async (data: CreateTenantDTO) => {
    try {
      await actions.create(data);
      navigate("/tenants");
    } catch (error) {
      // Erro tratado via toaster no hook
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="gray.50" minH="100vh">
      <Container maxW="4xl">
        <Button 
          variant="ghost" 
          mb={8} 
          onClick={() => navigate("/tenants")} 
          color="gray.500"
          _hover={{ color: "blue.600", bg: "white" }}
        >
          <LuArrowLeft style={{ marginRight: "8px" }} /> Voltar
        </Button>

        <VStack align="start" gap={6} mb={10}>
          <HStack gap={5}>
            <Center bg="blue.600" p={4} borderRadius="2xl" color="white" shadow="lg">
              <LuUserPlus size={28} />
            </Center>
            <VStack align="start" gap={0}>
              <Heading size="lg" fontWeight="800" color="gray.700">Novo Inquilino</Heading>
              <Text color="gray.400" fontSize="sm">Cadastre os dados para gerar o contrato imobiliário.</Text>
            </VStack>
          </HStack>
        </VStack>

        <Box 
          p={{ base: 6, md: 10 }} 
          bg="white" 
          borderRadius="3xl" 
          shadow="sm" 
          border="1px solid" 
          borderColor="gray.100"
        >
          <TenantForm 
            onSubmit={handleCreateTenant} 
            isLoading={status.isCreating} 
          />
        </Box>
      </Container>
    </Box>
  );
}
