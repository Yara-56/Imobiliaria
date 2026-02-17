import { 
    Box, Flex, Heading, Text, Button, SimpleGrid, 
    Badge, Spinner, Center, Icon, VStack 
  } from "@chakra-ui/react";
  import { useQuery } from "@tanstack/react-query";
  import { LuPlus, LuUser, LuMail, LuPhone, LuRefreshCcw } from "react-icons/lu";
  import api from "../../../core/api/api.ts";
  
  /**
   * 📝 Interface do Inquilino
   * Garante que o TypeScript entenda os dados vindos do seu Node
   */
  interface Tenant {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    status: "active" | "inactive";
  }
  
  export default function TenantsPage() {
    // 📡 Conexão com o seu backend Node.js na porta 3001
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
      queryKey: ["tenants"],
      queryFn: async () => {
        const response = await api.get("/tenants");
        // O backend retorna os dados dentro de data.data
        return response.data;
      },
    });
  
    if (isLoading) return (
      <Center h="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text color="gray.500" fontWeight="bold">Buscando inquilinos...</Text>
        </VStack>
      </Center>
    );
  
    const tenants: Tenant[] = data?.data || [];
  
    return (
      <Box p={8} bg="gray.50" minH="100vh">
        {/* HEADER DO SISTEMA */}
        <Flex justify="space-between" align="center" mb={10}>
          <VStack align="start" gap={0}>
            <Heading size="lg" fontWeight="black" color="slate.800">Inquilinos</Heading>
            <Text color="gray.500" fontSize="sm">Clientes ativos na AuraImobi</Text>
          </VStack>
          
          <Flex gap={3}>
            {/* ✅ 'loading' substituiu 'isLoading' no Chakra v3 */}
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              loading={isFetching} 
              borderRadius="xl"
            >
              <LuRefreshCcw />
            </Button>
            
            <Button 
              colorPalette="blue" 
              borderRadius="xl" 
              shadow="md"
            >
              <Flex align="center" gap={2}>
                <LuPlus /> Novo Inquilino
              </Flex>
            </Button>
          </Flex>
        </Flex>
  
        {/* GRID DE RESULTADOS */}
        {isError ? (
          <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" border="1px solid" borderColor="red.100">
            Erro ao conectar com o servidor na porta 3001. Verifique seu backend.
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {tenants.map((tenant) => (
              <Box 
                key={tenant._id} 
                bg="white" 
                p={6} 
                borderRadius="24px" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Flex align="center" gap={4} mb={6}>
                  <Center bg="blue.50" color="blue.600" p={3} borderRadius="xl">
                    <Icon as={LuUser} boxSize={6} />
                  </Center>
                  <Box>
                    {/* ✅ 'lineClamp' substituiu 'noOfLines' */}
                    <Text fontWeight="black" fontSize="md" color="slate.800" lineClamp={1}>
                      {tenant.name}
                    </Text>
                    <Badge colorPalette={tenant.status === "active" ? "green" : "red"} variant="surface" borderRadius="full">
                      {tenant.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </Box>
                </Flex>
  
                <VStack align="start" gap={2}>
                  <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                    <Icon as={LuMail} /> 
                    <Text lineClamp={1}>{tenant.email}</Text>
                  </Flex>
                  <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                    <Icon as={LuPhone} /> 
                    <Text>{tenant.phone || "Não informado"}</Text>
                  </Flex>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
  
        {/* FEEDBACK VAZIO */}
        {tenants.length === 0 && !isError && (
          <Center h="250px" flexDir="column" bg="white" border="2px dashed" borderColor="gray.200" borderRadius="3xl">
            <Text color="gray.400" fontWeight="medium">Nenhum inquilino encontrado para sua imobiliária.</Text>
            <Button mt={4} variant="ghost" colorPalette="blue" size="sm">
              Cadastrar primeiro cliente
            </Button>
          </Center>
        )}
      </Box>
    );
  }