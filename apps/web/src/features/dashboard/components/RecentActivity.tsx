"use client";

import React from "react";
import { Box, HStack, VStack, Text, Icon, Avatar } from "@chakra-ui/react.js";
import {
  UserPlus,
  FileText,
  DollarSign,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

type ActivityType =
  | "tenant_added"
  | "contract_signed"
  | "payment_received"
  | "property_added"
  | "payment_overdue"
  | "contract_expiring";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "tenant_added",
    title: "Novo inquilino cadastrado",
    description: "Maria Silva foi adicionada ao sistema",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: { name: "Maria Silva" },
  },
  {
    id: "2",
    type: "payment_received",
    title: "Pagamento recebido",
    description: "R$ 2.500,00 - Apto 301, Edifício Central",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "contract_signed",
    title: "Contrato assinado",
    description: "João Santos - Casa no Jardim das Flores",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: { name: "João Santos" },
  },
  {
    id: "4",
    type: "payment_overdue",
    title: "Pagamento em atraso",
    description: "Apto 102 - Vencimento há 3 dias",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "contract_expiring",
    title: "Contrato próximo do vencimento",
    description: "Casa Rua das Acácias - Vence em 15 dias",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

const getActivityIcon = (type: ActivityType) => {
  const iconMap: Record<ActivityType, React.ElementType> = {
    tenant_added: UserPlus,
    contract_signed: FileText,
    payment_received: DollarSign,
    property_added: Home,
    payment_overdue: AlertCircle,
    contract_expiring: Clock,
  };
  return iconMap[type] || CheckCircle2;
};

const getActivityColor = (type: ActivityType) => {
  const colorMap: Record<ActivityType, { bg: string; color: string; border: string }> = {
    tenant_added: {
      bg: "blue.50",
      color: "blue.600",
      border: "blue.200",
    },
    contract_signed: {
      bg: "green.50",
      color: "green.600",
      border: "green.200",
    },
    payment_received: {
      bg: "green.50",
      color: "green.600",
      border: "green.200",
    },
    property_added: {
      bg: "purple.50",
      color: "purple.600",
      border: "purple.200",
    },
    payment_overdue: {
      bg: "red.50",
      color: "red.600",
      border: "red.200",
    },
    contract_expiring: {
      bg: "orange.50",
      color: "orange.600",
      border: "orange.200",
    },
  };
  return colorMap[type] || { bg: "gray.50", color: "gray.600", border: "gray.200" };
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function RecentActivity() {
  const activities = mockActivities;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={6}
      border="1px solid"
      borderColor="gray.100"
      w="full"
      h="full"
    >
      {/* Header */}
      <HStack justify="space-between" mb={5}>
        <VStack align="start" gap={0}>
          <Text
            fontSize="11px"
            fontWeight="800"
            color="gray.400"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            Atividade Recente
          </Text>
          <Text fontSize="lg" fontWeight="800" color="gray.900">
            Últimas {activities.length}
          </Text>
        </VStack>

        {/* Badge "Ao vivo" */}
        <HStack gap={2} px={2.5} py={1} bg="green.50" borderRadius="full" border="1px solid" borderColor="green.200">
          <Box w={2} h={2} borderRadius="full" bg="green.500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: "100%", height: "100%", borderRadius: "inherit", background: "inherit" }}
            />
          </Box>
          <Text fontSize="10px" fontWeight="800" color="green.700" letterSpacing="0.05em">
            AO VIVO
          </Text>
        </HStack>
      </HStack>

      {/* Lista de atividades */}
      <VStack gap={3} align="stretch" maxH="400px" overflowY="auto" pr={2}>
        {activities.map((activity, idx) => {
          const IconComponent = getActivityIcon(activity.type);
          const colors = getActivityColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <HStack
                gap={3}
                p={3}
                borderRadius="xl"
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s"
                cursor="pointer"
              >
                {/* Ícone */}
                <Box
                  w={10}
                  h={10}
                  borderRadius="lg"
                  bg={colors.bg}
                  border="1px solid"
                  borderColor={colors.border}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <IconComponent size={20} color={colors.color} />
                </Box>

                {/* Conteúdo */}
                <VStack align="start" gap={0.5} flex={1} overflow="hidden">
                  <Text fontSize="sm" fontWeight="700" color="gray.900" lineClamp={1}>
                    {activity.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500" lineClamp={1}>
                    {activity.description}
                  </Text>
                  <Text fontSize="10px" color="gray.400" fontWeight="600">
                    {formatRelativeTime(activity.timestamp)}
                  </Text>
                </VStack>

                {/* Avatar (se tiver) */}
                {activity.user && (
                  <Avatar.Root size="sm" flexShrink={0}>
                    {activity.user.avatar ? (
                      <Avatar.Image src={activity.user.avatar} alt={activity.user.name} />
                    ) : (
                      <Avatar.Fallback>
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </Avatar.Fallback>
                    )}
                  </Avatar.Root>
                )}
              </HStack>
            </motion.div>
          );
        })}
      </VStack>

      {/* Footer */}
      <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.100">
        <Text
          fontSize="xs"
          fontWeight="700"
          color="blue.600"
          textAlign="center"
          cursor="pointer"
          _hover={{ color: "blue.700", textDecoration: "underline" }}
          onClick={() => {
            console.log("Ver todas as atividades");
          }}
        >
          Ver todas as atividades →
        </Text>
      </Box>
    </Box>
  );
}