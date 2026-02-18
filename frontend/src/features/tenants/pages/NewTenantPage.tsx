"use client";

import { 
  Box, Heading, Text, VStack, SimpleGrid, 
  Button, Icon, Separator, Container, HStack // ✅ Adicionados: Container e HStack
} from "@chakra-ui/react";
import { LuUserPlus, LuFileText, LuCreditCard, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import TenantForm from "../components/TenantForm";

export default function NewTenantPage() {
  const navigate = useNavigate();

  const handleCreateTenant = (formData: FormData) => {
    // 🛡️ Cybersecurity: Os dados chegam aqui prontos para serem enviados à API
    console.log("Enviando para o Backend:", Object.fromEntries(formData));
    // Aqui você chamará seu serviço: await tenantService.create(formData);
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="4xl">
        <Button 
          variant="ghost" 
          mb={6} 
          onClick={() => navigate(-1)} 
        >
          <LuArrowLeft style={{ marginRight: '8px' }} /> {/* ✅ Ajustado para Chakra v3 */}
          Voltar
        </Button>

        <VStack align="start" gap={6} mb={10}>
          <HStack gap={4}>
            <Box bg="blue.50" p={3} borderRadius="2xl" color="blue.600">
              <LuUserPlus size={32} />
            </Box>
            <VStack align="start" gap={0}>
              <Heading size="xl" fontWeight="900">Novo Inquilino</Heading>
              <Text color="gray.500">Cadastre o locatário para vincular a contratos e cobranças.</Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Linha do Tempo de Cadastro (UX Moderna) */}
        <SimpleGrid columns={3} gap={4} mb={12}>
          <StatusStep icon={LuUserPlus} label="Dados Pessoais" active />
          <StatusStep icon={LuFileText} label="Documentos" />
          <StatusStep icon={LuCreditCard} label="Pagamento" />
        </SimpleGrid>

        <Box 
          p={10} 
          borderRadius="3xl" 
          border="1px solid" 
          borderColor="gray.100" 
          boxShadow="0 20px 40px rgba(0,0,0,0.02)"
        >
          <TenantForm onSubmit={handleCreateTenant} isLoading={false} />
        </Box>
      </Container>
    </Box>
  );
}

function StatusStep({ icon: IconComp, label, active }: any) {
  return (
    <HStack color={active ? "blue.600" : "gray.400"} gap={3} flex="1">
      <Icon as={IconComp} />
      <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap">{label}</Text>
      <Separator borderColor={active ? "blue.200" : "gray.100"} />
    </HStack>
  );
}