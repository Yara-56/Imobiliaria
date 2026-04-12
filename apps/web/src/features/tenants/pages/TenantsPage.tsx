"use client";

import { 
  Box, Heading, Text, VStack, HStack, Icon, Container, Button, Center, Spinner, Flex, SimpleGrid,
  Badge // ✅ Adicionado ao import para resolver ts(2304)
} from "@chakra-ui/react";
import { LuUsers, LuUserPlus, LuShieldCheck, LuSearch, LuMail, LuFingerprint } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";

export default function TenantsPage() {
  const navigate = useNavigate();
  
  // ✅ Removido 'isError' não utilizado para resolver ts(6133)
  // ✅ Ajustado para pegar apenas o que o hook realmente retorna
  const { tenants, isLoading } = (useTenants() as any) || {};

  if (isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <VStack gap={4}>
        <Spinner color="blue.500" size="xl" borderWidth="4px" />
        <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
          SINCRONIZANDO BANCO DE LOCATÁRIOS...
        </Text>
      </VStack>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="7xl">
        
        {/* HEADER */}
        <Flex justify="space-between" align="flex-end" mb={10} direction={{ base: "column", md: "row" }} gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuShieldCheck} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">HOMEFLUX SECURE V3</Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Locatários
            </Heading>
            <Text color="gray.500" fontSize="lg" fontWeight="medium">
              Gestão de identidades e perfis de acesso ao cluster.
            </Text>
          </VStack>

          <Button 
            onClick={() => navigate("new")} 
            bg="blue.600" 
            color="white" 
            h="65px" 
            px={10} 
            borderRadius="2xl" 
            fontWeight="900"
            shadow="xl"
            _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            gap={3}
          >
            <Icon as={LuUserPlus} />
            NOVO LOCATÁRIO
          </Button>
        </Flex>

        {/* ESTATÍSTICAS RÁPIDAS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
          <Box bg="white" p={6} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <HStack gap={4}>
              <Center bg="blue.50" color="blue.600" p={3} borderRadius="2xl">
                {/* ✅ Corrigido: Usando 'boxSize' ou tokens de string ('md', 'lg') para resolver ts(2322) */}
                <Icon as={LuUsers} boxSize="6" />
              </Center>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="black" color="gray.400">TOTAL DE CLIENTES</Text>
                <Text fontSize="2xl" fontWeight="900" color="gray.800">{tenants?.length || 0}</Text>
              </VStack>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* LISTAGEM */}
        <VStack align="stretch" gap={4}>
          {!tenants || tenants.length === 0 ? (
            <Center p={24} bg="white" borderRadius="4xl" border="1px solid" borderColor="gray.100">
              <VStack gap={6}>
                <Center bg="gray.50" p={8} borderRadius="full">
                  <Icon as={LuSearch} boxSize="12" color="gray.200" />
                </Center>
                <Text color="gray.800" fontWeight="900" fontSize="xl">Nenhum locatário no cluster</Text>
              </VStack>
            </Center>
          ) : (
            tenants.map((tenant: any) => (
              <Box 
                key={tenant._id || tenant.id} 
                p={6} 
                bg="white"
                borderRadius="3xl" 
                border="1px solid" 
                borderColor="gray.100"
                transition="all 0.3s ease"
                _hover={{ 
                  shadow: "xl", 
                  borderColor: "blue.200", 
                  transform: "translateY(-2px)",
                  cursor: "pointer" 
                }}
                onClick={() => navigate(`edit/${tenant._id || tenant.id}`)}
              >
                <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
                  <HStack gap={5}>
                    <Center bg="gray.50" color="gray.400" w="14" h="14" borderRadius="2xl">
                      <Icon as={LuUsers} boxSize="7" />
                    </Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="xl" color="gray.800" letterSpacing="-0.5px">
                        {tenant.fullName}
                      </Text>
                      <HStack color="gray.500" fontSize="sm">
                        {/* ✅ Corrigido: size="xs" em vez de número */}
                        <Icon as={LuMail} boxSize="4" />
                        <Text fontWeight="medium">{tenant.email}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  <HStack gap={8}>
                    <VStack align="end" gap={0} display={{ base: "none", lg: "flex" }}>
                      <HStack color="gray.400" mb={1}>
                        <Icon as={LuFingerprint} boxSize="3" />
                        <Text fontSize="10px" fontWeight="black" letterSpacing="widest">ID DE ISOLAMENTO</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color="blue.600" bg="blue.50" px={3} py={1} borderRadius="lg">
                        {tenant.tenantId || "---"}
                      </Text>
                    </VStack>
                    
                    <Badge colorPalette="green" variant="subtle" px={4} py={2} borderRadius="xl" fontWeight="black">
                      ATIVO
                    </Badge>
                  </HStack>
                </Flex>
              </Box>
            ))
          )}
        </VStack>
      </Container>
    </Box>
  );
}