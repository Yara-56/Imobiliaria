"use client";

import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, Container, Heading, Text, VStack, 
  Spinner, Center, Flex, IconButton, Button, Badge, Stack 
} from "@chakra-ui/react";
import { LuArrowLeft, LuShieldCheck, LuCircleAlert } from "react-icons/lu";

import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/TenantForm";

export default function EditTenantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✅ Hook unificado que gerencia o estado do cluster
  const { tenant, isLoading, isError, updateTenant, isUpdating } = useTenants(id);

  /**
   * 1. SUBMIT HANDLER - Corrigido para FormData
   * ✅ O tipo agora coincide com o TenantFormProps.onSubmit
   */
  const handleUpdate = (formData: FormData) => {
    if (!id) return;
    
    // 🛡️ Segurança: Enviamos o FormData diretamente para o Hook tratar o multipart/form-data
    updateTenant(
      { id, data: formData }, 
      { onSuccess: () => navigate("/admin/tenants") }
    );
  };

  // 2. LOADING STATE
  if (isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <VStack gap={6}>
        <Spinner size="xl" color="blue.600" borderWidth="4px" />
        <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
          SINCRONIZANDO INFRAESTRUTURA
        </Text>
      </VStack>
    </Center>
  );

  // 3. ERROR STATE
  if (isError || !tenant) return (
    <Center h="100vh" bg="#F8FAFC">
      <Container maxW="md">
        <VStack gap={6} p={10} bg="white" borderRadius="3xl" shadow="2xl" textAlign="center">
          <Box color="red.500" bg="red.50" p={4} borderRadius="full">
            <LuCircleAlert size={40} />
          </Box>
          <VStack gap={2}>
            <Heading size="md" fontWeight="800">Node não identificado</Heading>
            <Text color="gray.500" fontSize="sm">A instância solicitada não existe ou o cluster está inacessível.</Text>
          </VStack>
          <Button w="full" bg="blue.600" color="white" size="lg" borderRadius="xl" onClick={() => navigate("/admin/tenants")}>
            Voltar ao Dashboard
          </Button>
        </VStack>
      </Container>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="2xl">
        
        {/* HEADER SISTÊMICO */}
        <Flex align="center" justify="space-between" mb={10}>
          <Stack gap={1}>
            <Flex align="center" gap={2} color="blue.600">
              <LuShieldCheck size={18} />
              <Badge variant="subtle" colorPalette="blue" fontSize="10px" borderRadius="md" px={2}>
                CONFIGURAÇÃO MASTER
              </Badge>
            </Flex>
            <Heading size="xl" fontWeight="900" color="slate.800" letterSpacing="-1.5px">
              Ajustar Locatário
            </Heading>
            <Text color="gray.500" fontSize="sm">
              ID de Isolamento: <Text as="span" fontWeight="bold" color="slate.700">{id}</Text>
            </Text>
          </Stack>
          
          <IconButton
            aria-label="Voltar"
            variant="outline"
            bg="white"
            borderRadius="xl"
            onClick={() => navigate("/admin/tenants")}
            _hover={{ shadow: "md", transform: "translateX(-2px)" }}
          >
            <LuArrowLeft />
          </IconButton>
        </Flex>

        {/* FORMULÁRIO DE INFRAESTRUTURA */}
        <Box 
          bg="white" 
          p={{ base: 6, md: 10 }} 
          borderRadius="4xl" 
          shadow="0 30px 60px -12px rgba(0, 0, 0, 0.05)" 
          border="1px solid" 
          borderColor="gray.100"
        >
          <TenantForm 
            initialData={tenant} 
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </Box>

        <Text mt={8} textAlign="center" fontSize="xs" color="gray.400" fontWeight="bold" letterSpacing="1px">
          SISTEMA AURA v3 • ADMIN CLUSTER
        </Text>
      </Container>
    </Box>
  );
}