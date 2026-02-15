// src/features/dashboard/pages/Dashboard.tsx
import React, { FC } from "react";
import { 
  Box, 
  SimpleGrid, 
  Text, 
  Heading, 
  Table, 
  Badge, 
  VStack, 
  HStack 
} from "@chakra-ui/react";
import { Building2, DollarSign, Users } from "lucide-react";

// Definição da interface para os cards de estatísticas
interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}

const Dashboard: FC = () => {
  const stats: StatCard[] = [
    {
      title: "Imóveis Ativos",
      value: "128",
      icon: <Building2 size={24} />,
      iconColor: "blue.500",
    },
    {
      title: "Clientes",
      value: "342",
      icon: <Users size={24} />,
      iconColor: "emerald.500",
    },
    {
      title: "Faturamento Mensal",
      value: "R$ 184.000",
      icon: <DollarSign size={24} />,
      iconColor: "yellow.500",
    },
  ];

  return (
    <Box p={8} bg="slate.950" minH="100vh">
      {/* Header */}
      <VStack align="start" gap={1} mb={10}>
        <Heading size="xl" fontWeight="bold">
          Dashboard Executivo
        </Heading>
        <Text color="slate.400">
          Visão geral estratégica do seu negócio
        </Text>
      </VStack>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            p={6}
            bg="gray.900"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            shadow="lg"
          >
            <HStack justify="space-between" mb={4}>
              <Box color={stat.iconColor}>{stat.icon}</Box>
            </HStack>
            <Text color="whiteAlpha.600" fontSize="sm" fontWeight="medium">
              {stat.title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Table Section */}
      <Box
        p={6}
        bg="gray.900"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="2xl"
        shadow="lg"
      >
        <Heading size="md" mb={6}>
          Últimos Contratos
        </Heading>

        <Box overflowX="auto">
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row borderColor="whiteAlpha.100">
                <Table.ColumnHeader color="whiteAlpha.600">Cliente</Table.ColumnHeader>
                <Table.ColumnHeader color="whiteAlpha.600">Imóvel</Table.ColumnHeader>
                <Table.ColumnHeader color="whiteAlpha.600">Valor</Table.ColumnHeader>
                <Table.ColumnHeader color="whiteAlpha.600">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row borderColor="whiteAlpha.50">
                <Table.Cell py={4}>Maria Silva</Table.Cell>
                <Table.Cell>Apto Centro</Table.Cell>
                <Table.Cell>R$ 450.000</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="green">Ativo</Badge>
                </Table.Cell>
              </Table.Row>

              <Table.Row borderColor="whiteAlpha.50">
                <Table.Cell py={4}>João Pereira</Table.Cell>
                <Table.Cell>Casa Alphaville</Table.Cell>
                <Table.Cell>R$ 1.200.000</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="yellow">Em análise</Badge>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;