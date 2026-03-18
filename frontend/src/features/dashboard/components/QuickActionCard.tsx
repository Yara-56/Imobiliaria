"use client";

import React from "react";
import { Box, HStack, VStack, Text, Icon, Button } from "@chakra-ui/react";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

interface QuickActionCardProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  onClick: () => void;
  colorScheme?: string;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function QuickActionCard({
  title,
  description,
  icon = LuSparkles,
  onClick,
  colorScheme = "blue",
  disabled = false,
}: QuickActionCardProps) {
  
  const colorMap: Record<string, { bg: string; border: string; iconBg: string; iconColor: string }> = {
    blue: {
      bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      border: "#3b82f6",
      iconBg: "rgba(59, 130, 246, 0.15)",
      iconColor: "#3b82f6",
    },
    green: {
      bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      border: "#10b981",
      iconBg: "rgba(16, 185, 129, 0.15)",
      iconColor: "#10b981",
    },
    purple: {
      bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      border: "#8b5cf6",
      iconBg: "rgba(139, 92, 246, 0.15)",
      iconColor: "#8b5cf6",
    },
    orange: {
      bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      border: "#f59e0b",
      iconBg: "rgba(245, 158, 11, 0.15)",
      iconColor: "#f59e0b",
    },
  };

  const colors = colorMap[colorScheme] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        as="button"
        w="full"
        bg="white"
        borderRadius="2xl"
        p={6}
        border="2px solid"
        borderColor="gray.100"
        position="relative"
        overflow="hidden"
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.6 : 1}
        onClick={disabled ? undefined : onClick}
        transition="all 0.3s"
        _hover={
          disabled
            ? {}
            : {
                borderColor: colors.border,
                boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
              }
        }
        textAlign="left"
      >
        {/* Gradiente de fundo decorativo */}
        <Box
          position="absolute"
          top="-50%"
          right="-20%"
          w="200px"
          h="200px"
          borderRadius="full"
          style={{ background: colors.bg }}
          opacity={0.05}
        />

        <HStack justify="space-between" align="start" position="relative">
          <VStack align="start" gap={2} flex={1}>
            {/* Ícone */}
            <Box
              w={12}
              h={12}
              borderRadius="xl"
              bg={colors.iconBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Icon as={icon} boxSize={6} style={{ color: colors.iconColor }} />
            </Box>

            {/* Título */}
            <Text fontSize="lg" fontWeight="800" color="gray.900" letterSpacing="-0.3px">
              {title}
            </Text>

            {/* Descrição */}
            <Text fontSize="sm" color="gray.500" lineHeight="1.6">
              {description}
            </Text>
          </VStack>

          {/* Seta */}
          <Box
            w={10}
            h={10}
            borderRadius="full"
            bg="gray.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s"
            _groupHover={{
              bg: colors.iconBg,
            }}
          >
            <Icon
              as={LuArrowRight}
              boxSize={5}
              color="gray.400"
              transition="all 0.2s"
              _groupHover={{
                color: colors.iconColor,
                transform: "translateX(2px)",
              }}
            />
          </Box>
        </HStack>

        {/* Badge "Novo" (opcional) */}
        {/* Descomente se quiser adicionar badge
        <Box
          position="absolute"
          top={4}
          right={4}
          bg={colors.bg}
          color="white"
          px={2.5}
          py={1}
          borderRadius="full"
          fontSize="10px"
          fontWeight="800"
          letterSpacing="0.05em"
          textTransform="uppercase"
        >
          Novo
        </Box>
        */}
      </Box>
    </motion.div>
  );
}