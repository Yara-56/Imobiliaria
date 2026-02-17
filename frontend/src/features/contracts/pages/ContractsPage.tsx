"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid, Input, VStack
} from "@chakra-ui/react";
import { 
  LuFileText, LuPlus, LuRefreshCcw, LuCircleCheck, LuTriangleAlert, LuExternalLink, LuInbox, LuReceipt
} from "react-icons/lu"; 
import api from "../../../core/api/api";
import { StatCard } from "../../../components/ui/StatCardTemp";

interface Contract {
  _id: string; 
  landlordName: string;
  landlordCPF: string;
  propertyAddress: string;
  rentAmount: number;
  startDate: string;
  status: "Ativo" | "Encerrado" | "Renovação" | "Atrasado";
  receiptUrl?: string; 
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const currencyFormatter = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const fetchContracts = async () => {
    try {
      setLoading(true);
      // ✅ Requisição ao backend na porta 3001 configurada no seu MacBook
      const { data } = await api.get("/contracts");
      setContracts(data);
    } catch (err) {
      console.error("Erro na API ImobiSys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  if (loading) return (
    <Center h="60vh">
      <VStack gap={4}>
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
        <Text color="gray.500">Sincronizando contratos com o servidor...</Text>
      </VStack>
    </Center>
  );

  return (
    <Box pb={10} p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={10} wrap="wrap" gap={6}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900" letterSpacing="tight">Gestão de Contratos</Heading>
          <Text color="gray.500">Administração de vigências para a imobiliária.</Text>
        </Stack>
        <Flex gap={3}>
          <Button variant="outline" onClick={fetchContracts} borderRadius="xl">
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" size="lg" borderRadius="2xl" px={8} gap={2}>
            <LuPlus size={20} /> Novo Contrato
          </Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <StatCard title="Vigentes" count={contracts.filter(c => c.status === "Ativo").length} color="green" icon={<LuCircleCheck size={26} />} />
        <StatCard title="Pendências" count={contracts.filter(c => c.status === "Atrasado").length} color="red" icon={<LuTriangleAlert size={26} />} />
        <StatCard title="Total" count={contracts.length} color="gray" icon={<LuFileText size={26} />} />
      </SimpleGrid>

      <Box mb={8}>
        <Input 
          placeholder="Buscar por proprietário ou endereço do imóvel..." 
          size="lg" h="60px" borderRadius="2xl" bg="white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
        />
      </Box>

      <Box bg="white" borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflowX="auto">
        {filteredContracts.length > 0 ? (
          <Table.Root variant="line" size="lg">
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader py={6}>Inquilino / Imóvel</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Valor Mensal</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredContracts.map((c) => (
                <Table.Row key={c._id}>
                  <Table.Cell py={5}>
                    <Flex align="center" gap={4}>
                      <Center w="10" h="10" bg="blue.50" color="blue.600" borderRadius="xl">
                        <LuFileText size={20} />
                      </Center>
                      <Stack gap={0}>
                        <Text fontWeight="bold">{c.landlordName}</Text>
                        <Text fontSize="xs" color="gray.500">{c.propertyAddress}</Text>
                      </Stack>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={c.status === "Ativo" ? "green" : "red"} variant="surface">
                      {c.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontWeight="bold">
                    {currencyFormatter.format(c.rentAmount)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      {/* ✅ CORREÇÃO TS: asChild para compor o <a> com estilo de Button */}
                      {c.receiptUrl ? (
                        <Button 
                          asChild 
                          variant="subtle" 
                          size="sm" 
                          borderRadius="xl" 
                          gap={2}
                        >
                          <a 
                            href={`http://localhost:3001${c.receiptUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <LuReceipt size={16} /> Ver PDF
                          </a>
                        </Button>
                      ) : (
                        <Button variant="subtle" size="sm" borderRadius="xl" gap={2} disabled>
                          <LuReceipt size={16} /> Sem PDF
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" borderRadius="xl">
                        <LuExternalLink size={16} />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : (
          <Center py={20} flexDirection="column" gap={4}>
             <LuInbox size={40} color="#CBD5E0" />
             <Text color="gray.500">Nenhum contrato encontrado para sua busca.</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}