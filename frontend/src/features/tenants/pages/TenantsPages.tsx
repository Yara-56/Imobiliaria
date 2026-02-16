import { useEffect, useState } from "react";
import { 
  Box, Flex, Heading, Text, Stack, Table, Badge, Button, Spinner, Center, SimpleGrid 
} from "@chakra-ui/react";
import { 
  LuPlus, LuMail, LuPhone, LuUser, LuRefreshCcw, LuUsers, LuUserCheck, LuUserMinus 
} from "react-icons/lu";
import api from "../../../core/api/api"; 

// Interface estrita para o TypeScript
interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyTitle: string; 
  status: "Ativo" | "Inativo" | "Pendente";
}

// Componente de mini-card para estatísticas rápidas
const TenantStat = ({ title, value, icon, color }: any) => (
  <Box p={5} bg="white" borderRadius="24px" border="1px solid" borderColor="gray.100" shadow="sm">
    <Flex align="center" gap={4}>
      <Box p={3} bg={`${color}.50`} color={`${color}.600`} borderRadius="xl">
        {icon}
      </Box>
      <Stack gap={0}>
        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">{title}</Text>
        <Heading size="md" color="gray.800">{value}</Heading>
      </Stack>
    </Flex>
  </Box>
);

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/tenants"); 
      setTenants(response.data);
    } catch (err) {
      console.error("Erro ao buscar inquilinos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
      </Center>
    );
  }

  return (
    <Box>
      {/* Header Profissional */}
      <Flex justify="space-between" align="center" mb={8}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="black" letterSpacing="tight">Inquilinos</Heading>
          <Text color="gray.500">Controle total sobre residentes e contatos de emergência.</Text>
        </Stack>
        <Flex gap={3}>
           <Button variant="outline" onClick={fetchTenants} borderRadius="xl" _hover={{ bg: "gray.50" }}>
             <LuRefreshCcw />
           </Button>
           <Button colorPalette="blue" borderRadius="xl" gap={2} shadow="md" size="lg">
            <LuPlus size={20} /> Novo Inquilino
          </Button>
        </Flex>
      </Flex>

      {/* Cards de Métricas */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <TenantStat 
          title="Total Inquilinos" 
          value={tenants.length} 
          icon={<LuUsers size={20} />} 
          color="blue" 
        />
        <TenantStat 
          title="Contratos Ativos" 
          value={tenants.filter(t => t.status === "Ativo").length} 
          icon={<LuUserCheck size={20} />} 
          color="green" 
        />
        <TenantStat 
          title="Aguardando" 
          value={tenants.filter(t => t.status === "Pendente").length} 
          icon={<LuUserMinus size={20} />} 
          color="orange" 
        />
      </SimpleGrid>

      {error ? (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" border="1px solid" borderColor="red.100">
          <Stack align="center" gap={2}>
            <Text fontWeight="bold">Falha na conexão com o Banco de Dados.</Text>
            <Button size="sm" variant="subtle" colorPalette="red" onClick={fetchTenants}>Tentar Novamente</Button>
          </Stack>
        </Center>
      ) : (
        <Box bg="white" p={6} borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color="gray.400" fontWeight="bold">Inquilino / E-mail</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400" fontWeight="bold">Imóvel Ocupado</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400" fontWeight="bold">Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" color="gray.400" fontWeight="bold">Gerenciar</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tenants.map((tenant) => (
                <Table.Row key={tenant.id} _hover={{ bg: "gray.50/50" }} transition="all 0.2s">
                  <Table.Cell>
                    <Flex align="center" gap={4}>
                      <Box p={2.5} bg="gray.100" color="gray.600" borderRadius="full">
                        <LuUser size={20} />
                      </Box>
                      <Stack gap={0}>
                        <Text fontWeight="bold" color="gray.800" fontSize="md">{tenant.name}</Text>
                        <Flex alignItems="center" gap={1.5} fontSize="xs" color="gray.500">
                          <LuMail size={12} /> {tenant.email}
                        </Flex>
                      </Stack>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Stack gap={0}>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700">{tenant.propertyTitle}</Text>
                      <Flex alignItems="center" gap={1.5} fontSize="xs" color="gray.500">
                        <LuPhone size={12} /> {tenant.phone}
                      </Flex>
                    </Stack>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge 
                      colorPalette={
                        tenant.status === "Ativo" ? "green" : 
                        tenant.status === "Inativo" ? "red" : "orange"
                      } 
                      variant="surface"
                      borderRadius="full"
                      px={3}
                      textTransform="capitalize"
                    >
                      {tenant.status}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    <Button variant="ghost" size="sm" color="blue.600" fontWeight="bold" borderRadius="lg">
                      Perfil Detalhado
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          
          {tenants.length === 0 && (
            <Center p={16} flexDirection="column" gap={3}>
              <Box p={4} bg="gray.50" borderRadius="full" color="gray.300">
                <LuUsers size={40} />
              </Box>
              <Text color="gray.500" fontWeight="medium">Nenhum inquilino cadastrado no sistema.</Text>
            </Center>
          )}
        </Box>
      )}
    </Box>
  );
}