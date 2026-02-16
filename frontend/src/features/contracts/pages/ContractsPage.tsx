import { useEffect, useState, useMemo } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid, Input 
} from "@chakra-ui/react";
import { 
  LuFileText, LuPlus, LuRefreshCcw, LuCalendar, LuClock, LuCircleCheck, LuTriangleAlert, LuSearch, LuExternalLink
} from "react-icons/lu";
import api from "../../../core/api/api";

// Interface aprimorada
interface Contract {
  id: string;
  tenantName: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  rentValue: number;
  status: "Ativo" | "Encerrado" | "Renovação" | "Atrasado";
}

const StatCard = ({ title, count, icon, color }: any) => (
  <Box p={5} bg="white" borderRadius="24px" border="1px solid" borderColor="gray.100" shadow="sm">
    <Flex align="center" gap={4}>
      <Box p={3} bg={`${color}.50`} color={`${color}.600`} borderRadius="xl">
        {icon}
      </Box>
      <Stack gap={0}>
        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">{title}</Text>
        <Heading size="md" color="gray.800">{count}</Heading>
      </Stack>
    </Flex>
  </Box>
);

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

  // Filtro dinâmico (Search)
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  if (loading) return <Center h="60vh"><Spinner size="xl" color="blue.500" borderWidth="4px" /></Center>;

  return (
    <Box pb={10}>
      {/* Cabeçalho Pro */}
      <Flex justify="space-between" align="flex-end" mb={8} wrap="wrap" gap={4}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="black" letterSpacing="tight">Gestão de Contratos</Heading>
          <Text color="gray.500">Monitore vigências, reajustes e documentos jurídicos.</Text>
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

      {/* Grid de KPIs Dinâmicos */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <StatCard 
          title="Contratos Vigentes" 
          count={contracts.filter(c => c.status === "Ativo").length} 
          color="green" 
          icon={<LuCircleCheck size={24} />} 
        />
        <StatCard 
          title="Próximos do Fim" 
          count={contracts.filter(c => c.status === "Renovação").length} 
          color="blue" 
          icon={<LuClock size={24} />} 
        />
        <StatCard 
          title="Inadimplentes / Vencidos" 
          count={contracts.filter(c => c.status === "Atrasado" || c.status === "Encerrado").length} 
          color="red" 
          icon={<LuTriangleAlert size={24} />} 
        />
      </SimpleGrid>

      {/* Barra de Busca */}
      <Box mb={6}>
        <Input 
          placeholder="Buscar por inquilino ou imóvel..." 
          size="lg"
          borderRadius="15px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.600" border="1px solid" borderColor="red.100">
          <Stack align="center" gap={3}>
            <LuTriangleAlert size={40} />
            <Text fontWeight="bold">Erro de conexão com o servidor.</Text>
            <Button size="sm" onClick={fetchContracts} colorPalette="red" variant="subtle">Tentar Novamente</Button>
          </Stack>
        </Center>
      ) : (
        <Box bg="white" p={6} borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100">
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color="gray.400">Inquilino & Imóvel</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Vigência (Fim)</Table.ColumnHeader>
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
                        <Text fontWeight="bold" color="gray.800" fontSize="md">{c.tenantName}</Text>
                        <Text fontSize="xs" color="gray.500">{c.propertyTitle}</Text>
                      </Stack>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Stack gap={0}>
                      <Flex alignItems="center" gap={1.5} fontSize="sm" fontWeight="bold" color="gray.700">
                        <LuCalendar size={14} color="#3182ce"/> {c.endDate}
                      </Flex>
                      <Text fontSize="xs" color="gray.400">Início: {c.startDate}</Text>
                    </Stack>
                  </Table.Cell>

                  <Table.Cell fontWeight="black" color="gray.800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.rentValue)}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge 
                      colorPalette={
                        c.status === "Ativo" ? "green" : 
                        c.status === "Renovação" ? "blue" : "red"
                      } 
                      variant="surface"
                      borderRadius="full"
                      px={4}
                      py={1}
                      textTransform="uppercase"
                      fontSize="2xs"
                    >
                      {c.status}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    <Button variant="ghost" size="sm" color="blue.600" fontWeight="bold" gap={2} borderRadius="lg">
                      Visualizar <LuExternalLink size={14}/>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          
          {filteredContracts.length === 0 && (
            <Center p={20} flexDirection="column" gap={3}>
              <LuSearch size={40} color="#CBD5E0" />
              <Text color="gray.500" fontWeight="medium">Nenhum contrato corresponde à sua busca.</Text>
            </Center>
          )}
        </Box>
      )}
    </Box>
  );
}