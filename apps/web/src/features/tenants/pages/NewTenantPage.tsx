"use client";

import { 
  Box, Container, Button, Heading, Text, VStack, 
  HStack, Center
} from "@chakra-ui/react.js";
import { LuArrowLeft, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { useTenants } from "../hooks/useTenants";
import { QuickAddTenantModal as TenantForm } from "../components/QuickAddTenantModal";
import type { CreateTenantDTO } from "../types/tenant.types";

export default function NewTenantPage() {
  const navigate = useNavigate();
  
  // Pegamos as ações e o estado de criação do objeto mutations
  const { actions, mutations } = useTenants();

  /**
   * 💾 SUBMIT HANDLER
   * Aqui removemos as propriedades que o seu hook ainda não "conhece"
   */
  const handleCreateTenant = async (data: CreateTenantDTO) => {
    try {
      // ✅ CORREÇÃO DEFINITIVA: 
      // Enviamos apenas as propriedades que o TS disse que são aceitas no actions.create
      await actions.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? "", 
        document: data.document,
        rentValue: data.rentValue ?? 0,
        billingDay: data.billingDay ?? 1,
        // 💡 Nota: preferredPaymentMethod e plan foram removidos daqui 
        // porque o seu hook useTenants.actions.create não os listou como aceitos.
      });
      
      navigate("/tenants");
    } catch (error) {
      console.error("Erro na criação:", error);
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F7F8FA" minH="100vh">
      <Container maxW="4xl">
        
        <Button 
          variant="ghost" 
          mb={8} 
          onClick={() => navigate("/tenants")} 
          color="gray.500"
          gap={2}
          _hover={{ color: "blue.600", bg: "white" }}
        >
          <LuArrowLeft size={18} /> Voltar
        </Button>

        <VStack align="start" gap={6} mb={10}>
          <HStack gap={5}>
            <Center bg="blue.600" p={4} borderRadius="2xl" color="white" shadow="lg">
              <LuUserPlus size={28} />
            </Center>
            <VStack align="start" gap={0}>
              <Heading size="lg" fontWeight="900" color="gray.800" letterSpacing="-0.5px">
                Novo Inquilino
              </Heading>
              <Text color="gray.400" fontSize="sm" fontWeight="medium">
                Cadastre os dados essenciais para o sistema.
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <Box 
          p={{ base: 6, md: 10 }} 
          bg="white" 
          borderRadius="3xl" 
          shadow="0 4px 20px rgba(0,0,0,0.03)" 
          border="1px solid" 
          borderColor="gray.100"
        >
          <TenantForm 
            onSubmit={handleCreateTenant} 
            isLoading={mutations.isCreating} 
          />
        </Box>

        <Text mt={10} textAlign="center" fontSize="xs" color="gray.300" fontWeight="bold" letterSpacing="widest">
          SISTEMA IMOBILIÁRIO v3.0
        </Text>
      </Container>
    </Box>
  );
}