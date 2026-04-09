"use client";

import React from "react";
import { 
  SimpleGrid, 
  Box, 
  Text, 
  HStack, 
  Icon, 
  VStack, 
  Center, 
  Flex 
} from "@chakra-ui/react.js";
import { 
  LuFileCheck, 
  LuClock, 
  LuTrendingUp, 
  LuDollarSign,
  LuLayoutDashboard
} from "react-icons/lu";
import type { Contract } from "../types/contract.types";

interface ContractSummaryProps {
  contracts: Contract[];
}

export function ContractSummary({ contracts }: ContractSummaryProps) {
  // 🧠 Lógica de Cálculo de Cluster (Faturamento e Ocupação)
  const activeContracts = contracts?.filter(c => c.status === "ACTIVE") || [];
  const pendingCount = contracts?.filter(c => c.status === "PENDING").length || 0;
  
  const totalRevenue = activeContracts.reduce((acc, curr) => acc + (curr.rentAmount || 0), 0);
  const averageTicket = activeContracts.length > 0 ? totalRevenue / activeContracts.length : 0;

  const stats = [
    { 
      label: "RECEITA TOTAL", 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue), 
      icon: LuDollarSign, 
      color: "green.600", 
      bg: "green.50",
      desc: "Faturamento mensal ativo"
    },
    { 
      label: "CONTRATOS ATIVOS", 
      value: activeContracts.length, 
      icon: LuFileCheck, 
      color: "blue.600", 
      bg: "blue.50",
      desc: "Imóveis com vigência"
    },
    { 
      label: "TICKET MÉDIO", 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageTicket), 
      icon: LuTrendingUp, 
      color: "purple.600", 
      bg: "purple.50",
      desc: "Média por locação"
    },
    { 
      label: "PENDÊNCIAS", 
      value: pendingCount, 
      icon: LuClock, 
      color: pendingCount > 0 ? "orange.600" : "gray.300", 
      bg: pendingCount > 0 ? "orange.50" : "gray.50",
      desc: "Aguardando assinatura"
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={10}>
      {stats.map((stat, index) => (
        <Box 
          key={index} 
          bg="white" 
          p={6} 
          borderRadius="3xl" 
          border="1px solid" 
          borderColor="gray.100" 
          shadow="sm"
          transition="all 0.2s ease-in-out"
          _hover={{ transform: "translateY(-4px)", shadow: "md", borderColor: "blue.100" }}
        >
          <VStack align="start" gap={4}>
            <Flex justify="space-between" align="center" w="full">
              <Center bg={stat.bg} color={stat.color} p={3} borderRadius="xl">
                <Icon as={stat.icon} boxSize={5} />
              </Center>
              <Icon as={LuLayoutDashboard} color="gray.100" boxSize={4} />
            </Flex>
            
            <VStack align="start" gap={0}>
              <Text fontSize="10px" fontWeight="black" color="gray.400" letterSpacing="widest">
                {stat.label}
              </Text>
              <Text fontSize="2xl" fontWeight="900" color="gray.800" letterSpacing="-1px">
                {stat.value}
              </Text>
              <Text fontSize="xs" color="gray.400" fontWeight="medium">
                {stat.desc}
              </Text>
            </VStack>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}