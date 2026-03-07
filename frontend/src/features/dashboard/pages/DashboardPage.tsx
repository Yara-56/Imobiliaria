"use client"

import { useEffect, useState } from "react";
import { 
  Box, Heading, Text, SimpleGrid, Flex, Stack, HStack, VStack,
  Center, Spinner, Icon, Badge, Button, Container
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LuHouse, LuFileText, LuDollarSign, 
  LuArrowRight, LuTrendingUp, LuCircleCheck 
} from "react-icons/lu";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, CartesianGrid } from 'recharts';
import api from "@/core/api/apiResponse";

// Importações corrigidas para bater com seus arquivos em minúsculo
import { QuickActionCard } from "../components/quickActionCard";
import { RecentActivity } from "../components/recentActivity";
import { PortfolioHealth } from "../components/portfolioHealth";
import { QuickSearch } from "../components/quickSearch";

// Componente animado com correção de tipagem para Chakra + Motion
const MotionBox = motion.create(Box);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    activeProperties: 0, 
    activeContracts: 0, 
    chartData: [] as any[] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resContracts, resProperties] = await Promise.all([
          api.get("/contracts").catch(() => ({ data: { data: [] } })), 
          api.get("/properties").catch(() => ({ data: { data: [] } }))
        ]);

        const contractsList = resContracts.data.data || [];
        const propertiesList = resProperties.data.data || [];
        const total = contractsList.reduce((acc: number, curr: any) => acc + (Number(curr.rentValue) || 0), 0);

        setStats({
          totalRevenue: total,
          activeProperties: propertiesList.length || 0,
          activeContracts: contractsList.length || 0,
          chartData: [
            { n: 'Jan', v: total * 0.4 }, { n: 'Fev', v: total * 0.7 }, { n: 'Mar', v: total }
          ]
        });
      } catch (error) {
        console.error("Erro na conexão:", error);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Center h="100vh" bg="white">
      <VStack gap={4}>
        <Spinner color="blue.500" size="xl" thickness="4px" />
        <Text fontWeight="bold" color="gray.500">Preparando seu império...</Text>
      </VStack>
    </Center>
  );

  return (
    <Box w="full" bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="container.xl">
        
        {/* HEADER SENIOR */}
        <Flex justify="space-between" align="start" mb={6}>
          <VStack align="start" gap={0}>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Dashboard
            </Heading>
            <Text color="gray.500" fontSize="md" fontWeight="medium">
              Bem-vinda, Yara. Aqui está o resumo da Lacerda Imobiliária.
            </Text>
          </VStack>
          <Badge colorPalette="blue" variant="surface" px={4} py={2} borderRadius="2xl">
             <HStack gap={2}>
               <LuCircleCheck size={16} /> 
               <Text fontWeight="bold">SISTEMA ATIVO</Text>
             </HStack>
          </Badge>
        </Flex>

        {/* BUSCA E AÇÃO RÁPIDA */}
        <QuickSearch />
        
        <QuickActionCard 
          title="Novo Inquilino" 
          description="Inicie um processo de locação em menos de 2 minutos."
          onClick={() => navigate("/tenants/new")}
        />

        {/* MÉTRICAS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mb={10}>
          {[
            { label: "Receita", val: `R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`, icon: LuDollarSign, col: "blue" },
            { label: "Imóveis", val: stats.activeProperties, icon: LuHouse, col: "purple" },
            { label: "Contratos", val: stats.activeContracts, icon: LuFileText, col: "cyan" }
          ].map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" 
              }}
              p={8}
              borderRadius="3xl"
              bg="white"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex justify="space-between" align="center">
                <Stack gap={0}>
                  <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">{item.label}</Text>
                  <Heading size="xl" color="gray.800" mt={2}>{item.val}</Heading>
                </Stack>
                <Center w={16} h={16} bg={`${item.col}.50`} color={`${item.col}.500`} borderRadius="2xl">
                  <Icon as={item.icon} boxSize={8} />
                </Center>
              </Flex>
            </MotionBox>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
          {/* GRÁFICO FINANCEIRO */}
          <Box gridColumn={{ lg: "span 2" }} bg="white" p={10} borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100">
            <HStack justify="space-between" mb={10}>
              <HStack gap={3}>
                <LuTrendingUp size={24} color="#3182ce" />
                <Text fontWeight="900" fontSize="lg" color="gray.700">Fluxo Financeiro Anual</Text>
              </HStack>
              <Button size="sm" variant="ghost" onClick={() => navigate("/financial")}>
                Ver detalhes <LuArrowRight style={{ marginLeft: '8px' }} />
              </Button>
            </HStack>
            
            <Box h="350px" w="full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3182ce" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#A0AEC0', fontSize: 12}} dy={10} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="v" stroke="#3182ce" strokeWidth={4} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* COLUNA LATERAL */}
          <VStack gap={8} w="full">
            <PortfolioHealth />
            <RecentActivity />
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}