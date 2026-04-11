"use client";

import React, { useState } from "react";
// ✅ Importação explícita de componentes para evitar conflitos com o DOM nativo
import {
  Box,
  Flex,
  Grid,
  HStack,
  VStack,
  Input,
  Icon,
  SimpleGrid,
  Container,
  Skeleton,
  Heading,
  Text // O TypeScript agora sabe que este é o componente do Chakra
} from "@chakra-ui/react";
import { 
  LuSearch, 
  LuDollarSign, 
  LuBuilding2, 
  LuFileText, 
  LuUsers 
} from "react-icons/lu";

import { useDashboard } from "../hooks/useDashboard";
import { KPICard } from "../components/KPICard";
import { RevenueChart } from "../components/RevenueChart";
import { SmartInsights } from "../components/SmartInsights";

// ✅ Importação do componente Modal
import { QuickAddTenantModal } from "../../tenants/components/QuickAddTenantModal";
import type { CreateTenantDTO } from "../../tenants/types/tenant.types";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const dashboard = useDashboard(); 

  const handleCreateTenant = async (data: CreateTenantDTO) => {
    // Integração futura com o hook de criação
    console.log("Payload recebido no Dashboard:", data);
  };

  // State de Loading Profissional
  if (dashboard?.isLoading) {
    return (
      <Container maxW="7xl" p={8}>
        <Skeleton h="70px" borderRadius="2xl" mb={10} />
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={10}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h="140px" borderRadius="3xl" />
          ))}
        </SimpleGrid>
        <Skeleton h="400px" borderRadius="3xl" />
      </Container>
    );
  }

  return (
    <Box bg="#F7F8FA" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="7xl">
        
        {/* 🛠️ ACTION BAR: BUSCA + BOTÃO MODAL */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={12} 
          gap={6} 
          direction={{ base: "column", md: "row" }}
        >
          <HStack 
            bg="white" 
            px={6} 
            borderRadius="2xl" 
            boxShadow="0 4px 12px rgba(0,0,0,0.03)" 
            border="2px solid" 
            borderColor="gray.100"
            flex={1}
            w="full"
          >
            <Icon as={LuSearch} color="gray.400" boxSize={6} />
            <Input
              placeholder="Pesquisar inquilino, imóvel ou CPF..."
              variant="flushed"
              border="none"
              fontSize="lg"
              fontWeight="600"
              color="gray.700"
              h="70px"
              _focus={{ border: "none", boxShadow: "none" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </HStack>

          {/* O BOTÃO QUE ABRE O MODAL (Lógica de Modal está dentro deste componente) */}
          <Box w={{ base: "full", md: "auto" }}>
            <QuickAddTenantModal 
              onSubmit={handleCreateTenant} 
              isLoading={false} 
            />
          </Box>
        </Flex>

        {/* INSIGHTS INTELIGENTES */}
        <SmartInsights data={dashboard} />

        {/* GRID DE KPIs */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8} mt={12}>
          <KPICard label="DINHEIRO EM CAIXA" value={dashboard?.totalReceived} icon={LuDollarSign} colorPalette="blue" />
          <KPICard label="IMÓVEIS GESTIONADOS" value={dashboard?.totalProperties} icon={LuBuilding2} colorPalette="purple" />
          <KPICard label="CONTRATOS ATIVOS" value={dashboard?.activeContracts} icon={LuFileText} colorPalette="orange" />
          <KPICard label="INQUILINOS TOTAIS" value={dashboard?.totalTenants} icon={LuUsers} colorPalette="teal" />
        </SimpleGrid>

        {/* CONTEÚDO PRINCIPAL: GRÁFICO E OCUPAÇÃO */}
        <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={10} mt={12}>
          <Box bg="white" p={10} borderRadius="3xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
             <Heading size="md" mb={10} fontWeight="900" color="gray.800" letterSpacing="-0.5px">
               Evolução do Faturamento
             </Heading>
             <RevenueChart data={dashboard?.revenueChart} />
          </Box>

          <VStack gap={8} align="stretch">
            <Box bg="blue.600" p={10} borderRadius="3xl" color="white" textAlign="center" shadow="xl">
              <Text fontWeight="800" fontSize="xs" textTransform="uppercase" mb={2} opacity={0.8} letterSpacing="widest">
                Taxa de Ocupação
              </Text>
              <Text fontSize="7xl" fontWeight="900" letterSpacing="-3px">
                {dashboard?.occupancyRate}%
              </Text>
              <Text fontSize="sm" fontWeight="bold">Imóveis Alugados</Text>
            </Box>

            <Box bg="white" p={10} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
               <Text fontWeight="900" color="gray.800" mb={6}>Inadimplência Atual</Text>
               <Flex align="center" justify="space-between">
                  <Text fontSize="3xl" color="red.500" fontWeight="900">
                    {dashboard?.defaultRate}%
                  </Text>
                  <Icon as={LuFileText} color="red.100" boxSize={10} />
               </Flex>
            </Box>
          </VStack>
        </Grid>

      </Container>
    </Box>
  );
}