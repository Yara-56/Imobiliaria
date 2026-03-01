import { Box, VStack, HStack, Text, Circle, Heading, Icon } from "@chakra-ui/react";
import { LuCircleDot } from "react-icons/lu";

export const RecentActivity = () => (
  <Box bg="gray.800" p={8} borderRadius="3xl" shadow="2xl" color="white">
    <Heading size="md" mb={8} fontWeight="900">Atividades</Heading>
    <VStack align="start" gap={6}>
      {[
        { t: "Novo Contrato", d: "Imóvel #402 cadastrado", time: "2 min atrás", c: "blue.400" },
        { t: "Pagamento", d: "Referente ao Inquilino João", time: "1h atrás", c: "green.400" },
        { t: "Visita Agendada", d: "Rua das Flores, 123", time: "3h atrás", c: "orange.400" }
      ].map((item, i) => (
        <HStack key={i} gap={4} w="full">
          <Circle size="10px" bg={item.c} shadow={`0 0 10px ${item.c}`} />
          <VStack align="start" gap={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm">{item.t}</Text>
            <Text fontSize="xs" color="gray.400">{item.d}</Text>
          </VStack>
          <Text fontSize="10px" color="gray.500">{item.time}</Text>
        </HStack>
      ))}
    </VStack>
  </Box>
);