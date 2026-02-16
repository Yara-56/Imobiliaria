import { useEffect, useState } from "react";
import { 
  Box, Flex, Heading, Text, Stack, SimpleGrid, Badge, Table, Button, Spinner, Center 
} from "@chakra-ui/react";
import { LuTrendingUp, LuDownload, LuRefreshCcw, LuCircleAlert, LuClock } from "react-icons/lu";
import api from "../../../core/api/api";

// ✅ Interface ajustada: 'amount' como number para permitir cálculos
interface Payment {
  id: string;
  tenantName: string;
  propertyTitle: string;
  amount: number; // Backends profissionais enviam número
  dueDate: string;
  status: "Pago" | "Pendente" | "Atrasado";
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (err) {
      console.error("Erro ao carregar financeiro:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Lógica dinâmica para os Cards de Resumo
  const totalReceived = payments
    .filter(p => p.status === "Pago")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "Pendente")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Formatador de Moeda Brasileiro
  const formatMoney = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="black" letterSpacing="tight">Financeiro</Heading>
          <Text color="gray.500">Gestão de fluxo de caixa em tempo real.</Text>
        </Stack>
        <Flex gap={3}>
          <Button variant="outline" onClick={fetchPayments} borderRadius="xl">
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" borderRadius="xl" gap={2} shadow="md">
            <LuDownload size={18} /> Exportar
          </Button>
        </Flex>
      </Flex>

      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" border="1px solid" borderColor="red.100">
          Erro ao conectar com a API financeira. Verifique o backend.
        </Center>
      ) : (
        <>
          {/* ✅ Cards AGORA DINÂMICOS baseados nos dados do backend */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
            <StatCard title="Recebido" value={formatMoney(totalReceived)} color="green" icon={<LuTrendingUp />} />
            <StatCard title="Pendente" value={formatMoney(totalPending)} color="orange" icon={<LuClock />} />
            <StatCard title="Atrasado" value={formatMoney(0)} color="red" icon={<LuCircleAlert />} />
          </SimpleGrid>

          <Box bg="white" p={6} borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100">
            <Table.Root variant="line" size="lg">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader color="gray.400">Inquilino / Imóvel</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Vencimento</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Valor</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right" color="gray.400">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {payments.map((p) => (
                  <Table.Row key={p.id} _hover={{ bg: "gray.50" }} transition="0.2s">
                    <Table.Cell>
                      <Stack gap={0}>
                        <Text fontWeight="bold" color="gray.700">{p.tenantName}</Text>
                        <Text fontSize="xs" color="gray.400">{p.propertyTitle}</Text>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell fontSize="sm" color="gray.600">{p.dueDate}</Table.Cell>
                    <Table.Cell fontWeight="bold">{formatMoney(p.amount)}</Table.Cell>
                    <Table.Cell>
                      <Badge 
                        colorPalette={p.status === "Pago" ? "green" : p.status === "Atrasado" ? "red" : "orange"} 
                        variant="surface"
                        borderRadius="full"
                        px={3}
                      >
                        {p.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Button variant="ghost" size="sm" color="blue.600" fontWeight="bold">Recibo</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </>
      )}
    </Box>
  );
}

// ✅ Componente Auxiliar para os Cards (Melhor organização)
function StatCard({ title, value, color, icon }: any) {
  return (
    <Box p={5} bg="white" borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100">
      <Flex align="center" gap={4}>
        <Box p={3} bg={`${color}.50`} color={`${color}.600`} borderRadius="xl">
          {icon}
        </Box>
        <Stack gap={0}>
          <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">{title}</Text>
          <Heading size="md" color="gray.800">{value}</Heading>
        </Stack>
      </Flex>
    </Box>
  );
}