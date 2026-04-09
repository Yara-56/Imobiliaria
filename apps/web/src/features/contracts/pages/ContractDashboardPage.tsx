"use client";

import { 
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack, 
  Icon, Button, Badge, Flex, Center, Spinner, Separator
} from "@chakra-ui/react.js";
import { 
  LuSignature, 
  LuUsers, 
  LuBuilding2, 
  LuChevronRight, 
  LuPlus, 
  LuShieldCheck, 
  LuListOrdered,
  LuLayoutGrid
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../hooks/useContracts";

export default function ContractDashboardPage() {
  const navigate = useNavigate();
  const { contracts, isLoading } = useContracts();

  const activeContracts = contracts?.filter(c => c.status === "ACTIVE") || [];

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            CARREGANDO DASHBOARD...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="7xl">
        
        {/* HEADER SAAS STYLE */}
        <Flex justify="space-between" align="center" mb={12} direction={{ base: "column", md: "row" }} gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuShieldCheck} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">CONTRACT CORE V3</Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Central de Contratos
            </Heading>
            <Text color="gray.500" fontWeight="medium">Gerencie modelos e monitore vigências em tempo real.</Text>
          </VStack>

          <HStack gap={4}>
             <Button 
              onClick={() => navigate("list")} 
              variant="outline" borderColor="gray.200" h="65px" px={8} borderRadius="2xl" fontWeight="900"
              _hover={{ bg: "white", shadow: "md" }}
            >
              <Icon as={LuListOrdered} mr={2} /> VER TODOS
            </Button>
            
            <Button 
              onClick={() => navigate("new")} 
              bg="blue.600" color="white" h="65px" px={10} borderRadius="2xl" fontWeight="900" shadow="xl"
              _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            >
              <Icon as={LuPlus} mr={2} /> NOVO CONTRATO
            </Button>
          </HStack>
        </Flex>

        {/* 📑 SEÇÃO 1: TEMPLATES */}
        <VStack align="start" mb={10} gap={4} w="full">
          <HStack w="full" justify="space-between">
            <HStack>
              <Icon as={LuLayoutGrid} color="gray.400" />
              <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
                MODELOS DISPONÍVEIS
              </Text>
            </HStack>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <TemplateCard 
              title="Locação Residencial (CPF)" 
              description="Ideal para pessoas físicas. Inclui cláusulas de fiador e caução padrão."
              icon={LuUsers}
              colorScheme="blue"
              onClick={() => navigate("new?type=CPF")}
            />
            <TemplateCard 
              title="Locação Comercial (CNPJ)" 
              description="Contrato jurídico para empresas. Foco em renovatórias e multas comerciais."
              icon={LuBuilding2}
              colorScheme="purple"
              onClick={() => navigate("new?type=CNPJ")}
            />
          </SimpleGrid>
        </VStack>

        {/* 📅 SEÇÃO 2: MONITOR DE ATIVOS */}
        <VStack align="start" gap={6} w="full">
          <HStack w="full" justify="space-between" mb={2}>
            <HStack gap={4}>
              <Heading size="md" fontWeight="900" color="gray.700">Vencimentos Próximos</Heading>
              <Badge colorPalette="blue" variant="solid" borderRadius="full" px={3}>
                {activeContracts.length} ATIVOS
              </Badge>
            </HStack>
            {/* ✅ CORRIGIDO: variant="plain" no lugar de "link" */}
            <Button variant="plain" colorPalette="blue" size="sm" fontWeight="black" onClick={() => navigate("list")}>
              VER LISTA COMPLETA <Icon as={LuChevronRight} ml={1} />
            </Button>
          </HStack>

          {activeContracts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} w="full">
              {activeContracts.slice(0, 4).map((contract) => (
                <ActiveContractCard key={contract._id} contract={contract} />
              ))}
            </SimpleGrid>
          ) : (
            <Center w="full" py={20} bg="white" borderRadius="3xl" border="1px dashed" borderColor="gray.200">
              <VStack gap={2}>
                <Text fontWeight="bold" color="gray.400">Nenhum contrato ativo para monitorar.</Text>
                {/* ✅ CORRIGIDO: variant="plain" */}
                <Button variant="plain" colorPalette="blue" onClick={() => navigate("new")}>Gerar primeiro contrato agora</Button>
              </VStack>
            </Center>
          )}
        </VStack>

      </Container>
    </Box>
  );
}

function TemplateCard({ title, description, icon, colorScheme, onClick }: any) {
  return (
    <Box 
      bg="white" p={8} borderRadius="4xl" border="1px solid" borderColor="gray.100" 
      transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
      _hover={{ shadow: "2xl", transform: "scale(1.02)", borderColor: `${colorScheme}.200` }}
      onClick={onClick}
      cursor="pointer"
      role="group"
    >
      <VStack align="start" gap={5}>
        <Center bg={`${colorScheme}.50`} color={`${colorScheme}.600`} boxSize="64px" borderRadius="2xl" transition="0.3s" _groupHover={{ bg: `${colorScheme}.600`, color: "white" }}>
          <Icon as={icon} boxSize={8} />
        </Center>
        <Box>
          <Heading size="md" fontWeight="900" mb={2} color="gray.800">{title}</Heading>
          <Text fontSize="sm" color="gray.500" lineHeight="tall">{description}</Text>
        </Box>
        {/* ✅ CORRIGIDO: variant="plain" */}
        <Button variant="plain" colorPalette={colorScheme} fontWeight="black" p={0} _groupHover={{ transform: "translateX(5px)" }} transition="0.3s">
          UTILIZAR MODELO <Icon as={LuChevronRight} ml={1} />
        </Button>
      </VStack>
    </Box>
  );
}

function ActiveContractCard({ contract }: any) {
  return (
    <Box 
      bg="white" p={5} borderRadius="2xl" border="1px solid" borderColor="gray.50"
      shadow="sm" _hover={{ shadow: "md", borderColor: "blue.100" }}
    >
      <Flex justify="space-between" align="center">
        <HStack gap={4}>
          <Center bg="blue.50" color="blue.600" boxSize="50px" borderRadius="xl">
            <Icon as={LuSignature} />
          </Center>
          <VStack align="start" gap={0}>
            <Text fontWeight="900" color="gray.800" fontSize="md">{contract.renter?.fullName || "Locatário"}</Text>
            <Text fontSize="xs" color="gray.400" fontWeight="bold">{contract.property?.address || "Endereço Pendente"}</Text>
          </VStack>
        </HStack>

        <VStack align="end" gap={0}>
          <Text fontSize="10px" fontWeight="black" color="gray.300" letterSpacing="widest">VENCIMENTO</Text>
          <Text fontWeight="black" color="blue.700">DIA {contract.dueDay || "--"}</Text>
        </VStack>
      </Flex>
    </Box>
  );
}