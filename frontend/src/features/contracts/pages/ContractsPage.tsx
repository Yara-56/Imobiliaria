import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid, Input 
} from "@chakra-ui/react";
// ✅ LuSearch agora será utilizado abaixo
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

  if (loading) return <Center h="60vh"><Spinner size="xl" color="blue.500" borderWidth="4px" /></Center>;

  return (
    <Box pb={10}>
      <Flex justify="space-between" align="flex-end" mb={8} wrap="wrap" gap={4}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="black" letterSpacing="tight">Gestão de Contratos</Heading>
          <Text color="gray.500">Monitore vigências e documentos jurídicos.</Text>
        </Stack>
        <Flex gap={3}>
          <Button variant="outline" onClick={fetchContracts} borderRadius="xl" px={6}>
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" size="lg" borderRadius="xl" gap={2} shadow="md" px={8}>
            <LuPlus size={20} /> Novo Contrato
          </Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <StatCard 
          title="Contratos Vigentes" 
          count={contracts.filter(c => c.status === "Ativo").length} 
          color="green" 
          icon={<LuCircleCheck size={24} />} 
        />
        <StatCard 
          title="Em Renovação" 
          count={contracts.filter(c => c.status === "Renovação").length} 
          color="blue" 
          icon={<LuClock size={24} />} 
        />
        <StatCard 
          title="Inadimplentes" 
          count={contracts.filter(c => c.status === "Atrasado" || c.status === "Encerrado").length} 
          color="red" 
          icon={<LuTriangleAlert size={24} />} 
        />
      </SimpleGrid>

      {/* 🔍 BARRA DE BUSCA COM O ÍCONE LuSearch APLICADO */}
      <Box mb={6} position="relative">
        <Flex align="center" position="absolute" left={4} height="100%" color="gray.400">
           <LuSearch size={20} />
        </Flex>
        <Input 
          placeholder="Buscar por inquilino ou imóvel..." 
          size="lg"
          pl="45px" // Espaço para o ícone não sobrepor o texto
          borderRadius="15px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          _focus={{ borderColor: "blue.500", shadow: "sm" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.600">
          <Text fontWeight="bold">Erro de conexão com o servidor.</Text>
        </Center>
      ) : (
        <Box bg="white" p={6} borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100">
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color="gray.400">Inquilino & Imóvel</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Vencimento</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Mensalidade</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" color="gray.400">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredContracts.map((c) => (
                <Table.Row key={c.id} _hover={{ bg: "gray.50/50" }} transition="0.2s">
                  <Table.Cell>
                    <Flex align="center" gap={3}>
                      <Box p={2.5} bg="blue.50" color="blue.600" borderRadius="xl">
                        <LuFileText size={20} />
                      </Box>
                      <Stack gap={0}>
                        <Text fontWeight="bold" color="gray.800">{c.tenantName}</Text>
                        <Text fontSize="xs" color="gray.500">{c.propertyTitle}</Text>
                      </Stack>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="bold" fontSize="sm">{c.endDate}</Text>
                    <Text fontSize="xs" color="gray.400">Início: {c.startDate}</Text>
                  </Table.Cell>
                  <Table.Cell fontWeight="black">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.rentValue)}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={c.status === "Ativo" ? "green" : "red"} variant="surface" borderRadius="full" px={3}>
                      {c.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button variant="ghost" size="sm" color="blue.600" fontWeight="bold">
                      Detalhes <LuExternalLink size={14} style={{ marginLeft: '4px' }} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          
          {filteredContracts.length === 0 && (
            <Center p={10} flexDirection="column" gap={2}>
              <LuSearch size={30} color="gray" opacity={0.3} />
              <Text color="gray.400" fontStyle="italic">Nenhum contrato encontrado para "{searchTerm}"</Text>
            </Center>
          )}
        </Box>
      )}
    </Box>
  );
}