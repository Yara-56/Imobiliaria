"use client"
import { useQuery } from "@tanstack/react-query";
import api from "@/core/api/api"; // ✅ Agora o alias vai funcionar!
import { 
  Box, Flex, Heading, Text, Button, Table, Badge, 
  HStack, Spinner, Center, VStack, Icon 
} from "@chakra-ui/react";
import { LuPlus, LuHouse, LuMapPin, LuChevronRight } from "react-icons/lu";

export default function PropertiesPage() {
  // Conecta com o seu backend Node na porta 3001
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await api.get("/properties");
      return response.data;
    }
  });

  if (isLoading) return <Center h="400px"><Spinner color="blue.500" size="xl" /></Center>;
  if (error) return <Center h="400px"><Text color="red.500">Erro ao conectar com o servidor.</Text></Center>;

  return (
    <Box p={8} bg="white" minH="100vh">
      {/* HEADER LIMPO */}
      <Flex justify="space-between" align="center" mb={10}>
        <VStack align="start" gap={1}>
          <Heading size="2xl" fontWeight="900" letterSpacing="tighter" color="gray.800">
            Imóveis
          </Heading>
          <Text color="gray.500">Gestão de {properties?.length || 0} ativos no MongoDB</Text>
        </VStack>
        
        <Button 
          bg="blue.600" color="white" h="56px" px={8} borderRadius="16px"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
          shadow="0 10px 20px rgba(49, 130, 206, 0.2)"
        >
          <LuPlus /> <Text ml={2} fontWeight="bold">Novo Imóvel</Text>
        </Button>
      </Flex>

      {/* TABELA PROFISSIONAL (Adeus fundo preto!) */}
      <Box borderRadius="24px" border="1px solid" borderColor="gray.100" overflow="hidden" shadow="sm">
        <Table.Root variant="line">
          <Table.Header bg="gray.50/50">
            <Table.Row>
              <Table.ColumnHeader py={5} px={8} color="gray.400" fontSize="xs" fontWeight="black">PROPRIEDADE</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.400" fontSize="xs" fontWeight="black">VALOR</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.400" fontSize="xs" fontWeight="black">STATUS</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {properties?.map((p: any) => (
              <Table.Row key={p.id} _hover={{ bg: "blue.50/10" }} transition="0.2s">
                <Table.Cell px={8} py={6}>
                  <HStack gap={4}>
                    <Center w="44px" h="44px" bg="blue.50" color="blue.600" borderRadius="12px">
                      <LuHouse size={20} />
                    </Center>
                    <Box>
                      <Text fontWeight="bold" color="gray.800">{p.name}</Text>
                      <HStack gap={1} color="gray.400" fontSize="xs">
                        <LuMapPin size={12} /> <Text>{p.address}</Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Table.Cell>
                <Table.Cell fontWeight="bold">R$ {p.price}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={p.status === 'active' ? 'green' : 'blue'} variant="subtle" borderRadius="md">
                    {p.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right" px={8}>
                  <Icon as={LuChevronRight} color="gray.300" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}