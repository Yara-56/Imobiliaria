"use client";

import { 
  Box, Flex, Heading, Text, Button, Table, Badge, 
  HStack, Input, Center, Spinner, VStack, Icon 
} from "@chakra-ui/react";
import { 
  LuPlus, LuSearch, LuHouse, LuMapPin, LuFilter, 
  LuChevronRight, LuCircleAlert 
} from "react-icons/lu";
import { useState, useEffect, useMemo } from "react";
import api from "@/core/api/api"; // ✅ Usando seu interceptor de autenticação

// ✅ Componentes de UI do Chakra v3
import {
  DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent,
  DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle,
} from "@/components/ui/drawer";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // ✅ Chamada real para o seu backend na porta 3001
      const { data } = await api.get("/properties");
      setProperties(data);
    } catch (err) {
      console.error("Erro ao buscar imóveis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredData = useMemo(() => {
    return properties.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, properties]);

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50/50" minH="100vh">
      <Flex justify="space-between" align="center" mb={10} wrap="wrap" gap={4}>
        <VStack align="start" gap={1}>
          <Heading size="2xl" fontWeight="800" letterSpacing="tight" color="gray.900">
            Imóveis
          </Heading>
          <Text color="gray.500" fontSize="md">
            Gerencie o patrimônio imobiliário da imobiliária.
          </Text>
        </VStack>
        
        <Button 
          bg="blue.600" color="white" h="52px" px={6} borderRadius="16px"
          _hover={{ bg: "blue.700", shadow: "md" }}
          onClick={() => setIsDrawerOpen(true)}
          gap={2}
        >
          <LuPlus size={20} /> <Text fontWeight="bold">Novo Imóvel</Text>
        </Button>
      </Flex>

      <HStack gap={4} mb={8}>
        <Flex flex={1} position="relative" align="center">
          <Box position="absolute" left={4} color="gray.400"><LuSearch size={18} /></Box>
          <Input 
            placeholder="Buscar por título ou endereço..." 
            pl="48px" h="52px" borderRadius="14px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100"
            _focus={{ borderColor: "blue.500", outline: "none" }}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Flex>
        <Button variant="outline" h="52px" w="52px" borderRadius="14px" bg="white"><LuFilter /></Button>
      </HStack>

      {loading ? (
        <Center h="200px"><Spinner color="blue.500" /></Center>
      ) : filteredData.length === 0 ? (
        <Center h="300px" flexDir="column" bg="white" borderRadius="24px" border="1px dashed" borderColor="gray.200">
          <Icon as={LuCircleAlert} boxSize={10} color="gray.300" mb={4} />
          <Text fontWeight="bold" color="gray.600">Nenhum imóvel encontrado no banco.</Text>
        </Center>
      ) : (
        <Box bg="white" borderRadius="24px" shadow="sm" border="1px solid" borderColor="gray.100" overflowX="auto">
          <Table.Root size="lg" variant="line">
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader py={5} px={8} color="gray.400" fontSize="xs" fontWeight="bold">PROPRIEDADE</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400" fontSize="xs" fontWeight="bold">PREÇO</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.400" fontSize="xs" fontWeight="bold">STATUS</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" px={8}></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((p) => (
                <Table.Row key={p._id || p.id} _hover={{ bg: "blue.50/30" }}>
                  <Table.Cell px={8} py={6}>
                    <HStack gap={4}>
                      <Center w="44px" h="44px" bg="blue.50" color="blue.600" borderRadius="12px">
                        <LuHouse size={22} />
                      </Center>
                      <Box>
                        <Text fontWeight="bold" color="gray.800">{p.name}</Text>
                        <HStack gap={1} color="gray.400">
                          {/* ✅ LuMapPin sendo usado aqui para resolver o ts(6133) */}
                          <LuMapPin size={12} />
                          <Text fontSize="xs">{p.address}</Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell fontWeight="bold" color="gray.700">{p.value}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={p.status === "Disponível" ? "green" : "blue"} variant="subtle" px={3}>
                      {p.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right" px={8}>
                    <Button variant="ghost" size="sm"><LuChevronRight color="gray.300" /></Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {/* DRAWER DE CADASTRO */}
      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)} size="md">
        <DrawerBackdrop />
        <DrawerContent borderRadius="24px 0 0 24px">
          <DrawerHeader p={8}>
            <DrawerTitle fontSize="xl" fontWeight="800">Novo Imóvel</DrawerTitle>
          </DrawerHeader>
          <DrawerBody px={8}>
            <VStack gap={6}>
              <Box w="full">
                <Text fontSize="xs" fontWeight="bold" mb={2} color="gray.500">NOME DO IMÓVEL</Text>
                <Input placeholder="Ex: Edifício Central" h="50px" borderRadius="12px" />
              </Box>
              <Box w="full">
                <Text fontSize="xs" fontWeight="bold" mb={2} color="gray.500">VALOR DO ALUGUEL</Text>
                <Input placeholder="R$ 0,00" h="50px" borderRadius="12px" />
              </Box>
            </VStack>
          </DrawerBody>
          <DrawerFooter p={8}>
            <Button variant="ghost" mr={3} onClick={() => setIsDrawerOpen(false)}>Cancelar</Button>
            <Button bg="blue.600" color="white" px={8} borderRadius="12px" onClick={() => setIsDrawerOpen(false)}>Salvar Imóvel</Button>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
}