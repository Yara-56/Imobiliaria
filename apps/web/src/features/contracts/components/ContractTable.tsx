"use client";

import React from "react";
import { 
  Table, 
  Badge, 
  Text, 
  HStack, 
  VStack, 
  Icon, 
  Box, 
  IconButton, 
  Center, 
  Spinner 
} from "@chakra-ui/react.js";
import { 
  LuFileText, 
  LuEye, 
  LuTrash2, 
  LuSearch, 
  LuCalendar 
} from "react-icons/lu";

import type { Contract } from "../types/contract.types";

interface ContractTableProps {
  contracts: Contract[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isLoading: boolean;
}

export function ContractTable({ 
  contracts, 
  onDelete, 
  isDeleting, 
  isLoading 
}: ContractTableProps) {
  
  // ⏳ 1. ESTADO DE CARREGAMENTO (Loading Profissional)
  if (isLoading) {
    return (
      <Center h="300px" bg="white" borderRadius="3xl" border="1px solid" borderColor="gray.100">
        <VStack gap={4}>
          <Spinner 
            size="xl" 
            color="blue.500" 
            borderWidth="4px" // ✅ Corrigido de 'thickness' para 'borderWidth'
          />
          <Text color="gray.400" fontWeight="bold" fontSize="xs" letterSpacing="widest">
            SINCRONIZANDO CONTRATOS...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 📭 2. ESTADO VAZIO (Empty State Elegante)
  if (!contracts || contracts.length === 0) {
    return (
      <Box 
        bg="white" 
        borderRadius="4xl" 
        p={20} 
        shadow="0 4px 20px rgba(0,0,0,0.02)" 
        border="1px solid" 
        borderColor="gray.100"
      >
        <Center>
          <VStack gap={6}>
            <Center bg="gray.50" p={8} borderRadius="full">
              <Icon as={LuSearch} boxSize={12} color="gray.200" />
            </Center>
            <VStack gap={1} align="center">
              <Text color="gray.800" fontWeight="900" fontSize="xl">
                Nenhum contrato ativo
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                O cluster imobiliário está limpo. Comece gerando <br /> 
                um novo instrumento para popular a base.
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Box>
    );
  }

  // 📋 3. TABELA DE DADOS (Visual Aura v3)
  return (
    <Box 
      bg="white" 
      borderRadius="3xl" 
      p={6} 
      shadow="0 4px 20px rgba(0,0,0,0.02)" 
      border="1px solid" 
      borderColor="gray.100" 
      overflow="hidden"
    >
      <Table.Root variant="line" size="lg">
        <Table.Header bg="gray.50/50">
          <Table.Row>
            <Table.ColumnHeader py={6} px={8} fontWeight="900" color="gray.500" fontSize="xs" letterSpacing="widest">
              LOCATÁRIO / IMÓVEL
            </Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="900" color="gray.500" fontSize="xs" letterSpacing="widest">
              MENSALIDADE
            </Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="900" color="gray.500" fontSize="xs" letterSpacing="widest">
              STATUS
            </Table.ColumnHeader>
            <Table.ColumnHeader align="right"></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {contracts.map((c) => (
            <Table.Row key={c._id} _hover={{ bg: "gray.50/40" }} transition="all 0.2s">
              
              {/* COLUNA: LOCATÁRIO */}
              <Table.Cell py={5} px={8}>
                <HStack gap={4}>
                  <Center bg="blue.50" p={3} borderRadius="xl" color="blue.600">
                    <LuFileText size={20} />
                  </Center>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="900" color="gray.800">
                      {c.renter?.fullName || "Locatário"}
                    </Text>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold">
                      {c.property?.address || "Endereço não informado"}
                    </Text>
                  </VStack>
                </HStack>
              </Table.Cell>

              {/* COLUNA: VALOR */}
              <Table.Cell fontWeight="900" color="blue.700">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(c.rentAmount)}
              </Table.Cell>

              {/* COLUNA: STATUS */}
              <Table.Cell>
                <Badge 
                  colorPalette={c.status === "ACTIVE" ? "green" : "orange"} 
                  variant="subtle" 
                  px={3} 
                  borderRadius="md"
                  fontWeight="black"
                >
                  {c.status}
                </Badge>
              </Table.Cell>

              {/* COLUNA: AÇÕES */}
              <Table.Cell align="right" px={8}>
                <HStack gap={2} justify="end">
                  <IconButton 
                    variant="ghost" 
                    color="gray.400" 
                    _hover={{ color: "blue.600", bg: "blue.50" }} 
                    aria-label="Ver detalhes"
                  >
                    <LuEye size={20} />
                  </IconButton>
                  
                  <IconButton 
                    variant="ghost" 
                    color="gray.400" 
                    loading={isDeleting}
                    _hover={{ color: "red.600", bg: "red.50" }}
                    onClick={() => onDelete(c._id)}
                    aria-label="Deletar contrato"
                  >
                    <LuTrash2 size={20} />
                  </IconButton>
                </HStack>
              </Table.Cell>

            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}