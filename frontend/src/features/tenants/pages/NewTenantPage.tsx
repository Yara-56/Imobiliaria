"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Separator,
  Container,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  LuUserPlus,
  LuFileText,
  LuCreditCard,
  LuArrowLeft,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/TenantForm"; // ✅ Verifique se o caminho está correto
import { toaster } from "@/components/ui/toaster";

export default function NewTenantPage() {
  const navigate = useNavigate();
  const { createTenant, isCreating } = useTenants();

  const handleCreateTenant = async (formData: FormData) => {
    try {
      await createTenant(formData);
      toaster.create({
        title: "Inquilino cadastrado",
        description: "Os dados foram salvos com sucesso.",
        type: "success",
      });
      navigate("/tenants");
    } catch (error: any) {
      toaster.create({
        title: "Erro no cadastro",
        description: error?.response?.data?.message || "Erro ao conectar com o servidor.",
        type: "error",
      });
    }
  };

  return (
    // ✅ Fundo levemente acinzentado para o card branco "saltar"
    <Box p={{ base: 4, md: 10 }} bg="gray.50/50" minH="100vh">
      <Container maxW="4xl">
        
        {/* BOTÃO VOLTAR - Mais discreto */}
        <Button
          variant="ghost"
          mb={8}
          onClick={() => navigate("/tenants")}
          color="gray.500"
          _hover={{ color: "blue.600", bg: "white" }}
        >
          <LuArrowLeft style={{ marginRight: "8px" }} />
          Voltar para listagem
        </Button>

        {/* HEADER - Título em grafite (gray.700) em vez de preto */}
        <VStack align="start" gap={6} mb={10}>
          <HStack gap={5}>
            <Center bg="blue.600" p={4} borderRadius="2xl" color="white" shadow="md">
              <LuUserPlus size={28} />
            </Center>
            <VStack align="start" gap={1}>
              <Heading size="lg" fontWeight="800" color="gray.700" letterSpacing="tight">
                Novo Inquilino
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Cadastre as informações para gerar o contrato.
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* STEPPER - Suave */}
        <SimpleGrid columns={3} gap={6} mb={12}>
          <StatusStep icon={<LuUserPlus />} label="Identificação" active />
          <StatusStep icon={<LuFileText />} label="Documentos" />
          <StatusStep icon={<LuCreditCard />} label="Financeiro" />
        </SimpleGrid>

        {/* FORM CONTAINER - Aqui tiramos o peso do preto */}
        <Box
          p={{ base: 6, md: 12 }}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100" // ✅ Borda muito clara
          boxShadow="0 10px 40px rgba(0,0,0,0.03)" // ✅ Sombra muito sutil
        >
          <TenantForm
            onSubmit={handleCreateTenant}
            isLoading={isCreating}
          />

          {isCreating && (
            <Center mt={8} p={4} bg="blue.50" borderRadius="xl">
              <HStack gap={3}>
                <Spinner size="sm" color="blue.500" />
                <Text fontSize="xs" fontWeight="bold" color="blue.600" letterSpacing="widest">
                  SALVANDO NO BANCO DE DADOS...
                </Text>
              </HStack>
            </Center>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// ✅ Componente de Etapa com cores balanceadas
function StatusStep({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <HStack color={active ? "blue.600" : "gray.300"} gap={3} flex="1">
      <Box fontSize="lg">{icon}</Box>
      <Text fontWeight="800" fontSize="10px" textTransform="uppercase" letterSpacing="widest">
        {label}
      </Text>
      <Box flex="1" h="1px" bg={active ? "blue.100" : "gray.50"} />
    </HStack>
  );
}