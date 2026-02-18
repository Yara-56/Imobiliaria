"use client";

import { 
  Box, Flex, Heading, Text, Button, Table, Badge, 
  IconButton, HStack, VStack, Skeleton, Center, 
  Input, SimpleGrid, Stack, Float
} from "@chakra-ui/react";

// ✅ Ícones estritamente utilizados para evitar ts(6133)
import { 
  LuUserPlus, 
  LuTrash2, 
  LuExternalLink, 
  LuLayoutDashboard, 
  LuUserCheck, 
  LuTriangleAlert, 
  LuSearch, 
  LuUser, 
  LuFileText,
  LuDollarSign,
  LuDatabase
} from "react-icons/lu";

import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants"; 
import { useState, useMemo } from "react";

export default function TenantsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { tenants, isLoading, removeTenant, isRemoving } = useTenants();

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [tenants, search]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`⚠️ AÇÃO IRREVERSÍVEL: Deseja remover o locatário ${name}?`)) {
      setDeletingId(id);
      try {
        await removeTenant(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <Box p={{ base: 6, lg: 10 }} bg="#F8FAFC" minH="100vh">
      
      {/* HEADER ESTRATÉGICO */}
      <Flex justify="space-between" align="flex-end" mb={10} wrap="wrap" gap={6}>
        <VStack align="start" gap={1}>
          <HStack gap={2}>
            <LuLayoutDashboard size={18} color="#2563EB" />
            <Text fontWeight="bold" fontSize="10px" color="blue.600" letterSpacing="widest">
              AURA V3 • GESTÃO IMOBILIÁRIA
            </Text>
          </HStack>
          <Heading size="3xl" fontWeight="900" color="slate.900" letterSpacing="-2px">
            Inquilinos
          </Heading>
        </VStack>

        <HStack gap={4} w={{ base: "full", md: "auto" }}>
          <Box position="relative" flex="1" w={{ md: "350px" }}>
            <Center position="absolute" left="4" h="full" zIndex="1" color="gray.400">
              <LuSearch size={20} />
            </Center>
            <Input 
              placeholder="Nome, unidade ou e-mail..." 
              variant="subtle" 
              bg="white" 
              borderRadius="2xl"
              h="56px"
              ps="12"
              fontSize="sm"
              border="1px solid"
              borderColor="gray.100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Button 
            bg="blue.600" 
            color="white" 
            px={8} 
            h="56px" 
            borderRadius="2xl"
            boxShadow="0 10px 15px -3px rgba(37, 99, 235, 0.2)"
            _hover={{ bg: "blue.700", transform: "translateY(-1px)" }}
            onClick={() => navigate("/admin/tenants/new")}
          >
            <LuUserPlus /> <Text ms={2} fontWeight="bold">Novo Locatário</Text>
          </Button>
        </HStack>
      </Flex>

      {/* MÉTRICAS CHAVE DA IMOBILIÁRIA */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
        <QuickStat 
          label="Locatários Ativos" 
          value={tenants.length} 
          icon={LuUserCheck} 
          trend="Contratos" 
          color="blue" 
        />
        <QuickStat 
          label="Receita Mensal" 
          value="R$ 42.500" 
          icon={LuDollarSign} 
          trend="+5% vs mês ant." 
          color="emerald" 
        />
        <QuickStat 
          label="Pendências" 
          value="03" 
          icon={LuTriangleAlert} 
          trend="Ações Médias" 
          color="orange" 
        />
      </SimpleGrid>

      {/* TABELA DE GESTÃO - O CORAÇÃO DO SISTEMA */}
      <Box 
        bg="white" 
        borderRadius="3xl" 
        border="1px solid" 
        borderColor="gray.100" 
        boxShadow="0 4px 25px rgba(0,0,0,0.03)" 
        overflow="hidden"
      >
        {filteredTenants.length === 0 ? (
          <Center p={20}>
            <VStack gap={3}>
              <LuDatabase size={40} color="#CBD5E1" />
              <Text color="gray.500">Nenhum registro encontrado no sistema.</Text>
            </VStack>
          </Center>
        ) : (
          <Table.Root variant="line" size="lg">
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader py={6} px={10}>INQUILINO / UNIDADE</Table.ColumnHeader>
                <Table.ColumnHeader>TIPO DE PLANO</Table.ColumnHeader>
                <Table.ColumnHeader>CONTRATO</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" px={10}>GERENCIAMENTO</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTenants.map((t) => (
                <Table.Row key={t._id} _hover={{ bg: "blue.50/30" }}>
                  <Table.Cell py={6} px={10}>
                    <HStack gap={4}>
                      <Box position="relative">
                        <Center w="12" h="12" bg="slate.900" color="white" borderRadius="2xl">
                          <LuUser size={24} />
                        </Center>
                        <Float placement="bottom-end" offsetX="1" offsetY="1">
                          <Box 
                            w="3" h="3" 
                            bg={t.status === "ACTIVE" ? "green.500" : "red.500"} 
                            borderRadius="full" 
                            border="2px solid white" 
                          />
                        </Float>
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="800" color="slate.900" fontSize="sm">{t.name}</Text>
                        <Text fontSize="10px" color="blue.500" fontWeight="700">
                          ID: {t.slug.toUpperCase()}
                        </Text>
                      </VStack>
                    </HStack>
                  </Table.Cell>

                  <Table.Cell>
                     <VStack align="start" gap={1}>
                        <Badge variant="subtle" colorPalette="blue" px={2}>{t.plan}</Badge>
                        <HStack gap={1} color="gray.500">
                          <LuFileText size={12} />
                          <Text fontSize="10px" fontWeight="bold">REVISÃO SEMESTRAL</Text>
                        </HStack>
                     </VStack>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge 
                      colorPalette={t.status === "ACTIVE" ? "green" : "red"} 
                      variant="solid" 
                      borderRadius="full"
                      px={3}
                    >
                      {t.status === "ACTIVE" ? "ATIVO" : "INADIMPLENTE"}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell textAlign="right" px={10}>
                    <HStack gap={2} justify="flex-end">
                      <IconButton 
                        variant="ghost" 
                        aria-label="Ver Ficha"
                        onClick={() => navigate(`/admin/tenants/edit/${t._id}`)}
                      >
                        <LuExternalLink size={20} />
                      </IconButton>
                      <IconButton 
                        variant="ghost" 
                        colorPalette="red"
                        aria-label="Remover"
                        loading={isRemoving && deletingId === t._id}
                        onClick={() => handleDelete(t._id, t.name)}
                      >
                        <LuTrash2 size={20} />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  );
}

// COMPONENTE DE MÉTRICA
function QuickStat({ label, value, icon: Icon, trend, color }: any) {
  return (
    <Box bg="white" p={6} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
      <Flex justify="space-between" align="center" mb={4}>
        <Center w="12" h="12" bg={`${color}.50`} color={`${color}.600`} borderRadius="2xl">
          <Icon size={24} />
        </Center>
        <Badge colorPalette={color} variant="subtle" fontSize="10px" px={2}>{trend}</Badge>
      </Flex>
      <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={1}>{label.toUpperCase()}</Text>
      <Text fontSize="3xl" fontWeight="900" color="slate.900">{value}</Text>
    </Box>
  );
}

// CARREGAMENTO
function LoadingState() {
  return (
    <Box p={10} bg="#F8FAFC" minH="100vh">
      <Stack gap={8}>
        <Skeleton h="60px" w="400px" borderRadius="xl" />
        <SimpleGrid columns={3} gap={6}>
          <Skeleton h="140px" borderRadius="3xl" /><Skeleton h="140px" borderRadius="3xl" /><Skeleton h="140px" borderRadius="3xl" />
        </SimpleGrid>
        <Skeleton h="500px" borderRadius="3xl" />
      </Stack>
    </Box>
  );
}