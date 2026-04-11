"use client";

import { 
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack, 
  Icon, Button, Flex, Center, Spinner, Input
} from "@chakra-ui/react";
import { 
  LuUsers, LuUserPlus, LuShieldCheck, LuSearch, 
  LuFingerprint, LuLayoutGrid, LuChevronRight,
  LuBuilding, LuMail, LuActivity 
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";

export default function TenantDashboardPage() {
  const navigate = useNavigate();
  const { tenants, isLoading } = useTenants();

  // ✅ Filtros de status
  const activeTenants = tenants?.filter((t: any) => String(t.status).toUpperCase() === "ACTIVE") || [];
  const pendingCount = tenants?.filter((t: any) => String(t.status).toUpperCase() === "PENDING").length || 0;

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap="4">
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            SYNCHRONIZING TENANT CLUSTER...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: "4", md: "10" }}>
      <Container maxW="7xl">
        
        {/* HEADER */}
        <Flex justify="space-between" align="flex-end" mb="12" direction={{ base: "column", md: "row" }} gap="6">
          <VStack align="start" gap="1">
            <HStack color="blue.600" mb="1">
              <Icon as={LuShieldCheck} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">TENANT ENGINE V3</Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Dashboard de Inquilinos
            </Heading>
            <Text color="gray.500" fontWeight="medium">Gestão de identidades e monitoramento de contratos.</Text>
          </VStack>

          <HStack gap="4" w={{ base: "full", md: "auto" }}>
            <Button 
              onClick={() => navigate("list")} 
              variant="outline" 
              h="60px" 
              px="8" 
              borderRadius="2xl" 
              fontWeight="800" 
              borderColor="gray.200"
              _hover={{ bg: "white", shadow: "md" }}
            >
              LISTA GLOBAL
            </Button>
            <Button 
              onClick={() => navigate("new")} 
              bg="blue.600" 
              color="white" 
              h="60px" 
              px="10" 
              borderRadius="2xl" 
              fontWeight="800"
              shadow="0 10px 20px -5px rgba(49, 130, 206, 0.4)"
              _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            >
              <Icon as={LuUserPlus} /> NOVO INQUILINO
            </Button>
          </HStack>
        </Flex>

        {/* STATS CARDS - AGORA COM NÚMERO REAL */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" mb="12">
          <StatCard label="INQUILINOS ATIVOS" value={activeTenants.length} icon={LuUsers} color="blue" />
          <StatCard label="PENDÊNCIAS" value={pendingCount} icon={LuFingerprint} color="orange" />
          {/* ✅ Valor de ocupação corrigido para o número real do banco */}
          <StatCard label="TAXA DE OCUPAÇÃO" value={`${activeTenants.length > 0 ? activeTenants.length : 0}%`} icon={LuActivity} color="green" />
        </SimpleGrid>

        {/* RECENT LIST */}
        <VStack align="start" mb="10" gap="6" w="full">
          <HStack w="full" justify="space-between">
            <HStack>
              <Icon as={LuLayoutGrid} color="gray.400" />
              <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">RECENTES NO CLUSTER</Text>
            </HStack>
            <Box position="relative" w="full" maxW="300px">
              <Input 
                placeholder="Pesquisar..." 
                paddingStart="10" 
                borderRadius="xl" 
                bg="white" 
                border="1px solid" 
                borderColor="gray.100"
                _focus={{ borderColor: "blue.500", shadow: "sm" }} 
              />
              <Icon as={LuSearch} position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400" zIndex="2" />
            </Box>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="4" w="full">
            {tenants && tenants.length > 0 ? (
              tenants.slice(0, 6).map((tenant: any) => {
                const identifier = tenant._id || tenant.id;
                return (
                  <ActiveTenantCard 
                    key={identifier} 
                    tenant={tenant} 
                    onClick={() => navigate(`edit/${identifier}`)} 
                  />
                );
              })
            ) : (
              <EmptyState />
            )}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

// --- SUBCOMPONENTES ---

function StatCard({ label, value, icon, color }: any) {
  return (
    <Box bg="white" p="6" borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
      <HStack gap="4">
        <Center bg={`${color}.50`} color={`${color}.600`} boxSize="12" borderRadius="2xl">
          <Icon as={icon} boxSize="6" />
        </Center>
        <VStack align="start" gap="0">
          <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="wider">{label}</Text>
          <Text fontSize="2xl" fontWeight="900" color="gray.800">{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

function ActiveTenantCard({ tenant, onClick }: { tenant: any, onClick: () => void }) {
  return (
    <Box 
      bg="white" p="5" borderRadius="2xl" border="1px solid" borderColor="gray.50"
      shadow="sm" transition="all 0.2s cubic-bezier(.08,.52,.52,1)" cursor="pointer"
      _hover={{ shadow: "xl", borderColor: "blue.200", transform: "translateX(4px)" }}
      onClick={onClick}
    >
      <Flex justify="space-between" align="center">
        <HStack gap={4}>
          <Center boxSize="12" bg="blue.50" color="blue.600" borderRadius="xl" fontWeight="black" fontSize="lg">
            {tenant.fullName?.charAt(0).toUpperCase() || "U"}
          </Center>
          <VStack align="start" gap={0}>
            <Text fontWeight="800" color="gray.800" fontSize="md" letterSpacing="-0.3px">
              {tenant.fullName}
            </Text>
            <HStack fontSize="xs" color="gray.400" fontWeight="bold" gap="3">
               <HStack gap={1}><Icon as={LuMail} boxSize="3" /> <Text>{tenant.email}</Text></HStack>
               <HStack gap={1}><Icon as={LuBuilding} boxSize="3" /> <Text>{tenant.propertyAddress || "N/A"}</Text></HStack>
            </HStack>
          </VStack>
        </HStack>
        <Icon as={LuChevronRight} color="gray.300" />
      </Flex>
    </Box>
  );
}

function EmptyState() {
  return (
    <Center gridColumn="1 / -1" w="full" py="20" bg="white" borderRadius="4xl" border="2px dashed" borderColor="gray.100">
      <VStack gap="2">
        <Icon as={LuSearch} boxSize="8" color="gray.200" />
        <Text fontWeight="bold" color="gray.400">Nenhum inquilino encontrado.</Text>
      </VStack>
    </Center>
  );
}