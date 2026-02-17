"use client"

import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactElement } from "react";

interface StatCardProps {
  title: string;
  count: string | number;
  icon: ReactElement;
  // ✅ Adicionado "gray" para resolver o erro ts(2322) e "red" para atrasos
  color: "blue" | "green" | "purple" | "orange" | "red" | "gray";
}

export const StatCard = ({ title, count, icon, color }: StatCardProps) => {
  // Mapeamento de cores expandido para suportar o estado "Total" (gray)
  const colorSchemes = {
    blue: { bg: "blue.50", text: "blue.600", darkBg: "blue.900/20", darkText: "blue.400" },
    green: { bg: "green.50", text: "green.600", darkBg: "green.900/20", darkText: "green.400" },
    purple: { bg: "purple.50", text: "purple.600", darkBg: "purple.900/20", darkText: "purple.400" },
    orange: { bg: "orange.50", text: "orange.600", darkBg: "orange.900/20", darkText: "orange.400" },
    red: { bg: "red.50", text: "red.600", darkBg: "red.900/20", darkText: "red.400" },
    // ✅ Novo esquema cinza para o card de "Total"
    gray: { bg: "gray.50", text: "gray.600", darkBg: "gray.800/40", darkText: "gray.400" },
  };

  const theme = colorSchemes[color];

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="24px" 
      border="1px solid" 
      borderColor="gray.100"
      _dark={{ bg: "gray.900", borderColor: "gray.800" }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{ transform: "translateY(-5px)", shadow: "xl", borderColor: theme.text }}
    >
      <Flex align="center" gap={4}>
        <Flex 
          w={14} 
          h={14} 
          align="center" 
          justify="center" 
          borderRadius="xl" 
          bg={theme.bg} 
          color={theme.text}
          _dark={{ bg: theme.darkBg, color: theme.darkText }}
        >
          {icon}
        </Flex>

        <Box>
          <Text fontSize="xs" color="gray.500" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
            {title}
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="gray.800" _dark={{ color: "white" }} lineHeight="1">
            {count}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};