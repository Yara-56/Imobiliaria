import { useEffect, useState } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center 
} from "@chakra-ui/react";
import { LuPlus, LuRefreshCcw, LuHouse } from "react-icons/lu";
import api from "../../../core/api/api"; // Verifique se este caminho está correto conforme sua pasta core

// Interface para os dados reais do seu banco
interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  status: "Disponível" | "Alugado" | "Vendido" | "Manutenção";
}

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Busca os dados do backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/properties"); 
      setProperties(response.data);
    } catch (err) {
      console.error("Erro ao carregar imóveis:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Cores dos Badges
  const statusMap: Record<string, string> = {
    Disponível: "green",
    Alugado: "blue",
    Vendido: "purple",
    Manutenção: "orange",
  };

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
          <Heading size="xl" fontWeight="black" letterSpacing="tight">Imóveis</Heading>
          <Text color="gray.500">Listagem de patrimônio integrada ao backend.</Text>
        </Stack>
        <Flex gap={3}>
          <Button variant="outline" onClick={fetchProperties} borderRadius="xl">
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" size="lg" borderRadius="xl" gap={2} shadow="md">
            <LuPlus size={20} /> Novo Imóvel
          </Button>
        </Flex>
      </Flex>

      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" border="1px solid" borderColor="red.100">
          Não foi possível carregar os imóveis. Verifique se o backend está ativo.
        </Center>
      ) : (
        <Box bg="white" p={6} borderRadius="24px" shadow="sm" borderWidth="1px" borderColor="gray.100">
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color="gray.400">Propriedade</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Valor</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" color="gray.400">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {properties.map((prop) => (
                <Table.Row key={prop.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell>
                    <Flex align="center" gap={3}>
                      <Box p={2} bg="blue.50" color="blue.500" borderRadius="lg">
                        <LuHouse size={18} />
                      </Box>
                      <Stack gap={0}>
                        <Text fontWeight="bold" color="gray.700">{prop.title}</Text>
                        <Text fontSize="xs" color="gray.400">{prop.address}</Text>
                      </Stack>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell fontWeight="semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge colorPalette={statusMap[prop.status] || "gray"} variant="surface" borderRadius="full">
                      {prop.status}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    <Button variant="ghost" color="blue.600">Detalhes</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          {properties.length === 0 && <Center p={10} color="gray.400">Nenhum imóvel disponível.</Center>}
        </Box>
      )}
    </Box>
  );
}