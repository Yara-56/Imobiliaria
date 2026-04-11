"use client";

import React from "react";
import { 
  Box, Heading, Text, VStack, Button, Table, Badge, 
  Center, Spinner, HStack, Icon, Flex, Container 
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../../../../src/core/api/apiResponse";
import { 
  LuFileText, 
  LuSearch,
  LuPlus,
  LuShieldCheck,
  LuArrowLeft,
  LuFilter
} from "react-icons/lu";

// Hooks e Componentes
import { useContracts } from "../hooks/useContracts";
import { ContractSummary } from "../components/ContractSummary";

export default function ContractsListPage() {
  const navigate = useNavigate();

  // ✅ Usando o hook que criamos para manter o código da página limpo
  const { contracts, isLoading } = useContracts();

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner color="blue.500" size="xl" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            SINCRONIZANDO CLUSTER...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="7xl">
        
        {/* NAVEGAÇÃO SUPERIOR */}
        <Flex justify="space-between" align="center" mb={6}>
          <Button 
            variant="plain" 
            size="sm" 
            color="gray.400" 
            onClick={() => navigate("/admin/contracts")}
            _hover={{ color: "blue.600" }}
          >
            <Icon as={LuArrowLeft} mr={2} /> Voltar ao Gerenciador
          </Button>

          <HStack gap={3}>
             <Button variant="outline" borderColor="gray.200" borderRadius="xl" size="sm">
              <Icon as={LuFilter} mr={2} /> Filtrar
            </Button>
          </HStack>
        </Flex>

        {/* HEADER */}
        <Flex justify="space-between" align="flex-end" mb={10} direction={{ base: "column", md: "row" }} gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuShieldCheck} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">IMOBISYS SECURE V3</Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              Lista de Contratos
            </Heading>
            <Text color="gray.500" fontWeight="medium">Monitoramento operacional de ativos locados.</Text>
          </VStack>

          <Button 
            onClick={() => navigate("/admin/contracts/new")}
            bg="blue.600" color="white" h="65px" px={10} borderRadius="2xl" fontWeight="900" shadow="xl"
            _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            gap={3}
          >
            <Icon as={LuPlus} /> NOVO CONTRATO
          </Button>
        </Flex>

        {/* ✅ RESUMO FINANCEIRO */}
        {contracts && <ContractSummary contracts={contracts} />}

        {/* TABELA PREMIUM */}
        <Box 
          bg="white" 
          borderRadius="3xl" 
          border="1px solid" 
          borderColor="gray.100" 
          overflow="hidden"
          shadow="sm"
        >
          <Table.Root variant="line" size="lg">
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader py={6} px={8} fontWeight="black" color="gray.500" fontSize="xs">LOCATÁRIO / IMÓVEL</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="black" color="gray.500" fontSize="xs">VALOR</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="black" color="gray.500" fontSize="xs">STATUS</Table.ColumnHeader>
                <Table.ColumnHeader align="right"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {contracts && contracts.length > 0 ? (
                contracts.map((c: any) => (
                  <Table.Row key={c._id} _hover={{ bg: "gray.50/50" }} transition="0.2s">
                    <Table.Cell py={5} px={8}>
                      <HStack gap={4}>
                        <Center bg="blue.50" p={3} borderRadius="xl" color="blue.600">
                          <LuFileText size={20} />
                        </Center>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="900" color="gray.800">{c.renter?.fullName || "Locatário"}</Text>
                          <Text fontSize="xs" color="gray.400" fontWeight="bold">{c.property?.address}</Text>
                        </VStack>
                      </HStack>
                    </Table.Cell>
                    
                    <Table.Cell fontWeight="900" color="blue.700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.rentAmount || 0)}
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge 
                        colorPalette={c.status === "ACTIVE" ? "green" : "orange"} 
                        variant="subtle" borderRadius="lg" px={3} fontWeight="black"
                      >
                        {c.status}
                      </Badge>
                    </Table.Cell>
                    
                    <Table.Cell align="right" px={8}>
                      <Button variant="ghost" size="sm" colorPalette="blue" fontWeight="black">DETALHES</Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={4} py={20}>
                    <Center w="full">
                      <VStack gap={4}>
                        <Icon as={LuSearch} boxSize={10} color="gray.200" />
                        <Text color="gray.400" fontWeight="bold">Nenhum contrato ativo.</Text>
                      </VStack>
                    </Center>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>

        <Center mt={12} pb={8}>
          <Text fontSize="10px" color="gray.300" fontWeight="black" letterSpacing="4px">AURA IMOBISYS • SECURE INFRASTRUCTURE</Text>
        </Center>
      </Container>
    </Box>
  );
}