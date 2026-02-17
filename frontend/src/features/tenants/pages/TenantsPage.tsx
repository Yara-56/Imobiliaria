import { 
    Box, Flex, Heading, Text, Button, SimpleGrid, 
    Badge, Spinner, Center, Icon, VStack, Input
  } from "@chakra-ui/react";
  import { useState, useMemo } from "react";
  import { useNavigate } from "react-router-dom";
  import { 
    LuPlus, LuUser, LuMail, LuPhone, LuRefreshCcw, 
    LuSearch, LuTrash2, LuEye 
  } from "react-icons/lu";
  import { useTenants } from "../hooks/useTenants";
  import { toaster } from "../../../components/ui/toaster";
  
  export default function TenantsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    
    // ✅ Usando o seu hook completo que já tem isFetching e refetch
    const { 
      tenants, isLoading, isError, refetch, isFetching 
    } = useTenants();
  
    // ✅ Filtro de busca otimizado com useMemo
    const filteredTenants = useMemo(() => {
      const needle = search.toLowerCase();
      return tenants.filter((t) =>
        [t.name, t.email, t.phone]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle))
      );
    }, [tenants, search]);
  
    if (isLoading) return (
      <Center h="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text color="gray.500" fontWeight="bold">Buscando inquilinos...</Text>
        </VStack>
      </Center>
    );
  
    return (
      <Box p={8} bg="gray.50" minH="100vh">
        {/* HEADER E BUSCA */}
        <Flex justify="space-between" align="flex-end" mb={10} wrap="wrap" gap={4}>
          <VStack align="start" gap={0}>
            <Heading size="lg" fontWeight="black" color="slate.800">Inquilinos</Heading>
            <Text color="gray.500" fontSize="sm">Gestão de clientes AuraImobi</Text>
          </VStack>
          
          <Flex gap={3} w={{ base: "full", md: "auto" }}>
            {/* ✅ Busca simplificada sem InputGroup para evitar erros de TS */}
            <Box position="relative" flex="1">
               <Input 
                  placeholder="Buscar por nome, email..." 
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
            
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              loading={isFetching} 
              bg="white" 
              borderRadius="xl"
            >
              <LuRefreshCcw />
            </Button>
            
            <Button 
              colorPalette="blue" 
              borderRadius="xl" 
              shadow="md" 
              onClick={() => navigate("/admin/tenants/novo")}
            >
              <LuPlus /> Novo
            </Button>
          </Flex>
        </Flex>
  
        {/* LISTAGEM EM GRID */}
        {isError ? (
          <Center p={10} bg="red.50" borderRadius="2xl" color="red.500">
            Erro ao conectar com o servidor na porta 3001.
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredTenants.map((tenant) => (
              <Box 
                key={tenant._id} 
                bg="white" p={6} borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="flex-start" mb={6}>
                  <Flex align="center" gap={4}>
                    <Center bg="blue.50" color="blue.600" p={3} borderRadius="xl">
                      <Icon as={LuUser} boxSize={5} />
                    </Center>
                    <Box>
                      <Text fontWeight="black" color="slate.800" lineClamp={1}>{tenant.name}</Text>
                      <Badge colorPalette={tenant.status === "active" ? "green" : "red"} variant="surface" borderRadius="full">
                        {tenant.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </Box>
                  </Flex>
                  
                  <Flex gap={1}>
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        onClick={() => navigate(`/admin/tenants/${tenant._id}`)}
                      >
                        <LuEye />
                      </Button>
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        colorPalette="red"
                        onClick={() => {
                          if(window.confirm("Deseja realmente remover?")) {
                            // Aqui chamaremos a lógica de delete futuramente
                            toaster.create({ title: "Ação em desenvolvimento", type: "info" });
                          }
                        }}
                      >
                        <LuTrash2 />
                      </Button>
                  </Flex>
                </Flex>
  
                <VStack align="start" gap={2} fontSize="sm" color="gray.500">
                  <Flex align="center" gap={2}>
                    <LuMail size={14} /> 
                    <Text lineClamp={1}>{tenant.email}</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <LuPhone size={14} /> 
                    {tenant.phone || "Não informado"}
                  </Flex>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
  
        {/* ESTADO VAZIO */}
        {filteredTenants.length === 0 && !isLoading && (
          <Center h="200px" flexDir="column" bg="white" border="2px dashed" borderColor="gray.200" borderRadius="3xl">
            <Text color="gray.400">Nenhum inquilino encontrado.</Text>
          </Center>
        )}
      </Box>
    );
  }