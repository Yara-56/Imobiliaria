"use client";

import { 
  Box, Container, Button, Heading, Text, VStack, 
  HStack, Center
} from "@chakra-ui/react";
import { LuArrowLeft, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { useTenants } from "../hooks/useTenants";
// ✅ CORREÇÃO CHAVE: Importamos o FORMULÁRIO REAL, não o Modal.
// Isso remove aquele botão azul de "Cadastrar Locatário" e mostra os campos direto.
import TenantForm from "../components/forms/TenantForm"; 
import type { CreateTenantDTO } from "../types/tenant.types";

export default function NewTenantPage() {
  const navigate = useNavigate();
  
  // Pegamos as ações e o estado de criação do objeto mutations
  const { actions, mutations } = useTenants();

  /**
   * 💾 SUBMIT HANDLER
   * Processa os dados vindo do formulário e envia para o backend
   */
  const handleCreateTenant = async (data: CreateTenantDTO) => {
    try {
      // ✅ Enviamos os dados mapeados conforme a necessidade do seu Hook
      await actions.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? "", 
        document: data.document,
        rentValue: data.rentValue ?? 0,
        billingDay: data.billingDay ?? 1,
        // Caso seu backend aceite os campos abaixo, você pode descomentar:
        // preferredPaymentMethod: data.preferredPaymentMethod,
        // plan: data.plan
      });
      
      // Navega de volta para a listagem de inquilinos após o sucesso
      navigate("/tenants");
    } catch (error) {
      console.error("Erro na criação do inquilino:", error);
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="4xl">
        
        {/* BOTÃO VOLTAR COM FEEDBACK VISUAL MELHORADO */}
        <Button 
          variant="ghost" 
          mb={8} 
          onClick={() => navigate("/tenants")} 
          color="gray.500"
          gap={2}
          borderRadius="xl"
          _hover={{ color: "blue.600", bg: "blue.50" }}
        >
          <LuArrowLeft size={18} /> Voltar para Inquilinos
        </Button>

        {/* HEADER DA PÁGINA */}
        <VStack align="start" gap={6} mb={10}>
          <HStack gap={5}>
            <Center 
              bg="blue.600" 
              p={4} 
              borderRadius="2xl" 
              color="white" 
              shadow="0 10px 20px -5px rgba(49, 130, 206, 0.4)"
            >
              <LuUserPlus size={28} />
            </Center>
            <VStack align="start" gap={0}>
              <Heading size="lg" fontWeight="900" color="gray.800" letterSpacing="-1px">
                Novo Inquilino
              </Heading>
              <Text color="gray.400" fontSize="sm" fontWeight="medium">
                Insira as informações para registro no banco de dados.
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* CONTAINER DO FORMULÁRIO */}
        <Box 
          p={{ base: 6, md: 10 }} 
          bg="white" 
          borderRadius="4xl" 
          shadow="0 4px 25px rgba(0,0,0,0.02)" 
          border="1px solid" 
          borderColor="gray.100"
        >
          {/* ✅ Agora o TenantForm renderiza os Inputs direto, sem o Modal intermediário */}
          <TenantForm 
            onSubmit={handleCreateTenant} 
            isLoading={mutations.isCreating} 
          />
        </Box>

        {/* RODAPÉ DO SISTEMA */}
        <Text 
          mt={12} 
          textAlign="center" 
          fontSize="xs" 
          color="gray.300" 
          fontWeight="black" 
          letterSpacing="0.3em"
        >
          AURAIMOBI CLUSTER v3.0
        </Text>
      </Container>
    </Box>
  );
}