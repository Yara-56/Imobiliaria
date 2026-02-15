import React, { FC } from "react";
import { Box, SimpleGrid, Text, Heading, Badge, VStack, HStack, Table } from "@chakra-ui/react";
import { Building2, DollarSign, Users } from "lucide-react";

const Dashboard: FC = () => {
  return (
    <Box p={8} bg="gray.950" minH="100vh" color="white">
      <VStack align="start" mb={10}>
        <Heading size="xl">Dashboard Executivo</Heading>
        <Text color="gray.400">ImobiSys — Gestão Imobiliária Moderna</Text>
      </VStack>

      {/* Grid de Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <Box p={6} bg="gray.900" borderRadius="xl" border="1px solid" borderColor="gray.800">
           <HStack justify="space-between">
              <Text color="gray.400">Imóveis Ativos</Text>
              <Building2 size={20} color="#6366F1" />
           </HStack>
           <Text fontSize="2xl" fontWeight="bold" mt={2}>128</Text>
        </Box>
        {/* Repita o Box para Clientes e Faturamento */}
      </SimpleGrid>

      {/* Tabela */}
      <Box p={6} bg="gray.900" borderRadius="xl" border="1px solid" borderColor="gray.800">
        <Heading size="md" mb={4}>Últimos Contratos</Heading>
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Cliente</Table.ColumnHeader>
              <Table.ColumnHeader>Valor</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Maria Silva</Table.Cell>
              <Table.Cell>R$ 450.000</Table.Cell>
              <Table.Cell><Badge colorPalette="green">Ativo</Badge></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default Dashboard;