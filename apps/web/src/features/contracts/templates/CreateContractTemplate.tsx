"use client";

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  HStack, 
  Icon, 
  Center, 
  Spinner, 
  Badge, 
  SimpleGrid,
  Flex // ✅ Corrigido: Flex adicionado aos imports
} from "@chakra-ui/react.js";
import { useNavigate } from "react-router-dom";
import { 
  LuArrowLeft, 
  LuSignature, // ✅ Corrigido: LuFileSignature agora é LuSignature
  LuShieldCheck, 
  LuInfo,
  LuLayoutDashboard 
} from "react-icons/lu";

// Componentes da Feature
import { ContractForm } from "../components/ContractForm";
import { useContracts } from "../hooks/useContracts";

// Hooks de Dependência
import { useTenants } from "../../tenants/hooks/useTenants";
import { useProperties } from "../../properties/hooks/useProperties";

export default function CreateContractTemplate() {
  const navigate = useNavigate();
  
  // Hook de Contratos (Ação de Criar)
  const { createContract, isCreating } = useContracts();
  
  // Hooks de Dependência (Carregando dados para o formulário)
  const { tenants, isLoading: loadingTenants } = useTenants();
  const { properties, isLoading: loadingProperties } = useProperties();

  const handleBack = () => navigate("/contracts");

  const onSubmit = async (data: any) => {
    try {
      await createContract(data);
      handleBack(); 
    } catch (error) {
      // Erro tratado pelo interceptor global
    }
  };

  // ⏳ ESTADO DE CARREGAMENTO
  if (loadingTenants || loadingProperties) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={6}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <VStack gap={1}>
            <Text fontWeight="black" color="gray.700" fontSize="lg">Preparando Instrumento...</Text>
            <Text color="gray.400" fontSize="xs" letterSpacing="widest">SINCRONIZANDO LOCATÁRIOS E IMÓVEIS</Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Box 
      bg="#F8FAFC" 
      minH="100vh" 
      p={{ base: 4, md: 10 }}
      backgroundImage="linear-gradient(180deg, #EDF2F7 0%, #F8FAFC 100%)"
      backgroundRepeat="no-repeat"
      backgroundSize="100% 400px"
    >
      <Container maxW="4xl">
        <VStack align="stretch" gap={8}>
          
          {/* NAVEGAÇÃO SUPERIOR */}
          <Flex justify="space-between" align="center">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              gap={2} 
              color="gray.500" 
              _hover={{ color: "blue.600", bg: "blue.50" }}
              borderRadius="xl"
            >
              <LuArrowLeft size={18} />
              Painel de Contratos
            </Button>
            
            <HStack gap={2}>
              <Badge colorPalette="blue" variant="subtle" px={3} borderRadius="lg">MVP v3.0</Badge>
              <Icon as={LuShieldCheck} color="green.500" />
            </HStack>
          </Flex>

          {/* TÍTULO DA PÁGINA */}
          <Box>
            <HStack color="blue.600" mb={2}>
              <Icon as={LuSignature} boxSize="5" />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">
                NOVA FORMALIZAÇÃO JURÍDICA
              </Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Gerar Novo Contrato
            </Heading>
            <Text color="gray.500" fontSize="lg" fontWeight="medium">
              Vincule um locatário a uma propriedade para iniciar a gestão financeira.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={10}>
            
            {/* COLUNA DO FORMULÁRIO */}
            <Box gridColumn={{ lg: "span 2" }}>
              <Box 
                bg="white" 
                p={{ base: 6, md: 10 }} 
                borderRadius="4xl" 
                shadow="2xl" 
                border="1px solid" 
                borderColor="gray.100"
              >
                <ContractForm 
                  onSubmit={onSubmit} 
                  isLoading={isCreating}
                  tenants={tenants || []}
                  properties={properties || []}
                />
              </Box>
            </Box>

            {/* COLUNA DE AJUDA */}
            <VStack align="stretch" gap={6}>
              <Box bg="blue.600" p={6} borderRadius="3xl" color="white" shadow="lg">
                <HStack mb={4}>
                  <LuInfo size={20} />
                  <Text fontWeight="bold">Dica de Gestão</Text>
                </HStack>
                <Text fontSize="sm" opacity={0.9} lineHeight="tall">
                  Certifique-se de que o <b>Locatário</b> já possui os documentos validados no cluster antes de gerar o contrato.
                </Text>
              </Box>

              <Box p={6} borderRadius="3xl" border="2px dashed" borderColor="gray.200">
                <Text fontSize="xs" fontWeight="black" color="gray.400" mb={4} letterSpacing="widest">
                  FLUXO DE AUTOMAÇÃO
                </Text>
                <VStack align="start" gap={3}>
                  <HStack color="green.500" fontSize="sm" fontWeight="bold">
                    <LuShieldCheck size={14} /> <Text>Criação de Contrato</Text>
                  </HStack>
                  <HStack color="gray.300" fontSize="sm" fontWeight="bold">
                    <LuLayoutDashboard size={14} /> <Text>Geração de Boletos</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>

          </SimpleGrid>

          <Center mt={10}>
            <Text fontSize="10px" color="gray.300" fontWeight="black" letterSpacing="4px">
              AURA IMOBISYS • SECURE DOCUMENT GENERATOR
            </Text>
          </Center>

        </VStack>
      </Container>
    </Box>
  );
}