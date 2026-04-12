"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  Center,
  Spinner,
} from "@chakra-ui/react"
import { 
  LuPlus, LuHouse, LuKey, LuWrench, LuSparkles 
} from "react-icons/lu"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { http } from "@/lib/http"
import { toaster } from "@/components/ui/toaster.js"

const MotionBox = motion.create(Box)

export default function PropertiesPage() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Busca real na API ao carregar a página
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await http.get("/properties");
        const data = res.data;
        setProperties(Array.isArray(data) ? data : data?.data?.properties || data?.data || []);
      } catch (error) {
        console.error("Erro ao buscar imóveis", error);
        toaster.create({ title: "Erro de conexão", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [])

  if (isLoading) {
    return (
      <Center h="100vh" bg="#FAFAFA">
        <Spinner size="xl" color="blue.500" borderWidth="3px" />
      </Center>
    )
  }

  // Cálculos para os KPIs reais
  const totalProperties = properties.length
  const availableProperties = properties.filter((p: any) => p.status === "AVAILABLE").length
  const rentedProperties = properties.filter((p: any) => p.status === "RENTED").length

  return (
    <Box p={{ base: 4, md: 8 }} w="full" maxW="7xl" mx="auto" minH="100vh" bg="#FAFAFA">
      {/* Cabeçalho */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        justify="space-between" 
        align={{ base: "start", md: "center" }} 
        mb={10}
        gap={4}
      >
        <Stack gap={1}>
          <Flex align="center" gap={3}>
            <Flex w={10} h={10} bg="blue.100" color="blue.600" borderRadius="xl" align="center" justify="center">
              <Icon as={LuHouse} boxSize={5} />
            </Flex>
            <Heading size="lg" fontWeight="900" color="gray.800" letterSpacing="tight">
              Gestão de Imóveis
            </Heading>
          </Flex>
          <Text color="gray.500" fontSize="md" fontWeight="medium">
            Gerencie seu portfólio, disponibilidade e valores de locação.
          </Text>
        </Stack>

        <Button
          bg="blue.600"
          color="white"
          px={8}
          h="48px"
          borderRadius="xl"
          fontWeight="bold"
          boxShadow="0 10px 20px -10px rgba(37, 99, 235, 0.5)"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)", boxShadow: "0 15px 25px -10px rgba(37, 99, 235, 0.6)" }}
          transition="all 0.2s"
          onClick={() => navigate("/admin/properties/new")}
        >
          <Icon as={LuPlus} mr={2} boxSize={5} />
          Novo Imóvel
        </Button>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <KpiCard icon={LuHouse} title="Total no Portfólio" value={totalProperties} color="blue" />
        <KpiCard icon={LuKey} title="Disponíveis (Para Alugar)" value={availableProperties} color="green" />
        <KpiCard icon={LuWrench} title="Alugados ou Manutenção" value={rentedProperties} color="orange" />
      </SimpleGrid>

      {/* Área da Tabela / Lista Vazia */}
      <MotionBox 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="white" 
        p={8} 
        borderRadius="3xl" 
        boxShadow="0 4px 20px rgba(0,0,0,0.03)" 
        border="1px solid" 
        borderColor="gray.100"
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="md" color="gray.800" fontWeight="700">Catálogo Recente</Heading>
        </Flex>
        
        <Center py={16} flexDirection="column" gap={4} bg="gray.50" borderRadius="2xl" border="1px dashed" borderColor="gray.200">
          <Center bg="white" p={4} borderRadius="full" boxShadow="sm">
            <Icon as={LuSparkles} boxSize={8} color="blue.400" />
          </Center>
          <Text color="gray.500" fontWeight="medium">
            {properties.length > 0 ? "Em breve: Tabela de imóveis aqui." : "Nenhum imóvel cadastrado no momento."}
          </Text>
          {properties.length === 0 && (
            <Button variant="outline" mt={2} onClick={() => navigate("/admin/properties/new")}>
              Cadastrar Primeiro Imóvel
            </Button>
          )}
        </Center>
      </MotionBox>
    </Box>
  )
}

function KpiCard({ icon, title, value, color }: any) {
  return (
    <MotionBox whileHover={{ y: -4 }} p={6} bg="white" borderRadius="3xl" boxShadow="0 4px 20px rgba(0,0,0,0.02)" border="1px solid" borderColor="gray.50">
      <Flex justify="space-between" align="start" mb={4}>
        <Flex w={12} h={12} borderRadius="2xl" bg={`${color}.50`} align="center" justify="center" color={`${color}.500`}>
          <Icon as={icon} boxSize={6} />
        </Flex>
      </Flex>
      <Box>
        <Heading size="2xl" color="gray.800" fontWeight="900" letterSpacing="tight">{value}</Heading>
        <Text color="gray.500" fontSize="sm" mt={2} fontWeight="medium">{title}</Text>
      </Box>
    </MotionBox>
  )
}