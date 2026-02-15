import { Box, Container, SimpleGrid, Heading, Text, Image, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const features = [
  { title: "Gestão de Imóveis", description: "Controle completo dos imóveis disponíveis, aluguéis e contratos.", icon: "/icons/home.svg" },
  { title: "Dashboard Inteligente", description: "Visualize métricas e relatórios em tempo real.", icon: "/icons/dashboard.svg" },
  { title: "Segurança Avançada", description: "Controle de acesso, autenticação JWT e permissões RBAC.", icon: "/icons/security.svg" },
];

export const FeaturesSection = () => {
  return (
    <Container maxW="6xl" py={{ base: 20, md: 32 }}>
      {/* 'gap' substitui 'spacing' */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
        {features.map((f) => (
          <MotionBox
            key={f.title}
            p={6}
            bg="gray.800"
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.100"
            whileHover={{ y: -6, borderColor: "blue.500/50" }}
            transition={{ duration: 0.3 }}
          >
            <Stack gap={4}>
              {/* CORREÇÃO: Removido fallbackSrc que não existe no v3 */}
              <Image 
                src={f.icon} 
                boxSize="48px" 
                alt={f.title}
              />
              <Box>
                <Heading size="md" mb={2} color="white">
                  {f.title}
                </Heading>
                <Text color="gray.400" lineHeight="tall">
                  {f.description}
                </Text>
              </Box>
            </Stack>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Container>
  );
};