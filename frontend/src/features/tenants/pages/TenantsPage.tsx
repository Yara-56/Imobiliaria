"use client";

import { 
  Box, Flex, Heading, Text, Button, SimpleGrid, 
  Badge, Spinner, Center, VStack, Input, IconButton, 
  Container, Table, Stack, Icon 
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuUserPlus, LuSearch, LuTrash2, LuTriangleAlert, 
  LuCircleCheck, LuRocket, LuMail, LuArrowUpRight, 
  LuRefreshCw, LuSparkles, LuGlobe 
} from "react-icons/lu";
import { useTenants } from "../hooks/useTenants";
import { Tenant } from "../types/tenant";

// --- 1. COMPONENTES DE ANIMAÇÃO (Fora da função principal) ---
// Isso resolve o erro de tipagem e limpa o código
const MotionDiv = motion.create("div");

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.1, duration: 0.4 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// --- 2. COMPONENTE PRINCIPAL ---
export default function TenantsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const { 
    tenants, 
    isLoading, 
    isFetching, 
    refetch, 
    deleteTenant 
  } = useTenants();

  const filteredTenants = useMemo(() => {
    return (tenants as Tenant[] || []).filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [tenants, search]);

  const stats = useMemo(() => ({
    total: tenants.length,
    active: tenants.filter(t => t.status === "ACTIVE").length,
    suspended: tenants.filter(t => t.status === "SUSPENDED").length
  }), [tenants]);

  if (isLoading) return (
    <Center h="100vh" bg="gray.50">
      <VStack gap={4}>
        <Spinner size="xl" color="blue.600" />
        <Text fontWeight="bold" color="gray.400" fontSize="xs" letterSpacing="widest">SINCRONIZANDO DATA-CENTER</Text>
      </VStack>
    </Center>
  );

  return (
    <Box bg="#F8FAFC" minH="100vh">
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Container maxW="full" p={{ base: 4, md: 8, lg: 12 }}>
          
          {/* HEADER */}
          <Stack direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }} mb={10} gap={6}>
            <VStack align="start" gap={1}>
              <Flex align="center" gap={2}>
                <Heading size="3xl" fontWeight="900" letterSpacing="-2px" color="slate.900">
                  Infraestrutura
                </Heading>
                <Icon as={LuSparkles} color="blue.400" fontSize="24px" />
              </Flex>
              <Text color="slate.500" fontWeight="medium">Gerencie locatários e provisionamento de instâncias.</Text>
            </VStack>

            <Stack direction="row" gap={3} w={{ base: "full", md: "auto" }}>
              <IconButton 
                variant="outline" bg="white" onClick={() => refetch()} 
                loading={isFetching} aria-label="Refresh" borderRadius="xl"
              >
                <LuRefreshCw />
              </IconButton>
              <Button 
                colorPalette="blue" size="lg" px={8} borderRadius="2xl"
                onClick={() => navigate("/admin/tenants/new")}
                _hover={{ transform: "translateY(-2px)" }}
              >
                <LuUserPlus /> <Text ml={2}>Nova Instância</Text>
              </Button>
            </Stack>
          </Stack>

          {/* DASHBOARD CARDS */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
            <StatCard label="Ativos" value={stats.active} icon={LuCircleCheck} color="green" />
            <StatCard label="Total Nodes" value={stats.total} icon={LuRocket} color="purple" />
            <StatCard label="Alertas" value={stats.suspended} icon={LuTriangleAlert} color="orange" />
          </SimpleGrid>

          {/* LISTA DE TENANTS */}
          <MotionDiv variants={itemVariants}>
            <Box bg="white" borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
              <Flex p={6} bg="gray.50/30" justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
                <Box position="relative" w={{ base: "full", md: "450px" }}>
                  <Input 
                    placeholder="Buscar por slug ou e-mail..." 
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    bg="white" borderRadius="xl" pl="12" h="12"
                  />
                  <Center position="absolute" left="4" top="50%" transform="translateY(-50%)" color="gray.400">
                    <LuSearch size={18} />
                  </Center>
                </Box>
                <Badge colorPalette="blue" variant="subtle" px={4} py={1} borderRadius="lg">
                  {filteredTenants.length} NODES IDENTIFICADOS
                </Badge>
              </Flex>

              <Box overflowX="auto">
                <Table.Root size="lg" variant="line">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader py={5}>ORGANIZAÇÃO</Table.ColumnHeader>
                      <Table.ColumnHeader py={5}>PLANO</Table.ColumnHeader>
                      <Table.ColumnHeader py={5}>STATUS</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right" py={5}>AÇÕES</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <AnimatePresence mode="popLayout">
                      {filteredTenants.length === 0 ? (
                        <EmptyState />
                      ) : (
                        filteredTenants.map((t) => (
                          <Table.Row key={t._id} _hover={{ bg: "blue.50/5" }}>
                            <Table.Cell py={5}>
                              <Flex align="center" gap={4}>
                                <Center w="10" h="10" bg="slate.900" color="white" borderRadius="xl" fontWeight="900">
                                  {t.name.charAt(0)}
                                </Center>
                                <VStack align="start" gap={0}>
                                  <Text fontWeight="800" color="slate.800">{t.name}</Text>
                                  <Flex align="center" gap={1} fontSize="xs" color="gray.500">
                                     <LuMail size={12} /> {t.email}
                                  </Flex>
                                </VStack>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge colorPalette="purple" variant="subtle">{t.plan}</Badge>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge colorPalette={t.status === "ACTIVE" ? "green" : "red"} variant="solid" borderRadius="full">
                                {t.status}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              <Flex justify="flex-end" gap={2}>
                                <IconButton size="sm" variant="subtle" colorPalette="blue" onClick={() => navigate(`/admin/tenants/edit/${t._id}`)}>
                                  <LuArrowUpRight />
                                </IconButton>
                                <IconButton size="sm" variant="ghost" colorPalette="red" onClick={() => deleteTenant(t._id)}>
                                  <LuTrash2 />
                                </IconButton>
                              </Flex>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </AnimatePresence>
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          </MotionDiv>
        </Container>
      </MotionDiv>
    </Box>
  );
}

// --- 3. SUB-COMPONENTES (Limpos e Tipados) ---

function StatCard({ label, value, icon: IconComp, color }: any) {
  return (
    <MotionDiv variants={itemVariants}>
      <Box 
        bg="white" p={6} borderRadius="3xl" border="1px solid" 
        borderColor="gray.100" shadow="sm" transition="all 0.2s"
        _hover={{ shadow: "md", transform: "translateY(-4px)" }}
      >
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={0}>
            <Text fontSize="xs" fontWeight="black" color="gray.400" textTransform="uppercase">{label}</Text>
            <Heading size="2xl" fontWeight="900" color="slate.800" my={1}>{value}</Heading>
          </VStack>
          <Center w="14" h="14" bg={`${color}.50`} color={`${color}.500`} borderRadius="2xl">
            <IconComp size={28} />
          </Center>
        </Flex>
      </Box>
    </MotionDiv>
  );
}

function EmptyState() {
  return (
    <Table.Row>
      <Table.Cell colSpan={4} py={20}>
        <Center flexDirection="column" gap={4}>
          <Icon as={LuGlobe} fontSize="64px" color="gray.100" />
          <VStack gap={1}>
            <Text fontWeight="bold" color="gray.500">Nenhuma instância encontrada</Text>
            <Text fontSize="sm" color="gray.400">Clique em 'Nova Instância' para começar.</Text>
          </VStack>
        </Center>
      </Table.Cell>
    </Table.Row>
  );
}