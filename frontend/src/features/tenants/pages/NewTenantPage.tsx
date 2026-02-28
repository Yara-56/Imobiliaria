"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Icon,
  Separator,
  Container,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import {
  LuUserPlus,
  LuFileText,
  LuCreditCard,
  LuArrowLeft,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/TenantForm";
import { toaster } from "@/components/ui/toaster";

export default function NewTenantPage() {
  const navigate = useNavigate();
  const { createTenant, isCreating } = useTenants();

  const handleCreateTenant = async (formData: FormData) => {
    try {
      await createTenant(formData);

      toaster.create({
        title: "Inquilino criado com sucesso",
        description: "Redirecionando para a listagem...",
        type: "success",
      });

      // 🔥 Redireciona para página principal
      navigate("/tenants");
    } catch (error: any) {
      toaster.create({
        title: "Erro ao criar inquilino",
        description:
          error?.response?.data?.message ||
          "Falha ao conectar com o servidor.",
        type: "error",
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="4xl">
        {/* BOTÃO VOLTAR */}
        <Button
          variant="ghost"
          mb={6}
          onClick={() => navigate("/tenants")}
        >
          <LuArrowLeft style={{ marginRight: "8px" }} />
          Voltar
        </Button>

        {/* HEADER */}
        <VStack align="start" gap={6} mb={10}>
          <HStack gap={4}>
            <Box bg="blue.50" p={3} borderRadius="2xl" color="blue.600">
              <LuUserPlus size={32} />
            </Box>
            <VStack align="start" gap={0}>
              <Heading size="xl" fontWeight="900">
                Novo Inquilino
              </Heading>
              <Text color="gray.500">
                Cadastre o locatário para vincular a contratos e cobranças.
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* LINHA DE ETAPAS */}
        <SimpleGrid columns={3} gap={4} mb={12}>
          <StatusStep icon={LuUserPlus} label="Dados Pessoais" active />
          <StatusStep icon={LuFileText} label="Documentos" />
          <StatusStep icon={LuCreditCard} label="Pagamento" />
        </SimpleGrid>

        {/* FORM */}
        <Box
          p={10}
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 20px 40px rgba(0,0,0,0.02)"
        >
          <TenantForm
            onSubmit={handleCreateTenant}
            isLoading={isCreating}
          />

          {isCreating && (
            <HStack mt={6}>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">
                Salvando dados...
              </Text>
            </HStack>
          )}
        </Box>
      </Container>
    </Box>
  );
}

function StatusStep({
  icon: IconComp,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <HStack
      color={active ? "blue.600" : "gray.400"}
      gap={3}
      flex="1"
    >
      <Icon as={IconComp} />
      <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap">
        {label}
      </Text>
      <Separator
        borderColor={active ? "blue.200" : "gray.100"}
      />
    </HStack>
  );
}