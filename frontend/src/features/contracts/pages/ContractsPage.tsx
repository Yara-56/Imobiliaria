"use client"

import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid, Input, Group
} from "@chakra-ui/react";
import { 
  LuFileText, LuPlus, LuRefreshCcw, LuClock, LuCircleCheck, LuTriangleAlert, LuSearch, LuExternalLink
} from "react-icons/lu"; 
import api from "../../../core/api/api";
import { StatCard } from "../../../core/components/ui/StatCardTemp";

interface Contract {
  id: string;
  tenantName: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  rentValue: number;
  status: "Ativo" | "Encerrado" | "Renovação" | "Atrasado";
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/contracts");
      // ✅ Corrigido: Agora usa setContracts e não setProperties
      setContracts(response.data);
    } catch (err) {
      console.error("Erro ao carregar contratos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  if (loading) return (
    <Center h="60vh">
      <Spinner size="xl" color="blue.500" borderWidth="4px" />
    </Center>
  );

  return (
    <Box pb={10}>
      <Flex justify="space-between" align={{ base: "start", md: "center" }} mb={10} wrap="wrap" gap={6}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900" letterSpacing="tight" color="gray.800" _dark={{ color: "white" }}>
            Gestão de Contratos
          </Heading>
          <Text color="gray.500">Documentação e vigências jurídicas.</Text>
        </Stack>
        <Flex gap={3}>
          <Button variant="outline" onClick={fetchContracts} borderRadius="xl" borderColor="gray.200" _dark={{ borderColor: "gray.800" }}>
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" size="lg" borderRadius="2xl" gap={2} px={8} shadow="md">
            <LuPlus size={20} /> Novo Contrato
          </Button>
        </Flex>
      </Flex>

      {/* Grid de Estatísticas ✅ Corrigido: 'red' agora é válido */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <StatCard title="Vigentes" count={contracts.filter(c => c.status === "Ativo").length} color="green" icon={<LuCircleCheck size={26} />} />
        <StatCard title="Em Renovação" count={contracts.filter(c => c.status === "Renovação").length} color="blue" icon={<LuClock size={26} />} />
        <StatCard title="Atrasados" count={contracts.filter(c => c.status === "Atrasado").length} color="red" icon={<LuTriangleAlert size={26} />} />
      </SimpleGrid>

      {/* Busca */}
      <Box mb={8}>
        <Group w="full" maxW="xl">
          <Center pl={4} color="gray.400">
            <LuSearch size={22} />
          </Center>
          <Input 
            placeholder="Buscar por inquilino ou imóvel..." 
            size="lg" h="56px" borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.100"
            _focus={{ borderColor: "blue.500", shadow: "md" }}
            _dark={{ bg: "gray.900", borderColor: "gray.800" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Group>
      </Box>

      {/* Tabela Principal */}
      <Box bg="white" borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden" _dark={{ bg: "gray.900", borderColor: "gray.800" }}>
        <Table.Root variant="line" size="lg">
          <Table.Header bg="gray.50/50" _dark={{ bg: "whiteAlpha.50" }}>
            <Table.Row borderColor="gray.100" _dark={{ borderColor: "gray.800" }}>
              <Table.ColumnHeader color="gray.500" py={6}>Inquilino & Imóvel</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.500">Vencimento</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.500">Valor</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.500">Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" color="gray.500">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredContracts.map((c) => (
              <Table.Row key={c.id} _hover={{ bg: "gray.50/50" }} _dark={{ _hover: { bg: "whiteAlpha.50" } }} transition="0.3s">
                <Table.Cell py={6}>
                  <Flex align="center" gap={4}>
                    <Center w="12" h="12" bg="blue.50" color="blue.600" borderRadius="2xl" _dark={{ bg: "blue.900/20", color: "blue.400" }}>
                      <LuFileText size={22} />
                    </Center>
                    <Stack gap={0}>
                      <Text fontWeight="bold">{c.tenantName}</Text>
                      <Text fontSize="xs" color="gray.500">{c.propertyTitle}</Text>
                    </Stack>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text fontWeight="semibold">{c.endDate}</Text>
                  <Text fontSize="xs" color="gray.500">Início: {c.startDate}</Text>
                </Table.Cell>
                <Table.Cell fontWeight="900" fontSize="lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.rentValue)}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={c.status === "Ativo" ? "green" : c.status === "Atrasado" ? "red" : "blue"} variant="surface" borderRadius="full" px={4}>
                    {c.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button variant="ghost" colorPalette="blue" size="sm" borderRadius="lg" gap={2}>
                    Detalhes <LuExternalLink size={16} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}