"use client";

import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, Container, Heading, Text, VStack, 
  Spinner, Center, Flex, IconButton, Button, Badge, Stack 
} from "@chakra-ui/react";
import { LuArrowLeft, LuShieldCheck, LuCircleAlert } from "react-icons/lu";

import { useTenants } from "../hooks/useTenants";
// ✅ Importação nomeada conforme corrigimos anteriormente
import { QuickAddTenantModal as TenantForm } from "../components/QuickAddTenantModal";

export default function EditTenantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✅ CORREÇÃO: Pegando as variáveis do lugar certo no seu hook
  const { 
    tenant, 
    isLoading, // listQuery.isLoading
    actions, 
    mutations 
  } = useTenants(id);

  const handleUpdate = async (formData: any) => {
    if (!id) return;
    try {
      await actions.update({ id, data: formData });
      navigate("/admin/tenants");
    } catch (error) {
      // O Toaster já é chamado dentro do hook (onError)
    }
  };

  // 1. LOADING DO DETALHE (Busca inicial)
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

  // 2. ERRO (Se não carregando e sem tenant)
  if (!tenant && !isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <Container maxW="md">
        <VStack gap={6} p={10} bg="white" borderRadius="3xl" shadow="2xl" textAlign="center">
          <Box color="red.500" bg="red.50" p={4} borderRadius="full">
            <LuCircleAlert size={40} />
          </Box>
          <VStack gap={2}>
            <Heading size="md" fontWeight="800">Node não identificado</Heading>
            <Text color="gray.500" fontSize="sm">A instância solicitada não existe.</Text>
          </VStack>
          <Button w="full" colorPalette="blue" size="lg" borderRadius="xl" onClick={() => navigate("/admin/tenants")}>
            Voltar ao Dashboard
          </Button>
        </VStack>
      </Container>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="2xl">
        <Flex align="center" justify="space-between" mb={10}>
          <Stack gap={1}>
            <Flex align="center" gap={2} color="blue.600">
              <LuShieldCheck size={18} />
              <Badge variant="subtle" colorPalette="blue" fontSize="10px" borderRadius="md" px={2}>
                CONFIGURAÇÃO MASTER
              </Badge>
            </Flex>
            <Heading size="xl" fontWeight="900" color="gray.800" letterSpacing="-1.5px">
              Ajustar Locatário
            </Heading>
          </Stack>
          
          <IconButton
            aria-label="Voltar"
            variant="outline"
            bg="white"
            borderRadius="xl"
            onClick={() => navigate("/admin/tenants")}
          >
            <LuArrowLeft />
          </IconButton>
        </Flex>

        <Box bg="white" p={10} borderRadius="4xl" shadow="sm" border="1px solid" borderColor="gray.100">
          <TenantForm 
            // @ts-ignore - Depende da prop no seu form
            initialData={tenant} 
            onSubmit={handleUpdate}
            isLoading={mutations.isUpdating} // ✅ BUSCANDO DO LUGAR CERTO
          />
        </Box>
      </Container>
    </Box>
  );
}