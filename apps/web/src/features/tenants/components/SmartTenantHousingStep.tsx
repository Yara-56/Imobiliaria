"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Badge,
  Skeleton,
  Input,
  Button,
} from "@chakra-ui/react";

import { LuHouse, LuCreditCard, LuSearch } from "react-icons/lu";
import { http } from "@/lib/http";

interface Property {
  id: string;
  title: string;
  address: string;
  rentAmount: number;
  dueDay: number;
  paymentMethod: string;
}

interface SmartTenantHousingStepProps {
  value: {
    propertyId?: string;
    rentAmount?: number;
    dueDay?: number;
    paymentMethod?: string;
  };
  onChange: (v: SmartTenantHousingStepProps["value"]) => void;
}

export function SmartTenantHousingStep({
  value,
  onChange,
}: SmartTenantHousingStepProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Controla se a barra de busca deve ser exibida ou se o usuário optou pelo pré-cadastro
  const [showSearch, setShowSearch] = useState(!!value.propertyId);
  useEffect(() => {
    if (value.propertyId) setShowSearch(true);
  }, [value.propertyId]);

  // Carregar imóveis (com busca)
  const loadProperties = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      // O Axios já cuida da base URL (geralmente /api), então ajustamos a rota
      const endpoint = searchTerm
        ? `/properties?status=AVAILABLE&search=${encodeURIComponent(searchTerm)}`
        : "/properties?status=AVAILABLE";

      // Usa a instância autenticada para garantir que o JWT Token seja enviado
      const res = await http.get(endpoint);
      const responseData = res.data;
      
      // Proteção robusta contra múltiplos formatos de API
      setProperties(Array.isArray(responseData) ? responseData : responseData?.data?.properties || responseData?.data || []);
    } catch (err) {
      console.error("[SmartHousingStep] Erro ao carregar imóveis:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce da busca
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProperties(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, loadProperties]);

  return (
    <VStack align="stretch" gap={6}>
      {!showSearch ? (
        <Box
          p={8}
          bg="gray.50"
          borderRadius="2xl"
          border="2px dashed"
          borderColor="gray.200"
          textAlign="center"
          transition="all 0.2s"
          _hover={{ borderColor: "blue.300", bg: "blue.50" }}
        >
          <VStack gap={4}>
            <Flex w={14} h={14} bg="white" borderRadius="full" align="center" justify="center" color="gray.400" boxShadow="sm">
              <LuHouse size={24} />
            </Flex>
            <Box>
              <Text fontWeight="800" color="gray.700" fontSize="lg" mb={2}>
                Pré-cadastro sem Imóvel
              </Text>
              <Text fontSize="sm" color="gray.500" maxW="450px" mx="auto" lineHeight="1.6">
                Você pode salvar este inquilino agora e escolher o imóvel depois. <b>O contrato de locação só será gerado quando um imóvel for associado.</b> Não é obrigatório para o pré-cadastro.
              </Text>
            </Box>
            <Button
              mt={2}
              bg="white"
              color="blue.600"
              border="1px solid"
              borderColor="blue.200"
              _hover={{ bg: "blue.50" }}
              borderRadius="xl"
              fontWeight="bold"
              onClick={() => setShowSearch(true)}
            >
              <LuSearch style={{ marginRight: "8px" }} /> Quero associar um imóvel agora
            </Button>
          </VStack>
        </Box>
      ) : (
        <Box animation="fade-in 0.4s ease-out">
          <Flex justify="space-between" align="center" mb={5} direction={{ base: "column", sm: "row" }} gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest">
              Buscar Imóvel Disponível
            </Text>
            <Button
              size="sm"
              variant="ghost"
              color="red.500"
              _hover={{ bg: "red.50" }}
              onClick={() => {
                setShowSearch(false);
                onChange({ propertyId: undefined, rentAmount: undefined, dueDay: undefined, paymentMethod: undefined });
              }}
            >
              Cancelar e não vincular imóvel
            </Button>
          </Flex>

          {/* CAMPO DE BUSCA */}
          <Flex
            bg="white"
            p={2}
            px={4}
        borderRadius="xl"
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.200"
        _focusWithin={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #60a5fa" }}
        transition="all 0.2s"
      >
        <LuSearch size={18} color="#9ca3af" />
        <Input
          placeholder="Pesquisar por rua, número, bairro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            // Previne que apertar "Enter" na busca tente salvar o inquilino
            if (e.key === "Enter") e.preventDefault();
          }}
          color="gray.800"
          bg="transparent"
          border="none"
          _focus={{ outline: "none", boxShadow: "none" }}
          _placeholder={{ color: "gray.400" }}
          w="full"
          fontSize="md"
          fontWeight="500"
        />
      </Flex>

      {/* LISTA DE IMÓVEIS */}
      <VStack gap={6} align="stretch">
        {loading &&
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} height="160px" borderRadius="20px" />
          ))}

        {!loading &&
          properties.map((p) => (
            <Flex
              key={p.id}
              border="2px solid"
              borderColor={value.propertyId === p.id ? "blue.500" : "gray.200"}
              borderRadius="20px"
              p={6}
              direction="column"
              cursor="pointer"
              _hover={{ borderColor: "blue.500", transform: "scale(1.01)" }}
              transition="0.2s"
              onClick={() =>
                onChange({
                  propertyId: p.id,
                  rentAmount: p.rentAmount,
                  dueDay: p.dueDay,
                  paymentMethod: p.paymentMethod,
                })
              }
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={2}>
                  <LuHouse size={20} />
                  <Text fontWeight="700">{p.title}</Text>
                </Flex>

                {value.propertyId === p.id && (
                  <Badge colorPalette="blue">Selecionado</Badge>
                )}
              </Flex>

              <VStack align="stretch" gap={1} mt={3}>
                <Text fontSize="sm">{p.address}</Text>
                <Badge colorPalette="green" w="max-content">Disponível</Badge>
              </VStack>

              <Text fontWeight="900" fontSize="xl" color="blue.600" mt={3}>
                R$ {p.rentAmount.toLocaleString("pt-BR")}
              </Text>
            </Flex>
          ))}

        {!loading && properties.length === 0 && (
          <Text color="gray.500" textAlign="center">
            Nenhum imóvel encontrado para essa busca.
          </Text>
        )}
      </VStack>

      {/* DETALHES DO CONTRATO */}
      {value.propertyId && (
        <Box
          p={6}
          bg="gray.50"
          borderRadius="20px"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="700" color="blue.700">
              📄 Pré-configuração do Contrato
            </Text>
            <Button 
              type="button" // Essencial para evitar o submit acidental
              size="sm" 
              variant="ghost" 
              colorPalette="red" 
              onClick={() => onChange({ propertyId: undefined, rentAmount: undefined, dueDay: undefined, paymentMethod: undefined })}
            >
              Remover Imóvel
            </Button>
          </Flex>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Ao salvar o inquilino, um contrato será pré-gerado com estes dados para assinatura futura.
          </Text>

      <VStack align="stretch" gap={3}>
            <Text fontSize="sm">
              Valor do aluguel:{" "}
              <b>R$ {value.rentAmount?.toLocaleString("pt-BR")}</b>
            </Text>

            <Text fontSize="sm">
              Dia de vencimento: <b>{value.dueDay}</b>
            </Text>

            <Flex align="center" gap={2} mt={2}>
              <LuCreditCard size={18} />
              <Text fontWeight="600">Método de pagamento</Text>
            </Flex>

            <Box
              as="select"
              w="full"
              h="48px"
              px={4}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              value={value.paymentMethod || "PIX"}
              onChange={(e: any) =>
                onChange({
                  ...value,
                  paymentMethod: e.target.value,
                })
              }
              _focus={{ borderColor: "blue.500", outline: "none", boxShadow: "0 0 0 1px #3182ce" }}
            >
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
              <option value="DINHEIRO">Dinheiro</option>
            </Box>
          </VStack>
        </Box>
      )}
        </Box>
      )}
    </VStack>
  );
}