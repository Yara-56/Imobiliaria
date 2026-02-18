"use client";

import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  Progress, 
  Container, 
  Badge, 
  Center 
} from "@chakra-ui/react";
// ✅ Ícones atualizados para evitar erros de exportação (Lucide/v3)
import { LuTrendingUp, LuUsers, LuChartPie, LuTriangleAlert } from "react-icons/lu";
import { useFinancialBI } from "../hooks/useFinancialBI.js";

/**
 * 🛡️ COMPONENTE INTERNO: METRIC CARD
 * Definido aqui para resolver o erro ts(2304).
 */
interface MetricCardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <Box 
      p={8} 
      borderRadius="40px" 
      border="1px solid" 
      borderColor="gray.50" 
      shadow="sm" 
      bg="white"
      transition="0.3s"
      _hover={{ shadow: "md", transform: "translateY(-5px)" }}
    >
      <HStack gap={6}>
        <Center bg={`${color}.50`} color={`${color}.600`} w="16" h="16" borderRadius="24px">
          <Icon as={icon} boxSize={8} />
        </Center>
        <VStack align="start" gap={0}>
          <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="2px">
            {title.toUpperCase()}
          </Text>
          <Heading size="xl" fontWeight="900">{value}</Heading>
        </VStack>
      </HStack>
    </Box>
  );
}

/**
 * 📊 DASHBOARD DE INTELIGÊNCIA FINANCEIRA - AURA IMOBISYS
 * Integração total com o banco de dados via useFinancialBI.
 */
export default function FinancialDashboard() {
  const { totalRevenue, revenueByPlan, churnRisk } = useFinancialBI();

  const formatBRL = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="7xl">
        <VStack align="start" gap={1} mb={10}>
          <HStack color="blue.600" gap={3}>
            <Icon as={LuChartPie} boxSize={8} />
            <Heading size="2xl" fontWeight="900" letterSpacing="-2px">Inteligência Aura</Heading>
          </HStack>
          <Text color="gray.500" fontWeight="medium">
            Gestão analítica em tempo real do seu banco de dados.
          </Text>
        </VStack>

        {/* 🚀 KPIs PRINCIPAIS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mb={12}>
          <MetricCard 
            title="Receita Realizada" 
            value={formatBRL(totalRevenue)} 
            icon={LuTrendingUp} 
            color="blue" 
          />
          <MetricCard 
            title="Risco de Inadimplência" 
            value={`${churnRisk.toFixed(1)}%`} 
            icon={LuTriangleAlert} 
            color="red" 
          />
          <MetricCard 
            title="Planos Ativos" 
            value={Object.keys(revenueByPlan).length.toString()} 
            icon={LuUsers} 
            color="purple" 
          />
        </SimpleGrid>

        <Heading size="lg" mb={6} fontWeight="800">Faturamento por Categoria de Plano</Heading>
        
        {/* 📈 SEGMENTAÇÃO POR PLANO */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {["BASIC", "PRO", "ENTERPRISE"].map((plan) => (
            <Box 
              key={plan} 
              p={8} 
              borderRadius="3xl" 
              border="1px solid" 
              borderColor="gray.100" 
              bg="gray.50/30"
            >
              <VStack align="start" gap={4}>
                <Badge colorPalette={plan === "ENTERPRISE" ? "purple" : "blue"} variant="surface">
                  {plan}
                </Badge>
                <Heading size="md" fontWeight="800">
                  {formatBRL(revenueByPlan[plan] || 0)}
                </Heading>
                <Progress.Root 
                   value={totalRevenue > 0 ? ((revenueByPlan[plan] || 0) / totalRevenue) * 100 : 0} 
                   w="full" 
                   borderRadius="full"
                   colorPalette="blue"
                >
                   <Progress.Track bg="gray.100">
                     <Progress.Range />
                   </Progress.Track>
                </Progress.Root>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}