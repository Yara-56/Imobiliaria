"use client";

import React, { useState } from "react";
import {
  Box, Flex, Grid, HStack, VStack, Text, Heading,
  Button, Icon, Center, SimpleGrid, Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  LuHouse, LuFileText, LuDollarSign,
  LuTrendingUp, LuTrendingDown, LuUsers,
  LuArrowUpRight, LuBuilding2, LuTriangleAlert,
  LuCircleCheck, LuClock, LuActivity, LuUserPlus,
} from "react-icons/lu";

import {
  ResponsiveContainer, AreaChart, Area, Tooltip,
  XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";
import { useTenants } from "../../tenants/hooks/useTenants";

import { PortfolioHealth } from "../components/PortfolioHealth";
import { RecentActivity } from "../components/RecentActivity";
import { QuickAddTenantModal } from "../components/QuickAddTenantModal";

// ─────────────────────────────────────────────────────────────
// 🎬 Motion Setup
// ─────────────────────────────────────────────────────────────
const MBox = motion(Box);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

// ─────────────────────────────────────────────────────────────
// 💰 Formatadores
// ─────────────────────────────────────────────────────────────
const fmt = {
  currency: (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v),

  compact: (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
    }).format(v),

  pct: (v: number) => `${v.toFixed(1)}%`,
};

// ─────────────────────────────────────────────────────────────
// 📊 Tooltip
// ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <Box bg="gray.900" color="white" px={4} py={2} borderRadius="lg">
      <Text fontSize="xs">{label}</Text>
      <Text fontWeight="bold">{fmt.compact(payload[0].value)}</Text>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// 📦 KPI Card
// ─────────────────────────────────────────────────────────────
const KPICard = ({ label, value, trend, icon }: any) => {
  const up = (trend ?? 0) >= 0;

  return (
    <MBox {...fadeUp()}>
      <Box bg="white" p={5} borderRadius="xl" border="1px solid #eee">
        <Flex justify="space-between">
          <VStack align="start">
            <Text fontSize="xs" color="gray.400">{label}</Text>
            <Heading size="md">{value}</Heading>
          </VStack>

          <Center>
            <Icon as={icon} boxSize={5} />
          </Center>
        </Flex>

        {trend !== undefined && (
          <HStack mt={3}>
            <Icon as={up ? LuTrendingUp : LuTrendingDown} />
            <Text fontSize="xs">{fmt.pct(trend)}</Text>
          </HStack>
        )}
      </Box>
    </MBox>
  );
};

// ─────────────────────────────────────────────────────────────
// 🚀 PAGE
// ─────────────────────────────────────────────────────────────
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

  const { actions } = useTenants();

  // ── Loading
  if (isLoading) {
    return (
      <Flex h="60vh" align="center" justify="center">
        <Text>Carregando...</Text>
      </Flex>
    );
  }

  // ── Data
  const chartData = revenueChart?.map((e) => ({
    n: e.month,
    v: e.value,
  })) ?? [];

  const barData = [
    { name: "Alugados", value: rentedProperties, fill: "#3b82f6" },
    { name: "Disponíveis", value: availableProperties, fill: "#10b981" },
  ];

  return (
    <Box p={6} bg="#F7F8FA" minH="100vh">

      {/* HEADER */}
      <Flex justify="space-between" mb={6}>
        <Heading>Dashboard</Heading>

        <HStack>
          <QuickAddTenantModal onCreate={actions.quickAdd} />

          <Button
            leftIcon={<LuUserPlus />}
            onClick={() => navigate("/tenants/new")}
          >
            Novo
          </Button>
        </HStack>
      </Flex>

      {/* ALERT */}
      <AnimatePresence>
        {totalOverdue > 0 && (
          <MBox {...fadeUp()}>
            <Box bg="orange.100" p={3} borderRadius="lg" mb={4}>
              <HStack>
                <Icon as={LuTriangleAlert} />
                <Text>
                  {fmt.currency(totalOverdue)} em atraso
                </Text>
              </HStack>
            </Box>
          </MBox>
        )}
      </AnimatePresence>

      {/* KPIs */}
      <SimpleGrid columns={4} gap={4} mb={6}>
        <KPICard label="Receita" value={fmt.compact(totalReceived)} icon={LuDollarSign} />
        <KPICard label="Imóveis" value={totalProperties} icon={LuBuilding2} />
        <KPICard label="Contratos" value={activeContracts} icon={LuFileText} />
        <KPICard label="Inquilinos" value={totalTenants} icon={LuUsers} />
      </SimpleGrid>

      {/* GRÁFICO */}
      <Grid templateColumns="2fr 1fr" gap={6} mb={6}>

        <Box bg="white" p={6} borderRadius="xl">
          <Heading size="sm" mb={4}>Receita</Heading>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey="v" stroke="#3b82f6" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <VStack>
          <PortfolioHealth />
          <RecentActivity />
        </VStack>
      </Grid>

      {/* BOTTOM */}
      <Grid templateColumns="1fr 1fr 1fr" gap={6}>

        {/* BAR */}
        <Box bg="white" p={6} borderRadius="xl">
          <Heading size="sm" mb={4}>Imóveis</Heading>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* OCUPAÇÃO */}
        <Box bg="white" p={6} borderRadius="xl">
          <Heading size="sm">Ocupação</Heading>

          <Text mt={4} fontSize="2xl" fontWeight="bold">
            {fmt.pct(occupancyRate)}
          </Text>

          <Icon
            as={occupancyRate > 80 ? LuCircleCheck : LuClock}
            mt={2}
          />
        </Box>

        {/* QUICK LINKS */}
        <Box bg="white" p={6} borderRadius="xl">
          <Heading size="sm" mb={3}>Acesso</Heading>

          <VStack align="stretch">
            {[
              { label: "Inquilinos", path: "/tenants" },
              { label: "Contratos", path: "/contracts" },
            ].map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                justifyContent="space-between"
                onClick={() => navigate(item.path)}
              >
                {item.label}
                <LuArrowUpRight />
              </Button>
            ))}
          </VStack>

          <Divider mt={4} />
        </Box>

      </Grid>
    </Box>
  );
}