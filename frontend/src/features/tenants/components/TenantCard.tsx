import { 
  Box, Flex, Heading, Text, Button, SimpleGrid, 
  Spinner, Center, VStack, Input
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuRefreshCcw, LuSearch } from "react-icons/lu";
import { useTenants } from "../hooks/useTenants";
import { TenantCard } from "../components/TenantCard"; // ✅ Importando seu novo Card
import { toaster } from "../../../components/ui/toaster"; // Para a mensagem de delete

export default function TenantsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const { 
    tenants, isLoading, isError, refetch, isFetching, 
    // deleteTenantMutation // ✅ Preparado para a futura exclusão
  } = useTenants();

  const filteredTenants = useMemo(() => {
    const needle = search.toLowerCase();
    return tenants.filter((t) =>
      [t.name, t.email, t.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(needle))
    );
  }, [tenants, search]);

  // Função para lidar com a exclusão (será implementada no useTenants)
  const handleDeleteTenant = (id: string) => {
    if (window.confirm("Deseja realmente remover este inquilino?")) {
      // deleteTenantMutation.mutate(id, {
      //   onSuccess: () => {
      //     toaster.create({ title: "Removido!", description: "Inquilino excluído.", type: "success" });
      //   },
      //   onError: () => {
      //     toaster.create({ title: "Erro", description: "Falha ao excluir inquilino.", type: "error" });
      //   }
      // });
      toaster.create({ title: "Exclusão em desenvolvimento", description: "Lógica de exclusão será integrada.", type: "info" });
    }
  };

  if (isLoading) return (
    <Center h="60vh"><Spinner size="xl" color="blue.500" /></Center>
  );

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="flex-end" mb={10} wrap="wrap" gap={4}>
        <VStack align="start" gap={0}>
          <Heading size="lg" fontWeight="black" color="slate.800">Inquilinos</Heading>
          <Text color="gray.500" fontSize="sm">Gestão de clientes AuraImobi</Text>
        </VStack>
        
        <Flex gap={3} w={{ base: "full", md: "auto" }}>
          <Box position="relative" flex="1">
             <Input 
                placeholder="Buscar inquilino..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="white"
                borderRadius="xl"
                pl="10"
             />
             <Center position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400">
                <LuSearch size={18} />
             </Center>
          </Box>
          <Button variant="outline" onClick={() => refetch()} loading={isFetching} bg="white" borderRadius="xl">
            <LuRefreshCcw />
          </Button>
          <Button colorPalette="blue" borderRadius="xl" onClick={() => navigate("/admin/tenants/novo")}>
            <LuPlus /> Novo
          </Button>
        </Flex>
      </Flex>

      {isError ? (
        <Center p={10} bg="red.50" color="red.500">Erro na conexão (Porta 3001)</Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {filteredTenants.map((tenant) => (
            // ✅ Renderizando o Card de forma limpa
            <TenantCard 
              key={tenant._id} 
              tenant={tenant} 
              onDelete={handleDeleteTenant} 
            />
          ))}
        </SimpleGrid>
      )}

      {filteredTenants.length === 0 && !isLoading && (
        <Center h="200px" flexDir="column" bg="white" border="2px dashed" borderColor="gray.200" borderRadius="3xl">
          <Text color="gray.400">Nenhum inquilino encontrado.</Text>
        </Center>
      )}
    </Box>
  );
}