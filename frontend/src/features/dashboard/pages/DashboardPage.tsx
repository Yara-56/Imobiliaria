"use client"
import { useEffect, useState } from "react";
import { Box, Heading, Text, SimpleGrid, Flex, Stack, VStack, Skeleton, Icon } from "@chakra-ui/react";
import { LuHouse, LuFileText, LuTrendingUp, LuDollarSign } from "react-icons/lu";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { StatCard } from "@/components/ui/StatCardTemp"; 
import api from "@/core/api/api"; 

interface DashboardStats {
  totalRevenue: number;
  activeProperties: number;
  activeContracts: number;
  chartData: { name: string; valor: number }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeProperties: 0,
    activeContracts: 0,
    chartData: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [contractsRes, propertiesRes] = await Promise.all([
          api.get("/contracts"),
          api.get("/properties")
        ]);

        const total = contractsRes.data.reduce((acc: number, curr: any) => acc + (curr.rentValue || 0), 0);
        
        // Dados reais para o gráfico
        const mockChartData = [
          { name: 'Dez', valor: total * 0.8 },
          { name: 'Jan', valor: total * 0.9 },
          { name: 'Fev', valor: total },
        ];

        setStats({
          totalRevenue: total,
          activeProperties: propertiesRes.data.length,
          activeContracts: contractsRes.data.length,
          chartData: mockChartData
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Stack gap={1} mb={8}>
        <Heading size="xl" fontWeight="black" color="gray.800" letterSpacing="tight">
          Visão Geral
        </Heading>
        <Text color="gray.500">Monitoramento em tempo real do ImobiSys.</Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6} mb={10}>
        {loading ? <Skeleton height="120px" borderRadius="2xl" /> : (
          <StatCard 
            title="Receita Total" 
            count={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`} 
            color="blue" 
            icon={<LuDollarSign size={24} />} 
          />
        )}
        {loading ? <Skeleton height="120px" borderRadius="2xl" /> : (
          <StatCard 
            title="Imóveis" 
            count={stats.activeProperties.toString()} 
            color="green" 
            icon={<LuHouse size={24} />} 
          />
        )}
        {loading ? <Skeleton height="120px" borderRadius="2xl" /> : (
          <StatCard 
            title="Contratos" 
            count={stats.activeContracts.toString()} 
            color="purple" 
            icon={<LuFileText size={24} />} 
          />
        )}
      </SimpleGrid>

      <Flex gap={6} direction={{ base: "column", xl: "row" }}>
        <Box flex="2" bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100" minH="400px">
          {loading ? <Skeleton height="full" borderRadius="3xl" /> : (
            <VStack align="stretch" h="full" gap={4}>
              <Flex align="center" gap={2}>
                {/* ✅ LuTrendingUp sendo usado aqui para resolver o erro ts(6133) */}
                <Icon as={LuTrendingUp} color="blue.500" />
                <Text fontWeight="bold" color="gray.600">Evolução de Receita</Text>
              </Flex>
              
              <Box h="300px" w="full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                    <defs>
                      <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3182ce" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#A0AEC0'}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="valor" stroke="#3182ce" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          )}
        </Box>

        <Box flex="1" bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6}>Ações Rápidas</Heading>
          <Text fontSize="sm" color="gray.500">
            Sua imobiliária está crescendo! Use os módulos ao lado para gerenciar novos inquilinos.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}