import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Stack, 
  Flex,
  Badge,
  Table
} from "@chakra-ui/react";
import { 
  LuLayoutDashboard, 
  LuFileText, 
  LuUsers, 
  LuTrendingUp,
  LuArrowUpRight,
  LuPlus
} from "react-icons/lu";
import { useAuth } from "../../../core/hooks/useAuth";

// Componente de Card Refinado
const StatCard = ({ title, value, icon, color, percentage }: any) => (
  <Box 
    p={6} 
    bg="white" 
    borderRadius="20px" 
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0px 2px 12px rgba(0, 0, 0, 0.03)"
    transition="all 0.3s ease"
    _hover={{ transform: "translateY(-4px)", boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.05)" }}
  >
    <Flex justify="space-between" align="start">
      <Stack gap={1}>
        <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wider">
          {title}
        </Text>
        <Heading size="lg" fontWeight="black" color="gray.800">{value}</Heading>
        {percentage && (
          <Flex align="center" gap={1} mt={1}>
            <Badge colorPalette="green" variant="subtle" borderRadius="full" px={2}>
              <Flex align="center" gap={1}>
                <LuArrowUpRight size={12} /> {percentage}
              </Flex>
            </Badge>
            <Text fontSize="xs" color="gray.400">vs mês passado</Text>
          </Flex>
        )}
      </Stack>
      <Box 
        p={3} 
        bg={`${color}.50`} 
        borderRadius="16px" 
        color={`${color}.500`}
        shadow="sm"
      >
        {icon}
      </Box>
    </Flex>
  </Box>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box maxW="1400px" mx="auto">
      {/* Header com Ações Rápidas */}
      <Flex justify="space-between" align="end" mb={10}>
        <Stack gap={1}>
          <Heading size="xl" fontWeight="black" letterSpacing="tight">
            Olá, {user?.name?.split(' ')[0] || "Usuário"} 👋
          </Heading>
          <Text color="gray.500" fontSize="lg">Bem-vindo de volta ao seu centro de controle.</Text>
        </Stack>
        
        {/* Botão de Ação Primária (Visual de Mercado) */}
        <Box 
          as="button" 
          bg="blue.600" 
          color="white" 
          px={6} 
          py={3} 
          borderRadius="xl" 
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ bg: "blue.700" }}
          transition="0.2s"
        >
          <LuPlus size={20} /> Novo Imóvel
        </Box>
      </Flex>

      {/* Grid de Estatísticas Elevado */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} mb={10}>
        <StatCard title="Imóveis Ativos" value="42" color="blue" percentage="12%" icon={<LuLayoutDashboard size={24} />} />
        <StatCard title="Contratos" value="18" color="green" percentage="8%" icon={<LuFileText size={24} />} />
        <StatCard title="Novos Clientes" value="124" color="purple" percentage="24%" icon={<LuUsers size={24} />} />
        <StatCard title="Faturamento" value="R$ 15.400" color="orange" percentage="5%" icon={<LuTrendingUp size={24} />} />
      </SimpleGrid>

      {/* Seção de Conteúdo: Tabela de Atividades Recentes */}
      <Box 
        bg="white" 
        borderRadius="24px" 
        p={8} 
        border="1px solid" 
        borderColor="gray.100"
        boxShadow="0px 4px 25px rgba(0, 0, 0, 0.02)"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" fontWeight="bold">Imóveis Recém Adicionados</Heading>
          <Text color="blue.600" fontWeight="bold" cursor="pointer" fontSize="sm">Ver todos</Text>
        </Flex>

        {/* Tabela Simplificada e Elegante */}
        <Table.Root variant="line" size="lg">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="gray.400">Imóvel</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.400">Valor</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.400" textAlign="right">Ação</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[
              { name: "Cobertura Ipanema", status: "Alugado", price: "R$ 12.500" },
              { name: "Casa Jardim Europa", status: "Venda", price: "R$ 4.200.000" },
              { name: "Studio Vila Olimpia", status: "Disponível", price: "R$ 3.500" },
            ].map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell fontWeight="bold" color="gray.700">{item.name}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={item.status === 'Venda' ? 'orange' : 'blue'} variant="surface">
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell fontWeight="medium">{item.price}</Table.Cell>
                <Table.Cell textAlign="right">
                   <Text color="gray.300" cursor="pointer" _hover={{ color: "blue.500" }}>Gerenciar</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}