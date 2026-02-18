"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid, Input, VStack
} from "@chakra-ui/react";
import { 
  LuFileText, LuPlus, LuRefreshCcw, LuCircleCheck, LuTriangleAlert, LuInbox, LuReceipt
} from "react-icons/lu"; 
import api from "@/core/api/api"; // ✅ Caminho alinhado com sua estrutura
import { StatCard } from "@/components/ui/StatCardTemp";

interface Contract {
  _id: string; 
  landlordName: string;
  propertyAddress: string;
  rentAmount: number;
  status: "Ativo" | "Encerrado" | "Renovação" | "Atrasado";
  receiptUrl?: string; 
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contracts");
      setContracts(data?.data?.contracts || []); // ✅ Acessando via data.data
    } catch (err) {
      console.error("Erro ImobiSys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.landlordName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  if (loading) return <Center h="60vh"><Spinner size="xl" color="blue.500" /></Center>;

  return (
    <Box p={{ base: 4, md: 8 }} pb={10}>
      <Flex justify="space-between" align="center" mb={10} wrap="wrap" gap={6}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900">Gestão de Contratos</Heading>
          <Text color="gray.500">Administração de vigências imobiliárias.</Text>
        </Stack>
        <Button bg="blue.500" color="white" h="50px" px={8} borderRadius="2xl" gap={2}>
          <LuPlus size={20} /> Novo Contrato
        </Button>
      </Flex>

      {/* ✅ Cards de Resumo que aparecem no seu print */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <StatCard title="Vigentes" count={contracts.filter(c => c.status === "Ativo").length.toString()} color="green" icon={<LuCircleCheck size={26} />} />
        <StatCard title="Pendências" count={contracts.filter(c => c.status === "Atrasado").length.toString()} color="red" icon={<LuTriangleAlert size={26} />} />
        <StatCard title="Total" count={contracts.length.toString()} color="gray" icon={<LuFileText size={26} />} />
      </SimpleGrid>

      <Input 
        placeholder="Buscar por proprietário ou endereço..." 
        mb={8} h="60px" borderRadius="2xl" bg="white" 
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
      />

      <Box bg="white" borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflowX="auto">
        {filteredContracts.length > 0 ? (
          <Table.Root variant="line" size="lg">
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader py={6} px={8}>Proprietário / Imóvel</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Valor</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredContracts.map((c) => (
                <Table.Row key={c._id}>
                  <Table.Cell py={5} px={8}>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" color="gray.800">{c.landlordName}</Text>
                      <Text fontSize="xs" color="gray.500">{c.propertyAddress}</Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell><Badge colorPalette="green">{c.status}</Badge></Table.Cell>
                  <Table.Cell fontWeight="bold">R$ {c.rentAmount?.toLocaleString()}</Table.Cell>
                  <Table.Cell textAlign="right" px={8}>
                    {c.receiptUrl && <LuReceipt color="gray.300" />}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : (
          <Center py={20} flexDirection="column" gap={4}>
            <LuInbox size={40} color="#CBD5E0" />
            <Text color="gray.500">Nenhum contrato encontrado.</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}