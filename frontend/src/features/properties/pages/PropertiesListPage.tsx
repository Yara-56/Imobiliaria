"use client"

import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center 
} from "@chakra-ui/react";
import { LuPlus, LuRefreshCcw, LuHouse, LuPencil, LuTrash2 } from "react-icons/lu";
import { useProperties } from "../hooks/useProperties"; // ✅ Usando seu hook completo
import { useNavigate } from "react-router-dom";

export default function PropertiesListPage() {
  const navigate = useNavigate();
  
  // ✅ Extraindo tudo o que seu hook oferece
  const { 
    properties, 
    isLoading, 
    error, 
    refresh, 
    removeProperty,
    isSubmitting 
  } = useProperties();

  const statusMap: Record<string, string> = {
    Disponível: "green",
    Alugado: "blue",
    Vendido: "purple",
    Manutenção: "orange",
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este imóvel?")) {
      await removeProperty(id);
    }
  };

  if (isLoading && properties.length === 0) {
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
          <Button 
            variant="outline" 
            onClick={() => refresh()} 
            borderRadius="xl" 
            loading={isLoading}
          >
            <LuRefreshCcw />
          </Button>
          <Button 
            colorPalette="blue" 
            size="lg" 
            borderRadius="xl" 
            gap={2} 
            shadow="md" 
            onClick={() => navigate("new")}
          >
            <LuPlus size={20} /> Novo Imóvel
          </Button>
        </Flex>
      </Flex>

      {/* ERROR STATE */}
      {error && (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" mb={6}>
          {error}
        </Center>
      )}

      {/* TABELA DE CONTEÚDO */}
      <Box 
        bg="white" borderRadius="24px" shadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden"
      >
        <Table.Root variant="line" size="lg">
          <Table.Header>
            <Table.Row bg="gray.50/50">
              <Table.ColumnHeader py={4}>Propriedade</Table.ColumnHeader>
              <Table.ColumnHeader py={4}>Valor</Table.ColumnHeader>
              <Table.ColumnHeader py={4}>Status</Table.ColumnHeader>
              <Table.ColumnHeader py={4} textAlign="right">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {properties.map((prop: any) => (
              <Table.Row key={prop.id} _hover={{ bg: "gray.50/50" }}>
                <Table.Cell py={5}>
                  <Flex align="center" gap={4}>
                    <Center w="10" h="10" bg="blue.50" color="blue.600" borderRadius="xl">
                      <LuHouse size={20} />
                    </Center>
                    <Stack gap={0}>
                      <Text fontWeight="bold">{prop.title}</Text>
                      <Text fontSize="xs" color="gray.400">{prop.address}</Text>
                    </Stack>
                  </Flex>
                </Table.Cell>
                
                <Table.Cell fontWeight="bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                </Table.Cell>

                <Table.Cell>
                  <Badge colorPalette={statusMap[prop.status] || "gray"} variant="surface" borderRadius="full">
                    {prop.status}
                  </Badge>
                </Table.Cell>

                <Table.Cell textAlign="right">
                  <Flex justify="flex-end" gap={2}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`edit/${prop.id}`)}
                    >
                      <LuPencil />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      colorPalette="red" 
                      onClick={() => handleDelete(prop.id)}
                      disabled={isSubmitting}
                    >
                      <LuTrash2 />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {properties.length === 0 && !isLoading && (
          <Center p={20} flexDirection="column" gap={2}>
            <Text color="gray.400">Nenhum imóvel cadastrado.</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}