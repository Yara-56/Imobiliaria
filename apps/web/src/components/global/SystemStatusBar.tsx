// src/components/global/SystemStatusBar.tsx

"use client";

import { Flex, Text, Box } from "@chakra-ui/react";
import { useSystemStatus } from "@/context/SystemStatusContext";

export function SystemStatusBar() {
  const { status } = useSystemStatus();

  const map = {
    online: { color: "green.400", text: "Sistema online" },
    syncing: { color: "blue.400", text: "Sincronizando dados..." },
    warning: { color: "orange.400", text: "Atenção: pagamento atrasado" },
    offline: { color: "red.400", text: "Sistema instável" },
  };

  const current = map[status];

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="36px"
      bg="whiteAlpha.800"
      backdropFilter="blur(10px)"
      borderBottom="1px solid rgba(0,0,0,0.05)"
      align="center"
      px={6}
      zIndex={30}
      justify="space-between"
    >
      <Flex align="center" gap={2}>
        <Box
          w="8px"
          h="8px"
          borderRadius="full"
          bg={current.color}
        />
        <Text fontSize="sm" color="gray.600">
          {current.text}
        </Text>
      </Flex>

      <Text fontSize="xs" color="gray.400">
        Tempo real ativo
      </Text>
    </Flex>
  );
}