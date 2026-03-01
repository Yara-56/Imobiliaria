"use client";

import { Box, Heading, Text, VStack, Button, Table, Badge, Center, Spinner, HStack, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import api from "@/core/api/api";
import { LuFileText, LuPlus, LuCircleCheck, LuTriangleAlert } from "react-icons/lu";

export default function ContractsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const response = await api.get("/contracts");
      return response.data?.data?.contracts || [];
    }
  });

  if (isLoading) return <Center h="60vh"><Spinner color="blue.500" size="xl" /></Center>;

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack align="start" gap={1} mb={10}>
        <Heading size="xl" fontWeight="900">Gestão de Contratos</Heading>
        <Text color="gray.500">Administração de vigências para a imobiliária.</Text>
      </VStack>

      <Box bg="white" borderRadius="3xl" border="1px solid" borderColor="gray.100" overflow="hidden">
        <Table.Root variant="line">
          <Table.Header bg="gray.50/50">
            <Table.Row>
              <Table.ColumnHeader py={6} px={8}>Locatário / Imóvel</Table.ColumnHeader>
              <Table.ColumnHeader>Valor</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.map((c: any) => (
              <Table.Row key={c._id}>
                <Table.Cell py={5} px={8}>
                  <Text fontWeight="bold">{c.landlordName}</Text>
                  <Text fontSize="xs" color="gray.500">{c.propertyAddress}</Text>
                </Table.Cell>
                <Table.Cell fontWeight="bold">R$ {c.rentAmount?.toLocaleString()}</Table.Cell>
                <Table.Cell><Badge colorPalette="green">{c.status}</Badge></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}