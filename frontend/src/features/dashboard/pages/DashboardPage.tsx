"use client"

import { useEffect, useState } from "react";
import { Box, Heading, Text, SimpleGrid, Flex, Stack, Center, Spinner, Icon, Badge, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LuHouse, LuFileText, LuDollarSign, LuActivity, LuArrowRight, LuTrendingUp } from "react-icons/lu";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from 'recharts';
import api from "@/core/api/api"; 

// Criamos o componente motion de forma que aceite as props do Chakra sem conflito
const MotionBox = motion(Box);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalRevenue: 0, activeProperties: 0, activeContracts: 0, chartData: [] as any[] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [c, p] = await Promise.all([
          api.get("/contracts").catch(() => ({data:[]})), 
          api.get("/properties").catch(() => ({data:[]}))
        ]);
        const total = c.data?.reduce((acc: any, curr: any) => acc + (Number(curr.rentValue) || 0), 0) || 0;
        setStats({
          totalRevenue: total,
          activeProperties: p.data?.length || 0,
          activeContracts: c.data?.length || 0,
          chartData: [{n:'Jan', v: total*0.6}, {n:'Fev', v: total*0.8}, {n:'Mar', v: total}]
        });
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Center h="60vh"><Spinner color="blue.500" size="xl" borderWidth="4px" /></Center>
  );

  return (
    <Box w="full">
      <Flex justify="space-between" align="flex-end" mb={10}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900" color="slate.800" letterSpacing="-1px">Resumo Geral</Heading>
          <Text color="gray.500" fontSize="sm">Acompanhe seus indicadores em tempo real.</Text>
        </Stack>
        <Badge colorPalette="blue" variant="subtle" px={4} py={1} borderRadius="full">
           <Flex align="center" gap={2}><LuActivity size={14} /> Sistema Ativo</Flex>
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mb={10}>
        {[
          { label: "Receita", val: `R$ ${stats.totalRevenue.toLocaleString()}`, icon: LuDollarSign, col: "blue" },
          { label: "Imóveis", val: stats.activeProperties, icon: LuHouse, col: "purple" },
          { label: "Contratos", val: stats.activeContracts, icon: LuFileText, col: "cyan" }
        ].map((item, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }} // Removemos o shadow daqui para evitar o erro TS
            p={8}
            borderRadius="2xl"
            bg="white"
            boxShadow="sm" // Propriedade do Chakra
            cursor="pointer"
            border="1px solid"
            borderColor="gray.50"
          >
            <Flex justify="space-between" align="center">
              <Stack gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">{item.label}</Text>
                <Heading size="lg" color="slate.800" mt={1}>{item.val}</Heading>
              </Stack>
              <Center w={14} h={14} bg={`${item.col}.50`} color={`${item.col}.600`} borderRadius="2xl">
                <Icon as={item.icon} boxSize={7} />
              </Center>
            </Flex>
          </MotionBox>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        <Box 
          gridColumn={{ lg: "span 2" }} 
          bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.50"
        >
          <Flex align="center" gap={2} mb={8}>
            <LuTrendingUp color="#3182ce" />
            <Text fontWeight="bold" color="slate.700">Fluxo de Receita</Text>
          </Flex>
          <Box h="280px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <XAxis dataKey="n" hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="v" stroke="#3182ce" strokeWidth={4} fillOpacity={0.1} fill="#3182ce" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Stack gap={6}>
          <Box 
            bg="blue.600" p={8} borderRadius="2xl" color="white" shadow="lg"
            cursor="pointer" _hover={{ bg: "blue.700" }} onClick={() => navigate("/admin/properties")}
          >
            <Heading size="sm" mb={2}>Novo Imóvel</Heading>
            <Text fontSize="xs" opacity={0.8} mb={6}>Adicione unidades rapidamente.</Text>
            <LuArrowRight />
          </Box>
          <Box bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.50">
            <Text fontWeight="bold" color="slate.800" mb={1}>Relatórios</Text>
            <Text fontSize="xs" color="gray.500" mb={4}>Exportação completa de dados.</Text>
            <Button size="sm" variant="outline" w="full">Visualizar</Button>
          </Box>
        </Stack>
      </SimpleGrid>
    </Box>
  );
}