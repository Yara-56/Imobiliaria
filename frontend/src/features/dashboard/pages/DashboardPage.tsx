"use client";

import React, { useState } from "react";
import {
  Box, Flex, Grid, HStack, VStack, Input,
  Button, Text, Icon, SimpleGrid, Container, Skeleton, Heading
} from "@chakra-ui/react";
import { 
  LuSearch, LuDollarSign, LuBuilding2, 
  LuFileText, LuUsers, LuPlus, LuTrendingUp 
} from "react-icons/lu";

import { useDashboard } from "../hooks/useDashboard";
import { KPICard } from "../components/KPICard";
import { RevenueChart } from "../components/RevenueChart";
import { SmartInsights } from "../components/SmartInsights";

// IMPORTAÇÃO DO SEU MODAL (Ajuste o caminho se necessário)
import { QuickAddTenantModal } from "../../tenants/components/QuickAddTenantModal";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("6M");
  const dashboard = useDashboard(); 

  if (dashboard?.isLoading) {
    return (
      <Container maxW="7xl" p={8}>
        <Skeleton h="60px" borderRadius="2xl" mb={10} />
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} h="140px" borderRadius="3xl" />)}
        </SimpleGrid>
      </Container>
    );
  }

  return (
    <Box bg="#F7F8FA" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="7xl">
        
        {/* 🚀 ACTION BAR - FOCO TOTAL NO NOVO INQUILINO */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={12} 
          gap={6} 
          direction={{ base: "column", md: "row" }}
        >
          {/* Busca com contraste alto para idosos */}
          <HStack 
            bg="white" 
            px={6} 
            borderRadius="2xl" 
            boxShadow="sm" 
            border="2px solid" 
            borderColor="gray.200"
            flex={1}
            minW={{ md: "450px" }}
            _focusWithin={{ borderColor: "blue.500" }}
          >
            <Icon as={LuSearch} color="gray.400" boxSize={6} />
            <Input
              placeholder="Pesquisar inquilino, imóvel ou CPF..."
              variant="flushed"
              border="none"
              _focus={{ border: "none" }}
              fontSize="xl"
              fontWeight="600"
              color="gray.800"
              h="65px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </HStack>

          {/* O SEU BOTÃO CHAVE - DESTAQUE MÁXIMO */}
          <Box transform="scale(1.1)">
             <QuickAddTenantModal />
          </Box>
        </Flex>

        {/* 🧠 SMART INSIGHTS (AGORA CLARO E LEVÍSSIMO) */}
        <SmartInsights data={dashboard} />

        {/* 📊 INDICADORES COM NÚMEROS GIGANTES */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8} mt={12}>
          <KPICard label="DINHEIRO EM CAIXA" value={dashboard?.totalReceived} icon={LuDollarSign} colorPalette="blue" />
          <KPICard label="IMÓVEIS GESTIONADOS" value={dashboard?.totalProperties} icon={LuBuilding2} colorPalette="purple" />
          <KPICard label="CONTRATOS ATIVOS" value={dashboard?.activeContracts} icon={LuFileText} colorPalette="orange" />
          <KPICard label="INQUILINOS TOTAIS" value={dashboard?.totalTenants} icon={LuUsers} colorPalette="teal" />
        </SimpleGrid>

        {/* 📉 GRÁFICO E SIDEBAR */}
        <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={10} mt={12}>
          
          <Box bg="white" p={10} borderRadius="3xl" boxShadow="sm" border="2px solid" borderColor="gray.100">
            <Flex justify="space-between" align="center" mb={10}>
              <Heading size="md" fontWeight="900" color="gray.800">Evolução do Aluguel</Heading>
              <HStack bg="gray.100" p={1.5} borderRadius="2xl">
                {["3M", "6M", "1A"].map((p) => (
                  <Button
                    key={p} size="md" variant={period === p ? "solid" : "ghost"}
                    bg={period === p ? "white" : "transparent"}
                    onClick={() => setPeriod(p)}
                    color="gray.800" fontWeight="bold" px={6}
                  >
                    {p}
                  </Button>
                ))}
              </HStack>
            </Flex>
            <RevenueChart data={dashboard?.revenueChart} />
          </Box>

          <VStack gap={8} align="stretch">
            {/* Ocupação em azul tátil */}
            <Box bg="blue.600" p={12} borderRadius="3xl" color="white" boxShadow="xl" textAlign="center">
              <Text fontWeight="800" fontSize="sm" textTransform="uppercase" mb={4} opacity={0.9}>Taxa de Ocupação</Text>
              <Text fontSize="7xl" fontWeight="900" letterSpacing="-2px">{dashboard?.occupancyRate ?? 0}%</Text>
              <Text fontSize="lg" fontWeight="600">Imóveis Alugados</Text>
            </Box>

            {/* Resumo do dia com cores nítidas */}
            <Box bg="white" p={10} borderRadius="3xl" boxShadow="sm" border="2px solid" borderColor="gray.100">
              <Text fontWeight="900" fontSize="xl" color="gray.800" mb={8}>Avisos Importantes</Text>
              <VStack align="stretch" gap={8}>
                <Flex justify="space-between" align="center">
                  <Text color="gray.600" fontSize="lg" fontWeight="700">Inadimplência</Text>
                  <Text fontWeight="900" fontSize="3xl" color="red.600">{dashboard?.defaultRate ?? 0}%</Text>
                </Flex>
                <Box h="2px" bg="gray.50" />
                <Button h="75px" fontSize="2xl" colorPalette="blue" fontWeight="900" borderRadius="2xl" boxShadow="md">
                  Relatório Geral
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}