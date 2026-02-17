"use client"

import { Box, Heading, Text, SimpleGrid, Flex, Stack, VStack } from "@chakra-ui/react";
import { LuHouse, LuFileText, LuTrendingUp, LuDollarSign } from "react-icons/lu";

// ✅ Usando Alias '@' para evitar erros de contagem de '../'
import { StatCard } from "@/core/components/ui/StatCardTemp"; 

export default function DashboardPage() {
  return (
    <Box>
      <Stack gap={1} mb={8}>
        <Heading size="xl" fontWeight="black" color="gray.800" letterSpacing="tight">
          Visão Geral
        </Heading>
        <Text color="gray.500">Bem-vinda ao centro de controle do ImobiSys.</Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={10}>
        <StatCard 
          title="Total em Contratos" 
          count="R$ 142.500" 
          color="blue" 
          icon={<LuDollarSign size={24} />} 
        />
        <StatCard 
          title="Imóveis Ativos" 
          count="24" 
          color="green" 
          icon={<LuHouse size={24} />} 
        />
        <StatCard 
          title="Vigências este mês" 
          count="12" 
          color="purple" 
          icon={<LuFileText size={24} />} 
        />
        <StatCard 
          title="Crescimento" 
          count="+14%" 
          color="orange" 
          icon={<LuTrendingUp size={24} />} 
        />
      </SimpleGrid>

      <Flex gap={6} direction={{ base: "column", xl: "row" }}>
        <Box 
          flex="2" 
          bg="white" 
          p={8} 
          borderRadius="3xl" 
          border="1px solid" 
          borderColor="gray.100" 
          minH="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        >
          <VStack color="gray.300" gap={2}>
            <LuTrendingUp size={48} />
            <Text fontWeight="bold" color="gray.400">Gráfico de Performance Mensal</Text>
            <Text fontSize="sm">Conecte sua API para visualizar os dados reais.</Text>
          </VStack>
        </Box>

        <Box 
          flex="1" 
          bg="white" 
          p={8} 
          borderRadius="3xl" 
          border="1px solid" 
          borderColor="gray.100"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        >
          <Heading size="md" mb={6}>Ações Recentes</Heading>
          <Stack gap={4}>
            {[1, 2, 3].map((i) => (
              <Flex key={i} align="center" gap={3} p={3} borderBottom="1px solid" borderColor="gray.50" _dark={{ borderColor: "gray.700" }}>
                <Box w={2} h={2} borderRadius="full" bg="blue.500" />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Contrato Atualizado</Text>
                  <Text fontSize="xs" color="gray.400">Há {i * 2} horas • Edifício Horizon</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}