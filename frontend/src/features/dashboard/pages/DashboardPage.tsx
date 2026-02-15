import { 
  Box, 
  Grid, 
  Heading, 
  Text, 
  SimpleGrid, 
  Stack 
} from "@chakra-ui/react";
import { 
  LuLayoutDashboard, 
  LuFileText, 
  LuUsers, 
  LuTrendingUp 
} from "react-icons/lu";
import { useAuth } from "../../../core/hooks/useAuth";

const StatCard = ({ title, value, icon, color }: any) => (
  <Box p={6} bg="white" borderRadius="xl" shadow="sm" borderWidth="1px">
    <Stack direction="row" justify="space-between" align="center">
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500">{title}</Text>
        <Heading size="lg" fontWeight="bold">{value}</Heading>
      </Stack>
      <Box p={3} bg={`${color}.50`} borderRadius="lg" color={`${color}.600`}>
        {icon}
      </Box>
    </Stack>
  </Box>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Stack gap={1} mb={8}>
        <Heading size="xl">Olá, {user?.name || "Usuário"} 👋</Heading>
        <Text color="gray.500">Bem-vindo ao painel do ImobiSys.</Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <StatCard title="Imóveis" value="42" color="blue" icon={<LuLayoutDashboard size={24} />} />
        <StatCard title="Contratos" value="18" color="green" icon={<LuFileText size={24} />} />
        <StatCard title="Clientes" value="124" color="purple" icon={<LuUsers size={24} />} />
        <StatCard title="Receita" value="R$ 15.400" color="orange" icon={<LuTrendingUp size={24} />} />
      </SimpleGrid>
    </Box>
  );
}