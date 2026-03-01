"use client";

import { 
  Box, Heading, Text, VStack, HStack, Icon, Container, Button, Center, Spinner 
} from "@chakra-ui/react";
import { LuTriangleAlert, LuUsers, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";

/**
 * 🚀 TenantsPage: Dashboard de Locatários
 * Mostra todos os locatários e permite criar/editar
 */
export default function TenantsPage() {
  const navigate = useNavigate();

  // Hook customizado que busca os locatários via API
  const { tenants, isLoading, isError } = useTenants();

  // 1️⃣ Loading
  if (isLoading) return (
    <Center h="60vh">
      <VStack gap={4}>
        <Spinner color="blue.500" size="xl" borderWidth="4px" />
        <Text color="gray.500" fontSize="sm" fontWeight="bold">Carregando locatários...</Text>
      </VStack>
    </Center>
  );

  // 2️⃣ Error
  if (isError) return (
    <Center h="60vh">
      <VStack color="red.500" gap={4}>
        <LuTriangleAlert size={48} />
        <VStack gap={1}>
          <Text fontWeight="black" fontSize="lg">Erro ao carregar locatários</Text>
          <Text color="gray.500" fontSize="sm">Não foi possível conectar ao servidor.</Text>
        </VStack>
        <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </VStack>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="6xl">
        
        {/* HEADER */}
        <HStack justify="space-between" mb={10} flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" gap={3}>
              <Icon as={LuUsers} boxSize={8} />
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Locatários</Heading>
            </HStack>
            <Text color="gray.500">Gerencie todos os locatários do sistema.</Text>
          </VStack>

          <Button 
            bg="blue.600" 
            color="white" 
            h="60px" 
            px={8} 
            fontSize="md"
            fontWeight="bold"
            borderRadius="2xl"
            _hover={{ bg: "blue.700", transform: "translateY(-2px)", shadow: "xl" }}
            onClick={() => navigate("new")} 
          >
            <LuUserPlus size={20} style={{ marginRight: '10px' }} />
            Novo Locatário
          </Button>
        </HStack>

        {/* LISTA DE TENANTS */}
        <VStack align="stretch" gap={4}>
          {tenants.length === 0 ? (
            <Center p={20} border="2px dashed" borderColor="gray.100" borderRadius="3xl">
              <VStack gap={2}>
                <Text color="gray.400" fontWeight="bold">Nenhum locatário encontrado.</Text>
                <Text color="gray.300" fontSize="xs">Clique em "Novo Locatário" para começar.</Text>
              </VStack>
            </Center>
          ) : (
            tenants.map((tenant: any) => (
              <Box 
                key={tenant.id} 
                p={6} 
                borderRadius="2xl" 
                border="1px solid" 
                borderColor="gray.100"
                transition="all 0.2s ease-in-out"
                bg="white"
                _hover={{ 
                  shadow: "2xl", 
                  borderColor: "blue.200", 
                  transform: "scale(1.01)",
                  cursor: "pointer" 
                }}
                onClick={() => navigate(`edit/${tenant.id}`)}
              >
                <HStack justify="space-between">
                  <HStack gap={4}>
                    <Center bg="blue.50" color="blue.600" w="12" h="12" borderRadius="xl">
                      <LuUsers size={24} />
                    </Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="lg" color="slate.800">
                        {tenant.fullName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">{tenant.email}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack gap={3}>
                    <VStack align="end" gap={0} display={{ base: "none", md: "flex" }}>
                      <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="widest">ID DE ISOLAMENTO</Text>
                      <Text fontSize="sm" fontWeight="bold" color="blue.500">{tenant.tenantId}</Text>
                    </VStack>
                    <Box bg="green.50" color="green.600" px={3} py={1} borderRadius="lg" fontSize="xs" fontWeight="bold">
                      ATIVO
                    </Box>
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </VStack>

        <Text mt={12} textAlign="center" fontSize="xs" color="gray.300" fontWeight="bold" letterSpacing="2px">
          AURA IMOBISYS • CLUSTER ADMINISTRATION
        </Text>
      </Container>
    </Box>
  );
}