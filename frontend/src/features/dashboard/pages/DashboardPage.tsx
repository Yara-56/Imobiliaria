"use client"

import React, { useState } from "react";
import {
  Box, Flex, Grid, HStack, VStack, Text, Heading,
  Button, Icon, Center, SimpleGrid, Circle, Separator,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LuHouse, LuFileText, LuDollarSign, LuArrowRight,
  LuTrendingUp, LuTrendingDown, LuUsers, LuPlus,
  LuArrowUpRight, LuBuilding2, LuTriangleAlert,
  LuCircleCheck, LuClock, LuActivity,
} from "react-icons/lu";
import {
  ResponsiveContainer, AreaChart, Area, Tooltip,
  XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell,
} from "recharts";

import { useDashboard }    from "../hooks/useDashboard";
import { QuickActionCard } from "../components/QuickActionCard";
import { PortfolioHealth } from "../components/PortfolioHealth";
import { RecentActivity }  from "../components/RecentActivity";

// ── Motion ────────────────────────────────────────────────────────────────
const MBox = motion.create(Box);

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

const scaleIn = (delay = 0) => ({
  initial:    { opacity: 0, scale: 0.95 },
  animate:    { opacity: 1, scale: 1    },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

// ── Formatadores ──────────────────────────────────────────────────────────
const fmt = {
  currency: (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v),
  compact: (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v),
  pct: (v: number) => `${v.toFixed(1)}%`,
};

// ── Tooltip do gráfico ────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box bg="gray.900" color="white" px={4} py={3} borderRadius="xl" fontSize="sm"
      boxShadow="0 20px 40px rgba(0,0,0,0.25)">
      <Text color="gray.400" fontSize="xs" mb={1}>{label}</Text>
      <Text fontWeight="800" fontSize="lg">{fmt.compact(payload[0].value ?? 0)}</Text>
    </Box>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────────────
interface KPIProps {
  label:  string;
  value:  string | number;
  sub?:   string;
  trend?: number;
  icon:   React.ElementType;
  accent: string;
  delay?: number;
}

const KPICard = ({ label, value, sub, trend, icon, accent, delay = 0 }: KPIProps) => {
  const up = (trend ?? 0) >= 0;
  return (
    <MBox
      {...scaleIn(delay)}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      position="relative" bg="white" borderRadius="2xl" p={6}
      border="1px solid" borderColor="gray.100" overflow="hidden" cursor="default"
    >
      <Box position="absolute" top="-16px" right="-16px" w="80px" h="80px"
        borderRadius="full" opacity={0.07} style={{ background: accent }} />

      <Flex justify="space-between" align="flex-start">
        <VStack align="start" gap={1} flex={1}>
          <Text fontSize="11px" fontWeight="800" color="gray.400"
            letterSpacing="0.08em" textTransform="uppercase">
            {label}
          </Text>
          <Heading size="xl" fontWeight="900" color="gray.900"
            letterSpacing="-0.5px" lineHeight="1.1">
            {value}
          </Heading>
          {sub && <Text fontSize="xs" color="gray.400" mt={0.5}>{sub}</Text>}
        </VStack>
        <Center w={11} h={11} borderRadius="xl" flexShrink={0}
          style={{ background: `${accent}18`, color: accent }}>
          <Icon as={icon} boxSize={5} />
        </Center>
      </Flex>

      {trend !== undefined && (
        <HStack mt={4} gap={1}>
          <Icon as={up ? LuTrendingUp : LuTrendingDown}
            color={up ? "green.500" : "red.500"} boxSize={3.5} />
          <Text fontSize="xs" fontWeight="700" color={up ? "green.600" : "red.600"}>
            {up ? "+" : ""}{fmt.pct(trend)} vs. mês anterior
          </Text>
        </HStack>
      )}
    </MBox>
  );
};

// ── Página ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"3M" | "6M" | "1A">("6M");

  const {
    isLoading,
    totalReceived,
    totalPending,
    totalOverdue,
    defaultRate,
    totalProperties,
    availableProperties,
    rentedProperties,
    occupancyRate,
    activeContracts,
    totalTenants,
    revenueChart,
  } = useDashboard();

  if (isLoading) return (
    <Flex h="60vh" align="center" justify="center" direction="column" gap={4}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #3b82f6", borderTopColor: "transparent",
        }}
      />
      <Text fontWeight="600" color="gray.400" fontSize="sm">Carregando...</Text>
    </Flex>
  );

  const chartData = revenueChart.length > 0
    ? revenueChart.map((e) => ({ n: e.month, v: e.value }))
    : ["Jan","Fev","Mar","Abr","Mai","Jun"].map((n) => ({ n, v: 0 }));

  const barData = [
    { name: "Alugados",    value: rentedProperties,    fill: "#3b82f6" },
    { name: "Disponíveis", value: availableProperties, fill: "#10b981" },
    { name: "Inadim.",     value: Math.round(totalProperties * defaultRate / 100), fill: "#f59e0b" },
  ];

  const occupancyBars = [
    { label: "Alugados",    pct: totalProperties > 0 ? (rentedProperties / totalProperties) * 100 : 0,    color: "#3b82f6" },
    { label: "Disponíveis", pct: totalProperties > 0 ? (availableProperties / totalProperties) * 100 : 0, color: "#10b981" },
    { label: "Inadimpl.",   pct: defaultRate, color: "#f59e0b" },
  ];

  return (
    <Box minH="100vh" bg="#F7F8FA" p={{ base: 5, md: 8 }}>

      {/* ── HEADER DA PÁGINA ──────────────────────────────────────────── */}
      <MBox {...fadeUp(0)} mb={8}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" gap={0}>
            <Heading size="xl" fontWeight="900" color="gray.900" letterSpacing="-1px">
              Dashboard
            </Heading>
            <Text color="gray.400" fontSize="sm" fontWeight="500">
              Bem-vinda, Yara ·{" "}
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </Text>
          </VStack>

          {/* Botão Novo Inquilino no header */}
          <Button
            colorPalette="blue" borderRadius="xl" fontWeight="700" size="md"
            onClick={() => navigate("/tenants/new")}
          >
            <LuPlus size={16} />
            Novo Inquilino
          </Button>
        </Flex>
      </MBox>

      {/* ── ALERTA INADIMPLÊNCIA ─────────────────────────────────────── */}
      <AnimatePresence>
        {totalOverdue > 0 && (
          <MBox
            key="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            mb={6} p={4} borderRadius="2xl"
            bg="orange.50" border="1px solid" borderColor="orange.200"
          >
            <HStack gap={3}>
              <Icon as={LuTriangleAlert} color="orange.500" boxSize={4} />
              <Text fontSize="sm" fontWeight="600" color="orange.700">
                {fmt.currency(totalOverdue)} em atraso · Inadimplência: {fmt.pct(defaultRate)}
              </Text>
              <Button size="xs" colorPalette="orange" variant="ghost" ml="auto"
                onClick={() => navigate("/financial")}>
                Ver detalhes <LuArrowRight size={12} />
              </Button>
            </HStack>
          </MBox>
        )}
      </AnimatePresence>

      {/* ── KPI CARDS ────────────────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5} mb={7}>
        <KPICard label="Receita Recebida" value={fmt.compact(totalReceived)}
          sub={`${fmt.currency(totalPending)} pendente`}
          trend={8.2} icon={LuDollarSign} accent="#3b82f6" delay={0.05} />
        <KPICard label="Imóveis" value={totalProperties}
          sub={`${rentedProperties} alugados · ${availableProperties} livres`}
          icon={LuBuilding2} accent="#8b5cf6" delay={0.1} />
        <KPICard label="Contratos Ativos" value={activeContracts}
          icon={LuFileText} accent="#06b6d4" delay={0.15} />
        <KPICard label="Inquilinos" value={totalTenants}
          icon={LuUsers} accent="#10b981" delay={0.2} />
      </SimpleGrid>

      {/* ── LINHA PRINCIPAL ──────────────────────────────────────────── */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 360px" }} gap={6} mb={6}>

        {/* Gráfico de receita */}
        <MBox {...fadeUp(0.25)}>
          <Box bg="white" borderRadius="2xl" p={7} border="1px solid" borderColor="gray.100">
            <Flex justify="space-between" align="center" mb={7}>
              <VStack align="start" gap={0}>
                <Text fontSize="11px" fontWeight="800" color="gray.400"
                  letterSpacing="0.08em" textTransform="uppercase">
                  Fluxo de Receita
                </Text>
                <Heading size="lg" fontWeight="900" color="gray.900" letterSpacing="-0.5px">
                  {fmt.currency(totalReceived)}
                </Heading>
              </VStack>
              <HStack gap={1.5}>
                {(["3M", "6M", "1A"] as const).map((p) => (
                  <Button key={p} size="xs" borderRadius="lg" fontWeight="700"
                    variant={period === p ? "solid" : "ghost"}
                    colorPalette={period === p ? "blue" : "gray"}
                    onClick={() => setPeriod(p)}>
                    {p}
                  </Button>
                ))}
              </HStack>
            </Flex>
            <Box h="260px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="n" axisLine={false} tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => fmt.compact(v)} />
                  <Tooltip content={<ChartTooltip />}
                    cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5}
                    fill="url(#grad)" dot={false}
                    activeDot={{ r: 5, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </MBox>

        {/* Portfólio + Atividade */}
        <MBox {...fadeUp(0.3)}>
          <VStack gap={5}>
            <PortfolioHealth />
            <RecentActivity />
          </VStack>
        </MBox>
      </Grid>

      {/* ── LINHA INFERIOR ───────────────────────────────────────────── */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap={6}>

        {/* Bar chart imóveis */}
        <MBox {...fadeUp(0.35)}>
          <Box bg="white" borderRadius="2xl" p={7} border="1px solid" borderColor="gray.100">
            <HStack justify="space-between" mb={6}>
              <Text fontSize="sm" fontWeight="800" color="gray.700">Status dos Imóveis</Text>
              <Icon as={LuHouse} color="gray.300" boxSize={4} />
            </HStack>
            <Box h="160px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </MBox>

        {/* Barras de ocupação */}
        <MBox {...fadeUp(0.4)}>
          <Box bg="white" borderRadius="2xl" p={7} border="1px solid" borderColor="gray.100" h="full">
            <HStack justify="space-between" mb={6}>
              <Text fontSize="sm" fontWeight="800" color="gray.700">Ocupação</Text>
              <Icon as={LuActivity} color="gray.300" boxSize={4} />
            </HStack>
            <VStack gap={4}>
              {occupancyBars.map((row) => (
                <Box key={row.label} w="full">
                  <HStack justify="space-between" mb={1.5}>
                    <Text fontSize="xs" fontWeight="700" color="gray.500">{row.label}</Text>
                    <Text fontSize="xs" fontWeight="800" color="gray.800">{fmt.pct(row.pct)}</Text>
                  </HStack>
                  <Box h="6px" bg="gray.100" borderRadius="full" overflow="hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(row.pct, 100)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      style={{ height: "100%", background: row.color, borderRadius: "inherit" }}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
            <Separator my={5} />
            <HStack justify="space-between">
              <VStack gap={0} align="start">
                <Text fontSize="2xl" fontWeight="900" color="gray.900">{fmt.pct(occupancyRate)}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight="700" textTransform="uppercase">
                  Taxa geral
                </Text>
              </VStack>
              <Icon
                as={occupancyRate >= 80 ? LuCircleCheck : LuClock}
                color={occupancyRate >= 80 ? "green.500" : "orange.400"}
                boxSize={8}
              />
            </HStack>
          </Box>
        </MBox>

        {/* Acesso rápido */}
        <MBox {...fadeUp(0.45)}>
          <VStack gap={4}>
            <QuickActionCard
              title="Novo Inquilino"
              description="Inicie um processo de locação em menos de 2 minutos."
              onClick={() => navigate("/tenants/new")}
            />
            <Box bg="white" borderRadius="2xl" p={6} w="full"
              border="1px solid" borderColor="gray.100">
              <Text fontSize="11px" fontWeight="800" color="gray.400"
                letterSpacing="0.08em" textTransform="uppercase" mb={4}>
                Acesso Rápido
              </Text>
              <VStack gap={1} align="stretch">
                {[
                  { label: "Contratos",  icon: LuFileText,   path: "/contracts"  },
                  { label: "Imóveis",    icon: LuHouse,      path: "/properties" },
                  { label: "Financeiro", icon: LuDollarSign, path: "/financial"  },
                ].map((item) => (
                  <Button key={item.path} variant="ghost" size="sm" borderRadius="lg"
                    color="gray.600" justifyContent="space-between"
                    _hover={{ bg: "gray.50", color: "gray.900" }}
                    onClick={() => navigate(item.path)}>
                    <HStack gap={3}>
                      <Icon as={item.icon} boxSize={4} color="gray.400" />
                      <Text fontWeight="600" fontSize="sm">{item.label}</Text>
                    </HStack>
                    <Icon as={LuArrowUpRight} boxSize={3.5} color="gray.300" />
                  </Button>
                ))}
              </VStack>
            </Box>
          </VStack>
        </MBox>

      </Grid>
    </Box>
  );
}