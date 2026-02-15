import React, { useState, useEffect } from "react";
import { 
  Box, SimpleGrid, Text, Heading, Badge, VStack, HStack, Table, Button, Icon, Center, Container, Stack 
} from "@chakra-ui/react";
import { 
  Building2, DollarSign, Users, UserPlus, ArrowUpRight, 
  Search, Filter, Download 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { listTenants, createTenant } from "@/services/tenantService";

// Interface para garantir consistência dos dados
interface Tenant {
  id: string | number;
  name: string;
  property: string;
  value: string;
  status?: string;
}

export default function Dashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carregamento Inicial (Correção de useEffect para não retornar Promise)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await listTenants();
        setTenants(data);
      } catch (error) {
        toast.error("Falha na sincronização com o banco de dados.");
      }
    };
    load();
  }, []);

  // Cadastro de "Um Clique" otimizado com Sonner
  const handleQuickAdd = async () => {
    setIsSyncing(true);
    
    // Dados para o novo registro
    const payload = {
      name: `Inquilino #${tenants.length + 1}`,
      property: "Análise Pendente",
      value: "0"
    };

    const promise = createTenant(payload);

    toast.promise(promise, {
      loading: 'Estabelecendo conexão segura...',
      success: (data: Tenant) => {
        setTenants(prev => [data, ...prev]);
        return 'Sincronizado com o sistema!';
      },
      error: 'Falha na requisição.',
    });
    
    try { 
      await promise; 
    } catch (err) {
      console.error("Erro no cadastro:", err);
    } finally { 
      setIsSyncing(false); 
    }
  };

  return (
    <Box bg="gray.950" minH="100vh" color="white" pb={20} overflowX="hidden">
      <Toaster position="bottom-right" theme="dark" richColors />
      
      {/* Glow de fundo para profundidade visual (Glassmorphism Effect) */}
      <Box 
        position="fixed" 
        top="-10%" 
        right="-5%" 
        w="600px" 
        h="600px" 
        bgGradient="radial(blue.600/10, transparent 70%)" 
        filter="blur(120px)" 
        zIndex={0} 
        pointerEvents="none"
      />

      <Container maxW="7xl" pt={10} zIndex={1} position="relative">
        
        {/* Top Header Profissional */}
        <Stack 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align={{ base: "start", md: "flex-end" }} 
          mb={12} 
          gap={6}
        >
          <VStack align="start" gap={1}>
            <Badge colorPalette="blue" variant="surface" borderRadius="full" px={3} mb={2}>
              Acesso Administrativo
            </Badge>
            <Heading size="3xl" fontWeight="black" letterSpacing="tighter">
              Imobi<Text as="span" color="blue.500">Sys</Text> Executive
            </Heading>
            <Text color="gray.500" fontWeight="medium">Monitoramento de ativos e contratos em tempo real</Text>
          </VStack>

          <HStack gap={3} w={{ base: "full", md: "auto" }}>
            <Button 
              variant="outline" 
              borderColor="whiteAlpha.200" 
              h="48px" 
              flex={{ base: 1, md: "initial" }}
              px={6} 
              borderRadius="xl" 
              _hover={{ bg: "whiteAlpha.100" }}
            >
              <Download size={18} style={{ marginRight: '8px' }} /> Exportar
            </Button>
            <Button 
              onClick={handleQuickAdd} 
              loading={isSyncing}
              colorPalette="blue" 
              h="48px" 
              px={8} 
              flex={{ base: 1, md: "initial" }}
              borderRadius="xl" 
              fontWeight="bold"
              shadow="0 4px 25px rgba(49, 130, 206, 0.4)"
            >
              <UserPlus size={18} style={{ marginRight: '8px' }} /> Quick Add
            </Button>
          </HStack>
        </Stack>

        {/* Módulos de Estatística */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
          <StatModule label="Patrimônio Gerido" value="128" trend="+4" icon={Building2} color="#3B82F6" />
          <StatModule label="Carteira de Inquilinos" value={tenants.length.toString()} trend="+2" icon={Users} color="#8B5CF6" />
          <StatModule label="Receita Operacional" value="R$ 184k" trend="+12.5%" icon={DollarSign} color="#10B981" />
        </SimpleGrid>

        {/* Tabela de Contratos Estilo SaaS */}
        <Box 
          bg="rgba(17, 24, 39, 0.7)" 
          backdropFilter="blur(16px)"
          borderRadius="3xl" 
          borderWidth="1px" 
          borderColor="whiteAlpha.100" 
          shadow="2xl" 
          overflow="hidden"
        >
          <HStack p={6} justify="space-between" borderBottomWidth="1px" borderColor="whiteAlpha.50">
            <HStack gap={4}>
              <Heading size="md" fontWeight="bold">Gestão de Contratos</Heading>
              <Badge variant="subtle" colorPalette="gray">{tenants.length} registros</Badge>
            </HStack>
            <HStack gap={2}>
              <Center p={2} borderRadius="lg" bg="whiteAlpha.100" cursor="pointer" _hover={{ bg: "whiteAlpha.200" }} transition="0.2s">
                <Search size={16} />
              </Center>
              <Center p={2} borderRadius="lg" bg="whiteAlpha.100" cursor="pointer" _hover={{ bg: "whiteAlpha.200" }} transition="0.2s">
                <Filter size={16} />
              </Center>
            </HStack>
          </HStack>
          
          <Box overflowX="auto">
            <Table.Root size="lg">
              <Table.Header bg="whiteAlpha.50">
                <Table.Row borderColor="whiteAlpha.100">
                  <Table.ColumnHeader color="gray.500" fontSize="xs" py={4} letterSpacing="wider">INQUILINO</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.500" fontSize="xs" letterSpacing="wider">STATUS</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.500" fontSize="xs" letterSpacing="wider">DATA</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.500" fontSize="xs" textAlign="right" letterSpacing="wider">AÇÕES</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <AnimatePresence mode="popLayout">
                  {tenants.map((t) => (
                    <Table.Row key={t.id} asChild>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <Table.Cell py={5}>
                          <VStack align="start" gap={0}>
                            <Text fontWeight="bold">{t.name}</Text>
                            <Text fontSize="xs" color="gray.500">{t.property}</Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            colorPalette={t.status === "Ativo" ? "green" : "blue"} 
                            variant="surface" 
                            borderRadius="md"
                            textTransform="none"
                            px={2}
                          >
                            {t.status || "Em Análise"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell color="gray.500" fontSize="sm">
                          {new Date().toLocaleDateString('pt-BR')}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            borderRadius="lg" 
                            _hover={{ bg: "whiteAlpha.200", color: "blue.400" }}
                          >
                            Visualizar <ArrowUpRight size={14} style={{ marginLeft: '6px' }} />
                          </Button>
                        </Table.Cell>
                      </motion.tr>
                    </Table.Row>
                  ))}
                </AnimatePresence>
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Componente de Estatística Refinado com Tipagem
interface StatModuleProps {
  label: string;
  value: string;
  trend: string;
  icon: any;
  color: string;
}

function StatModule({ label, value, trend, icon: IconComponent, color }: StatModuleProps) {
  return (
    <Box asChild>
      <motion.div 
        whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.2)" }}
        style={{ 
          padding: '28px', 
          backgroundColor: '#0f172a', 
          borderRadius: '2rem', 
          border: '1px solid rgba(255,255,255,0.05)', 
          cursor: 'pointer', 
          transition: 'border-color 0.2s',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <HStack justify="space-between" mb={4}>
          <Center bg={`${color}15`} p={3} borderRadius="2xl" border="1px solid" borderColor={`${color}20`}>
            <IconComponent size={22} color={color} />
          </Center>
          <Badge variant="subtle" colorPalette="green" fontSize="2xs" borderRadius="full" px={2}>
            {trend}
          </Badge>
        </HStack>
        <VStack align="start" gap={0}>
          <Text color="gray.500" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
            {label}
          </Text>
          <Text fontSize="4xl" fontWeight="black" letterSpacing="tight">
            {value}
          </Text>
        </VStack>
      </motion.div>
    </Box>
  );
}