"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  Flex,
  Center,
  Spinner,
  Grid,
} from "@chakra-ui/react";

import {
  LuHouse,
  LuShieldCheck,
  LuListOrdered,
  LuPlus,
  LuMapPin,
  LuLayers,
  LuWrench,
  LuUsers,
  LuCircleDollarSign,
} from "react-icons/lu";

import { useNavigate } from "react-router-dom";

// HOOKS OFICIAIS
import { useProperties } from "../hooks/useProperties";

export default function PropertyDashboardPage() {
  const navigate = useNavigate();
  
  const { properties: rawProperties, isLoading } = (useProperties() as any) || {};
  const properties = Array.isArray(rawProperties) ? rawProperties : rawProperties?.data?.properties || rawProperties?.data || [];

  // Mock temporário enquanto o módulo de contratos não for construído
  const contracts: any[] = [];

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text
            fontWeight="black"
            color="gray.400"
            fontSize="xs"
            letterSpacing="widest"
          >
            CARREGANDO IMÓVEIS...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 🔥 KPIs com enum REAL
  const total = properties.length;
  const available = properties.filter(
    (p: any) => p.status === "AVAILABLE"
  ).length;
  const rented = properties.filter(
    (p: any) => p.status === "RENTED"
  ).length;
  const maintenance = properties.filter(
    (p: any) => p.status === "MAINTENANCE"
  ).length;
  const inactive = properties.filter(
    (p: any) => p.status === "INACTIVE"
  ).length;

  // 🔥 Lógica de ocupação real
  const occupancyRate =
    total > 0 ? Math.round((rented / total) * 100) : 0;

  // 🔥 Total de renda mensal somada dos imóveis alugados
  const totalRentValue = contracts
    ?.filter((c: any) => c.status === "ACTIVE")
    ?.reduce((sum: number, c: any) => sum + (c.rentAmount || 0), 0)
    ?.toFixed(2);

  return (
    <Box bg="#F7F8FA" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="7xl">
        {/* HEADER */}
        <Flex
          justify="space-between"
          align="center"
          mb={12}
          direction={{ base: "column", md: "row" }}
          gap={6}
        >
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuShieldCheck} />
              <Text
                fontSize="xs"
                fontWeight="black"
                letterSpacing="widest"
              >
                PROPERTY CORE V2
              </Text>
            </HStack>

            <Heading
              size="2xl"
              fontWeight="900"
              color="gray.800"
              letterSpacing="-2px"
            >
              Central de Imóveis
            </Heading>

            <Text color="gray.500" fontWeight="medium">
              Gestão completa do portfólio imobiliário com insights,
              KPIs, contratos ativos e ocupação.
            </Text>
          </VStack>

          <HStack gap={4}>
            <Button
              onClick={() => navigate("list")}
              variant="outline"
              borderColor="gray.200"
              h="65px"
              px={8}
              borderRadius="2xl"
              fontWeight="900"
              _hover={{ bg: "white", boxShadow: "md" }}
            >
              <Icon as={LuListOrdered} mr={2} /> VER TODOS
            </Button>

            <Button
              onClick={() => navigate("new")}
              bg="blue.600"
              color="white"
              h="65px"
              px={10}
              borderRadius="2xl"
              fontWeight="900"
              boxShadow="xl"
              _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            >
              <Icon as={LuPlus} mr={2} /> NOVO IMÓVEL
            </Button>
          </HStack>
        </Flex>

        {/* SMART INSIGHTS (IA IMOBILIÁRIA) - Oculto até a criação do componente */}
        {/* <SmartInsightsProperties
          data={{
            total,
            available,
            rented,
            maintenance,
            occupancyRate,
            totalRentValue,
          }}
        /> */}

        {/* GRID DE KPIs — estilo do Dashboard principal */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          gap={8}
          mt={12}
        >
          <KpiCard
            title="TOTAL DE IMÓVEIS"
            value={total}
            icon={LuLayers}
            color="blue"
          />

          <KpiCard
            title="DISPONÍVEIS"
            value={available}
            icon={LuHouse}
            color="green"
          />

          <KpiCard
            title="ALUGADOS"
            value={rented}
            icon={LuUsers}
            color="purple"
          />

          <KpiCard
            title="MANUTENÇÃO"
            value={maintenance}
            icon={LuWrench}
            color="orange"
          />
        </SimpleGrid>

        {/* BLOCOS: Ocupação e Faturamento */}
        <Grid
          gridTemplateColumns={{ base: "1fr", xl: "2fr 1fr" }}
          gap={10}
          mt={12}
        >
          {/* BLOCOS DE STATUS */}
          <Box
            bg="white"
            p={10}
            borderRadius="3xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Heading
              size="md"
              mb={10}
              fontWeight="900"
              color="gray.800"
              letterSpacing="-0.5px"
            >
              Status Geral do Portfólio
            </Heading>

            <VStack gap={6} align="start">
              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                {available} imóveis disponíveis
              </Text>

              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                {rented} imóveis alugados
              </Text>

              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                {maintenance} em manutenção
              </Text>

              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                {inactive} inativos
              </Text>
            </VStack>
          </Box>

          {/* OCUPAÇÃO + RENT VALUE */}
          <VStack gap={8} align="stretch">
            <Box
              bg="blue.600"
              p={10}
              borderRadius="3xl"
              color="white"
              textAlign="center"
              boxShadow="xl"
            >
              <Text
                fontWeight="800"
                fontSize="xs"
                textTransform="uppercase"
                mb={2}
                opacity={0.8}
                letterSpacing="widest"
              >
                Taxa de Ocupação
              </Text>

              <Text
                fontSize="7xl"
                fontWeight="900"
                letterSpacing="-3px"
              >
                {occupancyRate}%
              </Text>

              <Text fontSize="sm" fontWeight="bold">
                Imóveis Alugados
              </Text>
            </Box>

            <Box
              bg="white"
              p={10}
              borderRadius="3xl"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <Text fontWeight="900" color="gray.800" mb={6}>
                Faturamento Mensal dos Imóveis
              </Text>

              <Flex align="center" justify="space-between">
                <Text
                  fontSize="3xl"
                  color="green.500"
                  fontWeight="900"
                >
                  R$ {totalRentValue}
                </Text>

                <Icon
                  as={LuCircleDollarSign}
                  color="green.200"
                  boxSize={10}
                />
              </Flex>
            </Box>
          </VStack>
        </Grid>

        {/* LISTA DESTAQUE (Cards rápidos) */}
        <VStack align="start" gap={6} mt={16}>
          <Heading
            size="md"
            fontWeight="900"
            color="gray.700"
          >
            Imóveis em Destaque
          </Heading>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} w="full">
          {properties.slice(0, 6).map((p: any) => (
              <ActivePropertyCard key={p.id} property={p} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

/* COMPONENTES AUXILIARES */
function KpiCard({ icon, title, value, color }: any) {
  return (
    <Box p={6} bg="white" borderRadius="3xl" boxShadow="0 4px 20px rgba(0,0,0,0.02)" border="1px solid" borderColor="gray.50">
      <Flex justify="space-between" align="start" mb={4}>
        <Flex w={12} h={12} borderRadius="2xl" bg={`${color}.50`} align="center" justify="center" color={`${color}.500`}>
          <Icon as={icon} boxSize={6} />
        </Flex>
      </Flex>
      <Box>
        <Heading size="2xl" color="gray.800" fontWeight="900" letterSpacing="tight">{value}</Heading>
        <Text color="gray.500" fontSize="sm" mt={2} fontWeight="medium">{title}</Text>
      </Box>
    </Box>
  )
}

/* COMPONENTES */

function ActivePropertyCard({ property }: any) {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.50"
      boxShadow="sm"
      _hover={{ boxShadow: "md", borderColor: "blue.100" }}
    >
      <Flex justify="space-between" align="center">
        <HStack gap={4}>
          <Center
            bg="blue.50"
            color="blue.600"
            boxSize="50px"
            borderRadius="xl"
          >
            <Icon as={LuMapPin} boxSize={6} />
          </Center>

          <VStack align="start" gap={0}>
            <Text
              fontWeight="900"
              color="gray.800"
              fontSize="md"
            >
              {property.title || "Imóvel sem título"}
            </Text>

            <Text
              fontSize="xs"
              color="gray.400"
              fontWeight="bold"
            >
              {property.address || "Endereço não informado"}
            </Text>
          </VStack>
        </HStack>

        <VStack align="end" gap={0}>
          <Text
            fontSize="10px"
            fontWeight="black"
            color="gray.300"
            letterSpacing="widest"
          >
            STATUS
          </Text>

          <Text fontWeight="black" color="blue.700">
            {property.status}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}