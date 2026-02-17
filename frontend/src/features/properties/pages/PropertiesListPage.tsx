"use client"

import { useEffect, useState } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center 
} from "@chakra-ui/react";
import { LuPlus, LuRefreshCcw, LuHouse } from "react-icons/lu";
import api from "../../../core/api/api"; 

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

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(false);
      // ✅ Simulação ou chamada real - Ajuste o endpoint conforme seu backend
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
      {/* HEADER DA PÁGINA */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }} mb={8} direction={{ base: "column", md: "row" }} gap={4}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900" letterSpacing="tight">Imóveis</Heading>
          <Text color="gray.500">Gestão de patrimônio e disponibilidade em tempo real.</Text>
        </Stack>
        <Flex gap={3} w={{ base: "full", md: "auto" }}>
          <Button variant="outline" onClick={fetchProperties} borderRadius="xl" border="1px solid" borderColor="gray.200">
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" size="lg" borderRadius="xl" gap={2} shadow="md" flex={{ base: 1, md: "none" }}>
            <LuPlus size={20} /> Novo Imóvel
          </Button>
        </Flex>
      </Flex>

      {/* ÁREA DA TABELA / CONTEÚDO */}
      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" border="1px solid" borderColor="red.100" _dark={{ bg: "red.900/10", borderColor: "red.900/20" }}>
          Não foi possível carregar os imóveis. Verifique a conexão com o servidor.
        </Center>
      ) : (
        <Box 
          bg="white" 
          borderRadius="24px" 
          shadow="sm" 
          borderWidth="1px" 
          borderColor="gray.100" 
          overflow="hidden"
          _dark={{ bg: "gray.900", borderColor: "gray.800" }}
        >
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row bg="gray.50/50" _dark={{ bg: "whiteAlpha.50" }}>
                <Table.ColumnHeader py={4} color="gray.500">Propriedade</Table.ColumnHeader>
                <Table.ColumnHeader py={4} color="gray.500">Valor</Table.ColumnHeader>
                <Table.ColumnHeader py={4} color="gray.500">Status</Table.ColumnHeader>
                <Table.ColumnHeader py={4} textAlign="right" color="gray.500">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {properties.map((prop) => (
                <Table.Row key={prop.id} _hover={{ bg: "gray.50/50" }} transition="background 0.2s">
                  <Table.Cell py={5}>
                    <Flex align="center" gap={4}>
                      <Center w="10" h="10" bg="blue.50" color="blue.600" borderRadius="xl" _dark={{ bg: "blue.900/20" }}>
                        <LuHouse size={20} />
                      </Center>
                      <Stack gap={0}>
                        <Text fontWeight="bold" color="gray.800" _dark={{ color: "white" }}>{prop.title}</Text>
                        <Text fontSize="xs" color="gray.400">{prop.address}</Text>
                      </Stack>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell fontWeight="bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge colorPalette={statusMap[prop.status] || "gray"} variant="surface" borderRadius="full" px={3} py={1}>
                      {prop.status}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    <Button variant="ghost" size="sm" colorPalette="blue" fontWeight="bold">
                      Editar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {properties.length === 0 && (
            <Center p={20} flexDirection="column" gap={2}>
              <Text color="gray.400" fontWeight="medium">Nenhum imóvel encontrado.</Text>
              <Button variant="plain" colorPalette="blue" onClick={fetchProperties} fontWeight="bold">
                Tentar atualizar
              </Button>
            </Center>
          )}
        </Box>
      )}
    </Box>
  );
}