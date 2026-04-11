"use client";

import { useMemo } from "react";
import { 
  Box, Flex, Heading, Text, SimpleGrid, Button, Spinner, 
  Center, Icon, VStack, HStack, Container, Grid, GridItem 
} from "@chakra-ui/react";
import { 
  LuTrendingUp, LuRefreshCcw, LuClock, LuDownload, LuReceipt, LuDollarSign
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { usePayments } from "../hooks/usePayments";
import { Payment, Tenant, Contract } from "../types/payment.types";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { payments, isLoading, refetch } = usePayments();

  const stats = useMemo(() => {
    const received = payments
      .filter(p => p.status === "Pago")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pending = payments
      .filter(p => p.status === "Pendente")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
    return { received, pending };
  }, [payments]);

  const formatMoney = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleGenerateReceipt = (payment: Payment) => {
    console.log("Gerando recibo para:", payment._id);
    // Implementar lógica de geração de recibo
  };

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            CARREGANDO...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="7xl">
        
        {/* HEADER */}
        <Flex justify="space-between" align="center" mb={12} wrap="wrap" gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuDollarSign} boxSize={8} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">
                FINANCEIRO
              </Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Dashboard de Pagamentos
            </Heading>
            <Text color="gray.500" fontWeight="medium">
              Gestão inteligente de recebíveis
            </Text>
          </VStack>
          
          <HStack gap={4}>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              borderRadius="2xl" 
              h="60px" 
              px={6}
              fontWeight="900"
            >
              <Icon as={LuRefreshCcw} />
            </Button>
            <Button 
              onClick={() => navigate("/payments/new")}
              bg="blue.600" 
              color="white" 
              h="60px" 
              px={8} 
              borderRadius="2xl" 
              fontWeight="900"
            >
              Novo Lançamento
            </Button>
          </HStack>
        </Flex>

        {/* CARDS DE RESUMO */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={16}>
          <SummaryCard 
            title="Total Recebido" 
            value={formatMoney(stats.received)} 
            color="green" 
            icon={LuTrendingUp} 
          />
          <SummaryCard 
            title="Previsão Pendente" 
            value={formatMoney(stats.pending)} 
            color="orange" 
            icon={LuClock} 
          />
        </SimpleGrid>

        {/* LISTA DE PAGAMENTOS */}
        <VStack align="stretch" gap={5}>
          {payments.length === 0 ? (
            <Center py={20} bg="white" borderRadius="3xl" border="1px dashed" borderColor="gray.200">
              <VStack gap={3}>
                <Icon as={LuReceipt} boxSize={16} color="gray.300" />
                <Text fontWeight="bold" color="gray.400" fontSize="lg">
                  Nenhum pagamento registrado
                </Text>
                <Button 
                  onClick={() => navigate("/payments/new")} 
                  colorPalette="blue" 
                  mt={4} 
                  borderRadius="xl" 
                  fontWeight="900"
                >
                  Criar Primeiro Pagamento
                </Button>
              </VStack>
            </Center>
          ) : (
            payments.map((payment) => {
              const tenant = typeof payment.tenantId === 'object' 
                ? payment.tenantId as Tenant 
                : null;
              const contract = typeof payment.contractId === 'object' 
                ? payment.contractId as Contract 
                : null;
              
              return (
                <Box 
                  key={payment._id} 
                  p={7} 
                  bg="white"
                  borderRadius="32px" 
                  border="1px solid" 
                  borderColor="gray.100"
                  transition="all 0.3s" 
                  cursor="pointer"
                  onClick={() => navigate(`/payments/${payment._id}`)}
                  _hover={{ 
                    shadow: "2xl", 
                    transform: "translateX(10px)", 
                    borderColor: "blue.100" 
                  }}
                >
                  <Grid 
                    templateColumns={{ base: "1fr", md: "2.5fr 1fr 1fr" }} 
                    gap={6} 
                    alignItems="center"
                  >
                    <GridItem>
                      <HStack gap={5}>
                        <Center 
                          bg="blue.50" 
                          color="blue.600" 
                          w="14" 
                          h="14" 
                          borderRadius="22px"
                        >
                          <Icon as={LuReceipt} boxSize={7} />
                        </Center>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="900" fontSize="lg">
                            {tenant?.fullName || "Inquilino"}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {contract?.propertyAddress || "Sem endereço"}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontSize="xl" fontWeight="900" textAlign="right">
                        {formatMoney(payment.totalAmount)}
                      </Text>
                    </GridItem>
                    
                    <GridItem textAlign="right">
                      <Button 
                        variant="ghost" 
                        colorPalette="blue" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReceipt(payment);
                        }}
                      >
                        <HStack gap={2}>
                          <Icon as={LuDownload} boxSize={4} />
                          <Text fontSize="sm" fontWeight="bold">Recibo</Text>
                        </HStack>
                      </Button>
                    </GridItem>
                  </Grid>
                </Box>
              );
            })
          )}
        </VStack>
      </Container>
    </Box>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  color: "green" | "orange" | "blue" | "red";
  icon: any;
}

function SummaryCard({ title, value, color, icon }: SummaryCardProps) {
  return (
    <Box 
      p={10} 
      bg="white" 
      borderRadius="40px" 
      border="1px solid" 
      borderColor="gray.50" 
      shadow="sm"
      transition="all 0.3s"
      _hover={{ shadow: "lg", borderColor: `${color}.100` }}
    >
      <VStack align="start" gap={4}>
        <Center 
          w="12" 
          h="12" 
          bg={`${color}.50`} 
          color={`${color}.600`} 
          borderRadius="xl"
        >
          <Icon as={icon} boxSize={6} />
        </Center>
        <Box>
          <Text fontSize="xs" color="gray.400" fontWeight="black" letterSpacing="wider">
            {title.toUpperCase()}
          </Text>
          <Heading size="xl" fontWeight="900" mt={1}>
            {value}
          </Heading>
        </Box>
      </VStack>
    </Box>
  );
}