// src/features/marketing/components/StatsSection.tsx
import { SimpleGrid, Stack, Text, Heading, Box } from "@chakra-ui/react";

const stats = [
  { label: "Imóveis Gerenciados", value: "10k+" },
  { label: "Transações em 2025", value: "R$ 500M" },
  { label: "Imobiliárias ativas", value: "450+" },
  { label: "Tempo economizado", value: "30h/mês" },
];

export const StatsSection = () => (
  <Box bg="blue.600" rounded="3xl" p={{ base: 8, md: 12 }} color="white">
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
      {stats.map((stat) => (
        <Stack key={stat.label} align="center" textAlign="center">
          <Heading size="2xl" fontWeight="extrabold">{stat.value}</Heading>
          <Text fontSize="sm" opacity={0.8} fontWeight="medium" textTransform="uppercase">
            {stat.label}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  </Box>
);