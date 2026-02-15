import { Box, Heading, Button, Table, Badge, Input, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/api"; 

const TenantsPage = () => {
  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await api.get("/tenants");
      // O backend retorna { data: [...] }, por isso acessamos response.data.data
      return response.data.data || []; 
    }
  });

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Stack direction="row" justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" color="gray.800">Inquilinos</Heading>
          <Text color="gray.600">Gerencie todos os locatários ativos no sistema.</Text>
        </Box>
        <Button colorPalette="blue">+ Novo Inquilino</Button>
      </Stack>

      <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
        <Input placeholder="Buscar por nome ou CPF..." mb={6} maxW="400px" variant="outline" />
        
        {/* CORREÇÃO AQUI: variant="line" ou "outline" no v3 */}
        <Table.Root variant="line" interactive>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader color="gray.700">Nome</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700">E-mail</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700">Imóvel</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700">Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" color="gray.700">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tenants?.map((tenant: any) => (
              <Table.Row key={tenant._id} _hover={{ bg: "gray.50" }}>
                <Table.Cell fontWeight="medium" color="gray.800">{tenant.name}</Table.Cell>
                <Table.Cell color="gray.600">{tenant.email}</Table.Cell>
                <Table.Cell color="gray.600">{tenant.propertyAddress || "Não vinculado"}</Table.Cell>
                <Table.Cell>
                  {/* No v3 use colorPalette para o Badge */}
                  <Badge colorPalette={tenant.status === "ATIVO" ? "green" : "red"}>
                    {tenant.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button size="sm" variant="ghost" colorPalette="gray">Editar</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        {isLoading && (
           <Stack mt={8} align="center">
             <Text color="blue.500" fontWeight="bold">Buscando dados no MongoDB...</Text>
           </Stack>
        )}

        {!isLoading && tenants?.length === 0 && (
          <Text mt={8} textAlign="center" color="gray.500">Nenhum inquilino encontrado.</Text>
        )}
      </Box>
    </Box>
  );
};

export default TenantsPage;