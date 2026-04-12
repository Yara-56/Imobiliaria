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
import { LuPlus, LuUsers, LuUserCheck, LuUserX } from "react-icons/lu"

// Ícones extras para dar um tom mais humano e aconchegante
import { LuSun, LuMoon, LuCoffee, LuSparkles } from "react-icons/lu"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

// IMPORTANTE: Descomente os imports abaixo quando for integrar com seus componentes reais
import { QuickAddTenantModal } from "../components/QuickAddTenantModal"
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal"
import TenantCard from "../components/TenantCard"
import { useTenants } from "../hooks/useTenants"
import type { TenantFormData } from "../schemas/tenant.schema"
import { toaster } from "@/components/ui/toaster.js"

const MotionBox = motion.create(Box)

export default function TenantsDashboardPage() {
  const navigate = useNavigate()
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<{ id: string; name: string } | null>(null)
  const [greeting, setGreeting] = useState({ text: "Olá", icon: LuSun, color: "orange.400" })

  // Efeito para definir a saudação e deixar o sistema mais humano
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting({ text: "Bom dia", icon: LuCoffee, color: "orange.400" })
    else if (hour >= 12 && hour < 18) setGreeting({ text: "Boa tarde", icon: LuSun, color: "yellow.500" })
    else setGreeting({ text: "Boa noite", icon: LuMoon, color: "blue.400" })
  }, [])

  // ✅ BUSCANDO DADOS REAIS DA API
  // O fallback {} evita que o modal quebre se mutations for undefined na montagem
  const { tenants, isLoading, actions, mutations } = (useTenants() as any) || {}

  const handleCreateTenant = async (data: TenantFormData) => {
    try {
      if (actions?.create) {
        const created = await actions.create(data as any)
        setIsNewTenantModalOpen(false) // Fecha após o sucesso
        
        // Notificação de sucesso
        toaster.create({
          title: "Inquilino cadastrado!",
          description: `${data.fullName} já está disponível na sua lista.`,
          type: "success",
        });

        // ✅ Delay para dar tempo de ler o toast antes de ir para os detalhes
        setTimeout(() => {
          if (created && (created._id || created.id)) {
            navigate(`/admin/tenants/edit/${created._id || created.id}`);
          }
        }, 1200);
      }
    } catch (error) {
      console.error(error)
      // Notificação de erro
      toaster.create({
        title: "Falha ao salvar",
        description: "Ocorreu um erro de comunicação com o servidor.",
        type: "error",
      });
    }
  }

  const handleDelete = async () => {
    if (!tenantToDelete) return
    try {
      if (actions?.remove) await actions.remove(tenantToDelete.id)
      setTenantToDelete(null) // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao excluir inquilino:", error)
    }
  }

  if (isLoading) {
    return (
      <Center h="100vh" bg="#FAFAFA">
        <Spinner size="xl" color="blue.500" borderWidth="3px" />
      </Center>
    )
  }

  // ✅ CÁLCULOS DOS NÚMEROS REAIS PARA O DASHBOARD
  const totalTenants = tenants?.length || 0
  const activeTenants = tenants?.filter((t: any) => String(t.status).toUpperCase() === "ACTIVE").length || 0
  const blockedTenants = tenants?.filter((t: any) => ["BLOCKED", "SUSPENDED", "INADIMPLENTE"].includes(String(t.status).toUpperCase())).length || 0

  return (
    <Box p={{ base: 4, md: 8 }} w="full" maxW="7xl" mx="auto" minH="100vh" bg="#FAFAFA">
      {/* Cabeçalho Aconchegante */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        justify="space-between" 
        align={{ base: "start", md: "center" }} 
        mb={10}
        gap={4}
      >
        <Stack gap={1}>
          <Flex align="center" gap={3}>
            <Icon as={greeting.icon} color={greeting.color} boxSize={7} />
            <Heading size="lg" fontWeight="800" color="gray.800" letterSpacing="tight">
              {greeting.text}, Yara!
            </Heading>
          </Flex>
          <Text color="gray.500" fontSize="md" fontWeight="medium">
            Aqui está o resumo dos seus inquilinos hoje. Vamos fechar negócios?
          </Text>
        </Stack>

        <Button
          bg="blue.600"
          color="white"
          px={8}
          h="48px"
          borderRadius="xl"
          fontWeight="bold"
          shadow="0 10px 20px -10px rgba(37, 99, 235, 0.5)"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)", shadow: "0 15px 25px -10px rgba(37, 99, 235, 0.6)" }}
          transition="all 0.2s"
          onClick={() => setIsNewTenantModalOpen(true)} // Abre o Modal aqui!
        >
          <Icon as={LuPlus} mr={2} boxSize={5} />
          Novo Inquilino
        </Button>
      </Flex>

      {/* KPIs Suaves e Amigáveis */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <KpiCard 
          icon={LuUsers} 
          title="Total de Inquilinos" 
          value={totalTenants} 
          trend="Cadastrados na plataforma" 
          color="blue" 
        />
        <KpiCard 
          icon={LuUserCheck} 
          title="Ativos e Regulares" 
          value={activeTenants} 
          trend="Contratos vigentes" 
          color="green" 
        />
        <KpiCard 
          icon={LuUserX} 
          title="Requerem Atenção" 
          value={blockedTenants} 
          trend="Inadimplentes ou bloqueados" 
          color="red" 
        />
      </SimpleGrid>

      {/* Área da Tabela com visual leve */}
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
          <Heading size="md" color="gray.800" fontWeight="700">Inquilinos Recentes</Heading>
          <Button variant="ghost" color="blue.500" size="sm" fontWeight="bold">
            Ver todos
          </Button>
        </Flex>
        
        {/* Lista de Inquilinos com suporte a Exclusão */}
        {tenants && tenants.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {tenants.map((tenant: any) => (
              <TenantCard 
                key={tenant._id || tenant.id} 
                tenant={tenant} 
                onDelete={(id) => setTenantToDelete({ id, name: tenant.fullName })} 
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={16} flexDirection="column" gap={4} bg="gray.50" borderRadius="2xl" border="1px dashed" borderColor="gray.200">
            <Center bg="white" p={4} borderRadius="full" boxShadow="sm">
              <Icon as={LuSparkles} boxSize={8} color="blue.400" />
            </Center>
            <Text color="gray.500" fontWeight="medium">
              Nenhum inquilino cadastrado no momento.
            </Text>
          </Center>
        )}
      </MotionBox>

      {/* Modal seguro contra crash */}
      <QuickAddTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onSubmit={handleCreateTenant}
        isLoading={mutations?.isCreating || false}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={!!tenantToDelete}
        onClose={() => setTenantToDelete(null)}
        onConfirm={handleDelete}
        isLoading={mutations?.isDeleting || false}
        tenantName={tenantToDelete?.name || ""}
      />
    </Box>
  )
}

/* Componente auxiliar de métricas animado e suave */
function KpiCard({ icon, title, value, trend, color }: {
  icon: React.ElementType
  title: string
  value: string | number
  trend: string
  color: string
}) {
  return (
    <MotionBox 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      p={6} 
      bg="white" 
      borderRadius="3xl" 
      boxShadow="0 4px 20px rgba(0,0,0,0.02)" 
      border="1px solid" 
      borderColor="gray.50"
    >
      <Flex justify="space-between" align="start" mb={4}>
        <Flex w={12} h={12} rounded="2xl" bg={`${color}.50`} align="center" justify="center" color={`${color}.500`}>
          <Icon as={icon} boxSize={6} />
        </Flex>
        <Text color="gray.400" fontWeight="semibold" fontSize="sm">{title}</Text>
      </Flex>
      <Box>
        <Heading size="2xl" color="gray.800" fontWeight="900" letterSpacing="tight">{value}</Heading>
        <Text color="gray.500" fontSize="sm" mt={2} fontWeight="medium">{trend}</Text>
      </Box>
    </MotionBox>
  )
}