// src/features/marketing/components/FeaturesSection.tsx
"use client";

import { Box, SimpleGrid, Icon, Text, Stack, Heading } from "@chakra-ui/react";
// ✅ LuActivity e LuZap são ícones "raiz" do Lucide, sempre presentes.
import { LuShieldCheck, LuZap, LuActivity, LuClock } from "react-icons/lu";

const features = [
  {
    title: "Gestão Segura",
    desc: "Contratos e documentos protegidos com criptografia de ponta.",
    icon: LuShieldCheck,
  },
  {
    title: "Agilidade Total",
    desc: "Automatize cobranças e vistorias em poucos cliques.",
    icon: LuZap,
  },
  {
    title: "Relatórios Reais",
    desc: "Visualize sua receita e vacância em dashboards intuitivos.",
    icon: LuActivity, 
  },
  {
    title: "Economia de Tempo",
    desc: "Reduza o trabalho manual em até 60% logo no primeiro mês.",
    icon: LuClock,
  },
];

export const FeaturesSection = () => {
  return (
    <Box py={10}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
        {features.map((feature, index) => (
          <Stack 
            key={index} 
            gap={4} 
            p={6} 
            borderRadius="2xl" 
            borderWidth="1px" 
            borderColor="gray.100" 
            _hover={{ shadow: "md", borderColor: "blue.100" }} 
            transition="all 0.2s"
          >
            <Box color="blue.600" bg="blue.50" w="fit-content" p={3} borderRadius="lg">
              <Icon as={feature.icon} boxSize={6} />
            </Box>
            <Heading size="md" fontWeight="bold">{feature.title}</Heading>
            <Text color="gray.600" fontSize="sm">{feature.desc}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
};