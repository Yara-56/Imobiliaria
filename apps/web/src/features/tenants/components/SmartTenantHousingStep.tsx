"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Select,
  Badge,
  Skeleton,
  Input,
} from "@chakra-ui/react.js";

import { Home, CreditCard, Search } from "lucide-react";

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

  // Carregar imóveis (com busca)
  async function loadProperties(searchTerm: string) {
    setLoading(true);

    try {
      const endpoint = searchTerm
        ? `/api/properties?status=AVAILABLE&search=${encodeURIComponent(
            searchTerm
          )}`
        : "/api/properties?status=AVAILABLE";

      const res = await fetch(endpoint);
      const json = await res.json();
      setProperties(json);
    } catch (err) {
      console.error("Erro ao carregar imóveis", err);
    } finally {
      setLoading(false);
    }
  }

  // Debounce da busca
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProperties(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Carregar inicial
  useEffect(() => {
    loadProperties("");
  }, []);

  return (
    <VStack align="stretch" spacing={8}>
      <Text fontSize="lg" fontWeight="700">
        Escolha o imóvel que este inquilino irá alugar
      </Text>

      {/* CAMPO DE BUSCA */}
      <Flex
        bg="gray.50"
        p={3}
        borderRadius="12px"
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.200"
      >
        <Search size={18} color="#666" />
        <Input
          placeholder="Pesquisar por rua, número, bairro..."
          variant="unstyled"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fontSize="md"
          fontWeight="500"
        />
      </Flex>

      {/* LISTA DE IMÓVEIS */}
      <VStack spacing={6} align="stretch">
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
                  <Home size={20} />
                  <Text fontWeight="700">{p.title}</Text>
                </Flex>

                {value.propertyId === p.id && (
                  <Badge colorScheme="blue">Selecionado</Badge>
                )}
              </Flex>

              <VStack align="stretch" spacing={1} mt={3}>
                <Text fontSize="sm">{p.address}</Text>
                <Badge colorScheme="green">Disponível</Badge>
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
          <Text fontWeight="700" mb={4}>
            Dados do contrato gerado automaticamente
          </Text>

          <VStack align="stretch" spacing={3}>
            <Text fontSize="sm">
              Valor do aluguel:{" "}
              <b>R$ {value.rentAmount?.toLocaleString("pt-BR")}</b>
            </Text>

            <Text fontSize="sm">
              Dia de vencimento: <b>{value.dueDay}</b>
            </Text>

            <Flex align="center" gap={2} mt={2}>
              <CreditCard size={18} />
              <Text fontWeight="600">Método de pagamento</Text>
            </Flex>

            <Select
              size="lg"
              borderRadius="lg"
              value={value.paymentMethod}
              onChange={(e) =>
                onChange({
                  ...value,
                  paymentMethod: e.target.value,
                })
              }
            >
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CARTAO">Cartão</option>
              <option value="TRANSFERENCIA">Transferência</option>
            </Select>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}