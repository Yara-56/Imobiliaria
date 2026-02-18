"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, SimpleGrid, Badge, Button, Spinner, 
  Center, Icon, VStack, HStack, Container, Separator 
} from "@chakra-ui/react";
import { 
  LuTrendingUp, LuRefreshCcw, LuTriangleAlert, LuClock, LuDownload, LuReceipt, LuDollarSign 
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "@/core/api/api"; 

interface Payment {
  _id: string;
  amount: number;
  referenceMonth: string;
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado";
  tenantId?: { fullName: string };
  contractId?: { propertyAddress: string };
  receiptUrl?: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/payments");
      setPayments(response.data?.data?.payments || []);
    } catch (err) {
      console.error("Erro no cluster financeiro Aura:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const stats = useMemo(() => {
    const received = payments.filter(p => p.status === "Pago").reduce((acc, curr) => acc + curr.amount, 0);
    const pending = payments.filter(p => p.status === "Pendente").reduce((acc, curr) => acc + curr.amount, 0);
    const delayed = payments.filter(p => p.status === "Atrasado").reduce((acc, curr) => acc + curr.amount, 0);
    return { received, pending, delayed };
  }, [payments]);

  const formatMoney = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (loading) return (
    <Center h="60vh">
      <VStack gap={4}>
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
        <Text color="gray.500" fontWeight="bold">Sincronizando Fluxo de Caixa Aura...</Text>
      </VStack>
    </Center>
  );

  if (error) return (
    <Center h="60vh">
      <VStack color="red.500" gap={4}>
        <LuTriangleAlert size={48} />
        <Text fontWeight="black">Erro de Sincronização Financeira</Text>
        <Button size="sm" variant="outline" onClick={fetchPayments}>Tentar Novamente</Button>
      </VStack>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="6xl">
        
        {/* HEADER DA PÁGINA - IGUAL AOS INQUILINOS */}
        <HStack justify="space-between" mb={10} flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" gap={3}>
              <Icon as={LuDollarSign} boxSize={8} />
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Financeiro</Heading>
            </HStack>
            <Text color="gray.500">Gestão de recebíveis e fluxo de caixa do sistema.</Text>
          </VStack>

          <HStack gap={3}>
            <Button variant="outline" onClick={fetchPayments} h="60px" borderRadius="2xl">
              <LuRefreshCcw />
            </Button>
            <Button 
              bg="blue.600" 
              color="white" 
              h="60px" 
              px={8} 
              fontWeight="bold"
              borderRadius="2xl"
              _hover={{ bg: "blue.700", transform: "translateY(-2px)", shadow: "xl" }}
              onClick={() => navigate("new")} 
            >
              <LuTrendingUp size={20} style={{ marginRight: '10px' }} />
              Novo Lançamento
            </Button>
          </HStack>
        </HStack>

        <Separator mb={8} opacity={0.5} />

        {/* CARDS DE RESUMO */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
          <StatCard title="Recebido" value={formatMoney(stats.received)} color="green" icon={<LuTrendingUp />} />
          <StatCard title="Pendente" value={formatMoney(stats.pending)} color="orange" icon={<LuClock />} />
          <StatCard title="Atrasado" value={formatMoney(stats.delayed)} color="red" icon={<LuTriangleAlert />} />
        </SimpleGrid>

        {/* LISTA DE PAGAMENTOS EM FORMATO DE CARD (IGUAL INQUILINOS) */}
        <VStack align="stretch" gap={4}>
          {payments.length === 0 ? (
            <Center p={20} border="2px dashed" borderColor="gray.100" borderRadius="3xl">
              <Text color="gray.400" fontWeight="bold">Nenhum registro financeiro encontrado.</Text>
            </Center>
          ) : (
            payments.map((p) => (
              <Box 
                key={p._id} 
                p={6} 
                borderRadius="2xl" 
                border="1px solid" 
                borderColor="gray.100"
                bg="white"
                transition="all 0.2s"
                _hover={{ shadow: "2xl", borderColor: "blue.200", transform: "scale(1.01)", cursor: "pointer" }}
                onClick={() => navigate(`edit/${p._id}`)}
              >
                <HStack justify="space-between">
                  <HStack gap={4}>
                    <Center bg="blue.50" color="blue.600" w="12" h="12" borderRadius="xl">
                      <LuReceipt size={24} />
                    </Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="lg" color="slate.800">
                        {p.tenantId?.fullName || "Inquilino Externo"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">{p.contractId?.propertyAddress || "Sem endereço"}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack gap={6}>
                    <VStack align="end" gap={0} display={{ base: "none", md: "flex" }}>
                      <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="widest">REFERÊNCIA</Text>
                      <Text fontSize="sm" fontWeight="bold" color="blue.500">{p.referenceMonth}</Text>
                    </VStack>
                    <VStack align="end" gap={0}>
                      <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="widest">VALOR</Text>
                      <Text fontSize="md" fontWeight="black" color="slate.800">{formatMoney(p.amount)}</Text>
                    </VStack>
                    <Badge colorPalette={p.status === "Pago" ? "green" : "red"} variant="subtle" px={3} py={1} borderRadius="lg">
                      {p.status.toUpperCase()}
                    </Badge>
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </VStack>

        <Text mt={12} textAlign="center" fontSize="xs" color="gray.300" fontWeight="bold" letterSpacing="2px">
          AURA IMOBISYS • FINANCIAL CLUSTER
        </Text>
      </Container>
    </Box>
  );
}

function StatCard({ title, value, color, icon }: any) {
  return (
    <Box p={8} bg="white" borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
      <Flex align="center" gap={5}>
        <Center w="14" h="14" bg={`${color}.50`} color={`${color}.600`} borderRadius="2xl">
          <Icon as={icon} boxSize="24px" /> 
        </Center>
        <Stack gap={0}>
          <Text fontSize="xs" color="gray.400" fontWeight="black" letterSpacing="widest">{title.toUpperCase()}</Text>
          <Heading size="lg" color="gray.800" fontWeight="900">{value}</Heading>
        </Stack>
      </Flex>
    </Box>
  );
}