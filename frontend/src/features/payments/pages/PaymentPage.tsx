"use client";

import { useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, SimpleGrid, Badge, Button, Spinner, 
  Center, Icon, VStack, HStack, Container, Grid, GridItem 
} from "@chakra-ui/react";
import { 
  LuTrendingUp, LuRefreshCcw, LuClock, LuDownload, LuReceipt, LuDollarSign, LuChevronRight 
} from "react-icons/lu";
import { usePayments } from "../hooks/usePayments";
import { useReceipt } from "../hooks/useReceipt";

export default function PaymentPage() {
  const { payments, isLoading, refetch } = usePayments();
  const { generateReceipt } = useReceipt();

  const stats = useMemo(() => {
    const received = payments.filter(p => p.status === "Pago").reduce((acc, curr) => acc + curr.amount, 0);
    const pending = payments.filter(p => p.status === "Pendente").reduce((acc, curr) => acc + curr.amount, 0);
    return { received, pending };
  }, [payments]);

  const formatMoney = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (isLoading) return <Center h="60vh"><Spinner size="xl" color="blue.500" /></Center>;

  return (
    <Box p={{ base: 4, md: 10 }} bg="white" minH="100vh">
      <Container maxW="7xl">
        <Flex justify="space-between" align="center" mb={12} wrap="wrap" gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" gap={3}>
              <Icon as={LuDollarSign} boxSize={8} />
              <Heading size="2xl" fontWeight="900" letterSpacing="-2px">Financeiro</Heading>
            </HStack>
            <Text color="gray.400">Gestão inteligente de recebíveis.</Text>
          </VStack>
          <HStack gap={4}>
            <Button variant="outline" onClick={() => refetch()} borderRadius="2xl" h="60px"><LuRefreshCcw /></Button>
            <Button bg="blue.600" color="white" h="60px" px={8} borderRadius="2xl" fontWeight="bold">Novo Lançamento</Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={16}>
          <SummaryCard title="Total Recebido" value={formatMoney(stats.received)} color="green" icon={LuTrendingUp} />
          <SummaryCard title="Previsão Pendente" value={formatMoney(stats.pending)} color="orange" icon={LuClock} />
        </SimpleGrid>

        <VStack align="stretch" gap={5}>
          {payments.map((p) => (
            <Box 
              key={p._id} p={7} borderRadius="32px" border="1px solid" borderColor="gray.100"
              transition="0.3s" _hover={{ shadow: "2xl", transform: "translateX(10px)", borderColor: "blue.100" }}
            >
              <Grid templateColumns={{ base: "1fr", md: "2.5fr 1fr 1fr" }} gap={6} alignItems="center">
                <GridItem>
                  <HStack gap={5}>
                    <Center bg="blue.50" color="blue.600" w="14" h="14" borderRadius="22px"><LuReceipt size={26} /></Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="lg">{p.tenantId?.fullName || "Inquilino"}</Text>
                      <Text fontSize="sm" color="gray.400">{p.contractId?.propertyAddress || "Sem endereço"}</Text>
                    </VStack>
                  </HStack>
                </GridItem>
                <GridItem><Text fontSize="xl" fontWeight="900" textAlign="right">{formatMoney(p.amount)}</Text></GridItem>
                <GridItem textAlign="right">
                  <Button variant="ghost" colorPalette="blue" onClick={() => generateReceipt(p)}>
                    <HStack gap={2}><LuDownload size={18} /><Text fontSize="sm" fontWeight="bold">Recibo</Text></HStack>
                  </Button>
                </GridItem>
              </Grid>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}

function SummaryCard({ title, value, color, icon }: any) {
  return (
    <Box p={10} bg="white" borderRadius="40px" border="1px solid" borderColor="gray.50" shadow="sm">
      <VStack align="start" gap={4}>
        <Center w="12" h="12" bg={`${color}.50`} color={`${color}.600`} borderRadius="xl"><Icon as={icon} /></Center>
        <Box><Text fontSize="xs" color="gray.400" fontWeight="black">{title.toUpperCase()}</Text><Heading size="xl" fontWeight="900">{value}</Heading></Box>
      </VStack>
    </Box>
  );
}