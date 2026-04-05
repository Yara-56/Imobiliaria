"use client";

import { useState, useMemo } from "react";
import { 
  Box, Container, Heading, Text, VStack, HStack, Button, Icon, 
  Input, Grid, GridItem, Center, Spinner, Flex, SimpleGrid,
  IconButton, createListCollection
} from "@chakra-ui/react";
import { 
  LuDollarSign, LuPlus, LuSearch, LuDownload, 
  LuCalendar, LuUser, LuReceipt, LuCircleCheck, LuClock, 
  LuCircleX, LuTrendingUp, LuArrowUpDown, LuEye, LuPencil
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  SelectContent, SelectItem, SelectItemText,
  SelectRoot, SelectTrigger, SelectValueText,
} from "../../../components/ui/select";
import { usePayments } from "../hooks/usePayments";
import { Payment } from "../types/payment.types";
import StatusBadge from "../components/StatusBadge";
import { formatMoney, formatDateShort } from "../utils/formatters";

export default function PaymentsListPage() {
  const navigate = useNavigate();
  const { payments, isLoading } = usePayments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "amount">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (searchTerm) {
      result = result.filter(p => {
        const tenant = typeof p.tenantId === 'object' ? p.tenantId : null;
        const contract = typeof p.contractId === 'object' ? p.contractId : null;
        const tenantName = tenant?.fullName || '';
        const propertyAddress = contract?.propertyAddress || '';
        return (
          tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    if (monthFilter !== "all") {
      result = result.filter(p => p.referenceMonth?.startsWith(monthFilter));
    }

    result.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
      }
      return sortOrder === "asc" 
        ? a.dueDate.localeCompare(b.dueDate)
        : b.dueDate.localeCompare(a.dueDate);
    });

    return result;
  }, [payments, searchTerm, statusFilter, monthFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = filteredPayments.reduce((sum, p) => sum + p.totalAmount, 0);
    const paid = filteredPayments.filter(p => p.status === "Pago").reduce((sum, p) => sum + p.totalAmount, 0);
    const pending = filteredPayments.filter(p => p.status === "Pendente").reduce((sum, p) => sum + p.totalAmount, 0);
    const overdue = filteredPayments.filter(p => p.status === "Atrasado").reduce((sum, p) => sum + p.totalAmount, 0);
    return { total, paid, pending, overdue, count: filteredPayments.length };
  }, [filteredPayments]);

  const toggleSort = (field: "dueDate" | "amount") => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const statusCollection = createListCollection({
    items: [
      { label: "Todos os Status", value: "all" },
      { label: "✓ Pago", value: "Pago" },
      { label: "⏱ Pendente", value: "Pendente" },
      { label: "✗ Atrasado", value: "Atrasado" },
    ]
  });

  const monthCollection = createListCollection({
    items: [
      { label: "Todos os Meses", value: "all" },
      { label: "Março 2026", value: "2026-03" },
      { label: "Fevereiro 2026", value: "2026-02" },
      { label: "Janeiro 2026", value: "2026-01" },
    ]
  });

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
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="7xl">
        
        <Flex justify="space-between" align="center" mb={12} wrap="wrap" gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuDollarSign} boxSize={6} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">GESTÃO FINANCEIRA</Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Todos os Pagamentos
            </Heading>
            <Text color="gray.500" fontWeight="medium">{stats.count} lançamentos</Text>
          </VStack>

          <HStack gap={4}>
            <Button variant="outline" h="60px" px={6} borderRadius="2xl" fontWeight="900">
              <Icon as={LuDownload} mr={2} /> EXPORTAR
            </Button>
            <Button onClick={() => navigate("/payments/new")} bg="blue.600" color="white" h="60px" px={8} borderRadius="2xl" fontWeight="900">
              <Icon as={LuPlus} mr={2} /> NOVO PAGAMENTO
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={10}>
          <StatCard label="Total Geral" value={formatMoney(stats.total)} icon={LuTrendingUp} color="blue" />
          <StatCard label="Recebido" value={formatMoney(stats.paid)} icon={LuCircleCheck} color="green" />
          <StatCard label="Pendente" value={formatMoney(stats.pending)} icon={LuClock} color="orange" />
          <StatCard label="Atrasado" value={formatMoney(stats.overdue)} icon={LuCircleX} color="red" />
        </SimpleGrid>

        <Box bg="white" p={6} borderRadius="3xl" border="1px solid" borderColor="gray.100" mb={8}>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={4}>
            <GridItem>
              <HStack>
                <Icon as={LuSearch} color="gray.400" />
                <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} variant="subtle" size="lg" borderRadius="xl" fontWeight="600" />
              </HStack>
            </GridItem>
            <GridItem>
              <SelectRoot collection={statusCollection} value={[statusFilter]} onValueChange={(e) => setStatusFilter(e.value[0])} size="lg">
                <SelectTrigger borderRadius="xl" fontWeight="600"><SelectValueText placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {statusCollection.items.map((item) => (
                    <SelectItem key={item.value} item={item}><SelectItemText>{item.label}</SelectItemText></SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </GridItem>
            <GridItem>
              <SelectRoot collection={monthCollection} value={[monthFilter]} onValueChange={(e) => setMonthFilter(e.value[0])} size="lg">
                <SelectTrigger borderRadius="xl" fontWeight="600"><SelectValueText placeholder="Mês" /></SelectTrigger>
                <SelectContent>
                  {monthCollection.items.map((item) => (
                    <SelectItem key={item.value} item={item}><SelectItemText>{item.label}</SelectItemText></SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </GridItem>
          </Grid>
        </Box>

        <VStack align="stretch" gap={3}>
          <Grid templateColumns="2fr 1.5fr 1fr 1fr 1fr 120px" gap={4} px={6} display={{ base: "none", lg: "grid" }}>
            <GridItem><Text fontWeight="black" fontSize="xs" color="gray.400">INQUILINO</Text></GridItem>
            <GridItem><Text fontWeight="black" fontSize="xs" color="gray.400">IMÓVEL</Text></GridItem>
            <GridItem>
              <Button variant="ghost" size="sm" onClick={() => toggleSort("dueDate")} fontWeight="black" fontSize="xs" color="gray.400">
                VENCIMENTO <Icon as={LuArrowUpDown} ml={1} boxSize={3} />
              </Button>
            </GridItem>
            <GridItem>
              <Button variant="ghost" size="sm" onClick={() => toggleSort("amount")} fontWeight="black" fontSize="xs" color="gray.400">
                VALOR <Icon as={LuArrowUpDown} ml={1} boxSize={3} />
              </Button>
            </GridItem>
            <GridItem><Text fontWeight="black" fontSize="xs" color="gray.400">STATUS</Text></GridItem>
            <GridItem><Text fontWeight="black" fontSize="xs" color="gray.400" textAlign="center">AÇÕES</Text></GridItem>
          </Grid>

          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => {
              const tenant = typeof payment.tenantId === 'object' ? payment.tenantId : null;
              const contract = typeof payment.contractId === 'object' ? payment.contractId : null;
              const tenantName = tenant?.fullName || 'Inquilino';
              const propertyAddress = contract?.propertyAddress || 'Endereço';
              
              return (
                <Box key={payment._id} bg="white" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.50" transition="all 0.3s" _hover={{ shadow: "xl", borderColor: "blue.100" }} cursor="pointer" onClick={() => navigate(`/payments/${payment._id}`)}>
                  <Grid templateColumns={{ base: "1fr", lg: "2fr 1.5fr 1fr 1fr 1fr 120px" }} gap={4} alignItems="center">
                    <GridItem>
                      <HStack gap={3}>
                        <Center bg="blue.50" color="blue.600" boxSize="48px" borderRadius="xl"><Icon as={LuUser} boxSize={5} /></Center>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="900" fontSize="md">{tenantName}</Text>
                          <Text fontSize="xs" color="gray.400" fontWeight="600">{payment.description || "Pagamento"}</Text>
                        </VStack>
                      </HStack>
                    </GridItem>
                    <GridItem display={{ base: "none", lg: "block" }}>
                      <Text fontSize="sm" fontWeight="700" color="gray.600" lineClamp={1}>{propertyAddress}</Text>
                    </GridItem>
                    <GridItem display={{ base: "none", lg: "block" }}>
                      <HStack gap={2}><Icon as={LuCalendar} color="gray.400" boxSize={4} /><Text fontSize="sm" fontWeight="900">{formatDateShort(payment.dueDate)}</Text></HStack>
                    </GridItem>
                    <GridItem display={{ base: "none", lg: "block" }}>
                      <Text fontSize="lg" fontWeight="900" color="gray.800">{formatMoney(payment.totalAmount)}</Text>
                    </GridItem>
                    <GridItem>
                      <StatusBadge status={payment.status} />
                    </GridItem>
                    <GridItem>
                      <HStack gap={2} justify="center">
                        <IconButton aria-label="Ver" variant="ghost" colorPalette="blue" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/payments/${payment._id}`); }}><Icon as={LuEye} /></IconButton>
                        <IconButton aria-label="Editar" variant="ghost" colorPalette="blue" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/payments/edit/${payment._id}`); }}><Icon as={LuPencil} /></IconButton>
                        <IconButton aria-label="Recibo" variant="ghost" colorPalette="green" size="sm" onClick={(e) => { e.stopPropagation(); }}><Icon as={LuReceipt} /></IconButton>
                      </HStack>
                    </GridItem>
                  </Grid>
                </Box>
              );
            })
          ) : (
            <Center py={20} bg="white" borderRadius="3xl" border="1px dashed" borderColor="gray.200">
              <VStack gap={3}>
                <Icon as={LuReceipt} boxSize={16} color="gray.300" />
                <Text fontWeight="bold" color="gray.400" fontSize="lg">Nenhum pagamento encontrado</Text>
                <Button onClick={() => navigate("/payments/new")} colorPalette="blue" mt={4} borderRadius="xl" fontWeight="900">
                  <Icon as={LuPlus} mr={2} /> Criar Primeiro Pagamento
                </Button>
              </VStack>
            </Center>
          )}
        </VStack>

      </Container>
    </Box>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <Box bg="white" p={6} borderRadius="3xl" border="1px solid" borderColor="gray.50" shadow="sm">
      <VStack align="start" gap={3}>
        <Center w="12" h="12" bg={`${color}.50`} color={`${color}.600`} borderRadius="xl"><Icon as={icon} boxSize={5} /></Center>
        <Box>
          <Text fontSize="xs" color="gray.400" fontWeight="black">{label.toUpperCase()}</Text>
          <Heading size="lg" fontWeight="900" mt={1}>{value}</Heading>
        </Box>
      </VStack>
    </Box>
  );
}